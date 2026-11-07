/* Focused read-only diagnosis of R29, using the original fixed400ms waits and the original normal-motion browser fixture.
 * Reproduces R06 -> R09/R10/R11/R15 -> R14 -> R29 only, then observes settled/repeated targets.
 * Adds scroll/aria telemetry and snapshots; does not inject styles or mutate product files.
 * Usage: NODE_PATH=<existing Playwright node_modules> node r29-diagnosis.cjs --root <isolated checkout> --out <owned report.json>
 * Browser and ephemeral static server close in finally. Output is one bounded JSON file (overwrite), no profiles/traces/videos.
 * Observed clean product4aafcbe9: isolated about400/vision400 passed, no errors. Full concurrent suite had one Chromium-only R29 failure.
 * That supports a scheduler/contention flake; the failing full-run lacked coords, so exact missed event cannot be proven retrospectively.
 */
#!/usr/bin/env node
/*
 * AXIOM SHOWCASE — browser regression checks (task 0524, V0.3.1).
 *
 * Real-browser assertions for defects found in the W0 audit (docs/showcase-v031/AUDIT_REPORT.md) and for the
 * W1 decisions (docs/showcase-v031/OPEN_ISSUES.md, Q-01…Q-09). Every check is tied to a finding or decision ID.
 * W1 adapted R02/R03/R04/R05/R07/R15 to the WORK archive (Q-01 intentionally removed the stage + duplicate grid).
 * W1.R: WORK B and TYPE A are final (Q-02/Q-03) — the A/B switch and its checks are gone; R30 now checks that old
 * variant URLs open the final design, R37 measures pink/plum in the rendered AXIOM emblem (Q-04).
 * Exit code = number of failed checks.
 *
 * Usage (Playwright is not a dependency of this static repo; point NODE_PATH at any install):
 *   NODE_PATH=/path/to/node_modules node tests/browser/showcase_regression.cjs [--url http://127.0.0.1:8080/] [--firefox] [--json out.json]
 * Without --url the script serves this repository itself on a free local port.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium, firefox } = require('playwright');

const args = process.argv.slice(2);
const argVal = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const ROOT = path.resolve(argVal('--root') || '/home/axiom/ENDEAVOR/AXS-WORKTREES/showcase-i18n-en-ru');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json', '.woff2': 'font/woff2', '.txt': 'text/plain' };

function serveRepo() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let file = path.join(ROOT, p);
      if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      let status = 200;
      if (!fs.existsSync(file)) { file = path.join(ROOT, '404.html'); status = 404; }
      res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    }).listen(0, '127.0.0.1', () => resolve({ srv, url: `http://127.0.0.1:${srv.address().port}/` }));
  });
}

const results = [];
function skip(id, engine, why) {
  results.push({ id, engine, ok: true, skipped: true, detail: why });
  process.stdout.write(`SKIP  ${id.padEnd(34)} [${engine}] ${why}\n`);
}
function record(id, engine, ok, detail) {
  results.push({ id, engine, ok, detail });
  process.stdout.write(`${ok ? 'PASS' : 'FAIL'}  ${id.padEnd(34)} [${engine}] ${typeof detail === 'string' ? detail : JSON.stringify(detail)}\n`);
}

/* tracks the loader overlay from the first parsed byte (init scripts run before page scripts) */
const BOOT_PROBE = () => {
  if (window.top !== window) return;
  const mo = new MutationObserver(() => {
    const el = document.getElementById('axiom-boot');
    if (el && window.__bootAdded === undefined) window.__bootAdded = performance.now();
    if (!el && window.__bootAdded !== undefined && window.__bootRemoved === undefined) window.__bootRemoved = performance.now();
  });
  mo.observe(document, { childList: true, subtree: true });
};

async function page(browser, engine, { w, h, dpr = 1, mobile = false, seen = true, reduced = false, js = true, init = null } = {}) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h }, deviceScaleFactor: dpr, hasTouch: mobile, locale: 'ru-RU', colorScheme: 'dark', javaScriptEnabled: js,
    reducedMotion: reduced ? 'reduce' : 'no-preference', ...(engine === 'chromium' ? { isMobile: mobile } : {}),
  });
  if (seen) await ctx.addInitScript(() => { try { sessionStorage.setItem('axiom_loader_seen', '1'); } catch (_) {} });
  await ctx.addInitScript(BOOT_PROBE);
  if (init) await ctx.addInitScript(init);
  const p = await ctx.newPage();
  p.__requests = [];
  p.on('request', (r) => p.__requests.push(r.url()));
  return { ctx, p };
}
const toEl = (p, sel, offset = 140) => p.evaluate(([s, o]) => { const el = document.querySelector(s); window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - o, behavior: 'instant' }); }, [sel, offset]);
/* device pixels delivered ÷ device pixels drawn, using the real file size of currentSrc and the object-fit geometry */
const SHARPNESS = async (sel) => {
  const i = document.querySelector(sel);
  const probe = new Image(); probe.src = i.currentSrc; await probe.decode().catch(() => {});
  const b = i.getBoundingClientRect(); const fit = getComputedStyle(i).objectFit;
  const nw = probe.naturalWidth, nh = probe.naturalHeight;
  const s = fit === 'cover' ? Math.max(b.width / nw, b.height / nh) : fit === 'contain' ? Math.min(b.width / nw, b.height / nh) : b.width / nw;
  const need = nw * s * devicePixelRatio;
  return { file: i.currentSrc.split('/').pop(), filePx: nw, needPx: Math.round(need), ratio: +(nw / need).toFixed(2) };
};
const archiveState = () => {
  const tabs = [...document.querySelectorAll('#showcase-gallery [role="tab"]')];
  const panels = [...document.querySelectorAll('#showcase-gallery [role="tabpanel"]')];
  return {
    selected: tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'),
    visible: panels.map((pn, i) => (getComputedStyle(pn).display !== 'none' ? i : -1)).filter((i) => i >= 0),
    tabStops: tabs.filter((t) => t.tabIndex === 0).length,
    focused: tabs.indexOf(document.activeElement),
    count: document.querySelector('.ax-archive-count')?.textContent,
  };
};

