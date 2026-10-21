<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.OPUS_REVIEW_R2_2
  title: "R2.2 — WORK / FOUR SURFACES — Opus SELF-CHECK"
  status: SELF_CHECK_PASS (executor, not independent) / R3_R4_PENDING
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# R2.2 — WORK / FOUR SURFACES — SELF-CHECK

```text
OPUS SELF-CHECK R2.2 — PASS (executor and art director; NOT an independent PASS)
Implementation SHA: 44467477b51bb52104e632160f48ed8642dc7894 (w4/world-narrative, PR #12)
Art baseline: 9cf78b0 (A+AD)   Previous stage: e651c63 (R2.1)   Product base: b85fbb0a
Checked: text / SVG / geometry (4 viewports) / untouched sections / protected source / real archive / rails / index / RM / axe / regression
Deviations: none new (D-01 from R2.1 remains)
Required changes: none
Not an R3/R4 verdict; Gate B remains CREATOR.
```

## Что внедрено

`#work` — дословно из `ad.html @9cf78b0` (`build_r2.py --stage 2`). Реальный архив (8 figures, 8 cases, viewer) побайтно как в `b85fbb0a`. Три упрощённых раскрытия W4 02/03/05 заменены четырьмя полными исходными композициями. Экспозиция «ЭТЮДЫ ВИЗУАЛЬНОГО ЯЗЫКА» стоит после viewer и перед `#work-intro`. SYSTEM не тронут. В `showcase-w4r.css` добавлены правила WORK (317 из 329).

В `tests/smoke_showcase.py` метка W4 «КОНЦЕПТУАЛЬНАЯ СХЕМА» заменена эквивалентами A+AD: «SURFACE STUDIES / ЭТЮДЫ ИНТЕРФЕЙСОВ», «художественная визуализация», «снимков реальных интерфейсов проекта». Добавлен запрет на возврат фиктивных статусов исходных модулей (`20 ENTRIES`, `PING_`, `DRAFT · v0.12`, `CHR-WHITE-CONTOUR`).

## Результаты (SELF-CHECK)

| Проверка | Результат |
| --- | --- |
| Стадийная самопроверка, `--ref 4446747` | **54/54** — [stage-check.json](../../evidence/w4r2/r2.2/stage-check.json) |
| Высота `#work` vs A+AD, 1440 / 1920 / 390 / 360 | Δ = **0,00 px** |
| Текст и SVG-геометрия `#work` vs A+AD | Совпадают |
| Нетронутые секции (SYSTEM, WORLD, CHARACTERS, FACTIONS, VISION) vs `b85fbb0a` | Высоты равны во всех viewport |
| Лента этюдов | no-JS и JS на 390 / 360: нативная прокрутка, ничего не скрыто; клавиатура и touch доходят до всех четырёх модулей; высота карточек одна (766 px на 390); подвалы без побуквенного переноса |
| Индекс | Без JS — четыре рабочих якоря. С JS — переход к WATCH_DOG прокручивает ленту без прыжка страницы, `aria-current` на 04. Цели ≥ 44 px |
| Desktop 1440 | Сетка 2×2, ленты и кнопок нет; экспозиция после viewer и перед `#work-intro`; раскрытий W4 нет |
| axe, `#work` | 0 violations. Incomplete одинаковы с эталоном A+AD: `aria-prohibited-attr` 1 и color-contrast 170 (1440) / 100 (390) |
| Источник | `check_w4_preservation.py`, `smoke_showcase.py`, `smoke_showcase_v23.py` — PASS |
| Регрессия Chromium + Firefox | **230 PASS / 2 FAIL** — [JSON](../../evidence/w4r2/r2.2/regression-chromium-firefox.json). Оба FAIL — базовые долги HERO `W4-DEBT-HERO-01/02` (151/771, 722/720), итог идентичен W4 и R2.1 |

## Художественная самопроверка

Кадры: последовательные нативные кадры окна `impl-{1440,390,360}-work-NN` и каждый модуль ленты на 390 ([captures](../../evidence/w4r2/r2.2/captures/)); метод — как в R2.1, прежние кропы в истории git (`2bc5fc4`). Сверены с эталонными `evidence/w4ad/captures/{ad-1440-surfaces, ad-390-surfaces*}`. Четыре исходные композиции (орбита, досье, маршруты, радар) целы: рамки, углы, SVG и подвалы на месте. Индекс и ленты выглядят как утверждённые. Отличий от A+AD нет.

## Не проверено на этой стадии

WebKit, zoom 200 %, физические устройства, screen reader, производительность — R3 после R2.3, затем независимый R4.
