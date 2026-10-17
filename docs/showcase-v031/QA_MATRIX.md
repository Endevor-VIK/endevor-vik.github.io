<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.QA_MATRIX
  title: "AXIOM SHOWCASE V0.3.1 — QA Matrix"
  status: READY_FOR_PRINCIPAL_RECHECK
  deployment: NOT_DEPLOYED
  mode: QA / Evidence Index
  goal: "Фактические среды, матрица снимков, интерактив, доступность и производительность с честными статусами PASS/FAIL/NOT RUN"
  scope: apps/endevor-vik.github.io — task 0524, waves W0 + W0.1
  lang: ru
  last_updated: 2026-10-17
  editable_by_agents: true
  change_policy: "Статус меняется только новым прогоном; NOT RUN не превращается в PASS без выполнения"
  links:
    audit: ./AUDIT_REPORT.md
    handoff: ./REVIEW_HANDOFF.md
    regression_suite: ../../tests/browser/showcase_regression.cjs
-->

# AXIOM SHOWCASE V0.3.1 — QA MATRIX (W0 + W0.1 + W1)

Статусы: `PASS` · `FAIL` · `NOT RUN` (с причиной) · `INCOMPLETE` · `OBSERVED`. Пути `baseline/…`, `w01/…`, `tools/…` — относительно `sandbox/evidence/2026-10-16_0524_showcase-v031-w0-audit/` (вне git).

## 1. Среды

| Среда | Версия | Статус | Примечание |
| --- | --- | --- | --- |
| Chromium (Chrome for Testing, headless) | 149.0.7827.55, Playwright 1.61.1 | PASS (использована) | SwiftShader, без GPU: анимации считаются на главном потоке — худший случай для замеров |
| Firefox (Playwright) | 151.0 | PASS (использована) | Без `isMobile`-эмуляции; ширина вьюпорта честная |
| WebKit / Safari | — | NOT RUN | Браузер WebKit Playwright не установлен; Safari недоступен в WSL |
| Edge на реальном GPU (Windows, CDP) | — | NOT RUN | Не требовался для W0; запланирован для W3 (fps анимаций) |
| Реальные телефоны | — | NOT RUN | Нет устройств; использована эмуляция Chromium (`isMobile`, `hasTouch`, DPR 2–3) |
| Lighthouse | 12.8.2 (Chrome 149 headless) | PASS (использован) | Lab, simulated throttling |
| axe-core | 4.12.1 (`@axe-core/playwright`) | PASS (использован) | Теги wcag2a/aa, 21a/aa, 22aa, best-practice |
| Полевые CWV (CrUX) | — | NOT AVAILABLE | Для сайта с малым трафиком данных CrUX нет; INP — только лабораторный прокси |

## 2. Матрица снимков (Chromium, база `2dbb616` и W0.1)

| Вьюпорт | DPR | Первый экран | Страница сегментами | Секции (15) | Компоненты (DPR) | Firefox |
| --- | --- | --- | --- | --- | --- | --- |
| 360×800 | 1 / 2 | ✓ / ✓ | ✓ | ✓ | ✓ | — |
| 390×844 | 1 / 3 | ✓ / ✓ | ✓ | ✓ | ✓ | ✓ (1 / 3) |
| 430×932 | 1 / 3 | ✓ / ✓ | ✓ | ✓ | ✓ | — |
| 768×1024 | 1 / 2 | ✓ / ✓ | ✓ | ✓ | ✓ | ✓ (1 / 2) |
| 1024×768 | 1 | ✓ | ✓ | ✓ | — | — |
| 1280×800 | 1 | ✓ | ✓ | ✓ | — | — |
| 1440×900 | 1 / 2 | ✓ / ✓ | ✓ | ✓ | ✓ | ✓ (1 / 2) |
| 1920×1080 | 1 | ✓ | ✓ | ✓ | — | — |
| 200 % zoom (960×540) | 1 / 2 | ✓ / ✓ | ✓ | ✓ | ✓ | — |
| Ландшафт 844×390, 932×430 | 3 | ✓ | — | WORK feature | — | — |

Файлы: `baseline/shots/`, `baseline/shots-firefox/`, `w01/shots/`, `baseline/landscape/`, `w01/landscape/`. Отобранные снимки в репозитории — `docs/showcase-v031/captures/w0/`.

## 3. Геометрия, переполнение, текст (зонд `tools/probe.cjs`)

