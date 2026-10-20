<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4.WORLD_QA_REPORT
  title: "0524.W4 — G3/G4 measured QA and residuals"
  status: G3_EXECUTED / G4_FINAL_PENDING / GATE_B_PENDING
  deployment: NOT_DEPLOYED
  mode: QA report / reproducibility contract
  goal: "Зафиксировать реально исполненные G3/G4 checks, baseline failures и границы evidence"
  scope: 0524.W4 frozen implementation / G3 / G4
  lang: ru
  last_updated: 2026-10-20
  editable_by_agents: true
  change_policy: "PASS только по исполненному check на exact SHA; review не заменяет Gate A/B"
-->

# WORLD — G3 / G4 QA

**Runtime/test freeze:** `b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5`. **BEFORE:** `6b082e5f262c09a123748273da42277d3a29a6c2`. G2 реализован по [Gate A R1–R6](W4_GATE_A_ACCEPTANCE.md); Gate B PENDING. Этот отчёт разделяет выполненные проверки, исходные failures и неподтверждённые области. Он не является CREATOR visual acceptance или разрешением merge/deploy.

[Implementation / Steps A–E](W4_IMPLEMENTATION_REPORT.md) · [полные BEFORE/AFTER пары](WORLD_BEFORE_AFTER.md) · [независимый G4](W4_G4_REVIEW.md) · [evidence index](../../evidence/w4/README.md).

## 1. Sources / reproducibility

| Объект | Exact state |
| --- | --- |
| Accepted G0/G1 / PR11 | `af20ff6be8909b641070003795ff13ffadc334fd`; PR11 не менялся и не сливался |
| Landing main / BEFORE | `6b082e5f262c09a123748273da42277d3a29a6c2` |
| Implementation/test freeze | `b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5`; последующие commits — reporting/evidence только |
| Canon source | `3884ea43e125ddd39b18c80f91cc40310dd65e9f`, read-only; [trace](WORLD_CANON_TRACE.md) |
| Runtime delta | `index.html`, 86 добавленных scoped CSS lines; app JS/fonts/media неизменны |
| Isolation | Отдельные worktrees, ephemeral localhost; main checkout и production runtime не использовались |

BEFORE завершён **19.10 17:04:36 UTC**, первый runtime commit S1 — **17:07:03 UTC**. [Chronology](../../evidence/w4/qa/baseline-chronology.json) и retained manifest закрепляют source trees/хэши. Первичный lab baseline n=1 также снят до правок; он отдельно сохранён и не смешивается с последующими paired medians.

