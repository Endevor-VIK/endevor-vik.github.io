// W3.A QA harness (BEFORE/AFTER on immutable snapshots, same tool, same conditions).
// usage: NODE_PATH=<playwright> node w3a_measure.cjs <url> <tag> <outDir> [viewports]
// Measures: first-fold geometry (chrome, eyebrow, title, lede, ENTER, gate note, quick links, byline, radar,
// poster frame, SIGNAL TRACE), page length, horizontal overflow, console errors, floating label presence/collisions,
// bridge visibility + aria-current after native hash navigation; saves a first-fold PNG per viewport.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [base, tag, outDir, vpArg] = process.argv.slice(2);
const ALL = '360x800@2,390x844@3,430x932@3,768x1024@2,844x390@3,960x540@2,1024x768@1,1100x800@1,1280x800@1,1440x900@1,1920x1080@1';
const vps = (vpArg || ALL).split(',').map(s => { const [wh, d] = s.split('@'); const [w, h] = wh.split('x').map(Number); return { w, h, dpr: +d, name: s }; });
const SECTIONS = ['#top', '#about', '#creator', '#work-art-band', '#work', '#system', '#world-guide', '#manifesto', '#modules', '#world', '#chars', '.axiom-entity', '#factions', '#vision', '#collaboration', 'section.cta', 'body > footer'];
const BRIDGED = ['#creator', '#system', '#world-guide', '#vision', '#collaboration'];
fs.mkdirSync(outDir, { recursive: true });

const geom = () => {
  const R = el => { if (!el) return null; const b = el.getBoundingClientRect(); if (!b.width && !b.height) return null; return { t: Math.round(b.top), b: Math.round(b.bottom), l: Math.round(b.left), r: Math.round(b.right), h: Math.round(b.height), w: Math.round(b.width) }; };
  const lines = el => { if (!el) return null; const rg = document.createRange(); rg.selectNodeContents(el); return new Set([...rg.getClientRects()].filter(x => x.width > 1).map(x => Math.round(x.top))).size; };
  const q = s => document.querySelector(s);
  const gate = q('.hero .ax-gate-note'); let gateR = null;
  if (gate && !gate.hidden) { const rg = document.createRange(); rg.selectNodeContents(gate); const rs = [...rg.getClientRects()].filter(x => x.width > 1); if (rs.length) gateR = { t: Math.round(Math.min(...rs.map(x => x.top))), b: Math.round(Math.max(...rs.map(x => x.bottom))) }; }
  const qn = q('.show-hero-extra');
  const lab = q('#v22-current-section, .v22-current-label');
  const title = q('.hero h1.title'), radar = q('.hero .radar');
  const tb = title && title.getBoundingClientRect(), rb = radar && radar.getBoundingClientRect();
  const radarOverTitle = tb && rb ? Math.max(0, Math.min(tb.right, rb.right) - Math.max(tb.left, rb.left)) * Math.max(0, Math.min(tb.bottom, rb.bottom) - Math.max(tb.top, rb.top)) : 0;
  return {
    vw: innerWidth, vh: innerHeight, docScreens: +(document.documentElement.scrollHeight / innerHeight).toFixed(2),
    hOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    header: R(q('header.top')), mnav: R(q('.show-mobile-nav')),
    eyebrow: R(q('.hero .eyebrow')), eyebrowLines: lines(q('.hero .eyebrow')), eyebrowFont: q('.hero .eyebrow') && getComputedStyle(q('.hero .eyebrow')).fontSize,
    title: R(title), titleFont: title && getComputedStyle(title).fontSize,
    lede: R(q('.hero .lede')), ledeFont: getComputedStyle(q('.hero .lede')).fontSize, ledeFamily: getComputedStyle(q('.hero .lede')).fontFamily.split(',')[0],
    enter: R(q('.hero .enter-wrap')), gate: gateR,
    quick: R(qn), quickRows: qn ? new Set([...qn.children].map(a => Math.round(a.getBoundingClientRect().top))).size : null,
    byline: R(q('.show-hero-byline')), bylineLines: lines(q('.show-hero-byline')),
    radar: R(radar), radarOverTitlePx: Math.round(radarOverTitle), radarOpacity: radar && getComputedStyle(radar).opacity,
    frame: R(q('.hero-frame')), status: R(q('.hero .status-card')), features: R(q('.hero .features')), hero: R(q('.hero')),
    labelInDom: !!lab, labelVisible: !!lab && getComputedStyle(lab).display !== 'none' && getComputedStyle(lab).visibility !== 'hidden' && +getComputedStyle(lab).opacity > 0.05,
  };
};

const labelHits = () => {
  const lab = document.querySelector('#v22-current-section, .v22-current-label');
  if (!lab) return { present: false };
  const cs = getComputedStyle(lab);
  if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return { present: true, visible: false };
  const L = lab.getBoundingClientRect();
  const hit = b => Math.min(L.right, b.right) - Math.max(L.left, b.left) > 2 && Math.min(L.bottom, b.bottom) - Math.max(L.top, b.top) > 2;
  let text = 0, ctrl = 0;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    if (!n.data.trim() || lab.contains(n)) continue; const p = n.parentElement; if (!p || p.closest('script,style,noscript')) continue;
    const pcs = getComputedStyle(p); if (pcs.visibility === 'hidden' || +pcs.opacity < 0.05) continue;
    const rg = document.createRange(); rg.selectNodeContents(n); for (const b of rg.getClientRects()) if (hit(b)) { text++; break; }
  }
  for (const el of document.querySelectorAll('a,button,[role=tab]')) { const b = el.getBoundingClientRect(); if (b.width && hit(b)) ctrl++; }
  return { present: true, visible: true, text, ctrl };
};

