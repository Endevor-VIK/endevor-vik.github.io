<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.OPUS_REVIEW_R2_1
  title: "R2.1 — BLACK SUN / WHAT REMAINS — Opus SELF-CHECK"
  status: SELF_CHECK_PASS (executor, not independent) / R3_R4_PENDING
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# R2.1 — BLACK SUN / WHAT REMAINS — SELF-CHECK

```text
OPUS SELF-CHECK R2.1 — PASS (executor and art director; NOT an independent PASS)
Implementation SHA: e651c632227cc94aa32b30150e2db6fdcc1c98c6 (w4/world-narrative, PR #12)
Art baseline: 9cf78b0 (A+AD)   Product base: b85fbb0a   Authority: GATE_R_A_EXECUTOR_AMENDMENT.md
Checked: text / SVG / geometry (4 viewports) / untouched sections / protected source / rails / A08 / RM / axe / regression
Deviations: D-01 (pulse glint --ax-ink instead of pale pink) — waves/w4ad/OPUS_DECISIONS.md
Required changes: none
Not an R3/R4 verdict; Gate B remains CREATOR.
```

## Что внедрено

`#manifesto` и `#modules` — дословно из `ad.html @9cf78b0` через `evidence/w4r2/tools/build_r2.py --stage 1`. Изменённые продуктовые файлы:
- `index.html` — две секции + `<link>` стиля + `<script>`;
- `assets/css/showcase-w4r.css` — 244 из 329 правил `r1p.css` + `ad.css`, порядок сохранён;
- `assets/js/showcase-w4r.js`;
- `assets/showcase/visual-library/web/A08_protocol_gate-{480,720,941}w.{avif,webp}` — хэши совпадают с `derivatives.json`;
- `assets/showcase/visual-library/README.md` — A08 IN USE.

Тесты приведены к утверждённому контракту:
- `tests/check_w4_preservation.py` — защита WORLD/CHARACTERS по внутренностям, карты, осей, OMEGA-0, W04, карточек, AXIOM ∅ и viewer; допускаются только ассеты W4.R. Негативная проверка во временном worktree: порча карты, карточки, порядка секций и лишний ассет → FAIL.
- `tests/smoke_showcase.py` — метка авторской реконструкции в форме A+AD.
- `tests/browser/showcase_regression.cjs` — R-W3C-01 принимает W02 как сцену памяти.

## Результаты (SELF-CHECK)

| Проверка | Результат |
| --- | --- |
| Стадийная самопроверка, `--ref e651c63` | **73/73** — [stage-check.json](../../evidence/w4r2/r2.1/stage-check.json) |
| Высоты `#manifesto` / `#modules` vs A+AD, 1440 / 1920 / 390 / 360 | Δ = **0,00 px** во всех восьми замерах |
| Текст и SVG-геометрия секций vs A+AD | Совпадают во всех viewport |
| Нетронутые секции (WORK, SYSTEM, WORLD, CHARACTERS, FACTIONS, VISION) vs `b85fbb0a` | Высоты равны (< 0,5 px) во всех viewport |
| Источник | `check_w4_preservation.py` PASS — [preservation.json](../../evidence/w4r2/r2.1/preservation.json); `smoke_showcase.py`, `smoke_showcase_v23.py` PASS |
| Лента следов | no-JS и JS на 390 / 360: нативная прокрутка, ничего не скрыто, кнопки только с JS; клавиатура (JS и без JS) и touch-свайп доходят до каждой из пяти карточек |
| A08 | 1440 @1x/2x, 390 @1x/3x, 360 @1x/3x: продуктовый ассет из оригинала, центр ворот внутри кадра |
| Reduced motion | Пульс выключен при `reduce`, работает при `no-preference` |
| axe (WCAG 2.0/2.1 AA), `#manifesto` + `#modules` | 0 violations; color-contrast incomplete 42 (1440) / 60 (390) — **как у эталона A+AD** |
| Регрессия Chromium + Firefox | **230 PASS / 2 FAIL** — [JSON](../../evidence/w4r2/r2.1/regression-chromium-firefox.json). Оба FAIL — базовые долги HERO `W4-DEBT-HERO-01/02` с теми же числами (151/771 и 722/720), итог идентичен W4 |

## Художественная самопроверка

Нативные кадры реализации ([captures](../../evidence/w4r2/r2.1/captures/)): `impl-{1440,1920,390,360}-{manifesto,modules}`, плюс каждая карточка ленты следов на 390. При одинаковой ширине они сверены с эталонными кадрами `evidence/w4ad/captures/`. Композиция, масштаб архива, кольцо со строкой состояния, пять следов (BIO пунктиром), порог A08, W02 и сцена зависимости совпадают с утверждённым A+AD. Единственная видимая разница — белая (вместо бледно-розовой) искра узла пульса, отклонение D-01.

Замечание о съёмке: в кропах после замеров скрыты фиксированные `header.top` (размытие фона), nav, ticker, курсор и индикатор прокрутки. Первая съёмка без скрытия `header.top` дала размытую полосу и чёрную плашку W06 только в кадре. В живом окне плашка W06 отрисована (проверено), кадры пересняты.

## Не проверено на этой стадии

WebKit, фактический zoom 200 %, планшетные размеры кроме регрессионного набора, физические устройства, screen reader, производительность против `b85fbb0a`. Всё это — R3 после R2.3, затем независимый R4.