Исторические G0/G1 source validation и независимый review сохранены в [принятом af20ff6 QA record](https://github.com/Endevor-VIK/endevor-vik.github.io/blob/af20ff6be8909b641070003795ff13ffadc334fd/docs/showcase-v031/waves/w4/WORLD_QA_REPORT.md), `G0_VALIDATION.txt` и Git history. Их прежние NOT RUN/Gate A PENDING описывали ту стадию, а не текущую.

## 2. Executed matrix / scope

| Проверка | Результат | Proof / граница |
| --- | --- | --- |
| BEFORE matrix | **327 checks / 0 failed**, 702 frames | [manifest](../../evidence/w4/before/manifest.json), 455 frames сохранены до правок |
| AFTER standard matrix | **1656 checks / 0 failed**, 782 frames | [manifest](../../evidence/w4/after/manifest.json), 541 frames сохранён; source b85fbb0 |
| Static smoke ×2 | PASS | [source smoke](../../evidence/w4/qa/smoke-showcase.txt), [v23 smoke](../../evidence/w4/qa/smoke-v23.txt); только source claims |
| Exact source preservation | PASS | [preservation.json](../../evidence/w4/qa/preservation.json):8 неизменных sections,8 real screenshot figures, порядок,187 assets; JS/images/fonts unchanged |
| Protected computed styles/geometry | **21/21 comparisons PASS** | По20 selectors: width/height и17 computed properties; полный source map/chars и handler hashes совпадают |
| Gallery / anchors / OMEGA | PASS в standard matrix |8screens, real1:1 zoom/focus return; anchors/unique IDs; menu jumps; six Canon IDs; keyboard return02.05 |
| Accessibility automation | **24 axe runs / 0 violations** |6 page +18 open-context samples; incomplete color-contrast во24, aria-prohibited-attr в6 — не скрыты |
| Native WORK interactions | PASS | Enter/Space, footer Tab/Shift+Tab, touch без смены screenshot, closed secondary height, no-JS details; meaningful labels≥12px |
| Reduced/ordinary/no-JS | PASS scoped | Native RM/SMIL pause; normal OMEGA reveal и0infiniteCSS/SMIL у новых схем; content/disclosures доступны без app JS |
| DPR/image samples | PASS с source exception | DPR2 1440desktop/768tablet, DPR3 390mobile для каждого engine; W03 ratio≥.95; W01 Retina softness отмечена ниже |
| Legacy regression | **230 PASS / 2 FAIL / 0 SKIP** | Два исходных HERO defects воспроизведены BEFORE/AFTER3×; не превращены в PASS |
| Actual browser200% zoom | **AFTER18/18 PASS** |31 checks всего /1 BEFORE fail;9 usable native reading frames, [manifest](../../evidence/w4/qa/native-zoom/manifest.json) |
| Short landscape844×390 | Исходный first-frame CTA limit, доступность PASS | Узкое восстановление6 BEFORE/AFTER samples,3engine; [manifest +18frames](../../evidence/w4/qa/landscape-recovery/manifest.json) |
| Independent risk browser | **13/13 PASS** | Reviewer Chromium149360×800: disclosures,8shot viewer, map/focus, visible attribution,0pageerrors; record в G4 |

Standard cross-product: **1920×1080,1440×900,1366×768,1024×768,768×1024,390×844,360×800 × Chromium149.0.7827.55 / Firefox151.0 / WebKit26.5**. Primary native captures DPR1/reduced motion. Дополнительные modes/DPR помечены отдельно; разные DPR не выдаются за одинаковую пару. Playwright1.61.1, axe4.12.1, Node22.23.1, Pillow12.2; точное окружение и runner SHA256 — в manifests.

24axe runs не дают blanket WCAG/SR certification. `aria-prohibited-attr` incomplete относится к исходному generic `div#showcase-gallery[aria-labelledby]`; role в W4 не менялся. Nativezoom supplementary axe записал0violations и incomplete items с node targets. Контраст поверх art, reading hierarchy и body legibility дополнены source/visual review, но human NVDA/VoiceOver walkthrough не выполнен.

## 3. Literal failures / recovery / visual proof

**Legacy:** [raw JSON](../../evidence/w4/qa/legacy-regression.json), [console](../../evidence/w4/qa/legacy-regression.log), [paired narrow reproduction](../../evidence/w4/qa/legacy-narrow-baseline-comparison.json).

- Chromium1024×768: `R-W3A-02-poster-frame` bottom771 при viewport768. HeroGeom совпал BEFORE/AFTER во всех3 повторах; CTA/rail/byline/radar внутри рамки.
- Firefox720×450@2: `R01-no-h-overflow` scrollWidth722/clientWidth720 на обеих версиях сразу load и после fonts+400ms. Источник — исходный HERO `span.ax-gate-date` right722.1; W4 его не менял.

**Landscape:** после WORLD menu jump CTA находится top834–835/bottom882–883 при viewport390. Это одинаковый предел первоначальной композиции обеих версий во всех3engine. Один настоящий Tab или обычная прокрутка выводят CTA целиком в198–246px, focus/hit-test успешны. Шесть исходных first-frame conditions сохранены как failures; это не clipped/unreachable control. Полный дополнительный transient landscape run до рестарта утрачен; узкий recovery **не выдаётся за восстановленные364 checks**. Основные BEFORE/AFTER matrix manifests и996 selected frames не утрачены.

**Native200%:** headed Chromium/Xvfb, `chrome.tabs.setZoom/getZoom=2`, actual DPR2/visualViewport.scale1, inner959×496, physical1919×992. Это browser page zoom, без CSS zoom, pinch или подмены viewport. AFTER prose/context assertions и все выбранные native images читаемы. Единственный remaining baseline assertion —25px word overflow в старой fragment-прозе, снятой W4. [Before reading](../../evidence/w4/qa/native-zoom/before-black-sun-reading.jpg) / [after reading](../../evidence/w4/qa/native-zoom/after-black-sun-reading.jpg) / [attribution](../../evidence/w4/qa/native-zoom/after-archive-attribution-reading.jpg).

**G4-F01:** первая попытка native capture дала8 одноцветных JPEG, хотя DOM metrics были доступны. [Failed attempt](../../evidence/w4/qa/native-zoom-attempt1/manifest.json) и exact helper snapshot сохранены. Исправлен QA capture path: foreground, software rendering и direct native CDP без clip; добавлен guard на непустой кадр, SHA256. Новых runtime edits не было. G4 лично повторно просмотрел corrected reading frames; итог — в независимом record.

**Qualification before freeze:**11px meaningful concept labels вызвали6 failures на8816036. [Manifest](../../evidence/w4/qualification/after-8816036.json) сохранён; исправление12px/faction body16px —e801c50, затем frozen full matrix выполнена заново.

**Protected pixels:** [84-pair diagnostic](../../evidence/w4/qa/protected-pixel-diagnostic.json),0missing,24 raw exploratory threshold exceedances. Raw/low-pass stats отражают lossy/subpixel различия; thresholds exploratory, **не acceptance gate**. Exact source, computed dimensions/styles, behavior и независимые реально просмотренные пары не выявили W4 protected regression. Pixel identity не заявлена.

## 4. Paired lab performance

**PENDING: окончательный quiet-CPU performance gate.** Чужая браузерная работа не позволила квалифицировать первый набор; guarded повтор пока не прошёл preflight.

Первый20-observation attempt полностью сохранён как **OBSERVED / CONTAMINATED / NOT QUALIFIED FOR QUIET CPU**: чужие browser/build jobs появились после чистого preflight. Его числовые scores не являются финальным performance gate. Повтор выполняется целиком, без выборочного удаления samples. Заранее задан guard:15×1s preflight aggregateCPU<10%/8cores, нет foreignbrowser/build; monitor1s во время run, foreignbrowser/build либо foreignCPU>100%onecore2samples подряд дисквалифицируют whole attempt и останавливают только собственный runner. Чужие процессы не завершаются.

Метод: одинаковый URL и Pages-like gzip/cache/MIME/404 server, fresh Linux Chrome/profile на observation, стандартные mobile/desktop LH configs, simulated throttling, cold storage/первый визит. `index.html/404/loader/assets` —190 файлов каждого arm сверяются до/после с exact SHA. Ни visibility tricks, ни принудительного reduced motion для score нет. Full Lighthouse JSON transient, summary включает все raw per-run metrics/medians/spread/deltas/source manifests. Lighthouse12.8.2/Chromium149. [Method/reproduction](../../evidence/w4/tools/PERF_RUNNER.md).

Budgets согласованного contract: mobileperf≥90, desktop≥95; investigate LCP regression **>10% и >150ms** либо CLSdelta>.02. Initial baseline n=1 mobileLCP2.565s — существовавший lab target debt, не PASS≤2.5s. Field INP/CWV не измерены.

## 5. Independent review / residuals / release boundary

**Source/Canon/visual review и13/13 independent browser checks выполнены.** Финальный G4 verdict ожидает квалифицированный performance; [review record](W4_G4_REVIEW.md).

Не выполнены: реальные телефоны/tablets/GPU, Safari, human NVDA/VoiceOver walkthrough, field INP/CWV, production Pages QA. Headless WebKit — проверенный engine, не реальный Safari. Оригинальные1672px W01/plate/epilogue masters мягче на широких high-DPR дисплеях; ≥3344px source masters требуют CREATOR. W03 не имеет этого source-ratio failure.

III/IV external labels, карта/OMEGA и characters/AXIOM∅ остаются HOLD. NEURA lifecycle/полная идеология не установлены, landing их не разрешает. Предыдущие legacy HERO limits передаются отдельно. Gate B/merge/deploy/Canon/protected scope требуют отдельных решений CREATOR.

## 6. Reproduction / retained storage

```bash
python3 tests/smoke_showcase.py
python3 tests/smoke_showcase_v23.py
python3 tests/check_w4_preservation.py
NODE_PATH=<existing-node-modules> node tests/browser/w4_qa.cjs \
  --root <isolated-b85fbb0-worktree> --phase after \
  --out /tmp/axs-0524-w4-qa/after-reproduction \
  --baseline-root <isolated-6b082e5-worktree> \
  --compare docs/showcase-v031/evidence/w4/before/manifest.json
NODE_PATH=<existing-node-modules> node tests/browser/showcase_regression.cjs \
  --firefox --json <owned-scratch>/legacy.json
```

Additional native zoom/landscape и performance commands: [toolsREADME](../../evidence/w4/tools/README.md), [PERF_RUNNER](../../evidence/w4/tools/PERF_RUNNER.md). Фиксировать actual refs и source hashes; не использовать основной checkout/live port8787. Existing legacy suite ожидаемо сохраняет два описанных baseline failures на текущем окружении.

Primary retained evidence:455BEFORE+541AFTER originals, full central scenes/WORK states, all21 combinations; каждый сохранённый frame проверен по SHA256. Nativezoom retained9 reading frames из17, весь check log сохранён; main frames не ретушированы/склеены. Browser profiles/videos/traces не сохраняются. Own transient runs — max3/14days при записи, ограниченный log/capture budget; required artifacts немедленно копируются в durable evidence, общий budget<50MiB. Windows host guard проверяется перед heavy work; Linux df не заменяет host number. Source worktrees и rootless dependencies удаляются только при доказанном ownership после G4; browser cache/чужие процессы и project data сохраняются.
