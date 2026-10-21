<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.R3_REPORT
  title: "R3 — executor-run verification of the W4.R R2 runtime (final 685140a)"
  status: R3_EXECUTOR_RUN / PASS_WITH_RECORDED_LIMITS / PERFORMANCE_PASS_17_OF_17 / R4_PENDING
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# R3 — проверка runtime R2 (исполнитель: Opus)

## Финальный runtime `685140a` (повтор R3 после D-06)

```text
R3 EXECUTOR-RUN — PASS WITH RECORDED LIMITS (not the independent R4)
Runtime: 685140a40e55f151f9edcf9e7ab0170773ad4f55 = b6040e3 + D-06 (showcase-w4r.css без блокировки первой отрисовки)
build_r2.py --stage 3 в чистом worktree 685140a воспроизводит дерево побайтно
```

| Проверка на `685140a` | Результат | Доказательство |
| --- | --- | --- |
| Матрица 3 движка × 10 размеров | **225/225** (Chromium 82, Firefox 72, WebKit 70, сводная 1) | [r3-matrix.json](../../evidence/w4r2/r3-685140a/r3-matrix.json), хэши кадров `matrix-shots.sha256` |
| Клавиатура WebKit: обе ленты, с JS и без, 390/360, 5 повторов | **40/40 достижимо**; только вперёд — **39/40**: нестабильный первый шаг клавиатуры WebKit воспроизводится (1 из 40) | [r3-webkit-keyboard.json](../../evidence/w4r2/r3-685140a/r3-webkit-keyboard.json) |
| Проход ширин 320–1920 | **0 сбоев** во всех трёх движках | [r3-overflow-sweep.json](../../evidence/w4r2/r3-685140a/r3-overflow-sweep.json) |
| Zoom 200 % (headed Chromium, Xvfb) | **22/22** | [r3-native-zoom.json](../../evidence/w4r2/r3-685140a/r3-native-zoom.json), [кадры](../../evidence/w4r2/r3-685140a/zoom200/) |
| Регрессия Chromium + Firefox | **230 / 2** — только `R-W3A-02-poster-frame-1024x768` (Chromium) и `R01-no-h-overflow-720x450@2` (Firefox) = долги HERO `W4-DEBT-HERO-01/02`, остаются FAIL | [JSON](../../evidence/w4r2/r3-685140a/regression-chromium-firefox.json) |
| Самопроверки стадий `--final` | R2.1 **61/61**, R2.2 **46/46**, R2.3 **47/47** | `r3-685140a/stage{1,2,3}-final-check.json` |
| **Производительность** против `b85fbb0a`, бюджеты [R3P_PERF_BUDGETS](R3P_PERF_BUDGETS.md), 40 наблюдений без исключений | **17/17 PASS**. Mobile LCP AFTER — медиана **2 491,7 мс при пороге 2 500 мс: запас 8 мс**, это узкий проход | [perf/685140a](../../evidence/w4r2/perf/685140a/) |

Замер `b6040e3` дал FAIL B2 (mobile LCP 2 558 мс) — сохранён как есть: [perf/b6040e3-budget-fail](../../evidence/w4r2/perf/b6040e3-budget-fail/). Причина — новый блокирующий стиль; исправление D-06 ([OPUS_DECISIONS](OPUS_DECISIONS.md)). На `685140a` `showcase-w4r.css` в списке блокирующих ресурсов Lighthouse отсутствует, элемент LCP прежний — подпись HERO, в обоих вариантах.

Оговорки замера: load хоста во время прогона — медиана 3,74 (2,43…6,41), фон VS Code / codex / rust-analyzer, не принадлежит задаче; на `b6040e3` load был ~1,2. Медиана mobile LCP BEFORE в обоих замерах одинакова (2 408 / 2 411 мс), так что окружение сопоставимо, но порог B2 проходится с запасом в 0,3 %. Это лабораторные данные, не полевые.

Ниже — исходный R3 на `b6040e3`; с тех пор изменился только `index.html` (D-06).

## Исходный R3 на `b6040e3`

```text
R3 EXECUTOR-RUN — PASS WITH RECORDED LIMITS (not the independent R4)
Runtime freeze: b6040e3cbd110b807c5a33d6cccf4b52f7b05ed7 = R2.3 8815f17 + R3 fit fixes D-04/D-05 (CSS only)
Product base: b85fbb0a   Art baseline: A+AD 9cf78b0   PR #12 (w4/world-narrative), Draft
Engines: Chromium 149.0.7827.55 · Firefox 151.0 · WebKit 26.5 (rootless WPE)
BLOCKED at that time: paired performance (host disk) — later run: FAIL B2 on b6040e3 → D-06 → PASS on 685140a (above)
```

### Результаты

