<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4.WORLD_QA_REPORT
  title: "0524.W4 — current validation and future G3/G4 matrix"
  status: G0_SOURCE_CHECKED / G3_G4_NOT_RUN
  deployment: NOT_DEPLOYED
  mode: QA report / reproducibility contract
  goal: "Отделить выполненный source audit от будущего браузерного доказательства"
  scope: 0524.W4 documentation proposal
  lang: ru
  last_updated: 2026-10-19
  editable_by_agents: true
  change_policy: "PASS только по исполненному check на exact SHA; review не заменяет Gate A/B"
-->

# WORLD — QA status

**G0/G1 подготовлены. G2 не начат. G3 и финальный G4 — NOT RUN.** Эта стадия не заявляет AAA, visual pass, production readiness или устранение существующих browser/Retina gaps.

## 1. Выполненные проверки

Baseline `6b082e5f262c09a123748273da42277d3a29a6c2`, isolated worktree `0524-w4-world-narrative-g0-g1`.

| Проверка | Реальный результат | Практический предел |
| --- | --- | --- |
| `git fetch origin`, remote main, open PR lookup | OBSERVED `6b082e5`, W3.C merged; open PR отсутствовал | Snapshot на старте, заново проверить перед G2 |
| Canon `gh api repos/Endevor-VIK/AXS_CANON_V3/branches/main --jq .commit.sha` | OBSERVED `3884ea43e125ddd39b18c80f91cc40310dd65e9f` | SSH fetch failed authorization; API verification successful |
| `git diff --name-only b53350e 6b082e5 -- index.html assets tests` | PASS: пустой runtime/test diff | Старые browser results остаются историческими, не rerun |
| `python3 tests/smoke_showcase.py` | PASS / SOURCE STRUCTURE | Только статическая структура/ссылки/assets |
| `python3 tests/smoke_showcase_v23.py` | SOURCE PASS: 13 named sections, 8 screens, 6 map nodes, 4 flow controls | Не проверяет браузерную раскладку/keyboard/latency |
| Три независимых read-only research scope | Inventory, Canon sources, WORK/SYSTEM overlap получены и сверены Lead | Не Principal acceptance, не user study |
| Docs scope, links, directive integrity, protected hashes | Проверить/зафиксировать в delivery trace | Доказательство только docs-only scope, не будущей G2 визуальной сохранности |

Полные точные команды лёгких проверок и их вывод сохраняются в `G0_VALIDATION.txt` рядом с отчётом. Delivery commit указан в handoff и remote Draft PR. Ветка W4 не запускает live checkout/server `:8787` или `prod-starter-rs`; browser/server processes не создавались.

## 2. Исторические доказательства и незакрытая задолженность

W3.C report/evidence на QA `b53350e` содержит agent-run Chromium 141 **116/116** дважды, smoke, axe 0, contrast 28/28. Этот G0 их не переисполнял. W3.C **Firefox, WebKit/Safari, real devices/GPU, manual keyboard и screenreader NOT RUN**. W2.R Firefox PASS не покрывает добавления W3.C.

Исторический paired Lighthouse: mobile Performance median 97→96, mobile LCP 2.10→2.56 s, desktop 100→100 и FCP/LCP +≈0.15–0.2 s; +≈3.7 KB gzip render-blocking CSS. Это направление долга, а не W4 measurement. W4 сравнивается с заново измеренным **6b082e5**, не с идеальными старыми числами.

W01/plates/W07 — genuine originals 1672×941; историческая desktop Retina sharpness ≈0.59–0.62, принятая CREATOR для W3.C. W03 sharp благодаря inset ≤820 px. W4 не меняет artwork и не выдаёт upscale за новый master. Если layout увеличит исходную площадь или ухудшит ratio, это новая регрессия, которую прошлое исключение не разрешает автоматически.

## 3. G3 — обязательная будущая матрица

| Измерение | Требование | Сейчас |
| --- | --- | --- |
| Desktop | 1920×1080, 1440×900, 1366×768 | NOT RUN |
| Tablet | 1024×768, 768×1024 | NOT RUN |
| Mobile | 390×844, 360×800 | NOT RUN |
| Engines | Chromium, Firefox, WebKit, exact versions | NOT RUN |
| Modes | ordinary/reduced motion, no JS, keyboard only, 200% actual browser zoom и short landscape | NOT RUN |
| Screenreader | semantic audit: landmarks, heading order, quote attribution, disclosure names, reading order; реальный SR walkthrough отдельно | NOT RUN |
| Images | currentSrc / sizes / fit / DPR, no duplicates, lazy behavior, focal crop, over-art contrast | NOT RUN |
| Scroll/anchors | menu WORLD→W01, entry CTA, 5 trail anchors, `#modules`, protected OMEGA return, W07→VISION, focus visibility under chrome | NOT RUN |
| Overflow | `scrollWidth ≤ clientWidth + 1` по сценам/странице; текст не clipped/hidden | NOT RUN |
| Performance | identical environment interleaved baseline/after runs, mobile + desktop | NOT RUN |

