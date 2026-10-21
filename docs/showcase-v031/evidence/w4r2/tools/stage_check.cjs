/* 0524.W4.R R2 — stage SELF-CHECK (executor's own verification, never an independent PASS).
   Compares the implemented product with the frozen A+AD prototype (git 9cf78b0) and the untouched product (b85fbb0a):
   stage sections — text, SVG geometry, height within max(1%,16px); untouched sections — height equal to b85;
   runtime — errors, broken images, overflow; rails — no-JS, keyboard, touch; A08 source/crop; RM; scoped axe;
   native review crops of the implementation.
   Usage: NODE_PATH=<ui>/node_modules node stage_check.cjs --stage N --out <fresh dir> [--ref <commit>] [--shots]
   Without --ref the implementation is served from the working tree. */
const fs=require('fs'),path=require('path'),http=require('http'),cp=require('child_process'),crypto=require('crypto');
const {chromium}=require('playwright');
const arg=k=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:null;};
const STAGE=+arg('--stage'),OUT=path.resolve(arg('--out')||''),REF=arg('--ref'),SHOTS=process.argv.includes('--shots');
if(![1,2,3].includes(STAGE)||!arg('--out')||fs.existsSync(OUT))throw Error('usage: --stage 1|2|3 --out <fresh dir> [--ref sha] [--shots]');
const ROOT=path.resolve(__dirname,'../../../../..'),FREEZE='9cf78b0',PRODUCT='b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5';
const AD='docs/showcase-v031/evidence/w4ad/preview/',AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const STAGES={1:['manifesto','modules'],2:['work'],3:['world','chars']},ALL=['work','system','manifesto','modules','world','chars','factions','vision'];
const CHANGED=[1,2,3].filter(n=>n<=STAGE).flatMap(n=>STAGES[n]),NOW=STAGES[STAGE];
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const show=(ref,p)=>{const o=cp.spawnSync('git',['show',`${ref}:${p}`],{cwd:ROOT,maxBuffer:32*1024*1024});return o.status===0?o.stdout:null;};
const AD_LOCAL={'index.html':AD+'ad.html','r1p.css':'docs/showcase-v031/evidence/w4rp/preview/r1p.css','ad.css':AD+'ad.css','ad.js':AD+'ad.js'};
function serve(){
 const cache=new Map();
 return http.createServer((req,res)=>{try{
  const p=decodeURIComponent(new URL(req.url,'http://x').pathname),m=p.match(/^\/(ad|impl|base)(\/.*)?$/);
  if(!m){res.writeHead(404);return res.end();}
  if(!m[2]){res.writeHead(302,{Location:`/${m[1]}/`});return res.end();}
  const arm=m[1],file=m[2].slice(1)||'index.html';
  if(file.includes('..')){res.writeHead(403);return res.end();}
  const key=arm+':'+file;let data=cache.get(key);
  if(!data){
   if(arm==='ad')data=AD_LOCAL[file]?show(FREEZE,AD_LOCAL[file]):/^proposed\/A08_protocol_gate-\d+w\.(avif|webp)$/.test(file)?show(FREEZE,AD+'proposed-assets/'+file.slice(9)):/^assets\//.test(file)?show(PRODUCT,file):null;
   else if(arm==='base')data=/^(index\.html|assets\/)/.test(file)?show(PRODUCT,file):null;
   else if(/^(index\.html|assets\/)/.test(file))data=REF?show(REF,file):(fs.existsSync(path.join(ROOT,file))?fs.readFileSync(path.join(ROOT,file)):null);
   if(!data){res.writeHead(404);return res.end();}
   cache.set(key,data);
  }
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
 }catch{res.writeHead(400);res.end();}});
}
const checks=[],captures=[],errors=[];const check=(name,pass,detail={})=>{checks.push({name,pass:!!pass,...detail});console.log((pass?'PASS ':'FAIL ')+name+(Object.keys(detail).length?' '+JSON.stringify(detail).slice(0,300):''));};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
// Review crops only: the fixed header (backdrop blur), nav, ticker, cursor and progress bar would float over full-page clips.
const REVIEW_ONLY_CSS='header.top,.nav,.ticker,.show-mobile-nav,.index-cursor,.v22-scroll-progress{visibility:hidden!important}';
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const server=serve();await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true});
 const open=async(arm,w,h,opts={})=>{const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,reducedMotion:'reduce',...opts});await ctx.addInitScript(()=>sessionStorage.setItem('axiom_loader_seen','1'));const page=await ctx.newPage();
  page.on('pageerror',e=>errors.push({arm,w,error:String(e)}));page.on('response',r=>{if(r.status()>=400)errors.push({arm,w,http:r.status(),path:new URL(r.url()).pathname});});
  await page.goto(`${url}/${arm}/`,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);return {ctx,page};};
 const settle=async page=>{await page.locator('#ax-tab-01').click();await page.locator('.v23-map-node[data-canon-id="02.01"]').click();
  const max=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);for(let y=0;y<=max;y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(16);}
  await page.evaluate(async()=>{scrollTo(0,0);await Promise.all([...document.images].filter(i=>i.currentSrc).map(i=>i.decode().catch(()=>{})));});};
 const facts=page=>page.evaluate(({ALL,NOW})=>{
  const sec=id=>document.getElementById(id),h=id=>{const e=sec(id);return e?+e.getBoundingClientRect().height.toFixed(2):null;};
  return {heights:Object.fromEntries(ALL.map(id=>[id,h(id)])),
   text:Object.fromEntries(NOW.map(id=>[id,sec(id).textContent.replace(/\s+/g,' ').trim()])),
   paths:Object.fromEntries(NOW.map(id=>[id,[...sec(id).querySelectorAll('path[d]')].map(p=>p.getAttribute('d'))])),
   overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.currentSrc&&(!i.complete||!i.naturalWidth)).map(i=>i.currentSrc),
   fonts:['Oswald','Golos Text','JetBrains Mono'].every(f=>document.fonts.check(`16px "${f}"`))};},{ALL,NOW});
 const report={kind:'W4R_R2_STAGE_SELF_CHECK',label:'SELF-CHECK — executor verification, not independent PASS',stage:`R2.${STAGE}`,impl:REF||'working tree',freeze:FREEZE,product:PRODUCT,at:new Date().toISOString(),browser:browser.version(),heights:{},captures};
 try{
  for(const [w,h] of [[1440,900],[1920,1080],[390,844],[360,800]]){
   const got={};
   for(const arm of ['impl','ad','base']){const {ctx,page}=await open(arm,w,h);await settle(page);got[arm]=await facts(page);
    if(arm==='impl'&&SHOTS&&w!==1920||arm==='impl'&&SHOTS&&w===1920&&NOW.includes('manifesto')){
     await page.mouse.move(0,0);await page.addStyleTag({content:REVIEW_ONLY_CSS});
     for(const id of NOW){const loc=page.locator('#'+id);await loc.scrollIntoViewIfNeeded();await page.waitForTimeout(60);const b=await loc.boundingBox(),sy=await page.evaluate(()=>scrollY);
      const file=`impl-${w}-${id}.png`,buf=await page.screenshot({path:path.join(OUT,file),fullPage:true,animations:'disabled',clip:{x:0,y:Math.max(0,b.y+sy),width:w,height:Math.min(b.height,9000)}});captures.push({file,w,section:id,sha256:hash(buf)});}
     if(w===390)for(const name of (STAGE===1?['traces']:STAGE===2?['surfaces']:[])){
      await page.setViewportSize({width:w,height:1500});await page.waitForTimeout(300);const rail=page.locator(`[data-ad-rail="${name}"]`);await rail.evaluate(e=>e.scrollIntoView({block:'start'}));await page.evaluate(()=>scrollBy(0,-12));
      const n=await rail.evaluate(e=>e.children.length);
      for(let i=0;i<n;i++){await rail.evaluate((e,i)=>{e.style.scrollBehavior='auto';e.scrollLeft=e.children[i].offsetLeft-parseFloat(getComputedStyle(e).paddingLeft);e.dispatchEvent(new Event('scroll'));},i);await page.waitForTimeout(350);
       const b=await rail.boundingBox(),bar=await page.locator(`[data-ad-rail="${name}"] + .ad-rail-bar`).boundingBox(),hh=Math.round((bar?bar.y+bar.height:b.y+b.height)-b.y+24);
       const file=`impl-390-${name}-rail-${String(i+1).padStart(2,'0')}.png`,buf=await page.screenshot({path:path.join(OUT,file),animations:'disabled',clip:{x:0,y:Math.max(0,b.y-12),width:w,height:hh}});captures.push({file,w,rail:name,item:i+1,sha256:hash(buf)});}
     }
    }
    await ctx.close();}
   report.heights[w]=Object.fromEntries(Object.keys(got.impl.heights).map(k=>[k,{impl:got.impl.heights[k],ad:got.ad.heights[k],base:got.base.heights[k]}]));
   for(const id of NOW){const a=got.impl.heights[id],b=got.ad.heights[id],tol=Math.max(b*.01,16);
    check(`${w}: #${id} height vs A+AD within max(1%,16px)`,Math.abs(a-b)<=tol,{impl:a,ad:b,delta:+(a-b).toFixed(2),tol:+tol.toFixed(1)});
    check(`${w}: #${id} text equals A+AD`,got.impl.text[id]===got.ad.text[id],{len:got.impl.text[id].length});
    check(`${w}: #${id} SVG geometry equals A+AD`,JSON.stringify(got.impl.paths[id])===JSON.stringify(got.ad.paths[id]),{paths:got.impl.paths[id].length});}
   for(const id of ALL.filter(x=>!CHANGED.includes(x)))check(`${w}: untouched #${id} height equals b85`,Math.abs(got.impl.heights[id]-got.base.heights[id])<.5,{impl:got.impl.heights[id],base:got.base.heights[id]});
   check(`${w}: no overflow, no broken images, TYPE A fonts`,!got.impl.overflow&&!got.impl.broken.length&&got.impl.fonts,{broken:got.impl.broken});
  }
  // Rails present in this stage: no-JS, keyboard (JS on/off), touch swipe.
  const rails=STAGE===1?['traces']:STAGE===2?['surfaces']:[];
  const visibleItems=rail=>rail.evaluate(e=>{const b=e.getBoundingClientRect(),pad=parseFloat(getComputedStyle(e).paddingLeft);return [...e.children].map((c,i)=>{const r=c.getBoundingClientRect();return r.left>=b.left+pad-2&&r.right<=b.right-pad+2?i:-1;}).filter(i=>i>=0);});
  for(const name of rails){
   for(const [w,js] of [[390,true],[390,false],[360,true],[360,false]]){
    const {ctx,page}=await open('impl',w,844,{javaScriptEnabled:js});const rail=page.locator(`[data-ad-rail="${name}"]`);
    const st=await rail.evaluate(e=>({items:e.children.length,scrollable:e.scrollWidth>e.clientWidth+4,snap:getComputedStyle(e).scrollSnapType,hidden:[...e.querySelectorAll('*')].filter(x=>getComputedStyle(x).display==='none'&&x.textContent.trim()).length,bar:!!e.nextElementSibling?.classList.contains('ad-rail-bar')}));
    check(`${js?'JS':'noJS'}/${w}: ${name} rail native, nothing hidden${js?', bar present':', no JS bar'}`,st.scrollable&&/x/.test(st.snap)&&st.hidden===0&&st.bar===js,st);
    await rail.scrollIntoViewIfNeeded();await rail.focus();const seen=new Set(await visibleItems(rail));
    for(let k=0;k<st.items+2;k++){await page.keyboard.press('ArrowRight');await page.waitForTimeout(350);(await visibleItems(rail)).forEach(i=>seen.add(i));}
    check(`keyboard ${js?'JS':'noJS'}/${w}: every ${name} item fully visible in turn`,seen.size===st.items,{seen:[...seen].sort(),n:st.items});
    await ctx.close();}
   for(const w of [390,360]){
    const {ctx,page}=await open('impl',w,844,{hasTouch:true,isMobile:true});const cdp=await ctx.newCDPSession(page);const rail=page.locator(`[data-ad-rail="${name}"]`);await rail.scrollIntoViewIfNeeded();
    const n=await rail.evaluate(e=>e.children.length),seen=new Set(await visibleItems(rail));
    for(let k=0;k<n+1;k++){const b=await rail.boundingBox(),y=Math.round(b.y+Math.min(b.height/2,300)),x0=Math.round(b.width*.8),dx=Math.round(b.width*.45);
     await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x0,y}]});for(let i=1;i<=10;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x0-Math.round(dx*i/10),y}]});await page.waitForTimeout(16);}
     await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(500);(await visibleItems(rail)).forEach(i=>seen.add(i));}
    check(`touch/${w}: swipe reaches every ${name} item`,seen.size===n,{seen:[...seen].sort(),n});await ctx.close();}
  }
  if(STAGE===1){
   const CORE={x:.501,y:.388};
   for(const [w,h,dpr] of [[1440,900,1],[1440,900,2],[390,844,1],[390,844,3],[360,800,1],[360,800,3]]){
    const {ctx,page}=await open('impl',w,h,{deviceScaleFactor:dpr});const img=page.locator('.ad-gate img');await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());
    const r=await img.evaluate((i,CORE)=>{const b=i.getBoundingClientRect(),s=getComputedStyle(i),[px,py]=s.objectPosition.split(' ').map(v=>parseFloat(v)/100),src=i.currentSrc.split('/').pop(),nat=+(src.match(/-(\d+)w\./)||[0,0])[1];
     const k=Math.max(b.width/941,b.height/1672),rw=941*k,rh=1672*k,ox=(b.width-rw)*px,oy=(b.height-rh)*py;
     return {path:i.currentSrc.replace(location.origin,''),src,nat,coreX:+((ox+CORE.x*rw)/b.width).toFixed(3),coreY:+((oy+CORE.y*rh)/b.height).toFixed(3),need:Math.round(rw*devicePixelRatio)};},CORE);
    check(`A08 ${w}@${dpr}x: product asset from original, gate core inside crop`,/\/assets\/showcase\/visual-library\/web\/A08_protocol_gate-\d+w\.(avif|webp)$/.test(r.path)&&r.nat>=Math.min(r.need*.98,941)&&r.coreX>.12&&r.coreX<.88&&r.coreY>.12&&r.coreY<.88,r);await ctx.close();}
   for(const rm of ['reduce','no-preference']){const {ctx,page}=await open('impl',1440,900,{reducedMotion:rm});
    const a=await page.evaluate(()=>getComputedStyle(document.querySelector('.ad-pulse-trace')).animationName);check(`1440 RM=${rm}: pulse animation ${rm==='reduce'?'off':'on'}`,rm==='reduce'?a==='none':a==='ad-pulse',{animation:a});await ctx.close();}
  }
  if(STAGE===2){
   {const {ctx,page}=await open('impl',390,844,{javaScriptEnabled:false});
    const r=await page.evaluate(()=>[...document.querySelectorAll('.ad-surface-index a')].map(a=>!!document.querySelector(a.getAttribute('href'))));
    check('noJS/390: four study index anchors resolve',r.length===4&&r.every(Boolean),{r});await ctx.close();}
   {const {ctx,page}=await open('impl',390,844);const s=page.locator('[data-ad-rail="surfaces"]');await s.scrollIntoViewIfNeeded();
    await page.locator('.ad-surface-index a').nth(3).click();await page.waitForTimeout(700);
    const st=await s.evaluate(e=>{const it=[...e.children],pad=parseFloat(getComputedStyle(e).paddingLeft);return {left:e.scrollLeft,target:Math.min(it[3].offsetLeft-pad,e.scrollWidth-e.clientWidth),current:document.querySelector('.ad-surface-index a[aria-current]')?.textContent,hash:location.hash,heights:[...new Set(it.map(c=>Math.round(c.getBoundingClientRect().height)))]};});
    check('JS/390: index scrolls the rail to WATCH_DOG without a page jump; equal card heights',Math.abs(st.left-st.target)<4&&/WATCH_DOG/.test(st.current||'')&&st.hash===''&&st.heights.length===1,st);
    const t=await page.evaluate(()=>[...document.querySelectorAll('.ad-rail-bar button,.ad-surface-index a')].map(e=>{const r=e.getBoundingClientRect();return Math.min(r.width,r.height);}));
    check('390: rail buttons and index targets ≥ 44 px',t.length>=8&&t.every(v=>v>=44),{min:Math.min(...t),n:t.length});
    const wrap=await page.evaluate(()=>[...document.querySelectorAll('.r1p-surfaces .m-foot b')].filter(b=>b.getClientRects().length>1).map(b=>b.textContent));
    check('390: study footers do not break words',!wrap.length,{wrap});await ctx.close();}
   {const {ctx,page}=await open('impl',1440,900);
    const r=await page.evaluate(()=>{const m=document.querySelector('.r1p-surfaces .modules');return {cols:getComputedStyle(m).gridTemplateColumns.split(' ').length,scrollable:m.scrollWidth>m.clientWidth+4,bar:getComputedStyle(m.nextElementSibling).display,afterViewer:!!(document.getElementById('showcase-lightbox').compareDocumentPosition(document.getElementById('work-surfaces'))&Node.DOCUMENT_POSITION_FOLLOWING),beforeIntro:!!(document.getElementById('work-surfaces').compareDocumentPosition(document.getElementById('work-intro'))&Node.DOCUMENT_POSITION_FOLLOWING),disclosures:document.querySelectorAll('.ax-case-context').length,modules:document.querySelectorAll('#work-surfaces .module').length};});
    check('1440: 2×2 studies, no rail/bar; after viewer, before #work-intro; no W4 disclosures',r.cols===2&&!r.scrollable&&r.bar==='none'&&r.afterViewer&&r.beforeIntro&&r.disclosures===0&&r.modules===4,r);await ctx.close();}
  }
  if(STAGE===3)for(const [w,h] of [[1440,900],[1920,1080],[390,844],[360,800]]){
   const get=async arm=>{const {ctx,page}=await open(arm,w,h);const r=await page.evaluate(()=>{const pl=document.querySelector('#world .ax-chapter-plate'),cp=pl.querySelector('.ax-chapter-copy'),pb=pl.getBoundingClientRect(),cb=cp.getBoundingClientRect();
    const tr=pl.querySelector('.r1p-translation'),lines=tr?Math.round(tr.getBoundingClientRect().height/parseFloat(getComputedStyle(tr).lineHeight)):null,ch=document.querySelector('#chars h2');
    return {plate:+pb.height.toFixed(2),copyInside:!cp||(cb.top>=pb.top-1&&cb.bottom<=pb.bottom+1&&cb.left>=pb.left-1&&cb.right<=pb.right+1),translation:tr?.textContent,lines,charsTitle:ch.textContent,charsFont:getComputedStyle(ch).fontSize};});await ctx.close();return r;};
   const impl=await get('impl'),base=await get('base');
   check(`${w}: W04 frame height equals b85; heading copy inside the frame; RU line single`,Math.abs(impl.plate-base.plate)<.5&&impl.copyInside&&impl.lines===1&&impl.translation==='Город растёт вверх. Глубина закрыта.',{impl,basePlate:base.plate});
  }
  for(const w of [1440,390])for(const arm of ['impl','ad']){
   const {ctx,page}=await open(arm,w,844);await page.addScriptTag({content:AXE});
   const r=await page.evaluate(async ids=>{const x=await axe.run({include:ids.map(i=>['#'+i])},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return {v:x.violations.map(v=>({id:v.id,n:v.nodes.length})),inc:x.incomplete.map(v=>({id:v.id,n:v.nodes.length}))};},NOW);
   report[`axe_${arm}_${w}`]=r;if(arm==='impl')check(`axe/${w}: stage sections 0 violations`,r.v.length===0,r);await ctx.close();}
  check('runtime: no page errors or HTTP ≥ 400 (impl, ad, base)',!errors.length,{errors:errors.slice(0,5)});
 }finally{await browser.close();server.close();}
 report.checks=checks;report.summary=`${checks.filter(c=>c.pass).length}/${checks.length}`;
 fs.writeFileSync(path.join(OUT,'stage-check.json'),JSON.stringify(report,null,1));
 console.log(`\nSELF-CHECK R2.${STAGE}: ${report.summary}`);process.exitCode=checks.some(c=>!c.pass)?1:0;
})().catch(e=>{console.error(e);process.exit(2);});
