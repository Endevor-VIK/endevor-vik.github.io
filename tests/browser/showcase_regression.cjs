#!/usr/bin/env node
/*
 * AXIOM SHOWCASE — browser regression checks (task 0524, V0.3.1).
 *
 * Real-browser assertions for defects found in the W0 audit (docs/showcase-v031/AUDIT_REPORT.md).
 * Every check is tied to a finding ID. Exit code = number of failed checks.
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
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json', '.woff2': 'font/woff2' };

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
  process.stdout.write(`SKIP  ${id.padEnd(30)} [${engine}] ${why}\n`);
}
function record(id, engine, ok, detail) {
  results.push({ id, engine, ok, detail });
  process.stdout.write(`${ok ? 'PASS' : 'FAIL'}  ${id.padEnd(30)} [${engine}] ${typeof detail === 'string' ? detail : JSON.stringify(detail)}\n`);
}

async function page(browser, engine, { w, h, dpr = 1, mobile = false, seen = true, reduced = false } = {}) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h }, deviceScaleFactor: dpr, hasTouch: mobile, locale: 'ru-RU', colorScheme: 'dark',
    reducedMotion: reduced ? 'reduce' : 'no-preference', ...(engine === 'chromium' ? { isMobile: mobile } : {}),
  });
  if (seen) await ctx.addInitScript(() => { try { sessionStorage.setItem('axiom_loader_seen', '1'); } catch (_) {} });
  const p = await ctx.newPage();
  p.__requests = [];
  p.on('request', (r) => p.__requests.push(r.url()));
  return { ctx, p };
}
const toEl = (p, sel, offset = 140) => p.evaluate(([s, o]) => { const el = document.querySelector(s); window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - o, behavior: 'instant' }); }, [sel, offset]);

async function run(engineName, base) {
  const engine = engineName === 'firefox' ? firefox : chromium;
  const browser = await engine.launch();
  try {
    // R01 horizontal overflow
    for (const [w, h] of [[360, 800], [390, 844], [430, 932], [768, 1024], [1024, 768], [1280, 800], [1440, 900], [1920, 1080]]) {
      const { ctx, p } = await page(browser, engineName, { w, h, mobile: w < 800 });
      await p.goto(base, { waitUntil: 'load' });
      const m = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      record(`R01-no-h-overflow-${w}`, engineName, m.sw <= m.cw + 1, m);
      await ctx.close();
    }
    // R02 / R03 WORK feature + gallery layout on phones (A-WORK-01, A-WORK-02)
    for (const [w, h] of [[360, 800], [390, 844], [430, 932]]) {
      const { ctx, p } = await page(browser, engineName, { w, h, mobile: true });
      await p.goto(base, { waitUntil: 'load' });
      await p.evaluate(() => document.fonts.ready);
      await toEl(p, '.v22-public-feature h3', 200);
      await p.waitForTimeout(500);
      const f = await p.evaluate(() => {
        const feat = document.querySelector('.v22-public-feature');
        const h3 = feat.querySelector('.show-feature-body h3');
        const art = feat.querySelector('.v22-feature-art');
        const hb = h3.getBoundingClientRect();
        const hit = document.elementFromPoint(hb.left + Math.min(20, hb.width / 2), hb.top + hb.height / 2);
        const fb = feat.getBoundingClientRect(); const ab = art.getBoundingClientRect();
        return { cols: getComputedStyle(feat).gridTemplateColumns.split(' ').length, headingVisible: !!hit && h3.contains(hit), artInside: ab.left >= fb.left - 1 && ab.right <= fb.right + 1, artW: Math.round(ab.width), featW: Math.round(fb.width) };
      });
      record(`R02-work-feature-${w}`, engineName, f.cols === 1 && f.headingVisible && f.artInside, f);
      const g = await p.evaluate(() => ({ cols: getComputedStyle(document.querySelector('.show-screen-grid')).gridTemplateColumns.split(' ').length }));
      record(`R03-gallery-1col-${w}`, engineName, g.cols === 1, g);
      await ctx.close();
    }
    // R04 stage keeps a sharp candidate after selection; R05 focus/scroll return from stage lightbox (A-WORK-03, A-WORK-04)
    {
      const { ctx, p } = await page(browser, engineName, { w: 1440, h: 900, dpr: 2 });
      await p.goto(base, { waitUntil: 'load' });
      await toEl(p, '.v23-work-stage', 100); await p.waitForTimeout(1200);
      await p.locator('.v23-stage-select').nth(2).click();
      await p.waitForFunction(() => { const i = document.querySelector('.v23-stage-visual img'); return i.complete && i.naturalWidth > 0; }, null, { timeout: 15000 }).catch(() => {});
      await p.waitForTimeout(400);
      const s = await p.evaluate(async () => {
        const i = document.querySelector('.v23-stage-visual img');
        const probe = new Image(); probe.src = i.currentSrc; await probe.decode().catch(() => {});
        const b = i.getBoundingClientRect();
        const widths = (i.getAttribute('srcset') || '').split(',').map((c) => parseInt(c.trim().split(/\s+/)[1], 10)).filter(Boolean);
        return { currentSrc: i.currentSrc.split('/').pop(), srcset: widths, filePx: probe.naturalWidth, needPx: Math.round(b.width * devicePixelRatio), ratio: +(probe.naturalWidth / (b.width * devicePixelRatio)).toFixed(2) };
      });
      // pass = the sharpest available source is used (a source-limited upscale is reported via ratio, see IMAGE_AUDIT)
      record('R04-stage-sharp-after-select', engineName, s.srcset.length > 1 && (s.filePx >= s.needPx * 0.95 || s.filePx >= Math.max(...s.srcset)), s);
      const y0 = await p.evaluate(() => Math.round(scrollY));
      await p.locator('.v23-stage-open').click(); await p.waitForTimeout(600);
      await p.keyboard.press('Escape'); await p.waitForTimeout(700);
      const r = await p.evaluate(() => ({ active: document.activeElement.className, y: Math.round(scrollY) }));
      record('R05-stage-lightbox-focus-return', engineName, /v23-stage-open/.test(r.active) && Math.abs(r.y - y0) <= 8, { ...r, y0 });
      // R07 pointer visible inside modal (A-INT-01)
      await p.locator('.v23-stage-open').click(); await p.waitForTimeout(500);
      await p.mouse.move(720, 450); await p.waitForTimeout(200);
      const c = await p.evaluate(() => { const el = document.elementFromPoint(720, 450); const cur = document.getElementById('indexCursor'); return { cssCursor: el ? getComputedStyle(el).cursor : null, customCursorShown: !!cur && getComputedStyle(cur).display !== 'none' && getComputedStyle(cur).opacity !== '0' && getComputedStyle(cur).visibility !== 'hidden' }; });
      record('R07-pointer-visible-in-modal', engineName, c.cssCursor !== 'none' && !c.customCursorShown, c);
      await p.keyboard.press('Escape');
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
      const dl = await p.evaluate(() => [...document.querySelectorAll('.v22-phase-meta > div')].map((d) => { const dt = d.querySelector('dt').getBoundingClientRect(); const dd = d.querySelector('dd').getBoundingClientRect(); const r = document.createRange(); r.selectNodeContents(d.querySelector('dt')); const tw = r.getBoundingClientRect(); return { label: d.querySelector('dt').textContent, gap: Math.round(dd.left - tw.right) }; }));
      record('R10-vision-meta-no-collision', engineName, dl.every((x) => x.gap >= 6), dl.filter((x) => x.gap < 6));
      // R11 / R15 accessible names contain visible labels (WCAG 2.5.3) (A-A11Y-02)
      const names = await p.evaluate(() => ({ enter: [...document.querySelectorAll('a.enter')].map((a) => a.getAttribute('aria-label') || a.textContent.trim()), shots: [...document.querySelectorAll('.show-shot-trigger')].map((b) => b.getAttribute('aria-label') || '') }));
      record('R11-enter-axiom-label-in-name', engineName, names.enter.every((n) => /ENTER AXIOM/i.test(n)), names.enter);
      record('R15-shot-label-in-name', engineName, names.shots.every((n) => /открыть экран/i.test(n)), names.shots.slice(0, 2));
      // R14 anchor lands right under the sticky header (A-NAV-02)
      await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await p.locator('.menu a[href="#work"]').click(); await p.waitForTimeout(1500);
      const a = await p.evaluate(() => { const hdr = document.querySelector('header.top').getBoundingClientRect().bottom; const t = document.getElementById('work').getBoundingClientRect().top; return { sectionTop: Math.round(t), headerBottom: Math.round(hdr) }; });
      record('R14-anchor-offset', engineName, a.sectionTop >= a.headerBottom - 2 && a.sectionTop - a.headerBottom <= 40, a);
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
      await p.goto(base, { waitUntil: 'load' }); await p.waitForTimeout(4500);
      record('R13-no-console-errors', engineName, errors.length === 0, errors.slice(0, 3));
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
