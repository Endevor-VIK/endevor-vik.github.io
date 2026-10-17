<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.CANON_REVIEW
  title: "AXIOM SHOWCASE V0.3.1 — Canon Review"
  status: READY_FOR_PRINCIPAL_REVIEW
  deployment: NOT_DEPLOYED
  mode: Editorial Gate / Canon Cross-Check
  goal: "Сверка всех именованных терминов витрины с Canon V3: источник, решение, формулировка для посетителя"
  scope: apps/endevor-vik.github.io — task 0524, wave W0 (первый проход); Canon не изменялся
  lang: ru
  last_updated: 2026-10-16
  editable_by_agents: true
  change_policy: "Решения VERIFIED/REWORD/AMBIGUOUS/BLOCKED менять только по источнику или решению CREATOR; Canon в рамках задачи не правится"
  links:
    canon_agents: ../../../../canon/v3/AGENTS.md
    audit: ./AUDIT_REPORT.md
    open_issues: ./OPEN_ISSUES.md
-->

# AXIOM SHOWCASE V0.3.1 — CANON REVIEW (W0, первый проход)

## 1. Источник и правила

- **Authority:** Canon V3 — сабмодуль `canon/v3` рабочего пространства AXS, commit `0b1c4bab8650b2998b4ea1147e8710508de46281` (2026-09-09), совпадает с gitlink корня. Протокол чтения — `canon/v3/AGENTS.md` v1.2 (truth levels, «visual reference does not itself create a Canon fact», «ENDEAVOR ≠ ENDEAVOR TOWER», «AXIOM ≠ AXIO»).
- **Продуктовые данные** (не Canon): главы Chronicle — `apps/axiom-web-core-ui/public/data/chronicle/manifest.json` (UI `main` `373e32e7`); утверждённая раскладка шести зон карты — UI-итерация `0282_locations-map-redesign` (через SPEC `0394`).
- **Решения:** `VERIFIED` — утверждение подтверждается источником (уровень истины указан); `REWORD` — суть верна, формулировка расходится с каноном или вводит в заблуждение; `AMBIGUOUS` — источник не найден или противоречит, нужно решение CREATOR; `BLOCKED` — нельзя проверить без доступа.
- **Граница:** в рамках задачи Canon **не изменялся**. Найденный дрейф портала канона (см. C-01) только зафиксирован.
- Уровни истины канона: `CANON`, `CANON_WITH_OPEN_DETAILS`, `DRAFT`, `WORKING`, `SYSTEM STRUCTURE` и т. д. — указаны так, как записаны в узлах. Многие узлы ещё `DRAFT`: публичная витрина может опираться на них только как на «рабочую версию мира», без подачи как окончательного факта.

## 2. Мир и карта (WORLD)

