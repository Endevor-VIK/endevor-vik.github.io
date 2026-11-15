<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.BILINGUAL_HEADINGS.README
  title: "Bilingual headings — implementation and review guide"
  status: ACTIVE
  deployment: NOT_DEPLOYED
  mode: Contributor Guide
  goal: "Сохранять единый EN/RU editorial contract"
  scope: showcase typography / motion
  lang: ru
  last_updated: 2026-11-15
  editable_by_agents: true
  change_policy: "Не менять категорию/Canon смысл без task authority"
-->
# Bilingual headings

[Контракт](SPEC.md) · [Полный аудит](HEADING_AUDIT.md) ·
[Машинный inventory](inventory.json) · [AgentOps](AGENTOPS.md) ·
[Отчёт](REPORT.md) · [112 screenshots](captures/review.html).

DISPLAY/SECTION и выбранные EDITORIAL: один существующий H1/H2/H3 с
`lang="en" data-copy-language="en"`, прежние inline fragments и accents;
следом один не-heading элемент с `lang="ru" data-copy-language="ru"
 data-language-only="ru" data-heading-translation="<audit-id>"`.
FUNCTIONAL продолжает локализоваться обычно. Proper-name исключения
обоснованы по каждой строке inventory; транслитерация рядом не дублируется.

`data-heading`, `data-heading-kind` и `data-heading-mode` связывают DOM с audit.
Эти атрибуты не являются translation keys. `data-i18n*` принадлежит только
существующим catalog bindings; не вводить в этот namespace настройки компонентов.
Видимость RU runtime задаёт через `hidden`; CSS guard закрывает streamed initial
ENG paint. Main source RU сохраняет перевод при выключенном JS. ENG не резервирует
место под скрытую строку и не создаёт английский subtitle.

В `assets/i18n/{en,ru}.json` headline fragments остаются каноническими. Новые
`heading.<audit-id>.translation` отделены от body; четыре прежних повторных
subtitle key переиспользованы. Добавлять парные ключи, не HTML. После изменения:

```sh
node assets/i18n/build-catalogs.cjs
node assets/i18n/build-catalogs.cjs --check
python3 tests/test_i18n.py
python3 tests/check_bilingual_preservation.py
```

`assets/css/bilingual-headings.css` задаёт три caption scales и контекстные
поправки существующих grid/ID-scoped styles. English headline использует исходный
Oswald, RU — JetBrains Mono, muted ink и тонкую red line. Новый wrapper для main
не нужен: исходные H/ID сохраняют CSS и anchor authority. В fan archive свои
COPY, Impact/Consolas/Segoe UI и cyan/red; его subtitles используют тот же контракт
атрибутов без переноса main stylesheet.

`AXI18n.setLanguage()` остаётся синхронным (в том числе same-locale reapply).
Ручные кнопки вызывают `transitionTo()`; `whenSettled` — Promise текущего запроса.
Fan предоставляет аналогичный `SVArchive` API. Общий `AXIOMLanguageMotion` —
только choreography, не переводчик: 80 ms exit, atomic owning-runtime commit,
180 ms enter / 8 px, RU +60 ms. Анимируются видимые текстовые элементы, не body,
секции, изображения или dialog container. Новый запрос отменяет owned animations;
в EXIT заменяется pending intent, в ENTER учитывается текущая opacity. Reduced
motion и initial preference применяются сразу. Другие CSS/WAAPI эффекты не отменяются.

Scroll фиксируется в момент commit, короткая коррекция прекращается по wheel,
touch/pointer и клавишам навигации. Viewer/tab/map/zoom/pan и focus не сбрасываются.
Fan gallery обновляет copy в существующих card nodes вместо перестройки списка.

Browser contracts (использовать существующий Playwright, не устанавливать пакеты):

```sh
NODE_PATH=/path/to/node_modules node tests/browser/i18n_regression.cjs
NODE_PATH=/path/to/node_modules node tests/browser/showcase_regression.cjs --firefox --json /owned/output.json
NODE_PATH=/path/to/node_modules node tests/browser/bilingual_headings.cjs
```

Новые output directories принадлежат harness: последние 3 runs / 14 дней,
96 MiB/run. Нет retained profile, trace или video. Проверять host C перед heavy
run. Geometry каждого heading внутри rails проверяется после прокрутки к карточке,
а затем rail восстанавливается. Native viewer opening/image/focus scroll должен
устояться до измерения language-state retention; exact XY assertions сохраняются.

Browser/agent review не заменяет CREATOR visual acceptance. Merge/deploy этой
задачи требуют отдельного подтверждения.


Текущий coverage: 110 audit entries; 45 pairs (37 main, 1 error, 7 fan).
Крупный `#work-art-band` входит в EDITORIAL; остальные компактные bridge questions
остаются FUNCTIONAL. Предыдущий 104-entry inventory сохранён историей Git.
