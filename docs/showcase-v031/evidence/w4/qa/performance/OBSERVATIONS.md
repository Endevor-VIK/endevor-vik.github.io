<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.W4.PERFORMANCE_OBSERVATIONS
  title: "W4 — qualified paired performance and final classification"
  status: FIXED40_COMPLETE / PASS_WITH_RECORDED_LIMITS / GATE_B_HOLD
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# W4 — qualified paired performance

**Independent G4: PASS bounded lab comparison, with recorded limits.** Measurement date20.10 UTC, report21.10. Exactly two complete fixed cohorts4/5,40 observations total, n=10/profile/arm. No optional stopping, culling or contaminated pooling. [Independent exact-SHA verdict](../../../../waves/w4/W4_G4_REVIEW.md), [pooled JSON with all40 membership](pooled-analysis.json), [clock-domain evidence](CLOCK_DOMAINS.md). Gate B HOLD; PR12 Draft.

## Conditions / source freeze

BEFORE `6b082e5f262c09a123748273da42277d3a29a6c2`,190files, digest `101c240eacd69c193473f40ec4367440eaa096e2ef3b92dad200f99378b39ee0`.
AFTER `b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5`,190files, digest `c3117174a500ed3b31ab530bc814a84f6dd3b8671293f7523aa298808c69c693`.
Frozen LH runner SHA256 `872431acbd0cab155fb904353194b869d49b7429df11d50c81468a3981345b37`; source files checked before/after and again independently.

Chromium149 / LH12.8.2 / PW1.61.1 / Node22.23.1. Fresh Chrome/profile per observation, first visit/default storage reset, normal loader/motion. One identical localhost URL within each cohort, same gzip/cache/MIME/404 server; different ephemeral ports across cohorts. Default mobile412×823@1.75 CPU×4/RTT150ms; desktop1350×940@1 CPU×1/RTT40ms; simulated throttling. Fixed order five times mobile B→A;desktop B→A. Guard versions differ between cohorts, identical within each cohort's arms. Windows host47.587/47.583GiB (~9.99%) WARNING with128MiB budget/margin; not CRITICAL. Windows activity and real devices are outside `/proc` guard visibility.

## Fixed cohorts / classification

| Cohort | Observations | Mobile LCP mean Δ | LCP marginal-median Δ | Status |
| --- | --- | --- | --- | --- |
|4 |20 /5pairs |+277.481ms /+12.96% |+.213ms |Original sampled quiet policy qualified; independent F02 required fixed extra cohort |
|5 |20 /5pairs |+42.472ms /+1.93% |−.150ms |Predeclared extra cohort completed fully; guard v2 MONOTONIC predicate passed |
|Pooled |40 /10pairs |+159.977ms /+7.36% |+.0314ms |Bounded lab PASS with uncertainty; no product correction justified by agreed budgets |

[Cohort4 summary](attempt-4-quiet/summary.json) · [analysis](attempt-4-quiet/analysis.json) · [raw hashes](attempt-4-quiet/raw-reports-manifest.json) · [guard](attempt-4-quiet/guard.json) · [readiness](attempt-4-quiet/readiness.json) · [cleanup](attempt-4-quiet/cleanup.json).
[Cohort5 summary](attempt-5-fixed/summary.json) · [analysis](attempt-5-fixed/analysis.json) · [raw hashes](attempt-5-fixed/raw-reports-manifest.json) · [guard](attempt-5-fixed/guard.json) · [readiness](attempt-5-fixed/readiness.json) · [cleanup](attempt-5-fixed/cleanup.json).

Cohort4 completed17:26:14–17:30:46 UTC; cohort5 completed17:43:37–17:48:06 UTC. All40 raw metrics/categories/config/UA/size/hash, both source manifests and all separate/pooled statistics independently matched. A11y/BP/SEO scores100;0 initial world-library requests. All AFTER performance scores≥95mobile/99desktop pass floors90/95; medians97/100. Median LCP regression>10% AND>150ms and CLS delta>.02 are not crossed.

Pooled mobile paired LCP Δ mean+159.977ms, median−.0493ms, population SD492.446ms, range−846.623…+895.770ms. Marginal median difference+.0314ms is a different statistic. Fast BEFORE LCP<2s3/10 versus AFTER1/10 remains an observation. AFTER mobile TBT max234.638ms; desktop Speed Index mean+39.776ms (~4.13%) remains. CSS gzip+1375bytes, initial total transfer−959bytes. The extra cohort did not reproduce the first mean shift at the same magnitude; agreed median budgets pass. This is **not** statistical equivalence, a zero-cost/causal guarantee or improvement of every metric.

