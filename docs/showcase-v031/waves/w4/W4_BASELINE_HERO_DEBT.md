<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4.BASELINE_HERO_DEBT
  title: "0524.W4 — baseline HERO debt, outside implementation scope"
  status: EXISTING_BASELINE_DEBT / SEPARATE_SCOPE_REQUIRED
  deployment: NOT_DEPLOYED
  mode: Deferred defect record
  goal: "Сохранить два воспроизведённых исходных дефекта без изменения protected sections в W4"
  scope: HERO baseline 6b082e5 / unchanged in b85fbb0a
  lang: ru
  last_updated: 2026-10-20
  editable_by_agents: true
  change_policy: "Ремедиация только в отдельном разрешённом scope; W4 checks не ослаблять"
-->
# Baseline HERO debt — separate from W4

По [Principal interim review](W4_PRINCIPAL_INTERIM_REVIEW.md) эти два дефекта остаются отдельной задолженностью. Они воспроизведены на точных BEFORE `6b082e5f262c09a123748273da42277d3a29a6c2` и AFTER `b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5`. Исходный HERO не менялся. W4 не содержит исправления или waiver этих failures.

| ID | Legacy check / environment | Measured baseline and AFTER | Status |
| --- | --- | --- | --- |
| W4-DEBT-HERO-01 | `R-W3A-02-poster-frame-1024x768`, Chromium 149, DPR 1 | Рамка: top 151 / bottom 771 при высоте viewport 768 — выход на 3 px. CTA, rail, byline и radar внутри рамки. Геометрия HERO одинакова во всех трёх парных повторениях | OPEN / BASELINE / P2 |
| W4-DEBT-HERO-02 | `R01-no-h-overflow-720x450@2`, Firefox 151 | scrollWidth 722 / clientWidth 720. Исходный `span.ax-gate-date`: right 722.1; промежуточного clipping ancestor нет. Одинаково сразу после load и после fonts.ready + 400 ms в трёх парных повторениях | OPEN / BASELINE / P2 |

Оба результата остаются literal FAIL в legacy suite: **230 PASS / 2 FAIL / 0 SKIP**. [Raw results](../../evidence/w4/qa/legacy-regression.json), [console](../../evidence/w4/qa/legacy-regression.log), [paired reproduction](../../evidence/w4/qa/legacy-narrow-baseline-comparison.json).

Для будущей отдельной задачи: сохранить реальный CTA/gate note, композицию HERO, исходный масштаб заголовка, protected source и соответствующие проверки. Сначала воспроизвести на новом checked baseline и согласовать scope; данный debt record сам не даёт разрешения менять HERO, shared styles или tests. Не исправлять их молча в W4 ради полного зелёного legacy total.

Отдельное известное ограничение W01 в коротком landscape viewport не входит в эти два HERO debt items. На 844×390 CTA обеих версий ниже первого кадра после перехода по якорю, но доступна после одного Tab или прокрутки; hit-test подтверждён. См. [narrow evidence](../../evidence/w4/qa/landscape-recovery/manifest.json). Этот результат не смешивается с двумя указанными legacy failures.
