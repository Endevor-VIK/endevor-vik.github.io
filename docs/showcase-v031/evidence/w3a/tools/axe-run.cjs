// axe-core 4.12.1 on 390 (mobile) and 1440 (desktop); usage: node axe-run.cjs <url> <out.json>
const { chromium } = require('playwright'); const fs = require('fs');
const AXE = fs.readFileSync(process.env.AXE_PATH, 'utf8');
(async () => {
  const b = await chromium.launch(); const out = {};
  for (const [name, w, h, m] of [['mobile', 390, 844, true], ['desktop', 1440, 900, false]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: m, hasTouch: m });
    await ctx.addInitScript(() => sessionStorage.setItem('axiom_loader_seen', '1'));
    const p = await ctx.newPage(); await p.goto(process.argv[2], { waitUntil: 'load' }); await p.waitForTimeout(1500);
    await p.addScriptTag({ content: AXE });
    const r = await p.evaluate(async () => { const res = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }); return { violations: res.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes.slice(0, 3).map(n => n.target.join(' ')) })), incomplete: res.incomplete.map(v => ({ id: v.id, nodes: v.nodes.length })), passes: res.passes.length }; });
    out[name] = r; console.log(name, 'violations', r.violations.length, JSON.stringify(r.violations), 'incomplete', JSON.stringify(r.incomplete), 'passes', r.passes);
    await ctx.close();
  }
  await b.close(); fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
})();
