<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4.WORLD_NARRATIVE_AUDIT
  title: "0524.W4 — G0/G1 audit and execution contract"
  status: G0_G1_COMPLETE / GATE_A_PENDING
  deployment: NOT_DEPLOYED
  mode: Audit / AgentOps continuation
  goal: "Согласовать понятную историю WORLD до изменения публичной страницы"
  scope: Landing WORLD / WORK contextual migration / task 0524.W4
  lang: ru
  last_updated: 2026-10-19
  editable_by_agents: true
  change_policy: "Сценарий принимает CREATOR/Principal; G2 только после Gate A"
-->

# 0524.W4 — G0/G1: история прежде досье

**Результат этой стадии:** аудит исходного кода, источников Canon и утверждённых решений; конкретный сценарий для Gate A. В этой ветке меняются только документы. G2–G4, визуальная приёмка и публикация ещё не выполнены.

Входящий контракт: [директива CREATOR](W4_CREATOR_DIRECTIVE.md). Это продолжение **0524**, отдельный root ID не выделяется. Local AgentOps trace — §7 этого файла и [текущий handoff](../../AAA_CURRENT_HANDOFF.md).

## 1. Проверенный baseline и authority

| Объект | Измеренное состояние / источник |
| --- | --- |
| Landing remote `main` | `6b082e5f262c09a123748273da42277d3a29a6c2`, после `git fetch origin`; merge PR [#10](https://github.com/Endevor-VIK/endevor-vik.github.io/pull/10), W3.C |
| Исходный основной checkout | clean `main`, `c430017b3e4e3469b8d456ddf7a47e9a90acd049`, behind 30. Позже повторная проверка обнаружила clean main `6b082e5`; W4 не выполнял pull/merge/switch этого checkout |
| Рабочая ветка W4 | `docs/0524-w4-world-narrative-g0-g1`, создана от exact `6b082e5` |
| Worktree | `/home/axiom/ENDEAVOR/AXS-WORKTREES/0524-w4-world-narrative-g0-g1` |
| Canon remote `main` | `3884ea43e125ddd39b18c80f91cc40310dd65e9f`; подтверждён `gh api .../branches/main --jq .commit.sha`, checkout clean; SSH fetch недоступен по авторизации |
| Root AXS | `a1fe92bfae13a1374f7e79ca816f4b1188848fba`; исходно foreign delta `.claude/settings.json`, child refs, untracked sandbox archives. Не включены в W4 |
| Root gitlinks | landing `80595af2b2e21d18e86713971e6bb071b679dfb3`, Canon `0b1c4bab8650b2998b4ea1147e8710508de46281`; отдельно от child HEAD, без продвижения |
| Активные PR на старте | Connected GitHub search + `gh pr list`: открытых PR не обнаружено; #10 merged, head `bee738ed562a9e339a6fd7ea17958f57e7322f56` |
| Disk guard | Windows C: `54,608,642,048` bytes free из `511,206,285,312` (≈50.86 GiB / 10.68%); выше WARNING. Прочитан host hygiene protocol |

Нормативные решения проверены по local AGENTS, AAA protocol/roadmap/scorecard, W1/W1.R, W2/W2.R, decision register, W3.A и W3.C. Ссылки на SHA в старых handoff — snapshots. Старый верхний блок handoff ещё называл #10 неслитым; актуальное принятие W3.C находится в [W3C report §7](../W3C_IMPLEMENTATION_REPORT.md#7-gate-record--principal--creator-2026-10-19) и подтверждается Git. W4 добавляет новый текущий блок, не переписывая исторические решения.

| Принятое решение | Что сохраняет W4 |
| --- | --- |
| W1.R: WORK B, TYPE A | Один архив, восемь настоящих экранов, существующий viewer; Oswald / JetBrains Mono / Golos Text |
| W2.R: D-01…D-17 | Canon ID 02.01…02.06, ECHO ≠ Black Echo, SYSTEM INTELLIGENCE, NEURA relation core, SEALED, исторические статусы |
| W3.A / PR #7 | Poster frame, RED PROTOCOL, navigation, custom cursor; вне W4 visual scope |
| W3.C / PR #10 | Вход A, W01, W02/W04/W06/W08, W03 OMEGA-0, W07; художественная ассоциация не становится фактом географии |
| Новая W4 директива | Переработка повествования и перенос product demos переопределяют прежнее требование сохранять их текст; **не** открывают protected areas |

## 2. Inventory: текущая последовательность

Строки ниже — [index.html на 6b082e5](https://github.com/Endevor-VIK/endevor-vik.github.io/blob/6b082e5f262c09a123748273da42277d3a29a6c2/index.html). Это source audit, а не новая браузерная съёмка.

| Сцена / anchor | Строка | Изображение / interaction | Нарративная проблема |
| --- | --- | --- | --- |
| Entry `#world-guide`, `#world-entry` | 573 / 580 | W01; CTA → `#world-entry`; trail и glossary/details | Красивый порог, затем сразу абстрактные последствия; пояснения о сохранении старой версии сайта отвлекают от мира |
| Doctrine `#manifesto` | 586 | W06; RED/NEXARCH terminal, 5 fragments | Доктрина предшествует контексту; h2, цитата и fragment 01 повторяют ампутацию и заявляют единую причину |
| Four Surfaces `#modules` | 709 | W02; Chronicle orbit, entity card, routes, radar; декоративные числа | Product demonstration в fiction; дубли WORK и SYSTEM; метрики легко прочесть как измерения |
| Locations `#world` | 1035 | W04, V10 map, six selectors, map dialog, W03 descent/return 02.05 | **HOLD**. Вопрос над картой повторяет роль заголовка; правка только как предложение |
| People `#chars`, nested `.axiom-entity` | 1071 / 1162 | 3 portraits, AXIOM ∅ SVG/HUD | **HOLD**. Read-only предложения — [typography audit §4](WORLD_TYPOGRAPHY_AUDIT.md#4-protected-предложения-только-для-отдельного-решения) |
| Factions `#factions` | 1556 | W08 + три исходные карточки/SVG | «Кто определяет порядок?» → «Кто держит порядок»; формула «владеть, ломать, понимать» не объясняет различия |
| `.ax-epilogue` → `#vision` | 1670 / 1675 | W07; CTA → VISION | Рабочая граница fiction/project; сохранить |

Старый путь: **порог → заявление → доктрина → интерфейсные модули → места/спуск → люди/AXIOM ∅ → фракции → эпилог**.

Новый путь: **порог → надежда старого мира → BLACK SUN / фрагментация → архивное прочтение ампутации → неизвестное → WHAT REMAINS / жизнь после разлома → сохранённые места/спуск → сохранённые люди/AXIOM ∅ → цена порядка для фракций → эпилог**. Четыре первых смысловых такта находятся внутри существующего `#manifesto`, без четырёх новых полноэкранных сцен.

Все существующие anchors остаются. `#modules` сохраняет позицию и получает лоровый смысл WHAT REMAINS; переносится содержимое product demo, не сам anchor. Trail остаётся с пятью destination IDs, получает названия сцен вместо «глав» и повторённых вопросов.

## 3. Media, motion и зависимости

Источник: [world-library manifest](../../../../assets/showcase/world-library/manifest.json). Используются W01 threshold, W06 ruins, W02 memory, W04 city, W03 facility, W08 capital, W07 orbit. Все originals 1672×941, AVIF/WebP 960/1280/1672, lazy/async. W05/W09 — reserve, автоматически не добавлять. Оригиналы и утверждённые производные сохраняются. W06 crop не превращать в буквальное изображение астрономической причины BLACK SUN; W04 не подписывать как доказанный ECHELON; W08 — не утверждённый герб отдельной фракции.

Карта V10: 960/1440/2048, viewer 3840 или 2880 для low-memory/Save-Data. Portraits Viktor 1024×1536, Liza 941×1672, Seraphine 1024×1536. Map assets, portraits и AXIOM ∅ остаются побайтно исходными.

| Зависимость | Последствие для G2 |
| --- | --- |
| CSS: fonts → index → showcase → v22 → v23 | Не расширять общие `.sec-title`/`.module` правила на protected sections; локальные selectors |
| `index.js:30–73`, reveal/hash | Сохранить видимость hash target до scroll; `#world` already-visible исключение |
| `showcase-v22.js:5–40`, navigation | Active WORLD привязан к `world-guide`; не менять список основных разделов |
| `showcase-v23.js:2–74`, map | Frozen node data, selection, dialog/zoom/pan/focus; правка не требуется |
| `showcase-v23.js:87–100`, OMEGA | Frozen CTA `data-map-node=02.05`, target `#v23-map-detail`, reveal/focus-return |
| `showcase-gallery.js`, WORK | Сохранить 8 items, roving tab, swipe, warming, FIT/1:1 и возврат фокуса |
| `index.css:657–960`, doctrine/modules motion | Существуют looping decrypt, bars, sweep, orbit, radar. Переносимые схемы предлагаются статическими; не размножать loops |
| `index.js:87–97`, SMIL/reduced-motion | Сохранить остановку SVG; новые тексты доступны без JS/reveal |
| R-W3C-01, browser suite | Exact order/anchors/trail/plates contract меняется лишь в одобренной части; map/OMEGA/characters assertions не ослабляются |

Принятая W3.C задолженность: Retina softness W01/plates/W07 (1672 px, reported ratio ≈0.59–0.62), отдельные browser/manual gaps, небольшая CSS/perf регрессия. W4 не объявляет их устранёнными. Подробности и будущая матрица — [QA](WORLD_QA_REPORT.md).

## 4. WORK: контекст к настоящим экранам

WORK уже имеет `#showcase-gallery`, `ax-tab-01…08` / `ax-panel-01…08`; SYSTEM уже объясняет четыре опоры и Canon → Graph → WEB CORE → AXCHAT. Поэтому отдельная вторая витрина Four Surfaces не создаётся.

| Архивный экран / asset в `assets/showcase/hq/` | Дополнение |
| --- | --- |
| 01 PANEL GATE / `02-panel-login-*` | Существующий кейс сохраняется; NETSEC HUD не доказывает проверку безопасности |
| 02 WATCH_DOG / `03-panel-dashboard-*` | Один context disclosure: Cartography + условный radar; реальные location index и radar видны на capture |
| 03 CHRONICLE / `04-chronicle-*` | Orbit как навигационная метафора; здесь слово «глава» имеет литературный смысл |
| 04 AXCHAT / `05-axchat-*` | Существующий кейс; fiction ECHO не выдавать за архитектуру AXCHAT |
| 05 CONTENT / `06-content-library-*` | Схема записи: тип, теги, связи; без вымышленного published ID/version |
| 06 VIKTOR / `07-viktor-dossier-*` | Существующий longform-кейс; без второй entity-card |
| 07 SIGNAL / `08-news-signal-*` | Существующий release archive; версии на capture исторические |
| 08 MASTER GRAPH / `09-master-graph-*` | Существующий graph-кейс; Cartography к нему не приписывается |

Все 960w/1440w/1919w/full screenshots и четыре поля кейсов сохраняются. Четыре концепции получают **три** места в существующих panels 02/03/05: нативное `<details>` после screenshot/case, без новых tabs и lightbox triggers. Реальные экраны сохраняют `SCREEN CAPTURE`; схемы получают подпись **«КОНЦЕПТУАЛЬНАЯ СХЕМА»** и назначение.

Статистическая полоса `INDEXED 20 / SYNC DRIFT 0.84 / PROTOCOL v1.0` не переносится как product metrics. LIVE/SYNC/BLACK, WATCH ACTIVE, PUBLISHED V1.0 и условный White Contour ID заменяются нейтральными структурными подписями. D-11/D-17 ранее разрешали художественный декор в WORLD; W4 запрещает превращать его в эксплуатационные claims при новом размещении. Исходное представление остаётся восстановимым на baseline SHA; материал не удаляется из истории.

## 5. Контракт реализации после Gate A

**Цель:** первый посетитель понимает, чем был AXIOM, что установлено о BLACK SUN, как живут после фрагментации и почему силы конфликтуют. Аудитория — читатель без знания Canon. Главная задача WORLD — вовлечь в историю; доказательства разработки остаются WORK.

**Owned paths сейчас:** `docs/showcase-v031/waves/w4/**` и верхний current-state блок `AAA_CURRENT_HANDOFF.md`. Исследователи имели read-only scope. Другие ветки, root logs/gitlinks и Canon не являются writable scope этой волны.

**G2 change budget:** точечный `index.html` в world-guide/manifesto/modules/factions и контекстных additions WORK; scoped rules `showcase-v23.css`; необходимые изменения существующих smoke/browser contracts. Предпочтительно **0 новых JS-механик**, **0 новых изображений/шрифтов**, **0 новых top-level sections**. Любое изменение `showcase-v23.js`, gallery behavior, карты или персонажей выходит за этот минимальный scope и требует отдельного обоснования.

**Protected:** всё `#world` с V10/данными/OMEGA; всё `#chars` и AXIOM ∅; восемь screenshot source sets, viewer, SYSTEM, W01 scene composition, W08 artwork/card structure, W07 exit, навигация, palette/fonts/cursor. W4 допускает предложение по внешним подписям map, но не его внедрение без решения. Переименование «ГЛАВА IV» внутри chars также только предложение.

**Visual DoD:** одна доминирующая мысль/heading на доступную сцену; контекст прежде доктрины; не четыре новых экрана; схемы вторичны реальным captures; тело narration на Golos. **Technical DoD:** G3 viewport/engine/keyboard/motion/image/perf matrix и preservation proof; [before/after contract](WORLD_BEFORE_AFTER.md), [QA plan](WORLD_QA_REPORT.md).

**Rollback:** docs-only branch можно закрыть без эффекта на сайт. После G2 возвращать runtime отдельным reviewed revert-коммитом к `6b082e5`, без force/reset основного checkout. Перед G2 заново проверить remote main; при изменившейся runtime базе повторить затронутые части G0, не переписывать established commits.

**Stop:** неожиданная foreign delta, изменившийся protected scope, Canon contradiction в новой публичной формулировке, нехватка host resources, невозможность подтвердить claimed QA. Gate A не является merge/deploy authority. Gate B остаётся обязательным.

## 6. Gate A — конкретный пакет решения

На утверждение вынесены [полный текст и композиция](WORLD_SCENE_SCRIPT.md), [Canon trace](WORLD_CANON_TRACE.md), [таблица повторов](WORLD_TYPOGRAPHY_AUDIT.md).

1. Основное решение: четыре такта W02, WHAT REMAINS вместо product demos, контекстная модель WORK 02/03/05 и редактура фракций.
2. Отдельное необязательное разрешение: заменить **только** внешние «ГЛАВА III/IV» и повторённые вопросы у protected map/chars; точные варианты в typography audit. По умолчанию не менять.
3. NEURA lifecycle contradiction остаётся зарегистрированным вопросом Canon; сценарий использует прежний утверждённый relation core, не решая историю корпорации.

**Gate A: PENDING.** G2 не начат. Агентская проверка согласованности документов не является CREATOR или Principal acceptance.

## 7. AgentOps 0524.W4 — Steps A–E

| Step | Статус / результат |
| --- | --- |
| A Discovery | OBSERVED: isolated exact main, source inventory, три параллельных read-only аудита, Canon truth split, boundaries, source checks |
| B Implementation | G0/G1 документы подготовлены; runtime implementation **NOT STARTED** |
| C Documentation | Шесть deliverables, исходная директива, current-state handoff; исторические W1–W3 отчёты сохранены |
| D QA | Два static smoke PASS на неизменённом baseline; independent docs/source review PASS на `6e165e452adb7fe2430b855a10e98792acb86817`; 27 relative links / 0 missing, source/asset integrity. G3 browser/perf **NOT RUN** |
| E Git | Proposal commit `6e165e452adb7fe2430b855a10e98792acb86817`, `docs(world): prepare 0524.W4 G0/G1 narrative and Canon review package`, запушен в `origin/docs/0524-w4-world-narrative-g0-g1`; [Draft PR #11](https://github.com/Endevor-VIK/endevor-vik.github.io/pull/11). Последующий docs-only trace записывает review/PR; actual HEAD проверять в Git. Root/gitlinks не входят в patch |

Детальные результаты проверок и независимый recheck этого пакета — [WORLD_QA_REPORT](WORLD_QA_REPORT.md). Настоящий deliverable **G0/G1 READY FOR GATE A**, не финальная W4 visual acceptance.
