/* 0524.W4.R R4 — independent reviewer probe (not written by the executor).
   Arms served from Git objects: impl = 685140a, base = b85fbb0a, ad = A+AD @9cf78b0 (assets from b85fbb0a, as the prototype references them).
   Parts:
     fidelity  — Chromium, RM=reduce: element screenshots of each changed section, impl vs ad, pixel diff (PIL)
     keyboard  — WebKit/Chromium/Firefox, 390/360, JS on/off: real keyboard only (Tab into rail, ArrowRight), scrollLeft trace, NO programmatic fallback
     behavior  — per engine at 390: viewer open/Escape/focus return, rail next/prev buttons, study index anchors, RM, OMEGA-0 present
     deeplink  — Chromium: showcase-w4r.css delayed 2 s, open /#work and /#manifesto, record layout shifts and target displacement (D-06 risk)
   Usage: NODE_PATH=... node r4_probe.cjs --repo <git dir> --out <fresh dir> --part fidelity|keyboard|behavior|deeplink [--repeats N] */
const fs=require('fs'),path=require('path'),http=require('http'),cp=require('child_process'),crypto=require('crypto');
const pw=require('playwright');
const arg=k=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:null;};
const REPO=arg('--repo'),OUT=path.resolve(arg('--out')),PART=arg('--part'),REPEATS=+(arg('--repeats')||20);
const IMPL='685140a40e55f151f9edcf9e7ab0170773ad4f55',BASE='b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5',FREEZE='9cf78b0';
const AD='docs/showcase-v031/evidence/w4ad/preview/';
const WEBKIT='/tmp/axs-0524-w4-webkit-deps/webkit-headless.sh';
fs.mkdirSync(OUT,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const show=(ref,p)=>{const o=cp.spawnSync('git',['show',`${ref}:${p}`],{cwd:REPO,maxBuffer:64*1024*1024});return o.status===0?o.stdout:null;};
const AD_LOCAL={'index.html':AD+'ad.html','r1p.css':'docs/showcase-v031/evidence/w4rp/preview/r1p.css','ad.css':AD+'ad.css','ad.js':AD+'ad.js'};
let CSS_DELAY=0;const cache=new Map();
const server=http.createServer(async(req,res)=>{
 const p=decodeURIComponent(new URL(req.url,'http://x').pathname),m=p.match(/^\/(ad|impl|base)(\/.*)?$/);
 if(!m){res.writeHead(404);return res.end();}if(!m[2]){res.writeHead(302,{Location:`/${m[1]}/`});return res.end();}
 const arm=m[1],file=m[2].slice(1)||'index.html';if(file.includes('..')){res.writeHead(403);return res.end();}
 const key=arm+':'+file;let data=cache.get(key);
 if(!data){data=arm==='ad'?(AD_LOCAL[file]?show(FREEZE,AD_LOCAL[file]):/^proposed\/A08/.test(file)?show(FREEZE,AD+'proposed-assets/'+file.slice(9)):/^assets\//.test(file)?show(BASE,file):null)
  :/^(index\.html|assets\/)/.test(file)?show(arm==='impl'?IMPL:BASE,file):null;
  if(!data){res.writeHead(404);return res.end();}cache.set(key,data);}
 if(CSS_DELAY&&file==='assets/css/showcase-w4r.css')await new Promise(r=>setTimeout(r,CSS_DELAY));
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});
const launch=e=>pw[e].launch(e==='webkit'?{headless:true,executablePath:WEBKIT}:{headless:true});
const report={kind:'W4R_R4_INDEPENDENT_PROBE',part:PART,impl:IMPL,base:BASE,freeze:FREEZE,at:new Date().toISOString(),engines:{},results:[]};
const rec=(o)=>{report.results.push(o);console.log(JSON.stringify(o).slice(0,300));};
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const open=async(browser,arm,w,h,opts={},hash='')=>{const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,reducedMotion:'reduce',...opts});
  await ctx.addInitScript(()=>{try{sessionStorage.setItem('axiom_loader_seen','1')}catch(e){}});const page=await ctx.newPage();
  const errs=[];page.on('pageerror',e=>errs.push(String(e)));page.on('response',r=>{if(r.status()>=400)errs.push(r.status()+' '+new URL(r.url()).pathname);});
  await page.goto(`${url}/${arm}/${hash}`,{waitUntil:'load',timeout:60000});
  if(opts.javaScriptEnabled!==false)await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,5000))]));
  return {ctx,page,errs};};
 if(PART==='fidelity'){
  const browser=await launch('chromium');report.engines.chromium=browser.version();
  const HIDE='header.top,.nav,.ticker,.show-mobile-nav,.index-cursor,.v22-scroll-progress,.ad-rail-bar{visibility:hidden!important}*{caret-color:transparent!important}';
  for(const [w,h] of [[1440,900],[1024,768],[390,844],[360,800]]){
   const shots={};
   for(const arm of ['impl','ad']){const {ctx,page,errs}=await open(browser,arm,w,h);
    await page.addStyleTag({content:HIDE});
    const max=await page.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<max;y+=600){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(30);}
    await page.evaluate(async()=>{await Promise.race([Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});})),new Promise(r=>setTimeout(r,8000))]);scrollTo(0,0);});
    await page.waitForTimeout(300);
    shots[arm]={errs};
    for(const id of ['manifesto','modules','work','world','chars']){
     const f=path.join(OUT,`${arm}-${w}-${id}.png`);await page.locator('#'+id).screenshot({path:f,animations:'disabled'});shots[arm][id]=f;}
    await ctx.close();}
   for(const id of ['manifesto','modules','work','world','chars']){
    const r=cp.execFileSync('python3',['-c',`
import sys,json
from PIL import Image,ImageChops
a=Image.open(sys.argv[1]).convert('RGB');b=Image.open(sys.argv[2]).convert('RGB')
out={'size_impl':a.size,'size_ad':b.size}
if a.size==b.size:
  d=ImageChops.difference(a,b).convert('L');px=sum(1 for v in d.getdata() if v>16);out['diff_px']=px;out['diff_pct']=round(100*px/(a.size[0]*a.size[1]),4);out['bbox']=d.point(lambda v:255 if v>16 else 0).getbbox()
  if px:
    bb=out['bbox'];m=Image.new('RGB',(bb[2]-bb[0],bb[3]-bb[1]));
print(json.dumps(out))`,shots.impl[id],shots.ad[id]]).toString();
    rec({part:'fidelity',w,section:id,...JSON.parse(r),errs:{impl:shots.impl.errs.length,ad:shots.ad.errs.length}});}
  }
  await browser.close();
 }
 if(PART==='keyboard'){
  for(const engine of (arg('--engines')||'webkit,chromium,firefox').split(',')){
   const browser=await launch(engine);report.engines[engine]=browser.version();
   const reps=engine==='webkit'?REPEATS:Math.max(3,Math.round(REPEATS/4));
   for(const name of ['surfaces','traces'])for(const js of [false,true])for(const w of [390,360])for(let k=1;k<=reps;k++){
    const {ctx,page}=await open(browser,'impl',w,844,{javaScriptEnabled:js,reducedMotion:'no-preference'});
    const rail=page.locator(`[data-ad-rail="${name}"]`);await rail.scrollIntoViewIfNeeded();await page.waitForTimeout(200);
    // Focus by real Tab navigation: focus the element just before the rail, then press Tab.
    await rail.evaluate(e=>{const all=[...document.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"]),summary,input,select,textarea')].filter(x=>x.offsetParent!==null||x===e);const i=all.indexOf(e);(all[i-1]||document.body).focus();});
    await page.keyboard.press('Tab');const focused=await rail.evaluate(e=>document.activeElement===e);
    const st=()=>rail.evaluate(e=>{const b=e.getBoundingClientRect(),pad=parseFloat(getComputedStyle(e).paddingLeft);const vis=[...e.children].map((c,i)=>{const r=c.getBoundingClientRect();return r.left>=b.left+pad-2&&r.right<=b.right-pad+2?i:-1;}).filter(i=>i>=0);return {sl:Math.round(e.scrollLeft*10)/10,vis};});
    const n=await rail.evaluate(e=>e.children.length);const trace=[await st()];const seen=new Set(trace[0].vis);
    for(let i=0;i<n+1;i++){await page.keyboard.press('ArrowRight');await page.waitForTimeout(500);const s=await st();trace.push(s);s.vis.forEach(x=>seen.add(x));}
    const fwd=seen.size===n;
    for(let i=0;i<n+1;i++){await page.keyboard.press('ArrowLeft');await page.waitForTimeout(500);const s=await st();trace.push({...s,back:true});s.vis.forEach(x=>seen.add(x));}
    // anomaly: a step that moved < 10 px but > 0 (sub-snap), or a step that skipped an item
    const steps=trace.slice(1,n+2).map((s,i)=>Math.round(s.sl-trace[i].sl));
    rec({part:'keyboard',engine,rail:name,js,w,repeat:k,n,focusedByTab:focused,forwardOnly:fwd,reachable:seen.size===n,steps,firstVis:trace.map(t=>t.vis[0]??-1).join(',')});
    await ctx.close();}
   await browser.close();}
 }
 if(PART==='behavior'){
  for(const engine of ['chromium','firefox','webkit']){
   const browser=await launch(engine);report.engines[engine]=browser.version();
   for(const w of [390,1440]){
    const {ctx,page,errs}=await open(browser,'impl',w,844,{reducedMotion:'no-preference'});
    const r={part:'behavior',engine,w};
    r.cssApplied=await page.evaluate(()=>{const l=document.querySelector('link[href$="showcase-w4r.css"]');return l&&l.media;});
    r.omega=await page.evaluate(()=>{const o=document.querySelector('.ax-omega');return !!o&&o.getBoundingClientRect().height>20;});
    r.pulseAnim=await page.evaluate(()=>getComputedStyle(document.querySelector('.ad-pulse-trace')).animationName);
    // viewer
    await page.locator('#ax-tab-01').click();const trig=page.locator('.ax-panel:not([hidden]) .ax-shot-trigger').first();await trig.scrollIntoViewIfNeeded();await trig.click();await page.waitForTimeout(500);
    r.viewerOpen=await page.evaluate(()=>{const d=document.getElementById('showcase-lightbox');return !!d&&(d.open||getComputedStyle(d).display!=='none');});
    await page.keyboard.press('Escape');await page.waitForTimeout(400);
    r.viewerClosed=await page.evaluate(()=>{const d=document.getElementById('showcase-lightbox');return !d.open;});
    r.focusReturned=await page.evaluate(()=>!!document.activeElement&&document.activeElement.classList.contains('ax-shot-trigger'));
    if(w===390){for(const name of ['traces','surfaces']){const bar=page.locator(`[data-ad-rail="${name}"] + .ad-rail-bar`);await bar.scrollIntoViewIfNeeded();
      const n=await page.locator(`[data-ad-rail="${name}"]`).evaluate(e=>e.children.length);
      for(let k=0;k<n-1;k++){await bar.locator('button').nth(1).click();await page.waitForTimeout(700);}
      const last=await bar.locator('output').textContent();const nd=await bar.locator('button').nth(1).isDisabled();
      for(let k=0;k<n-1;k++){await bar.locator('button').nth(0).click();await page.waitForTimeout(700);}
      const first=await bar.locator('output').textContent();const pd=await bar.locator('button').nth(0).isDisabled();
      r[name+'Buttons']={n,last,nextDisabledAtEnd:nd,first,prevDisabledAtStart:pd};}
     const links=await page.locator('.ad-surface-index a').count();const idx=[];
     for(let k=0;k<links;k++){await page.locator('.ad-surface-index a').nth(k).click();await page.waitForTimeout(900);idx.push(await page.locator('[data-ad-rail="surfaces"] + .ad-rail-bar output').textContent());}
     r.indexLinks=idx;}
    r.errors=errs;rec(r);await ctx.close();
   }
   const {ctx,page}=await open(browser,'impl',1440,900,{reducedMotion:'reduce'});
   rec({part:'behavior-rm',engine,pulseAnimRM:await page.evaluate(()=>getComputedStyle(document.querySelector('.ad-pulse-trace')).animationName),
        railSmooth:await page.evaluate(()=>getComputedStyle(document.querySelector('[data-ad-rail]')).scrollBehavior)});await ctx.close();
   await browser.close();}
 }
 if(PART==='deeplink'){
  const browser=await launch('chromium');report.engines.chromium=browser.version();
  for(const delay of [0,2000])for(const hash of ['#work','#manifesto','#modules'])for(const w of [390,1440]){
   CSS_DELAY=delay;const ctx=await browser.newContext({viewport:{width:w,height:844}});await ctx.addInitScript(()=>{try{sessionStorage.setItem('axiom_loader_seen','1')}catch(e){};window.__ls=[];new PerformanceObserver(l=>{for(const e of l.getEntries())window.__ls.push({v:e.value,t:Math.round(e.startTime),input:e.hadRecentInput});}).observe({type:'layout-shift',buffered:true});});
   const page=await ctx.newPage();const t0=Date.now();await page.goto(`${url}/impl/${hash}`,{waitUntil:'domcontentloaded'});
   const samples=[];for(let i=0;i<14;i++){samples.push(await page.evaluate(h=>{const e=document.querySelector(h);return {t:Math.round(performance.now()),top:Math.round(e.getBoundingClientRect().top),media:(document.querySelector('link[href$="showcase-w4r.css"]')||{}).media,y:Math.round(scrollY)};},hash));await page.waitForTimeout(250);}
   const ls=await page.evaluate(()=>window.__ls);
   rec({part:'deeplink',delay,hash,w,cls:+ls.reduce((a,b)=>a+(b.input?0:b.v),0).toFixed(4),shifts:ls.length,targetTopFirst:samples[0].top,targetTopLast:samples.at(-1).top,maxTargetDisplacement:Math.max(...samples.map(s=>Math.abs(s.top-samples.at(-1).top))),mediaFirst:samples[0].media,mediaLast:samples.at(-1).media});
   await ctx.close();}
  CSS_DELAY=0;await browser.close();
 }
 server.close();fs.writeFileSync(path.join(OUT,`r4-${PART}.json`),JSON.stringify(report,null,1));
})().catch(e=>{console.error(e);process.exit(2);});
