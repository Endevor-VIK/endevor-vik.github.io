// W3.A type floor inventory: meaningful text < 12 px and phone prose < 14 px in the W3.A zone
// (header, swipe nav, #top, #about, #creator). Decorative = inside aria-hidden or SVG.
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const out = {};
  for (const [name, w, h, phone] of [['390', 390, 844, true], ['360', 360, 800, true], ['1440', 1440, 900, false], ['1024', 1024, 768, false]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: phone, hasTouch: phone });
    await ctx.addInitScript(() => sessionStorage.setItem('axiom_loader_seen', '1'));
    const p = await ctx.newPage(); await p.goto(process.argv[2]); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
    out[name] = await p.evaluate((phone) => {
      const rows = {}; let meaningfulSmall = 0, decorSmall = 0, proseSmall = 0, wideTracking = 0;
      for (const z of document.querySelectorAll('header.top,.show-mobile-nav,#top,#about,#creator')) {
        const wk = document.createTreeWalker(z, NodeFilter.SHOW_TEXT);
        for (let n; (n = wk.nextNode());) {
          if (!n.data.trim()) continue; const el = n.parentElement; const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden' || !el.getClientRects().length) continue;
          const decor = !!el.closest('[aria-hidden="true"],svg'); const fs = parseFloat(cs.fontSize); const ls = (parseFloat(cs.letterSpacing) || 0) / fs;
          const prose = !!el.closest('p,.feature,.v22-pillars p') && !el.closest('.ax-gate-note');
          const tag = `${el.tagName.toLowerCase()}.${(typeof el.className === 'string' ? el.className.split(' ')[0] : '')}<${el.parentElement ? (el.parentElement.className || el.parentElement.tagName).toString().split(' ')[0] : ''}`;
          let flag = null;
          if (fs < 12) { if (decor) decorSmall++; else { meaningfulSmall++; flag = 'LABEL<12'; } }
          if (!decor && phone && prose && fs < 14) { proseSmall++; flag = 'PROSE<14'; }
          if (!decor && fs >= 11 && ls > 0.205) { wideTracking++; flag = flag || 'TRACK>.2em'; }
          if (flag) { const k = `${flag} ${fs}px ls${ls.toFixed(2)} ${tag}`; rows[k] = rows[k] || { n: 0, ex: n.data.trim().slice(0, 30) }; rows[k].n++; }
        }
      }
      return { meaningfulSmall, decorSmall, proseSmall, wideTracking, rows };
    }, phone);
    await ctx.close();
  }
  await b.close(); fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
  for (const [k, v] of Object.entries(out)) { console.log(`== ${k}: meaningful<12 ${v.meaningfulSmall} · phoneProse<14 ${v.proseSmall} · tracking>.2em ${v.wideTracking} · decor<12 ${v.decorSmall}`); for (const [r, x] of Object.entries(v.rows).sort()) console.log('  ', String(x.n).padStart(3), r, '|', x.ex); }
})();
