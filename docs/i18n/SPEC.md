<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.I18N.SPEC
  title: "AXIOM SHOWCASE — ENG/RU implementation contract"
  status: READY_FOR_REVIEW
  deployment: NOT_DEPLOYED
  mode: Task SPEC
  goal: "Полная ENG/RU локализация без изменения дизайна и фактов"
  scope: public showcase, loader, 404, existing character archive language preference
  lang: ru
  last_updated: 2026-11-07
  editable_by_agents: true
  change_policy: "Только в scope директивы CREATOR LANDING INTERNATIONALIZATION"
-->
# Контракт реализации ENG / RU

Основание: текущая директива CREATOR «LANDING INTERNATIONALIZATION — ENG / RU».
База: `Endevor-VIK/endevor-vik.github.io`, `origin/main` = `b4d9c4dcd63131079c0cf8ccee80ecc00d3c5994`.
Ветка: `feature/showcase-i18n-en-ru`; отдельный worktree, исходный checkout чистый.
Это отдельная локализация после 0524, а не разрешение продолжить остальные AAA waves.

Наблюдаемое исходное поведение: основной лендинг/404 смешивают RU prose и ENG UI;
выбор языка, его сохранение и переводы динамических состояний отсутствуют.

Результат: `?lang=en|ru` → сохранённый ручной выбор → главный язык браузера → ENG;
версионированный storage key, безопасный отказ storage, мгновенное переключение,
`html.lang`, метаданные и весь пользовательский текст. Неподдерживаемый главный
язык браузера даёт ENG, даже если следующий язык в списке — RU.

Архитектура: авторские плоские JSON-словари по языкам; производный browser catalog;
маленький runtime без зависимостей. Комментарии `i18n:key` маркируют отдельные
text nodes без перестройки разметки; `data-i18n-ATTR` маркируют доступные атрибуты.
Вставка переводов только через textContent/nodeValue/setAttribute с allowlist.
Динамические компоненты обновляют свои подписи по событию языка, сохраняя состояние.
Первичная локализация завершается до показа текста; отказ JS оставляет исходную страницу.
Переключатель в шапке и открытых dialogs доступен клавиатурой и на телефоне.

Сохраняются: RED PROTOCOL, палитра, фирменные шрифты, HERO, WORK B и 8 экранов,
порядок/ID всех секций, Canon ID и утверждения, изображения и их загрузка, анимации,
курсор, AXIOM URLs, состояния details/map/archive/dialog/zoom, scroll/focus при смене.
Разрешены только локальные корректировки геометрии для переведённых строк.
Canon reference read-only: `3884ea43e125ddd39b18c80f91cc40310dd65e9f`.

Владение: Lead — runtime, annotation tooling/integration, loader/404/dynamic modules,
CSS переключателя, AgentOps/PR; специалисты — отдельные translation shards в /tmp,
позже independent review. Пересекающихся writers нет. Основные checkouts не для QA.

DoD/QA: полнота/непустота/равенство ключей; coverage static/dynamic strings;
существующие smoke и browser regression; Chromium + Firefox, оба языка при
320/390/768/1024/1440/1600; storage/query/browser priorities; reload; unavailable
storage; keyboard/anchors; HERO/WORK/open viewer/map; loader/404; mobile header;
no-JS/reduced motion; screenshots ENG/RU desktop/mobile; отдельный report реальных
PASS/FAIL/NOT_RUN. Browser profiles/traces не сохраняются; временные QA runs:
последние 3 или 14 дней с owner marker и ограничением размера при записи.
Perf: без framework/backend/network translation, второго DOM и image changes.
Сравнить payload/first paint/layout shifts в одинаковом локальном окружении.

Вне scope: новая SEO URL-структура, hreflang, растр/редизайн, версии, Canon write,
root gitlink/trace mutation, изменения чужих веток, merge main и production deploy.
GitHub PR — review delivery, визуальная приёмка и release решение за CREATOR.
Rollback после отдельного разрешённого merge: обычный revert scoped commits;
до merge — main не изменён, feature branch изолирована.

Стоп: неожиданный foreign delta; host critical disk; factual/canon conflict;
неустранённая регрессия. Отчёт/снимки: `docs/i18n/REPORT.md`, `docs/i18n/captures/`.