| ID | Утверждение на витрине (где) | Источник (файл · версия · статус) | Решение | Формулировка для посетителя (предложение) |
| --- | --- | --- | --- | --- |
| C-01 | «Шесть узлов. Один скелет мира.», «WORLD SPINE / 06 REGISTERED NODES» (`#world`) | `02_LOCATIONS/` — шесть мастер-каталогов `02.01…02.06`; `02.00.r_README.md` v2.0 ACTIVE «WORLD GEOGRAPHY SPINE» задаёт хребет мира **тремя осями**: Aeternum → Echelon, Terra Nova → Nexus, Gluhaya Station → OMEGA-0 → Nexus. Портал перечисляет 5 узлов (AI ZONE в нём отсутствует — дрейф портала канона, только фиксирую) | VERIFIED (число локаций) / REWORD (смысл «скелета») | «Шесть ключевых локаций. Три оси мира.» — подзаголовок: «Старая столица и новый порядок, купол-клетка, станция над тайной лабораторией» |
| C-02 | GLUHAYA — «STATION / THRESHOLD»; «Глухая станция — транзитный порог и первый сигнал…» | `02.01_GLUHAYA_STATION/02.01.01_GLUHAYA_STATION.md` v1.0 · DRAFT: «transit-threshold машина», «поверхностный клапан Nexus», black exchange, спуск к OMEGA-0 | VERIFIED (DRAFT) | «Глухая станция — старый транзитный узел: поверхностный «клапан» Nexus, рынок проходов и спуск к лаборатории OMEGA-0.» («первый сигнал» — название главы Chronicle, допустимо как отсылка) |
| C-03 | NEXUS — «DOME / DEPTH»; «контролируемый купол с внутренними уровнями…» | `02.02_NEXUS/02.02.01_NEXUS.md` v1.0 · DRAFT: бывшая Terra Nova, купольная клетка, антипод Echelon | VERIFIED (DRAFT) | «NEXUS — бывшая Terra Nova: город под куполом, превращённым в клетку.» |
| C-04 | ECHELON — «VERTICAL AUTHORITY»; «вертикаль власти и опорный узел иерархии» | `02.04_ECHELON/02.04.01_ECHELON.md` v2.0 · SYSTEM STRUCTURE: вертикально-иерархичная мегаструктура; `02.00.r_README` — выросла на руинах Aeternum | VERIFIED | «ECHELON — вертикальная мегаструктура новой власти, выросшая на руинах старой столицы Aeternum.» |
| C-05 | FACELESS — «PERIMETER / SHIELD»; «внешняя граница, наблюдение и защитный периметр системы» | `02.03_FACELESS_BASE/02.03.01_FACELESS_BASE.md` v1.0 · ACTIVE / CANON_WITH_OPEN_DETAILS: **Faceless Base** — скрытая автономная военно-промышленная крепость за внешним периметром Nexus, «резервная нервная система Nexus» | REWORD | Имя «FACELESS BASE»: «Скрытая автономная крепость за периметром Nexus: резерв, ремонт и оборона купола.» |
| C-06 | OMEGA-0 — «SEALED LAB / ACCESS»; «запечатанный технологический узел…» | `02.05_LABORATORY_OMEGA_0/02.05.00.r_README.md` v2.0 · SYSTEM STRUCTURE: «Секретный исследовательский узел, погребённый [под] 02.01_GLUHAYA_STATION» | VERIFIED по смыслу / REWORD имени | «Лаборатория OMEGA-0 — секретный исследовательский контур под Глухой станцией.» |
| C-07 | AI_ZONE — «MASKED ANOMALY»; «аномальная зона, где обычная логика сигналов перестаёт быть надёжным ориентиром» | `02.06_LOCATION_AI_ZONE/02.06.01_AI_ZONE.md` v1.0 · ACTIVE / CANON_WITH_OPEN_DETAILS: «Exclusion Research Complex» — контролируемый контакт с LIMBO, удержание, извлечение, карантин. «MASKED ANOMALY» в каноне не найдено | REWORD | «AI ZONE — закрытый комплекс для контролируемого контакта с LIMBO: изоляция, наблюдение, карантин.» Тип: «EXCLUSION / LIMBO» |
| C-08 | Изображение карты + alt «Панорамная карта шести архитектурных комплексов AXIOM на островах, соединённых транспортными мостами» | Изображение — производная V10 задачи 0394 (см. `IMAGE_AUDIT.md`); композиция шести зон утверждена UI 0282; SPEC 0394: «no new Canon geography inferred from visual embellishment»; `canon/v3/AGENTS.md`: «visual reference does not itself create a Canon fact»; канон помещает OMEGA-0 **под** Глухую станцию | AMBIGUOUS | Alt: «Художественная карта мира AXIOM — шесть ключевых локаций». Без «островов/мостов» как фактов мира. Подсветка зон по раскладке 0282 — только по решению CREATOR |
| C-09 | Порядок узлов 01 GLUHAYA · 02 NEXUS · 03 ECHELON · 04 FACELESS · 05 OMEGA-0 · 06 AI_ZONE | Канонические ID: 02.01 GLUHAYA, 02.02 NEXUS, **02.03 FACELESS BASE, 02.04 ECHELON**, 02.05 OMEGA-0, 02.06 AI ZONE | REWORD | Порядок канона или без номеров |
| C-10 | Наследие MODULES/WORLD: оси «DEPTH / SHIELD / AUTH(ORITY)», «Не география, а маршруты доступа» | `08_CONCEPTS_THEORY/08.14_ECHELON_ROUTE_ONTOLOGY.md` v0.2 · DRAFT: есть `route_authority` (решение CREATOR); «depth axis», «shield axis» не найдены | AMBIGUOUS | Оставить как художественные подписи HUD или привести к осям мира из C-01 |
| C-11 | «МИР ПОСЛЕ ЧЁРНОГО СОЛНЦА» (WORLD-гид), «World After Black Sun» | `04_STORY_STRUCTURE/04.02_PROLOGUE.md` v1.0 · DRAFT «Пролог: Мир после «Черного Солнца»»; Chronicle `STR-PROLOGUE-000` | VERIFIED | — |
| C-12 | BLACK SUN — «Катастрофа, после которой изменился порядок мира» | `18_EVENTS/18.02_BLACK_SUN.md` v1.0 · DRAFT: многоуровневая катастрофическая операция конца старого мира, орбитальный удар по старой столице, решение-«ампутация» | VERIFIED | — |

