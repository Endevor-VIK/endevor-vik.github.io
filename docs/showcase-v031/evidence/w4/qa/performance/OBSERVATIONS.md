<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.W4.PERFORMANCE_OBSERVATIONS
  title: "W4 — performance observations and quiet-window qualification"
  status: COHORT4_QUALIFIED / FIXED_COHORT5_REQUIRED / G4_INCOMPLETE
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-20
  editable_by_agents: true
-->
# W4 — performance: cohort 4 recorded / final classification pending

Первый qualified cohort из пяти пар сохранён ниже; финальная классификация ожидает фиксированный второй полный cohort по независимому G4. Исторические attempts1–3 не используются для final gate. Все 20 наблюдений attempt 1
сохранены, но помечены CONTAMINATED; attempt 2 остановлен до запуска Lighthouse,
поскольку внешний Claude Playwright/devserver оставался активным все 90 секунд preflight.
Ни один чужой процесс не завершался. Числовые floors ниже — наблюдения, не final PASS.
Attempt 3 после успешного preflight прерван guard из-за нового внешнего esbuild;
завершённых observations = 0. Он также не квалифицирован.

## Qualified cohort 4 — recorded; fixed cohort 5 required

20 observations, 5 pairs × mobile/desktop, 17:26:14–17:30:46 UTC. Method qualification: `QUIET_CPU_QUALIFIED` under the original guard policy. This is not final regression classification or G4 PASS.

[Summary](attempt-4-quiet/summary.json) · [descriptive analysis](attempt-4-quiet/analysis.json) · [raw hashes](attempt-4-quiet/raw-reports-manifest.json) · [guard](attempt-4-quiet/guard.json) · [60s readiness](attempt-4-quiet/readiness.json) · [cleanup](attempt-4-quiet/cleanup.json).

Each cell: median [min–max]; population SD, n=5. All values retained; no contaminated attempts pooled.

### mobile

| Metric | BEFORE | AFTER | Delta medians |
| --- | --- | --- | --- |
| Perf | 97 [92–100]; SD 3 | 97 [97–98]; SD 0 | 0 |
| FCP, ms | 1657.23 [1363.17–2260.81]; SD 316.59 | 1655.71 [1353.78–1656.35]; SD 147.87 | -1.52 |
| LCP, ms | 2407.60 [1513.17–2566.22]; SD 407.49 | 2407.81 [2407.56–2460.47]; SD 21.00 | 0.21 |
| TBT, ms | 5.00 [0.00–177.00]; SD 68.33 | 0.00 [0.00–2.00]; SD 0.80 | -5.00 |
| CLS | 0.016841 [0.016246–0.019717]; SD 0.001494 | 0.016325 [0.016314–0.019681]; SD 0.001646 | -0.000517 |
| Speed Index, ms | 1657.23 [1590.60–2260.81]; SD 255.26 | 1655.71 [1555.97–1674.97]; SD 46.89 | -1.52 |
| Transfer, bytes | 340264 [340264–340264]; SD 0 | 339305 [339305–339305]; SD 0 | -959 |

### desktop

| Metric | BEFORE | AFTER | Delta medians |
| --- | --- | --- | --- |
| Perf | 100 [99–100]; SD 0 | 100 [100–100]; SD 0 | 0 |
| FCP, ms | 386.58 [346.75–536.93]; SD 65.89 | 386.12 [324.54–407.65]; SD 34.40 | -0.46 |
| LCP, ms | 530.67 [528.30–625.40]; SD 38.32 | 529.32 [528.16–531.51]; SD 1.13 | -1.35 |
| TBT, ms | 0.00 [0.00–22.00]; SD 8.80 | 0.00 [0.00–0.00]; SD 0.00 | 0.00 |
| CLS | 0.005324 [0.005298–0.005502]; SD 0.000088 | 0.005434 [0.005278–0.005657]; SD 0.000151 | 0.000109 |
| Speed Index, ms | 963.40 [950.37–1008.35]; SD 21.62 | 981.98 [948.42–1009.48]; SD 20.53 | 18.57 |
| Transfer, bytes | 429991 [429991–429991]; SD 0 | 429032 [429032–429032]; SD 0 | -959 |

