/* Native full-context R1.P evidence, never a performance or artistic acceptance test. */
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const {chromium}=require('playwright');const {makeServer,ROOT,REFS}=require('./serve.cjs');
const pilot=process.argv.includes('--pilot'),base='/tmp/axs-0524-w4rp',name=process.argv[2]||'run-001',run=path.join(base,name);
if(!/^run-\d{3}$/.test(name)||fs.existsSync(run))throw Error('Use a fresh run-NNN');
fs.mkdirSync(base,{recursive:true});
const previous=fs.readdirSync(base).map(n=>path.join(base,n)).filter(p=>fs.existsSync(path.join(p,'.owned.json'))).map(p=>({p,m:JSON.parse(fs.readFileSync(path.join(p,'.owned.json'))),at:fs.statSync(p).mtimeMs})).filter(x=>x.m.uid===process.getuid()&&x.m.kind==='axs-w4rp-native');
previous.sort((a,b)=>b.at-a.at);previous.forEach((x,i)=>{if(i>=2||Date.now()-x.at>14*864e5){if(path.dirname(fs.realpathSync(x.p))!==fs.realpathSync(base))throw Error('Unsafe retention');fs.rmSync(x.p,{recursive:true});}});
fs.mkdirSync(run);fs.writeFileSync(path.join(run,'.owned.json'),JSON.stringify({uid:process.getuid(),kind:'axs-w4rp-native',createdAt:new Date().toISOString(),retention:'last3 or14days',ceilingMiB:128}));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const report={kind:pilot?'R1P_QUALIFICATION':'R1P_NATIVE_REAL_PAGE_PROOF',at:new Date().toISOString(),refs:REFS,reportingStart:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim(),states:{dpr:1,reducedMotion:'reduce',gallery:'01',map:'02.01',dialogs:'closed',loader:'returning visitor via original sessionStorage flag',screenshots:'native viewport; no style injection, image retouch, stitching or resampling; WebP80'},captures:[],geometry:[],checks:[],pageErrors:[],httpErrors:[],limits:'Isolated R1.P only, not product integration/G3/G4/performance/artistic PASS. Concurrent host workloads may exist.'};
for(const n of ['aplus.html','r1p.css','build_aplus.py','serve.cjs','capture.cjs'])report.hashes??={},report.hashes[n]=hash(fs.readFileSync(path.join(__dirname,n)));
let browser,server,bytes=0;const check=(name,pass,detail)=>report.checks.push({name,pass,...detail});
async function shot(page,file,meta){
 const png=await page.screenshot({type:'png',animations:'disabled'}),out=path.join(run,file);
 const p=cp.spawnSync('python3',['-c','import sys,io;from PIL import Image;Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1],"WEBP",quality=80,method=4)',out],{input:png,maxBuffer:1024*1024});if(p.status!==0)throw Error(String(p.stderr));
 const buf=fs.readFileSync(out);bytes+=buf.length;if(bytes>32*1024**2)throw Error('Durable capture ceiling32MiB');
 report.captures.push({file,...meta,scrollY:await page.evaluate(()=>scrollY),bytes:buf.length,sha256:hash(buf)});
}
async function prepare(page){
 await page.evaluate(()=>document.fonts.ready);await page.locator('#ax-tab-01').click();
 await page.locator('.v23-map-node[data-canon-id="02.01"]').click();
 // A genuine sequential scroll triggers native lazy loading/reveals, without modifying CSS/DOM.
 const max=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
 for(let y=0;y<=max;y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(16);}
 await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
 await page.waitForTimeout(200);
 await page.evaluate(async()=>{await Promise.all([...document.images].filter(i=>i.currentSrc).map(i=>i.decode().catch(()=>{})));});
 await page.mouse.move(0,0);await page.evaluate(()=>scrollTo(0,0));
}
async function geometry(page,arm,width,height){
 const g=await page.evaluate(()=>{
  const selectors={w04:'#world .ax-chapter-plate',w04Image:'#world .ax-chapter-plate img',map:'.v23-map-composition',mapImage:'.v23-map-image img',nodes:'.v23-map-node-grid',omega:'.ax-omega',cards:'#chars .chars',card:'#chars .char',portrait:'#chars .char .img',portraitImage:'#chars .char .img img',axiom:'.axiom-entity',shot:'.ax-panel:not([hidden]) .ax-shot',shotImage:'.ax-panel:not([hidden]) .ax-shot img',doctrine:'.doctrine-stage',terminal:'.doctrine-quote',surfaces:'.modules',orbit:'.orbit',entity:'.content-vis',routes:'.carto-vis',radar:'.radar-mini'};
  const items={};for(const [name,sel]of Object.entries(selectors)){items[name]=[...document.querySelectorAll(sel)].map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {width:r.width,height:r.height,fontSize:s.fontSize,objectFit:s.objectFit,objectPosition:s.objectPosition,display:s.display,src:e.currentSrc?.split('/assets/')[1]||null};});}
  const sections={};for(const s of document.querySelectorAll('main section,body>section')){if(s.id){const r=s.getBoundingClientRect();sections[s.id]={y:r.y+scrollY,height:r.height};}}
  return {items,sections,scrollWidth:document.documentElement.scrollWidth,innerWidth,fonts:['Oswald','Golos Text','JetBrains Mono'].map(f=>({font:f,loaded:document.fonts.check(`16px "${f}"`)})),brokenImages:[...document.images].filter(i=>i.currentSrc&&(!i.complete||!i.naturalWidth)).map(i=>i.currentSrc),states:{gallery:document.querySelector('.ax-tab[aria-selected="true"]')?.id,map:document.querySelector('.v23-map-node[aria-pressed="true"]')?.dataset.canonId,dialogs:document.querySelectorAll('dialog[open]').length}};
 });
 report.geometry.push({arm,width,height,...g});check(`${arm}/${width}: page overflow`,g.scrollWidth<=width,{actual:g.scrollWidth});check(`${arm}/${width}: all images loaded`,!g.brokenImages.length,{broken:g.brokenImages});check(`${arm}/${width}: fonts`,g.fonts.every(f=>f.loaded),{fonts:g.fonts});
 return g;
}
(async()=>{
 try{
  server=makeServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({headless:true});report.browser=browser.version();report.playwright=require('playwright/package.json').version;
  for(const [width,height]of (pilot?[[1440,900],[390,844]]:[[1440,900],[1920,1080],[390,844],[360,800]]))for(const arm of (pilot?['aplus']:['before','current','aplus'])){
   const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});await ctx.addInitScript(()=>{sessionStorage.setItem('axiom_loader_seen','1');});
   const page=await ctx.newPage();page.on('pageerror',e=>report.pageErrors.push({arm,width,error:String(e)}));page.on('response',r=>{if(r.status()>=400)report.httpErrors.push({arm,width,path:new URL(r.url()).pathname,status:r.status()});});
   await page.goto(`${url}/${arm}/`,{waitUntil:'load'});await prepare(page);await geometry(page,arm,width,height);
   const scenes=pilot?[['archive','.doctrine-stage'],['fragments','#manifesto .fragments'],['aftermath','#modules'],['world','#world'],['characters','#chars'],['surfaces','#work-surfaces']]:[['work','#work'],['doctrine','#manifesto'],['aftermath','#modules'],['world','#world'],['characters','#chars'],...(arm==='aplus'?[['surfaces','#work-surfaces']]:[])];
   for(const [scene,sel]of scenes){
    const box=await page.locator(sel).boundingBox();if(!box)throw Error('Missing '+sel);const top=box.y+await page.evaluate(()=>scrollY),end=top+box.height,max=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight),step=height-125;
    const starts=[];if(pilot){starts.push(Math.max(0,top-110));if(scene==='surfaces')starts.push(top+Math.min(box.height-height,600));}else for(let y=Math.max(0,top-140);;y+=step){const actual=Math.min(y,max);if(!starts.length||actual>starts.at(-1)+15)starts.push(actual);if(actual+height>=end+110||actual>=max)break;}
    for(let i=0;i<starts.length;i++){await page.evaluate(y=>scrollTo(0,y),starts[i]);await page.waitForTimeout(30);await shot(page,`${arm}-${width}-${scene}-${String(i+1).padStart(2,'0')}.webp`,{arm,width,height,scene,segment:i+1,total:starts.length,sectionTop:top,sectionBottom:end});}
   }
   if(!pilot){
    for(const id of ['02','03','05']){
     await page.locator('#ax-tab-'+id).click();await page.locator('#ax-panel-'+id+' img').evaluate(i=>i.decode());
     for(const opened of (arm==='current'?[false,true]:[false])){
      if(opened)await page.locator('#ax-panel-'+id+' .ax-case-context summary').click();
      const box=await page.locator('#ax-panel-'+id).boundingBox(),top=box.y+await page.evaluate(()=>scrollY),end=top+box.height,starts=[];
      for(let y=top-110;;y+=height-125){starts.push(Math.max(0,y));if(y+height>=end+40)break;}
      const scene='work'+id+(opened?'-disclosure':'');
      for(let i=0;i<starts.length;i++){await page.evaluate(y=>scrollTo(0,y),starts[i]);await page.waitForTimeout(30);await shot(page,`${arm}-${width}-${scene}-${String(i+1).padStart(2,'0')}.webp`,{arm,width,height,scene,segment:i+1,total:starts.length,sectionTop:top,sectionBottom:end,state:{gallery:id,disclosure:opened?'open':'closed',kind:opened?'CURRENT_ONLY_DETAIL_NOT_PAIRED':'MATCHED_SELECTION'}});}
      if(opened)await page.locator('#ax-panel-'+id+' .ax-case-context summary').click();
     }
    }
   }
   await ctx.close();console.log(`${arm} ${width} captured; ${report.captures.length} frames / ${(bytes/1024**2).toFixed(2)}MiB`);
  }
  if(!pilot){
   for(const width of [1440,1920,390,360]){
    const a=report.geometry.find(g=>g.arm==='aplus'&&g.width===width),c=report.geometry.find(g=>g.arm==='current'&&g.width===width),b=report.geometry.find(g=>g.arm==='before'&&g.width===width);
    for(const key of ['w04','w04Image','map','mapImage','nodes','omega','cards','card','portrait','portraitImage','axiom','shot','shotImage']){
     check(`${width}: protected ${key} dimensions/styles current→A+`,a.items[key].length>0&&JSON.stringify(a.items[key])===JSON.stringify(c.items[key]),{current:c.items[key],aplus:a.items[key]});
     check(`${width}: protected ${key} dimensions/styles original→A+`,a.items[key].length>0&&JSON.stringify(a.items[key])===JSON.stringify(b.items[key]),{original:b.items[key],aplus:a.items[key]});
    }
   }
  }
  check('no uncaught page errors',!report.pageErrors.length,{errors:report.pageErrors});check('no HTTP failures',!report.httpErrors.length,{errors:report.httpErrors});
 }catch(e){report.error=String(e.stack);process.exitCode=1;}
 finally{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));report.totalBytes=bytes;report.summary={frames:report.captures.length,checks:report.checks.length,failed:report.checks.filter(x=>!x.pass).map(x=>x.name)};fs.writeFileSync(path.join(run,'manifest.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));if(report.summary.failed.length)process.exitCode=1;}
})();
