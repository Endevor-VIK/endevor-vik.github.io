<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.W4.PERFORMANCE_OBSERVATIONS
  title: "W4 — performance observations and quiet-window qualification"
  status: INCOMPLETE / QUIET_PERFORMANCE_NOT_QUALIFIED
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-20
  editable_by_agents: true
-->
# W4 — performance: INCOMPLETE

Нужные пять пар в чистом CPU-окне пока не квалифицированы. Все 20 наблюдений attempt 1
сохранены, но помечены CONTAMINATED; attempt 2 остановлен до запуска Lighthouse,
поскольку внешний Claude Playwright/devserver оставался активным все 90 секунд preflight.
Ни один чужой процесс не завершался. Числовые floors ниже — наблюдения, не final PASS.
Attempt 3 после успешного preflight прерван guard из-за нового внешнего esbuild;
завершённых observations = 0. Он также не квалифицирован.

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
