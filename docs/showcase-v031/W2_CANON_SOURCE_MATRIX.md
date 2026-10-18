<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.W2_CANON_SOURCE_MATRIX
  title: "AXIOM SHOWCASE V0.3.1 — W2 source / truth-level matrix"
  status: READY_FOR_PRINCIPAL_REVIEW
  deployment: NOT_DEPLOYED
  mode: Canon Cross-Check / Evidence
  goal: "Для каждой правки текста W2 — файл Canon V3, версия, статус и уровень истины; что внедрено, что вынесено на решение"
  scope: apps/endevor-vik.github.io — task 0524, wave W2 (C1–C5)
  lang: ru
  last_updated: 2026-10-18
  editable_by_agents: true
  change_policy: "Canon V3 не редактируется; внедряются только формулировки с прямым подтверждением источником"
  links:
    w2_report: ./W2_REPORT.md
    decisions: ./CREATOR_DECISION_REGISTER.md
-->

# W2 — МАТРИЦА «ИСТОЧНИК / УРОВЕНЬ ИСТИНЫ»

Источник: `canon/v3` @ `0b1c4bab8650b2998b4ea1147e8710508de46281` (только чтение, не менялся). Версия и статус — из шапки файла (`CURRENT VERSION`, `STATUS`); уровень истины — из `truth_level` / `truth_map` файла, где он есть.

**Уровень (a)** — внедрено отдельными коммитами: формулировка прямо подтверждена источником. **Уровень (b)** — спорное или художественное: только варианты в [`CREATOR_DECISION_REGISTER.md`](./CREATOR_DECISION_REGISTER.md), в UI не внедрялось.

## 1. Внедрено (уровень a)