| Проверка | 360 | 390 | 430 | 768 | 1024 | 1280 | 1440 | 1920 | 200 % |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Горизонтальная прокрутка (`scrollWidth ≤ clientWidth`) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Все секции раскрываются при прокрутке | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| WORK feature не перекрыт / одна колонка на телефоне | FAIL → **PASS (W0.1)** | FAIL → **PASS** | FAIL → **PASS** | n/a | n/a | n/a | n/a | n/a | n/a |
| Смысловые подписи ≥ 11 px | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL |
| Длина страницы (экранов) | 41,8 | 38,3 | 33,8 | 27,0 | 35,2 | 28,0 | 25,4 | 21,4 | 49,7 |

Подписи и длина — открытые находки W1/W2 (A-GLB-04, A-GLB-08).

## 4. Интерактив (Chromium и Firefox, `tools/interactions*.cjs` + регрессионный набор)

| Сценарий | База | После W0.1 | Доказательство |
| --- | --- | --- | --- |
| Лоадер: первый визит показывается, Esc закрывает (≈ 0,33 с), «SKIP» тапом (390) закрывает | PASS | PASS | `interactions-*.json` |
| Лоадер: reduced-motion — не показывается | PASS | PASS | то же |
| Лоадер: время до снятия оверлея | OBSERVED 3,3–5,0 с | OBSERVED | зависит от CSS шрифтов; A-LDR-01 |
| Лоадер: ошибки консоли | FAIL (Chromium: `ERR_UNKNOWN_URL_SCHEME`) | **PASS** | R13 |
| Лоадер: первый Tab на кнопку пропуска | FAIL (фокус в `iframe`) | FAIL | A-LDR-03 (W3) |
| Якоря меню: секция у нижнего края шапки | FAIL (зазор 77 px + отступ 24 px) | **PASS** (97 = 97) | R14 |
| WORK stage: резкий кандидат после выбора | FAIL (960w, ×2,1) | **PASS** (1919w, ×1,07 — предел исходника) | R04 |
| WORK stage → лайтбокс → Esc: фокус и прокрутка | FAIL (+1319 px, фокус на карточке) | **PASS** (0 px, фокус на кнопке stage) | R05 |
| Лайтбокс: фокус остаётся в диалоге (Tab ×3) | PASS | PASS | `gallery.lightbox` |
| Указатель мыши внутри модальных диалогов | FAIL (`cursor:none`, кастомный под top layer) | **PASS** | R07 |
| Карта: 2048w не грузится до открытия | FAIL | **PASS** | R06 |
| Карта: кнопка в стиле системы | FAIL (Arial, серая) | **PASS** | R09 |
| Карта: Esc возвращает фокус на кнопку | PASS | PASS | `map.dialog` |
| WORLD: 6 узлов с клавиатуры (Enter/Space), `aria-pressed` | PASS | PASS | `world.nodesKeyboard` |
| SYSTEM: шаги потока с клавиатуры | PASS | PASS | `system.flow` |
| SYSTEM: начальное сообщение соответствует активному шагу | FAIL | FAIL | A-SYS-02 (W2) |
| `details` кейсов: Enter/Space | PASS | PASS | `details.keyboard` |
| Фокус-индикатор у ключевых контролов | PASS (цвет непоследователен) | PASS | `focus.styles`; A-A11Y-05 |
| Порядок Tab с начала страницы: ENTER AXIOM — 7-я остановка | PASS | PASS | `tab.fromTop` |
| Тап по селекторам stage (390, touch) | PASS | PASS | `mobile.stageTap` |
| Цели касания ≥ 44 px (390) | FAIL (27 целей < 44 px; 2 < 24 px: «CHRONICLE · CONTENT · AXCHAT» 12 px, «РАССМОТРЕТЬ КАРТУ» 21 px) | FAIL (27 целей < 44 px; 2 < 24 px: «CHRONICLE · CONTENT · AXCHAT» 12 px, «ОТКРЫТЬ AXIOM WEB CORE» 14 px — ссылка стала однострочной в исправленной колонке; кнопка карты теперь ≥ 24 px) | A-A11Y-04 |
| reduced-motion: CSS-анимации остановлены | PASS | PASS | `reducedMotion` |
| reduced-motion: SVG SMIL остановлены | FAIL | **PASS** | R08 |
| 404: ссылка возврата на вложенных путях | FAIL | **PASS** | R12 |
| Отказ шрифтов (Google Fonts заблокированы) | PASS (раскладка цела, фирменный вид теряется) | — | `fontfail-*.png` |
| Отказ изображений (webp/png заблокированы) | PASS (раскладка цела, видны alt) | — | `imgfail-*.png` |

**Регрессионный набор** `tests/browser/showcase_regression.cjs` (26 проверок × 2 движка):

