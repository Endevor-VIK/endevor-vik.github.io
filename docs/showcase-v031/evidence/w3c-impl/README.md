<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.EVIDENCE.W3C_IMPL
  title: "AXIOM SHOWCASE — W3.C implementation evidence (QA on the exact SHA, BEFORE/AFTER)"
  status: EVIDENCE / APPEND-ONLY
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-19
  editable_by_agents: true
-->
# W3.C (реализация) — evidence manifest

Доказательства к [`../../waves/W3C_IMPLEMENTATION_REPORT.md`](../../waves/W3C_IMPLEMENTATION_REPORT.md). Файлы этой папки **не подключены к сайту**. Скрипты лежат как `.txt`.

**Условия:**
- **BEFORE** — снимок `git archive 15c3d51` (код сайта = `main` `9dda095`).
- **AFTER** — снимок `git archive b53350e` (QA SHA).
- Сервер `tools/serve-pages.cjs.txt`: gzip, `max-age=600`, 404 как на Pages, `image/avif`.
- Chromium 141 (Playwright 1.56.1), Lighthouse 12.8.2, axe-core 4.12.1.
- Прогоны последовательные: таймерные проверки не делят CPU. Порядок — `tools/run-qa2.sh.txt`, затем `tools/run-qa2b.sh.txt`.

## QA (`qa/`)

| Файл | Что | Инструмент |
| --- | --- | --- |
| `regression-before.{json,log}` | Регрессия на BEFORE (тесты той же ревизии): 89 / 89 | `tests/browser/showcase_regression.cjs` |
| `regression-qa-1.{json,log}`, `regression-qa-2.{json,log}` | Регрессия ×2 на `b53350e`: 116 / 116 | то же |
| `smoke-qa.log` | `smoke_showcase.py` и `smoke_showcase_v23.py`, по два раза | репозиторий |
| `lighthouse-runs-qa-b53350e.json`, `lighthouse-summary.txt` | Lighthouse: 5 пар BEFORE → AFTER чередованием, mobile и desktop. Сжатые данные каждого прогона: оценки, метрики, вес, запросы, блокирующие ресурсы, запросы к библиотеке. Полные отчёты в репозиторий не кладутся (18 МБ). | `tools/lh-run.sh.txt`, `tools/lh-summary.py.txt` |
| `axe-{before,after}.{json,log}` | axe на 390 и 1440 | `tools/axe-run.cjs.txt` |
| `preserve-{before,after}.json`, `textkeep.json` | Порядок 17 секций, sha256 текста по секциям, Canon ID, шрифты, токены, изображения, видимость без JS; слова входа WORLD | `tools/w3a_preserve.cjs.txt`, `tools/textkeep2.cjs.txt` |
| `bridges.txt` | F-06: мосты целиком видны после переходов | `tools/bridges.cjs.txt` |
| `measure-{before,after}.json`, `measure.log` | Длина входа WORLD, видимость после перехода, резкость каждого изображения, байты, запросы при открытии | `tools/w3c_measure.cjs.txt`, `tools/summarize2.py.txt` |
| `capture-{before,after}.json` | Отчёт кадров: 5 ширин × 7 кадров | `tools/w3c_capture.cjs.txt`, `tools/compare.py.txt` |
| `contrast-after.json`, `contrast-summary.{json,txt}` | Контраст текста над артом (WCAG по худшей строке блока): 28 / 28 | `tools/w3c_contrast.cjs.txt`, `tools/contrast.py.txt` |
| `run-log.txt` | Консоль конвейера, включая проверку возврата к 02.05 на 1440 / 1920 / 390 | `tools/look.cjs.txt` |
| `round1-bdba5fa/` | Раунд 1 на `bdba5fa`: регрессия 115 / 116 (R-W3C-03 на 960×540@2) и контраст 4,29 на 1920. Обе находки закрыты до QA SHA (отчёт §3.7). Второй прогон регрессии раунда 1 остановлен после находок. | `tools/run-after.sh.txt` |

Кадры — в `../../captures/w3c-impl/`.
