const { chromium } = require('playwright'); const path = require('path');
const [base, tag, outDir] = process.argv.slice(2);
(async () => { const b = await chromium.launch();
  for (const [w, h, d, m] of [[390, 844, 2, true], [1440, 900, 1, false]]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: d, isMobile: m, hasTouch: m });
    await c.addInitScript(() => sessionStorage.setItem('axiom_loader_seen', '1'));
    const p = await c.newPage(); await p.goto(base); await p.evaluate(() => document.fonts.ready);
    // reveal everything and neutralise fixed chrome so element shots are clean
    await p.addStyleTag({ content: 'header.top,.show-mobile-nav,.v22-scroll-progress,.v22-current-label,.index-cursor{position:static!important} section{opacity:1!important;transform:none!important}' });
    for (const sel of ['#top', '#about', '#creator']) { await p.locator(sel).scrollIntoViewIfNeeded(); await p.waitForTimeout(500); await p.locator(sel).screenshot({ path: path.join(outDir, `${tag}-sec-${sel.slice(1)}-${w}.png`) }); }
    await c.close(); }
  await b.close(); })();