A11y/BP/SEO medians are 100 for all four arms; all initial loads have 0 world-library requests. Transfer AFTER is 959 bytes lower. Sources/settings/UA and every raw metric were independently checked. Windows host: 47.587 GiB /9.995% free, WARNING with substantial margin for the bounded128MiB run; not CRITICAL. Own browsers, profiles, server and lock closed; raw LHR remain for review.

Declared median budgets are numerically met: mobile≥90, desktop≥95; median LCP investigation (>10% AND >150ms) and CLS delta>.02 are not crossed. **This does not resolve distribution uncertainty.** Mobile paired LCP mean +277.481ms (+12.96% of BEFORE mean), median +0.213ms, SD397.245ms, range−105.750…+895.770ms. BEFORE lower-mode samples and AFTER concentration around2.4s require the independent reviewer's fixed second complete5-pair cohort. LCP element is the same `div.show-hero-byline`; a causal zero-cost or source-regression claim is not established.

Monitoring is sampled. Original `seconds` (median1.0038/max1.0112s) omitted scan/write/parse overhead; recorded timestamp gaps are median1.0074/max4.6013s. Both summaries are now labelled separately in analysis.json; original guard.json stays unchanged. No strict continuous1s coverage is claimed. Cohort4 has247 samples,0 foreign browser/build samples, max reported foreignCPU59.782% of one core.

For cohort5, [guard v2 validation/predeclaration](guard-v2-validation.json) records corrected actual monotonic CPU denominator, actual CPU-read timestamps/scan duration and whole-attempt rejection if a snapshot interval exceeds3s. Own Chrome/worker argv are no longer read; only foreign potential JS compiler hosts need argument classification. LH runner/runtime/presets/order remain frozen. Guard instrumentation versions differ; comparisons remain paired within each cohort, with separate and pooled reporting.

## Источники и метод

- BEFORE: `6b082e5f262c09a123748273da42277d3a29a6c2`, 190 файлов, manifest `101c240eacd69c193473f40ec4367440eaa096e2ef3b92dad200f99378b39ee0`.
- AFTER: `b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5`, 190 файлов, manifest `c3117174a500ed3b31ab530bc814a84f6dd3b8671293f7523aa298808c69c693`.
- Runner неизменён относительно frozen SHA; исходные продуктовые файлы проверены до и после.
- Chromium 149 / Lighthouse 12.8.2 / Playwright 1.61.1; один localhost URL/server, gzip text, `max-age=600`, одинаковые MIME/404, свежий профиль и default storage reset для каждого наблюдения.
- Default mobile: 412×823@1.75, simulated CPU×4 / RTT150ms; desktop preset: 1350×940@1, CPU×1 / RTT40ms. Обычный motion/loader, без скрытия контента.
- Порядок: пять раз mobile BEFORE→AFTER, desktop BEFORE→AFTER. Выполнено 20/20 2026-10-20 13:17–13:22 MSK (10:17–10:22 UTC).

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

Следующая попытка использует новые scratch/durable пути и полный набор из пяти пар.
Readiness watcher теперь требует **60 последовательных тихих секунд** до передачи
управления неизменённому guard. Это более строгое ожидание после нескольких коротких
пауз между внешними фазами; собственные 15s preflight/1s monitor guard и Lighthouse
settings остаются прежними. Ни старые contaminated значения, ни нулевые attempts
не добавляются к будущему qualified набору.

## Воспроизведение / сохранность

[Метод и команды](../../tools/PERF_RUNNER.md), [guard wrapper](run_guarded.py),
[readiness](readiness.json), [derived numbers](observational-analysis.json).
Raw first-attempt reports остаются в `/tmp/axs-0524-w4-perf/run-final-paired-20261020/`
по 3-run/14-day retention; 17.83MB, без профилей. Все 20 raw JSON разобраны, версии,
settings и LCP/CLS совпали с summary; hashes сохранены для G4.
[Cleanup](cleanup.json): own browsers/profiles/lock/UNC отсутствуют.
Следующее действие — отдельное разрешённое окно после естественного завершения чужой
работы; новый полный attempt в отдельном каталоге, без изменения runtime/tests.
