// W3.A A/B prototype harness: first-fold geometry, floating-label collisions per section landing,
// first-fold screenshots. Read-only against an immutable snapshot; variants are injected CSS (no repo writes).
// usage: node measure.cjs <baseUrl> <variantName> <outDir> [overrideCss] [viewports]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [base, variant, outDir, cssFile, vpArg] = process.argv.slice(2);
const css = cssFile && cssFile !== '-' ? fs.readFileSync(cssFile, 'utf8') : '';
const ALL = '360x800@2,390x844@3,430x932@3,768x1024@2,844x390@3,960x540@2,1024x768@1,1100x800@1,1280x800@1,1440x900@1,1920x1080@1';
const vps = (vpArg || ALL).split(',').map(s => { const [wh, d] = s.split('@'); const [w, h] = wh.split('x').map(Number); return { w, h, dpr: +d, name: s }; });
const SECTIONS = ['#top', '#about', '#creator', '#work-art-band', '#work', '#system', '#world-guide', '#manifesto', '#modules', '#world', '#chars', '.axiom-entity', '#factions', '#vision', '#collaboration', 'section.cta', 'body > footer'];
fs.mkdirSync(outDir, { recursive: true });

const geom = () => {
  const r = el => { if (!el) return null; const b = el.getBoundingClientRect(); return { t: Math.round(b.top), b: Math.round(b.bottom), l: Math.round(b.left), r: Math.round(b.right), h: Math.round(b.height), w: Math.round(b.width) }; };
  const gate = document.querySelector('.hero .ax-gate-note');
  let gateR = null;
  if (gate && !gate.hidden) { const rg = document.createRange(); rg.selectNodeContents(gate); const rs = [...rg.getClientRects()]; if (rs.length) gateR = { t: Math.round(Math.min(...rs.map(x => x.top))), b: Math.round(Math.max(...rs.map(x => x.bottom))) }; }
  const eb = document.querySelector('.hero .eyebrow');
  const ebLines = eb ? Math.round(eb.getBoundingClientRect().height / parseFloat(getComputedStyle(eb).lineHeight || 16)) : null;
  const qn = document.querySelector('.show-hero-extra');
  const qnRows = qn ? new Set([...qn.children].map(a => Math.round(a.getBoundingClientRect().top))).size : null;
  return {
    vh: innerHeight, vw: innerWidth,
    docScreens: +(document.documentElement.scrollHeight / innerHeight).toFixed(1),
    header: r(document.querySelector('header.top')), mnav: r(document.querySelector('.show-mobile-nav')),
    eyebrow: r(eb), eyebrowLines: ebLines, title: r(document.querySelector('.hero h1.title')),
    titleFont: getComputedStyle(document.querySelector('.hero h1.title')).fontSize,
    lede: r(document.querySelector('.hero .lede')), enter: r(document.querySelector('.hero .enter-wrap')), gate: gateR,
    quick: r(qn), quickRows: qnRows, byline: r(document.querySelector('.show-hero-byline')),
    radar: r(document.querySelector('.hero .radar')), features: r(document.querySelector('.hero .features')),
    hero: r(document.querySelector('.hero')), hOverflow: document.documentElement.scrollWidth > innerWidth,
  };
};

const labelCheck = (sel) => {
  const lab = document.getElementById('v22-current-section');
  const cs = lab && getComputedStyle(lab);
  if (!lab || cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return { visible: false };
  const L = lab.getBoundingClientRect();
  const hit = (b) => Math.min(L.right, b.right) - Math.max(L.left, b.left) > 2 && Math.min(L.bottom, b.bottom) - Math.max(L.top, b.top) > 2;
  const hits = new Set(); let text = 0, ctrl = 0, media = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    if (!n.data.trim() || lab.contains(n)) continue;
    const p = n.parentElement; if (!p || p.closest('#v22-current-section,script,style,noscript')) continue;
    const pcs = getComputedStyle(p); if (pcs.visibility === 'hidden' || +pcs.opacity < 0.05) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    for (const b of rg.getClientRects()) if (hit(b)) { text++; hits.add((p.closest('[id]') || p).id + ':' + n.data.trim().slice(0, 24)); break; }
  }
  for (const el of document.querySelectorAll('a,button,[role=tab],input')) { const b = el.getBoundingClientRect(); if (b.width && hit(b) && getComputedStyle(el).visibility !== 'hidden') { ctrl++; } }
  for (const el of document.querySelectorAll('img,svg:not(#v22-current-section svg)')) { const b = el.getBoundingClientRect(); if (b.width > 40 && hit(b)) media++; }
  return { visible: true, text: lab.textContent, rect: [Math.round(L.left), Math.round(L.top), Math.round(L.width), Math.round(L.height)], textHits: text, ctrlHits: ctrl, mediaHits: media, sample: [...hits].slice(0, 3) };
};

(async () => {
  const browser = await chromium.launch();
  const report = { variant, base, results: [] };
  for (const vp of vps) {
    const phone = vp.w < 700 || (vp.w < 900 && vp.h < 500);
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: vp.dpr, isMobile: phone, hasTouch: phone });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('axiom_loader_seen', '1'); } catch (_) {} });
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(base, { waitUntil: 'load' });
    if (css) await page.addStyleTag({ content: css });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1700);
    const g = await page.evaluate(geom);
    const shot = path.join(outDir, `${variant}-fold-${vp.name.replace('@', '_')}.png`);
    await page.screenshot({ path: shot });
    // section landings (anchor-like): section top placed right under the sticky chrome
    const folds = [];
    for (const sel of SECTIONS) {
      const ok = await page.evaluate((s) => {
        const el = document.querySelector(s); if (!el) return false;
        const sticky = [...document.querySelectorAll('header.top,.show-mobile-nav')].filter(e => { const c = getComputedStyle(e); return c.position === 'sticky' && c.display !== 'none'; });
        const chrome = sticky.reduce((m, e) => Math.max(m, e.getBoundingClientRect().height), 0);
        window.scrollTo(0, el.getBoundingClientRect().top + scrollY - chrome); return true;
      }, sel);
      if (!ok) { folds.push({ sel, missing: true }); continue; }
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      await page.waitForTimeout(260);
      folds.push({ sel, ...(await page.evaluate(labelCheck)) });
    }
    const vis = folds.filter(f => f.visible);
    report.results.push({ vp: vp.name, geom: g, errors, labelSummary: { visibleIn: vis.length, overContent: vis.filter(f => f.textHits || f.ctrlHits || f.mediaHits).length, overTextOrCtrl: vis.filter(f => f.textHits || f.ctrlHits).length }, folds });
    process.stdout.write(`${variant} ${vp.name}: enter ${g.enter && g.enter.t}-${g.enter && g.enter.b} gate ${g.gate ? g.gate.b : '-'} quick ${g.quick && g.quick.b} byline ${g.byline && g.byline.b} vh ${g.vh} title ${g.titleFont} screens ${g.docScreens} | label vis ${vis.length}/17 overContent ${report.results.at(-1).labelSummary.overContent} overText ${report.results.at(-1).labelSummary.overTextOrCtrl} | err ${errors.length}\n`);
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(outDir, `${variant}-report.json`), JSON.stringify(report, null, 1));
})();
