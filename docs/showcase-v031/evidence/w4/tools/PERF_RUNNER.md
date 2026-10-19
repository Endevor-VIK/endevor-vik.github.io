<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.W4.PERF_RUNNER
  title: "W4 — reproducible sequential Lighthouse runner"
  status: TOOLING / BASELINE_OBSERVED / PAIRED_NOT_EXECUTED
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-19
  editable_by_agents: true
-->
# W4 — Lighthouse

Исходник: [tests/browser/w4_perf.cjs](../../../../../tests/browser/w4_perf.cjs).
Подготовка инструмента не означает выполнения замеров. Только lab; полевой INP,
реальные устройства и визуальное принятие этим инструментом не проверяются.

## Первичный baseline — OBSERVED, n=1

Координатор разрешил отдельное CPU-окно до продуктовых правок. Успешный запуск
`run-baseline-initial-r2` завершился **2026-10-19 12:36:16 UTC**; source
`6b082e5f262c09a123748273da42277d3a29a6c2`, 190 продуктовых файлов сверены до и после.
Windows host: 50.53 GiB / 10.61% free. Chromium 149, LH 12.8.2, PW 1.61.1.

| Профиль | Perf / A11y / BP / SEO | FCP, ms | LCP, ms | TBT, ms | CLS | Transfer, bytes |
| --- | --- | --- | --- | --- | --- | --- |
| mobile | 96 / 100 / 100 / 100 | 1658.87 | 2564.78 | 0 | 0.016225 | 340264 |
| desktop | 99 / 100 / 100 / 100 | 386.71 | 568.95 | 0 | 0.004504 | 429991 |

Оба наблюдения: 0 world-library requests. Mobile long tasks: 2 / sum 308 ms /
max 243 ms; desktop: 1 / 67 ms. Это один образец, **не медианный regression verdict**.
Summary/full reports: `/tmp/axs-0524-w4-perf/run-baseline-initial-r2/` (retention ниже).
Профили, own Chrome, lock и неправильный UNC-каталог отсутствуют после cleanup.
SHA-256 runner на этом запуске:
`b92483b4b16a10034e13d7d1f3524db4fc9caea46ca588d0ad1ee2a2216dd38c`.
После запуска добавлена запись `environment.runnerSha256` для будущих summary;
измерительная схема не менялась.

Первый `run-baseline-initial` — **INCOMPLETE**, не используется: runtime обнаружил
WSL conversion профиля в chrome-launcher и синхронный `kill()` API. Исправлены
Linux direct spawn/CDP и ожидание закрытия Chrome; exact собственный ошибочный
UNC-каталог удалён после проверки завершения процесса. Успешный r2 выполнен после
исправления, без параллельных QA browsers. Полные пять пар ещё **NOT RUN**.

## Воспроизведение

Runner сверяет каждый продуктовый файл `index.html`, `404.html`, `loader.html`,
`assets/**` с Git blob заданного SHA. При несовпадении запуск прекращается;
после замеров выполняется повторная сверка. Корни — отдельные неизменяемые snapshots,
без копирования картинок в каждый run. SHA итоговой реализации должен быть зафиксирован
после layout QA. Не использовать основной рабочий checkout для QA.

Один ephemeral localhost server отдаёт BEFORE и AFTER по **одинаковому URL** с
одинаковыми gzip для text, MIME, `max-age=600`, 404 fallback. Между последовательными
наблюдениями переключается только корень. Каждый Lighthouse получает новый Chrome и
собственный профиль: default mobile / официальный desktop config, simulated throttling,
стандартная очистка storage, первый визит с обычным loader. Никаких DOM/CSS injections,
принудительного reduced motion или скрытия контента. Схема пяти пар:
`mobile BEFORE → AFTER; desktop BEFORE → AFTER`, повторить пять раз.

Все browser/QA agents должны завершить работу перед запуском: CPU-измерения не допускают
одновременных Chromium/Firefox/WebKit/Lighthouse. Сам runner держит собственный lock;
он не останавливает чужие процессы и не считает lock заменой координации.

