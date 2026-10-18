// Text-over-radar contrast on phones: background pixels under each hero text line (text made transparent),
// 3 animation samples; out: rects + PNGs for w3a_contrast.py
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const [base, tag, outDir] = process.argv.slice(2); fs.mkdirSync(outDir, { recursive: true });
(async () => { const b = await chromium.launch(); const meta = {};
  for (const [w, h] of [[360, 800], [390, 844], [430, 932]]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await c.addInitScript(() => sessionStorage.setItem('axiom_loader_seen', '1'));
    const p = await c.newPage(); await p.goto(base); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2200);
    const items = await p.evaluate(() => { const out = [];
      for (const sel of ['.hero .eyebrow', '.hero h1.title .w:not(.dim):not(.red)', '.hero h1.title .w.dim', '.hero h1.title .w.red', '.hero .lede']) {
        const el = document.querySelector(sel); const col = getComputedStyle(el).color;
        const wk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); const rects = [];
        for (let n; (n = wk.nextNode());) { if (!n.data.trim() || n.parentElement.closest('[aria-hidden="true"]')) continue; const rg = document.createRange(); rg.selectNodeContents(n); for (const r of rg.getClientRects()) if (r.width > 2) rects.push([r.left, r.top, r.right, r.bottom]); }
        out.push({ sel, color: col, rects, textColorOf: [...new Set([...el.querySelectorAll('b, *')].map(e => getComputedStyle(e).color))] });
      } return out; });
    await p.addStyleTag({ content: '.hero .eyebrow,.hero .eyebrow *,.hero h1.title,.hero h1.title *,.hero .lede,.hero .lede *{color:transparent!important;text-shadow:none!important;-webkit-text-fill-color:transparent!important}.hero h1.title .w.red::before{display:none!important}' });
    const shots = [];
    for (let i = 0; i < 3; i++) { const f = path.join(outDir, `${tag}-bg-${w}-${i}.png`); await p.screenshot({ path: f }); shots.push(f); await p.waitForTimeout(1100); }
    meta[w] = { items, shots, dpr: 2 }; await c.close();
  }
  await b.close(); fs.writeFileSync(path.join(outDir, `${tag}-contrast-meta.json`), JSON.stringify(meta, null, 1)); })();
