/* W4.AD: section heights + review crops for A+ vs A+AD. Not a G3/G4, performance or artistic PASS.
   Usage: NODE_PATH=<ui>/node_modules node capture.cjs <outDir> [--shots] */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {chromium}=require('playwright');const {makeServer}=require('./serve.cjs');
const out=path.resolve(process.argv[2]||'');const shots=process.argv.includes('--shots');
if(!process.argv[2]||fs.existsSync(out))throw Error('Pass a fresh output directory');
fs.mkdirSync(out,{recursive:true});
const VIEWPORTS=[[1440,900],[1920,1080],[390,844],[360,800]];
const SECTIONS=['work','system','manifesto','modules','world','chars'];
const PARTS={surfaces:'#work-surfaces',archive:'.r1p-archive',traces:'#manifesto .fragments',terminal:'.doctrine-quote',stage:'.doctrine-stage',access:'.r1p-access',memory:'.r1p-memory',dependence:'.r1p-dependence',worldPlate:'#world .ax-chapter-plate',map:'.v23-map-composition',omega:'.ax-omega',cards:'#chars .chars',axiom:'.axiom-entity',shot:'.ax-panel:not([hidden]) .ax-shot'};
const CROPS={1440:[['doctrine','#manifesto .r1p-archive'],['traces','#manifesto .ad-traces, #manifesto .fragments'],['aftermath','#modules'],['surfaces','#work-surfaces'],['world-head','#world .ax-chapter-plate'],['chars-head','#chars .sec-head']],390:[['doctrine','#manifesto .r1p-archive'],['traces','#manifesto .ad-traces, #manifesto .fragments'],['aftermath','#modules'],['surfaces','#work-surfaces'],['world-head','#world .ax-chapter-plate'],['chars-head','#chars .sec-head']]};
const report={kind:'W4AD_HEIGHTS_AND_REVIEW_CROPS',at:new Date().toISOString(),states:{dpr:1,reducedMotion:'reduce',gallery:'01',map:'02.01',loader:'returning visitor flag',reviewCrops:'fixed nav/ticker/cursor hidden via REVIEW_ONLY_CSS after measurement; no other style change'},results:[],captures:[],pageErrors:[],httpErrors:[]};
// Review crops only: fixed nav/ticker/custom cursor would float over full-page clips. Heights are measured before this.
const REVIEW_ONLY_CSS='.nav,.ticker,.show-mobile-nav,.index-cursor,.v22-scroll-progress{visibility:hidden!important}';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const server=makeServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true});report.browser=browser.version();
 try{
  for(const [width,height] of VIEWPORTS)for(const arm of ['aplus','ad']){
   const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
   await ctx.addInitScript(()=>sessionStorage.setItem('axiom_loader_seen','1'));
   const page=await ctx.newPage();
   page.on('pageerror',e=>report.pageErrors.push({arm,width,error:String(e)}));
   page.on('response',r=>{if(r.status()>=400)report.httpErrors.push({arm,width,path:new URL(r.url()).pathname,status:r.status()});});
   await page.goto(`${url}/${arm}/`,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
   await page.locator('#ax-tab-01').click();await page.locator('.v23-map-node[data-canon-id="02.01"]').click();
   const max=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
   for(let y=0;y<=max;y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(16);}
   await page.evaluate(async()=>{scrollTo(0,0);await Promise.all([...document.images].filter(i=>i.currentSrc).map(i=>i.decode().catch(()=>{})));});
   const r=await page.evaluate(({SECTIONS,PARTS})=>{
    const box=s=>{const e=document.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();return {y:Math.round(b.y+scrollY),w:+b.width.toFixed(2),h:+b.height.toFixed(2)};};
    const sections=Object.fromEntries(SECTIONS.map(id=>[id,box('#'+id)]));
    const parts=Object.fromEntries(Object.entries(PARTS).map(([k,s])=>[k,box(s)]));
    const rails=[...document.querySelectorAll('[data-ad-rail]')].map(e=>({rail:e.dataset.adRail,scrollable:e.scrollWidth>e.clientWidth+4,items:e.children.length,clientWidth:e.clientWidth}));
    return {sections,parts,rails,pageHeight:document.documentElement.scrollHeight,scrollWidth:document.documentElement.scrollWidth,
     brokenImages:[...document.images].filter(i=>i.currentSrc&&(!i.complete||!i.naturalWidth)).map(i=>i.currentSrc),
     hiddenTextInRails:[...document.querySelectorAll('[data-ad-rail] *')].filter(e=>e.children.length===0&&e.textContent.trim()&&getComputedStyle(e).display==='none').length,
     fonts:['Oswald','Golos Text','JetBrains Mono'].map(f=>document.fonts.check(`16px "${f}"`))};
   },{SECTIONS,PARTS});
   report.results.push({arm,width,height,...r});
   if(shots&&CROPS[width])for(const [name,sel] of CROPS[width]){
    const loc=page.locator(sel).first();if(!(await loc.count()))continue;
    if(!page.__reviewStyle){page.__reviewStyle=1;await page.mouse.move(0,0);await page.addStyleTag({content:REVIEW_ONLY_CSS});}
    await loc.scrollIntoViewIfNeeded();await page.waitForTimeout(60);
    const b=await loc.boundingBox(),sy=await page.evaluate(()=>scrollY);
    const file=`${arm}-${width}-${name}.png`;
    const buf=await page.screenshot({path:path.join(out,file),fullPage:true,animations:'disabled',clip:{x:0,y:Math.max(0,b.y+sy-24),width,height:Math.min(b.height+48,7000)}});
    report.captures.push({file,arm,width,selector:sel,top:Math.round(b.y+sy),height:Math.round(b.height),sha256:hash(buf)});
   }
   await ctx.close();
  }
 }finally{await browser.close();server.close();}
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,1));
 const t=report.results;console.log('page errors',report.pageErrors.length,'http errors',report.httpErrors.length);
 for(const w of [1440,1920,390,360]){const a=t.find(x=>x.arm==='aplus'&&x.width===w),d=t.find(x=>x.arm==='ad'&&x.width===w);
  console.log(`\n${w}: page ${a.pageHeight} → ${d.pageHeight}  overflow ${a.scrollWidth}/${d.scrollWidth}  broken ${a.brokenImages.length}/${d.brokenImages.length}  fonts ${d.fonts}  rails ${JSON.stringify(d.rails)}`);
  for(const s of SECTIONS)console.log(`  ${s.padEnd(10)} ${String(a.sections[s]?.h).padStart(9)} → ${String(d.sections[s]?.h).padStart(9)}`);}
})().catch(e=>{console.error(e);process.exit(1);});
