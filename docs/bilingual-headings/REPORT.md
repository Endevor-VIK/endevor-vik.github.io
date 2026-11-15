<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.BILINGUAL_HEADINGS.REPORT
  title: "Global bilingual typography — implementation and measured QA"
  status: READY_FOR_PRINCIPAL_REVIEW / CREATOR_VISUAL_HOLD
  deployment: NOT_DEPLOYED
  mode: Delivery Report
  goal: "Отделить реализованное, проверенное и ожидающее визуальной приёмки"
  scope: showcase-global-bilingual-headings
  lang: ru
  last_updated: 2026-11-15
  editable_by_agents: true
  change_policy: "Обновлять по фактическому evidence; merge/deploy только CREATOR"
-->
# Global bilingual typography — передача на ревью

**IMPLEMENTED + VERIFIED (automated); CREATOR visual acceptance pending.**
Большие editorial headlines теперь сохраняют один EN-текст в обеих локалях.
В RU появляется подчинённый художественный перевод; в ENG он `hidden`, без
места в layout и accessibility tree. Четыре повторявших headline абзаца
преобразованы в перевод, содержательная проза сохранена.

База: merged PR #14, `adb87e5b8c8ba778aedfddd0655ec0b957e045ef`.
Ветка: `feature/showcase-global-bilingual-headings`, isolated worktree.
[PR #15](https://github.com/Endevor-VIK/endevor-vik.github.io/pull/15) — OPEN / DRAFT;
remote recovery / delivery `0d0c4f82240c103a2915e026981c24714fdfefbe`.
Последний runtime/test commit: **`ae3dc2d33cf68d76b95346775b695342473455fd`**.
Последующие delivery-файлы не меняют runtime. `main`, production, root gitlink,
Canon и продуктовая версия этой задачей не изменялись.

## Реализация и аудит

[HEADING_AUDIT](HEADING_AUDIT.md) / [inventory](inventory.json): **110 решений**,
включая все 62 H1–H3 главной страницы, 1 H1 страницы 404, 7 H1/H2 фан-архива,
loader, visual non-H titles и динамические подписи viewer/map/flow.
**45 bilingual pairs: 37 main + 1 error + 7 fan.** Названия продуктов, органов
управления и proper names имеют индивидуально обоснованные решения.

При продолжении визуальный просмотр выявил пропуск прежнего 104-entry inventory:
крупную фразу `FROM PRINCIPLES TO IMPLEMENTED SCREENS` в art-band перед WORK.
Все шесть `.v22-bridge b` сначала внесены в audit коммитом `1c8b0a8`, затем
крупный art-band переведён на bilingual-шаблон (`ae3dc2d`). Пять компактных
навигационных вопросов остаются FUNCTIONAL / localized. Art-band copy теперь
доступен вспомогательным технологиям; его изображения и композиция сохранены.
Также явно размечены invariant названия ENDEAVOR/VOIDLINK в faction cards.

Общий CSS сохраняет TYPE A / RED PROTOCOL: исходный Oswald, приглушённый
JetBrains Mono 12–15 px и тонкий красный штрих. Учитываются HERO poster/landscape
grids, centered CTA/epilogue, archival aside, compact cards и art-band.
Самостоятельный `/serafim-veyr/` использует свой Impact/Consolas/Segoe UI,
собственные цвета и COPY; AXIOM stylesheet туда не переносится.

Существующая i18n-система расширена fixed-locale bindings и RU-only элементом.
Добавлено 34 ключа в каждый основной каталог; исходные 929 EN-значений сохранены.
В RU из исходных значений изменены только регистр/пунктуация четырёх прежних
повторных captions. Ни один исходный translation binding не потерян.

Motion управляет только видимым текстом: **80 ms exit → atomic locale commit →
180 ms enter**, сдвиг 8 px, subtitle stagger **60 ms**. `setLanguage()` остаётся
синхронным; кнопки вызывают `transitionTo()`. Быстрые запросы сохраняют последний
выбор. Initial preference / reduced motion применяются сразу. Остановленные
WAAPI animations освобождаются ограниченным deadline; fault injection завершился
примерно за 563–564 ms без оставленных animations/markers.

## Измеренный QA

Все browser runs — локальный static server из isolated worktree, Playwright 1.61.1,
Chromium **149.0.7827.55** и Firefox **151.0**. Тесты движков выполнялись последовательно;
не устанавливались пакеты или браузеры. Исходники в каждом измеренном run сверены
hashes до/после. Привязка к SHA находится в raw JSON, не выводится из текущего HEAD.

| Проверка | Результат | Evidence |
| --- | --- | --- |
| Bilingual / geometry / motion | **124/124 PASS**, 0 FAIL / NOT_RUN в наборе | [bilingual-browser.json](evidence/bilingual-browser.json) |
| Прежние i18n-сценарии | **84/84 PASS**, 0 FAIL / NOT_RUN | [i18n-browser.json](evidence/i18n-browser.json) |
| Прежняя browser regression | **232/232 PASS**, 0 FAIL / SKIP | [existing-browser.json](evidence/existing-browser.json), [source trace](evidence/existing-source.json) |
| Source/catalog contracts | **6/6 PASS** | `python3 tests/test_i18n.py` |
| Structural smoke | **2/2 PASS** | `smoke_showcase.py`, `smoke_showcase_v23.py` |
| Preservation against merged PR #14 | **PASS** | [preservation.json](evidence/preservation.json), `tests/check_bilingual_preservation.py` |
| Generated catalogs / JS syntax / diff whitespace | **PASS** | Повторены после последнего runtime изменения |

**Всего: 440 основных browser checks, 0 FAIL.**

124-case набор проверяет все 45 пар в ENG/RU, канонический английский, subordinate
semantics, настоящий коллапс скрытого перевода, отсутствие переполнения/наложений,
caption font/scale/центрирование; обе локали на **320 / 390 / 768 / 1024 / 1440 /
1600** для main, fan, 404 и loader wordmark. Для gallery rail сначала открывается
нужная карточка, затем восстанавливается исходный scrollLeft.

Проверены фактические exit/commit/enter, stagger и opacity keyframes, rapid clicks,
sync API, stalled animation deadline, reduced motion в начале и во время перехода,
first paint и специально задержанный streamed HTML. В Chromium измерено:
**main duration 260 ms**, filtered CLS **0**; raw input-associated shift около
**0.00538** отражает предусмотренное изменение высоты перевода. Firefox не реализует
Layout Instability API: его CLS — **NOT_RUN**, а не нулевой результат.

Open WORK/map сохраняют URL изображения, открытый dialog, focus, 1:1 zoom и pan
(WORK 90/40, map 100/55), выбранные Canon node / flow step / disclosure.
Fan сохраняет 21 загруженную original-карточку, сами DOM nodes, фильтр, slider 63,
open viewer/counter/focus и возврат фокуса по Escape. Scroll и высота sticky header
сохраняются; wheel по намерению пользователя продолжает прокрутку.
Прежний i18n suite дополнительно проверяет Tab/Enter/Space, accessible labels,
storage/query/reload, loader/404, error copy, no-JS и безопасную вставку text.

### Неудачные и промежуточные прогоны

[Первый прогон](evidence/initial-browser-failures.json) на `ddd818c` — **77 PASS /
7 FAIL**. Chromium неожиданно завершился до 6 оставшихся сценариев; причина его
закрытия не установлена, memory/OOM свидетельств не найдено. Все 6 прошли в
[изолированной диагностике](evidence/chromium-motion-diagnosis.json). В Firefox
мгновенное чтение scroll после wheel дало 1 FAIL; [изолированный повтор](evidence/firefox-wheel-diagnosis.json)
прошёл. В `1797c0b` добавлены направление wheel в viewport, ограниченное ожидание
реальной прокрутки и последующая проверка, что движение не откатилось.
Ожидаемый scroll threshold не ослаблен. [Полный 124-case run до art-band correction](evidence/pre-art-band-browser.json)
и финальный 124-case run на `ae3dc2d` не содержат FAIL.

Внешняя оболочка финального 124-case run сообщила exit 143 после записи полного
`RESULT`/JSON. Это отдельно от результатов browser assertions: все 124 записи и
совпадающие source hashes сохранены; процессов этого run после завершения не было.
Это ограничение исполнения не скрывается за счётчиком PASS. Дополнительный
[14-case lifecycle run](evidence/lifecycle-browser.json) повторил все motion/rapid/scroll/stall
сценарии в обоих движках: **14/14 PASS, exit 0**. Основные 440 checks не включают
этот повторный счётчик.

## Визуальные материалы и ограничения

[Локальный review atlas](captures/review.html) содержит **112 неизменённых PNG**:
28 композиций × ENG/RU × 1440×900 / 390×844, DPR 1, около **31.4 MiB**.
[Manifest](evidence/captures.json) хранит имена, размеры и SHA256 оригинальных PNG.
В Git сохраняются исходные screenshots; временные уменьшенные contact sheets
использованы только для агентского просмотра и не подменяют исходные пиксели.

Покрытие: HERO, ABOUT, CREATOR/mottos/art-band, WORK, visual studies, SYSTEM,
WORLD entry, BLACK SUN/doctrine, LIFE UNDER CONTROL, world map chapter,
CHARACTERS, FACTIONS, epilogue, VISION, CONTACT, final CTA; все 7 основных
композиций fan archive, 404 и loader. Проверена иерархия, переносы, зазоры и
соседство artwork. Автоматическая геометрия проверяет каждую bilingual пару;
визуальный section sample не означает индивидуальную human certification всех
functional labels и текста вне кадра.

**Наблюдаемое прежнее ограничение:** мобильный loader сохраняет наложения
декоративных HUD/log-подписей (ранее отмеченный N-1 / W3.D). Wordmark AXIOM
не обрезан, новая дублирующая строка для бренда не вводилась. Полный редизайн
loader вне текущего heading correction; эти кадры не объявляются визуально
безупречными. Нет нового loader flash, restart или изменения его startup timeline.

**NOT_VERIFIED:** Safari/WebKit в этой задаче, реальные устройства/GPU, ручной
screen reader, actual 200% browser zoom, новые Lighthouse/field CWV и production.
**CREATOR DECISION REQUIRED:** визуальная приёмка и отдельное разрешение merge/deploy.
Независимый Principal review не подменяется авторским QA.

## Воспроизведение и передача

```sh
python3 tests/test_i18n.py
python3 tests/check_bilingual_preservation.py
python3 tests/smoke_showcase.py
python3 tests/smoke_showcase_v23.py
node assets/i18n/build-catalogs.cjs --check
NODE_PATH=/path/to/playwright/node_modules node tests/browser/bilingual_headings.cjs
NODE_PATH=/path/to/playwright/node_modules node tests/browser/i18n_regression.cjs
NODE_PATH=/path/to/playwright/node_modules node tests/browser/showcase_regression.cjs --firefox --json /owned/report.json
```

Перед heavy run проверить Windows C согласно host protocol. Новый harness ограничен
96 MiB/run и хранит последние 3 runs / 14 дней. Эта передача сохраняет один выбранный
набор screenshots и raw JSON; собственные временные browsers/servers/output удаляются.
Shared main, чужие worktrees/evidence и root delta не очищаются.

Rollback до merge: feature branch не влияет на опубликованную базу. После отдельного
решения merge — обычный revert по отдельной authority, без переписывания history.
Точный remote recovery point и PR фиксируются в [AgentOps](AGENTOPS.md) и living handoff.
