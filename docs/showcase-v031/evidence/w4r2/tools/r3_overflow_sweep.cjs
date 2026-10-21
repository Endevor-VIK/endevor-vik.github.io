/* 0524.W4.R R3 — width sweep 320–1920 px: no text element in the changed sections may overflow its own box, and the
   WORLD heading copy must stay inside the W04 frame. Served from Git objects (--impl SHA); executor-run, not R4.
   Usage: NODE_PATH=<ui>/node_modules node r3_overflow_sweep.cjs --impl <sha> --out <fresh dir> [--engines chromium,firefox,webkit] */
const fs=require('fs'),path=require('path'),http=require('http'),cp=require('child_process');
const pw=require('playwright');
const arg=k=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:null;};
const IMPL=arg('--impl'),OUT=path.resolve(arg('--out')||''),ENGINES=(arg('--engines')||'chromium,firefox,webkit').split(',');
if(!IMPL||!arg('--out')||fs.existsSync(OUT))throw Error('usage: --impl <sha> --out <fresh dir> [--engines …]');
const ROOT=path.resolve(__dirname,'../../../../..'),STEP={chromium:2,firefox:4,webkit:8};
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json'};
const server=http.createServer((q,r)=>{const f=decodeURIComponent(new URL(q.url,'http://x').pathname).slice(1)||'index.html';if(!/^(index\.html|assets\/)/.test(f)||f.includes('..')){r.writeHead(404);return r.end();}
 const o=cp.spawnSync('git',['show',`${IMPL}:${f}`],{cwd:ROOT,maxBuffer:32*1024*1024});if(o.status){r.writeHead(404);return r.end();}r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});r.end(o.stdout);});
(async()=>{fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/';
 const report={kind:'W4R_R3_OVERFLOW_SWEEP',label:'Executor-run R3, not the independent R4',impl:IMPL,at:new Date().toISOString(),engines:{}};
 for(const engine of ENGINES){
  const browser=await pw[engine].launch(engine==='webkit'?{headless:true,executablePath:'/tmp/axs-0524-w4-webkit-deps/webkit-headless.sh'}:{headless:true});
  const page=await (await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'})).newPage();
  await page.goto(url,{waitUntil:'load',timeout:60000});await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,5000))]));
  const bad=[];let widths=0;
  for(let w=320;w<=1920;w+=STEP[engine]){widths++;await page.setViewportSize({width:w,height:900});await page.waitForTimeout(engine==='webkit'?60:15);
   const r=await page.evaluate(()=>{const els=[...document.querySelectorAll('#manifesto,#modules,#work,#world,#chars')].flatMap(s=>[...s.querySelectorAll('p,h2,h3,li,figcaption,blockquote .line,.frag-foot b,.m-foot b,.ad-state-k,.ax-chapter-n')]);
    const over=els.filter(e=>getComputedStyle(e).display!=='none'&&e.offsetParent!==null&&e.scrollWidth>e.clientWidth+1).map(e=>e.textContent.trim().slice(0,24)+' +'+(e.scrollWidth-e.clientWidth));
    const pl=document.querySelector('#world .ax-chapter-plate'),cp=pl.querySelector('.ax-chapter-copy'),a=pl.getBoundingClientRect(),c=cp.getBoundingClientRect();
    if(c.top<a.top-1||c.bottom>a.bottom+1||c.right>a.right+1)over.push('WORLD heading copy outside W04 frame');
    if(document.documentElement.scrollWidth>document.documentElement.clientWidth)over.push('page overflow +'+(document.documentElement.scrollWidth-document.documentElement.clientWidth));
    return [...new Set(over)];});
   if(r.length)bad.push({w,issues:r});}
  report.engines[engine]={version:browser.version(),widths,step:STEP[engine],failures:bad};await browser.close();
  console.log(`[${engine}] ${widths} widths, ${bad.length} with issues`+(bad.length?': '+JSON.stringify(bad.slice(0,4)):''));
 }
 server.close();fs.writeFileSync(path.join(OUT,'r3-overflow-sweep.json'),JSON.stringify(report,null,1));
 process.exitCode=Object.values(report.engines).some(e=>e.failures.length)?1:0;
})().catch(e=>{console.error(e);process.exit(2);});