## 3. Автор и фракции

| ID | Утверждение | Источник | Решение | Предложение |
| --- | --- | --- | --- | --- |
| C-13 | «ENDEAVOR // CREATOR OF AXIOM SYSTEM», «CREATOR / ENDEAVOR», эмблема-лилия в карточке автора | `06_FACTIONS/06.01_ENDEAVOR.md` v2.0 · ACTIVE / MASTER FACTION NODE — техно-корпоративный доминион, глава Seraphine Veyr; `03_CHARACTERS/03.X_CREATOR.md` v0.1 · DRAFT — CREATOR как мета-узел, «не управляет ENDEAVOR»; лилия — эмблема фракции в разделе FACTIONS | AMBIGUOUS | Решение CREATOR: публичный псевдоним автора совпадает с именем антагонистической фракции. Варианты: оставить намеренно (мета-игра) с пояснением; развести написание/эмблему автора |
| C-30 | ENDEAVOR — «PUBLIC AUTHORITY / CONTROL LAYER… Публичный аппарат власти Серафин Вейр… Город Echelon — их геометрия сословного контроля», ID 06.01 | `06.01_ENDEAVOR.md` v2.0 · ACTIVE: техно-корпоративный доминион, Seraphine — верхняя authority | VERIFIED | Можно уточнить: «техно-корпоративный доминион» |
| C-31 | VOIDLINK — «DECENTRALIZED RESISTANCE», ID 06.03 | `06.03_VOIDLINK.md` v1.5 · DRAFT «DIGITAL RESISTANCE CELL» | VERIFIED (DRAFT) | — |
| C-32 | NEURA TECH — «SIGNAL ANALYTICS… Корпоративные аналитики… TIER OBSERVER, STATE NEUTRAL», ID 06.02 | `06.02_NEURA_TECH.md` v1.4 · DRAFT «NEURO-CONTROL CONGLOMERATE»: меняет поведенческие паттерны микросигналами; конфликт NEURA_TECH ↔ ENDEAVOR (`03.01_VIKTOR`) | REWORD | «Нейро-контрольный конгломерат: влияет на поведение через микросигналы и соперничает с ENDEAVOR.» Статус не «NEUTRAL» |

## 4. Персонажи и AXIOM

