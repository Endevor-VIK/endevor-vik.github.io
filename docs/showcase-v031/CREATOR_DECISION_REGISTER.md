<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.CREATOR_DECISION_REGISTER
  title: "AXIOM SHOWCASE V0.3.1 — CREATOR decision register (W2, level b)"
  status: AWAITING_CREATOR
  deployment: NOT_DEPLOYED
  mode: Decision Register
  goal: "Спорные и художественные формулировки и открытые продуктовые решения — с вариантами; в UI по умолчанию не внедрены"
  scope: apps/endevor-vik.github.io — task 0524, wave W2 (C5 level b, Q-16, Q-18)
  lang: ru
  last_updated: 2026-10-18
  editable_by_agents: true
  change_policy: "Решение — только CREATOR; после решения строка внедряется отдельным коммитом с записью в PRESERVATION_REPORT"
  links:
    matrix: ./W2_CANON_SOURCE_MATRIX.md
    proposals_w1: ./W2_CANON_EDITORIAL_PROPOSALS.md
-->

# CREATOR DECISION REGISTER — W2

**Ничего из этого реестра в UI не внедрено.** Страница показывает текущий текст («Сейчас»). Вариант **A** — рекомендация агента, если она есть. Canon V3 не меняется ни при каком варианте: если CREATOR хочет закрепить формулировку в каноне, это отдельная задача владельца канона. Номера P-xx — из [`W2_CANON_EDITORIAL_PROPOSALS.md`](./W2_CANON_EDITORIAL_PROPOSALS.md).

## 1. Лор и канон

| ID | Где | Сейчас | Источник | Варианты | Рекомендация |
| --- | --- | --- | --- | --- | --- |
| D-01 (P-04) | WORLD, номера узлов | 03 ECHELON · 04 FACELESS BASE | `02_LOCATIONS/`: 02.03 FACELESS BASE, 02.04 ECHELON | **A** оставить порядок страницы (номера — порядок показа, не ID канона) · B поменять 03/04 местами по канону · C убрать номера | A: номера сейчас нужны вкладкам и счётчику «0N / 06» |
| D-02 (P-09) | ENTITIES, Виктор, STATUS | ACTIVE | `03.01_VIKTOR.md` v2.3: `officially dead / operationally active / difficult to track` (CANON_WITH_OPEN_DETAILS) | **A** «OFFICIALLY DEAD» в STATUS, «ACTIVE» — в подписи под карточкой · B «DEAD / ACTIVE» · C оставить ACTIVE | A или B; контекст карточки не противоречит. Внедрение — после решения (директива) |
| D-03 (P-10) | MANIFESTO, фрагмент 03; подпись фрагмента 00 | «BLACK ECHO — не источник, а отголосок…»; `// signed: BLACK ECHO / NEXARCH` | `03.21_SERAPHINE_VEYR.md` v0.3 DRAFT, `truth_level: WORKING`: Black Echo — теневая идентичность Серафин; `03.03`: ECHO — режим AXIOM | **A** развести: фрагмент 03 — «Echo Layer — эхо AXIOM: петли и фантомные ответы», подпись — `// signed: NEXARCH` · B оставить как намеренную двусмысленность · C подпись `// signed: BLACK ECHO` без NEXARCH | A (источник DRAFT, смешение двух сущностей) |
| D-04 (P-12) | ENTITIES, Лиза | NODE · VOIDLINK | `03.02_LIZA.md` v2.2: VOIDLINK-adjacent, «not a fully controlled VOIDLINK asset» (CANON_WITH_OPEN_DETAILS) | **A** «LINK · VOIDLINK» · B «NODE · VOIDLINK-ADJ» · C оставить | A: «NODE» читается как членство |
| D-05 (P-13) | AXIOM ∅: подзаголовок, «Artificial Personality · Fractured», NATURE; «Третья форма сознания» | ARTIFICIAL PERSONALITY | `03.03_AXIOM.md` v3.4 CANON: `PRIMARY SYSTEM INTELLIGENCE / FRACTURED POST-BLACK-SUN ENTITY`; «распределённый системный интеллект» | **A** «SYSTEM INTELLIGENCE · FRACTURED»; «третья форма сознания» — оставить как прозу манифеста · B заменить всё на формулировки 03.03 · C оставить | A |
| D-06 (P-11) | MANIFESTO, фрагмент 04 | «Black Protocol — OPERATOR CURATOR» | `03.22_CURATOR_ENDEAVOR.md` DRAFT; «Black Protocol» в каноне нет | A оставить как художественный термин · B «Containment Protocol» · C убрать OPERATOR | Решение CREATOR (термин не найден, но не противоречит) |
| D-07 (P-14) | AXIOM ∅, WITNESSES | VIKTOR · CAELAN · ECHO | «witnesses» не найдено | A оставить (художественный HUD) · B «CONTACTS» · C убрать ECHO | CREATOR |
| D-08 (P-15) | FACTIONS, NEURA TECH | «SIGNAL ANALYTICS… STATE NEUTRAL» | `06.02_NEURA_TECH.md` v1.4 DRAFT: нейро-контрольный конгломерат, конфликт с ENDEAVOR | **A** «Нейро-контрольный конгломерат: влияет на поведение через микросигналы и соперничает с ENDEAVOR.», без NEUTRAL · B оставить | A (источник DRAFT — не объявлять окончательным) |
| D-09 (P-16, Q-10) | CREATOR, HERO, футер | «ENDEAVOR» — псевдоним автора и фракция | `06.01_ENDEAVOR`; `03.X_CREATOR` | Q-10 отложен директивой | — |
| D-10 (P-18) | MODULES, CARTOGRAPHY; WORLD, нижняя строка | «depth axis, shield axis, authority route»; AXIS / DEPTH · SHIELD · AUTHORITY | Три оси мира — в 02.00 v2.0 (внедрены в текст WORLD, A-04); depth/shield не найдены, `route_authority` — `08.14` DRAFT | A оставить как художественные подписи HUD · B заменить подписи на три оси мира | A: оси мира уже названы в тексте WORLD |
| D-11 (P-19, Q-14) | MODULES / AXIOM ∅: INDEXED 20, SYNC DRIFT 0.84, FRAG 0.47/1.00, RECOMPOSITION RISK, журнал терминала | Декоративные числа | Q-14: APPROVED AS DECOR | **A** оставить (W2 убрал только «online/live/реальное время» и реальную версию) · B «INDEXED 20» → «ARCHIVE · 20 · fragments» (не читается как счётчик каталога) | A; B — если CREATOR видит в «INDEXED» обещание продукта |
| D-12 (P-20) | MODULES, CHRONICLE | UNITS · 06 CHAPTERS | В продукте 4 главы (все `draft`) | A «04 CHAPTERS» · B без числа · C оставить как художественное | A или B |
| D-13 (P-21) | WORLD-гид, SYSTEM | «MASTER GRAPH — внутренний инструмент, отображающий отношения между элементами Canon» | Плоскость данных MG: курируемый seed с провенансом Canon | A «граф записей мира с привязкой к Canon» · B оставить | A |
| D-14 | MANIFESTO: штампы `CLASSIFIED · TIER 9 · NEXARCH`, `CLEARANCE TIER 9`, `REDACTED · TIER 9`; AXIOM ∅: `ctrl_bus :: tier 9`, `archive.lock T9` | TIER 9 | Не найдено в каноне; в продукте уровни L0–L7 | **A** оставить как внутримировой штамп (после W2 он не выдаёт себя за метаданные файла канона) · B заменить на «TIER Ω» / «SEALED» | A |

