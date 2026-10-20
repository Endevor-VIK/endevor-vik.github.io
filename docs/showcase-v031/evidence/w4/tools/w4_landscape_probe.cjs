#!/usr/bin/env node
/* 0524.W4: narrow recovery of the 844x390 WORLD-menu reachability observation.
 * No matrix/legacy rerun and no runtime mutation. Uses literal frozen W4 helpers.
 * NODE_PATH=<existing modules> node w4_landscape_probe.cjs --before <isolated tree>
 *   --after <isolated tree> --out /tmp/axs-0524-w4-landscape-recovery/run-1
 *   --durable-out <review evidence>/qa/landscape-recovery
 * Browser execution is coordinated by the lead; do not run beside native zoom/LH.
 */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const cp = require('child_process'), crypto = require('crypto'), pw = require('playwright');
const argv = process.argv.slice(2), value = k => { const i = argv.indexOf(k); return i < 0 ? null : argv[i + 1]; };
const BEFORE_SHA = '6b082e5f262c09a123748273da42277d3a29a6c2';
const AFTER_SHA = 'b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5';
const roots = { before: value('--before'), after: value('--after') };
const OUT = value('--out'), DURABLE = value('--durable-out');
const TEMP_PARENT = '/tmp/axs-0524-w4-landscape-recovery';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const git = (root, ...args) => cp.execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
let destinations = [], bytes = 0;
const report = { createdAt: new Date().toISOString(), scope: 'Narrow recovery only; original full matrices and legacy results retained separately',
  viewport: { width: 844, height: 390, dpr: 1, reducedMotion: 'reduce', touch: false },
  interpretation: 'Initial-viewport failures remain failures. Native keyboard/manual reachability does not turn them into PASS.',
  samples: [], comparisons: [], captures: [] };
