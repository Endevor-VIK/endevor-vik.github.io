#!/usr/bin/env node
/* AXIOM SHOWCASE ENG/RU: real-browser contracts; static Pages-like server; no package install.
 * NODE_PATH=/path/to/node_modules node tests/browser/i18n_regression.cjs
 *   [--root /isolated/checkout] [--out /tmp/axiom-i18n-browser] [--engine chromium|firefox] [--match test-id-regex] [--url http://127.0.0.1:PORT/]
 * Default: Chromium then Firefox. Missing engines are NOT_RUN, never PASS. Every owned run is bounded to 96 MiB;
 * retention is applied before writing: latest 3 runs, at most 14 days. No profiles, traces or video are retained.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const args = process.argv.slice(2);
const arg = (name, fallback) => { const index = args.indexOf(name); return index < 0 ? fallback : args[index + 1]; };
const ROOT = path.resolve(arg('--root', path.join(__dirname, '../..')));
const OUT = path.resolve(arg('--out', path.join(os.tmpdir(), 'axiom-showcase-i18n-browser')));
const KEY = 'axiom.showcase.language.v1';
const OWNER = 'AXIOM_SHOWCASE_I18N_BROWSER_V1';
const MAX_BYTES = 96 * 1024 * 1024;
const RUN_ID = `run-${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}-${crypto.randomBytes(3).toString('hex')}`;
const results = [], screenshots = [];
let runDir, writtenBytes = 0;
const assert = (condition, message, detail) => { if (!condition) throw new Error(message + (detail === undefined ? '' : ': ' + JSON.stringify(detail))); };
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

function initializeOutput() {
  fs.mkdirSync(OUT, { recursive: true });
  const owner = path.join(OUT, '.owner');
  if (fs.existsSync(owner)) assert(fs.readFileSync(owner, 'utf8') === OWNER, 'Output directory belongs to another task');
  else { assert(fs.readdirSync(OUT).length === 0, 'Refusing to use a nonempty unowned output directory'); fs.writeFileSync(owner, OWNER); }
  const ownedRuns = fs.readdirSync(OUT).filter(name => /^run-\d{14}-[a-f\d]{6}$/.test(name)).map(name => path.join(OUT, name)).filter(directory => {
    const marker = path.join(directory, '.owner');
    return fs.lstatSync(directory).isDirectory() && fs.existsSync(marker) && fs.readFileSync(marker, 'utf8') === OWNER;
  }).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  for (const [index, directory] of ownedRuns.entries()) {
    if (index >= 2 || Date.now() - fs.statSync(directory).mtimeMs > 14 * 86400000) {
      assert(path.dirname(fs.realpathSync(directory)) === fs.realpathSync(OUT), 'Retention target escaped output root');
      fs.rmSync(directory, { recursive: true });
    }
  }
  runDir = path.join(OUT, RUN_ID); fs.mkdirSync(runDir); fs.writeFileSync(path.join(runDir, '.owner'), OWNER);
}
function sourceSnapshot() {
  const names = ['index.html','loader.html','404.html'];
  for (const directory of ['assets/js','assets/css','assets/i18n']) {
    for (const name of fs.readdirSync(path.join(ROOT, directory))) {
      if (/\.(?:js|cjs|css|json)$/.test(name)) names.push(directory + '/' + name);
    }
  }
  const hashes = Object.fromEntries(names.sort().map(name => [name, crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, name))).digest('hex')]));
  let commit = 'UNKNOWN', status = 'UNKNOWN';
  try { commit = execFileSync('git', ['rev-parse','HEAD'], { cwd: ROOT, encoding:'utf8' }).trim(); status = execFileSync('git',['status','--short'],{cwd:ROOT,encoding:'utf8'}).trim(); } catch (_) {}
  return { root: ROOT, commit, status, hashes };
}
function emit(engine, id, status, detail) {
  results.push({ engine, id, status, detail });
  process.stdout.write(`${status.padEnd(7)} [${engine}] ${id}${detail ? ' ' + JSON.stringify(detail) : ''}\n`);
}
async function check(engine, id, operation) {
  if(arg('--match',null)&&!new RegExp(arg('--match')).test(id))return;
  try { const detail = await operation(); emit(engine, id, 'PASS', detail); }
  catch (error) { emit(engine, id, 'FAIL', String(error.stack || error)); }
}
async function capture(page, filename) {
  const buffer = await page.screenshot({ type: 'png', animations: 'disabled' });
  assert(writtenBytes + buffer.length <= MAX_BYTES - 1024 * 1024, 'Screenshot budget exceeded');
  fs.writeFileSync(path.join(runDir, filename), buffer); writtenBytes += buffer.length;
  screenshots.push({ filename, bytes: buffer.length, sha256: crypto.createHash('sha256').update(buffer).digest('hex') });
}
const MIME = { '.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.woff2':'font/woff2','.ico':'image/x-icon' };
async function serve() {
  const server = http.createServer((request, response) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://local').pathname); } catch (_) { response.writeHead(400); response.end(); return; }
    let filename = path.resolve(ROOT, '.' + pathname);
    if (filename !== ROOT && !filename.startsWith(ROOT + path.sep)) { response.writeHead(403); response.end(); return; }
    let status = 200;
    try { if (fs.statSync(filename).isDirectory()) filename = path.join(filename, 'index.html'); } catch (_) {}
    if (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) { filename = path.join(ROOT, '404.html'); status = 404; }
    response.writeHead(status, { 'Content-Type': MIME[path.extname(filename)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    const streamMode=new URL(request.url,'http://local').searchParams.get('__i18n_stream');
    if(status===200&&path.extname(filename)==='.html'&&['body','loader'].includes(streamMode)){
      const source=fs.readFileSync(filename,'utf8');let chunks;
      if(streamMode==='body'){
        const marker=/<!--i18n:main\.top\.009(?:\|[\s\S]*?)?-->/.exec(source);
        if(!marker){response.end('Streaming fixture requires the HERO lede marker');return;}
        const start=marker.index+marker[0].length,end=source.indexOf('<',start),split=start+Math.floor((end-start)/2);
        chunks=[source.slice(0,split),source.slice(split,end),source.slice(end)];
      }else{
        const cut=source.indexOf('<script>',source.indexOf('<body'));
        if(cut<0){response.end('Streaming fixture requires the loader inline script');return;}
        chunks=[source.slice(0,cut),source.slice(cut)];
      }
      // Pause inside one text node, then pause again before its following inline element.
      // The loader variant pauses before the bottom script can own its phase label.
      const timers=[];response.on('close',()=>timers.forEach(clearTimeout));
      response.write(chunks[0]);
      if(chunks.length===3){timers.push(setTimeout(()=>response.write(chunks[1]),180));timers.push(setTimeout(()=>response.end(chunks[2]),420));}
      else timers.push(setTimeout(()=>response.end(chunks[1]),350));
      return;
    }
    const stream = fs.createReadStream(filename); stream.on('error', () => response.destroy()); stream.pipe(response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { server, base: `http://127.0.0.1:${server.address().port}/` };
}

async function contextPage(browser, base, options = {}) {
  const { locale='en-US', saved, languages, denied=false, boot=false, motion='reduce', width=1440, height=900, js=true } = options;
  const context = await browser.newContext({ locale, viewport:{width,height}, colorScheme:'dark', reducedMotion:motion, javaScriptEnabled:js,
    ...(saved === undefined ? {} : { storageState:{cookies:[], origins:[{origin:new URL(base).origin, localStorage:[{name:KEY, value:saved}]}]} }) });
  await context.addInitScript(({key,languages,denied,boot}) => {
    if (languages) Object.defineProperty(navigator, 'languages', { configurable:true, get:()=>languages });
    if (denied) Object.defineProperty(window, 'localStorage', { configurable:true, get(){ throw new DOMException('Storage denied by test','SecurityError'); } });
    if (!boot) { try { sessionStorage.setItem('axiom_loader_seen','1'); } catch (_) {} }
    if (boot) {
      for (const [name, value] of [['hardwareConcurrency',8],['deviceMemory',8],['connection',{saveData:false,effectiveType:'4g'}]]) {
        try { Object.defineProperty(navigator,name,{configurable:true,get:()=>value}); } catch (_) {}
      }
    }
    window.__i18nFirstPaint = null;
    const sample = () => {
      if (document.body && document.body.textContent.trim() && getComputedStyle(document.body).visibility !== 'hidden') {
        window.__i18nFirstPaint = { lang:document.documentElement.lang, text:document.body.innerText.slice(0,2000), time:performance.now() };
      } else requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }, {key:KEY,languages,denied,boot});
  const page = await context.newPage(); page.setDefaultTimeout(8000); page.setDefaultNavigationTimeout(20000);
  const errors = [], missing = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type()==='error' && /i18n.*missing|missing.*i18n/i.test(message.text())) missing.push(message.text()); });
  return { context, page, errors, missing };
}
async function ready(page) {
  await page.waitForFunction(() => window.AXI18n && !document.documentElement.classList.contains('i18n-loading'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.__i18nFirstPaint !== null);
}
async function goto(page, url) { await page.goto(url, {waitUntil:'load'}); await ready(page); }
async function language(page, expected) {
  const state = await page.evaluate(() => ({language:window.AXI18n.language,html:document.documentElement.lang,title:document.title,timeOrigin:performance.timeOrigin,
    buttons:[...document.querySelectorAll('[data-language]')].map(button=>({lang:button.dataset.language,pressed:button.getAttribute('aria-pressed'),label:button.getAttribute('aria-label')}))}));
  assert(state.language===expected && state.html===expected,'Incorrect selected language',state);
  assert(state.buttons.every(button => button.pressed===String(button.lang===expected) && button.label),'Incorrect accessible switch state',state.buttons);
  return state;
}
async function visibleButton(page, lang, scope='') {
  const candidates = page.locator(`${scope}${scope?' ':''}[data-language="${lang}"]`);
  for (let index=0; index<await candidates.count(); index++) if (await candidates.nth(index).isVisible()) return candidates.nth(index);
  throw new Error(`No visible ${lang} language button in ${scope || 'page'}`);
}
async function switchLanguage(page, lang, scope='', key='Enter') {
  const button = await visibleButton(page,lang,scope);
  await button.evaluate(element => element.focus({preventScroll:true}));
  await page.keyboard.press(key);
  await page.waitForFunction(expected => window.AXI18n.language===expected,lang);
  await page.evaluate(() => window.AXI18n.whenSettled);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  return language(page,lang);
}
async function auditBindings(page) {
  const findings = await page.evaluate(() => {
    const failures=[];
    const catalogFor=element=>window.AXIOM_I18N_CATALOGS[element?.closest('[data-copy-language]')?.dataset.copyLanguage || window.AXI18n.language];
    const normalize=value=>String(value).replace(/\s+/g,' ').trim();
    const walker=document.createTreeWalker(document,NodeFilter.SHOW_COMMENT);let comment;
    while((comment=walker.nextNode())) {
      if(!comment.data.startsWith('i18n:'))continue;
      const key=comment.data.slice(5).split('|')[0].trim(), node=comment.nextSibling, expected=catalogFor(comment.parentElement)[key];
      if(typeof expected!=='string') {failures.push({key,why:'missing'});continue;}
      if(node?.nodeType===Node.TEXT_NODE && !/\{\w+\}/.test(expected) && normalize(node.textContent)!==normalize(expected))failures.push({key,expected,actual:node.textContent});
    }
    for(const element of document.querySelectorAll('*'))for(const attribute of element.attributes) {
      if(attribute.name==='data-i18n' || (attribute.name.startsWith('data-i18n-')&&attribute.name!=='data-i18n-runtime')) {
        const expected=catalogFor(element)[attribute.value];
        const actual=attribute.name==='data-i18n'?element.textContent:element.getAttribute(attribute.name.slice(10));
        if(typeof expected!=='string')failures.push({key:attribute.value,why:'missing attr key'});
        else if(!/\{\w+\}/.test(expected)&&normalize(actual)!==normalize(expected))failures.push({key:attribute.value,expected,actual});
      }
    }
    const textNodes=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let userNode;
    while((userNode=textNodes.nextNode())){if(!userNode.parentElement?.closest('script,style')&&/\{[A-Za-z_]\w*\}/.test(userNode.textContent))failures.push({why:'unresolved placeholder',text:userNode.textContent});}
    if(window.AXI18n.language==='en'&&/[\u0400-\u04ff]/.test(document.body.innerText))failures.push({why:'untranslated Cyrillic in visible ENG'});
    return failures.slice(0,20);
  });
  assert(findings.length===0,'Untranslated or stale public bindings',findings);
  return {checked:'all comment, text and attribute bindings'};
}
async function setScroll(page, selector) {
  await page.evaluate(selector => { const target=document.querySelector(selector); window.scrollTo({top:target.getBoundingClientRect().top+scrollY-130,behavior:'instant'}); },selector);
  await pause(120);
}
function noErrors(fixture) { assert(fixture.errors.length===0,'Browser exception',fixture.errors); assert(fixture.missing.length===0,'Missing localization key',fixture.missing); }
async function using(browser,base,options,operation) {const fixture=await contextPage(browser,base,options);try{return await operation(fixture);}finally{await fixture.context.close();}}

async function streamProbe(context){
  await context.addInitScript(()=>{
    window.__i18nStreamFrames=[];
    const sample=()=>{
      if(document.body&&getComputedStyle(document.body).visibility!=='hidden'){
        const lede=document.querySelector('#top .lede'),phase=document.querySelector('#phaseLabel');
        window.__i18nStreamFrames.push({ready:document.readyState,lang:document.documentElement.lang,time:performance.now(),lede:lede?.textContent||'',phase:phase?.textContent||''});
      }
      if(window.__i18nStreamFrames.length<200)requestAnimationFrame(sample);
    };requestAnimationFrame(sample);
  });
}

async function runEngine(name, engine, base) {
  let browser;
  try { browser=await engine.launch({headless:true}); }
  catch(error) {emit(name,'engine-availability','NOT_RUN',String(error.message));return;}
  emit(name,'engine-version','OBSERVED',browser.version());
  try {
    const cases=[
      {id:'first-ru-RU',locale:'ru-RU',want:'ru'},
      {id:'first-en-US',locale:'en-US',want:'en'},
      {id:'first-en-GB',locale:'en-GB',want:'en'},
      {id:'first-de-DE-fallback',locale:'de-DE',want:'en'},
      {id:'primary-language-wins',locale:'de-DE',languages:['de-DE','ru-RU'],want:'en'},
      {id:'saved-choice-wins',locale:'en-US',saved:'ru',want:'ru'},
      {id:'query-en-wins',locale:'ru-RU',saved:'ru',query:'en',want:'en'},
      {id:'query-ru-wins',locale:'en-US',saved:'en',query:'ru',want:'ru'},
      {id:'invalid-query-uses-saved',locale:'en-US',saved:'ru',query:'xx',want:'ru'},
      {id:'invalid-saved-uses-browser',locale:'ru-RU',saved:'en-US',want:'ru'},
      {id:'storage-denied-browser-ru',locale:'ru-RU',denied:true,want:'ru'},
      {id:'storage-denied-query-en',locale:'ru-RU',denied:true,query:'en',want:'en'},
      {id:'query-is-not-markup',locale:'en-US',query:'<img id="i18n-query-xss" onerror="alert(1)">',want:'en'}
    ];
    for(const item of cases)await check(name,item.id,()=>using(browser,base,item,async fixture=>{
      const {page}=fixture;const url=new URL(base);if(item.query!==undefined)url.searchParams.set('lang',item.query);
      await goto(page,url.href);const state=await language(page,item.want);await auditBindings(page);
      const first=await page.evaluate(()=>window.__i18nFirstPaint);assert(first.lang===item.want,'Wrong-language first visible frame',first);
      if(item.want==='en')assert(!/[\u0400-\u04ff]/.test(first.text),'Russian flash before ENG initialization',first);
      if(item.denied){await switchLanguage(page,item.want==='ru'?'en':'ru');await switchLanguage(page,item.want);}
      assert(await page.locator('#i18n-query-xss').count()===0,'Query was inserted as HTML');noErrors(fixture);
      return {language:state.language,firstVisibleLanguage:first.lang};
    }));

    if(!arg('--url',null)){
      await check(name,'streamed-hero-text-node-and-inline-whitespace',()=>using(browser,base,{locale:'en-US'},async fixture=>{
        const {page,context}=fixture;await streamProbe(context);
        await goto(page,base+'?lang=en&__i18n_stream=body');
        const frames=await page.evaluate(()=>window.__i18nStreamFrames);
        const streamed=frames.filter(frame=>frame.ready==='loading'&&frame.lede.trim());
        assert(streamed.length>=2,'Fixture did not expose a visible streamed text node',frames);
        assert(streamed.every(frame=>!/[\u0400-\u04ff]/.test(frame.lede)),'Raw source tail appeared between streamed chunks',streamed);
        const sentence=await page.evaluate(()=>{
          const normalize=value=>value.replace(/\s+/g,' ').trim(),catalog=window.AXIOM_I18N_CATALOGS.en;
          return{actual:normalize(document.querySelector('#top .lede').textContent),expected:normalize('AXIOM '+catalog['main.top.009']+' '+catalog['main.top.010']+' '+catalog['main.top.011'])};
        });
        assert(sentence.actual===sentence.expected,'Streaming lost spaces around inline markup',sentence);
        await auditBindings(page);noErrors(fixture);return{visibleLoadingFrames:streamed.length,rawTailAbsent:true,inlineWhitespacePreserved:true};
      }));
      await check(name,'streamed-initial-ru-loader-phase',()=>using(browser,base,{locale:'ru-RU',motion:'no-preference'},async fixture=>{
        const {page,context}=fixture;await streamProbe(context);
        await goto(page,base+'loader.html?lang=ru&auto=false&duration=250&__i18n_stream=loader');
        const state=await page.evaluate(()=>({frames:window.__i18nStreamFrames,expected:window.AXIOM_I18N_CATALOGS.ru['loader.phase.0']}));
        const initial=state.frames.filter(frame=>frame.ready==='loading'&&frame.phase.trim());
        assert(initial.length>=2,'Fixture did not expose phase text before the loader script',state.frames);
        assert(initial.every(frame=>frame.phase.trim()===state.expected&&frame.lang==='ru'),'Initial streamed loader phase used source English',initial);
        await auditBindings(page);noErrors(fixture);return{visiblePreScriptFrames:initial.length,initialPhase:state.expected};
      }));
    }else emit(name,'streamed-html-contracts','NOT_RUN','Requires the harness-owned chunked HTTP server; --url bypasses it');

    await check(name,'manual-keyboard-persist-reload-query',()=>using(browser,base,{locale:'ru-RU'},async fixture=>{
      const {page}=fixture;await goto(page,base+'?lang=ru');const origin=await page.evaluate(()=>performance.timeOrigin);
      await switchLanguage(page,'en','','Enter');
      let saved=await page.evaluate(key=>localStorage.getItem(key),KEY);assert(saved==='en','Manual ENG choice not stored',saved);
      assert(new URL(page.url()).searchParams.get('lang')==='en','Manual choice is overridden by stale URL');
      const enButton=await visibleButton(page,'en');await enButton.focus();await page.keyboard.press('Tab');
      assert(await page.evaluate(()=>document.activeElement.dataset.language)==='ru','Tab did not reach RU switch');
      const focused=await page.evaluate(()=>{const button=document.activeElement;const css=getComputedStyle(button);return{visible:button.matches(':focus-visible'),outline:css.outlineStyle,width:parseFloat(css.outlineWidth)}});
      assert(focused.visible&&focused.outline!=='none'&&focused.width>=1,'Keyboard focus is not visible',focused);
      await page.keyboard.press('Space');await page.evaluate(()=>window.AXI18n.whenSettled);await language(page,'ru');
      assert(await page.evaluate(()=>performance.timeOrigin)===origin,'Manual switch reloaded the page');
      await page.reload({waitUntil:'load'});await ready(page);await language(page,'ru');
      await switchLanguage(page,'en');await page.goto(base,{waitUntil:'load'});await ready(page);await language(page,'en');
      noErrors(fixture);return{reloadPersistence:true,queryUpdated:true,keyboard:['Tab','Enter','Space']};
    }));

    await check(name,'hero-and-work-scroll-preserved',()=>using(browser,base,{locale:'ru-RU'},async fixture=>{
      const {page}=fixture;await goto(page,base);const measures=[];
      for(const selector of ['#top','#work']){
        await setScroll(page,selector);const before=await page.evaluate(()=>({x:scrollX,y:scrollY,timeOrigin:performance.timeOrigin}));
        await switchLanguage(page,'en');const after=await page.evaluate(()=>({x:scrollX,y:scrollY,timeOrigin:performance.timeOrigin}));
        assert(Math.abs(after.y-before.y)<=1&&Math.abs(after.x-before.x)<=1&&after.timeOrigin===before.timeOrigin,'Switch moved the document',{selector,before,after});
        await auditBindings(page);await switchLanguage(page,'ru');measures.push({selector,y:before.y});
      }
      noErrors(fixture);return measures;
    }));

    await check(name,'all-eight-work-screens-and-open-viewer',()=>using(browser,base,{locale:'en-US'},async fixture=>{
      const {page}=fixture;await goto(page,base);await setScroll(page,'#work');
      const count=await page.locator('#showcase-gallery [role=tab]').count();assert(count===8,'WORK lost a screen',count);
      for(let index=0;index<8;index++){
        await page.evaluate(index=>document.querySelectorAll('#showcase-gallery [role=tab]')[index].click(),index);
        const panel=await page.evaluate(()=>{const tabs=[...document.querySelectorAll('#showcase-gallery [role=tab]')];const index=tabs.findIndex(tab=>tab.getAttribute('aria-selected')==='true');const visible=[...document.querySelectorAll('#showcase-gallery [role=tabpanel]')].filter(panel=>!panel.hidden);return{index,shown:visible.length,description:visible[0]?.innerText}});
        assert(panel.index===index&&panel.shown===1&&panel.description.trim(),'Archive tab is broken',panel);
        await auditBindings(page);
      }
      await page.evaluate(()=>{document.querySelectorAll('#showcase-gallery [role=tab]')[0].click();document.querySelector('#ax-panel-01 .ax-shot-trigger').click();});
      await page.waitForFunction(()=>document.querySelector('#showcase-lightbox').open);
      await page.locator('#showcase-lightbox .ax-viewer-zoom').click();
      const before=await page.evaluate(()=>{const dialog=document.querySelector('#showcase-lightbox'),stage=dialog.querySelector('.show-lightbox-image'),image=dialog.querySelector('img');stage.scrollLeft=90;stage.scrollTop=40;return{src:image.getAttribute('src'),width:image.style.width,zoom:dialog.classList.contains('is-zoomed'),caption:document.querySelector('#showcase-full-caption').textContent,alt:image.alt,count:document.querySelector('#ax-viewer-count').textContent,pan:{left:stage.scrollLeft,top:stage.scrollTop},y:scrollY};});
      await page.evaluate(()=>{window.__i18nScrollLog=[];for(const name of ['focusin','keydown','click','axiom:languagechange','scroll'])addEventListener(name,event=>{if(window.__i18nScrollLog.length<40)window.__i18nScrollLog.push({event:name,y:scrollY,target:event.target?.className,time:performance.now()})},{capture:true});});
      await switchLanguage(page,'ru','#showcase-lightbox');await auditBindings(page);
      const after=await page.evaluate(()=>{const dialog=document.querySelector('#showcase-lightbox'),image=dialog.querySelector('img');return{open:dialog.open,src:image.getAttribute('src'),width:image.style.width,zoom:dialog.classList.contains('is-zoomed'),caption:document.querySelector('#showcase-full-caption').textContent,alt:image.alt,count:document.querySelector('#ax-viewer-count').textContent,title:document.querySelector('#ax-panel-01 .ax-shot-trigger').dataset.showcaseTitle,pan:{left:dialog.querySelector('.show-lightbox-image').scrollLeft,top:dialog.querySelector('.show-lightbox-image').scrollTop},y:scrollY};});
      assert(after.open&&after.zoom&&after.src===before.src&&after.width===before.width&&after.count===before.count,'Switch reset viewer state',{before,after});
      assert(Math.abs(after.pan.left-before.pan.left)<=1&&Math.abs(after.pan.top-before.pan.top)<=1,'Switch reset WORK viewer pan',{before:before.pan,after:after.pan});
      assert(after.caption===after.title&&after.caption!==before.caption&&after.alt!==before.alt,'Open viewer text was not refreshed',{before,after});
      assert(Math.abs(after.y-before.y)<=1,'Open-viewer switch moved document',{before,after,events:await page.evaluate(()=>window.__i18nScrollLog)});
      await page.keyboard.press('Escape');assert(!await page.locator('#showcase-lightbox').evaluate(dialog=>dialog.open),'Viewer Escape failed');
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      assert(Math.abs((await page.evaluate(()=>scrollY))-before.y)<=1,'Closing translated viewer moved document');
      noErrors(fixture);return{screens:count,zoomPreserved:true,captionRefreshed:true};
    }));

    await check(name,'active-map-flow-details-and-map-viewer',()=>using(browser,base,{locale:'ru-RU'},async fixture=>{
      const {page}=fixture;await goto(page,base);
      await page.evaluate(()=>{document.querySelector('.v23-map-node[data-canon-id="02.05"]').click();document.querySelectorAll('.v23-flow-step')[2].click();document.querySelector('.ax-world-key').open=true;});
      const before=await page.evaluate(()=>({map:document.querySelector('#v23-map-description').textContent,flow:document.querySelector('#v23-flow-message').textContent}));
      await switchLanguage(page,'en');const after=await page.evaluate(()=>({map:document.querySelector('#v23-map-description').textContent,flow:document.querySelector('#v23-flow-message').textContent,selected:document.querySelector('.v23-map-node[aria-pressed=true]').dataset.canonId,step:[...document.querySelectorAll('.v23-flow-step')].findIndex(button=>button.getAttribute('aria-pressed')==='true'),details:document.querySelector('.ax-world-key').open}));
      assert(after.selected==='02.05'&&after.step===2&&after.details,'Switch reset open/selected UI state',after);
      assert(after.map!==before.map&&after.flow!==before.flow&&!/[\u0400-\u04ff]/.test(after.map+after.flow),'Active dynamic text was not translated',{before,after});
      await page.evaluate(()=>document.querySelector('#v23-open-map').click());await page.waitForFunction(()=>document.querySelector('.v23-map-dialog').open);
      await page.locator('.v23-map-dialog .ax-viewer-zoom').click();const zoomSrc=await page.locator('.v23-map-dialog img').getAttribute('src');
      await switchLanguage(page,'ru','.v23-map-dialog');
      const map=await page.locator('.v23-map-dialog').evaluate(dialog=>({open:dialog.open,zoom:dialog.classList.contains('is-zoomed'),src:dialog.querySelector('img').getAttribute('src'),alt:dialog.querySelector('img').alt,title:dialog.querySelector('#v23-map-dialog-title').textContent}));
      assert(map.open&&map.zoom&&map.src===zoomSrc&&/[\u0400-\u04ff]/.test(map.title+map.alt),'Open map lost state or language',map);
      await auditBindings(page);await page.keyboard.press('Escape');
      for(const next of ['en','ru']){
        await switchLanguage(page,next);
        const dynamic=await page.evaluate(()=>{
          const catalog=window.AXIOM_I18N_CATALOGS[window.AXI18n.language],failures=[];
          for(const node of document.querySelectorAll('.v23-map-node')){
            node.click();const prefix='runtime.world.'+node.dataset.canonId;
            if(document.querySelector('#v23-map-signal').textContent!==catalog[prefix+'.signal']||document.querySelector('#v23-map-description').textContent!==catalog[prefix+'.description'])failures.push(prefix);
          }
          [...document.querySelectorAll('.v23-flow-step')].forEach((button,index)=>{button.click();if(document.querySelector('#v23-flow-message').textContent!==catalog['runtime.flow.'+index])failures.push('runtime.flow.'+index)});
          return failures;
        });
        assert(dynamic.length===0,'A dynamic map or SYSTEM state is untranslated',dynamic);
      }
      noErrors(fixture);return{selected:after.selected,flowStep:after.step,detailsPreserved:true,mapZoomPreserved:true,localizedStates:20};
    }));

    await check(name,'image-load-error-remains-localized',()=>using(browser,base,{locale:'en-US'},async fixture=>{
      const {page}=fixture;await page.route('**/assets/showcase/hq/*',route=>route.abort());
      await goto(page,base);await page.evaluate(()=>document.querySelector('#ax-panel-01 .ax-shot-trigger').click());
      const error=page.locator('#showcase-lightbox .ax-viewer-error');await error.waitFor({state:'visible'});
      const before=await error.textContent();await switchLanguage(page,'ru','#showcase-lightbox');const after=await error.textContent();
      assert(before!==after&&/[\u0400-\u04ff]/.test(after),'Image error remained in previous language',{before,after});
      assert(await page.locator('#showcase-lightbox').evaluate(dialog=>dialog.open),'Error or switching closed viewer');
      noErrors(fixture);return{before,after};
    }));

    await check(name,'localized-metadata-and-text-safety',()=>using(browser,base,{locale:'ru-RU'},async fixture=>{
      const {page}=fixture;await goto(page,base);
      const before=await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name=description]').content,og:document.querySelector('meta[property="og:description"]').content}));
      await switchLanguage(page,'en');const after=await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name=description]').content,og:document.querySelector('meta[property="og:description"]').content,locale:document.querySelector('meta[property="og:locale"]').content}));
      assert(before.title!==after.title&&before.description!==after.description&&before.og!==after.og&&after.locale.startsWith('en'),'Runtime metadata not localized',{before,after});
      const safety=await page.evaluate(()=>{const comments=document.createTreeWalker(document.querySelector('#about'),NodeFilter.SHOW_COMMENT);const comment=comments.nextNode(),key=comment.data.slice(5).split('|')[0].trim(),catalog=window.AXIOM_I18N_CATALOGS.en,old=catalog[key],payload='<img id="i18n-catalog-xss" src="x" onerror="window.__i18nXss=true">';catalog[key]=payload;window.AXI18n.setLanguage('en',{persist:false});const safe=!document.querySelector('#i18n-catalog-xss')&&!window.__i18nXss&&comment.nextSibling.textContent.includes(payload);catalog[key]=old;window.AXI18n.setLanguage('en',{persist:false});return safe;});
      assert(safety,'Catalog text was interpreted as markup');noErrors(fixture);return{runtimeMetadata:true,catalogTextEscaped:true};
    }));

    for(const lang of ['en','ru'])await check(name,'loader-standalone-'+lang,()=>using(browser,base,{locale:lang==='ru'?'ru-RU':'en-US',motion:'no-preference'},async fixture=>{
      const {page}=fixture;await goto(page,base+`loader.html?lang=${lang}&auto=false&duration=250`);await language(page,lang);
      await page.waitForFunction(()=>document.querySelector('#enterPrompt').classList.contains('show'));
      const before=await page.locator('#phaseLabel').textContent();await page.evaluate(next=>window.AXI18n.setLanguage(next),lang==='ru'?'en':'ru');
      const after=await page.locator('#phaseLabel').textContent();assert(before!==after,'Loader ready label failed to switch',{before,after});
      await auditBindings(page);noErrors(fixture);return{initial:lang,readyTranslated:true};
    }));

    await check(name,'loader-embedded-language-and-safe-release',()=>using(browser,base,{locale:'ru-RU',boot:true,motion:'no-preference'},async fixture=>{
      const {page}=fixture;await page.goto(base+'?lang=en',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>{const frame=document.querySelector('#axiom-boot iframe');return frame&&frame.contentWindow.AXI18n;},null,{timeout:4000});
      const embedded=await page.evaluate(()=>{const frame=document.querySelector('#axiom-boot iframe');return{src:frame.getAttribute('src'),lang:frame.contentDocument.documentElement.lang,title:frame.title,skip:document.querySelector('#axiom-boot-skip').textContent};});
      assert(embedded.lang==='en'&&new URL(embedded.src,base).searchParams.get('lang')==='en'&&!/[\u0400-\u04ff]/.test(embedded.title+embedded.skip),'Embedded boot language mismatch',embedded);
      await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#axiom-boot'));
      assert(await page.evaluate(()=>getComputedStyle(document.documentElement).overflow!=='hidden'),'Loader left scroll locked');noErrors(fixture);return embedded;
    }));

    for(const lang of ['en','ru'])await check(name,'nested-404-and-language-change-during-typing-'+lang,()=>using(browser,base,{locale:lang==='ru'?'ru-RU':'en-US',motion:'no-preference'},async fixture=>{
      const {page}=fixture;const response=await page.goto(base+`missing/nested/route?lang=${lang}`,{waitUntil:'load'});assert(response.status()===404,'Pages-like server failed 404 routing');await ready(page);await language(page,lang);
      await switchLanguage(page,lang==='ru'?'en':'ru');await auditBindings(page);
      const snapshot=await page.locator('#terminal').textContent();await pause(400);assert(await page.locator('#terminal').textContent()===snapshot,'404 typing restored stale-language text');
      const back=page.locator('a[href="/"]');assert(await back.count()===1,'Nested 404 lacks root return');await back.click();await ready(page);await language(page,lang==='ru'?'en':'ru');noErrors(fixture);return{status:404,typingStable:true,rootReturn:true};
    }));

    for(const lang of ['en','ru'])await check(name,'anchors-and-destination-integrity-'+lang,()=>using(browser,base,{locale:lang==='ru'?'ru-RU':'en-US'},async fixture=>{
      const {page}=fixture;await goto(page,base);const original=await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(link=>link.getAttribute('href')));
      for(const id of ['about','creator','work','system','world-guide','vision','collaboration']){
        await page.evaluate(id=>document.querySelector('.menu a[href="#'+id+'"]').click(),id);
        await page.waitForFunction(id=>location.hash==='#'+id,id);
        const visible=await page.evaluate(id=>{const box=document.getElementById(id).getBoundingClientRect();return box.top<innerHeight&&box.bottom>0;},id);assert(visible,'Anchor target outside viewport',id);
      }
      await switchLanguage(page,lang==='ru'?'en':'ru');const translated=await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(link=>link.getAttribute('href')));assert(JSON.stringify(original)===JSON.stringify(translated),'Language switch changed link destinations');
      const ctas=await page.locator('a.enter').evaluateAll(links=>links.map(link=>link.href));assert(ctas.length===2&&ctas.every(url=>url==='https://axiomgates.com/'),'AXIOM destination changed',ctas);noErrors(fixture);return{anchorCount:7,ctaDestinationsPreserved:true};
    }));

    for(const lang of ['en','ru'])for(const width of [320,390,768,1024,1440,1600])await check(name,`visual-${lang}-${width}`,()=>using(browser,base,{locale:lang==='ru'?'ru-RU':'en-US',width,height:width<500?844:width===768?1024:900},async fixture=>{
      const {page}=fixture;await goto(page,base);await language(page,lang);await auditBindings(page);
      const geometry=await page.evaluate(()=>{const root=document.documentElement;const candidates=[...document.querySelectorAll('[data-language="en"]')].filter(element=>{const rect=element.getBoundingClientRect(),css=getComputedStyle(element);return rect.width>0&&rect.height>0&&css.visibility!=='hidden';});const button=candidates[0],rect=button?.getBoundingClientRect();return{scrollWidth:root.scrollWidth,clientWidth:root.clientWidth,button:rect?{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width,height:rect.height}:null,hit:rect?button.contains(document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2)):false};});
      assert(geometry.scrollWidth<=geometry.clientWidth+1,'Horizontal document overflow',geometry);
      assert(geometry.button&&geometry.button.left>=0&&geometry.button.right<=width&&geometry.hit,'Language switcher hidden, clipped or covered',geometry);
      await capture(page,`${name}-${lang}-${width}-hero.png`);
      if(width===390||width===1440){for(const [section,selector] of [['work','#work'],['world','#world-guide']]){await setScroll(page,selector);await capture(page,`${name}-${lang}-${width}-${section}.png`);}}
      noErrors(fixture);return geometry;
    }));

    await check(name,'standalone-archive-shares-language-preference',()=>using(browser,base,{locale:'ru-RU'},async fixture=>{
      const {page}=fixture;await page.goto(base+'serafim-veyr/',{waitUntil:'load'});
      await page.waitForFunction(()=>document.documentElement.lang==='ru'&&!document.documentElement.classList.contains('sv-language-pending'));
      const ruTitle=await page.title();await page.locator('[data-lang="en"]').click();await page.evaluate(()=>window.SVArchive?.whenSettled);
      await page.waitForFunction(()=>document.documentElement.lang==='en');
      assert(await page.evaluate(key=>localStorage.getItem(key),KEY)==='en','Archive did not save manual choice');
      await page.reload({waitUntil:'load'});assert(await page.evaluate(()=>document.documentElement.lang)==='en','Archive lost saved preference');
      assert((await page.title())!==ruTitle,'Archive metadata did not follow locale');
      await page.goto(base,{waitUntil:'load'});await ready(page);await language(page,'en');noErrors(fixture);return{archiveAndLandingPreference:true};
    }));

    await check(name,'javascript-disabled-source-remains-readable',()=>using(browser,base,{js:false},async fixture=>{
      const {page}=fixture;await page.goto(base,{waitUntil:'load'});const state=await page.evaluate(()=>({visible:getComputedStyle(document.body).visibility,text:document.body.innerText.length,work:document.querySelectorAll('#showcase-gallery [role=tabpanel]').length}));assert(state.visible==='visible'&&state.text>1000&&state.work===8,'No-JS fallback lost content',state);return state;
    }));
  } finally { await browser.close(); }
}

(async()=>{
  initializeOutput(); const before=sourceSnapshot(); let server;
  try {
    const engines=require('playwright');const chosen=arg('--engine',null);assert(!chosen||['chromium','firefox'].includes(chosen),'Unknown browser engine');
    let base=arg('--url',null);if(!base){const served=await serve();server=served.server;base=served.base;}if(!base.endsWith('/'))base+='/';
    for(const engine of chosen?[chosen]:['chromium','firefox'])await runEngine(engine,engines[engine],base);
  }catch(error){emit('harness','fatal','FAIL',String(error.stack||error));}
  finally{
    if(server)await new Promise(resolve=>server.close(resolve));
    const after=sourceSnapshot();if(JSON.stringify(before.hashes)!==JSON.stringify(after.hashes))emit('harness','source-changed-during-run','FAIL','Tested source was modified while browsers were running');
    const summary=Object.fromEntries(['PASS','FAIL','NOT_RUN','OBSERVED'].map(status=>[status,results.filter(result=>result.status===status).length]));
    const report={started:RUN_ID,finished:new Date().toISOString(),source:before,sourceAfter:after,summary,results,screenshots,artifactBytes:writtenBytes,limits:{retainedRuns:3,retentionDays:14,runBytes:MAX_BYTES},notRun:['real-device/GPU','manual screen reader','human visual acceptance','field CWV','full crawler SEO localization']};
    fs.writeFileSync(path.join(runDir,'report.json'),JSON.stringify(report,null,2)+'\n');
    process.stdout.write(`RESULT ${JSON.stringify(summary)}\nEVIDENCE ${runDir}\n`);process.exitCode=summary.FAIL?1:summary.NOT_RUN?2:0;
  }
})();