## 2. Продукт и статусы

| ID | Вопрос | Сейчас (ветка) | Варианты | Рекомендация |
| --- | --- | --- | --- | --- |
| D-15 (Q-16) | Кто и как ведёт подсказку у ENTER AXIOM | Ручной флаг `assets/status/gate.json`: `state: unavailable`, `checkedAt: 2026-10-17`, `expires: 2026-10-31`; текст «Вход временно закрыт · статус на 17.10» | **A** CREATOR правит JSON при смене состояния; TTL ≤ 14 дней, после истечения подсказка исчезает сама · B без даты («Вход временно закрыт») · C выключить (`state: available`) до публикации | A. Динамической точности нет и не обещается; проверяемого канала статуса (договорённый API) нет — сайт не опрашивает axiomgates.com |
| D-16 (Q-16) | Текст подсказки | «Вход временно закрыт · статус на 17.10» | A как сейчас · B «AXIOM GATE на обслуживании» (утверждает причину — нужна уверенность) · C + ссылка на Telegram (нужна цель касания 44 px) | A |
| D-17 | Модули MODULES: метки состояния (CHRONICLE DRAFT, CONTENT LIVE, CARTOGRAPHY TRACE); журнал PING в MODULES (LIVE / SYNC / TRACE / BLACK) | Без изменений | A оставить как художественные метки · B CONTENT LIVE → PUBLISHED (состояние контента, а не сервиса) | B для CONTENT; PING — оставить (подписаны локациями мира) |
| D-18 (Q-18) | Реальная версия в шапке | `AXIOM CORE // SHOWCASE v0.3.0.0` | A как сейчас · B `// v0.3.0.0` (как было) · C поднять номер до V0.3.1 — только при выпуске | A; номер — только при решении о релизе |
| D-19 (Q-15, V-04) | Служебная команда `/reindex` на скриншоте AXCHAT | Видна | A оставить · B переснять экран без списка команд | A (риск низкий, `PRIVACY_CHECK_W1R.md`) |
| D-20 (E-01…E-04) | Редакционные предложения W1 | Не внедрены | См. `W2_CANON_EDITORIAL_PROPOSALS.md` §4 | По одной правке на решение |

## 3. Отложено директивой

Q-10 (ENDEAVOR как автор и фракция), Q-12 (подсветка зон по раскладке UI 0282), перестановка узлов и привязка зон к пикселям карты, новые географические факты.
