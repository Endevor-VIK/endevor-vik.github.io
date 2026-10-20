/* R1 concept-only render/probe. No product mutation, no performance verdict. */
const fs=require('fs'), path=require('path'),http=require('http'),crypto=require('crypto'),cp=require('child_process');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'../../../../..');
const base='/tmp/axs-0524-w4r-concepts',run=path.join(base,process.argv[2]||'run-001');
if(fs.existsSync(run))throw new Error('Refuse overwrite');
fs.mkdirSync(base,{recursive:true});
let owned=fs.readdirSync(base).map(n=>path.join(base,n)).filter(p=>fs.existsSync(path.join(p,'.w4r-owned.json'))).map(p=>({p,marker:JSON.parse(fs.readFileSync(path.join(p,'.w4r-owned.json'))),mtime:fs.statSync(p).mtimeMs})).filter(x=>x.marker.uid===process.getuid()&&x.marker.kind==='axs-w4r-concept');
owned.sort((a,b)=>b.mtime-a.mtime);for(let i=0;i<owned.length;i++)if(i>=2||Date.now()-owned[i].mtime>14*86400000){const p=owned[i].p;if(path.dirname(fs.realpathSync(p))!==fs.realpathSync(base))throw Error('Unsafe retention path');fs.rmSync(p,{recursive:true});}
fs.mkdirSync(run);fs.writeFileSync(path.join(run,'.w4r-owned.json'),JSON.stringify({kind:'axs-w4r-concept',uid:process.getuid(),createdAt:new Date().toISOString(),retention:'last3 or14days; <=12MiB captures; no profiles/videos/traces'}));
const report={kind:'R1_PROPOSED_NOT_PRODUCT_QA',at:new Date().toISOString(),sourceHead:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim(),runtimeFreeze:'b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5',checks:[],captures:[],axe:[],pageErrors:[],httpErrors:[],limits:'Chromium concept checks only. No R2 integration/R3 cross-engine/actual200%/performance or independent R4 verdict.'};
const sum=v=>crypto.createHash('sha256').update(v).digest('hex');let bytes=0,browser,server;
function check(name,pass,detail={}){report.checks.push({name,pass,...detail});}
async function shot(page,file,meta){
 const png=await page.screenshot({type:'png',animations:'disabled'});
 const out=path.join(run,file);const p=cp.spawnSync('python3',['-c','import sys,io;from PIL import Image;Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1],"WEBP",quality=80,method=4)',out],{input:png,maxBuffer:1024*1024});if(p.status!==0)throw Error(String(p.stderr));
 const data=fs.readFileSync(out);bytes+=data.length;if(bytes>12*1024**2)throw Error('Capture budget');
 report.captures.push({file,bytes:data.length,sha256:sum(data),...meta,scrollY:await page.evaluate(()=>scrollY)});
}
(async()=>{
 try{
 server=http.createServer((req,res)=>{let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(pathname==='/favicon.ico'){res.writeHead(204);return res.end();}const file=path.resolve(ROOT,'.'+pathname);if(!file.startsWith(ROOT+path.sep)||!(/^\/assets\//.test(pathname)||/^\/docs\/showcase-v031\/evidence\/(w4|w4r)\//.test(pathname))){res.writeHead(403);return res.end();}let data;try{data=fs.readFileSync(file);}catch{res.writeHead(404);return res.end();}const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.woff2':'font/woff2','.js':'text/javascript'};res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true});report.browser=browser.version();report.playwright=require('playwright/package.json').version;
 for(const concept of ['a','b','c']){
  const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});const page=await context.newPage();page.on('pageerror',e=>report.pageErrors.push(String(e)));page.on('response',r=>{if(r.status()>=400)report.httpErrors.push({status:r.status(),path:new URL(r.url()).pathname});});
  await page.goto(url+'/docs/showcase-v031/evidence/w4r/prototypes/'+concept+'.html');await page.evaluate(()=>document.fonts.ready);
  for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[1024,768],[768,1024],[390,844],[360,800]]){
   await page.setViewportSize({width,height});await page.evaluate(()=>scrollTo(0,0));
   const geom=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth,headings:[...document.querySelectorAll('h2,h3,.translation')].filter(e=>e.getBoundingClientRect().left< -1||e.getBoundingClientRect().right>innerWidth+1).map(e=>({text:e.textContent,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right})),prose:[...document.querySelectorAll('article p,.voice-key p,.people-lead,.external-grid p')].map(e=>parseFloat(getComputedStyle(e).fontSize)),fonts:['Oswald','Golos Text','JetBrains Mono'].map(f=>({font:f,loaded:document.fonts.check(`16px "${f}"`)})),animation:document.getAnimations().length}));
   check(`${concept}/${width}: horizontal overflow`,geom.scrollWidth<=width,{actual:geom.scrollWidth});check(`${concept}/${width}: heading bounds`,geom.headings.length===0,{errors:geom.headings});check(`${concept}/${width}: prose floor16`,geom.prose.every(n=>n>=16));check(`${concept}/${width}: three fonts`,geom.fonts.every(f=>f.loaded),{fonts:geom.fonts});check(`${concept}/${width}: static`,geom.animation===0);
  }
  for(const [device,width,height] of [['desktop',1440,900],['mobile',390,844]]){
   await page.setViewportSize({width,height});await page.evaluate(()=>scrollTo(0,0));
   for(const scene of ['doctrine','remains','geography','people']){
    const box=await page.locator('#'+scene).boundingBox();const top=box.y+await page.evaluate(()=>scrollY);const maxScroll=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);const starts=[];
    if(scene==='geography'||scene==='people')starts.push(Math.min(top,maxScroll));else{
     for(let y=top;y<top+box.height;y+=height-90){let actual=Math.min(y,maxScroll);if(!starts.length||actual>starts.at(-1)+20)starts.push(actual);if(actual+height>=top+box.height)break;}
    }
    for(let i=0;i<starts.length;i++){await page.evaluate(y=>scrollTo(0,y),starts[i]);await shot(page,`${concept}-${device}-${scene}-${i+1}.webp`,{concept,device,scene,segment:i+1,viewport:{width,height},dpr:1,mode:'native viewport; reduced motion; WebP80; no retouch/stitch'});}
   }
   await page.locator('#archive').scrollIntoViewIfNeeded();const ab=await page.locator('#archive').boundingBox();await page.evaluate(y=>scrollTo(0,y),ab.y+await page.evaluate(()=>scrollY)-20);await shot(page,`${concept}-${device}-archive.webp`,{concept,device,scene:'archive',viewport:{width,height},dpr:1,mode:'native viewport spotlight; may show a segment of the full archive on mobile'});
   await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const ax=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));report.axe.push({concept,device,violations:ax.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),incomplete:ax.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});check(`${concept}/${device}: axe violations`,ax.violations.length===0);
  }
  await context.close();console.log('captured',concept,report.captures.length,'frames',Math.round(bytes/1024),'KiB');
 }
 // Mockups are static and require no app script. One actual JS-disabled context verifies full core text.
 const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});for(const c of ['a','b','c']){const p=await ctx.newPage();await p.goto(url+'/docs/showcase-v031/evidence/w4r/prototypes/'+c+'.html');check(`${c}: noJS archive prose`,(await p.locator('#archive').textContent()).includes('Целое утрачено.') && await p.locator('#archive blockquote').isVisible());await p.close();}await ctx.close();
 check('no page errors',report.pageErrors.length===0);check('no HTTP errors',report.httpErrors.length===0);report.totalBytes=bytes;report.pass=report.checks.every(c=>c.pass);report.summary={checks:report.checks.length,failed:report.checks.filter(c=>!c.pass).length,captures:report.captures.length};report.prototypeHashes={};for(const n of ['a.html','b.html','c.html','concepts.css','build_concepts.py','capture.cjs'])report.prototypeHashes[n]=sum(fs.readFileSync(path.join(__dirname,n)));fs.writeFileSync(path.join(run,'manifest.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report.summary));process.exitCode=report.pass?0:1;
 }finally{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
