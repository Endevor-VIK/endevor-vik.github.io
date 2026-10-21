/* R4: targeted Firefox traces-rail keyboard investigation (impl 685140a from git objects). */
const http=require('http'),cp=require('child_process'),path=require('path'),fs=require('fs');const {firefox,chromium}=require('playwright');
const REPO=process.argv[2],OUT=process.argv[3];const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{const f=decodeURIComponent(new URL(q.url,'http://x').pathname).slice(1)||'index.html';const o=cp.spawnSync('git',['show','685140a:'+f],{cwd:REPO,maxBuffer:64<<20});if(o.status){r.writeHead(404);return r.end();}r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});r.end(o.stdout);});
(async()=>{await new Promise(r=>srv.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+srv.address().port+'/';const out=[];
 const b=await firefox.launch({headless:true});
 for(const w of [390,400,412,430,375,360])for(const rm of ['no-preference','reduce'])for(const js of [true,false])for(const wait of [500,1500]){
  if(wait===1500&&(w!==390))continue;
  const ctx=await b.newContext({viewport:{width:w,height:844},reducedMotion:rm,javaScriptEnabled:js});await ctx.addInitScript(()=>{try{sessionStorage.setItem('axiom_loader_seen','1')}catch(e){}});
  const p=await ctx.newPage();await p.goto(url,{waitUntil:'load'});const rail=p.locator('[data-ad-rail="traces"]');await rail.scrollIntoViewIfNeeded();await rail.focus();
  const geo=await rail.evaluate(e=>({cw:e.clientWidth,sw:e.scrollWidth,pad:getComputedStyle(e).paddingLeft,cols:getComputedStyle(e).gridAutoColumns,offs:[...e.children].map(c=>c.offsetLeft),widths:[...e.children].map(c=>c.getBoundingClientRect().width)}));
  const sl=[await rail.evaluate(e=>e.scrollLeft)];for(let i=0;i<10;i++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(wait);sl.push(Math.round(await rail.evaluate(e=>e.scrollLeft)));}
  out.push({w,rm,js,wait,geo,sl});console.log(JSON.stringify({w,rm,js,wait,sl,maxScroll:geo.sw-geo.cw,offs:geo.offs}));await ctx.close();}
 await b.close();
 // same 390 rail in b85? traces rail is new in R2; compare A+AD prototype is identical markup/CSS (not served here).
 srv.close();fs.writeFileSync(OUT,JSON.stringify(out,null,1));})();