Зависимости уже установлены; загрузок и установок runner не выполняет:

```bash
export NODE_PATH=/home/axiom/ENDEAVOR/AXS/apps/axiom-web-core-ui/node_modules
export CHROME_PATH=/home/axiom/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome
```

Версии проверяются: Lighthouse 12.8.2, Playwright 1.61.1; измеренный browser UA должен
быть Chrome 149. `NODE_PATH` / `CHROME_PATH` можно перенаправить на существующие
установки тех же версий; исторические `/tmp/claude-*` пути не используются.

WSL: runner берёт публичные `Launcher.defaultFlags()` из установленного chrome-launcher,
но запускает Linux Chrome напрямую с Linux `--user-data-dir` и CDP port. Это исключает
преобразование профиля в Windows UNC path, которое пакет делает даже для Linux binary.
Процессная группа, `chrome.pid`, logs и DevToolsActivePort принадлежат своему `/tmp` profile.

Подготовительная проверка без server/Chrome:

```bash
node tests/browser/w4_perf.cjs --check --baseline-only --pairs 1 \
  --before-root /tmp/axs-0524-w4-before-6b082e5 \
  --before-sha 6b082e5f262c09a123748273da42277d3a29a6c2
```

Первичный baseline **до продуктовых правок**, только после отдельного GO координатора:

```bash
node tests/browser/w4_perf.cjs --baseline-only --pairs 1 \
  --before-root /tmp/axs-0524-w4-before-6b082e5 \
  --before-sha 6b082e5f262c09a123748273da42277d3a29a6c2 \
  --out /tmp/axs-0524-w4-perf/run-baseline-initial
```

Пять пар после фиксации runtime и окончания layout QA (подставить exact AFTER SHA/root):

```bash
node tests/browser/w4_perf.cjs \
  --before-root /tmp/axs-0524-w4-before-6b082e5 \
  --before-sha 6b082e5f262c09a123748273da42277d3a29a6c2 \
  --after-root /tmp/axs-0524-w4-after-EXACT_SHA \
  --after-sha EXACT_SHA \
  --pairs 5 --out /tmp/axs-0524-w4-perf/run-final-paired
```

Перед фактическим запуском runner читает Windows `Get-Volume C`: CRITICAL (<10 GiB
или <5%) останавливает работу; WARNING сохраняется в отчёте. Linux `df` не используется
вместо host measurement. Требуется свободное CPU-окно, даже если диск достаточен.

`summary.json` содержит source manifests/SHA, окружение, host guard, время и порядок
всех наблюдений, scores/FCP/LCP/TBT/CLS/transfer/speed index, median/min/max/standard
deviation, разницы медиан. Диагностика: long tasks (count/sum/max/топ), основные сетевые
ресурсы и запросы world-library, main-thread breakdown, render-blocking и LCP element,
если эта версия Lighthouse отдаёт соответствующий audit. Дополнительно сохраняется
серверный счётчик body bytes/запросов по файлам. Scores и timings — `OBSERVED`, а не
автоматический PASS: reviewer оценивает шум, регрессию и применимые бюджеты.

Полные JSON находятся **только в `/tmp`**, не в repo. На каждый observation — отдельный
worker/browser, timeout 180 s; при остановке закрываются только его Chrome/processes.
Chrome profiles удаляются при успехе и ошибке. Вывод: максимум три собственных `run-*`
или 14 дней (меньший срок), pruning перед записью, marker + UID + realpath ownership;
посторонние директории не удаляются. Бюджет retained run 128 MiB, full report ≤8 MiB,
worker log ≤64 KiB. Незавершённый запуск получает `INCOMPLETE` и непустой exit code;
предыдущие результаты не подменяются. В репозиторий переносить только небольшой
summary/выжимку с exact SHA после проверки, не весь `/tmp` run.