| # | Где на странице | Было | Стало | Источник (файл · версия · статус) | Подтверждение | Коммит |
| --- | --- | --- | --- | --- | --- | --- |
| A-01 | WORLD, узел 04 (имя, тип, сигнал, описание); MODULES: карта CARTOGRAPHY, журнал PING_04 | FACELESS · PERIMETER / SHIELD · «Периметр · щит · наблюдение» · «FACELESS — внешняя граница, наблюдение и защитный периметр системы.» | FACELESS BASE · CONTINUITY / FORTRESS · «Резерв · ремонт · оборона» · «FACELESS BASE — скрытая автономная крепость за внешним периметром NEXUS: резерв управления, ремонт и оборона купола.» | `02_LOCATIONS/02.03_FACELESS_BASE/02.03.01_FACELESS_BASE.md` · v1.0 · ACTIVE / **CANON_WITH_OPEN_DETAILS** | BLOCK 01: «скрытая автономная промышленно-военная крепость за внешним периметром Nexus»; reserve command layer, repair-industrial complex; ENTITY TYPE «Autonomous Military-Industrial Continuity Fortress» | `66ed282b` |
| A-02 | WORLD, узел 05 (тип, сигнал, описание) | SEALED LAB / ACCESS · «Лаборатория · изоляция · технологии» · «OMEGA-0 — запечатанный технологический узел: исследования, ограниченный доступ и неизвестные последствия.» | LAB / UNDER GLUHAYA · «Лаборатория · под Глухой станцией» · «OMEGA-0 — довоенная секретная лаборатория, погребённая под Глухой станцией. После инцидента комплекс запечатан вместе с результатами экспериментов.» | `02_LOCATIONS/02.05_LABORATORY_OMEGA_0/02.05.00.r_README.md` · v2.0 · SYSTEM STRUCTURE | `B00.S01 CURRENT CANON FIXATION`: «довоенная секретная лаборатория ENDEAVOR, погребённая под Gluhaya Station»; «MR.X … превративший комплекс в саркофаг с тайнами после инцидента» | `66ed282b` |
| A-03 | WORLD, узел 06; MODULES: журнал PING_06 | AI_ZONE · MASKED ANOMALY · «Аномалия · неизвестность» · «AI_ZONE — аномальная зона, где обычная логика сигналов перестаёт быть надёжным ориентиром.» | AI ZONE · EXCLUSION / LIMBO · «Контакт · удержание · карантин» · «AI ZONE — закрытый исследовательский комплекс для контролируемого контакта с LIMBO: изоляция, удержание и карантин.»; журнал «AI ZONE / LIMBO» | `02_LOCATIONS/02.06_LOCATION_AI_ZONE/02.06.01_AI_ZONE.md` · v1.0 · ACTIVE («CREATOR-approved location concept») | ENTITY TYPE «Exclusion Research Complex»; PRIMARY FUNCTION «controlled LIMBO contact, containment, retrieval, quarantine»; «MASKED ANOMALY» в каноне нет | `66ed282b` |
| A-04 | WORLD, вводный текст (заголовок «Шесть узлов. Один скелет мира.» сохранён по решению CREATOR) | — | + «Хребет мира держат три оси: Aeternum → ECHELON, Terra Nova → NEXUS и Глухая станция → OMEGA-0 → NEXUS.» | `02_LOCATIONS/02.00.r_README.md` · v2.0 · ACTIVE / PORTAL REBUILD; `03_CHARACTERS/03.03_AXIOM.md` · v3.4 · **CANON** | `BLOCK 01 — WORLD AXES` (три оси дословно); `primary_axis` / `related_axes` в ядре 03.03 | `66ed282b` |
| A-05 | WORLD, `alt` карты; `alt` в просмотрщике | «Панорамная карта шести архитектурных комплексов AXIOM на островах, соединённых транспортными мостами.» | «Художественная карта мира AXIOM: шесть ключевых локаций, вид с высоты.» | `download/canon-v3-map-4k/production-manifest.json` (задача 0394): карта — художественный референс; OMEGA-0 по канону под землёй (A-02) | Описание картинки не создаёт фактов географии (директива W2, C1) | `66ed282b`, `98452f05` |
| A-06 | ENTITIES, Виктор: метка на портрете, роль | `NIGHTMARE` (как позывной) · «PRIMARY ENTITY · NIGHTMARE PROTOCOL» | `KEY : CARRIER` · «PRIMARY ENTITY · NIGHTMARE BEARER» | `05_TECHNOLOGIES/05.02_NIGHTMARE.md` · v2.1 · ACTIVE; `03_CHARACTERS/03.01_VIKTOR.md` · v2.3 · ACTIVE, `truth_level: CANON_WITH_OPEN_DETAILS` | NIGHTMARE — резонансный клинок (05.02; 03.01 B03.S01.P03, связь «bound weapon line»); позывного у Виктора нет; «NIGHTMARE PROTOCOL» в каноне нет; `entity_type: Human carrier / biological hidden-access variable` (03.01 B00.S01), «носитель ключа» (03.01 BLOCK 06) | `62883578` |
| A-07 | ENTITIES, Виктор (THREAT); MANIFESTO, фрагмент 05 (текст, RISK) | X-CLASS · «переменная X-класса» | UNCLASSIFIED · «неклассифицированная переменная» | Поиск по `canon/v3/**/*.md`: «X-CLASS» / «X-class» — 0 совпадений | Неподтверждённый класс снят (директива W2, C2); слово «неклассифицированная» не вводит нового термина | `62883578` |
| A-08 | MANIFESTO: строка управления, заголовок терминала, подпись | `DOC_ID :: AXS-V3-DOCTRINE-00 · CANON` · `~/canon/v3/manifest_00.md` · `// signed: BLACK ECHO / NEXARCH · v3` | `FRAGMENT :: DOCTRINE-00 · ARCHIVE` · `doctrine // fragment_00` · `// signed: BLACK ECHO / NEXARCH` | Поиск по `canon/v3`: `manifest_00`, `AXS-V3-DOCTRINE`, `TIER 9` — 0 совпадений | Художественный фрагмент больше не выдаёт себя за файл канона (C3). `BLACK ECHO` и штампы `TIER 9` оставлены как художественные — см. D-06, D-14 | `d4c30ca5` |

