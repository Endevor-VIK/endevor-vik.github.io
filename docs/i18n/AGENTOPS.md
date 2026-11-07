<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.I18N.AGENTOPS
  title: "ENG/RU — GLOBAL LOG"
  status: TECH_PASS / CREATOR_VISUAL_REVIEW_PENDING
  deployment: NOT_DEPLOYED
  mode: AgentOps
  goal: "Exact execution trace for localization"
  scope: landing repository only
  lang: ru
  last_updated: 2026-11-07
  editable_by_agents: true
  change_policy: "Append measured results; no inferred PASS"
-->
# GLOBAL LOG — showcase-i18n-en-ru

Связь: [SPEC](SPEC.md). Local task identity: `showcase-i18n-en-ru`;
root 0524 относится к предыдущей программе, root shared index и gitlink не меняются.

## Step A — Discovery

- Прочитана текущая директива, root/local AGENTS, AAA protocol/roadmap/handoff/scorecard,
  существующие review/QA/preservation материалы и runtime policy/config.
- `main` / `origin/main`: `b4d9c4dcd63131079c0cf8ccee80ecc00d3c5994`, child checkout чистый.
- Root gitlink: `babbaa37baf4a13ea0546f19cc00d4f95b2d23f5`; это отдельное состояние,
  его продвижение не входит в задачу. Root foreign changes не трогаются.
- Remote open PR #11 — прежний docs-only WORLD proposal; его ветка не меняется.
- Host guard: Windows C свободно 97,472,028,672 bytes (~90.8 GiB), выше thresholds.
- Независимый read-only аудит проверил Canon names, динамические строки,
  CSS-generated copy, 404 typing и существующий Serafim Veyr fan archive.

## Step B — Implementation

Реализованы JSON catalogs (929 keys), generated bundle, preference helper/runtime,
text-node/attribute bindings, ENG/RU controls в navigation/dialogs, все dynamic
states, loader/404 и preference continuity самостоятельного fan archive.
Без изменения изображений/шрифтов/Canon/URL AXIOM. Небольшие header/viewer/tablet
geometry corrections сохраняют композицию и доступность.

При review исправлены performance regression (повторные parser subtree scans),
поздний browser scroll anchor после смены языка в viewer, streaming characterData,
исходные whitespace у inline tags и неверные descendant lang overrides.

## Step C — Documentation

SPEC и этот trace созданы до product mutations; добавлен maintenance guide;
финальный report/captures фиксируются после QA.

## Step D — QA

- `python3 tests/test_i18n.py`: PASS 5/5; dictionary equality/nonempty/placeholders,
  source coverage, dynamic sources, bootstrap order and generated catalog guard.
- `python3 tests/smoke_showcase.py` / `python3 tests/smoke_showcase_v23.py`: PASS.
- `node assets/i18n/build-catalogs.cjs --check`: PASS.
- `NODE_PATH=<existing Playwright> node tests/browser/i18n_regression.cjs`: PASS
  84/84 Chromium149 + Firefox151, clean runtime `4aafcbe9`, before/after hashes
  equal. Includes 40 captures, storage/query/keyboard/state/XSS/streaming contracts.
- `NODE_PATH=<existing Playwright> node tests/browser/showcase_regression.cjs
  --firefox`: final sequential run PASS 232/232, 0 FAIL, 0 SKIP, harness `8da15b6`,
  runtime identical `4aafcbe9`. Initial parallel run 231/232 (R29 fixed 400ms wait),
  isolated R29 PASS; test wait changed to exact state with 5s bound, strict
  assertions retained. Original missed event is not proven; evidence preserved.
- Exact-code performance: local Chromium149 gzip, 3 interleaved mobile RU pairs:
  FCP median300→164ms, LCP300→212ms, CLS0→0; EN spot236ms/0. Added gzip49,062B.
  Local lab scope only, not field CWV or production network proof.
- Independent screenshot review all requested widths and both locales: no blocking
  overlap observed. CREATOR visual acceptance remains pending.
- Preservation checks: section/order/CanonIDs/hrefs/image attributes identical;
  no image/font assets changed; original main checkout and root gitlink unchanged.
- Evidence: [REPORT](REPORT.md), `evidence/*.json`, selected captures and hashes.
- NOT_RUN: real devices/GPU, manual SR, Safari/WebKit, Lighthouse/field CWV,
  crawler SEO localization and production deploy. No PASS inferred for these.
- Host guard refreshed at resume: Windows C91,561,938,944bytes free (~85.3GiB).
  Own transient runs bounded at write time; own browsers/static servers closed.

## Step E — Git

- Contract: `6159d8e9bae00b81888b4d6cb1c104b7d1b6391d`.
- Runtime/code/tests: `4aafcbe9ef022f612ddc29e0de671d6aab565da9`.
- Test-only R29 wait: `8da15b60471b3d892bc8fb78ebc88081d5b25eda`.
- Documentation/evidence: `213b8c0139d419e931944e1b1ae19f3548d69935`.
- PR [#14](https://github.com/Endevor-VIK/endevor-vik.github.io/pull/14) OPEN / NOT MERGED; remote head confirmed
  at creation `213b8c0`, base `b4d9c4d`, mergeable true. No remote CI statuses or
  PR workflow runs were returned; local test results above are not CI claims.
- Branch remote recovery point: `origin/feature/showcase-i18n-en-ru`; delivery
  trace is completed by the documentation-only commit containing this PR link.
- Root gitlink stays `babbaa37baf4a13ea0546f19cc00d4f95b2d23f5`; original landing
  main stays `b4d9c4dcd63131079c0cf8ccee80ecc00d3c5994`. No root commit.
- No amend/rebase/force update, version bump, Canon write, merge or deploy.
- `git log --oneline origin/main..feature/showcase-i18n-en-ru` restores exact
  task commits; refresh remote refs/PR before continuing, never trust a snapshot.
