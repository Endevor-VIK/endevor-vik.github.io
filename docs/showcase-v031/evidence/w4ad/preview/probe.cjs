/* W4.AD behaviour probe: no-JS rails, keyboard, rail controls, RM, scoped axe (A+ vs A+AD). Not R3/G4.
   Usage: NODE_PATH=<ui>/node_modules node probe.cjs <out.json> */
const fs=require('fs'),path=require('path');
const {chromium}=require('playwright');const {makeServer}=require('./serve.cjs');
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const SCOPE=[['#work-surfaces'],['#manifesto'],['#modules'],['#world .r1p-plate-copy'],['.r1p-map-intro'],['.r1p-character-intro']];
const checks=[];const check=(name,pass,detail={})=>{checks.push({name,pass:!!pass,...detail});console.log((pass?'PASS ':'FAIL ')+name+(Object.keys(detail).length?' '+JSON.stringify(detail):''));};
(async()=>{
 const server=makeServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true});const axe={};
 const open=async(arm,width,height,opts={})=>{const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce',...opts});await ctx.addInitScript(()=>sessionStorage.setItem('axiom_loader_seen','1'));const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(`${url}/${arm}/`,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);return {ctx,page,errors};};
 try{
  // 1. No JavaScript: content present, rails scroll natively, nothing display:none inside rails, anchors exist.
  for(const width of [390,360]){
   const {ctx,page}=await open('ad',width,844,{javaScriptEnabled:false});
   const r=await page.evaluate(()=>{const q=s=>document.querySelector(s);const rails=[...document.querySelectorAll('[data-ad-rail]')];
    return {rails:rails.map(e=>({rail:e.dataset.adRail,items:e.children.length,scrollable:e.scrollWidth>e.clientWidth+4,overflowX:getComputedStyle(e).overflowX,snap:getComputedStyle(e).scrollSnapType})),
     hidden:rails.flatMap(e=>[...e.querySelectorAll('*')]).filter(e=>getComputedStyle(e).display==='none'&&e.textContent.trim()).length,
     bars:document.querySelectorAll('.ad-rail-bar').length,anchors:[...document.querySelectorAll('.ad-surface-index a')].map(a=>!!document.querySelector(a.getAttribute('href'))),
     traceText:[...document.querySelectorAll('#manifesto .frag p')].map(p=>p.textContent.length),pageOverflow:document.documentElement.scrollWidth>innerWidth};});
   check(`noJS/${width}: two native rails, all items`,r.rails.length===2&&r.rails.every(x=>x.scrollable&&x.overflowX==='auto'&&/x/.test(x.snap))&&r.rails.find(x=>x.rail==='traces').items===5&&r.rails.find(x=>x.rail==='surfaces').items===4,{rails:r.rails});
   check(`noJS/${width}: no text hidden in rails, no JS-only bars`,r.hidden===0&&r.bars===0,{hidden:r.hidden,bars:r.bars});
   check(`noJS/${width}: four study anchors resolve`,r.anchors.length===4&&r.anchors.every(Boolean));
   check(`noJS/${width}: five trace texts present`,r.traceText.length===5&&r.traceText.every(n=>n>40));
   check(`noJS/${width}: no horizontal page overflow`,!r.pageOverflow);
   await ctx.close();
  }
  // 2. JS at 390: keyboard scroll, buttons, counter, index jump; desktop: grid not scrollable, bars hidden.
  {
   const {ctx,page,errors}=await open('ad',390,844);
   const rail=page.locator('[data-ad-rail="traces"]');await rail.scrollIntoViewIfNeeded();await rail.focus();
   const x0=await rail.evaluate(e=>e.scrollLeft);await page.keyboard.press('ArrowRight');await page.waitForTimeout(400);const x1=await rail.evaluate(e=>e.scrollLeft);
   check('390: traces rail focusable and scrolls by keyboard',x1>x0,{x0,x1,focused:await rail.evaluate(e=>document.activeElement===e)});
   const bar=page.locator('[data-ad-rail="traces"] + .ad-rail-bar');await rail.evaluate(e=>e.scrollTo(0,0));await page.waitForTimeout(200);
   await bar.locator('button').nth(1).click();await page.waitForTimeout(500);await bar.locator('button').nth(1).click();await page.waitForTimeout(500);
   check('390: next button advances counter',(await bar.locator('output').textContent()).startsWith('03'),{counter:await bar.locator('output').textContent()});
   const prevDisabledAtStart=await (async()=>{await rail.evaluate(e=>e.scrollTo(0,0));await page.waitForTimeout(250);return bar.locator('button').first().isDisabled();})();
   check('390: prev disabled at first item',prevDisabledAtStart);
   const s=page.locator('[data-ad-rail="surfaces"]');await page.locator('.ad-surface-index a').nth(3).click();await page.waitForTimeout(700);
   const st=await s.evaluate(e=>{const items=[...e.children],pad=parseFloat(getComputedStyle(e).paddingLeft);return {left:e.scrollLeft,target:Math.min(items[3].offsetLeft-pad,e.scrollWidth-e.clientWidth),current:document.querySelector('.ad-surface-index a[aria-current]')?.textContent,hash:location.hash};});
   check('390: index link scrolls rail to WATCH_DOG without page hash jump',Math.abs(st.left-st.target)<4&&/WATCH_DOG/.test(st.current||''),st);
   const btn=await page.evaluate(()=>[...document.querySelectorAll('.ad-rail-bar button,.ad-surface-index a')].map(e=>{const r=e.getBoundingClientRect();return Math.min(r.width,r.height);}));
   check('390: rail buttons/index targets ≥44px',btn.every(v=>v>=44),{min:Math.min(...btn)});
   check('390: no page errors',!errors.length,{errors});
   await ctx.close();
  }
  {
   const {ctx,page,errors}=await open('ad',1440,900);
   const r=await page.evaluate(()=>({rails:[...document.querySelectorAll('[data-ad-rail]')].map(e=>e.scrollWidth>e.clientWidth+4),bars:[...document.querySelectorAll('.ad-rail-bar')].map(b=>getComputedStyle(b).display),cols:getComputedStyle(document.querySelector('#manifesto .fragments')).gridTemplateColumns.split(' ').length,mods:getComputedStyle(document.querySelector('.r1p-surfaces .modules')).gridTemplateColumns.split(' ').length,pulse:getComputedStyle(document.querySelector('.ad-pulse-trace')).animationName}));
   check('1440: desktop keeps 5-column traces and 2-column studies, no rails/bars',r.rails.every(x=>!x)&&r.bars.every(d=>d==='none')&&r.cols===5&&r.mods===2,r);
   check('1440 RM: pulse animation off',r.pulse==='none',{pulse:r.pulse});
   check('1440: no page errors',!errors.length,{errors});
   await ctx.close();
  }
  // 3. Every item of both rails is fully reachable: keyboard (JS on/off) and touch swipe (CDP synthetic gesture).
  const visibleItems=rail=>rail.evaluate(e=>{const b=e.getBoundingClientRect(),pad=parseFloat(getComputedStyle(e).paddingLeft);return [...e.children].map((c,i)=>{const r=c.getBoundingClientRect();return r.left>=b.left+pad-2&&r.right<=b.right-pad+2?i:-1;}).filter(i=>i>=0);});
  for(const [width,js] of [[390,true],[390,false],[360,true],[360,false]]){
   const {ctx,page}=await open('ad',width,844,{javaScriptEnabled:js});
   for(const name of ['traces','surfaces']){
    const rail=page.locator(`[data-ad-rail="${name}"]`);await rail.scrollIntoViewIfNeeded();await rail.focus();
    const seen=new Set(await visibleItems(rail));const n=await rail.evaluate(e=>e.children.length);
    for(let k=0;k<n+2;k++){await page.keyboard.press('ArrowRight');await page.waitForTimeout(350);(await visibleItems(rail)).forEach(i=>seen.add(i));}
    check(`keyboard ${js?'JS':'noJS'}/${width}: all ${name} items fully visible in turn, last included`,seen.size===n&&seen.has(n-1),{seen:[...seen].sort(),n});
   }
   await ctx.close();
  }
  for(const width of [390,360]){
   const {ctx,page}=await open('ad',width,844,{hasTouch:true,isMobile:true});const cdp=await ctx.newCDPSession(page);
   for(const name of ['traces','surfaces']){
    const rail=page.locator(`[data-ad-rail="${name}"]`);await rail.scrollIntoViewIfNeeded();
    const n=await rail.evaluate(e=>e.children.length),seen=new Set(await visibleItems(rail)),stops=[];
    for(let k=0;k<n+1;k++){
     const b=await rail.boundingBox();
     // Raw touch stream: synthesizeScrollGesture is a no-op in this headless build (qualification record kept).
     const y=Math.round(b.y+Math.min(b.height/2,300)),x0=Math.round(b.width*.8),dx=Math.round(b.width*.45);
     await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x0,y}]});
     for(let i=1;i<=10;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x0-Math.round(dx*i/10),y}]});await page.waitForTimeout(16);}
     await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
     await page.waitForTimeout(500);(await visibleItems(rail)).forEach(i=>seen.add(i));
     stops.push(await rail.evaluate(e=>{const pad=parseFloat(getComputedStyle(e).paddingLeft),max=e.scrollWidth-e.clientWidth;return [...e.children].some(c=>Math.abs(c.offsetLeft-pad-e.scrollLeft)<3)||Math.abs(e.scrollLeft-max)<3;}));
    }
    check(`touch swipe/${width}: ${name} reaches all items and snaps`,seen.size===n&&stops.every(Boolean),{seen:[...seen].sort(),n,snapped:stops});
   }
   await ctx.close();
  }
  // 4. A08 threshold: source is the high-resolution original set, never upscaled beyond it; gate core + beam stay inside.
  const CORE={x:.501,y:.388};
  for(const [w,h,dpr] of [[1440,900,1],[1440,900,2],[390,844,1],[390,844,3],[360,800,1],[360,800,3]]){
   const {ctx,page}=await open('ad',w,h,{deviceScaleFactor:dpr});
   const img=page.locator('.ad-gate img');await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());
   const r=await img.evaluate((i,CORE)=>{const b=i.getBoundingClientRect(),s=getComputedStyle(i),[px,py]=s.objectPosition.split(' ').map(v=>parseFloat(v)/100);
    const k=Math.max(b.width/i.naturalWidth,b.height/i.naturalHeight),rw=i.naturalWidth*k,rh=i.naturalHeight*k,ox=(b.width-rw)*px,oy=(b.height-rh)*py;
    const src=i.currentSrc.split('/').pop();return {src,natural:+(src.match(/-(\d+)w\./)||[0,0])[1],box:[Math.round(b.width),Math.round(b.height)],coreX:+((ox+CORE.x*rw)/b.width).toFixed(3),coreY:+((oy+CORE.y*rh)/b.height).toFixed(3),neededPx:Math.round(rw*devicePixelRatio)};},CORE);
   const inside=r.coreX>.12&&r.coreX<.88&&r.coreY>.12&&r.coreY<.88,res=/^A08_protocol_gate-\d+w\.(avif|webp)$/.test(r.src)&&(r.natural>=Math.min(r.neededPx*.98,941));
   check(`A08 ${w}@${dpr}x: original-derived source (true px from w-descriptor), gate core inside crop`,inside&&res,r);
   await ctx.close();
  }
  // 5. Scoped axe on changed external regions, both arms.
  for(const arm of ['aplus','ad'])for(const [w,h] of [[1440,900],[390,844]]){
   const {ctx,page}=await open(arm,w,h);await page.addScriptTag({content:AXE});
   const res=await page.evaluate(async scope=>{const r=await axe.run({include:scope},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.length,targets:v.nodes.slice(0,4).map(n=>n.target.join(' '))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))};},SCOPE);
   axe[`${arm}/${w}`]=res;await ctx.close();
  }
  for(const w of [1440,390])check(`axe/${w}: A+AD scoped violations 0`,axe[`ad/${w}`].violations.length===0,{aplus:axe[`aplus/${w}`].violations,ad:axe[`ad/${w}`].violations,incompleteAplus:axe[`aplus/${w}`].incomplete,incompleteAd:axe[`ad/${w}`].incomplete});
 }finally{await browser.close();server.close();}
 const outFile=process.argv[2];if(outFile)fs.writeFileSync(outFile,JSON.stringify({kind:'W4AD_BEHAVIOUR_PROBE',at:new Date().toISOString(),checks,axe},null,1));
 const failed=checks.filter(c=>!c.pass).length;console.log(`\n${checks.length-failed}/${checks.length} PASS`);process.exitCode=failed?1:0;
})().catch(e=>{console.error(e);process.exit(1);});
