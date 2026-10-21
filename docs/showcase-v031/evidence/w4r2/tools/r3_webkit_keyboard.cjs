/* 0524.W4.R R3 supplement — WebKit keyboard reachability of every rail item, forward then backward, repeated.
   The matrix walks forward only; in WebKit the first ArrowRight after focus occasionally moves a snap rail by 1 px and the
   next press skips an item. A visitor can step back with ArrowLeft, so reachability is judged over a forward+backward pass.
   Usage: NODE_PATH=<ui>/node_modules node r3_webkit_keyboard.cjs --impl <sha> --out <fresh dir> [--repeats 5] */
const fs=require('fs'),path=require('path'),http=require('http'),cp=require('child_process');
const {webkit}=require('playwright');
const arg=k=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:null;};
const IMPL=arg('--impl'),OUT=path.resolve(arg('--out')||''),REPEATS=+(arg('--repeats')||5);
if(!IMPL||!arg('--out')||fs.existsSync(OUT))throw Error('usage: --impl <sha> --out <fresh dir> [--repeats N]');
const ROOT=path.resolve(__dirname,'../../../../..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json'};
const server=http.createServer((q,r)=>{const f=decodeURIComponent(new URL(q.url,'http://x').pathname).slice(1)||'index.html';if(!/^(index\.html|assets\/)/.test(f)||f.includes('..')){r.writeHead(404);return r.end();}
 const o=cp.spawnSync('git',['show',`${IMPL}:${f}`],{cwd:ROOT,maxBuffer:32*1024*1024});if(o.status){r.writeHead(404);return r.end();}r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});r.end(o.stdout);});
(async()=>{fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/';
 const browser=await webkit.launch({headless:true,executablePath:'/tmp/axs-0524-w4-webkit-deps/webkit-headless.sh'});
 const report={kind:'W4R_R3_WEBKIT_KEYBOARD',impl:IMPL,webkit:browser.version(),at:new Date().toISOString(),runs:[]};
 const vis=rail=>rail.evaluate(e=>{const b=e.getBoundingClientRect(),pad=parseFloat(getComputedStyle(e).paddingLeft);return [...e.children].map((c,i)=>{const r=c.getBoundingClientRect();return r.left>=b.left+pad-2&&r.right<=b.right-pad+2?i:-1;}).filter(i=>i>=0);});
 for(const name of ['traces','surfaces'])for(const js of [true,false])for(const w of [390,360])for(let k=1;k<=REPEATS;k++){
  const ctx=await browser.newContext({viewport:{width:w,height:844},javaScriptEnabled:js});const page=await ctx.newPage();await page.goto(url,{waitUntil:'load',timeout:60000});
  const rail=page.locator(`[data-ad-rail="${name}"]`);await rail.scrollIntoViewIfNeeded();await rail.focus();
  const n=await rail.evaluate(e=>e.children.length),forward=new Set(await vis(rail)),all=new Set(forward);
  for(let i=0;i<n+1;i++){await page.keyboard.press('ArrowRight');await page.waitForTimeout(400);(await vis(rail)).forEach(x=>{forward.add(x);all.add(x);});}
  for(let i=0;i<n+1;i++){await page.keyboard.press('ArrowLeft');await page.waitForTimeout(400);(await vis(rail)).forEach(x=>all.add(x));}
  report.runs.push({rail:name,js,w,repeat:k,n,forwardOnly:forward.size===n,reachable:all.size===n,seen:[...all].sort()});await ctx.close();
 }
 await browser.close();server.close();
 const bad=report.runs.filter(r=>!r.reachable),fwd=report.runs.filter(r=>!r.forwardOnly);
 report.summary={runs:report.runs.length,reachable:report.runs.length-bad.length,forwardOnlyComplete:report.runs.length-fwd.length};
 fs.writeFileSync(path.join(OUT,'r3-webkit-keyboard.json'),JSON.stringify(report,null,1));
 console.log('WebKit keyboard: reachable',report.summary.reachable+'/'+report.summary.runs,'· forward-only complete',report.summary.forwardOnlyComplete+'/'+report.summary.runs);
 process.exitCode=bad.length?1:0;
})().catch(e=>{console.error(e);process.exit(2);});