const stickyBottom = () => [...document.querySelectorAll('header.top,.show-mobile-nav')].filter(e => { const c = getComputedStyle(e); return c.position === 'sticky' && c.display !== 'none' && e.getBoundingClientRect().top <= 1; }).reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0);

(async () => {
  const browser = await chromium.launch();
  const report = { tag, base, at: new Date().toISOString(), engine: 'chromium ' + browser.version(), results: [] };
  for (const vp of vps) {
    const phone = vp.w < 700 || (vp.w < 900 && vp.h < 500);
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: vp.dpr, isMobile: phone, hasTouch: phone });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('axiom_loader_seen', '1'); } catch (_) {} });
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(base, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1700);
    const g = await page.evaluate(geom);
    await page.screenshot({ path: path.join(outDir, `${tag}-fold-${vp.name.replace('@', '_')}.png`) });
    // floating label over content at 17 section landings (only if the label exists)
    const labels = [];
    if (g.labelInDom) for (const sel of SECTIONS) {
      await page.evaluate(s => { const el = document.querySelector(s); if (!el) return; const c = [...document.querySelectorAll('header.top,.show-mobile-nav')].filter(e => getComputedStyle(e).position === 'sticky' && getComputedStyle(e).display !== 'none').reduce((m, e) => Math.max(m, e.getBoundingClientRect().height), 0); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - c); }, sel);
      await page.waitForTimeout(260); labels.push({ sel, ...(await page.evaluate(labelHits)) });
    }
    // bridges after native hash navigation
    const bridges = [];
    for (const id of BRIDGED) {
      await page.evaluate(() => { history.replaceState(null, '', location.pathname); window.scrollTo(0, 0); });
      await page.waitForTimeout(120);
      // the user path: click the menu item (desktop) or the swipe-nav item (<=1080), then wait until smooth scrolling ends
      const navSel = await page.evaluate(h => { const m = document.querySelector('.menu a[href="' + h + '"]'); return m && m.getClientRects().length && getComputedStyle(m).display !== 'none' ? '.menu a[href="' + h + '"]' : '.show-mobile-nav a[href="' + h + '"]'; }, id);
      await page.locator(navSel).click();
      await page.evaluate(() => new Promise(res => { let last = scrollY, same = 0, n = 0, moved = false; const tick = () => { n++; if (Math.abs(scrollY - last) > 0.5) { moved = true; same = 0; } else same++; last = scrollY; if ((moved && same >= 8) || n > 400) res(); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); }));
      await page.waitForTimeout(150);
      bridges.push(await page.evaluate(h => {
        const sec = document.querySelector(h); let br = sec.previousElementSibling; if (!br || !br.matches('.v22-bridge')) br = null;
        const sb = [...document.querySelectorAll('header.top,.show-mobile-nav')].filter(e => { const c = getComputedStyle(e); return c.position === 'sticky' && c.display !== 'none' && e.getBoundingClientRect().top <= 1; }).reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0);
        const b = br && br.getBoundingClientRect(), s = sec.getBoundingClientRect();
        const cur = [...document.querySelectorAll('[aria-current="location"]')].map(a => a.getAttribute('href'));
        return { id: h, chromeBottom: Math.round(sb), bridgeTop: b ? Math.round(b.top) : null, bridgeBottom: b ? Math.round(b.bottom) : null, sectionTop: Math.round(s.top), fullyVisible: !!b && b.top >= sb - 1 && b.bottom <= innerHeight, ariaCurrent: cur };
      }, id));
    }
    const visLabels = labels.filter(l => l.visible);
    const res = { vp: vp.name, geom: g, errors, label: { inDom: g.labelInDom, visibleIn: visLabels.length, overTextOrCtrl: visLabels.filter(l => l.text || l.ctrl).length }, bridges };
    report.results.push(res);
    const fit = g.gate ? g.gate.b <= g.vh : (g.enter && g.enter.b <= g.vh);
    process.stdout.write(`${tag} ${vp.name}: CTA ${g.enter.t}-${g.enter.b} gate ${g.gate ? g.gate.b : '-'} ${fit ? 'IN' : 'OUT'} | quick ${g.quick && g.quick.b}(${g.quickRows}r) byline ${g.byline && g.byline.b}(${g.bylineLines}l) | frame ${g.frame ? g.frame.t + '-' + g.frame.b : '-'} | title ${g.titleFont} lede ${g.ledeFont} | eyebrow ${g.eyebrowLines}l | screens ${g.docScreens} | ovf ${g.hOverflow} | label dom ${g.labelInDom} hits ${res.label.overTextOrCtrl}/${visLabels.length} | bridges ${bridges.filter(b => b.fullyVisible).length}/${bridges.length} | err ${errors.length}\n`);
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(outDir, `${tag}-report.json`), JSON.stringify(report, null, 1));
})();
