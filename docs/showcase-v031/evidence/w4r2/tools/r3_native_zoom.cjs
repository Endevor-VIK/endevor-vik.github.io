#!/usr/bin/env node
'use strict';
/* 0524.W4.R R3 — actual browser page zoom 200 % (method of evidence/w4/tools/native_zoom.cjs): headed Chromium in Xvfb,
   a minimal local extension calls chrome.tabs.setZoom(2); no CSS zoom, pinch or device emulation. BEFORE = b85fbb0a,
   IMPLEMENTED = --impl SHA, both served from Git objects. Checks reflow (no horizontal overflow, prose inside its box,
   nothing clipped) in every changed section, rails at the zoomed width, and keeps native reading frames.
   Usage: CHROME_PATH=<chromium 149> NODE_PATH=<ui>/node_modules xvfb-run -a -s "-screen 0 1920x1080x24" \
          node r3_native_zoom.cjs --impl <sha> --out <fresh dir> */
const fs=require('fs'),path=require('path'),http=require('http'),crypto=require('crypto'),cp=require('child_process');
const {chromium}=require('playwright');
const arg=k=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:null;};
const IMPL=arg('--impl'),OUT=path.resolve(arg('--out')||'');
if(!IMPL||!arg('--out')||fs.existsSync(OUT))throw Error('usage: --impl <sha> --out <fresh dir>');
const ROOT=path.resolve(__dirname,'../../../../..'),PRODUCT='b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
fs.mkdirSync(OUT,{recursive:true});
const extension=path.join(OUT,'extension'),profile=path.join(OUT,'profile');fs.mkdirSync(extension);
fs.writeFileSync(path.join(extension,'manifest.json'),JSON.stringify({manifest_version:3,name:'W4R native zoom',version:'1.0',permissions:['tabs'],host_permissions:['http://127.0.0.1/*'],background:{service_worker:'worker.js'}}));
fs.writeFileSync(path.join(extension,'worker.js'),'chrome.runtime.onInstalled.addListener(()=>{});');
let ref=PRODUCT;
const server=http.createServer((q,r)=>{let f=decodeURIComponent(new URL(q.url,'http://x').pathname).slice(1)||'index.html';if(!/^(index\.html|assets\/)/.test(f)||f.includes('..')){r.writeHead(404);return r.end();}
 const o=cp.spawnSync('git',['show',`${ref}:${f}`],{cwd:ROOT,maxBuffer:32*1024*1024});if(o.status){r.writeHead(404);return r.end();}
 r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});r.end(o.stdout);});