const report={sourceSha:require('child_process').execFileSync('git',['-C',ROOT,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),createdAt:new Date().toISOString(),snapshots:[],pageerrors:[],console:[]};let server,browser;
const snapshot=async(p,label)=>{const v=await p.evaluate(()=>{const ids=['top','about','creator','work','system','world-guide','vision','collaboration'];const sections=ids.map(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect();return{id,top:r.top,bottom:r.bottom,height:r.height,opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform}});return{scrollY,innerHeight,hash:location.hash,active:document.activeElement?.outerHTML.slice(0,250),headerBottom:document.querySelector('.top').getBoundingClientRect().bottom,links:[...document.querySelectorAll('.menu a')].map(a=>({href:a.getAttribute('href'),ariaCurrent:a.getAttribute('aria-current'),label:a.textContent})),sections,candidate:sections.filter(s=>s.top<=innerHeight*.35).at(-1)?.id,probe:window.__navprobe?.slice(-15)}});report.snapshots.push({label,...v});console.log(label+' '+JSON.stringify(v));};
(async()=>{try{server=await serveRepo();browser=await chromium.launch();const {ctx,p}=await page(browser,'chromium',{w:1440,h:900});p.on('pageerror',e=>report.pageerrors.push(String(e.stack)));p.on('console',m=>{if(m.type()==='error')report.console.push(m.text())});await p.addInitScript(()=>{window.__navprobe=[];const note=kind=>{const t=performance.now();window.__navprobe.push({kind,t,y:scrollY,focused:document.activeElement?.id,links:[...document.querySelectorAll('.menu a[aria-current]')].map(a=>a.getAttribute('href'))});if(window.__navprobe.length>200)window.__navprobe.shift()};addEventListener('scroll',()=>note('scroll'));addEventListener('error',e=>note('error:'+e.message));addEventListener('DOMContentLoaded',()=>{const menu=document.querySelector('.menu');if(menu)new MutationObserver(()=>note('aria')).observe(menu,{attributes:true,subtree:true,attributeFilter:['aria-current']})});});
await p.goto(server.url,{waitUntil:'load'});await p.waitForTimeout(1500);await snapshot(p,'initial');
await toEl(p,'#v23-open-map',400);await p.waitForTimeout(300);await p.locator('#v23-open-map').click();await p.waitForFunction(()=>{const d=document.querySelector('.v23-map-dialog'),i=d&&d.querySelector('img');return i&&i.complete&&i.naturalWidth>0},null,{timeout:15000});await p.keyboard.press('Escape');await p.waitForTimeout(300);
await p.evaluate(()=>{const b=document.getElementById('v23-open-map'),cs=getComputedStyle(b);return{cls:b.className,bg:cs.backgroundColor,font:cs.fontFamily.split(',')[0]}});await p.evaluate(()=>[...document.querySelectorAll('.v22-phase-meta > div')].map(d=>{const dd=d.querySelector('dd').getBoundingClientRect(),r=document.createRange();r.selectNodeContents(d.querySelector('dt'));const tw=r.getBoundingClientRect();return{label:d.querySelector('dt').textContent,gap:Math.round(dd.left-tw.right)}}));await p.evaluate(()=>({enter:[...document.querySelectorAll('a.enter')].map(a=>a.getAttribute('aria-label')||a.textContent.trim()),shots:[...document.querySelectorAll('.ax-shot-trigger')].map(b=>b.getAttribute('aria-label')||'')}));
await p.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await p.locator('.menu a[href="#work"]').click();await p.waitForTimeout(1500);await snapshot(p,'R14');
await p.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await p.waitForTimeout(300);await snapshot(p,'top-before-R29');
await toEl(p,'#about',0);await p.waitForTimeout(400);await snapshot(p,'about400');
await toEl(p,'#vision',0);await p.waitForTimeout(400);await snapshot(p,'vision400');await p.waitForTimeout(1500);await snapshot(p,'vision1900');
await toEl(p,'#about',0);await p.waitForTimeout(400);await snapshot(p,'about-repeat400');await p.waitForTimeout(1500);await snapshot(p,'about-repeat1900');
report.nums=await p.evaluate(()=>[...document.querySelectorAll('.show-index > span:first-child')].map(s=>parseInt(s.textContent,10)));await ctx.close();console.log('ERRORS '+JSON.stringify({pageerrors:report.pageerrors,console:report.console}));}catch(e){report.fatal=String(e.stack);console.log('FATAL '+e.stack);process.exitCode=1}finally{fs.writeFileSync(path.resolve(argVal('--out') || path.join(__dirname,'r29-diagnosis-recheck.json')),JSON.stringify(report,null,2));if(browser)await browser.close();if(server)await new Promise(resolve=>server.srv.close(resolve))}})();