| ID | Утверждение | Источник | Решение | Предложение |
| --- | --- | --- | --- | --- |
| C-19 | Viktor Knox `[CHR-VIKTOR-0301]`; позывной «NIGHTMARE»; «PRIMARY ENTITY · NIGHTMARE PROTOCOL»; «Биологически скрытый оппонент… слепая зона control-layer Серафин»; CLASS BIO-VARIABLE; STATUS ACTIVE; THREAT X-CLASS | `03.01_VIKTOR.md` v2.3 · ACTIVE: имя — CANON; «biological hidden-access variable», «living blind spot»; статус «officially dead / operationally active»; **NIGHTMARE** — технология `05.02_NIGHTMARE.md` v2.1 ACTIVE («Transcendent blade»), связь с Виктором — WORKING; «X-CLASS» в каноне не найдено | VERIFIED (описание) / REWORD (позывной, угроза, статус) | «Носитель скрытого биологического пути доступа — слепая зона цифрового контроля. Официально мёртв, фактически действует.» Позывной/«X-CLASS» — убрать или решение CREATOR |
| C-20 | Liza Sinclair `[CHR-LIZA-0302]`, «LZ-Δ : VOICE», «ASSASSIN ENTITY · INTRUSION VECTOR», «нанонити, окулярные сканеры, гарпун Striker», NODE VOIDLINK | `03.02_LIZA.md` v2.2 · ACTIVE: имя и позывной — CANON_WITH_OPEN_DETAILS; breach vector; набор имплантов Striker — CANON_WITH_OPEN_DETAILS; «VOIDLINK-adjacent», «not a fully controlled VOIDLINK asset» | VERIFIED / REWORD (NODE) | «Связь: VOIDLINK (не член фракции)» |
| C-21 | Seraphine Veyr `[CHR-SERAPHINE-0321]`, «BLACK ECHO», «NEXARCH CONTROL NODE · ENDEAVOR», «Один из архитекторов Black Sun. Не владеет всем AXIOM — удерживает контур контроля.» | `03.21_SERAPHINE_VEYR.md` v0.3 · DRAFT: теневая идентичность Black Echo, титул Nexarch, верховная фигура ENDEAVOR, один из архитекторов Black Sun, держит control-layer, но не весь AXIOM | VERIFIED (DRAFT) | — |
| C-22 | White Contour `[CHR-WHITE-CONTOUR-0317]`, ANOMALY, GHOST, ECHELON | `03.17_WHITE_CONTOUR.md` v1.3 · DRAFT «anomalous intruder / ghost of ECHELON» | VERIFIED (DRAFT) | — |
| C-24 | `[03.03_AXIOM.md]`, «FRACTURED ARTIFICIAL PERSONALITY · WORLD-SPINE NODE», «ORIGIN AETERNUM CORE» | `03.03_AXIOM.md` v3.4 · ACTIVE / CANON CHARACTER CORE: «Fractured system intelligence / world-spine node», origin_core Aeternum | VERIFIED / REWORD («personality» → «system intelligence») | «Фрагментированный системный интеллект старого мира» |
| C-25 | «AXIOM — это искусственная личность, выросшая внутри старой столицы… Третья форма сознания…» | `03.03_AXIOM.md`: ядро связано со старой столицей Aeternum ✓; «третья форма сознания» не найдено | AMBIGUOUS | Сохранить как авторскую прозу наследия или привести к формуле канона «AXIOM is a truth-layer the old world could not survive» |
| C-26 | «BLACK SUN был не войной против ИИ. Это была ампутация реальности» | `03.03_AXIOM.md` B00.S02 (дословно по смыслу) | VERIFIED | — |
| C-27 | Пять режимов RELIC / ECHO / CONTROL / BIO / MYTH и описания | `03.03_AXIOM.md` `post_black_sun_state: fragmented / relic-echo-control-bio-myth layers`; формулировка ECHO совпадает с `05.02_NIGHTMARE.md` `echo_mode` | VERIFIED | — |
| C-28 | «WITNESSES VIKTOR · CAELAN · ECHO», «OPPOSED BY NEXARCH DOCTRINE» | «witnesses» не найдено; `08.10_NEXARCH_CONTROL_DOCTRINE.md` v0.1 · DRAFT существует | AMBIGUOUS / VERIFIED | «Свидетели» — решение CREATOR |
| C-29 | Метрики наследия: FRAG 0.47/1.00, RECOMPOSITION RISK HIGH/UNBOUNDED, SIGNAL 0.84, DRIFT 0.02 % | В каноне не найдено | AMBIGUOUS | Подавать как художественный HUD без «измерительных» чисел (см. A-LORE-02) |

## 5. Манифест и фрагменты (наследие)

