<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.I18N.AGENTOPS
  title: "ENG/RU — GLOBAL LOG"
  status: ACTIVE
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

Предварительные проверки: static localization 5/5 и оба smoke PASS.
Targeted Chromium149/Firefox151: streamed HERO, streamed RU loader и открытый
WORK viewer — 6/6 PASS (до финальных pan/close/standalone archive расширений).
Полные окончательные suites / screenshots / final source SHA — ещё NOT_RUN.

## Step E — Git

База и ветка приведены выше. Main / deployment / root gitlink — HOLD.
