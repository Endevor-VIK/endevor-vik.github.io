<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.I18N.GUIDE
  title: "ENG / RU — сопровождение переводов"
  status: ACTIVE
  deployment: NOT_DEPLOYED
  mode: Maintenance Guide
  goal: "Добавлять переводы без изменения структуры страницы"
  scope: public showcase localization
  lang: ru
  last_updated: 2026-11-07
  editable_by_agents: true
  change_policy: "Сохранять соответствие runtime и проверок"
-->
# Переводы AXIOM SHOWCASE

Источники переводов: [en.json](../../assets/i18n/en.json) и [ru.json](../../assets/i18n/ru.json).
Это плоские словари с одинаковыми стабильными ключами. Сгенерированный
`assets/i18n/catalogs.js` хранится в Git: GitHub Pages не требует сборки или backend.

Для изменения текста отредактируйте соответствующий ключ в обоих JSON, затем выполните:

```bash
node assets/i18n/build-catalogs.cjs
python3 tests/test_i18n.py
python3 tests/smoke_showcase.py
python3 tests/smoke_showcase_v23.py
```

Для нового фрагмента используйте свободный смысловой ключ; существующие ключи
не перенумеровывайте. Текстовый узел отмечается комментарием
`<!--i18n:section.key|["",""]-->Текст`. Массив после `|` задаёт точные пробелы
до и после текста, например `["\n  "," "]`. Они берутся из исходной разметки;
это сохраняет межсловные пробелы даже при поступлении HTML частями.
Маркеры без массива также поддерживаются. Комментарии не меняют структуру DOM
и не влияют на CSS-селекторы или оригинальные вложенные теги.

Для элемента, целиком принадлежащего одному ключу, используйте `data-i18n="key"`.
Не ставьте его на контейнер с дочерней разметкой: runtime заменит всё содержимое
его текстом. Доступные атрибуты отмечаются `data-i18n-aria-label`,
`data-i18n-alt`, `data-i18n-title`, `data-i18n-content`, `data-i18n-data-text`,
`data-i18n-data-showcase-title` и `data-i18n-data-screen-label`.
`data-text` нужен и для визуальной копии надписи ENTER AXIOM в CSS.

В словарях хранится только текст. HTML и JavaScript не исполняются: runtime
использует `nodeValue`, `textContent` и ограниченный набор атрибутов. Переменные
записываются как `{title}` или `{date}` и передаются в
`AXI18n.t('key', { title: value })`. Набор переменных должен совпадать в языках.
Имена, Canon ID, версии, технические коды и названия файлов сохраняются.
Не превращайте internal/concept/planned в публично доступную функцию.

Динамические компоненты слушают `axiom:languagechange`: обновляют подписи своего
текущего состояния, сохраняя выбор, zoom, открытый dialog и focus.
`AXI18n.setLanguage('ru')` выполняет ручной выбор;
`{persist:false}` меняет язык без записи preference/URL.
`AXI18n.switcher()` создаёт стандартную группу ENG / RU для панели dialog.
После ручной смены browser scroll anchoring отключается до новой загрузки страницы:
это удерживает выбранные координаты и при позднем reflow открытого viewer.

Приоритет: корректный `?lang=en|ru` → сохранённый ручной выбор в
`axiom.showcase.language.v1` → **первый** язык `navigator.languages`, либо
`navigator.language` → ENG. `de-DE, ru-RU` даёт ENG. Некорректные значения
игнорируются. URL-параметр сам по себе не заменяет сохранённый ручной выбор;
последующий ручной выбор обновляет существующий `?lang=` в URL, чтобы reload
не возвращал старый override. Отказ storage безопасен.

Общий preference helper используется и существующим самостоятельным
`/serafim-veyr/`: его собственные EN/RU тексты и галерея сохранены. Это другой
персонаж и другой художественный проект; не путать его с Seraphine Veyr из Canon.

Проверка в браузерах использует уже установленный Playwright, без установки
зависимостей в этот статический репозиторий:

```bash
NODE_PATH=/path/to/existing/node_modules node tests/browser/i18n_regression.cjs
NODE_PATH=/path/to/existing/node_modules node tests/browser/showcase_regression.cjs --firefox
```

Первый набор сохраняет screenshots и JSON в `/tmp/axiom-showcase-i18n-browser`,
оставляет не более трёх собственных runs за 14 дней и ограничивает run 96 MiB.
`--out` позволяет выбрать другой пустой каталог; существующие чужие данные
не удаляются. Не сохраняйте browser profiles, traces или videos.

Новый язык требует добавить словарь, включить его в builder и preference helper,
добавить доступный переключатель и расширить тесты/viewport matrix. Не считать
добавление одного JSON завершённой локализацией.

`html.lang`, title, description и OG/Twitter обновляются во время работы страницы.
Статический HTML сохраняет исходный fallback. Это **не** отдельные SEO-страницы
для поисковых роботов; фиктивные `hreflang` и новые canonical URL не добавляются.

Контракт: [SPEC](SPEC.md). Проверки и ограничения: [REPORT](REPORT.md).
Точная Git-трасса: [AGENTOPS](AGENTOPS.md).