| Проверка | Результат | Доказательство |
| --- | --- | --- |
| Матрица: 3 движка × 10 размеров (1920 … 320, 844×390). Сравнение с A+AD и `b85`, защищённая геометрия, no-JS, клавиатура по каждой карточке лент, кнопки, RM, A08, axe | **224/225**. Единственный FAIL: WebKit, без JS, 390, лента этюдов — первое ArrowRight сдвинуло ленту на 1 px, второе перескочило карточку 1. Повторено 1 раз из 6; CSS ленты на 390 не менялся | [r3-matrix.json](../../evidence/w4r2/r3/r3-matrix.json) |
| Дополнение WebKit: обе ленты, с JS и без, 390/360, 5 повторов, вперёд и назад | **40/40 достижимо**, 40/40 даже при проходе только вперёд | [r3-webkit-keyboard.json](../../evidence/w4r2/r3/r3-webkit-keyboard.json) |
| Проход ширин 320–1920 px (Chromium шаг 2, Firefox 4, WebKit 8): ни один текст изменённых секций не выходит из своего блока, текст WORLD — в рамке W04, нет горизонтального переполнения | **0 сбоев** в 1 403 ширинах | [r3-overflow-sweep.json](../../evidence/w4r2/r3/r3-overflow-sweep.json) |
| Настоящий zoom 200 % (headed Chromium под Xvfb, `chrome.tabs.setZoom(2)`; DPR 2, visualViewport 1, 959×496) | **22/22**: перекомпоновка без вылетов в BEFORE и IMPLEMENTED, 8 нативных кадров чтения | [r3-native-zoom.json](../../evidence/w4r2/r3/r3-native-zoom.json), [кадры](../../evidence/w4r2/r3/zoom200/) |
| Регрессия Chromium + Firefox (`tests/browser/showcase_regression.cjs`) | **230 / 2**: только базовые долги HERO `W4-DEBT-HERO-01/02`, итог как у W4 | [JSON](../../evidence/w4r2/r3/regression-chromium-firefox.json) |
| Самопроверки стадий на финальном runtime (`--final`): тексты, SVG, высоты vs A+AD в 1440/1920/390/360, рамка W04, ленты | R2.1 **61/61**, R2.2 **46/46**, R2.3 **47/47** | `stage{1,2,3}-final-check.json` |
| axe (WCAG 2.0/2.1 AA), все пять изменённых секций, Chromium и Firefox, 1440/390 | 0 violations. Incomplete: color-contrast 336/288 и `aria-prohibited-attr` 1 (исходный `div#showcase-gallery[aria-labelledby]`) | `r3-matrix.json` |
| Источник: `check_w4_preservation.py`, smoke-тесты, сборщик `build_r2.py` (продукт = A+AD с точностью до путей) | PASS | [R3_CANON_TRACE](R3_CANON_TRACE.md) |
| Canon и реальные интерфейсы | Canon не менялся (read-only `3884ea43`); 8 скриншотов, кейсы и viewer побайтно как в `b85fbb0a`; трасса каждого нового утверждения | [R3_CANON_TRACE](R3_CANON_TRACE.md) |
| Визуально BEFORE / A+AD / IMPLEMENTED | Нативные кадры Chromium BEFORE/IMPLEMENTED 1440/390 по всем изменённым секциям, контрольные кадры Firefox/WebKit, эталон A+AD | [frames](../../evidence/w4r2/r3/frames/), `evidence/w4ad/captures/` |
| Размер PR и сохранность доказательств | 1 778 файлов / 78,3 МиБ, из них продукт < 1 МиБ; решение о размещении перед merge — за CREATOR | [R3_PR_SIZE_AUDIT](R3_PR_SIZE_AUDIT.md) |
| **Производительность против `b85fbb0a`** | **BLOCKED.** На старте свободно 14,15 ГиБ на C: (2,97 % < 5 % — CRITICAL); утром было 49,9 ГиБ. Падение не объясняется файлами задачи (scratch 182 МБ). Корни подготовлены, раннер проверен `--check`; запускается одной командой после восстановления места | — |

### Что R3 нашёл и исправил

Все дефекты унаследованы от прототипа A+AD: он не проверялся на этих ширинах. Исправлены записанными отклонениями, только в CSS; разметка равна A+AD.

| ID | Найдено | Исправлено |
| --- | --- | --- |
| D-02 (R2.3) | 320–338 px: русская строка WORLD в две строки, текст выходит из рамки W04 | Шаги кегля при ≤ 380 / ≤ 340 px |
| D-03 (R2.3) | Метка WORLD GRID 11 px < минимума 12 px (W3.C) | 12 px на мобильном |
| D-04 (R3) | 764–~870 px: текст терминала налезал на кольцо; 764–1276 px: строка состояния вылезала из ячеек | Терминал на 761–1100 px: текст, кольцо и список. На 1101–1280 px строка состояния переносится. Трёхзонный архив сохранён |
| D-05 (R3) | 320–364 px: `CARTOGRAPHY` вылезал из подвала этюда | Отступы и кегль подвала при ≤ 380 px |

Неудачные и неполные попытки сохранены в [qualification](../../evidence/w4r2/r3/qualification/):
- проверка no-JS была слишком грубой — считала скрытые штампы секций, как и у `b85`;
- WebKit завис на `img.decode()`;
- WebKit засчитывал ленивые изображения как битые — тот же набор, что у `b85`;
- проход ширин без прогрева давал артефакт первого шага.

Отдельно сохранена первая матрица и zoom на `8815f17`: этот zoom нашёл D-04.

## Не проверено

- Физические устройства (свайп на телефоне, Safari iOS), screen reader, полевые данные.
- Независимый R4 — по брифу [R4_INDEPENDENT_BRIEF](R4_INDEPENDENT_BRIEF.md).

Это R3 исполнителя. Независимым PASS он не является.
