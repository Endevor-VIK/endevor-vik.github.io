<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.OPUS_DECISIONS
  title: "R2 — art-direction decisions and recorded deviations from A+AD (art freeze 9cf78b0)"
  status: ACTIVE / R2
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# R2 — решения Opus и отклонения от A+AD

Эталон — `9cf78b0`. Всё, что в продукте отличается от прототипа, кроме путей (стили, скрипт, ассеты A08), записано здесь. Сборщик `evidence/w4r2/tools/build_r2.py` применяет только эти отклонения и на R2.3 проверяет, что прочая разметка совпадает с `ad.html` побайтно.

| ID | Стадия | Отклонение | Причина | Художественный эффект |
| --- | --- | --- | --- | --- |
| D-01 | R2.1 | Свет пульса в сцене зависимости и точка узла: `#ffd5da` → `var(--ax-ink)` (#f1f1f4) | Постоянное правило CREATOR: красный `#ff2034` и нейтральный графит, «no pink/purple/salmon» (`AGENTS.md`). `#ffd5da` — бледно-розовый, того же класса, что запрещённый в `tests/smoke_showcase_v23.py` `#fbc8cc` | Белая искра вместо бледно-розовой на той же красной линии: точнее RED PROTOCOL, композиция и движение не меняются |

Путевые соответствия (не отклонения): `r1p.css` + `ad.css` → `assets/css/showcase-w4r.css` (порядок правил сохранён, правила отфильтрованы по стадиям); `ad.js` → `assets/js/showcase-w4r.js`; `proposed/A08_protocol_gate-*` → `assets/showcase/visual-library/web/A08_protocol_gate-*` (байт в байт, хэши из `derivatives.json`).
