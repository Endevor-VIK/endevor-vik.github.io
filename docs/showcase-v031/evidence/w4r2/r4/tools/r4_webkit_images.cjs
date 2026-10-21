/* R4: WebKit — do all images with a currentSrc finish loading after a slow full scroll? impl vs base. */
const http=require('http'),cp=require('child_process'),path=require('path'),fs=require('fs');const {webkit}=require('playwright');
const REPO=process.argv[2],OUT=process.argv[3];const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.woff2':'font/woff2'};
const SHA={impl:'685140a40e55f151f9edcf9e7ab0170773ad4f55',base:'b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5'};const cache=new Map();const errs=[];
const srv=http.createServer((q,r)=>{const m=decodeURIComponent(new URL(q.url,'http://x').pathname).match(/^\/(impl|base)\/(.*)$/);if(!m){r.writeHead(404);return r.end();}
 const f=m[2]||'index.html',k=m[1]+f;let d=cache.get(k);if(!d){const o=cp.spawnSync('git',['show',SHA[m[1]]+':'+f],{cwd:REPO,maxBuffer:64<<20});if(o.status){errs.push(k);r.writeHead(404);return r.end();}d=o.stdout;cache.set(k,d);}
 r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});r.end(d);});
(async()=>{await new Promise(r=>srv.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+srv.address().port;const out=[];
 const b=await webkit.launch({headless:true,executablePath:'/tmp/axs-0524-w4-webkit-deps/webkit-headless.sh'});
 for(const [w,h] of [[1440,900],[844,390]])for(const arm of ['impl','base'])for(let rep=1;rep<=2;rep++){
  const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});await ctx.addInitScript(()=>{try{sessionStorage.setItem('axiom_loader_seen','1')}catch(e){}});
  const p=await ctx.newPage();await p.goto(`${url}/${arm}/`,{waitUntil:'load'});
  const max=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<max;y+=Math.round(h*0.6)){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(350);}
  await p.waitForTimeout(3000);
  const r=await p.evaluate(()=>{const imgs=[...document.images].filter(i=>i.currentSrc);return {withSrc:imgs.length,incomplete:imgs.filter(i=>!i.complete).map(i=>i.currentSrc.split('/').pop()),zeroNatural:imgs.filter(i=>i.complete&&!i.naturalWidth).map(i=>i.currentSrc.split('/').pop())};});
  out.push({w,h,arm,rep,...r});console.log(JSON.stringify({w,h,arm,rep,...r}));await ctx.close();}
 await b.close();srv.close();fs.writeFileSync(OUT,JSON.stringify({out,http404:errs},null,1));console.log('404s',errs);})();