const report={kind:'W4R_R3_NATIVE_ZOOM_200',label:'Executor-run R3, not the independent R4',impl:IMPL,before:PRODUCT,at:new Date().toISOString(),checks:[],captures:[]};
const check=(id,ok,detail)=>{report.checks.push({id,ok:!!ok,detail});console.log((ok?'PASS ':'FAIL ')+id+' '+JSON.stringify(detail).slice(0,240));};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/';
 const browser=await chromium.launchPersistentContext(profile,{headless:false,viewport:null,executablePath:process.env.CHROME_PATH,ignoreDefaultArgs:['--disable-extensions'],
  args:['--window-size=1920,1080','--disable-gpu','--use-gl=swiftshader','--disable-extensions-except='+extension,'--load-extension='+extension,'--force-prefers-reduced-motion']});
 try{
  const worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker');const page=browser.pages()[0]||await browser.newPage();
  await page.addInitScript(()=>sessionStorage.setItem('axiom_loader_seen','1'));
  for(const [label,r] of [['before',PRODUCT],['impl',IMPL]]){
   ref=r;await page.goto(url+'?'+label,{waitUntil:'load'});await page.bringToFront();await page.evaluate(()=>document.fonts.ready);
   const native=await worker.evaluate(async u=>{const t=(await chrome.tabs.query({})).find(t=>t.url.startsWith(u));if(!t)throw Error('tab missing');await chrome.tabs.setZoom(t.id,2);return {zoom:await chrome.tabs.getZoom(t.id)};},url);
   await page.waitForTimeout(800);
   const m=await page.evaluate(()=>({innerWidth,innerHeight,dpr:devicePixelRatio,visualScale:visualViewport.scale,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}));
   check(`${label}: native 200 % page zoom`,native.zoom===2&&m.dpr===2&&m.visualScale===1&&m.innerWidth<=1000,{native,m});
   check(`${label}: no horizontal page overflow at 200 %`,m.overflow<=0,{overflow:m.overflow});
   for(const id of ['manifesto','modules','work','world','chars']){
    const st=await page.evaluate(id=>{const s=document.getElementById(id),r=s.getBoundingClientRect();
     const prose=[...s.querySelectorAll('p,h2,h3,li,figcaption,blockquote .line')].filter(e=>getComputedStyle(e).display!=='none'&&e.offsetParent!==null);
     const over=prose.filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.tagName+':'+e.textContent.trim().slice(0,40));
     const out=prose.filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.left<r.left-1||b.right>r.right+1);}).map(e=>e.textContent.trim().slice(0,40));
     return {sectionOverflow:s.scrollWidth-s.clientWidth,proseOverflow:over.slice(0,5),outside:out.slice(0,5),rails:[...s.querySelectorAll('[data-ad-rail]')].map(e=>({rail:e.dataset.adRail,scroll:e.scrollWidth>e.clientWidth+4}))};},id);
    check(`${label} #${id}: reflow at 200 % (no overflow, prose inside)`,st.sectionOverflow<=1&&!st.proseOverflow.length&&!st.outside.length,st);
   }
   if(label==='impl')for(const [sel,name] of [['#manifesto .doctrine-quote','terminal'],['#manifesto .ad-traces','traces'],['#modules .r1p-aftermath','aftermath'],['#modules .r1p-dependence','dependence'],['#work-surfaces','surfaces'],['#world .ax-chapter-plate','world-heading'],['#world .r1p-map-intro','world-intro'],['#chars .r1p-character-intro','chars-intro']]){
    await page.evaluate(s=>{const e=document.querySelector(s);window.scrollTo({top:scrollY+e.getBoundingClientRect().top-24,behavior:'instant'});},sel);await page.waitForTimeout(250);
    await page.addStyleTag({content:'header.top,.nav,.ticker,.index-cursor,.v22-scroll-progress{visibility:hidden!important}'});
    const cdp=await browser.newCDPSession(page);const snap=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:82,fromSurface:true,captureBeyondViewport:false});await cdp.detach();
    const buf=Buffer.from(snap.data,'base64'),file=`zoom200-impl-${name}.jpg`;fs.writeFileSync(path.join(OUT,file),buf);
    const stats=JSON.parse(cp.execFileSync('python3',['-c','import io,json,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGB");c=im.getcolors(im.width*im.height);print(json.dumps({"w":im.width,"h":im.height,"colors":len(c),"dominant":max(n for n,_ in c)/(im.width*im.height)}))'],{input:buf}).toString());
    check(`impl frame ${name}: native, non-blank`,stats.colors>32&&stats.dominant<.98&&stats.w>=1800,stats);report.captures.push({file,selector:sel,bytes:buf.length,sha256:hash(buf),...stats});
   }
  }
 }finally{await browser.close();server.close();fs.rmSync(profile,{recursive:true,force:true});}
 report.summary=`${report.checks.filter(c=>c.ok).length}/${report.checks.length}`;fs.writeFileSync(path.join(OUT,'r3-native-zoom.json'),JSON.stringify(report,null,1));
 console.log('R3 native zoom',report.summary);process.exitCode=report.checks.some(c=>!c.ok)?1:0;
})().catch(e=>{console.error(e);process.exit(2);});