function log(id, detail) {
  const line = id + ' ' + JSON.stringify(detail) + '\n';
  for (const d of destinations) { const p = path.join(d, 'console.log'); if (fs.existsSync(p) && fs.statSync(p).size + Buffer.byteLength(line) > 256 * 1024) throw Error('256 KiB log ceiling'); fs.appendFileSync(p, line); }
  process.stdout.write(line);
}
function save() { for (const d of destinations) fs.writeFileSync(path.join(d, 'manifest.json'), JSON.stringify(report, null, 2) + '\n'); }
function prepare() {
  if (!roots.before || !roots.after || !OUT || !DURABLE) throw Error('--before, --after, --out, --durable-out are required');
  for (const p of Object.values(roots)) if (fs.realpathSync(p) !== path.resolve(p)) throw Error('Use real isolated tree paths');
  if (path.dirname(path.resolve(OUT)) !== TEMP_PARENT || !path.basename(OUT).startsWith('run-')) throw Error('Output must be own /tmp/axs-0524-w4-landscape-recovery/run-*');
  const durable = path.resolve(DURABLE), allowed = path.join(path.resolve(roots.after), 'docs/showcase-v031/evidence/w4/qa/');
  if (!durable.startsWith(allowed) || !path.basename(durable).startsWith('landscape-recovery')) throw Error('Durable output must be a new scoped W4 qa/landscape-recovery package');
  if (fs.existsSync(OUT) || fs.existsSync(durable)) throw Error('Refusing to overwrite evidence');
  fs.mkdirSync(TEMP_PARENT, { recursive: true });
  const owned = fs.readdirSync(TEMP_PARENT).map(n => path.join(TEMP_PARENT, n)).filter(p => fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, '.w4-owned'))).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  for (const [i, p] of owned.entries()) if (i >= 2 || Date.now() - fs.statSync(p).mtimeMs > 14 * 864e5) { if (fs.realpathSync(p) !== p) throw Error('Symlink in own retention'); fs.rmSync(p, { recursive: true }); }
  destinations = [path.resolve(OUT), durable];
  for (const d of destinations) { fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(path.join(d, d === durable ? '.w4-landscape-evidence' : '.w4-owned'), '0524.W4 landscape recovery; own output\n'); }
  report.resourceGuard = JSON.parse(cp.execFileSync('powershell.exe', ['-NoProfile', '-Command', '(Get-Volume -DriveLetter C | Select-Object SizeRemaining,Size | ConvertTo-Json -Compress)'], { encoding: 'utf8' }).trim());
  const free = report.resourceGuard.SizeRemaining, size = report.resourceGuard.Size;
  if (free < 10 * 1024 ** 3 || free / size < .05) throw Error('Windows HOST CRITICAL; no browsers');
  report.retention = 'Owned /tmp runs: latest 3 and <=14 days, prune at write. Durable fixed recovery package preserved; no source assets/profiles/videos/traces copied. Captures <=5 MiB; console <=256 KiB.';
  report.probeSha256 = sha(fs.readFileSync(__filename));
  report.sources = {};
  for (const [phase, root] of Object.entries(roots)) {
    const expected = phase === 'before' ? BEFORE_SHA : AFTER_SHA;
    const actualIndex = fs.readFileSync(path.join(root, 'index.html'));
    const frozenIndex = cp.execFileSync('git', ['-C', root, 'show', expected + ':index.html']);
    if (sha(actualIndex) !== sha(frozenIndex) || git(root, 'diff', expected, '--', 'index.html', 'assets')) throw Error('Runtime differs from frozen ' + phase);
    report.sources[phase] = { root, head: git(root, 'rev-parse', 'HEAD'), testedRuntimeFreeze: expected,
      indexSha256: sha(actualIndex), assetsTree: git(root, 'rev-parse', expected + ':assets') };
  }
  save();
}
function helpers(root, phase) {
  const file = path.join(roots.after, 'tests/browser/w4_qa.cjs');
  const frozen = cp.execFileSync('git', ['-C', roots.after, 'show', AFTER_SHA + ':tests/browser/w4_qa.cjs'], { encoding: 'utf8' });
  if (sha(fs.readFileSync(file)) !== sha(frozen)) throw Error('W4 runner changed from freeze');
  const prefix = frozen.slice(0, frozen.indexOf('async function shot('));
  if (!prefix.includes('async function context(') || !prefix.includes('async function ready(')) throw Error('Frozen helper boundary missing');
  report.frozenRunnerSha256 = sha(frozen);
  report.helperPrefixSha256 = sha(prefix);
  const box = { require, __dirname: path.dirname(file), __filename: file, URL, Buffer, console,
    process: { argv: ['node', file, '--root', root, '--phase', phase, '--out', '/tmp/unused-narrow-output'], version: process.version, platform: process.platform, stdout: process.stdout }, module: { exports: {} } };
  vm.runInNewContext(prefix + '\nmodule.exports={serve,context,ready,scroll,setBrowser:b=>browser=b,closeServers:()=>Promise.all(servers.map(s=>new Promise(r=>s.close(r))))};', box);
  return box.module.exports;
}
const geometry = () => {
  const cta = document.querySelector('.ax-world-cta'), r = cta.getBoundingClientRect(), section = document.querySelector('#world-guide').getBoundingClientRect();
  const title = document.querySelector('#v22-world-title'), tr = title.getBoundingClientRect();
  const chrome = [...document.querySelectorAll('header.top,.show-mobile-nav')].filter(x => getComputedStyle(x).position === 'sticky' && getComputedStyle(x).display !== 'none' && x.getBoundingClientRect().top <= 1).reduce((m, x) => Math.max(m, x.getBoundingClientRect().bottom), 0);
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const inView = r.top >= chrome - 1 && r.bottom <= innerHeight + 1;
  const hit = inView ? document.elementFromPoint(x, y) : null;
  return { top: Math.round(r.top), bottom: Math.round(r.bottom), header: Math.round(chrome), vh: innerHeight, scrollY: Math.round(scrollY),
    section: { top: Math.round(section.top), height: Math.round(section.height) }, title: { text: title.textContent, height: Math.round(tr.height) },
    originalViewportCheckPass: inView, focus: document.activeElement === cta, hitTestReachable: !!hit && (hit === cta || cta.contains(hit)), hash: location.hash };
};
async function capture(p, engine, phase, state) {
  await p.mouse.move(-20, -20);
  const raw = await p.screenshot({ type: 'png', animations: 'disabled' });
  const image = cp.execFileSync('python3', ['-c', 'import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read()));im.save(sys.stdout.buffer,format="WEBP",quality=76,method=4)'], { input: raw, maxBuffer: 2 * 1024 * 1024 });
  bytes += image.length; if (bytes > 5 * 1024 * 1024) throw Error('5 MiB capture ceiling');
  const relative = engine + '-' + phase + '-' + state + '.webp';
  for (const d of destinations) fs.writeFileSync(path.join(d, relative), image);
  report.captures.push({ engine, phase, state, path: relative, sha256: sha(image), bytes: image.length });
}
(async () => {
  prepare();
  log('SOURCES', report.sources); log('HOST', report.resourceGuard);
  for (const engine of ['chromium', 'firefox', 'webkit']) {
    const options = { headless: true };
    if (engine === 'webkit') { options.executablePath = '/tmp/axs-0524-w4-webkit-deps/webkit-headless.sh'; report.webkitRootlessDependencies = JSON.parse(fs.readFileSync('/tmp/axs-0524-w4-webkit-deps/manifest.json', 'utf8')); }
    const browser = await pw[engine].launch(options);
    try {
      for (const [phase, root] of Object.entries(roots)) {
        const h = helpers(root, phase); h.setBrowser(browser); let c;
        try {
          const url = await h.serve(); c = await h.context(engine, 844, 390); const p = await c.newPage();
          await p.goto(url, { waitUntil: 'load' }); await h.ready(p);
          await h.scroll(p, '.ax-omega-cta'); await p.locator('.ax-omega-cta').focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(80);
          const menu = p.locator('.show-mobile-nav a[href="#world-guide"]'); await menu.click(); await h.ready(p);
          const postMenu = await p.evaluate(geometry); await capture(p, engine, phase, 'post-menu');
          // Follow the native Tab order from the menu link; focus() is not used for the CTA.
          let tabs = 0;
          while (!(await p.locator('.ax-world-cta').evaluate(x => document.activeElement === x)) && tabs < 200) { await p.keyboard.press('Tab'); tabs++; }
          await h.ready(p); const nativeKeyboard = await p.evaluate(geometry); nativeKeyboard.tabPresses = tabs;
          await capture(p, engine, phase, 'keyboard-cta');
          await menu.click(); await h.ready(p); await p.locator('.ax-world-cta').evaluate(x => x.scrollIntoView({ block: 'center', behavior: 'instant' })); await h.ready(p);
          const manualScroll = await p.evaluate(geometry); await capture(p, engine, phase, 'manual-cta');
          const sample = { engine, version: browser.version(), phase, postMenu, nativeKeyboard, manualScroll };
          report.samples.push(sample); save(); log('SAMPLE', sample);
        } finally { if (c) await c.close(); await h.closeServers(); }
      }
    } finally { await browser.close(); }
    const before = report.samples.find(x => x.engine === engine && x.phase === 'before'), after = report.samples.find(x => x.engine === engine && x.phase === 'after');
    const fields = ['top', 'bottom', 'header', 'vh'];
    report.comparisons.push({ engine, matchingInitialGeometry: fields.every(k => before.postMenu[k] === after.postMenu[k]),
      initialViewportFailures: [before, after].filter(x => !x.postMenu.originalViewportCheckPass).length,
      nativeKeyboardReachable: [before, after].every(x => x.nativeKeyboard.focus && x.nativeKeyboard.originalViewportCheckPass && x.nativeKeyboard.hitTestReachable),
      manualScrollReachable: [before, after].every(x => x.manualScroll.originalViewportCheckPass && x.manualScroll.hitTestReachable) }); save();
  }
  report.completedAt = new Date().toISOString(); report.captureBytes = bytes;
  report.summary = { pairedEngines: report.comparisons.length, initialViewportFailures: report.comparisons.reduce((n, x) => n + x.initialViewportFailures, 0),
    matchingInitialGeometry: report.comparisons.every(x => x.matchingInitialGeometry), nativeKeyboardReachable: report.comparisons.every(x => x.nativeKeyboardReachable), manualScrollReachable: report.comparisons.every(x => x.manualScrollReachable), captures: report.captures.length };
  for (const c of report.captures) for (const d of destinations) if (sha(fs.readFileSync(path.join(d, c.path))) !== c.sha256) throw Error('Recovery capture hash mismatch');
  save(); log('SUMMARY', report.summary);
  if (!report.summary.matchingInitialGeometry || !report.summary.nativeKeyboardReachable || !report.summary.manualScrollReachable) process.exitCode = 1;
})().catch(error => { report.fatal = String(error); if (destinations.length) { save(); log('FATAL', String(error)); } else process.stderr.write(String(error) + '\n'); process.exitCode = 1; });
