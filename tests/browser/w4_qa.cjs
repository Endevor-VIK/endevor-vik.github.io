#!/usr/bin/env node
/* 0524.W4: reproducible before/after capture + scoped browser QA. No product mutation.
 * NODE_PATH=<existing modules> node tests/browser/w4_qa.cjs --root <isolated repo>
 *   --phase before|after --out /tmp/axs-0524-w4-qa/<run> [--engines chromium,firefox,webkit]
 * Primary capture matrix is DPR1, native prefers-reduced-motion. Real motion, no-JS,
 * high-DPR and semantic samples are separately labelled. Only owned run dirs pruned.
 */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), zlib = require('zlib');
const crypto = require('crypto'), cp = require('child_process');
const pw = require('playwright');
const argv = process.argv.slice(2), val = k => argv[argv.indexOf(k) + 1];
const ROOT = path.resolve(argv.includes('--root') ? val('--root') : path.join(__dirname, '../..'));
const PHASE = val('--phase'), OUT = path.resolve(val('--out') || '');
const ENGINES = argv.includes('--engines') ? val('--engines').split(',') : ['chromium', 'firefox', 'webkit'];
const QUICK = argv.includes('--quick'), CAP = !argv.includes('--no-captures');
const EXTEND = argv.includes('--extend-captures');
const BASE_ROOT=argv.includes('--baseline-root')?path.resolve(val('--baseline-root')):null;
const COMPARE=argv.includes('--compare')?path.resolve(val('--compare')):null;
const BASE_MANIFEST=COMPARE?JSON.parse(fs.readFileSync(COMPARE,'utf8')):null;
const VIEWS = [[1920,1080],[1440,900],[1366,768],[1024,768],[768,1024],[390,844],[360,800]];
const RUN_VIEWS=argv.includes('--viewports')?val('--viewports').split(',').map(x=>x.split('x').map(Number)):QUICK?[[390,844]]:VIEWS;
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const RUNNER_HASH=sha(fs.readFileSync(__filename));
const git = (...a) => cp.execFileSync('git', ['-C', ROOT, ...a], { encoding: 'utf8' }).trim();
const report = { phase: PHASE, createdAt: new Date().toISOString(), root: ROOT, sourceSha: git('rev-parse','HEAD'),
  runtime: Object.fromEntries(['index.html','assets','tests'].map(p => [p,git('rev-parse','HEAD:'+p)])),
  runtimeDelta: git('diff','HEAD','--','index.html','assets'), environment: { node: process.version, platform:process.platform,
    playwright:require('playwright/package.json').version, axe:require('axe-core/package.json').version,
    timezone:'Europe/Moscow', server:'gzip text; max-age=600; native MIME; 404 fallback; ephemeral localhost',
    screenshots:'native reduced motion, DPR1 primary; PNG buffer encoded to WebP Pillow q76; no DOM/CSS design injection',
    storage:'loader seen flag only; new context per viewport; no persistent profile/traces/videos' }, checks:[],captures:[],engines:{} };
const source = fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
report.protected = { world:sha(source.slice(source.indexOf('<section id="world"'),source.indexOf('<!-- ============ CHARACTERS'))),
  chars:sha(source.slice(source.indexOf('<section id="chars"'),source.indexOf('<!-- ============ FACTIONS'))),
  mapJs:sha(fs.readFileSync(path.join(ROOT,'assets/js/showcase-v23.js'))),
  screenshots:Object.fromEntries(fs.readdirSync(path.join(ROOT,'assets/showcase/hq')).filter(x=>x.endsWith('-full.webp')).map(x=>[x,sha(fs.readFileSync(path.join(ROOT,'assets/showcase/hq',x)))])) };
