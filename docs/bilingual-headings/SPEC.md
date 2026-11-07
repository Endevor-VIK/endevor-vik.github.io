<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.BILINGUAL_HEADINGS.SPEC
  title: "Global bilingual typography and language transitions"
  status: DISCOVERY
  deployment: NOT_DEPLOYED
  mode: Task Contract
  goal: "Единая editorial-логика заголовков и управляемый переход ENG/RU"
  scope: public showcase, auxiliary pages, standalone fan archive
  lang: ru
  last_updated: 2026-11-07
  editable_by_agents: true
  change_policy: "В scope текущей директивы CREATOR; merge/deploy отдельно"
-->
# Контракт: bilingual headings / language transitions

Основание: новая директива CREATOR «SHOWCASE — GLOBAL BILINGUAL TYPOGRAPHY &
LANGUAGE TRANSITIONS» и три приложенных screenshots. Она задаёт новую норму,
superseding предыдущий перевод крупных headlines на RU. Прежнее разрешение
merge PR #14 не разрешает merge/deploy новой задачи.

База `origin/main`: `adb87e5b8c8ba778aedfddd0655ec0b957e045ef` (PR #14 merged).
Ветка `feature/showcase-global-bilingual-headings`; isolated worktree
`/home/axiom/ENDEAVOR/AXS-WORKTREES/showcase-global-bilingual-headings`.
Shared landing main чистый; root foreign delta и gitlink вне scope.

Исходный дефект: DISPLAY/SECTION headlines меняют язык вместе с body; четыре
W4 editorial пары повторяют одну фразу на активном языке. Ручной switch мгновенный.
Перед product mutation обязателен полный inventory, включая 62 H1–H3 index,
non-H visual headings, dynamic viewers, loader/404 и самостоятельный fan archive.
Решение для каждого фиксируется в `HEADING_AUDIT.md` / machine-readable inventory.

Целевое поведение: DISPLAY/SECTION и уместные EDITORIAL сохраняют одинаковую
каноническую EN-фразу в обеих локалях и `lang=en`. В RU ниже один подчинённый
художественный перевод с `lang=ru`; в ENG он `hidden`, исключён из layout и
accessibility tree. FUNCTIONAL titles локализуются обычно; proper-name/invariant
исключения обосновываются индивидуально. Настоящий body copy не удаляется.

Дизайн: TYPE A / RED PROTOCOL; display Oswald, muted JetBrains Mono subtitle,
тонкий красный штрих вместо яркой плашки. Палитра owning tokens сохраняется:
red #ff2034, background #070709, graphite #0d0e12, ink #f1f1f4,
secondary #c9c9d1, line #2a2a33. Общий шаблон с display/section/editorial
вариантами сохраняет разные секционные композиции. Fan archive сохраняет
свои Impact/Consolas/Segoe UI, cyan/red palette и отдельный характер.

Архитектура: расширение существующих en/ru JSON + generated catalogs + i18n.js;
explicit locale override и language-only subordinate element, без второй системы
переводов. Существующая отдельная COPY fan archive расширяется согласованно.
Без translation HTML insertion, копии страницы, платных API/framework.

Motion: только текстовые композиции, ориентир 260 ms / 8 px / ease-out;
RU subtitle появляется с ~60 ms stagger. Exit → atomic locale update → enter,
last intent wins при быстрых кликах. Initial detection и reduced motion — сразу.
Нельзя гасить весь site, перезапускать loader, блокировать долгим ожиданием,
терять focus/scroll/viewer/zoom/pan/tab/map/flow. Visibility/layout меняются
в одном управляемом batch; не резервировать пустое место ENG subtitle.

Preservation: все section/anchor/Canon IDs и URLs, слова/факты body, 8 WORK screens,
растровые assets/srcset/loading, шрифты, палитра, artwork, cursor, original motion.
Вне scope: version bump, Canon write, backend, root gitlink, shared-main mutation,
production deployment. Rollback до merge: main остаётся базой; после отдельного
разрешения merge — обычный revert scoped commits, без rewrite history.

Владение: Lead единственный product writer (markup/runtime/CSS/integration).
Specialists: read-only full inventory/editorial, motion architecture, test planning;
дальнейшие test/evidence изменения назначаются отдельно, без overlapping writers.

QA: source completeness/category decisions + canonical EN / RU translation mapping;
no duplicate phrase / real body preserved / hidden a11y + language semantics;
84 i18n + 232 browser contracts с точечной адаптацией изменённых ожиданий;
new transition tests (actual exit/enter, reduced motion, rapid clicks, settled state,
no race/flash, state/scroll/pan retention, streamed initial render, layout shifts).
ENG/RU visual matrix 320/390/768/1024/1440/1600; все основные секции, auxiliary
pages и fan archive, normal/reduced motion и keyboard. Chromium + Firefox.
NOT_RUN фиксируется отдельно; агентские screenshots не заменяют CREATOR acceptance.

Host guard: Windows C 91,892,539,392 B free (~85.6 GiB), healthy. Existing tools
reused, без установки браузеров/пакетов. Temporary owned browser output: последние
3 runs / 14 дней и size ceiling на write; no profiles/traces/video retention.

Stop: foreign overlapping delta, host critical, Canon ambiguity, blocking regression
или scope выходящий за директиву. Известная геометрическая зависимость HERO grid
проверяется до тиражирования шаблона. Отчёт `REPORT.md`, audit `HEADING_AUDIT.md`,
captures/evidence выбранные в Git; PR передаётся CREATOR без merge/deploy.