## Pooled medians / range / population SD

Each arm n=10, all observations retained; metric units in row labels.

### Mobile

| Метрика | BEFORE median [min–max]; SD | AFTER median [min–max]; SD | Δ медиан |
| --- | --- | --- | --- |
| Performance | 97.00 [92.00–100.00]; 1.97 | 97.00 [95.00–98.00]; 0.87 | 0.00 |
| FCP, ms | 1656.500 [1359.393–2260.810]; 281.428 | 1506.150 [1353.781–1656.349]; 150.544 | -150.349 |
| LCP, ms | 2407.872 [1513.173–2566.216]; 375.309 | 2407.903 [1562.405–2460.465]; 257.708 | 0.031 |
| TBT, ms | 2.750 [0.000–177.000]; 67.009 | 0.000 [0.000–234.638]; 70.294 | -2.750 |
| CLS | 0.016842 [0.016236–0.019717]; 0.001429 | 0.019590 [0.016314–0.019681]; 0.001557 | 0.002748 |
| Speed Index, ms | 1657.654 [1460.533–2260.810]; 235.700 | 1647.181 [1526.039–1686.067]; 52.588 | -10.473 |
| Transfer, bytes | 340264.00 [340264.00–340264.00]; 0.00 | 339305.00 [339305.00–339305.00]; 0.00 | -959.00 |

### Desktop

| Метрика | BEFORE median [min–max]; SD | AFTER median [min–max]; SD | Δ медиан |
| --- | --- | --- | --- |
| Performance | 100.00 [99.00–100.00]; 0.30 | 100.00 [99.00–100.00]; 0.30 | 0.00 |
| FCP, ms | 388.676 [346.747–536.934]; 59.306 | 387.490 [324.543–491.442]; 43.580 | -1.186 |
| LCP, ms | 531.630 [528.299–625.402]; 29.310 | 530.133 [528.155–532.727]; 1.276 | -1.497 |
| TBT, ms | 0.000 [0.000–22.000]; 6.600 | 0.000 [0.000–0.000]; 0.000 | 0.000 |
| CLS | 0.005372 [0.003975–0.005514]; 0.000495 | 0.005440 [0.005278–0.005657]; 0.000126 | 0.000068 |
| Speed Index, ms | 961.827 [937.840–1008.353]; 19.128 | 986.681 [948.416–1195.113]; 65.778 | 24.855 |
| Transfer, bytes | 429991.00 [429991.00–429991.00]; 0.00 | 429032.00 [429032.00–429032.00]; 0.00 | -959.00 |

## Sampling / clock limitations

Outer60 readiness samples, guard15 preflight;247/246 measurement samples for4/5,0 foreign browser/build samples or violations, foreign CPU maxima59.782/19.932%onecore. V1 denominator omitted some known scan/write work but lacked CPU-read MONOTONIC stamps: recorded UTC max4.601346s does not establish actual mono gaps or their cause. V2 uses actual CPU-read MONOTONIC intervals, max1.022587s; scan max.011263s, predeclared whole-attempt3s MONOTONIC predicate passed. [Validation/predeclaration](guard-v2-validation.json).

Cohort5 UTC span271.007534s versus MONOTONIC245.837832s, seven UTC jumps and max UTC interval4.776223s: **cause unknown**. Original guards/LHR were not edited. No wallgap≤3s, continuous1s quiet, physical-time calibration, Windows-load or field-CWV claim. [Clock note/timeline](CLOCK_DOMAINS.md) separates those domains. Fixed B→A order, small n, sampled visibility and instrumentation difference limit causal/general conclusions; independent reviewer accepts bounded simulated comparison with these limits.

## Excluded attempts — historical evidence

Attempts1–3 are wholly excluded from the fixed40 result. Their numeric records remain observations, not qualified PASS.

## Attempt 1: числовые наблюдения

Медиана и диапазон min–max, n=5 для каждого profile/arm. Разброс/standard deviation и все значения — [summary.json](summary.json).