| Состояние | PASS | FAIL | SKIP | Файл |
| --- | --- | --- | --- | --- |
| База `2dbb616` | 17 | 35 | 0 | `tests/regression-baseline-2dbb616.json` |
| W0.1 | **52** | **0** | 0 | `tests/regression-w01-run2.json` |

## 5. Регрессия визуала после W0.1

- Десктоп 1440@1, 13 секций: попиксельное сравнение до/после — изменено ≤ 0,14 % пикселей (только фазы анимаций); HERO, ABOUT, CREATOR, WORK, SYSTEM, WORLD-гид, лор — без изменений.
- Телефоны и планшет: изменились только WORK feature (одна колонка, полная композиция арта) и сетка галереи (одна колонка) — это и есть исправление; длина страницы на 360 px выросла на 957 px (сетка в одну колонку).
- Ландшафт 844×390 / 932×430: горизонтальной прокрутки нет до и после.

## 6. Доступность

| Проверка | Результат | Доказательство |
| --- | --- | --- |
| axe `color-contrast` | FAIL — 66 узлов (desktop) / 55 (mobile), все `#6d6e76` (3,87–3,97:1) | `baseline/axe.json`, `baseline/axe-contrast-groups.txt` |
| Белый текст на кримсоновых кнопках | FAIL — 3,81:1 (4,36:1 у кнопки карты) | `w01/contrast-red-fills.txt` |
| axe `heading-order`, `landmark-one-main`, `region` | FAIL (2 / 1 / 87) | `baseline/axe.json` |
| Lighthouse Accessibility | 94 (mobile и desktop, медиана) | `baseline/lighthouse/SUMMARY.txt` |
| Label in Name (WCAG 2.5.3) | FAIL → **PASS (W0.1)** | R11, R15 |
| Пауза бегущей строки (WCAG 2.2.2) | FAIL (паузы нет; reduced-motion останавливает) | A-HERO-10 |

## 7. Производительность

**Lighthouse, живой сайт `https://endevor-vik.github.io/` (`main@2dbb616`), 3 прогона, медиана:**

| Профиль | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | Вес |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mobile (simulated, 4× CPU) | 50 | 94 | 96 | 100 | 6,25 с | **8,26 с** | 195 мс | **0,125** | 9,56 с | 2 476 KiB |
| Desktop | 59 | 94 | 96 | 100 | 4,13 с | **4,13 с** | 0 мс | 0,064 | 5,18 с | 2 488 KiB |

Цели директивы: LCP ≤ 2,5 с — **FAIL** (оба профиля); CLS ≤ 0,1 — **FAIL** (mobile), PASS (desktop); INP ≤ 200 мс — лабораторный прокси (Event Timing, клики по stage/узлам/details): худшее 56–104 мс — **PASS (lab proxy)**, полевых данных нет.

Разбор LCP/CLS (Lighthouse mobile r2): LCP-элемент — `span.w` заголовка; крупнейший сдвиг 0,0699 — «Web font loaded» на `h1 span.w`; render-blocking: CSS Google Fonts (оценка экономии ≈ 870 мс) и `index.css`; main-thread 7,6 с (Style & Layout 3,4 с).

**Локальный стенд (gzip, `max-age=600`, кэш отключён), Playwright Chromium, вес:**

| Сценарий | База: начальная загрузка | W0.1: начальная загрузка | База: всё после прокрутки и кликов | W0.1: всё |
| --- | --- | --- | --- | --- |
| Desktop 1440×900 | 2 418 КБ (32 запроса) | **733 КБ** (31) | 8 868 КБ | 6 515 КБ |
| Mobile 390×844@3, Slow 4G + 4× CPU | 2 406 КБ (31) | **721 КБ** (27) | 4 857 КБ | 3 840 КБ |

Сравнение FCP/LCP/CLS «до/после» на локальном стенде **не заявляется**: CSS Google Fonts идёт через прокси хоста и колебался между прогонами (≈ 2,2 с в базовом прогоне, ≈ 0,5 с в прогоне W0.1), это перекрывает эффект правок. Честное сравнение таймингов — в W1 после самостоятельного хостинга шрифтов (без сторонней латентности).

## 8. Внешнее состояние

| Проверка | Результат | Время (UTC) |
| --- | --- | --- |
| Живой сайт = база `2dbb616` (sha256 5 файлов) | OBSERVED MATCH | 2026-10-16, до 14:01 (часы WSL) |
| `https://endevor-vik.github.io/<missing>` → `404.html`, HTTP 404 | OBSERVED | 2026-10-16, до 14:01 (часы WSL) |
| `https://axiomgates.com` | OBSERVED 503 «AXIOM GATE UNAVAILABLE», `retry-after: 30`, Cloudflare | 2026-10-16 14:01 |

