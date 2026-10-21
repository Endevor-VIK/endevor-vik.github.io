<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.OPUS_REVIEW_R2_3
  title: "R2.3 — WORLD GRID / CHARACTERS — Opus SELF-CHECK"
  status: SELF_CHECK_PASS (executor, not independent) / R3_R4_PENDING
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# R2.3 — WORLD GRID / CHARACTERS — SELF-CHECK

```text
OPUS SELF-CHECK R2.3 — PASS (executor and art director; NOT an independent PASS)
Implementation SHA: 8815f17d5bdcf407769a3c03da5c72e264d95436 (w4/world-narrative, PR #12) — runtime candidate for R3
Art baseline: 9cf78b0 (A+AD)   Previous stages: e651c63 (R2.1), 4446747 (R2.2)   Product base: b85fbb0a
Checked: text / geometry (4 viewports) / W04 frame / untouched sections / protected source / axe / regression / 320–430 px sweep
Deviations: D-02 (WORLD heading steps down at ≤380 / ≤340 px), D-03 (WORLD plate label 12 px on mobile) — OPUS_DECISIONS.md
Required changes: none open
Not an R3/R4 verdict; Gate B remains CREATOR.
```

## Что внедрено

Внешние заголовки и вводные `#world` и `#chars` — дословно из `ad.html @9cf78b0` (`build_r2.py --stage 3`):
- `THE CITY RISES. / THE DEPTH IS SEALED.` + «Город растёт вверх. Глубина закрыта.»;
- вводная о шести узлах между двумя полюсами;
- `THREE LIVES / INSIDE THE FRACTURE.` + «Три жизни внутри разлома» и мост «На карте порядок выглядит как схема. В их судьбах — как цена.»

**Главный инвариант реализации:** сборщик утверждает, что `index.html` на `8815f17` равен прототипу A+AD побайтно, кроме путей стилей, скрипта и A08. Отклонения D-01…D-03 — только CSS.

## Найдено и исправлено на стадии

1. **D-02.** В эталоне A+AD на 360 px утверждённая русская строка переносилась на две строки, и текст выходил за защищённую рамку W04. Моё утверждение в AD.R1 «одна строка на 390 и 360» было проверено только на 390. Исправлено шагами кегля при ≤ 380 / ≤ 340 px без изменения текста. Проход 320–430 px с шагом 1 px: до правки сбой на 320–338 (Chromium) и 320–327 (Firefox), после — ни одного сбоя в обоих движках.
2. **D-03.** Регрессия `R-W3C-08-type-floor-390` поймала метку `WORLD GRID` 11 px — она пришла из `r1p.css`. На мобильном теперь 12 px, по контракту W3.C.

## Результаты (SELF-CHECK)

| Проверка | Результат |
| --- | --- |
| Стадийная самопроверка, `--ref 8815f17` | **53/53** (47 + 6 проверок отрисовки плашек) — [stage-check.json](../../evidence/w4r2/r2.3/stage-check.json) |
| Высоты `#world` / `#chars` vs A+AD, 1440 / 1920 / 390 / 360 | Δ = **0,00 px** |
| Текст секций vs A+AD | Совпадает |
| Рамка W04 | 252 / 302,39 / 163,80 / 151,19 px — равна `b85fbb0a`. Текст внутри рамки, русская строка в одну линию во всех четырёх размерах |
| Нетронутые секции vs `b85fbb0a` | Высоты равны |
| Источник | `check_w4_preservation.py` PASS: WORLD/CHARACTERS вне вводных, карта, оси, OMEGA-0, W04, карточки, AXIOM ∅, viewer — exact. Smoke-тесты PASS |
| axe, `#world` + `#chars` | 0 violations |
| Регрессия Chromium + Firefox | **230 PASS / 2 FAIL** — [JSON](../../evidence/w4r2/r2.3/regression-chromium-firefox.json). Оба FAIL — базовые долги HERO `W4-DEBT-HERO-01/02`; `R-W3C-08` (кегль ≥ 12 px) проходит после D-03 |

## Художественная самопроверка

Кадры `impl-{1440,390,360}-{world,chars}-NN` ([captures](../../evidence/w4r2/r2.3/captures/)) сверены с `evidence/w4ad/captures/{*-world-head, *-world-intro, *-chars-head}`. Заголовок стоит поверх исходной W04, карта и OMEGA-0 на месте, портреты и AXIOM ∅ — без изменений. Видимые отличия от эталона — только D-02/D-03 на узких экранах.

## Не проверено на этой стадии

WebKit, zoom 200 %, физические устройства, screen reader, производительность — это R3 на `8815f17`, затем независимый R4.
