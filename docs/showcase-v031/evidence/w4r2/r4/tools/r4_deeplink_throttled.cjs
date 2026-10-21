/* R4: deep link landing under CDP network+CPU throttling (Lighthouse-mobile-like: 150 ms RTT, 1.6 Mbps, CPU 4x), impl 685140a vs base b85fbb0a.
   Measures: where the target section ends up after load settles, layout shifts (non-input), media state of showcase-w4r.css. */
const http=require('http'),cp=require('child_process'),path=require('path'),fs=require('fs');const {chromium}=require('playwright');
const REPO=process.argv[2],OUT=process.argv[3];const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.woff2':'font/woff2'};
const SHA={impl:'685140a40e55f151f9edcf9e7ab0170773ad4f55',base:'b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5'};const cache=new Map();
const srv=http.createServer((q,r)=>{const m=decodeURIComponent(new URL(q.url,'http://x').pathname).match(/^\/(impl|base)\/(.*)$/);if(!m){r.writeHead(404);return r.end();}
 const f=m[2]||'index.html',k=m[1]+f;let d=cache.get(k);if(!d){const o=cp.spawnSync('git',['show',SHA[m[1]]+':'+f],{cwd:REPO,maxBuffer:64<<20});if(o.status){r.writeHead(404);return r.end();}d=o.stdout;cache.set(k,d);}
 r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});r.end(d);});
(async()=>{await new Promise(r=>srv.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+srv.address().port;const out=[];
 const b=await chromium.launch({headless:true});
 for(const arm of ['base','impl'])for(const hash of ['#manifesto','#modules','#world','#chars'])for(const w of [390,1440])for(let rep=1;rep<=2;rep++){
  const ctx=await b.newContext({viewport:{width:w,height:844}});await ctx.addInitScript(()=>{try{sessionStorage.setItem('axiom_loader_seen','1')}catch(e){};window.__ls=[];new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__ls.push(+e.value.toFixed(4));}).observe({type:'layout-shift',buffered:true});});
  const p=await ctx.newPage();const s=await ctx.newCDPSession(p);await s.send('Network.enable');await s.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1638.4*1024/8,uploadThroughput:675*1024/8});await s.send('Emulation.setCPUThrottlingRate',{rate:4});
  await p.goto(`${url}/${arm}/${hash}`,{waitUntil:'load',timeout:180000});await p.waitForTimeout(3000);
  const r=await p.evaluate(h=>({top:Math.round(document.querySelector(h).getBoundingClientRect().top),y:Math.round(scrollY),media:(document.querySelector('link[href$="showcase-w4r.css"]')||{}).media||null,cls:+window.__ls.reduce((a,b)=>a+b,0).toFixed(4),shifts:window.__ls}),hash);
  out.push({arm,hash,w,rep,...r});console.log(JSON.stringify({arm,hash,w,rep,...r}).slice(0,240));await ctx.close();}
 await b.close();srv.close();fs.writeFileSync(OUT,JSON.stringify(out,null,1));})();
