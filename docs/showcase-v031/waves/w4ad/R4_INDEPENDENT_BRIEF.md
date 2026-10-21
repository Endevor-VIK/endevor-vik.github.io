<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.R4_BRIEF
  title: "R4 — brief for the independent reviewer of the W4.R R2 runtime"
  status: READY_FOR_INDEPENDENT_REVIEWER
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# R4 — бриф независимого ревьюера

R4 проводит **не Opus**: Opus был исполнителем R2 и арт-директором, его стадийные записи и R3 — SELF-CHECK. Задача R4 — независимо проверить runtime и доказательства, **не принимая отчёты Opus на веру**. Вердикт: `PASS` / `PASS WITH RECORDED LIMITS` / `FAIL` / `INCOMPLETE`, с перечнем находок P0–P3.

## Что проверяется

| Объект | Значение |
| --- | --- |
| Репозиторий / PR | `Endevor-VIK/endevor-vik.github.io`, PR #12 (`w4/world-narrative`, Draft) |
| Runtime-заморозка | `b6040e3cbd110b807c5a33d6cccf4b52f7b05ed7` (R2.3 `8815f17` + исправление R3 D-04/D-05). Проверить: `git diff b6040e3 <HEAD> -- index.html assets tests` пуст |
| Продукт до R2 | `b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5` |
| Утверждённый художественный эталон | A+AD, `9cf78b0` (`docs/showcase-v031/evidence/w4ad/preview/ad.html`) |
| Полномочия | `waves/w4ad/GATE_R_A_AUTHORIZATION.md`, `waves/w4ad/GATE_R_A_EXECUTOR_AMENDMENT.md` |
| Отклонения от эталона | `waves/w4ad/OPUS_DECISIONS.md` (D-01…D-05, только CSS) |

## Минимальная программа R4

1. **Происхождение.** Пересобрать продукт: `python3 docs/showcase-v031/evidence/w4r2/tools/build_r2.py --stage 3` во временной копии `b6040e3` — результат должен совпасть с деревом побайтно. Сборщик сам утверждает равенство `index.html` и `ad.html @9cf78b0` с точностью до путей. Проверить, что отклонения ограничены D-01…D-05.
2. **Защищённое.** `python3 tests/check_w4_preservation.py`; вручную сверить карту, OMEGA-0, W04, карточки персонажей, AXIOM ∅, viewer и восемь реальных скриншотов с `b85fbb0a`. Проверить, что Canon не изменён: репозиторий Canon не затронут, root gitlink не менялся.
3. **Браузеры.** Свой прогон, а не JSON Opus:
   - `tests/browser/showcase_regression.cjs --firefox`. Ожидаемы только два долга HERO `W4-DEBT-HERO-01/02` — любой другой FAIL является находкой;
   - `docs/showcase-v031/evidence/w4r2/tools/r3_matrix.cjs --impl b6040e3…` и `r3_overflow_sweep.cjs` — WebKit через `/tmp/axs-0524-w4-webkit-deps/webkit-headless.sh`, восстанавливается `docs/showcase-v031/evidence/w4/tools/webkit_rootless.py`;
   - `docs/showcase-v031/evidence/w4r2/tools/r3_native_zoom.cjs` (zoom 200 % под Xvfb).
4. **Поведение.** Ленты следов и этюдов: no-JS, клавиатура, касание. Желательно — физический телефон: свайп, последняя карточка, фокус. Reduced motion, индекс этюдов, viewer, OMEGA-0.
5. **Производительность.** Сверить `evidence/w4r2/r3/performance` с исходными отчётами или повторить парный прогон `tests/browser/w4_perf.cjs` в тихом окне.
6. **Художественная верность.** Сравнить кадры IMPLEMENTED (`evidence/w4r2/r2.*/captures`, `evidence/w4r2/r3/frames`) с эталоном A+AD (`evidence/w4ad/captures`) и BEFORE. Отметить любое упрощение, исчезнувший объект или нарушение RED PROTOCOL / TYPE A.
7. **Доказательства.** Хэши, повторяемость, аудит размера (`waves/w4ad/R3_PR_SIZE_AUDIT.md`).

## Что нельзя

Менять runtime, Canon, `main`, root gitlink, версию; делать merge или deploy. Находки фиксируются в отдельной записи R4, исправления — отдельной задачей с новым SHA.