| ID | Утверждение | Источник | Решение | Предложение |
| --- | --- | --- | --- | --- |
| C-14 | «Мир после BLACK SUN — это контролируемая ампутация. AXIOM был фрагментирован, чтобы цивилизация выжила. Но не вся.» | `03.03_AXIOM.md` (ампутация реальности, фрагментация), `18.02_BLACK_SUN.md` | VERIFIED | — |
| C-15 | «// signed: BLACK ECHO / NEXARCH · v3», «CLASSIFIED · TIER 9 · NEXARCH», «DOC_ID :: AXS-V3-DOCTRINE-00 · CANON», путь `~/canon/v3/manifest_00.md` | Black Echo / Nexarch — `03.21` ✓; «TIER 9» не найдено; DOC_ID и путь **не существуют** в каноне | REWORD | Сохранить стилистику терминала, но без имитации реального файла канона (напр. «DOCTRINE // FRAGMENT 00») |
| C-16 | Фрагмент 03 «Echo Layer — BLACK ECHO — не источник, а отголосок… HOST NEXARCH, CLASS SHADOW» | Канон: **Black Echo** — теневая идентичность Seraphine (`03.21` B01); **ECHO** — режим AXIOM (`03.03`) | AMBIGUOUS | Развести: «Echo Layer — эхо AXIOM: петли и фантомные ответы, не равные целостной личности» |
| C-17 | Фрагмент 04 «Black Protocol — OPERATOR CURATOR» | `03.22_CURATOR_ENDEAVOR.md` v1.0 · DRAFT / WORKING INTEGRATION существует; «Black Protocol» как термин не найден | AMBIGUOUS | Решение CREATOR |
| C-18 | Фрагмент 05 «Bio Variable — VECTOR VIKTOR, RISK X-CLASS» | Viktor — биологическая переменная ✓ (`03.01`); «X-CLASS» не найдено | REWORD | Без «X-CLASS» |

## 6. Модули наследия и продуктовые утверждения

| ID | Утверждение | Источник | Решение | Предложение |
| --- | --- | --- | --- | --- |
| C-34 | CHRONICLE: PROLOGUE_00 «World After Black Sun», INTRO.01 «Deaf Station», CH.Ω «Protocol Ω»; «UNITS 06 CHAPTERS» | Продукт: `public/data/chronicle/manifest.json` — **4** главы (`STR-PROLOGUE-000`, `STR-INTRO-001` «Глухая станция: первый сигнал», `STR-CHAPTER-010` «Осколки контроля», `STR-CHAPTER-020` «Протокол Ω»), все `draft` | VERIFIED (названия) / REWORD (число) | «04 CHAPTERS» или без числа |
| C-35 | CONTENT: «INDEXED 20 ENTRIES», «sync — в реальном времени» | Не проверено (живой контур выключен; число нигде не зафиксировано) | AMBIGUOUS | Без чисел и обещаний реального времени |
| C-37 | WATCH_DOG: «06 nodes tracked», лог пингов по узлам | Продукт: скриншот WATCH_DOG показывает карту шести локаций | VERIFIED (как художественное представление продукта) | — |
| C-38 | «AXCHAT работает с контекстом материалов; Master Graph позволяет автору анализировать связи сущностей и выявлять разрывы» | Продуктовые скриншоты (AXCHAT, MASTER GRAPH) + программы Master Graph в AXS | VERIFIED по существованию интерфейсов; объём возможностей не утверждать сверх показанного | — |

## 7. Итог W0

35 проверенных утверждений:

- **VERIFIED — 14:** C-02, C-03, C-04, C-11, C-12, C-14, C-21, C-22, C-26, C-27, C-30, C-31, C-37, C-38 (часть узлов канона — DRAFT).
- **VERIFIED по сути, REWORD части формулировки — 6:** C-01, C-06, C-19, C-20, C-24, C-34.
- **REWORD — 6:** C-05, C-07, C-09, C-15, C-18, C-32.
- **AMBIGUOUS, решение CREATOR — 9:** C-08, C-10, C-13, C-16, C-17, C-25, C-28 (частично), C-29, C-35.
- **BLOCKED — 0:** источники канона доступны.

Ни одно изменение текста по этой таблице в W0/W0.1 **не внесено**: правки лора — только в W2 после решений CREATOR (`OPEN_ISSUES.md`). Номера C-xx стабильны и используются в `AUDIT_REPORT.md`; пропуски в нумерации (C-23, C-33, C-36) зарезервированы.
