<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.R3_REPORT
  title: "R3 — executor-run verification of the W4.R R2 runtime b6040e3"
  status: R3_EXECUTOR_RUN / PASS_WITH_RECORDED_LIMITS / PERFORMANCE_BLOCKED_HOST_DISK / R4_PENDING
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# R3 — проверка runtime R2 (исполнитель: Opus)

```text
R3 EXECUTOR-RUN — PASS WITH RECORDED LIMITS (not the independent R4)
Runtime freeze: b6040e3cbd110b807c5a33d6cccf4b52f7b05ed7 = R2.3 8815f17 + R3 fit fixes D-04/D-05 (CSS only)
Product base: b85fbb0a   Art baseline: A+AD 9cf78b0   PR #12 (w4/world-narrative), Draft
Engines: Chromium 149.0.7827.55 · Firefox 151.0 · WebKit 26.5 (rootless WPE)
BLOCKED: paired performance vs b85fbb0a — host disk CRITICAL at start (C: 14.15 GiB / 2.97 %)
```

## Результаты

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

## Что R3 нашёл и исправил

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

- Производительность — BLOCKED, см. выше.
- Физические устройства (свайп на телефоне, Safari iOS), screen reader, полевые данные.
- Независимый R4 — по брифу [R4_INDEPENDENT_BRIEF](R4_INDEPENDENT_BRIEF.md).

Это R3 исполнителя. Независимым PASS он не является.