let bytes = 0, server, browser;const servers=[];
function record(id, engine, viewport, ok, detail) { report.checks.push({ id,engine,viewport,ok,detail }); if(!ok) process.stdout.write('FAIL '+id+' '+engine+' '+viewport+' '+JSON.stringify(detail).slice(0,400)+'\n'); }
function save() { fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(report,null,2)); }
function retention() {
  if (!['before','after'].includes(PHASE)) throw Error('--phase before|after required');
  const parent=path.dirname(OUT), expected='/tmp/axs-0524-w4-qa';
  if(parent!==expected || !path.basename(OUT).startsWith(PHASE+'-'))throw Error('Output must be '+expected+'/'+PHASE+'-<owned-run>');
  fs.mkdirSync(parent,{recursive:true});
  if(EXTEND){if(!fs.existsSync(path.join(OUT,'.w4-owned')))throw Error('Missing owned run marker');const previous=JSON.parse(fs.readFileSync(path.join(OUT,'manifest.json'),'utf8'));if(previous.sourceSha!==report.sourceSha)throw Error('Extension source SHA mismatch');Object.assign(report,previous);bytes=report.captures.reduce((s,x)=>s+x.bytes,0);if(report.fatal){report.recoveredAttempts=[...(report.recoveredAttempts||[]),{error:report.fatal,reason:'Firefox no-JS document.fonts.ready hung; own browser terminated, no-JS wait corrected before resume'}];delete report.fatal}return}
  const owned=fs.readdirSync(parent).map(n=>path.join(parent,n)).filter(p=>fs.statSync(p).isDirectory()&&fs.existsSync(path.join(p,'.w4-owned'))).sort((a,b)=>fs.statSync(b).mtimeMs-fs.statSync(a).mtimeMs);
  // A frozen referenced BEFORE run counts toward the three-run budget and must
  // survive qualification retries; keep it plus the newest other predecessor.
  const reference=COMPARE?path.dirname(COMPARE):null;
  const keep=new Set(owned.filter(p=>p!==reference).slice(0,reference?1:2));if(reference)keep.add(reference);
  for(const p of owned)if(!keep.has(p)||Date.now()-fs.statSync(p).mtimeMs>14*864e5){if(fs.realpathSync(p)!==p)throw Error('Symlink in retention');if(p===reference)throw Error('Referenced BEFORE older than retention window; preserve evidence before a new run');fs.rmSync(p,{recursive:true,force:false})}
  if(fs.existsSync(OUT))throw Error('Refusing existing output directory');
  fs.mkdirSync(OUT);fs.writeFileSync(path.join(OUT,'.w4-owned'),'0524.W4 QA own transient run\n');
}
async function serve(serveRoot=ROOT) {
 const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.avif':'image/avif','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.ico':'image/x-icon'};
 const gz=new Set(['.html','.css','.js','.json','.svg']);
 return new Promise(resolve=>{server=http.createServer((q,r)=>{let f;try{f=path.resolve(serveRoot,'.'+decodeURIComponent(new URL(q.url,'http://localhost').pathname))}catch(_){r.writeHead(400);return r.end()}
  if(f!==serveRoot&&!f.startsWith(serveRoot+path.sep)){r.writeHead(403);return r.end()}
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');let status=200;
  if(!fs.existsSync(f)){f=path.join(serveRoot,'404.html');status=404}
  const ext=path.extname(f),headers={'Content-Type':types[ext]||'application/octet-stream','Cache-Control':'max-age=600'};
  if(gz.has(ext)&&/gzip/.test(q.headers['accept-encoding']||'')){headers['Content-Encoding']='gzip';headers.Vary='Accept-Encoding';r.writeHead(status,headers);fs.createReadStream(f).pipe(zlib.createGzip()).pipe(r)}
  else{r.writeHead(status,headers);fs.createReadStream(f).pipe(r)}
 }).listen(0,'127.0.0.1',()=>{servers.push(server);resolve('http://127.0.0.1:'+server.address().port+'/')} )});
}
async function context(engine,w,h,{motion='reduce',js=true,dpr=1}={}) {
 const c=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:dpr,hasTouch:w<700,locale:'ru-RU',timezoneId:'Europe/Moscow',colorScheme:'dark',reducedMotion:motion,javaScriptEnabled:js,...(engine==='chromium'?{isMobile:w<700}:{})});
 await c.addInitScript(()=>{try{sessionStorage.setItem('axiom_loader_seen','1')}catch(_){}});
 return c;
}
async function ready(p) {
 await p.evaluate(()=>document.fonts.ready);
 await p.evaluate(async()=>{await Promise.all([...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.width>0}).map(i=>i.decode().catch(()=>{})))});
 await p.waitForTimeout(90);
}
async function scroll(p,sel,offset=0) {
 await p.evaluate(([s,o])=>{const e=document.querySelector(s);if(!e)throw Error('Missing '+s);const chrome=Math.max(...[...document.querySelectorAll('header.top,.show-mobile-nav')].map(x=>{const c=getComputedStyle(x);return c.position==='sticky'&&c.display!=='none'?x.getBoundingClientRect().bottom:0}),0);window.scrollTo({top:e.getBoundingClientRect().top+scrollY-chrome+o,behavior:'instant'})},[sel,offset]);
 await ready(p);
}
async function shot(p,engine,vp,name,selector,offset=0) {
 if(!CAP)return;
 await scroll(p,selector,offset);await p.mouse.move(-20,-20);
 const raw=await p.screenshot({type:'png',animations:'disabled'});
 const data=cp.execFileSync('python3',['-c','import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read()));im.save(sys.stdout.buffer,format="WEBP",quality=76,method=4)'],{input:raw,maxBuffer:4*1024*1024});
 const relative=engine+'/'+vp+'/'+name+'.webp',file=path.join(OUT,relative);
 const old=report.captures.find(x=>x.path===relative);if(old)bytes-=old.bytes;
 bytes+=data.length;if(bytes>48*1024*1024)throw Error('48 MiB capture budget exceeded');
 report.captures=report.captures.filter(x=>x.path!==relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);
 const state=await p.evaluate(sel=>{const r=document.querySelector(sel).getBoundingClientRect();return{scrollY:Math.round(scrollY),selectedTab:document.querySelector('.ax-tab[aria-selected="true"]')?.id,node:document.getElementById('v23-map-id')?.textContent,
  targetBox:{top:r.top,bottom:r.bottom,width:r.width,height:r.height},stickyChrome:[...document.querySelectorAll('header.top,.show-mobile-nav')].filter(x=>getComputedStyle(x).position==='sticky'&&getComputedStyle(x).display!=='none'&&x.getBoundingClientRect().top<=1).reduce((m,x)=>Math.max(m,x.getBoundingClientRect().bottom),0),
  images:[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.width>0}).map(i=>({src:i.currentSrc.replace(location.origin+'/',''),complete:i.complete&&i.naturalWidth>0,width:Math.round(i.getBoundingClientRect().width),height:Math.round(i.getBoundingClientRect().height)}))}},selector);
 record('capture-images-decoded-'+name,engine,vp,state.images.every(x=>x.complete),state.images.filter(x=>!x.complete));
 report.captures.push({engine,viewport:vp,path:relative,sha256:sha(data),bytes:data.length,selector,offset,...state});
}
async function sectionShots(p,e,vp,w,h) {
 for(const [s,n] of [['#world-guide','entry'],['#manifesto','black-sun'],['#modules','what-remains'],['#factions','factions'],['#world','protected-map-full'],['#chars','protected-people-full']]) {
  const height=await p.locator(s).evaluate(x=>x.getBoundingClientRect().height);
  const step=Math.max(250,h-180),pieces=Math.ceil(height/step);
  for(let j=0;j<pieces;j++)await shot(p,e,vp,n+'-'+(j+1),s,j*step);
 }
 for(const [s,n] of [['#world','protected-map'],['.ax-omega','protected-omega'],['#chars','protected-people'],['.axiom-entity','protected-axiom'],['.ax-epilogue','epilogue']])await shot(p,e,vp,n,s);
 for(const n of ['02','03','05']){
  await p.locator('#ax-tab-'+n).click();const panel='#ax-panel-'+n;
  await shot(p,e,vp,'work-'+n+'-closed',panel);
  const panelHeight=await p.locator(panel).evaluate(x=>x.getBoundingClientRect().height),step=Math.max(250,h-180);
  for(let j=1;j<Math.ceil(panelHeight/step);j++)await shot(p,e,vp,'work-'+n+'-closed-'+(j+1),panel,j*step);
  const details=p.locator(panel+' details');
  if(await details.count()){await details.locator('summary').press('Enter');await shot(p,e,vp,'work-'+n+'-open',panel);const height=await details.evaluate(x=>x.getBoundingClientRect().height);for(let j=0;j<Math.ceil(height/step);j++)await shot(p,e,vp,'work-'+n+'-context-'+(j+1),panel+' details',j*step);await details.locator('summary').press('Enter')}
  else if(w<700)await shot(p,e,vp,'work-'+n+'-case',panel,Math.max(200,h-150));
 }
}
async function checks(p,e,vp,w,h) {
 const state=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
  ids:[...document.querySelectorAll('[id]')].map(x=>x.id),anchors:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(id=>id&&!document.getElementById(id)),
  headings:[...document.querySelectorAll('h1,h2,h3')].map(x=>({level:+x.tagName.slice(1),text:x.textContent.trim(),section:x.closest('section')?.id})),
  gallery:{tabs:document.querySelectorAll('.ax-tab').length,panels:document.querySelectorAll('.ax-panel').length,triggers:document.querySelectorAll('.ax-shot-trigger').length},
  canon:[...document.querySelectorAll('.v23-map-node')].map(x=>x.dataset.canonId),
  oldProduct:!!document.querySelector('#modules .modules,#modules .spine-strip'),
  title:document.getElementById('v22-world-title').textContent.trim(),details:[...document.querySelectorAll('#showcase-gallery details')].map(x=>x.closest('.ax-panel').id)}));
 record('document-overflow',e,vp,state.overflow<=1,state.overflow);
 record('anchor-integrity',e,vp,state.anchors.length===0,state.anchors);
 record('unique-ids',e,vp,new Set(state.ids).size===state.ids.length,{total:state.ids.length});
 record('eight-real-screens',e,vp,Object.values(state.gallery).every(x=>x===8),state.gallery);
 record('six-canon-ids',e,vp,state.canon.join()==='02.01,02.02,02.03,02.04,02.05,02.06',state.canon);
 record('narrative-contract',e,vp,PHASE==='before'?state.oldProduct:!state.oldProduct&&/WORLD AFTER/.test(state.title)&&/BLACK SUN/.test(state.title),{oldProduct:state.oldProduct,title:state.title,details:state.details});
 report.engines[e].semantics.push({viewport:vp,headings:state.headings});
 const over=await p.evaluate(()=>[...document.querySelectorAll('#manifesto,#modules,#world,#chars,#factions,#showcase-gallery')].map(x=>({id:x.id,delta:x.scrollWidth-x.clientWidth})).filter(x=>x.delta>1));
 record('section-overflow',e,vp,over.length===0,over);
 if(PHASE==='after')await afterChecks(p,e,vp,w);
 const motion=await p.evaluate(()=>({reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,
  smil:[...document.querySelectorAll('svg')].filter(x=>!x.ownerSVGElement&&x.querySelector('animate,animateTransform,animateMotion')).map(x=>({paused:x.animationsPaused(),time:x.getCurrentTime()}))}));
 record('native-reduced-motion',e,vp,motion.reduced&&motion.smil.every(x=>x.paused),motion);
 // Native keyboard tabs, viewer and focused return; no synthetic click assertion.
 await p.locator('#ax-tab-01').focus();await p.keyboard.press('ArrowRight');await p.keyboard.press('ArrowRight');
 const tab=await p.evaluate(()=>({selected:document.querySelector('.ax-tab[aria-selected="true"]').id,focus:document.activeElement.id}));
 record('gallery-keyboard-select',e,vp,tab.selected==='ax-tab-03'&&tab.focus==='ax-tab-03',tab);
 await p.locator('#ax-panel-03 .ax-shot-trigger').focus();await p.keyboard.press('Enter');
 await p.locator('#showcase-lightbox[open]').waitFor();await p.keyboard.press('KeyZ');await p.waitForTimeout(50);
 const zoom=await p.evaluate(()=>({zoom:document.getElementById('showcase-lightbox').classList.contains('is-zoomed'),src:document.getElementById('showcase-full-image').src.split('/').pop()}));
 record('gallery-1to1',e,vp,zoom.zoom&&zoom.src==='04-chronicle-full.webp',zoom);
 await p.keyboard.press('Escape');
 record('gallery-focus-return',e,vp,await p.locator('#ax-panel-03 .ax-shot-trigger').evaluate(x=>document.activeElement===x),null);
 await scroll(p,'.ax-omega-cta');await p.locator('.ax-omega-cta').focus();await p.keyboard.press('Enter');await p.waitForTimeout(80);
 const omega=await p.evaluate(()=>({id:document.getElementById('v23-map-id').textContent,focus:document.activeElement.dataset.canonId,pressed:document.activeElement.getAttribute('aria-pressed')}));
 record('omega-keyboard-return',e,vp,omega.id==='02.05 / LABORATORY OMEGA-0'&&omega.focus==='02.05'&&omega.pressed==='true',omega);
 for(const id of ['#world-guide','#vision']){
  const nav=w>1080?'.menu':'.show-mobile-nav';await p.locator(nav+' a[href="'+id+'"]').click();await ready(p);
  const geo=await p.evaluate(sel=>{const t=document.querySelector(sel).getBoundingClientRect(),chrome=[...document.querySelectorAll('header.top,.show-mobile-nav')].filter(x=>getComputedStyle(x).position==='sticky'&&getComputedStyle(x).display!=='none'&&x.getBoundingClientRect().top<=1).reduce((m,x)=>Math.max(m,x.getBoundingClientRect().bottom),0);return{top:Math.round(t.top),bottom:Math.round(t.bottom),header:Math.round(chrome),vh:innerHeight}},id==='#world-guide'?'.ax-world-cta':'.v22-bridge:has(+ #vision)');
  record('menu-jump-'+id.slice(1),e,vp,geo.top>=geo.header-1&&geo.bottom<=geo.vh+1,geo);
 }
 if([390,1440].includes(w)){
  await p.addScriptTag({content:fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8')});
  const axe=await p.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']}});return{violations:r.violations.map(x=>({id:x.id,impact:x.impact,nodes:x.nodes.map(n=>n.target)})),incomplete:r.incomplete.map(x=>({id:x.id,nodes:x.nodes.length})),passes:r.passes.length}});
  record('axe',e,vp,axe.violations.length===0,axe);
 }
}
async function afterChecks(p,e,vp,w){
 const editorial=await p.evaluate(()=>{
  const visible=e=>{if(!e)return false;const c=getComputedStyle(e),r=e.getBoundingClientRect();return c.display!=='none'&&c.visibility!=='hidden'&&+c.opacity>.9&&r.width>0&&r.height>0};
  const caption=document.querySelector('.ax-archive-attribution'),c=caption&&getComputedStyle(caption);
  const remains=document.getElementById('modules'),history=document.getElementById('manifesto');
  return{beats:[...history.querySelectorAll('[data-world-beat]')].map(x=>({id:x.dataset.worldBeat,h3:x.querySelectorAll('h3').length})),
   h2:{history:history.querySelectorAll('h2').length,remains:remains.querySelectorAll('h2').length,factions:document.querySelectorAll('#factions h2').length},
   attribution:{text:caption?.textContent.trim()||'',visible:visible(caption),font:c?parseFloat(c.fontSize):0,label:document.querySelector('.ax-archive-label')?.textContent,labelFont:document.querySelector('.ax-archive-label')?parseFloat(getComputedStyle(document.querySelector('.ax-archive-label')).fontSize):0},
   remains:remains.textContent.trim(),articles:remains.querySelectorAll('article').length,
   prose:[...document.querySelectorAll('.ax-history p,.ax-remains p')].filter(visible).map(x=>({text:x.textContent.slice(0,100),font:parseFloat(getComputedStyle(x).fontSize),family:getComputedStyle(x).fontFamily,overflow:x.scrollWidth>x.clientWidth+1})),
   neura:[...document.querySelectorAll('#factions .faction')].find(x=>x.querySelector('.name')?.textContent.includes('NEURA'))?.querySelector('p')?.textContent.trim()||'',
   protectedIII:document.querySelector('#world .ax-chapter-copy')?.textContent.trim(),protectedIV:document.querySelector('#chars .ax-chapter-line')?.textContent.trim(),
   contexts:[...document.querySelectorAll('#showcase-gallery details')].map(d=>({panel:d.closest('.ax-panel').id,open:d.open,summary:d.querySelector('summary')?.textContent.trim(),figures:d.querySelectorAll('figure').length,captions:[...d.querySelectorAll('figcaption')].map(x=>x.textContent.trim())}))};
 });
 record('W4-R1-four-beats-and-authored-attribution',e,vp,editorial.beats.map(x=>x.id).join()==='before,fracture,doctrine,unknown'&&editorial.attribution.visible&&editorial.attribution.font>=12&&editorial.attribution.labelFont>=12&&/реконструк|не является цитат/i.test(editorial.attribution.text),{beats:editorial.beats,attribution:editorial.attribution});
 record('W4-one-heading-per-changed-scene',e,vp,Object.values(editorial.h2).every(x=>x===1),editorial.h2);
 record('W4-R2-remains-no-fragmentation-recap',e,vp,!/самосбор|control.layer|реликт|часть.{0,20}цел|не весь AXIOM/i.test(editorial.remains),{text:editorial.remains});
 record('W4-R3-readable-human-prose',e,vp,editorial.articles===3&&editorial.prose.length>=5&&editorial.prose.every(x=>x.font>=14&&!x.overflow&&/Golos/.test(x.family)),{articles:editorial.articles,prose:editorial.prose});
 record('W4-R4-context-structure',e,vp,editorial.contexts.map(x=>x.panel).join()==='ax-panel-02,ax-panel-03,ax-panel-05'&&editorial.contexts.every(x=>!x.open&&x.summary&&x.captions.length===x.figures&&x.captions.every(c=>/КОНЦЕПТУАЛЬНАЯ СХЕМА/.test(c)))&&editorial.contexts.reduce((s,x)=>s+x.figures,0)===4,editorial.contexts);
 record('W4-R5-neura-no-lifecycle-claim',e,vp,editorial.neura.length>20&&!/возрод|уничтожен|распал|прекратил|сегодня.{0,20}(работ|действ)|действующ/i.test(editorial.neura)&&/совместн/i.test(editorial.neura),{text:editorial.neura,scope:'mechanical guard only; Canon/editorial review remains separate'});
 record('W4-R6-protected-external-labels',e,vp,/ГЛАВА III/.test(editorial.protectedIII||'')&&/ГЛАВА IV/.test(editorial.protectedIV||''),{III:editorial.protectedIII,IV:editorial.protectedIV});
 for(const n of ['02','03','05']){
  await p.locator('#ax-tab-'+n).click();const d=p.locator('#ax-panel-'+n+' details'),s=d.locator('summary');if(!await d.count())continue;
  const closed=await d.evaluate(x=>({height:x.getBoundingClientRect().height,summary:x.querySelector('summary').getBoundingClientRect().height,open:x.open,screenshot:x.closest('.ax-panel').querySelector('.ax-shot').getBoundingClientRect().height}));record('W4-context-secondary-closed-'+n,e,vp,!closed.open&&closed.height<=closed.summary+2&&closed.height<closed.screenshot,closed);
  await s.focus();await p.keyboard.press('Enter');
  const opened=await d.evaluate(x=>({open:x.open,selection:document.querySelector('.ax-tab[aria-selected="true"]').id,focus:document.activeElement===x.querySelector('summary'),overflow:x.scrollWidth-x.clientWidth,
   animations:[...x.querySelectorAll('figure,figure *')].filter(y=>{const c=getComputedStyle(y);return c.animationName!=='none'&&c.animationIterationCount==='infinite'}).length,
   smil:x.querySelectorAll('animate,animateTransform,animateMotion').length,
   figures:[...x.querySelectorAll('figure')].map(y=>({w:y.getBoundingClientRect().width,h:y.getBoundingClientRect().height,caption:y.querySelector('figcaption')?.textContent}))}));
  record('W4-context-keyboard-open-'+n,e,vp,opened.open&&opened.selection==='ax-tab-'+n&&opened.focus&&opened.overflow<=1,opened);
  const labels=await d.locator('figcaption b').evaluateAll(xs=>xs.map(x=>({text:x.textContent,font:parseFloat(getComputedStyle(x).fontSize)})));record('W4-context-meaningful-label-floor-'+n,e,vp,labels.every(x=>x.font>=12),labels);
  await p.keyboard.press('Space');record('W4-context-keyboard-close-'+n,e,vp,!await d.evaluate(x=>x.open),null);
  await s.press('Enter');await p.keyboard.press('Tab');const footer=await p.evaluate(()=>({class:document.activeElement.className,archive:!!document.activeElement.closest('#showcase-gallery'),selected:document.querySelector('.ax-tab[aria-selected="true"]').id}));record('W4-context-footer-keyboard-'+n,e,vp,footer.archive&&footer.class.includes('ax-archive-prev')&&footer.selected==='ax-tab-'+n,footer);await p.keyboard.press('Shift+Tab');await p.keyboard.press('Space');
  if(w<700){await s.tap();const tap=await d.evaluate(x=>({open:x.open,selection:document.querySelector('.ax-tab[aria-selected="true"]').id}));record('W4-context-touch-'+n,e,vp,tap.open&&tap.selection==='ax-tab-'+n,tap);await s.tap()}
  if([390,1440].includes(w)){
   await s.press('Enter');if(!await p.evaluate(()=>!!window.axe))await p.addScriptTag({content:fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8')});
   const axe=await p.evaluate(async selector=>{const r=await axe.run(document.querySelector(selector),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']}});return{violations:r.violations.map(x=>({id:x.id,impact:x.impact,nodes:x.nodes.map(n=>n.target)})),incomplete:r.incomplete.map(x=>({id:x.id,nodes:x.nodes.length}))}},'#ax-panel-'+n);
   record('W4-open-context-axe-'+n,e,vp,axe.violations.length===0,axe);await s.press('Space');
  }
 }
}
const protectedStyleSnapshot=()=>{
 const props=['display','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','borderTopColor','borderTopWidth','paddingTop','paddingBottom','marginTop','marginBottom','gridTemplateColumns','objectFit','objectPosition'];
 const selectors=['.ax-world-scene','.ax-world-art','.ax-world-art img','#world .wrap','#world-title','.v23-map-image','.v23-map-node','.v23-map-ledger','.ax-omega','.ax-omega-stage','.ax-omega-stage img','.ax-omega-title','#chars .sec-title','.chars','.char','.char .img','.char .meta h3','.axiom-entity','.ax-name','.ax-foot'];
 return Object.fromEntries(selectors.map(s=>{const x=document.querySelector(s);if(!x)return[s,null];const c=getComputedStyle(x),r=x.getBoundingClientRect();return[s,{style:Object.fromEntries(props.map(k=>[k,c[k]])),width:+r.width.toFixed(2),height:+r.height.toFixed(2)}]}));
};
async function compareProtectedStyles(p,e,vp,w,h,baselineUrl){
 const c=await context(e,w,h),b=await c.newPage();await b.goto(baselineUrl,{waitUntil:'load'});await ready(b);
 // Both pages start on GLUHAYA; only styles/element dimensions are compared, not document Y positions.
 await scroll(b,'#world');await scroll(b,'#chars');const reference=await b.evaluate(protectedStyleSnapshot),actual=await p.evaluate(protectedStyleSnapshot);
 const differences=[];for(const k of Object.keys(reference)){if(JSON.stringify(reference[k])!==JSON.stringify(actual[k]))differences.push({selector:k,before:reference[k],after:actual[k]})}
 record('W4-protected-computed-styles',e,vp,differences.length===0,differences);await c.close();
}
async function samples(e,url) {
 for(const js of [false,true]){
  const c=await context(e,390,844,{js,motion:js?'no-preference':'reduce'}),p=await c.newPage();await p.goto(url,{waitUntil:'load'});if(js)await ready(p);else await p.waitForTimeout(300);
  if(js){await scroll(p,'.ax-omega');await p.waitForTimeout(1900)}
  const s=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,omegaVisible:getComputedStyle(document.querySelector('.ax-omega-stage img')).opacity,
   clip:getComputedStyle(document.querySelector('.ax-omega-stage img')).clipPath,omegaLink:document.querySelector('.ax-omega-cta').getAttribute('href'),
   title:document.getElementById('v22-world-title').textContent,allScreens:document.querySelectorAll('.ax-shot-trigger').length}));
  record(js?'real-motion-omega':'no-js-content',e,'390x844',s.overflow<=1&&+s.omegaVisible>.9&&(!js||s.clip==='none'||!/[1-9]/.test(s.clip))&&s.omegaLink==='#v23-map-detail'&&s.allScreens===8,s);
  if(PHASE==='after')for(const n of ['02','03','05']){
   if(js)await p.locator('#ax-tab-'+n).click();const d=p.locator('#ax-panel-'+n+' details'),summary=d.locator('summary');
   await summary.focus();await p.keyboard.press('Enter');
   const native=await d.evaluate(x=>({open:x.open,visible:getComputedStyle(x.closest('.ax-panel')).display!=='none',
    infinite:[...x.querySelectorAll('figure,figure *')].filter(y=>{const c=getComputedStyle(y);return c.animationName!=='none'&&c.animationIterationCount==='infinite'}).length,
    smil:x.querySelectorAll('animate,animateTransform,animateMotion').length}));
   record(js?'W4-static-context-normal-motion-'+n:'W4-native-disclosure-no-js-'+n,e,'390x844',native.open&&native.visible&&native.infinite===0&&native.smil===0,native);
   await p.keyboard.press('Space');
  }
  await c.close();
 }
 for(const [w,h,dpr] of [[1440,900,2],[768,1024,2],[390,844,3]]){
  const c=await context(e,w,h,{dpr}),p=await c.newPage();await p.goto(url,{waitUntil:'load'});await scroll(p,'.ax-world-art');
  const images=[];for(const selector of ['.ax-world-art img','.ax-omega-stage img']){await scroll(p,selector);images.push(await p.evaluate(sel=>{const i=document.querySelector(sel),r=i.getBoundingClientRect(),file=+(i.currentSrc.match(/-(\d+)w\.(?:avif|webp)/)||[])[1],c=getComputedStyle(i),sourceHeight=file*941/1672,scale=c.objectFit==='cover'?Math.max(r.width/file,r.height/sourceHeight):Math.min(r.width/file,r.height/sourceHeight);return{selector:sel,src:i.currentSrc,w:r.width,h:r.height,dpr:devicePixelRatio,fileWidth:file,ratio:+(1/(scale*devicePixelRatio)).toFixed(3),complete:i.complete&&i.naturalWidth>0}},selector))}
  record('image-native-source-'+w+'@'+dpr,e,w+'x'+h,images.every(i=>i.complete&&i.fileWidth>0&&(i.selector!=='.ax-omega-stage img'||i.ratio>=.95)),{images,sourceException:'W01 1672 px desktop Retina softness previously approved; area/crop separately compared'});
  report.engines[e].dprSamples.push({w,h,dpr,images});await c.close();
 }
}
(async()=>{
 retention();const url=await serve();report.url=url;const baselineUrl=BASE_ROOT?await serve(BASE_ROOT):null;
 if(BASE_ROOT)report.reference={root:BASE_ROOT,sha:cp.execFileSync('git',['-C',BASE_ROOT,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),manifest:COMPARE};
 if(BASE_MANIFEST){record('protected-source-hashes','source','all',Object.keys(BASE_MANIFEST.protected).every(k=>JSON.stringify(BASE_MANIFEST.protected[k])===JSON.stringify(report.protected[k])),{before:BASE_MANIFEST.protected,after:report.protected});if(report.reference?.sha!==BASE_MANIFEST.sourceSha)throw Error('Reference SHA differs from frozen BEFORE manifest')}
 report.attempts=[...(report.attempts||[]),{at:new Date().toISOString(),runnerSha256:RUNNER_HASH,engines:ENGINES,extension:EXTEND,completeSegments:true}];
 for(const e of ENGINES){if(!EXTEND||!report.engines[e])report.engines[e]={semantics:[],dprSamples:[]};
  const rootless='/tmp/axs-0524-w4-webkit-deps/webkit-headless.sh';
  const launch={headless:true};
  if(e==='webkit'&&fs.existsSync(rootless)){launch.executablePath=rootless;report.engines[e].rootlessDependencies=JSON.parse(fs.readFileSync('/tmp/axs-0524-w4-webkit-deps/manifest.json','utf8'))}
  try{browser=await pw[e].launch(launch);report.engines[e].version=browser.version()}catch(err){report.engines[e].error=String(err);record('engine-launch',e,'all',false,String(err));save();continue}
  process.stdout.write('ENGINE '+e+' '+browser.version()+'\n');
  for(const [w,h] of RUN_VIEWS){const vp=w+'x'+h,c=await context(e,w,h),p=await c.newPage();const errs=[];p.on('pageerror',x=>errs.push(String(x)));
   try{await p.goto(url,{waitUntil:'load'});await ready(p);await sectionShots(p,e,vp,w,h);if(baselineUrl)await compareProtectedStyles(p,e,vp,w,h,baselineUrl);await checks(p,e,vp,w,h);record('page-errors',e,vp,errs.length===0,errs)}catch(err){record('viewport-execution',e,vp,false,String(err))}
   await c.close();save();process.stdout.write(PHASE+' '+e+' '+vp+' captures='+report.captures.length+' bytes='+bytes+'\n');
  }
  if(!QUICK)await samples(e,url);
  await browser.close();browser=null;save();
 }
 report.captures=[...new Map(report.captures.map(x=>[x.path,x])).values()];report.checks=[...new Map(report.checks.map(x=>[x.engine+'|'+x.viewport+'|'+x.id,x])).values()];for(const x of report.captures){if(sha(fs.readFileSync(path.join(OUT,x.path)))!==x.sha256)throw Error('Capture hash mismatch '+x.path)}report.completedAt=new Date().toISOString();report.completeOverlappingCoverage=!QUICK;report.captureBytes=report.captures.reduce((n,x)=>n+x.bytes,0);report.summary={checks:report.checks.length,failed:report.checks.filter(x=>!x.ok).length,captures:report.captures.length};save();process.stdout.write(JSON.stringify(report.summary)+'\n');
})().catch(err=>{report.fatal=String(err);if(fs.existsSync(OUT))save();process.stderr.write(String(err)+'\n');process.exitCode=1}).finally(async()=>{if(browser)await browser.close();for(const s of servers)await new Promise(r=>s.close(r));if(report.summary?.failed)process.exitCode=1});