## 9. Не выполнено (с причиной и передачей)

| Что | Статус | Причина | Передача |
| --- | --- | --- | --- |
| WebKit/Safari | NOT RUN | движок не установлен | W3: CREATOR на реальном iPhone/Mac или установка WebKit Playwright по согласованию (~200 МБ, хост: 50 GiB свободно) |
| Реальные телефоны, низкая мощность | NOT RUN | нет устройств | W3: эмуляция 4×/6× CPU + реальный GPU Edge; ручная проверка CREATOR |
| Браузерный зум 200 % «как у пользователя» | INCOMPLETE | эмулирован вьюпортом 960×540@2 | W3: ручная проверка CREATOR в Edge |
| Полный проход только клавиатурой по всей странице | INCOMPLETE | проверены ключевые контролы и порядок до CTA | W3 |
| Медленная сеть (тайминги до/после) | INCOMPLETE | сторонняя латентность шрифтов | W1 после self-host |

## 10. W1 (2026-10-16/17)

Среда та же (§1): Playwright 1.61.1 — Chromium 149.0.7827.55, Firefox 151.0; Lighthouse 12.8.2; axe-core 4.12.1. «До» — W0.1 `c79c3d7`, «после» — W1.

### 10.1 Регрессия `tests/browser/showcase_regression.cjs` — 116 / 0 / 0 (58 × 2 движка)

| ID | Что проверяет | Chromium | Firefox |
| --- | --- | --- | --- |
| R01 | Нет горизонтального переполнения: 360, 390, 430, 768, 1024, **1100**, 1280, 1440, 1920, ландшафт 844×390, 200 % (720×450@2), варианты `?work=a&type=b` на 390 и 1440 | PASS ×13 | PASS ×13 |
| R02 | Вступление WORK на телефонах (360/390/430), варианты B и A: одна колонка, заголовок виден, арт внутри карточки только в A | PASS ×6 | PASS ×6 |
| R03 | Один архив: 8 вкладок + 8 панелей, видна одна, нет старой сетки/stage, 4 поля кейса, колонки по ширине | PASS ×2 | PASS ×2 |
| R04 | Резкий кандидат после смены вкладки (1440@2) | PASS | PASS |
| R05 | Просмотрщик: листание вперёд и закрытие → архив на том же экране, фокус на нём, без прокрутки | PASS | PASS |
| R06, R08–R14 | Карта по требованию, стиль кнопки карты, метки VISION, reduced motion для SMIL, 404, нет ошибок консоли, имена ENTER AXIOM, якорь | PASS | PASS |
| R07 | Системный указатель в модальном окне | PASS | PASS |
| R15 | Доступные имена 8 кнопок экранов содержат видимую надпись | PASS | PASS |
| R16 | Клавиатура вкладок (APG): ←/→, Home/End, один tab stop | PASS | PASS |
| R17 | PREV/NEXT с переходом через край, объявление в live-регионе | PASS | PASS |
| R18 | Свайп по панели листает и не открывает просмотрщик | PASS | PASS |
| R19 | Просмотрщик: 1:1 на lossless + панорамирование, FIT, End/→ по кругу, Z по физической клавише (кириллица) | PASS | PASS |
| R21 | Лоадер при первом визите: 1,2–1,65 с от появления до удаления, SKIP — первая точка Tab, метка 24 ч, прокрутка разблокирована | PASS | PASS |
| R22 | Повтор через 1 ч — нет; через 25 ч — есть | PASS ×2 | PASS ×2 |
| R23 | Хранилище заблокировано (`setItem` бросает / геттер бросает) — нет лоадера, нет блокировки, нет ошибок | PASS ×2 | PASS ×2 |
| R24 | Esc убирает заставку ≤ 450 мс | PASS | PASS |
| R25 | reduced motion — нет лоадера | PASS | PASS |
| R26 | Без JS: нет оверлея, видны все 8 экранов, элементы управления скрыты | PASS | PASS |
| R27 | CONTACT: Telegram / GitHub / axiomgates, новая вкладка, `noopener` | PASS | PASS |
| R28 | CONTACT в меню 1280 без наезда на статус; мобильная полоса сама показывает VISION | PASS ×2 | PASS ×2 |
| R29 | Нумерация 01–07; метка скрыта над HERO и показывает «01 / AXIOM» ниже | PASS | PASS |
| R30 | Варианты: по умолчанию TYPE A / WORK B; `?work=a&type=b` — арт в WORK перед архивом, заголовки Unbounded | PASS | PASS |
| R31 | Текст на ярко-красных заливках ≥ 4,5:1 (13 элементов) | PASS | PASS |
| R32 | Нет розового/пурпурного/сливового в вычисленных стилях страницы | PASS | PASS |
| R33 | Шрифты свои: 0 запросов к Google Fonts, Oswald / JetBrains Mono / Golos загружены | PASS | PASS |
| R34 | Резкость: архив на 390@3; A02 на 1440@2 (≥ 0,95), B04 — крупнейший кандидат | PASS ×2 | PASS ×2 |
| R35 | Ландшафт 844×390: ENTER AXIOM в первом экране | PASS | PASS |
| R36 | Маркеры 01/02/03 не перекрывают заголовок (скрыты < 1536 px) | PASS ×2 | PASS ×2 |