## 2. Не канон, а честность продукта (C3/C4, внедрено)

| # | Где | Было | Стало | Основание | Коммит |
| --- | --- | --- | --- | --- | --- |
| H-01 | HERO, карточка справа (`aria-hidden`) | NETWORK STATUS · ONLINE | SIGNAL TRACE · RED PROTOCOL | Рядом с ENTER AXIOM читалось как реальный статус сети, а шлюз отвечает 503 (OBSERVED). Директива: без имитации сетевой телеметрии | `d4c30ca5` |
| H-02 | MODULES, полоса статистики | NODES ONLINE · 06 · live | WORLD NODES · 06 · mapped | Число 06 = шесть локаций; «online/live» — имитация метрики сервиса (Q-14) | `d4c30ca5` |
| H-03 | MODULES, CONTENT | «…Фильтр по тегам, ссылочный граф, sync — в реальном времени.» | «…Фильтр по тегам и ссылочный граф.» | «Реальное время» не подтверждено продуктом (C-35) | `d4c30ca5` |
| H-04 | Шапка | `AXIOM CORE // v0.3.0.0` | `AXIOM CORE // SHOWCASE v0.3.0.0` | Номер — версия витрины, а не системы AXIOM CORE (её версия в продукте — 0.50.0). Публичная версия не менялась (C4) | `827c9286` |
| H-05 | MODULES, полоса статистики | BUILD · REL · 0.3.0.0 | PROTOCOL · RED · v1.0 | Художественный HUD больше не повторяет реальную версию; v1.0 — та же внутримировая версия, что у карточки ACCESS_PROTOCOL в HERO (Q-18) | `827c9286` |

Остальные декоративные числа (SYNC DRIFT 0.84, INDEXED 20, FRAG 0.47, журнал терминала AXIOM ∅) остаются атмосферным HUD (Q-14). Предложения по ним — D-11.

## 3. Проверено, не менялось

| Где | Текст | Источник | Почему не менялось |
| --- | --- | --- | --- |
| WORLD, порядок узлов 03 ECHELON / 04 FACELESS BASE | Порядок канона: 02.03 FACELESS BASE, 02.04 ECHELON | `02_LOCATIONS/` | Перестановка требует отдельного решения (директива) → D-01 |
| WORLD, заголовок | «Шесть узлов. Один скелет мира.» | — | Утверждён CREATOR |
| ENTITIES, Виктор, STATUS | ACTIVE | `03.01_VIKTOR.md`: `current_status: officially dead / operationally active / difficult to track` | Не ложно («operationally active»); полная формулировка готова → D-02 |
| ENTITIES, Серафин | BLACK ECHO (метка), NEXARCH CONTROL NODE | `03.21_SERAPHINE_VEYR.md` · v0.3 · DRAFT, `truth_level: WORKING`: «Теневая идентичность: Black Echo» | Совпадает с источником; спорно только употребление во фрагменте 03 → D-03 |
| ENTITIES, Лиза | NODE VOIDLINK | `03.02_LIZA.md` · v2.2: `VOIDLINK-adjacent`, «not a fully controlled VOIDLINK asset», `voidlink_alignment: CANON_WITH_OPEN_DETAILS` | → D-04 |
| AXIOM ∅ | ARTIFICIAL PERSONALITY · FRACTURED, «третья форма сознания» | `03.03_AXIOM.md` · v3.4 · CANON: `classification: PRIMARY SYSTEM INTELLIGENCE / FRACTURED POST-BLACK-SUN ENTITY` | Категория интеллекта — отдельное решение (директива) → D-05 |
| Карта: привязка зон к пикселям, подсветка | — | UI 0282 | Q-12 отложен; новые географические факты — отдельное одобрение |