| Метрика | Mobile BEFORE | Mobile AFTER | Desktop BEFORE | Desktop AFTER |
| --- | --- | --- | --- | --- |
| Perf | 98 (96–98) | 97 (96–97) | 100 (100–100) | 100 (99–100) |
| FCP, ms | 1357.56 (1353.85–2260.25) | 1660.22 (1358.52–2114.47) | 495.11 (387.45–497.15) | 490.75 (368.36–533.85) |
| LCP, ms | 2407.70 (2264.13–2415.11) | 2413.63 (1545.10–2563.05) | 570.67 (529.93–579.65) | 535.36 (530.75–640.85) |
| TBT, ms | 48.00 (4.00–70.00) | 8.00 (0.00–189.16) | 0.00 (0.00–0.00) | 0.00 (0.00–17.00) |
| CLS | 0.013475 (0.012440–0.016925) | 0.016840 (0.016204–0.019597) | 0.004007 (0.001339–0.005281) | 0.005299 (0.004629–0.005592) |
| Transfer, bytes | 340264 (340264–340264) | 339305 (339305–339305) | 429991 (429991–429991) | 429032 (429032–429032) |

Медианные A11y/BP/SEO = 100 на всех arms; все 20 initial loads имеют 0 запросов
к world-library. Transfer AFTER стабильно на 959 bytes меньше. Mobile LCP delta
медиан +5.93ms (+0.25%); desktop −35.31ms (−6.19%). CLS +0.003365 / +0.001292.
Численно floors mobile≥90 / desktop≥95 и investigation thresholds (LCP >10% И >150ms,
CLS +0.02) не нарушены. Но contaminated run не закрывает performance gate.

Mobile FCP delta медиан +302.66ms; медиана **попарных** FCP deltas +4.67ms.
Это разные статистики при заметном разбросе; нельзя выдавать их за отсутствие
замедления или приписывать весь эффект W4. CSS showcase-v23 передаётся как 14,143 bytes
против 12,768 BEFORE; LCP element остаётся author byline на mobile / radar SVG text
на desktop. Для причинного вывода требуется квалифицированный повтор.
Mobile AFTER median LCP 2413.63ms численно ниже 2500ms, один sample 2563.05ms выше;
исторический W3.C debt не объявлен исправленным. Полевые CWV/INP не измерялись.

## Почему attempt 1 не принят

Preflight 3s был низким (1.29% aggregate CPU), но runtime monitor обнаружил внешние
tsc/esbuild и Chrome headless/Firefox. Foreign CPU: median 18.08% / max 284.83% одного
ядра; 10 browser intervals затронули 6 observations. Поэтому все samples сохранены
вместе, без выборочного отбрасывания; чистыми пятью парами они не считаются.
[Qualification](attempt1-qualification.json), [ambient log](ambient-run.json),
[raw report hashes](attempt1-raw-reports-manifest.json), [runner log](runner.log).

## Attempt 2: guard выполнил отказ до измерения

[Guard](attempt-2-quiet/guard.json): 90 preflight samples, 0 LH observations.
Внешняя цепочка `claude → bash → timeout → npm exec playwr` продолжала держать
chrome-headless-shell и esbuild/devserver; отдельная owner session, не наш runner.
Guard требует 15 последовательных 1s samples CPU<10% и ни одного внешнего browser/build.
Во время измерения внешний browser/build или foreign CPU>100% одного ядра две секунды
подряд отклоняет весь attempt и завершает только наш runner. Полные argv/env не логируются.

## Attempt 3: новый внешний build после успешного preflight

[Guard](attempt-3-quiet/guard.json), [source check](attempt-3-quiet/source-check.json),
[incomplete summary](attempt-3-quiet/summary.json), [runner log](attempt-3-quiet/runner.log),
[cleanup](attempt-3-quiet/cleanup.json). 16:57:57–16:59:13 UTC, reporting HEAD `bbfe4d0`;
runtime exact `b85fbb0a`, remote main `6b082e5`, PR12 Draft перепроверены до запуска.
В 62 preflight samples были CPU spikes; затем прошли 15 последовательных тихих samples.
Через четыре measurement samples появился внешний esbuild (foreign CPU sum 206.937%
одного ядра). Guard остановил только собственный worker. Первый mobile BEFORE observation
не завершён: **0 completed observations / 0 raw LHR**, status CONTAMINATED, summary INCOMPLETE.
Профиль, browser, server и runner lock закрыты; frozen runner SHA256 не изменился.


## Retention / reproducibility

Все raw LHR cohorts4/5 были доступны и сверены независимо до очистки. Raw attempt1 удалён frozen runner retention при старте cohort5 после прежней сверки; его summary/qualification/log/hash records сохранены. Final cleanup record фиксирует удаление только собственных marked scratch, без изменения durable evidence. [Метод](../../tools/PERF_RUNNER.md), [cleanup](final-cleanup.json), [independent G4](../../../../waves/w4/W4_G4_REVIEW.md).