Viewport×engine cross-product обязателен для layout/overflow/navigation. Retina DPR2 desktop/tablet и DPR3 mobile samples дополнительно; detailed AT/keyboard journeys на репрезентативных конфигурациях фиксируются явно, не подразумеваются через automation.

Harness сейчас импортирует только `chromium, firefox`: WebKit исполнения пока **нет**. После Gate A добавить реальный WebKit путь/эквивалентный runner; не помечать отсутствующий engine PASS. Наличие browser binary проверить до download и только после нового host disk guard. Нет принципиального требования спрашивать разрешение на обычную установку инструмента, если ресурсы/политика допускают её; отсутствие исполнения остаётся NOT RUN.

## 4. Воспроизведение и scoped regression contract

Исходные лёгкие проверки из изолированной ветки:

```bash
python3 tests/smoke_showcase.py
python3 tests/smoke_showcase_v23.py
```

Существующий browser runner сам поднимает ephemeral localhost server на свободном порту; запускать на отдельном immutable worktree/snapshot, `NODE_PATH` указывает на уже имеющуюся Playwright установку:

```bash
NODE_PATH=<existing-playwright-node_modules> node tests/browser/showcase_regression.cjs --firefox --json <owned-scratch>/regression.json
```

Для apples-to-apples performance baseline/after использовать одинаковые Pages-like gzip/cache/404/MIME servers; `.avif` отдаётся как `image/avif`. Параметры cold cache, viewport/DPR, CPU/network и loader/storage state — в manifest. Старые bare-server numbers не смешивать с gzip measurements.

До первой G2 mutation снять свежий BEFORE на 6b082e5. После каждого bounded slice — targeted checks; после заморозки runtime — полная матрица и G4 independent recheck. Полный прогон не повторять без изменения/ошибки/неразрешённого сомнения.

**Сохранить действующие проверки:** один WORK archive, 8 tabs/panels/trigger sources, FIT/1:1 extents и focus return, keyboard/swipe/no-JS, карты R39/R40/R42, six IDs, OMEGA descent/selection/focus, palette/fonts/status/anchors.

**Адаптировать только изменённый контракт:** R-W3C-01 order/trail/plates под одобренные labels, не удаляя проверки map/OMEGA/characters. Новый scoped check подтверждает absence product demo в WORLD, наличие контекста в WORK 02/03/05, provenance и отсутствие fake telemetry. Static smoke literal `CONCEPT ART` ban не мешает подписи «КОНЦЕПТУАЛЬНАЯ СХЕМА»; обязательную visitor provenance не скрывать ради старого теста.

**Preservation proof:** source slices `#world`, `#chars` и AXIOM ∅, map dataset/handler, source asset hashes, 8 capture sets. Если CREATOR отдельно разрешит два внешних labels, сравнивать protected internals отдельно и записать exact исключённые text nodes. Пустой source diff дополнить computed-style/visual/behavior checks: общий CSS может регрессировать protected область без правки её HTML.

**Performance acceptance, proposed for Gate A:** ≥5 interleaved baseline/after pairs на desktop/mobile, medians + spread для LCP/CLS/TBT/transfer; mobile perf ≥90, desktop ≥95 как floors, без необъяснённой регрессии к реальному W3.C baseline. LCP regression >10% и >150 ms или CLS рост >0.02 — investigation threshold, не waiver; при шуме исправить метод измерения до вывода. Существующий mobile LCP debt 2.56 s не становится PASS цели ≤2.5 s. INP field без данных не заявлять; lab interaction proxy отдельно. Новых critical-path media/fonts нет в плане; скрытием контента score не улучшать.

## 5. Independent recheck и remaining risks

| Item | Статус / owner |
| --- | --- |
| G0/G1 consistency recheck | Перед delivery — отдельный read-only reviewer; его findings/исправления фиксируются ниже |
| G4 code/visual/Canon recheck | NOT RUN, после G2/G3; reviewer не автор runtime patch |
| Gate A | PENDING CREATOR / Principal — обязательная остановка до существенной реализации по директиве §10 |
| Protected III/IV labels | HOLD до отдельного explicit разрешения; основной G2 может оставить их исходными |
| NEURA lifecycle и полная идеология | Canon/source debt; в предложенном тексте нет решения противоречия, подробной новой идеологии |
| Retina master | Existing source limit; истинные ≥3344 px masters нужны для полного high-DPR source ratio |
| Реальные устройства/Safari/SR | В G3 выполнить доступное, оставшиеся NOT RUN передать на Gate B с конкретным риском |
| Draft PR | Docs-only предложение для Gate A; не final implementation PR acceptance |
| Merge/deploy | HOLD; нет автоматического действия по прошлому W3.C approval |

### G0/G1 reviewer record

PENDING на момент составления. Scope recheck — документы, trace и boundaries; runtime/visual quality не проверяются. Финальный record привязывается к reviewed commit/tree и не считается CREATOR или Principal Gate A.

**Разделение handoff:** IMPLEMENTED — G0/G1 пакет документов; VERIFIED — source baseline/smoke/provenance checks по §1; NOT VERIFIED — W4 visual/runtime/browser/performance; CREATOR DECISION REQUIRED — Gate A и необязательные protected-label exceptions; BLOCKED — технической блокировки аудита нет, действует запрошенный review gate.
