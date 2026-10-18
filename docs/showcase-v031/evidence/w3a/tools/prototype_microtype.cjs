const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const [w, h, phone] of [[390, 844, true], [1440, 900, false]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: phone, hasTouch: phone, deviceScaleFactor: 1 });
    await ctx.addInitScript(() => sessionStorage.setItem('axiom_loader_seen', '1'));
    const p = await ctx.newPage(); await p.goto(process.argv[2]); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
    const res = await p.evaluate((phone) => {
      const zone = [...document.querySelectorAll('header.top,.show-mobile-nav,#top,#about,#creator')];
      const out = {};
      for (const z of zone) {
        const walker = document.createTreeWalker(z, NodeFilter.SHOW_TEXT);
        for (let n; (n = walker.nextNode());) {
          if (!n.data.trim()) continue; const el = n.parentElement; const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden' || !el.getClientRects().length) continue;
          const fs = parseFloat(cs.fontSize), ls = parseFloat(cs.letterSpacing) / fs || 0;
          const hidden = !!el.closest('[aria-hidden="true"]') || el.closest('svg');
          const lim = phone ? 12 : 11;
          if (fs < lim) {
            const key = `${hidden ? 'DECOR' : 'MEANING'} ${fs}px ls${ls.toFixed(2)} ${cs.fontFamily.split(',')[0]} <${el.tagName.toLowerCase()}.${(el.className && el.className.baseVal === undefined ? el.className : '').toString().split(' ')[0]}>`;
            out[key] = out[key] || { n: 0, ex: n.data.trim().slice(0, 34) }; out[key].n++;
          }
        }
      }
      return out;
    }, phone);
    console.log(`== ${w}x${h}`); for (const [k, v] of Object.entries(res).sort()) console.log(String(v.n).padStart(3), k, '|', v.ex);
    await ctx.close();
  }
  await b.close();
})();