Smoke: `tests/smoke_showcase.py`, `tests/smoke_showcase_v23.py` — PASS.

### 10.2 Доступность, палитра, изображения, производительность

| Проверка | До (W0.1) | После (W1) | Источник |
| --- | --- | --- | --- |
| axe desktop / mobile | 4 / 4 правила (контраст 67 / 56 узлов) | 0 / 0 | `a11y/axe-*.json` |
| Контраст текста на красных заливках | 3,81:1 | 5,31:1 | `a11y/red-fills-*.txt` |
| ENTER AXIOM (пиксели, худшие 5 %) | ≥ 9,75:1 | ≥ 9,75:1 | `a11y/enter-contrast-*.json` |
| Розовый по отрисовке (страница 1440, UI) | 3,13 % | 0,70 % | `palette/` |
| Резкость < 0,95 (9 конфигураций) | 36 | 13 (все — предел оригинала) | `images/sharpness-*.json` |
| Lighthouse mobile Perf / LCP / CLS | 77 / 4,77 с / 0,127 | 97 / 2,41 с / 0,020 | `lighthouse-summary.json` |
| Lighthouse desktop Perf / LCP / CLS | 98 / 0,93 с / 0,062 | 100 / 0,53 с / 0,005 | там же |
| Lighthouse Accessibility | 94 | 100 | там же |

### 10.3 Не выполнено в W1

| Что | Статус | Причина / передача |
| --- | --- | --- |
| WebKit / Safari, реальные устройства, реальный GPU | NOT RUN | Нет в среде → W3 / ручная проверка CREATOR |
| Ручной проход скринридером | NOT RUN | W3 |
| Полевые CWV, живой GitHub Pages | NOT RUN | Деплой HOLD |
| Браузерный зум «как у пользователя» | INCOMPLETE | Эмулирован как 720×450@2 (CSS-вьюпорт 200 %) |

## 11. W1.R (2026-10-17)

Код `0bfc05fa`; «до» — W1 `b5ae1f3f` (отдельный worktree и сервер). Полностью — `W1R_REPORT.md` §4.

| Проверка | Chromium 149 | Firefox 151 |
| --- | --- | --- |
| Регрессия, 57 проверок | 57 PASS | 57 PASS |
| R30 старые адреса `?work=a&type=b`, `?work=b&type=a`, `?type=b` → финальная страница, 0 запросов Unbounded | PASS ×3 | PASS ×3 |
| R37 эмблема AXIOM по отрисовке (1440@1, 390@2, reduced motion): заметный розовый < 0,5 % | PASS ×2 | PASS ×2 |
| Удалено: R30 (варианты A/B) в старом виде, проверки вариантного DOM | — | — |

| Проверка | W1 | W1.R |
| --- | --- | --- |
| axe desktop / mobile | 0 / 0 | 0 / 0 |
| Блок AXIOM ∅, заметный розовый 1440 / 390 | 3,42 % / 2,10 % | 0,086 % / 0,015 % |
| Вся страница сегментами, UI, заметный 1440 / 390 | 0,247 % / 0,243 % | 0,048 % / 0,030 % |
| Lighthouse mobile Perf (3 прогона) / LCP / CLS | 97 (98/97/97) / 2,41 с / 0,013 | 95 (97/95/94) / 2,41 с / 0,013 |
| Lighthouse desktop Perf / LCP / CLS | 100 / 0,53 с / 0,003 | 100 / 0,53 с / 0,004 |
| Резкость < 0,95 | 13 | 13 |
| Smoke | PASS | PASS |

NOT RUN: WebKit/Safari, реальные устройства, скринридер, полевые CWV, живой Pages. INCOMPLETE: зум браузера (эмулирован вьюпортом).

