<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.EVIDENCE.W3C
  title: "AXIOM SHOWCASE — W3.C evidence manifest (concept prototypes, tools, measurements)"
  status: EVIDENCE / APPEND-ONLY
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-19
  editable_by_agents: true
-->
# W3.C — evidence manifest

Только доказательства к [`../../waves/W3C_WORLD_CONCEPTS.md`](../../waves/W3C_WORLD_CONCEPTS.md). Файлы этой папки **не подключены к сайту**. Скрипты лежат как `.txt`, чтобы их нельзя было принять за модули сайта.

**Условия всех замеров:**
- Снимок ветки `w3/c-world-immersion` @ `1482c47` (`git archive`; `index.html` побайтно равен `main` `9dda095`).
- Сервер `tools/serve-pages.cjs.txt`: gzip, `max-age=600`, 404-фолбэк как Pages.
- Chromium 141 (Playwright 1.56.1), пропуск лоадера через `sessionStorage`.
- Секции принудительно проявлены, чтобы кадр показывал содержимое, а не состояние появления (одинаково для BASE / A / B).

## 1. Прототипы

| Файл | Что |
| --- | --- |
| `prototypes/variant-a.js.txt` | Концепт **A · ПОРОГ**: CSS + DOM-инъекция (W01 — порог, плашки W06/W02/W04/W08, эпилог W07). |
| `prototypes/variant-b.js.txt` | Концепт **B · ОКНА / ДВЕРЬ**: титул-затмение (CSS), окна W04 / Виктор / W06, дверь W01. |
| `prototypes/variant-{a,b}-v1.js.txt` | Первая итерация до получения архива 0524: только существующие B02, карта V10, Виктор. Заменена, хранится для истории. |

## 2. Инструменты

| Файл | Что делает |
| --- | --- |
| `tools/w3c_capture.cjs.txt` | Кадры f1–f6 (порог, прыжок из меню, два скролла, выход, прыжок в VISION), длина страницы, переполнение, ошибки. |
| `tools/w3c_measure.cjs.txt` | Длина входа WORLD, видимость заголовка / строки / CTA после прыжка, резкость каждого изображения (файл ÷ нарисованные пиксели устройства), байты изображений, запросы библиотеки при открытии. |
| `tools/w3c_contrast.cjs.txt` + `tools/contrast.py.txt` | Контраст текста над изображениями: глифы скрываются, под каждой строкой берётся 90-й перцентиль яркости фона, отношение по WCAG (крупный текст 3,0, обычный 4,5). |
| `tools/bridges.cjs.txt` | F-06: полоса над `#world-guide` и `#vision` видна целиком после прыжка из меню. |
| `tools/w3c_preserve.cjs.txt` | Порядок 17 секций, sha256 текста по секциям, Canon ID, шрифты, токены, изображения. Инструмент W3.A + инъекция концепта. |
| `tools/textkeep.cjs.txt` | Каждое слово входа WORLD и мета-текста SYSTEM из BASE остаётся в документе после концепта (`textContent`, без учёта регистра). |
| `tools/compare.py.txt`, `tools/sheet.py.txt` | Листы BASE / A / B для `captures/w3c/`. |
| `tools/build_library.py.txt`, `tools/make_manifest.py.txt` | Производные библиотеки и `manifest.json`. |
| `tools/serve-pages.cjs.txt` | Статический сервер снимка. |

## 3. QA (`qa/`)

| Файл | Что |
| --- | --- |
| `capture-{base,a,b}.json` | Отчёт `w3c_capture`: 5 ширин. |
| `measure-{base,a,b}.json` | Отчёт `w3c_measure`: 8 сочетаний ширины и DPR. |
| `contrast-{a,b}.json`, `contrast-summary.json`, `contrast-summary.txt` | Строки текста, цвета, результат WCAG по худшей строке каждого блока. |
| `bridges.txt` | F-06 под концептами. |
| `preserve-{base,a,b}.json`, `textkeep.json` | Сохранность. |
| `run-log.txt` | Консольный вывод прогона. |

Изображения кадров — в `../../captures/w3c/`.
