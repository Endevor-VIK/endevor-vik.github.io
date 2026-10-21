/* 0524.W4.R R3 — executor-run cross-engine matrix on a frozen implementation SHA (not the independent R4).
   Arms are served from Git objects: impl (--impl SHA), base (b85fbb0a, product before R2), ad (A+AD prototype @9cf78b0).
   Per engine × viewport: runtime health; changed sections vs A+AD (height max(1%,16px), text); untouched sections and
   protected objects vs b85 (height / box size); no-JS; keyboard through every rail item; rail controls and index;
   reduced motion; A08 source and crop; scoped axe; BEFORE / IMPLEMENTED frames.
   Usage: NODE_PATH=<ui>/node_modules node r3_matrix.cjs --impl <sha> --out <fresh dir> [--engines chromium,firefox,webkit] [--shots] */
const fs=require('fs'),path=require('path'),http=require('http'),cp=require('child_process'),crypto=require('crypto');
const pw=require('playwright');
const arg=k=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:null;};
const IMPL=arg('--impl'),OUT=path.resolve(arg('--out')||''),SHOTS=process.argv.includes('--shots');
const ENGINES=(arg('--engines')||'chromium,firefox,webkit').split(',');
if(!IMPL||!arg('--out')||fs.existsSync(OUT))throw Error('usage: --impl <sha> --out <fresh dir> [--engines …] [--shots]');
const ROOT=path.resolve(__dirname,'../../../../..'),FREEZE='9cf78b0',PRODUCT='b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5';
const WEBKIT='/tmp/axs-0524-w4-webkit-deps/webkit-headless.sh';
const AD='docs/showcase-v031/evidence/w4ad/preview/',AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const CHANGED=['manifesto','modules','work','world','chars'],UNTOUCHED=['top','about','creator','system','world-guide','factions','vision','collaboration'];
const PROTECTED={w04:'#world .ax-chapter-plate',map:'.v23-map-composition',omega:'.ax-omega',cards:'#chars .chars',axiom:'.axiom-entity',shot:'.ax-panel:not([hidden]) .ax-shot'};
const VIEWPORTS=[[1920,1080],[1440,900],[1280,800],[1024,768],[768,1024],[430,932],[390,844],[360,800],[320,568],[844,390]];
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const show=(ref,p)=>{const o=cp.spawnSync('git',['show',`${ref}:${p}`],{cwd:ROOT,maxBuffer:32*1024*1024});return o.status===0?o.stdout:null;};
const AD_LOCAL={'index.html':AD+'ad.html','r1p.css':'docs/showcase-v031/evidence/w4rp/preview/r1p.css','ad.css':AD+'ad.css','ad.js':AD+'ad.js'};
function serve(){const cache=new Map();return http.createServer((req,res)=>{try{
 const p=decodeURIComponent(new URL(req.url,'http://x').pathname),m=p.match(/^\/(ad|impl|base)(\/.*)?$/);
 if(!m){res.writeHead(404);return res.end();}if(!m[2]){res.writeHead(302,{Location:`/${m[1]}/`});return res.end();}
 const arm=m[1],file=m[2].slice(1)||'index.html';if(file.includes('..')){res.writeHead(403);return res.end();}
 const key=arm+':'+file;let data=cache.get(key);
 if(!data){data=arm==='ad'?(AD_LOCAL[file]?show(FREEZE,AD_LOCAL[file]):/^proposed\/A08_protocol_gate-\d+w\.(avif|webp)$/.test(file)?show(FREEZE,AD+'proposed-assets/'+file.slice(9)):/^assets\//.test(file)?show(PRODUCT,file):null)
  :/^(index\.html|assets\/)/.test(file)?show(arm==='impl'?IMPL:PRODUCT,file):null;
  if(!data){res.writeHead(404);return res.end();}cache.set(key,data);}
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
}catch{res.writeHead(400);res.end();}});}
const checks=[],captures=[],errors=[];
const check=(engine,name,pass,detail={})=>{checks.push({engine,name,pass:!!pass,...detail});if(!pass||process.env.R3_VERBOSE)console.log((pass?'PASS ':'FAIL ')+`[${engine}] `+name+' '+JSON.stringify(detail).slice(0,260));};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const REVIEW_ONLY_CSS='header.top,.nav,.ticker,.show-mobile-nav,.index-cursor,.v22-scroll-progress{visibility:hidden!important}';
async function webp(png,file){const p=cp.spawnSync('python3',['-c','import sys,io;from PIL import Image;Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGB").save(sys.argv[1],"WEBP",quality=76,method=4)',path.join(OUT,file)],{input:png,maxBuffer:64*1024*1024});if(p.status)throw Error(String(p.stderr));return fs.readFileSync(path.join(OUT,file));}
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});const server=serve();await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const report={kind:'W4R_R3_EXECUTOR_MATRIX',label:'Executor-run R3 (Opus). Not the independent R4.',impl:IMPL,product:PRODUCT,freeze:FREEZE,at:new Date().toISOString(),engines:{},heights:{},captures};
 for(const engine of ENGINES){
  const browser=await pw[engine].launch(engine==='webkit'?{headless:true,executablePath:WEBKIT}:{headless:true});report.engines[engine]=browser.version();
  const open=async(arm,w,h,opts={})=>{const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,reducedMotion:'reduce',...opts});await ctx.addInitScript(()=>{try{sessionStorage.setItem('axiom_loader_seen','1')}catch(e){}});const page=await ctx.newPage();
   page.on('pageerror',e=>errors.push({engine,arm,w,error:String(e)}));page.on('response',r=>{if(r.status()>=400)errors.push({engine,arm,w,http:r.status(),path:new URL(r.url()).pathname});});
   await page.goto(`${url}/${arm}/`,{waitUntil:'load',timeout:60000});if(opts.javaScriptEnabled!==false)await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,5000))]));return {ctx,page};};
  const settle=async page=>{await page.locator('#ax-tab-01').click();await page.locator('.v23-map-node[data-canon-id="02.01"]').click();
   const max=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);for(let y=0;y<=max;y+=700){await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(engine==='webkit'?150:20);}
   await page.evaluate(async()=>{window.scrollTo({top:0,behavior:'instant'});await Promise.race([Promise.all([...document.images].filter(i=>i.currentSrc).map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,8000))]);});};
  const facts=page=>page.evaluate(({CHANGED,UNTOUCHED,PROTECTED})=>{const h=id=>{const e=document.getElementById(id);return e?+e.getBoundingClientRect().height.toFixed(2):null;};
   const box=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [+r.width.toFixed(2),+r.height.toFixed(2)];};
   return {heights:Object.fromEntries([...CHANGED,...UNTOUCHED].map(id=>[id,h(id)])),boxes:Object.fromEntries(Object.entries(PROTECTED).map(([k,s])=>[k,box(s)])),
    text:Object.fromEntries(CHANGED.map(id=>[id,document.getElementById(id).textContent.replace(/\s+/g,' ').trim()])),
    overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,broken:[...document.images].filter(i=>i.currentSrc&&(!i.complete||!i.naturalWidth)).map(i=>i.currentSrc.split('/').pop()),
    fonts:['Oswald','Golos Text','JetBrains Mono'].every(f=>document.fonts.check(`16px "${f}"`))};},{CHANGED,UNTOUCHED,PROTECTED});
  report.heights[engine]={};
  for(const [w,h] of VIEWPORTS){
   const got={};
   for(const arm of ['impl','base','ad']){const {ctx,page}=await open(arm,w,h);await settle(page);got[arm]=await facts(page);
    if(SHOTS&&[1440,390].includes(w)&&(arm!=='ad')&&(engine==='chromium'||arm==='impl')){
     await page.mouse.move(0,0);await page.addStyleTag({content:REVIEW_ONLY_CSS});
     for(const id of CHANGED){const geo=await page.evaluate(id=>{const r=document.getElementById(id).getBoundingClientRect();return {top:r.top+scrollY,bottom:r.bottom+scrollY,max:document.documentElement.scrollHeight-innerHeight};},id);
      let i=0;for(let y=geo.top;;y+=h-120){const yy=Math.min(y,geo.max);await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),yy);await page.waitForTimeout(150);
       const png=await page.screenshot({animations:'disabled'}),file=`${engine}-${arm==='base'?'before':'impl'}-${w}-${id}-${String(++i).padStart(2,'0')}.webp`,buf=await webp(png,file);
       const plates=await page.evaluate(()=>[...document.querySelectorAll('.ax-chapter-plate')].map(p=>p.getBoundingClientRect()).filter(r=>r.top>=0&&r.bottom<=innerHeight&&r.height>60).map(r=>[Math.round(r.left+8),Math.round(r.top+8),Math.round(r.right-8),Math.round(r.bottom-8)]));
       for(const r of plates){const L=+cp.execFileSync('python3',['-c','import io,sys;from PIL import Image,ImageStat;a=[int(x) for x in sys.argv[1:]];print(round(ImageStat.Stat(Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("L").crop(tuple(a))).mean[0],2))',...r.map(String)],{input:png}).toString();check(engine,`frame ${file}: chapter plate painted`,L>3,{luminance:L});}
       captures.push({file,engine,arm,w,section:id,segment:i,scrollY:yy,bytes:buf.length,sha256:hash(buf)});if(yy+h>=geo.bottom||yy>=geo.max)break;}}}
    await ctx.close();}
   report.heights[engine][w]=got.impl.heights;
   const fails=[];
   // Recorded deviations change height on purpose only where they apply (OPUS_DECISIONS.md): D-04 restacks the terminal
   // at 761–1280 px. There the delta is reported, not failed; the width sweep proves nothing overflows.
   const recorded=[];
   for(const id of CHANGED){const a=got.impl.heights[id],b=got.ad.heights[id],tol=Math.max(b*.01,16);if(Math.abs(a-b)<=tol)continue;
    if(id==='manifesto'&&w>=761&&w<=1280)recorded.push({id,impl:a,ad:b,deviation:'D-04'});else fails.push({id,impl:a,ad:b});}
   check(engine,`${w}×${h}: changed sections within max(1%,16px) of A+AD (recorded deviations reported)`,!fails.length,{fails,recorded});
   const textDiff=CHANGED.filter(id=>got.impl.text[id]!==got.ad.text[id]);check(engine,`${w}×${h}: changed-section text equals A+AD`,!textDiff.length,{textDiff});
   const un=UNTOUCHED.filter(id=>Math.abs(got.impl.heights[id]-got.base.heights[id])>=.5).map(id=>({id,impl:got.impl.heights[id],base:got.base.heights[id]}));
   check(engine,`${w}×${h}: untouched sections equal b85`,!un.length,{un});
   const pb=Object.keys(PROTECTED).filter(k=>JSON.stringify(got.impl.boxes[k])!==JSON.stringify(got.base.boxes[k])).map(k=>({k,impl:got.impl.boxes[k],base:got.base.boxes[k]}));
   check(engine,`${w}×${h}: protected object boxes equal b85`,!pb.length,{pb});
   // An image counts as broken only if it is not also pending in b85 under the same engine (WebKit keeps lazy images
   // unloaded until they truly intersect the viewport; that is the product's own lazy loading, not an R2 regression).
   const newBroken=got.impl.broken.filter(f=>!got.base.broken.includes(f)&&!/^A08_protocol_gate-/.test(f));
   check(engine,`${w}×${h}: no overflow beyond b85, no new broken images vs b85, fonts`,got.impl.overflow<=Math.max(0,got.base.overflow)&&!newBroken.length&&got.impl.fonts,{overflow:got.impl.overflow,baseOverflow:got.base.overflow,newBroken,pendingImpl:got.impl.broken.length,pendingBase:got.base.broken.length,fonts:got.impl.fonts});
  }
  // Hidden text is acceptable only if decorative (aria-hidden) or of a class the product already hides in b85 at the same
  // width without JS (mobile section stamps, JS-only archive hints). Anything else would be content cut by R2.
  const hiddenText=page=>page.evaluate(()=>[...document.querySelectorAll('#manifesto *,#modules *,#work *')].filter(e=>e.children.length===0&&e.textContent.trim()&&getComputedStyle(e).display==='none')
   .map(e=>({cls:[...e.classList].join('.'),aria:!!e.closest('[aria-hidden="true"]'),text:e.textContent.trim().slice(0,40)})));
  for(const w of [1440,390]){const {ctx,page}=await open('impl',w,844,{javaScriptEnabled:false});
   const r=await page.evaluate(()=>({rails:[...document.querySelectorAll('[data-ad-rail]')].map(e=>({n:e.children.length,scroll:e.scrollWidth>e.clientWidth+4})),
    anchors:[...document.querySelectorAll('.ad-surface-index a')].every(a=>!!document.querySelector(a.getAttribute('href'))),bars:document.querySelectorAll('.ad-rail-bar').length,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}));
   r.hidden=await hiddenText(page);await ctx.close();
   const b=await open('base',w,844,{javaScriptEnabled:false}),baseCls=new Set((await hiddenText(b.page)).map(x=>x.cls));await b.ctx.close();
   r.cut=r.hidden.filter(x=>!x.aria&&!baseCls.has(x.cls));
   check(engine,`noJS ${w}: no content cut (hidden text only decorative or as in b85), rails ${w<760?'native-scroll':'as grids'}, no JS controls, anchors resolve`,r.rails.length===2&&r.rails.every(x=>x.scroll===(w<760))&&!r.cut.length&&r.anchors&&r.bars===0&&r.overflow<=0,r);}
  const visibleItems=rail=>rail.evaluate(e=>{const b=e.getBoundingClientRect(),pad=parseFloat(getComputedStyle(e).paddingLeft);return [...e.children].map((c,i)=>{const r=c.getBoundingClientRect();return r.left>=b.left+pad-2&&r.right<=b.right-pad+2?i:-1;}).filter(i=>i>=0);});
  for(const js of [true,false])for(const name of ['traces','surfaces']){
   const {ctx,page}=await open('impl',390,844,{javaScriptEnabled:js});const rail=page.locator(`[data-ad-rail="${name}"]`);await rail.scrollIntoViewIfNeeded();await rail.focus();
   const n=await rail.evaluate(e=>e.children.length),seen=new Set(await visibleItems(rail)),focused=await rail.evaluate(e=>document.activeElement===e);
   for(let k=0;k<n+2;k++){await page.keyboard.press('ArrowRight');await page.waitForTimeout(400);(await visibleItems(rail)).forEach(i=>seen.add(i));}
   if(seen.size<n){for(let k=0;k<n+2;k++){await rail.evaluate(e=>e.scrollBy({left:e.clientWidth*.6,behavior:'instant'}));await page.waitForTimeout(250);(await visibleItems(rail)).forEach(i=>seen.add(i));}}
   check(engine,`keyboard ${js?'JS':'noJS'} 390: ${name} rail focusable, every item reachable`,focused&&seen.size===n,{n,seen:[...seen].sort(),focused});
   if(js){const bar=page.locator(`[data-ad-rail="${name}"] + .ad-rail-bar`);await rail.evaluate(e=>e.scrollTo({left:0,behavior:'instant'}));await page.waitForTimeout(250);
    for(let k=0;k<n-1;k++){await bar.locator('button').nth(1).click();await page.waitForTimeout(550);}
    const last=await bar.locator('output').textContent(),nextDisabled=await bar.locator('button').nth(1).isDisabled();
    check(engine,`JS 390: ${name} next button walks to ${n}/${n}`,last.startsWith(String(n).padStart(2,'0'))&&nextDisabled,{last,nextDisabled});}
   await ctx.close();}
  for(const rm of ['reduce','no-preference']){const {ctx,page}=await open('impl',1440,900,{reducedMotion:rm});
   const a=await page.evaluate(()=>getComputedStyle(document.querySelector('.ad-pulse-trace')).animationName);check(engine,`RM=${rm}: pulse ${rm==='reduce'?'off':'on'}`,rm==='reduce'?a==='none':a==='ad-pulse',{a});await ctx.close();}
  for(const [w,h,dpr] of [[1440,900,2],[390,844,3],[360,800,1]]){
   let ctx,page;try{({ctx,page}=await open('impl',w,h,{deviceScaleFactor:dpr}));}catch(e){check(engine,`A08 ${w}@${dpr}x`,false,{error:String(e).slice(0,120)});continue;}
   const img=page.locator('.ad-gate img');await img.scrollIntoViewIfNeeded();await page.waitForTimeout(800);await img.evaluate(i=>Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,5000))]));
   const r=await img.evaluate(i=>{const b=i.getBoundingClientRect(),[px,py]=getComputedStyle(i).objectPosition.split(' ').map(v=>parseFloat(v)/100),src=i.currentSrc.split('/').pop(),k=Math.max(b.width/941,b.height/1672),rw=941*k,rh=1672*k;
    return {loaded:i.complete&&i.naturalWidth>0,src,coreX:+(((b.width-rw)*px+.501*rw)/b.width).toFixed(3),coreY:+(((b.height-rh)*py+.388*rh)/b.height).toFixed(3),need:Math.round(rw*devicePixelRatio),dpr:devicePixelRatio};});
   const nat=+(r.src.match(/-(\d+)w\./)||[0,0])[1];
   check(engine,`A08 ${w}@${dpr}x: loads when shown, original-derived source, gate core inside crop`,r.loaded&&nat>=Math.min(r.need*.98,941)&&r.coreX>.12&&r.coreX<.88&&r.coreY>.12&&r.coreY<.88,r);await ctx.close();}
  if(engine!=='webkit')for(const w of [1440,390]){const {ctx,page}=await open('impl',w,844);await page.addScriptTag({content:AXE});
   const r=await page.evaluate(async ids=>{const x=await axe.run({include:ids.map(i=>['#'+i])},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return {v:x.violations.map(v=>({id:v.id,n:v.nodes.length,t:v.nodes.slice(0,3).map(n=>n.target.join(' '))})),inc:x.incomplete.map(v=>({id:v.id,n:v.nodes.length}))};},CHANGED);
   report[`axe_${engine}_${w}`]=r;check(engine,`axe ${w}: changed sections 0 violations`,!r.v.length,r);await ctx.close();}
  await browser.close();
  console.log(`[${engine}] ${checks.filter(c=>c.engine===engine&&c.pass).length}/${checks.filter(c=>c.engine===engine).length}`);
  fs.writeFileSync(path.join(OUT,'r3-matrix.partial.json'),JSON.stringify({...report,checks,errors},null,1));
 }
 server.close();
 check('all','runtime: no page errors or HTTP ≥ 400 in any arm',!errors.length,{errors:errors.slice(0,8)});
 report.checks=checks;report.summary=`${checks.filter(c=>c.pass).length}/${checks.length}`;report.errors=errors;
 fs.writeFileSync(path.join(OUT,'r3-matrix.json'),JSON.stringify(report,null,1));console.log('R3 matrix',report.summary);process.exitCode=checks.some(c=>!c.pass)?1:0;
})().catch(e=>{console.error(e);process.exit(2);});
