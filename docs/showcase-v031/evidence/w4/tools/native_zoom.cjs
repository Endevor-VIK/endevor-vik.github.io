#!/usr/bin/env node
'use strict';
// Native Chromium page zoom through extension API; no CSS zoom/pinch/device emulation.
const fs=require('fs'),path=require('path'),http=require('http'),crypto=require('crypto'),cp=require('child_process');
const {chromium}=require('playwright');
const argv=process.argv.slice(2),arg=k=>argv[argv.indexOf(k)+1];
const before=path.resolve(arg('--before-root')),after=path.resolve(arg('--after-root')),out=path.resolve(arg('--out'));
const parent='/tmp/axs-0524-w4-zoom',marker='.w4-owned';
if(path.dirname(out)!==parent||fs.existsSync(out))throw Error('New owned output required');
fs.mkdirSync(parent,{recursive:true});
const old=fs.readdirSync(parent).map(n=>path.join(parent,n)).filter(p=>fs.statSync(p).isDirectory()&&fs.existsSync(path.join(p,marker))).sort((a,b)=>fs.statSync(b).mtimeMs-fs.statSync(a).mtimeMs);
for(const p of old.filter((p,i)=>i>=2||Date.now()-fs.statSync(p).mtimeMs>14*864e5)){if(fs.realpathSync(p)!==p)throw Error('Unexpected symlink');fs.rmSync(p,{recursive:true})}
fs.mkdirSync(out);fs.writeFileSync(path.join(out,marker),'0524.W4 native zoom QA\n');
const extension=path.join(out,'extension'),profile=path.join(out,'profile');fs.mkdirSync(extension);
fs.writeFileSync(path.join(extension,'manifest.json'),JSON.stringify({manifest_version:3,name:'W4 native zoom qualification',version:'1.0',permissions:['tabs'],host_permissions:['http://127.0.0.1/*'],background:{service_worker:'worker.js'}}));
fs.writeFileSync(path.join(extension,'worker.js'),'chrome.runtime.onInstalled.addListener(()=>{});');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const git=(root,...a)=>cp.execFileSync('git',['-C',root,...a],{encoding:'utf8'}).trim();
const report={createdAt:new Date().toISOString(),environment:{node:process.version,playwright:require('playwright/package.json').version},runnerSha256:hash(__filename),method:'foreground headed Chromium in Xvfb with software rendering; chrome.tabs.setZoom/getZoom(2); direct native CDP screenshots without clipping; no CSS/CDP scaling',samples:[],checks:[],captures:[]};
let root=before,browser,server;
const record=(id,ok,detail)=>report.checks.push({id,ok,detail});
const save=()=>fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(report,null,2));
const pixelStats=buf=>JSON.parse(cp.execFileSync('python3',['-c','import io,json,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGB");colors=im.getcolors(im.width*im.height);print(json.dumps({"width":im.width,"height":im.height,"colors":len(colors),"dominantFraction":max(c for c,p in colors)/(im.width*im.height),"extrema":im.getextrema()}))'],{input:buf,encoding:'utf8'}));
const visible=p=>p.colors>32&&p.dominantFraction<.98;
async function captureNative(page,label,name,selector){
await page.bringToFront();await page.evaluate(()=>Promise.race([new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))),new Promise(r=>setTimeout(r,3000))]));await page.waitForTimeout(250);
const cdp=await browser.newCDPSession(page);const attempts=[];let buf,pixels,method;
for(const fromSurface of [true,false]){const snap=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:80,fromSurface,captureBeyondViewport:false});buf=Buffer.from(snap.data,'base64');pixels=pixelStats(buf);method='CDP Page.captureScreenshot fromSurface='+fromSurface;attempts.push({method,pixels});if(visible(pixels))break}await cdp.detach();
if(!visible(pixels)){buf=cp.execFileSync('import',['-window','root','jpeg:-'],{maxBuffer:8*1024*1024});pixels=pixelStats(buf);method='native Xvfb root window (browser chrome included)';attempts.push({method,pixels})}
const file=label+'-'+name+'.jpg';fs.writeFileSync(path.join(out,file),buf);
record(label+'-'+name+'-visible-native-frame',visible(pixels),{method,pixels});report.captures.push({path:file,sha256:hash(path.join(out,file)),bytes:buf.length,selector,method,pixels,attempts});
}
(async()=>{
 server=http.createServer((q,r)=>{let f=path.resolve(root,'.'+new URL(q.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)&&f!==root){r.writeHead(403);return r.end()};if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){r.writeHead(404);return r.end()};r.setHeader('Cache-Control','no-store');r.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.avif':'image/avif','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(r)});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/';
 browser=await chromium.launchPersistentContext(profile,{headless:false,viewport:null,executablePath:process.env.CHROME_PATH,ignoreDefaultArgs:['--disable-extensions'],args:['--window-size=1920,1080','--disable-gpu','--disable-extensions-except='+extension,'--load-extension='+extension],reducedMotion:'reduce',locale:'ru-RU',timezoneId:'Europe/Moscow'});
 const worker=browser.serviceWorkers()[0]||await browser.waitForEvent('serviceworker');const page=browser.pages()[0]||await browser.newPage();
 await page.addInitScript(()=>sessionStorage.setItem('axiom_loader_seen','1'));
 for(const [label,p] of [['before',before],['after',after]]){
  root=p;await page.goto(url,{waitUntil:'load'});await page.bringToFront();await page.evaluate(()=>document.fonts.ready);
  const native=await worker.evaluate(async u=>{const t=(await chrome.tabs.query({})).find(t=>t.url===u);if(!t)throw Error('Target tab missing');await chrome.tabs.setZoom(t.id,2);return{zoom:await chrome.tabs.getZoom(t.id),tabId:t.id}},url);await page.waitForTimeout(200);
  const metrics=await page.evaluate(()=>({innerWidth,innerHeight,outerWidth,outerHeight,dpr:devicePixelRatio,visualScale:visualViewport.scale,ua:navigator.userAgent,visibility:document.visibilityState,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}));
  record(label+'-native-200-percent',native.zoom===2&&metrics.visualScale===1&&metrics.dpr===2&&metrics.innerWidth<=1000&&metrics.overflow<=1,{native,metrics});
  const scenes=[];
  for(const [selector,name]of [['#world-guide','entry'],['#manifesto','black-sun'],['#modules','what-remains'],['#factions','factions']]){
   await page.locator(selector).scrollIntoViewIfNeeded();await page.evaluate(s=>{const x=document.querySelector(s);window.scrollTo({top:scrollY+x.getBoundingClientRect().top-150,behavior:'instant'})},selector);await page.waitForTimeout(150);
   const state=await page.locator(selector).evaluate(x=>({width:x.clientWidth,overflow:x.scrollWidth-x.clientWidth,title:x.querySelector('h2')?.textContent,prose:[...x.querySelectorAll('p')].filter(y=>getComputedStyle(y).display!=='none').map(y=>({overflow:y.scrollWidth-y.clientWidth,font:getComputedStyle(y).fontSize}))}));
   record(label+'-'+name+'-reflow',state.overflow<=1&&state.prose.every(x=>x.overflow<=1),state);scenes.push({selector,state});
   await captureNative(page,label,name,selector);
  }
  const reading=[['#v22-world-title','entry-reading'],[label==='after'?'#manifesto [data-world-beat=before]':'#manifesto .ql','black-sun-reading'],[label==='after'?'.ax-remains-topics':'#modules .module .m-body','what-remains-reading'],['#factions .faction p','factions-reading']];
  if(label==='after')reading.push(['.ax-archive-attribution','archive-attribution-reading']);
  for(const [selector,name]of reading){await page.locator(selector).first().scrollIntoViewIfNeeded();await page.evaluate(s=>{const x=document.querySelector(s);window.scrollTo({top:scrollY+x.getBoundingClientRect().top-70,behavior:'instant'})},selector);await captureNative(page,label,name,selector)}
  if(label==='after'){
   for(const n of ['02','03','05']){await page.locator('#ax-tab-'+n).click();const summary=page.locator('#ax-panel-'+n+' summary');await summary.focus();await page.keyboard.press('Enter');const state=await summary.evaluate(s=>({focus:document.activeElement===s,open:s.parentElement.open,overflow:s.parentElement.scrollWidth-s.parentElement.clientWidth}));record('after-nativezoom-context-'+n,state.open&&state.focus&&state.overflow<=1,state);await page.keyboard.press('Space')}
   await page.addScriptTag({content:fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8')});report.targetedAxe=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'rule',values:['aria-prohibited-attr','color-contrast']}});return{violations:r.violations.map(x=>({id:x.id,nodes:x.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))})),incomplete:r.incomplete.map(x=>({id:x.id,nodes:x.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))}))}});record('after-nativezoom-targeted-axe',report.targetedAxe.violations.length===0,report.targetedAxe);
  }
  report.samples.push({phase:label,sourceSha:git(p,'rev-parse','HEAD'),indexSha256:hash(path.join(p,'index.html')),runtimeDelta:git(p,'diff','HEAD','--','index.html','assets'),native,metrics,scenes});save();
 }
 report.completedAt=new Date().toISOString();report.summary={checks:report.checks.length,failed:report.checks.filter(x=>!x.ok).length};save();console.log(JSON.stringify(report.summary));if(report.summary.failed)process.exitCode=1;
})().catch(e=>{report.fatal=String(e);save();console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));if(fs.existsSync(profile)&&fs.realpathSync(profile)===profile&&fs.existsSync(path.join(out,marker)))fs.rmSync(profile,{recursive:true})});
