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
const ROOT = path.resolve(__dirname, '..', '..');
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

async function run(engineName, base) {
  const engine = engineName === 'firefox' ? firefox : chromium;
  const browser = await engine.launch();
  try {
    // R01 horizontal overflow — phones, tablet, 1100, desktop, landscape phone, 200 % zoom (CSS viewport halved at DPR 2)
    for (const [w, h, dpr, q] of [[360, 800, 1, ''], [390, 844, 1, ''], [430, 932, 1, ''], [768, 1024, 1, ''], [1024, 768, 1, ''], [1100, 800, 1, ''], [1280, 800, 1, ''], [1440, 900, 1, ''], [1920, 1080, 1, ''],
      [844, 390, 1, ''], [720, 450, 2, '']]) {
      const { ctx, p } = await page(browser, engineName, { w, h, dpr, mobile: w < 800 && h > w });
      await p.goto(base + q, { waitUntil: 'load' });
      const m = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      record(`R01-no-h-overflow-${w}x${h}${dpr > 1 ? '@' + dpr : ''}`, engineName, m.sw <= m.cw + 1, m);
      await ctx.close();
    }
    // R02 WORK intro (WEB CORE card after the archive) on phones (A-WORK-01): single column, heading readable, no concept art inside (it lives in the band)
    for (const [w, h] of [[360, 800], [390, 844], [430, 932]]) {
      for (const q of ['']) {
        const { ctx, p } = await page(browser, engineName, { w, h, mobile: true });
        await p.goto(base + q, { waitUntil: 'load' });
        await p.evaluate(() => document.fonts.ready);
        await toEl(p, '.v22-public-feature h3', 200);
        await p.waitForTimeout(400);
        const f = await p.evaluate(() => {
          const feat = document.querySelector('.v22-public-feature');
          const h3 = feat.querySelector('.show-feature-body h3');
          const art = feat.querySelector('.v22-feature-art');
          const hb = h3.getBoundingClientRect();
          const hit = document.elementFromPoint(hb.left + Math.min(20, hb.width / 2), hb.top + hb.height / 2);
          const fb = feat.getBoundingClientRect(); const ab = art ? art.getBoundingClientRect() : null;
          return { cols: getComputedStyle(feat).gridTemplateColumns.split(' ').length, headingVisible: !!hit && h3.contains(hit), art: !!art, artInside: !ab || (ab.left >= fb.left - 1 && ab.right <= fb.right + 1) };
        });
        record(`R02-work-intro-${w}`, engineName, f.cols === 1 && f.headingVisible && f.artInside && !f.art, f);
        await ctx.close();
      }
    }
    // R03 one archive (Q-01): 8 tabs + 8 panels, exactly one panel shown, no duplicate gallery; panel stacks on phones
    for (const [w, h] of [[390, 844], [1440, 900]]) {
      const { ctx, p } = await page(browser, engineName, { w, h, mobile: w < 800 });
      await p.goto(base, { waitUntil: 'load' });
      const a = await p.evaluate(() => {
        const tabs = [...document.querySelectorAll('#showcase-gallery [role="tab"]')]; const panels = [...document.querySelectorAll('#showcase-gallery [role="tabpanel"]')];
        const first = panels[0];
        return { tabs: tabs.length, panels: panels.length, shown: panels.filter((x) => getComputedStyle(x).display !== 'none').length, linked: tabs.every((t) => document.getElementById(t.getAttribute('aria-controls'))?.getAttribute('aria-labelledby') === t.id), legacyGrid: document.querySelectorAll('.show-screen-grid, .v23-work-stage').length, facts: [...first.querySelectorAll('.ax-case-facts dt')].map((d) => d.textContent), panelCols: getComputedStyle(first).gridTemplateColumns.split(' ').length };
      });
      const wantCols = w < 980 ? 1 : 2;
      record(`R03-one-archive-${w}`, engineName, a.tabs === 8 && a.panels === 8 && a.shown === 1 && a.linked && a.legacyGrid === 0 && a.facts.length === 4 && a.panelCols === wantCols, a);
      await ctx.close();
    }
    // R04 archive keeps a sharp candidate after a tab change; R05 viewer focus/scroll return; R07 system pointer in the viewer
    {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900, dpr: 2 });
      await p.goto(base, { waitUntil: 'load' });
      // clicks via the DOM: Playwright's own scroll-into-view during the section reveal transition moved the page (harness artefact)
      await toEl(p, '#showcase-gallery', 100); await p.waitForTimeout(1100);
      await p.evaluate(() => document.querySelectorAll('#showcase-gallery [role="tab"]')[2].click());
      await p.waitForFunction(() => { const i = document.querySelector('#ax-panel-03 img'); return i.complete && i.naturalWidth > 0; }, null, { timeout: 15000 }).catch(() => {});
      await p.waitForTimeout(300);
      const s = await p.evaluate(SHARPNESS, '#ax-panel-03 img');
      const widths = await p.evaluate(() => (document.querySelector('#ax-panel-03 img').getAttribute('srcset') || '').split(',').map((c) => parseInt(c.trim().split(/\s+/)[1], 10)).filter(Boolean));
      record('R04-archive-sharp-after-select', engineName, widths.length >= 3 && (s.ratio >= 0.95 || s.filePx >= Math.max(...widths)), { ...s, srcset: widths });
      const y0 = await p.evaluate(() => Math.round(scrollY));
      await p.evaluate(() => document.querySelector('#ax-panel-03 .ax-shot-trigger').click()); await p.waitForTimeout(500);
      await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
      await p.keyboard.press('Escape'); await p.waitForTimeout(600);
      const r = await p.evaluate(() => ({ active: document.activeElement.closest('[role="tabpanel"]')?.id || document.activeElement.className, y: Math.round(scrollY), shown: [...document.querySelectorAll('#showcase-gallery [role="tabpanel"]')].findIndex((x) => !x.hidden) }));
      record('R05-viewer-focus-return', engineName, r.active === 'ax-panel-04' && r.shown === 3 && Math.abs(r.y - y0) <= 8, { ...r, y0 });
      await p.evaluate(() => document.querySelector('#ax-panel-04 .ax-shot-trigger').click()); await p.waitForTimeout(500);
      await p.mouse.move(720, 450); await p.waitForTimeout(200);
      const c = await p.evaluate(() => { const el = document.elementFromPoint(720, 450); const cur = document.getElementById('indexCursor'); return { cssCursor: el ? getComputedStyle(el).cursor : null, customCursorShown: !!cur && getComputedStyle(cur).display !== 'none' && getComputedStyle(cur).opacity !== '0' && getComputedStyle(cur).visibility !== 'hidden' }; });
      record('R07-pointer-visible-in-modal', engineName, c.cssCursor !== 'none' && !c.customCursorShown, c);
      // R19 viewer: 1:1 shows the lossless capture and pans; fit returns; arrows page; Home/End; Z by physical key (Cyrillic layout)
      await p.keyboard.press('Equal'); await p.waitForTimeout(700);
      const z = await p.evaluate(() => { const d = document.getElementById('showcase-lightbox'); const st = d.querySelector('.show-lightbox-image'); const i = d.querySelector('img'); return { zoomed: d.classList.contains('is-zoomed'), src: (i.currentSrc || i.src).split('/').pop(), pans: st.scrollWidth > st.clientWidth + 10, pressed: d.querySelector('.ax-viewer-zoom').getAttribute('aria-pressed') }; });
      await p.keyboard.press('Digit0'); await p.waitForTimeout(300);
      const fit = await p.evaluate(() => !document.getElementById('showcase-lightbox').classList.contains('is-zoomed'));
      await p.keyboard.press('End'); await p.waitForTimeout(200);
      const last = await p.evaluate(() => document.getElementById('ax-viewer-count').textContent);
      await p.keyboard.press('ArrowRight'); await p.waitForTimeout(200);
      const wrapped = await p.evaluate(() => document.getElementById('ax-viewer-count').textContent);
      await p.evaluate(() => document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'я', code: 'KeyZ', bubbles: true, cancelable: true })));
      await p.waitForTimeout(300);
      const cyr = await p.evaluate(() => document.getElementById('showcase-lightbox').classList.contains('is-zoomed'));
      record('R19-viewer-zoom-paging-keys', engineName, z.zoomed && /-full\.webp$/.test(z.src) && z.pans && z.pressed === 'true' && fit && last === '08 / 08' && wrapped === '01 / 08' && cyr, { ...z, fit, last, wrapped, cyrillicZ: cyr });
      // R38 at 1:1 the whole capture is reachable: the image starts at the scroll origin (Chromium centred it and cut off the left part)
      await p.waitForTimeout(500);
      const edge = await p.evaluate(() => { const st = document.querySelector('#showcase-lightbox .show-lightbox-image'); const i = st.querySelector('img'); st.scrollLeft = 0; st.scrollTop = 0; const r = i.getBoundingClientRect(), sr = st.getBoundingClientRect(); return { zoomed: document.getElementById('showcase-lightbox').classList.contains('is-zoomed'), left: Math.round(r.left - sr.left), top: Math.round(r.top - sr.top), w: Math.round(r.width), scrollW: st.scrollWidth }; });
      record('R38-viewer-1to1-left-edge', engineName, edge.zoomed && edge.left === 0 && edge.top === 0 && edge.scrollW >= edge.w - 1, edge);
      await p.keyboard.press('Escape');
      await ctx.close();
    }
    // R39 map viewer (Q-11): FIT ↔ 1:1 on the V10 derivative 3840w, whole map reachable, arrows pan, focus returns to the button
    {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900 });
      await p.goto(base, { waitUntil: 'load' });
      await toEl(p, '#v23-open-map', 400); await p.locator('#v23-open-map').click(); await p.waitForTimeout(500);
      const f = await p.evaluate(() => ({ open: document.querySelector('.v23-map-dialog').open, focus: document.activeElement.className }));
      await p.keyboard.press('Equal');
      await p.waitForFunction(() => { const i = document.querySelector('.v23-map-dialog img'); return /3840w/.test(i.currentSrc || i.src) && i.complete && i.naturalWidth > 0; }, null, { timeout: 20000 }).catch(() => {});
      await p.waitForTimeout(300);
      const mapGeom = () => { const st = document.querySelector('.v23-map-dialog .show-lightbox-image'); const i = st.querySelector('img'); const l = st.scrollLeft, t = st.scrollTop; st.scrollLeft = 0; st.scrollTop = 0; const r = i.getBoundingClientRect(), sr = st.getBoundingClientRect(); const o = { src: (i.currentSrc || i.src).split('/').pop(), w: Math.round(r.width), left: Math.round(r.left - sr.left), scrollW: st.scrollWidth }; st.scrollLeft = l; st.scrollTop = t; return o; };
      const z = await p.evaluate(mapGeom);
      const x0 = await p.evaluate(() => document.querySelector('.v23-map-dialog .show-lightbox-image').scrollLeft);
      await p.keyboard.press('ArrowRight');
      const x1 = await p.evaluate(() => document.querySelector('.v23-map-dialog .show-lightbox-image').scrollLeft);
      await p.keyboard.press('Escape'); await p.waitForTimeout(300);
      const back = await p.evaluate(() => ({ open: document.querySelector('.v23-map-dialog').open, focus: document.activeElement.id }));
      record('R39-map-viewer-1to1', engineName, f.open && /show-lightbox-close/.test(f.focus) && z.src === 'world-spine-map-3840w.webp' && z.w === 3840 && z.left === 0 && z.scrollW >= 3839 && x1 > x0 && !back.open && back.focus === 'v23-open-map', { f, z, pan: x1 - x0, back });
      await ctx.close();
      // R40 low-memory phone: 2880w, 1:1 in device pixels (DPR 3 → 960 CSS px), touch opens 1:1 from the button
      const lite = await page(browser, engineName, { w: 390, h: 844, dpr: 3, mobile: true, init: () => { try { Object.defineProperty(Navigator.prototype, 'deviceMemory', { get: () => 1, configurable: true }); } catch (_) {} } });
      await lite.p.goto(base, { waitUntil: 'load' });
      await toEl(lite.p, '#v23-open-map', 300); await lite.p.locator('#v23-open-map').click(); await lite.p.waitForTimeout(400);
      await lite.p.locator('.v23-map-dialog .ax-viewer-zoom').click();
      await lite.p.waitForFunction(() => { const i = document.querySelector('.v23-map-dialog img'); return /2880w/.test(i.currentSrc || i.src) && i.complete && i.naturalWidth > 0; }, null, { timeout: 20000 }).catch(() => {});
      await lite.p.waitForTimeout(300);
      const lz = await lite.p.evaluate(mapGeom);
      const loaded3840 = lite.p.__requests.some((u) => /3840w/.test(u));
      record('R40-map-viewer-low-memory', engineName, lz.src === 'world-spine-map-2880w.webp' && lz.w === 960 && lz.left === 0 && !loaded3840, { ...lz, loaded3840 });
      await lite.ctx.close();
    }
    // R41 AXIOM GATE note (Q-16): shown only for a live manual flag; expired flag, missing file, network error or timeout → hidden; the page never probes axiomgates.com and the note does not move the layout
    {
      const future = new Date(Date.now() + 864e5).toISOString(), past = new Date(Date.now() - 864e5).toISOString();
      const cases = [
        ['live', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ schema: 1, state: 'unavailable', checkedAt: '2026-10-17', expires: future }) }), true],
        ['expired', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ schema: 1, state: 'unavailable', checkedAt: '2026-10-17', expires: past }) }), false],
        ['available', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ schema: 1, state: 'available', checkedAt: '2026-10-17', expires: future }) }), false],
        ['404', (r) => r.fulfill({ status: 404, body: 'nope' }), false],
        ['network-error', (r) => r.abort('failed'), false],
        ['timeout', (r) => new Promise((res) => setTimeout(res, 4000)).then(() => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ state: 'unavailable', expires: future }) })).catch(() => {}), false],
      ];
      const results = {};
      for (const [name, handler, expectShown] of cases) {
        const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900 });
        await p.route('**/assets/status/gate.json', handler);
        await p.goto(base, { waitUntil: 'load' }); await p.waitForTimeout(name === 'timeout' ? 4800 : 900);
        const st = await p.evaluate(() => ({ shown: [...document.querySelectorAll('.ax-gate-note')].map((n) => !n.hidden && n.getBoundingClientRect().height === 0 && getComputedStyle(n).display !== 'none'), text: (document.querySelector('.ax-gate-note') || {}).textContent || '', hrefs: [...document.querySelectorAll('a.enter')].map((a) => a.getAttribute('href')), docH: document.documentElement.scrollHeight, enterBottoms: [...document.querySelectorAll('.enter-wrap')].map((e) => Math.round(e.getBoundingClientRect().bottom + scrollY)), nextTop: Math.round(document.querySelector('.show-hero-extra').getBoundingClientRect().top + scrollY) }));
        const probed = p.__requests.some((u) => /axiomgates\.com/.test(u));
        results[name] = { ...st, probed, ok: st.shown.length === 2 && st.shown.every((v) => v === expectShown) && st.hrefs.every((h) => h === 'https://axiomgates.com') && !probed && (!expectShown || /статус на 17\.10/.test(st.text)) };
        await ctx.close();
      }
      const same = results.live.docH === results.available.docH && results.live.nextTop === results.available.nextTop;
      record('R41-gate-note-manual-flag', engineName, Object.values(results).every((r) => r.ok) && same, { layoutUnchanged: same, ...results });
    }
    // R42 WORLD (D-01): cards carry Canon V3 IDs 02.01…02.06 in canon order; every selection (mouse and keyboard) keeps ID, name, description and the selected card in sync
    {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900 });
      await p.goto(base, { waitUntil: 'load' });
      await toEl(p, '.v23-map-node-grid', 300);
      const expect = [['02.01', 'GLUHAYA', 'GLUHAYA STATION', 'Глухая станция'], ['02.02', 'NEXUS', 'NEXUS', 'NEXUS'], ['02.03', 'FACELESS BASE', 'FACELESS BASE', 'FACELESS BASE'], ['02.04', 'ECHELON', 'ECHELON', 'ECHELON'], ['02.05', 'OMEGA-0', 'LABORATORY OMEGA-0', 'OMEGA-0'], ['02.06', 'AI ZONE', 'AI ZONE', 'AI ZONE']];
      const cards = await p.evaluate(() => [...document.querySelectorAll('.v23-map-node')].map((b) => [b.dataset.canonId, b.querySelector('.v23-map-num').textContent, b.querySelector('.v23-map-name').textContent]));
      const orderOk = cards.length === 6 && cards.every((c, i) => c[0] === expect[i][0] && c[1] === expect[i][0] && c[2] === expect[i][1]);
      const state = () => p.evaluate(() => ({ id: document.getElementById('v23-map-id').textContent, desc: document.getElementById('v23-map-description').textContent, active: [...document.querySelectorAll('.v23-map-node')].findIndex((b) => b.getAttribute('aria-pressed') === 'true'), count: document.getElementById('v23-map-active-count').textContent }));
      const sel = [];
      for (const i of [3, 2, 5, 0, 4, 1]) {
        if (i % 2) await p.locator('.v23-map-node').nth(i).click(); else { await p.locator('.v23-map-node').nth(i).focus(); await p.keyboard.press('Enter'); }
        const st = await state();
        sel.push({ i, ...st, ok: st.id === `${expect[i][0]} / ${expect[i][2]}` && st.desc.startsWith(expect[i][3]) && st.active === i && st.count === `${String(i + 1).padStart(2, '0')} / 06 SELECTED` });
      }
      record('R42-world-canon-ids-sync', engineName, orderOk && sel.every((x) => x.ok), { cards, bad: sel.filter((x) => !x.ok) });
      await ctx.close();
    }
    // R44 (D-02): character stats never clip — OFFICIALLY DEAD / OPERATIONALLY ACTIVE / UNCLASSIFIED fit narrow three-column cards too
    {
      const { ctx, p } = await page(browser, engineName, { w: 360, h: 800 });
      await p.goto(base, { waitUntil: 'load' });
      const out = [];
      for (const w of [360, 430, 768, 1024, 1100, 1280, 1920]) {
        await p.setViewportSize({ width: w, height: 900 }); await p.waitForTimeout(150);
        const over = await p.evaluate(() => Math.max(...[...document.querySelectorAll('.char .stats')].map((s) => { const sr = s.getBoundingClientRect(); return Math.max(s.scrollWidth - s.clientWidth, ...[...s.querySelectorAll('div, b, small')].map((el) => Math.round(el.getBoundingClientRect().right - sr.right))); })));
        out.push({ w, over });
      }
      record('R44-char-stats-no-clip', engineName, out.every((o) => o.over <= 1), out);
      await ctx.close();
    }
    // R16 archive keyboard (APG tabs): arrows move and select with roving tabindex, Home/End; R17 prev/next wrap; R18 touch swipe
    {
      const { ctx, p } = await page(browser, engineName, { w: 1280, h: 800 });
      await p.goto(base, { waitUntil: 'load' });
      await toEl(p, '#showcase-gallery', 100); await p.waitForTimeout(300);
      await p.locator('#ax-tab-01').focus();
      await p.keyboard.press('ArrowRight'); const s1 = await p.evaluate(archiveState);
      await p.keyboard.press('End'); const s2 = await p.evaluate(archiveState);
      await p.keyboard.press('ArrowRight'); const s3 = await p.evaluate(archiveState);
      await p.keyboard.press('Home'); const s4 = await p.evaluate(archiveState);
      record('R16-archive-keyboard', engineName, s1.selected === 1 && s1.focused === 1 && s1.visible.join() === '1' && s1.tabStops === 1 && s2.selected === 7 && s3.selected === 0 && s4.selected === 0 && s4.count === '01 / 08', { s1, s2: s2.selected, s3: s3.selected, s4: s4.selected });
      await p.locator('.ax-archive-prev').click(); const n1 = await p.evaluate(archiveState);
      await p.locator('.ax-archive-next').click(); await p.locator('.ax-archive-next').click(); const n2 = await p.evaluate(archiveState);
      const liveText = await p.evaluate(() => document.getElementById('ax-archive-live').textContent);
      record('R17-archive-prev-next', engineName, n1.selected === 7 && n2.selected === 1 && /02 \/ 08/.test(liveText), { afterPrev: n1.selected, afterNext2: n2.selected, liveText });
      await p.evaluate(() => { const el = document.querySelector('.ax-archive-panels'); const r = el.getBoundingClientRect(); const y = r.top + 80; const mk = (t, x) => new PointerEvent(t, { pointerType: 'touch', pointerId: 9, isPrimary: true, clientX: x, clientY: y, bubbles: true }); el.dispatchEvent(mk('pointerdown', r.left + 320)); el.dispatchEvent(mk('pointerup', r.left + 110)); });
      const sw1 = await p.evaluate(archiveState);
      const opened = await p.evaluate(() => { document.querySelector('#ax-panel-03 .ax-shot-trigger').click(); return document.getElementById('showcase-lightbox').open; });
      record('R18-archive-swipe', engineName, sw1.selected === 2 && !opened, { afterSwipeLeft: sw1.selected, clickAfterSwipeOpenedViewer: opened });
      await ctx.close();
    }
    // R06 map: high-res dialog image not fetched before the dialog opens (A-WLD-04)
    {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900 });
      await p.goto(base, { waitUntil: 'load' }); await p.waitForTimeout(1500);
      const before = p.__requests.filter((u) => /world-spine-map-(2048|2880|3840)w/.test(u)).length;
      await toEl(p, '#v23-open-map', 400); await p.waitForTimeout(300);
      await p.locator('#v23-open-map').click();
      await p.waitForFunction(() => { const d = document.querySelector('.v23-map-dialog'); const i = d && d.querySelector('img'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 15000 }).catch(() => {});
      const after = await p.evaluate(() => { const i = document.querySelector('.v23-map-dialog img'); return i ? i.naturalWidth : 0; });
      record('R06-map-dialog-lazy', engineName, before === 0 && after > 0, { requestedBeforeOpen: before, naturalAfterOpen: after });
      // R09 open-map button uses the design system (A-WLD-05)
      await p.keyboard.press('Escape'); await p.waitForTimeout(300);
      const btn = await p.evaluate(() => { const b = document.getElementById('v23-open-map'); const cs = getComputedStyle(b); return { cls: b.className, bg: cs.backgroundColor, font: cs.fontFamily.split(',')[0] }; });
      record('R09-open-map-styled', engineName, /v23-open-map/.test(btn.cls) && !/Arial|sans-serif/.test(btn.font), btn);
      // R10 VISION phase meta labels do not collide (A-VIS-01)
      const dl = await p.evaluate(() => [...document.querySelectorAll('.v22-phase-meta > div')].map((d) => { const dd = d.querySelector('dd').getBoundingClientRect(); const r = document.createRange(); r.selectNodeContents(d.querySelector('dt')); const tw = r.getBoundingClientRect(); return { label: d.querySelector('dt').textContent, gap: Math.round(dd.left - tw.right) }; }));
      record('R10-vision-meta-no-collision', engineName, dl.every((x) => x.gap >= 6), dl.filter((x) => x.gap < 6));
      // R11 / R15 accessible names contain visible labels (WCAG 2.5.3) (A-A11Y-02)
      const names = await p.evaluate(() => ({ enter: [...document.querySelectorAll('a.enter')].map((a) => a.getAttribute('aria-label') || a.textContent.trim()), shots: [...document.querySelectorAll('.ax-shot-trigger')].map((b) => b.getAttribute('aria-label') || '') }));
      record('R11-enter-axiom-label-in-name', engineName, names.enter.length === 2 && names.enter.every((n) => /ENTER AXIOM/i.test(n)), names.enter);
      record('R15-shot-label-in-name', engineName, names.shots.length === 8 && names.shots.every((n) => /открыть экран/i.test(n)), names.shots.slice(0, 2));
      // R14 anchor lands right under the sticky header (A-NAV-02)
      await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await p.locator('.menu a[href="#work"]').click(); await p.waitForTimeout(1500);
      const a = await p.evaluate(() => { const hdr = document.querySelector('header.top').getBoundingClientRect().bottom; const t = document.getElementById('work').getBoundingClientRect().top; return { sectionTop: Math.round(t), headerBottom: Math.round(hdr) }; });
      record('R14-anchor-offset', engineName, a.sectionTop >= a.headerBottom - 2 && a.sectionTop - a.headerBottom <= 40, a);
      // R29 one numbering 01–07 (A-GLB-07). W3.A F-02: the floating section label is removed (not merely hidden) at every
      // width; the sticky menu marks the section in view with aria-current — the old class/text check would pass on a hidden node
      await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(300);
      await toEl(p, '#about', 0); await p.waitForTimeout(400);
      const lab = await p.evaluate(() => ({ labelNodes: document.querySelectorAll('#v22-current-section,.v22-current-label').length, current: [...document.querySelectorAll('.menu [aria-current="location"]')].map((a) => a.getAttribute('href')) }));
      await toEl(p, '#vision', 0); await p.waitForTimeout(400);
      const lab2 = await p.evaluate(() => [...document.querySelectorAll('.menu [aria-current="location"]')].map((a) => a.getAttribute('href')));
      const nums = await p.evaluate(() => [...document.querySelectorAll('.show-index > span:first-child')].map((s) => parseInt(s.textContent, 10)));
      record('R29-numbering-and-label', engineName, nums.join() === '1,2,3,4,5,6,7' && lab.labelNodes === 0 && lab.current.join() === '#about' && lab2.join() === '#vision', { nums, labelNodes: lab.labelNodes, ariaCurrentAbout: lab.current, ariaCurrentVision: lab2 });
      await ctx.close();
    }
    // R08 reduced motion stops SVG SMIL animations (A-A11Y-01)
    {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900, reduced: true });
      await p.goto(base, { waitUntil: 'load' }); await p.waitForTimeout(800);
      const s = await p.evaluate(() => [...document.querySelectorAll('svg')].filter((svg) => svg.querySelector('animate, animateTransform')).map((svg) => svg.animationsPaused()));
      record('R08-reduced-motion-smil-paused', engineName, s.length > 0 && s.every(Boolean), { svgsWithSmil: s.length, paused: s.filter(Boolean).length });
      await ctx.close();
    }
    // R12 404 return link is root-absolute (works on nested paths) (A-404-01)
    {
      const { ctx, p } = await page(browser, engineName, { w: 1280, h: 800 });
      await p.goto(base + 'deep/missing/path', { waitUntil: 'load' });
      const is404Page = /404/.test(await p.title());
      if (!is404Page) skip('R12-404-return-link', engineName, 'server does not serve 404.html (run without --url or behind GitHub Pages)');
      else {
        const href = await p.evaluate(() => { const a = [...document.querySelectorAll('a')].find((x) => /landing/i.test(x.textContent)); return a ? a.href : null; });
        record('R12-404-return-link', engineName, href === base, { href, expected: base });
      }
      await ctx.close();
    }
    // R13 no console errors on a first visit (loader shown) (A-LDR-02)
    {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900, seen: false });
      const errors = [];
      p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      p.on('pageerror', (e) => errors.push(e.message));
      await p.goto(base, { waitUntil: 'load' }); await p.waitForTimeout(2500);
      record('R13-no-console-errors', engineName, errors.length === 0, errors.slice(0, 3));
      await ctx.close();
    }
    // R21 loader (Q-08): first visit shows it 1.2–1.6 s, skip is the first tab stop, the 24 h mark is stored, scroll is released
    {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900, seen: false });
      await p.goto(base, { waitUntil: 'domcontentloaded' });
      await p.keyboard.press('Tab');
      const firstStop = await p.evaluate(() => document.activeElement && document.activeElement.id);
      await p.waitForFunction(() => window.__bootRemoved !== undefined, null, { timeout: 5000 }).catch(() => {});
      const t = await p.evaluate(() => ({ added: window.__bootAdded, removed: window.__bootRemoved, last: Number(localStorage.getItem('axiom_loader_last')), lock: document.documentElement.style.overflow + '/' + document.body.style.overflow }));
      const shownMs = Math.round(t.removed - t.added);
      // visible 1.3 s + 0.25 s fade; the node is removed 20 ms after the fade
      record('R21-loader-first-visit', engineName, t.added !== undefined && shownMs >= 1200 && shownMs <= 1650 && firstStop === 'axiom-boot-skip' && Math.abs(Date.now() - t.last) < 60000 && t.lock === '/', { shownMs, firstStop, stored: !!t.last, inlineLock: t.lock });
      await ctx.close();
    }
    // R22 loader at most once per 24 h; shown again after 24 h
    for (const [ageH, expectShown] of [[1, false], [25, true]]) {
      const { ctx, p } = await page(browser, engineName, { w: 1280, h: 800, seen: false, init: `try{localStorage.setItem('axiom_loader_last',String(Date.now()-${ageH}*3600e3))}catch(_){}` });
      await p.goto(base, { waitUntil: 'load' }); await p.waitForTimeout(300);
      const shown = await p.evaluate(() => window.__bootAdded !== undefined);
      record(`R22-loader-24h-${ageH}h`, engineName, shown === expectShown, { lastShownHoursAgo: ageH, shown });
      await ctx.close();
    }
    // R23 storage blocked (setItem throws / storage getter throws) → no loader, page not locked, no errors
    for (const [name, init] of [['setItem-throws', `Storage.prototype.setItem=function(){throw new DOMException('blocked','QuotaExceededError')}`], ['getter-throws', `Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new DOMException('denied','SecurityError')}})`]]) {
      const { ctx, p } = await page(browser, engineName, { w: 1280, h: 800, seen: false, init });
      const errors = []; p.on('pageerror', (e) => errors.push(e.message));
      await p.goto(base, { waitUntil: 'load' }); await p.waitForTimeout(400);
      const s = await p.evaluate(() => ({ shown: window.__bootAdded !== undefined, lock: document.documentElement.style.overflow + '/' + document.body.style.overflow }));
      record(`R23-loader-storage-${name}`, engineName, !s.shown && s.lock === '/' && errors.length === 0, { ...s, errors: errors.slice(0, 2) });
      await ctx.close();
    }
    // R24 Escape skips at once; R25 reduced motion → no loader
    {
      const { ctx, p } = await page(browser, engineName, { w: 1280, h: 800, seen: false });
      await p.goto(base, { waitUntil: 'domcontentloaded' });
      await p.waitForTimeout(150);
      const t0 = await p.evaluate(() => performance.now());
      await p.keyboard.press('Escape');
      await p.waitForFunction(() => window.__bootRemoved !== undefined, null, { timeout: 3000 }).catch(() => {});
      const t = await p.evaluate(() => ({ removed: window.__bootRemoved, lock: document.documentElement.style.overflow + '/' + document.body.style.overflow }));
      record('R24-loader-escape', engineName, t.removed !== undefined && t.removed - t0 <= 450 && t.lock === '/', { skipToGoneMs: t.removed !== undefined ? Math.round(t.removed - t0) : null, inlineLock: t.lock });
      await ctx.close();
    }
    {
      const { ctx, p } = await page(browser, engineName, { w: 1280, h: 800, seen: false, reduced: true });
      await p.goto(base, { waitUntil: 'load' }); await p.waitForTimeout(300);
      const shown = await p.evaluate(() => window.__bootAdded !== undefined);
      record('R25-loader-reduced-motion', engineName, !shown, { shown });
      await ctx.close();
    }
    // R26 without JavaScript: no overlay, every archive screen readable, script-only controls hidden
    {
      const { ctx, p } = await page(browser, engineName, { w: 1280, h: 800, seen: false, js: false });
      await p.goto(base, { waitUntil: 'load' });
      const s = await p.evaluate(() => ({ overlay: !!document.getElementById('axiom-boot'), panelsShown: [...document.querySelectorAll('#showcase-gallery [role="tabpanel"]')].filter((x) => getComputedStyle(x).display !== 'none').length, rail: getComputedStyle(document.querySelector('.ax-archive-rail')).display, h1: document.querySelector('h1.title').getBoundingClientRect().height > 0 }));
      record('R26-no-js-fallback', engineName, !s.overlay && s.panelsShown === 8 && s.rail === 'none' && s.h1, s);
      await ctx.close();
    }
    // R27 CONTACT (Q-07) · R28 navigation reaches CONTACT (Q-09) · R30 old variant URLs open the final design · R33 self-hosted fonts
    {
      const { ctx, p } = await page(browser, engineName, { w: 1280, h: 800 });
      await p.goto(base, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
      const links = await p.evaluate(() => [...document.querySelectorAll('#collaboration .ax-channel')].map((a) => ({ href: a.href, blank: a.target === '_blank', rel: a.rel })));
      record('R27-contact-channels', engineName, links.length === 3 && links[0].href === 'https://t.me/Project_AXIOM' && /github\.com\/Endevor-VIK/.test(links[1].href) && /axiomgates\.com/.test(links[2].href) && links.every((l) => l.blank && /noopener/.test(l.rel)), links);
      const menu = await p.evaluate(() => { const m = document.querySelector('.menu'); const a = m.querySelector('a[href="#collaboration"]'); const st = document.querySelector('.top .status'); const ab = a ? a.getBoundingClientRect() : null; return { contact: !!a, visible: !!ab && ab.width > 0 && ab.right <= innerWidth, clearOfStatus: !!ab && (!st || ab.right <= st.getBoundingClientRect().left) }; });
      record('R28-desktop-menu-contact', engineName, menu.contact && menu.visible && menu.clearOfStatus, menu);
      const fonts = await p.evaluate(() => ({ oswald: document.fonts.check('500 40px Oswald'), mono: document.fonts.check('700 12px "JetBrains Mono"'), golos: document.fonts.check('400 16px "Golos Text"'), title: getComputedStyle(document.querySelector('.show-title')).fontFamily.split(',')[0].replace(/"/g, ''), unboundedFace: [...document.fonts].some((f) => /Unbounded/.test(f.family)) }));
      const google = p.__requests.filter((u) => /fonts\.(googleapis|gstatic)\.com/.test(u)).length;
      record('R33-fonts-self-hosted', engineName, google === 0 && fonts.oswald && fonts.mono && fonts.golos && fonts.title === 'Oswald' && !fonts.unboundedFace, { google, ...fonts });
      await ctx.close();
      // R30 — WORK B + TYPE A are final (Q-02/Q-03): old review URLs must open the same final page, without the switch or errors
      for (const q of ['?work=a&type=b', '?work=b&type=a', '?type=b']) {
        const { ctx: c2, p: p2 } = await page(browser, engineName, { w: 1280, h: 800 });
        const errs = []; p2.on('pageerror', (e) => errs.push(e.message));
        await p2.goto(base + q, { waitUntil: 'load' }); await p2.evaluate(() => document.fonts.ready);
        const v = await p2.evaluate(() => { const art = document.getElementById('work-art'); const arch = document.getElementById('showcase-gallery'); const intro = document.getElementById('work-intro'); return { dataWork: document.documentElement.getAttribute('data-work'), dataType: document.documentElement.getAttribute('data-type'), artInBand: !!art && !!art.closest('#work-art-band'), archiveBeforeIntro: !!(arch.compareDocumentPosition(intro) & Node.DOCUMENT_POSITION_FOLLOWING), title: getComputedStyle(document.querySelector('.show-title')).fontFamily.split(',')[0].replace(/"/g, '') }; });
        const unb = p2.__requests.filter((u) => /unbounded/i.test(u)).length;
        record(`R30-old-variant-url-${q.slice(1).replace(/[^a-z=]+/g, '_')}`, engineName, v.dataWork === null && v.dataType === null && v.artInBand && v.archiveBeforeIntro && v.title === 'Oswald' && unb === 0 && errs.length === 0, { ...v, unboundedRequests: unb, errors: errs.slice(0, 2) });
        await c2.close();
      }
    }
    {
      const { ctx, p } = await page(browser, engineName, { w: 390, h: 844, mobile: true });
      await p.goto(base, { waitUntil: 'load' });
      await toEl(p, '#vision', 0); await p.waitForTimeout(600);
      const s = await p.evaluate(() => { const strip = document.querySelector('.show-mobile-nav'); const a = strip.querySelector('a[href="#vision"]'); const sb = strip.getBoundingClientRect(); const ab = a.getBoundingClientRect(); return { current: a.getAttribute('aria-current'), inView: ab.left >= sb.left - 1 && ab.right <= sb.right + 1, contact: !!strip.querySelector('a[href="#collaboration"]') }; });
      record('R28-mobile-strip-follows', engineName, s.current === 'location' && s.inView && s.contact, s);
      await ctx.close();
    }
    // R31 text on bright red fills is dark (Q-05): computed colours, ≥ 4.5:1
    {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900 });
      await p.goto(base, { waitUntil: 'load' });
      const bad = await p.evaluate(() => {
        const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(',').map(parseFloat); return { r, g, b, a }; };
        const L = ({ r, g, b }) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const out = []; let n = 0;
        for (const el of document.querySelectorAll('a, button, span, div, b, strong, small')) {
          const cs = getComputedStyle(el); const bg = parse(cs.backgroundColor); if (!bg || bg.a < 0.9 || !(bg.r > 200 && bg.g < 80 && bg.b < 90)) continue;
          if (![...el.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim())) continue;
          const fg = parse(cs.color); const cr = (Math.max(L(fg), L(bg)) + 0.05) / (Math.min(L(fg), L(bg)) + 0.05); n++;
          if (cr < 4.5) out.push({ el: el.tagName + '.' + String(el.className).split(' ')[0], text: el.textContent.trim().slice(0, 24), ratio: +cr.toFixed(2) });
        }
        return { checked: n, bad: out };
      });
      record('R31-red-fill-text-contrast', engineName, bad.checked > 0 && bad.bad.length === 0, bad);
      // R32 no pink / magenta / plum in computed colours of the page (Q-04); raster art is measured separately (evidence)
      const pink = await p.evaluate(() => {
        const hsl = (r, g, b) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); const l = (mx + mn) / 2; if (mx === mn) return { h: 0, s: 0, l }; const d = mx - mn; const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return { h: h * 60, s, l }; };
        const isPink = (r, g, b, a) => { if (a < 0.06) return false; const { h, s, l } = hsl(r, g, b); if (l < 0.06 || l > 0.95) return false; if (h >= 270 && h < 340 && s >= 0.2) return true; return (h >= 340 || h < 10) && l >= 0.7 && s >= 0.5; };
        const props = ['color', 'backgroundColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor', 'fill', 'stroke', 'stopColor', 'floodColor', 'boxShadow', 'textShadow', 'backgroundImage'];
        const hits = {};
        for (const el of document.querySelectorAll('body *')) {
          const cs = getComputedStyle(el);
          for (const pr of props) {
            const v = cs[pr]; if (!v || v === 'none') continue;
            for (const m of v.matchAll(/rgba?\(([^)]+)\)/g)) {
              const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
              if (isPink(r, g, b, a)) { const k = `${el.tagName.toLowerCase()}.${String(el.className.baseVal ?? el.className).split(' ')[0]} ${pr} ${m[0]}`; hits[k] = (hits[k] || 0) + 1; }
            }
          }
        }
        return hits;
      });
      record('R32-no-pink-computed', engineName, Object.keys(pink).length === 0, Object.entries(pink).slice(0, 6));
      await ctx.close();
    }
    // R34 sharp images where the source allows it (IMAGE_AUDIT): archive on 390@3, A02 and B04 on 1440@2
    // R43 (E-03): on a phone B04 is a 5:4 crop around the planet and stays sharp (source 1983 px)
    {
      const { ctx, p } = await page(browser, engineName, { w: 390, h: 844, dpr: 3, mobile: true });
      await p.goto(base, { waitUntil: 'load' });
      await toEl(p, '.v22-vision-art img', 120);
      await p.waitForFunction(() => { const i = document.querySelector('.v22-vision-art img'); return i.complete && i.naturalWidth > 0; }, null, { timeout: 15000 }).catch(() => {});
      const b04 = await p.evaluate((sel) => { const i = document.querySelector(sel); const r = i.getBoundingClientRect(); return { ratio: Math.round(r.width / r.height * 100) / 100, pos: getComputedStyle(i).objectPosition }; }, '.v22-vision-art img');
      const sh = await p.evaluate(SHARPNESS, '.v22-vision-art img');
      record('R43-vision-b04-phone-crop', engineName, Math.abs(b04.ratio - 1.25) < 0.02 && sh.ratio >= 0.9, { ...b04, ...sh });
      await ctx.close();
    }
    {
      const { ctx, p } = await page(browser, engineName, { w: 390, h: 844, dpr: 3, mobile: true });
      await p.goto(base, { waitUntil: 'load' });
      await toEl(p, '#ax-panel-01 img', 120);
      await p.waitForFunction(() => { const i = document.querySelector('#ax-panel-01 img'); return i.complete && i.naturalWidth > 0; }, null, { timeout: 15000 }).catch(() => {});
      const s = await p.evaluate(SHARPNESS, '#ax-panel-01 img');
      record('R34-archive-sharp-390@3', engineName, s.ratio >= 0.95, s);
      await ctx.close();
    }
    {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900, dpr: 2 });
      await p.goto(base, { waitUntil: 'load' });
      const out = {};
      for (const [k, sel] of [['A02', '.v22-about-art img'], ['B04', '.v22-vision-art img']]) {
        await toEl(p, sel, 200);
        await p.waitForFunction((s) => { const i = document.querySelector(s); return i.complete && i.naturalWidth > 0; }, sel, { timeout: 15000 }).catch(() => {});
        out[k] = await p.evaluate(SHARPNESS, sel);
      }
      // B04 is source-limited on 1440@2 (1983 px original) — the check requires the largest candidate, the ratio is reported
      record('R34-art-sharp-1440@2', engineName, out.A02.ratio >= 0.95 && /1983w/.test(out.B04.file), out);
      // R43 (E-04): A07 beside the flow note is not upscaled on HiDPI desktop
      await toEl(p, '.v22-engineering-art img', 120);
      await p.waitForFunction(() => { const i = document.querySelector('.v22-engineering-art img'); return i.complete && i.naturalWidth > 0; }, null, { timeout: 15000 }).catch(() => {});
      const a07 = await p.evaluate(SHARPNESS, '.v22-engineering-art img');
      record('R43-system-a07-sharp-1440@2', engineName, a07.ratio >= 0.95, a07);
      await ctx.close();
    }
    // R37 — Q-04 by the rendered image: the AXIOM entity emblem (legacy light dynamics) keeps < 0.5 % pink/plum pixels
    for (const [w, h, dpr] of [[1440, 900, 1], [390, 844, 2]]) {
      const { ctx, p } = await page(browser, engineName, { w, h, dpr, mobile: w < 800, reduced: true });
      await p.goto(base, { waitUntil: 'load' });
      await toEl(p, '.axiom-entity .ax-body svg', 120); await p.waitForTimeout(500);
      const png = await p.locator('.axiom-entity .ax-body svg').first().screenshot();
      const share = await p.evaluate(async (b64) => {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data; let n = 0;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i] / 255, gg = d[i + 1] / 255, bb = d[i + 2] / 255; const mx = Math.max(r, gg, bb), mn = Math.min(r, gg, bb); const l = (mx + mn) / 2;
          if (l < 0.10 || l > 0.95 || mx === mn) continue;
          const dd = mx - mn; const sat = l > 0.5 ? dd / (2 - mx - mn) : dd / (mx + mn);
          let hue = mx === r ? (gg - bb) / dd + (gg < bb ? 6 : 0) : mx === gg ? (bb - r) / dd + 2 : (r - gg) / dd + 4; hue *= 60;
          if ((hue >= 270 && hue < 340 && sat >= 0.2) || ((hue >= 340 || hue < 10) && l >= 0.7 && sat >= 0.5)) n++;
        }
        return +(100 * n / (d.length / 4)).toFixed(3);
      }, png.toString('base64'));
      record(`R37-emblem-no-pink-${w}`, engineName, share < 0.5, { perceptiblePinkPct: share });
      await ctx.close();
    }
    // R35 low window (landscape phone): ENTER AXIOM reachable on the first screen
    {
      const { ctx, p } = await page(browser, engineName, { w: 844, h: 390 });
      await p.goto(base, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
      const e = await p.evaluate(() => { const b = document.querySelector('.hero a.enter').getBoundingClientRect(); return { bottom: Math.round(b.bottom), vh: innerHeight }; });
      record('R35-landscape-cta-first-screen', engineName, e.bottom <= e.vh, e);
      await ctx.close();
    }
    // R36 hero 01/02/03 markers never overlap the title (hidden below 1536 px)
    for (const [w, h] of [[1440, 900], [1600, 900]]) {
      const { ctx, p } = await page(browser, engineName, { w, h });
      await p.goto(base, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
      const k = await p.evaluate(() => { const kr = document.querySelector('.kicker-rows'); const t = document.querySelector('h1.title').getBoundingClientRect(); const shown = getComputedStyle(kr).display !== 'none'; const b = kr.getBoundingClientRect(); return { shown, overlap: shown && !(b.right <= t.left || b.left >= t.right || b.bottom <= t.top || b.top >= t.bottom) }; });
      record(`R36-kicker-no-overlap-${w}`, engineName, !k.overlap && (w < 1536 ? !k.shown : true), k);
      await ctx.close();
    }
    // ===== 0524 W3.A — CREATOR-approved poster frame B (docs/showcase-v031/waves/W3A_CREATOR_APPROVED_SPEC.md) =====
    const settle = (p) => p.evaluate(() => new Promise((res) => { let last = scrollY, same = 0, n = 0, moved = false; const tick = () => { n++; if (Math.abs(scrollY - last) > 0.5) { moved = true; same = 0; } else same++; last = scrollY; if ((moved && same >= 8) || n > 400) res(); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); }));
    const heroGeom = () => {
      const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { t: Math.round(b.top), b: Math.round(b.bottom), l: Math.round(b.left), r: Math.round(b.right) }; };
      const gate = document.querySelector('.hero .ax-gate-note'); let g = null;
      if (gate && !gate.hidden) { const rg = document.createRange(); rg.selectNodeContents(gate); const rs = [...rg.getClientRects()].filter((x) => x.width > 1); if (rs.length) g = Math.round(Math.max(...rs.map((x) => x.bottom))); }
      const lines = (s) => { const e = document.querySelector(s); const rg = document.createRange(); rg.selectNodeContents(e); return new Set([...rg.getClientRects()].filter((x) => x.width > 1).map((x) => Math.round(x.top))).size; };
      return { vh: innerHeight, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, enter: r('.hero .enter-wrap'), gateBottom: g, gateShown: !!g,
        frame: r('.hero-poster > .hero-frame'), quick: r('.show-hero-extra'), byline: r('.show-hero-byline'), bylineLines: lines('.show-hero-byline'), bylineText: document.querySelector('.show-hero-byline').textContent.trim(),
        status: r('.hero .status-card'), radar: r('.hero .radar'), title: r('.hero h1.title'), titleFont: parseFloat(getComputedStyle(document.querySelector('.hero h1.title')).fontSize),
        eyebrowLines: lines('.hero .eyebrow'), quickRows: new Set([...document.querySelectorAll('.show-hero-extra a')].map((a) => Math.round(a.getBoundingClientRect().top))).size };
    };
    // R-W3A-01 ENTER AXIOM and the gate note are whole in the opening scene, no horizontal overflow (F-01D, B-GLB-02)
    for (const [w, h, dpr] of [[960, 540, 2], [1024, 768, 1], [1100, 800, 1], [1280, 800, 1], [1440, 900, 1], [1920, 1080, 1]]) {
      const { ctx, p } = await page(browser, engineName, { w, h, dpr });
      await p.goto(base, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
      const g = await p.evaluate(heroGeom);
      record(`R-W3A-01-cta-gate-first-screen-${w}x${h}`, engineName, g.enter.b <= g.vh && (!g.gateShown || g.gateBottom <= g.vh) && !g.overflow, { enter: g.enter, gateBottom: g.gateBottom, vh: g.vh, overflow: g.overflow });
      // R-W3A-02 desktop poster: the frame closes inside the first screen, the rail and SIGNAL TRACE sit inside it, the headline keeps its scale
      if (w >= 1024) {
        const inFrame = (x) => x && x.t >= g.frame.t && x.b <= g.frame.b && x.l >= g.frame.l && x.r <= g.frame.r;
        const scaleOk = h > 820 ? g.titleFont >= Math.min(0.08 * w, 116) - 1 : g.titleFont >= 76;
        record(`R-W3A-02-poster-frame-${w}x${h}`, engineName, !!g.frame && g.frame.b <= g.vh && inFrame(g.quick) && inFrame(g.status) && inFrame(g.byline) && inFrame(g.radar) && g.frame.l === 36 && scaleOk, { frame: g.frame, vh: g.vh, quick: g.quick, status: g.status, titleFont: g.titleFont });
      }
      if (w === 1440) {
        // R-W3A-03 (F-03) two-line CREATOR byline beside the quick links on large screens, wording unchanged
        record('R-W3A-03-byline-beside-quick-1440', engineName, g.bylineLines === 2 && g.byline.l > g.quick.r && Math.abs(g.byline.b - g.quick.b) <= 6 && g.bylineText === 'CREATOR / ENDEAVOR · DESIGN / CODE / CANON', { byline: g.byline, quick: g.quick, lines: g.bylineLines });
      }
      await ctx.close();
    }
    // R-W3A-04 (F-01M) phones: the existing radar SVG is the stage behind the headline — one SVG, no overflow, no blocked targets,
    // eyebrow on one line, quick links in one row, byline in two lines
    for (const [w, h] of [[360, 800], [390, 844], [430, 932]]) {
      const { ctx, p } = await page(browser, engineName, { w, h, dpr: 2, mobile: true });
      await p.goto(base, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
      const g = await p.evaluate(heroGeom);
      const s = await p.evaluate(() => {
        const radar = document.querySelector('.hero .radar'); const cs = getComputedStyle(radar); const t = document.querySelector('.hero h1.title').getBoundingClientRect();
        const hit = (x, y) => document.elementFromPoint(x, y);
        const e = document.querySelector('.hero a.enter').getBoundingClientRect(); const eh = hit(e.left + e.width / 2, e.top + e.height / 2);
        const th = hit(t.right - 40, t.top + 30);
        return { svgs: document.querySelectorAll('.hero .radar svg').length, position: cs.position, pe: cs.pointerEvents, enterHit: !!(eh && eh.closest('a.enter')), titleOnTop: !!(th && th.closest('h1.title')) };
      });
      const behind = g.radar.t < g.title.b && g.radar.b > g.title.t && g.radar.r > g.title.l;
      record(`R-W3A-04-mobile-radar-scene-${w}`, engineName, s.svgs === 1 && s.position === 'absolute' && s.pe === 'none' && behind && s.enterHit && s.titleOnTop && !g.overflow && g.eyebrowLines === 1 && g.quickRows === 1 && g.bylineLines === 2 && g.enter.b <= g.vh,
        { ...s, behind, overflow: g.overflow, eyebrowLines: g.eyebrowLines, quickRows: g.quickRows, bylineLines: g.bylineLines, enter: g.enter });
      await ctx.close();
    }
    // R-W3A-05 (F-06) the bridge question above a section is fully visible after menu click, swipe-nav tap, keyboard and direct hash
    for (const [w, h, mobile] of [[1440, 900, false], [390, 844, true]]) {
      const { ctx, p } = await page(browser, engineName, { w, h, mobile });
      await p.goto(base, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
      const out = [];
      for (const [id, how] of [['#system', 'click'], ['#vision', 'keyboard'], ['#collaboration', 'click']]) {
        await p.evaluate(() => { document.activeElement && document.activeElement.blur && document.activeElement.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); }); await p.waitForTimeout(200);
        const link = p.locator(w > 1080 ? `.menu a[href="${id}"]` : `.show-mobile-nav a[href="${id}"]`);
        if (how === 'keyboard') { await link.focus(); await p.keyboard.press('Enter'); } else await link.click();
        await settle(p); await p.waitForTimeout(150);
        out.push(await p.evaluate((i) => { const s = document.querySelector(i); const b = s.previousElementSibling.getBoundingClientRect(); const chrome = [...document.querySelectorAll('header.top,.show-mobile-nav')].filter((e) => getComputedStyle(e).position === 'sticky' && e.getBoundingClientRect().top <= 1).reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0);
          return { id: i, chrome: Math.round(chrome), bridgeTop: Math.round(b.top), bridgeBottom: Math.round(b.bottom), sectionTop: Math.round(s.getBoundingClientRect().top), current: [...document.querySelectorAll('[aria-current="location"]')].map((a) => a.getAttribute('href')) }; }, id));
      }
      await ctx.close();
      const { ctx: c2, p: p2 } = await page(browser, engineName, { w, h, mobile });
      await p2.goto(base + '#creator', { waitUntil: 'load' }); await p2.evaluate(() => document.fonts.ready); await settle(p2).catch(() => {}); await p2.waitForTimeout(600);
      out.push(await p2.evaluate(() => { const s = document.getElementById('creator'); const b = s.previousElementSibling.getBoundingClientRect(); const chrome = [...document.querySelectorAll('header.top,.show-mobile-nav')].filter((e) => getComputedStyle(e).position === 'sticky' && e.getBoundingClientRect().top <= 1).reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0);
        return { id: '#creator(direct)', chrome: Math.round(chrome), bridgeTop: Math.round(b.top), bridgeBottom: Math.round(b.bottom), sectionTop: Math.round(s.getBoundingClientRect().top), current: [...document.querySelectorAll('[aria-current="location"]')].map((a) => a.getAttribute('href')) }; }));
      await c2.close();
      const ok = out.every((o) => o.bridgeTop >= o.chrome - 1 && o.bridgeBottom <= o.sectionTop + 1 && o.bridgeTop - o.chrome <= 16 && o.current.length > 0 && o.current.every((c) => c === o.id.replace('(direct)', '')));
      record(`R-W3A-05-bridge-visible-${w}`, engineName, ok, out);
    }
    // R-W3A-06 (F-05) meaningful text in the W3.A zone is >= 12 px (exceptions: the decorative header version string, art captions)
    for (const [w, h, mobile] of [[390, 844, true], [1024, 768, false], [1440, 900, false]]) {
      const { ctx, p } = await page(browser, engineName, { w, h, mobile });
      await p.goto(base, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
      const small = await p.evaluate(() => { const out = [];
        for (const z of document.querySelectorAll('header.top,.show-mobile-nav,#top,#about,#creator')) { const wk = document.createTreeWalker(z, NodeFilter.SHOW_TEXT);
          for (let n; (n = wk.nextNode());) { if (!n.data.trim()) continue; const el = n.parentElement; const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden' || !el.getClientRects().length || el.closest('[aria-hidden="true"],svg,.brand small,figcaption')) continue;
            if (parseFloat(cs.fontSize) < 12) out.push(`${cs.fontSize} ${n.data.trim().slice(0, 24)}`); } }
        return out; });
      record(`R-W3A-06-type-floor-${w}`, engineName, small.length === 0, small.slice(0, 6));
      await ctx.close();
    }
    // R-W3A-07 (N-2) the ticker's loop clone is hidden from assistive tech; the original eight items are not
    {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900 });
      await p.goto(base, { waitUntil: 'load' });
      const tk = await p.evaluate(() => { const items = [...document.querySelectorAll('.ticker .stream-inner > span')]; return { total: items.length, hidden: items.filter((s) => s.getAttribute('aria-hidden') === 'true').length, firstHalfHidden: items.slice(0, items.length / 2).some((s) => s.getAttribute('aria-hidden') === 'true') }; });
      record('R-W3A-07-ticker-clone-hidden', engineName, tk.total === 16 && tk.hidden === 8 && !tk.firstHalfHidden, tk);
      await ctx.close();
    }
    // R-W3A-08 (F-01M) weak device / Save-Data and reduced motion: the radar stage runs no infinite loop (it is CSS-animated, no SMIL)
    for (const [name, opts] of [['default', {}], ['lite', { init: () => { Object.defineProperty(navigator, 'deviceMemory', { get: () => 2 }); } }], ['reduced', { reduced: true }]]) {
      const { ctx, p } = await page(browser, engineName, { w: 390, h: 844, mobile: true, ...opts });
      await p.goto(base, { waitUntil: 'load' }); await p.waitForTimeout(600);
      // phones hold the loops while the page loads; by default they start after load + 2.5 s (.ax-radar-live)
      const heldAtLoad = await p.evaluate(() => [...document.querySelectorAll('.hero .radar *')].flatMap((e) => e.getAnimations()).filter((a) => a.playState === 'running').length);
      if (name === 'default') await p.waitForFunction(() => document.documentElement.classList.contains('ax-radar-live'), null, { timeout: 8000 }).catch(() => {});
      await p.waitForTimeout(300);
      const st = await p.evaluate(() => { const svg = document.querySelector('.hero .radar svg'); const running = [...document.querySelectorAll('.hero .radar, .hero .radar *')].flatMap((e) => e.getAnimations()).filter((a) => a.playState === 'running' && a.effect && a.effect.getComputedTiming().iterations === Infinity).length;
        return { lite: document.documentElement.classList.contains('ax-lite'), smil: svg.querySelectorAll('animate,animateTransform,animateMotion').length, runningInfiniteCss: running }; });
      // control: by default the radar does loop (so the two still cases are not vacuous)
      const ok = name === 'default' ? heldAtLoad === 0 && st.runningInfiniteCss > 0 && !st.lite : st.smil === 0 && st.runningInfiniteCss === 0 && (name !== 'lite' || st.lite);
      record(`R-W3A-08-radar-${name === 'default' ? 'held-then-loops' : 'still-' + name}`, engineName, ok, { heldAtLoad, ...st });
      await ctx.close();
    }
    // ===== 0524 W3.C — CREATOR-approved Variant A + OMEGA-0 (docs/showcase-v031/waves/W3C_IMPLEMENTATION_SPEC.md) =====
    const chromeBottom = () => [...document.querySelectorAll('header.top,.show-mobile-nav')].filter((e) => getComputedStyle(e).position === 'sticky' && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().top <= 1).reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0);
    const imgReady = (p, sel) => p.waitForFunction((s) => { const i = document.querySelector(s); return i && i.complete && i.naturalWidth > 0 && !!i.currentSrc; }, sel, { timeout: 15000 }).catch(() => {});
    // R-W3C-01 structure: section order and anchors kept; the five acts are where the spec puts them
    {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900 });
      await p.goto(base, { waitUntil: 'load' });
      const st = await p.evaluate(() => {
        const order = [...document.querySelectorAll('section[id], .axiom-entity')].map((e) => e.id || 'axiom-entity');
        const wg = document.getElementById('world-guide'); const world = document.getElementById('world'); const omega = document.querySelector('.ax-omega');
        const epi = document.querySelector('.ax-epilogue'); const vision = document.getElementById('vision');
        const after = (a, b) => !!(a && b && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING));
        return {
          order: order.join(' '),
          threshold: !!wg.querySelector('.ax-world-scene img[src*="W01_threshold_bridge"]') && wg.querySelector('h2#v22-world-title') !== null && !!document.getElementById('world-entry'),
          trail: [...wg.querySelectorAll('.ax-world-trail a')].map((a) => a.getAttribute('href')).join(' '),
          // W4 Gate A: the reading key explains world terms; engineering prose remains in SYSTEM.
          key: !!wg.querySelector('details.ax-world-key .v22-lore-glossary') && !/MASTER GRAPH/.test(wg.querySelector('.ax-world-key-body').textContent) && !document.querySelector('#system .show-lore-link'),
          // W4.R A+AD (Gate R-A, art freeze 9cf78b0): WHAT REMAINS carries W02 as its large memory scene instead of a chapter
          // plate, and CHARACTERS opens with the approved bilingual introduction instead of the chapter line (R2.3).
          plates: ['manifesto', 'world', 'factions'].map((id) => !!document.querySelector(`#${id} > .wrap > .ax-chapter-plate:first-child`)).every(Boolean)
            && !!(document.querySelector('#modules > .wrap > .ax-chapter-plate:first-child') || document.querySelector('#modules.r1p-remains .r1p-memory figure img[src*="W02_"], #modules.r1p-remains .r1p-memory figure source[srcset*="W02_"]'))
            && !!(document.querySelector('#chars > .wrap > .ax-chapter-line:first-child') || document.querySelector('#chars .r1p-character-intro h2')),
          omegaInWorld: !!omega && world.contains(omega) && after(document.querySelector('.v23-map-axes'), omega) && after(omega, document.getElementById('chars')),
          epilogue: !!epi && epi.nextElementSibling && epi.nextElementSibling.matches('.v22-bridge') && epi.nextElementSibling.nextElementSibling === vision,
          canonIds: [...document.querySelectorAll('.v23-map-node')].map((b) => b.dataset.canonId).join(),
        };
      });
      const ok = st.order === 'top about creator work system world-guide manifesto modules world chars axiom-entity factions vision collaboration' && st.threshold && st.trail === '#manifesto #modules #world #chars #factions' && st.key && st.plates && st.omegaInWorld && st.epilogue && st.canonIds === '02.01,02.02,02.03,02.04,02.05,02.06';
      record('R-W3C-01-structure-and-anchors', engineName, ok, st);
      await ctx.close();
    }
    // R-W3C-02 no world-library image is requested while the page opens (everything below the first screen is lazy)
    for (const [w, h, dpr, mobile] of [[1440, 900, 1, false], [390, 844, 2, true]]) {
      const { ctx, p } = await page(browser, engineName, { w, h, dpr, mobile });
      await p.goto(base, { waitUntil: 'load' }); await p.waitForTimeout(2500);
      const lib = p.__requests.filter((u) => /world-library/.test(u)).map((u) => u.split('/').pop());
      record(`R-W3C-02-library-lazy-at-open-${w}`, engineName, lib.length === 0, { requested: lib });
      await ctx.close();
    }
    // R-W3C-03 menu / swipe-nav jump to WORLD: the title, the mode-change line and «ВОЙТИ В МИР» are whole on screen; W01 is sharp where the source allows
    for (const [w, h, dpr, mobile] of [[960, 540, 2, false], [1280, 800, 1, false], [1440, 900, 1, false], [1920, 1080, 1, false], [768, 1024, 2, true], [390, 844, 2, true], [390, 844, 3, true], [430, 932, 2, true]]) {
      const { ctx, p } = await page(browser, engineName, { w, h, dpr, mobile });
      await p.goto(base, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
      await p.locator(w > 1080 ? '.menu a[href="#world-guide"]' : '.show-mobile-nav a[href="#world-guide"]').click(); await settle(p); await p.waitForTimeout(200);
      await imgReady(p, '.ax-world-art img');
      const g = await p.evaluate((cb) => { const top = eval(cb)(); const box = (s) => { const b = document.querySelector(s).getBoundingClientRect(); return { t: Math.round(b.top), b: Math.round(b.bottom) }; };
        const r = { chrome: Math.round(top), vh: innerHeight, title: box('#v22-world-title'), promise: box('.ax-world-promise'), cta: box('.ax-world-cta'), overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth };
        r.whole = ['title', 'promise', 'cta'].every((k) => r[k].t >= r.chrome - 1 && r[k].b <= r.vh + 1); return r; }, chromeBottom.toString());
      const sh = await p.evaluate(SHARPNESS, '.ax-world-art img');
      // W01 is 1672 px: a scene wider than 836 css px on a DPR ≥ 2 screen is source-limited (asset-quality exception in the W3.C report) —
      // there the largest candidate must be served, as R34 does for B04; everywhere else the image must be ≥ 1:1
      const sourceLimited = dpr >= 2 && w > 900 && sh.needPx > 1672;
      record(`R-W3C-03-threshold-after-jump-${w}@${dpr}`, engineName, g.whole && !g.overflow && (sh.ratio >= 0.95 || (sourceLimited && sh.filePx === 1672)), { ...g, sharp: sh, sourceLimited });
      await ctx.close();
    }
    // R-W3C-04 «УЗНАТЬ О МЕСТЕ НА КАРТЕ» returns to the real 02.05 card (pointer and keyboard): selected, described, focused; no JS → the map panel
    for (const how of ['click', 'keyboard']) {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900 });
      await p.goto(base, { waitUntil: 'load' });
      await toEl(p, '.ax-omega', 200); await p.waitForTimeout(300);
      if (how === 'keyboard') { await p.locator('.ax-omega-cta').focus(); await p.keyboard.press('Enter'); } else await p.locator('.ax-omega-cta').click();
      await settle(p); await p.waitForTimeout(200);
      const st = await p.evaluate((cb) => { const n = document.querySelector('.v23-map-node[data-canon-id="02.05"]'); const b = n.getBoundingClientRect(); return { id: document.getElementById('v23-map-id').textContent, pressed: n.getAttribute('aria-pressed'), focused: document.activeElement === n, inView: b.top >= eval(cb)() - 1 && b.bottom <= innerHeight, hash: location.hash }; }, chromeBottom.toString());
      record(`R-W3C-04-omega-return-to-02.05-${how}`, engineName, st.id === '02.05 / LABORATORY OMEGA-0' && st.pressed === 'true' && st.focused && st.inView, st);
      await ctx.close();
    }
    {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900, js: false });
      await p.goto(base, { waitUntil: 'load' });
      const href = await p.evaluate(() => { const a = document.querySelector('.ax-omega-cta'); return { href: a.getAttribute('href'), target: !!document.getElementById(a.getAttribute('href').slice(1)) }; });
      record('R-W3C-04-omega-return-no-js', engineName, href.href === '#v23-map-detail' && href.target, href);
      await ctx.close();
    }
    // R-W3C-05 the descent is an enhancement: with motion it opens once in view; with reduced motion, on a weak device and without JS the scene is simply visible
    for (const [name, opts] of [['motion', {}], ['reduced', { reduced: true }], ['lite', { init: () => { Object.defineProperty(navigator, 'deviceMemory', { get: () => 2 }); } }], ['no-js', { js: false }]]) {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900, ...opts });
      await p.goto(base, { waitUntil: 'load' }); await p.waitForTimeout(300);
      const armedAtLoad = await p.evaluate(() => document.querySelector('.ax-omega').classList.contains('ax-omega--armed'));
      await toEl(p, '.ax-omega', 120); await p.waitForTimeout(2400);
      const st = await p.evaluate(() => { const sc = document.querySelector('.ax-omega'); const img = sc.querySelector('.ax-omega-stage img'); const cs = getComputedStyle(img); return { armed: sc.classList.contains('ax-omega--armed'), open: sc.classList.contains('is-open'), clip: cs.clipPath, visible: img.getBoundingClientRect().height > 100 && cs.visibility !== 'hidden' && +cs.opacity > 0.9 }; });
      const ok = name === 'motion' ? armedAtLoad && st.open && /inset\(0(px)?( 0(px)?){0,3}\)|none/.test(st.clip) && st.visible : !st.armed && (st.clip === 'none' || st.clip === '') && st.visible;
      record(`R-W3C-05-omega-descent-${name}`, engineName, ok, { armedAtLoad, ...st });
      await ctx.close();
    }
    // R-W3C-06 W03 is never upscaled: ≥ 1:1 on DPR 2 desktops and on phones (inset ≤ 820 css px; 5:4 on phones)
    for (const [w, h, dpr, mobile] of [[1440, 900, 2, false], [1920, 1080, 2, false], [1024, 768, 2, false], [390, 844, 3, true], [430, 932, 3, true]]) {
      const { ctx, p } = await page(browser, engineName, { w, h, dpr, mobile });
      await p.goto(base, { waitUntil: 'load' });
      await toEl(p, '.ax-omega-stage', 120); await imgReady(p, '.ax-omega-stage img'); await p.waitForTimeout(300);
      const sh = await p.evaluate(SHARPNESS, '.ax-omega-stage img');
      const box = await p.evaluate(() => { const b = document.querySelector('.ax-omega-stage').getBoundingClientRect(); return { w: Math.round(b.width), ratio: +(b.width / b.height).toFixed(2) }; });
      record(`R-W3C-06-w03-sharp-${w}@${dpr}`, engineName, sh.ratio >= 0.95 && box.w <= 821 && (!mobile || Math.abs(box.ratio - 1.25) < 0.02), { ...sh, box });
      await ctx.close();
    }
    // R-W3C-07 «ВОЙТИ В МИР» lands on the statement under the sticky chrome; «КАК МИР БУДЕТ РАЗВИВАТЬСЯ» lands on the VISION bridge (F-06)
    for (const [w, h, mobile] of [[1440, 900, false], [390, 844, true]]) {
      const { ctx, p } = await page(browser, engineName, { w, h, mobile });
      await p.goto(base, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
      await toEl(p, '.ax-world-cta', 300); await p.waitForTimeout(300);
      await p.locator('.ax-world-cta').click(); await settle(p); await p.waitForTimeout(150);
      const a = await p.evaluate((cb) => { const t = document.getElementById('world-entry').getBoundingClientRect(); return { top: Math.round(t.top), chrome: Math.round(eval(cb)()) }; }, chromeBottom.toString());
      await toEl(p, '.ax-epilogue-cta', 400); await p.waitForTimeout(300);
      await p.locator('.ax-epilogue-cta').click(); await settle(p); await p.waitForTimeout(150);
      const v = await p.evaluate((cb) => { const b = document.getElementById('vision').previousElementSibling.getBoundingClientRect(); return { bridgeTop: Math.round(b.top), bridgeBottom: Math.round(b.bottom), chrome: Math.round(eval(cb)()), current: [...document.querySelectorAll('[aria-current="location"]')].map((x) => x.getAttribute('href')) }; }, chromeBottom.toString());
      record(`R-W3C-07-world-ctas-land-${w}`, engineName, a.top >= a.chrome - 2 && a.top - a.chrome <= 40 && v.bridgeTop >= v.chrome - 1 && v.bridgeTop - v.chrome <= 16 && v.current.every((c) => c === '#vision') && v.current.length > 0, { entry: a, vision: v });
      await ctx.close();
    }
    // R-W3C-08 words in the new WORLD scenes are ≥ 12 px (decor: aria-hidden approach rail and bridge)
    for (const [w, h, mobile] of [[390, 844, true], [1440, 900, false]]) {
      const { ctx, p } = await page(browser, engineName, { w, h, mobile });
      await p.goto(base, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
      const small = await p.evaluate(() => { const out = [];
        for (const z of document.querySelectorAll('.ax-world-scene,.ax-world-establish,.ax-world-trail-head,.ax-world-trail,.ax-world-key>summary,.ax-chapter-plate,.ax-chapter-line,.ax-omega,.ax-epilogue')) { const wk = document.createTreeWalker(z, NodeFilter.SHOW_TEXT);
          for (let n; (n = wk.nextNode());) { if (!n.data.trim()) continue; const el = n.parentElement; const cs = getComputedStyle(el);
            if (cs.display === 'none' || !el.getClientRects().length || el.closest('[aria-hidden="true"]')) continue;
            if (parseFloat(cs.fontSize) < 12) out.push(`${cs.fontSize} ${n.data.trim().slice(0, 24)}`); } }
        return out; });
      record(`R-W3C-08-type-floor-${w}`, engineName, small.length === 0, small.slice(0, 6));
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
}

(async () => {
  let server = null; let base = argVal('--url');
  if (!base) { server = await serveRepo(); base = server.url; }
  await run('chromium', base);
  if (args.includes('--firefox')) await run('firefox', base);
  if (server) server.srv.close();
  const failed = results.filter((r) => !r.ok);
  const skipped = results.filter((r) => r.skipped).length;
  const out = argVal('--json');
  if (out) fs.writeFileSync(out, JSON.stringify({ base, generatedAt: new Date().toISOString(), passed: results.length - failed.length - skipped, failed: failed.length, skipped, results }, null, 1));
  process.stdout.write(`\n${results.length - failed.length - skipped} passed, ${failed.length} failed, ${skipped} skipped\n`);
  process.exit(Math.min(failed.length, 100));
})().catch((e) => { console.error(e); process.exit(101); });
