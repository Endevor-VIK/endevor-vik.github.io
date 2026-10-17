<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.W2_CANON_EDITORIAL_PROPOSALS
  title: "AXIOM SHOWCASE V0.3.1 — W2 Canon & Editorial Proposals"
  status: PROPOSAL
  deployment: NOT_DEPLOYED
  mode: Decision Input (CREATOR)
  goal: "Расхождения витрины с Canon V3 и редакционные предложения на W2 — для решения CREATOR"
  scope: apps/endevor-vik.github.io — task 0524, input for wave W2
  lang: ru
  last_updated: 2026-10-17
  editable_by_agents: true
  change_policy: "Канон не изменяется; формулировки на странице меняются только после решения CREATOR по каждой строке"
  links:
    canon_review: ./CANON_REVIEW.md
    open_issues: ./OPEN_ISSUES.md
    w1_report: ./W1_REPORT.md
-->

# AXIOM SHOWCASE V0.3.1 — ПРЕДЛОЖЕНИЯ W2: КАНОН И РЕДАКТУРА

**В W1 ни Canon V3, ни лор-тексты страницы не менялись.** Это входной список для W2: каждая строка — расхождение или неподтверждённая связь, источник и предлагаемая формулировка. Источник истины — `canon/v3` @ `0b1c4bab` (сверка W0, `CANON_REVIEW.md`); номера C-xx оттуда. Ничего не внедряется без решения CREATOR.

## 1. Названия и типы локаций (WORLD, радар HERO, карта)

| # | Где на странице | Сейчас | Канон | Предложение для W2 | Решение |
| --- | --- | --- | --- | --- | --- |
| P-01 (C-05) | WORLD: узел 04, описание; радар HERO | «FACELESS · PERIMETER / SHIELD — внешняя граница, наблюдение…» | `02.03_FACELESS_BASE` v1.0 (CANON_WITH_OPEN_DETAILS): **Faceless Base** — скрытая автономная военно-промышленная крепость за периметром Nexus, резерв купола. Скриншот WATCH_DOG в архиве WORK уже показывает «FACELESS BASE» | Имя «FACELESS BASE»; «Скрытая автономная крепость за периметром Nexus: резерв, ремонт и оборона купола.» | CREATOR |
| P-02 (C-06) | WORLD: узел 05; радар HERO (подпись OMEGA-0) | «OMEGA-0 — запечатанный технологический узел…», тип «SEALED LAB / ACCESS» | `02.05_LABORATORY_OMEGA_0` v2.0: секретный исследовательский контур, **погребённый под Глухой станцией** | «Лаборатория OMEGA-0 — секретный исследовательский контур под Глухой станцией.» Тип: «LAB / UNDER GLUHAYA» | CREATOR |
| P-03 (C-07) | WORLD: узел 06 | «AI_ZONE — MASKED ANOMALY…» | `02.06_AI_ZONE` v1.0: «Exclusion Research Complex» — контролируемый контакт с LIMBO, удержание, карантин. «MASKED ANOMALY» в каноне нет | Имя «AI ZONE»; «Закрытый комплекс для контролируемого контакта с LIMBO: изоляция, наблюдение, карантин.» Тип: «EXCLUSION / LIMBO» | CREATOR |
| P-04 (C-09) | WORLD: порядок узлов | 01 GLUHAYA · 02 NEXUS · 03 ECHELON · 04 FACELESS · 05 OMEGA-0 · 06 AI_ZONE | Канонические ID: 02.01 GLUHAYA, 02.02 NEXUS, **02.03 FACELESS BASE, 02.04 ECHELON**, 02.05 OMEGA-0, 02.06 AI ZONE | Порядок канона (поменять 03 и 04) или убрать номера | CREATOR |
| P-05 (C-01) | WORLD: заголовок | «Шесть узлов. Один скелет мира.» | Шесть локаций ✓; хребет мира задан **тремя осями** (Aeternum → Echelon, Terra Nova → Nexus, Gluhaya → OMEGA-0 → Nexus) | «Шесть ключевых локаций. Три оси мира.» | CREATOR |
| P-06 (C-08) | WORLD: alt карты | «…на островах, соединённых транспортными мостами» | Визуальный референс не создаёт факт канона; OMEGA-0 — под станцией | «Художественная карта мира AXIOM — шесть ключевых локаций» | CREATOR |

## 2. Персонажи, фрагменты, наследие

| # | Где | Сейчас | Канон | Предложение | Решение |
| --- | --- | --- | --- | --- | --- |
| P-07 (C-19) | ENTITIES: Viktor | позывной «NIGHTMARE», «NIGHTMARE PROTOCOL» | **NIGHTMARE** — технология `05.02_NIGHTMARE` v2.1 («Transcendent blade»); связь с Виктором — WORKING, не позывной | Убрать позывной или подать как «носитель NIGHTMARE» после решения | CREATOR |
| P-08 (C-19, C-18) | ENTITIES: Viktor (THREAT); MANIFESTO: фрагмент 05 (RISK) | «X-CLASS» | Не найдено в каноне | Убрать «X-CLASS» или утвердить термин в каноне | CREATOR |
| P-09 (C-19) | ENTITIES: Viktor (STATUS) | «ACTIVE» | «officially dead / operationally active» | «Официально мёртв, фактически действует» | CREATOR |
| P-10 (C-16) | MANIFESTO: фрагмент 03 | «Echo Layer — BLACK ECHO — не источник, а отголосок… HOST NEXARCH» | Black Echo — теневая идентичность Seraphine (`03.21`); ECHO — режим AXIOM (`03.03`) | Развести: «Echo Layer — эхо AXIOM: петли и фантомные ответы» | CREATOR |
| P-11 (C-17) | MANIFESTO: фрагмент 04 | «Black Protocol — OPERATOR CURATOR» | Curator (`03.22`, DRAFT) есть; «Black Protocol» как термин не найден | Решение CREATOR | CREATOR |
| P-12 (C-20) | ENTITIES: Liza | «NODE VOIDLINK» | VOIDLINK-adjacent, не подконтрольный актив фракции | «Связь: VOIDLINK (не член фракции)» | CREATOR |
| P-13 (C-24, C-25) | AXIOM ∅ | «FRACTURED ARTIFICIAL PERSONALITY», «третья форма сознания» | «Fractured system intelligence / world-spine node»; «третья форма сознания» не найдено | «Фрагментированный системный интеллект старого мира»; «третью форму» оставить как прозу или убрать | CREATOR |
| P-14 (C-28) | AXIOM ∅: WITNESSES | «VIKTOR · CAELAN · ECHO» | «witnesses» в каноне не найдено | Решение CREATOR | CREATOR |
| P-15 (C-32) | FACTIONS: NEURA TECH | «SIGNAL ANALYTICS… STATE NEUTRAL» | `06.02` v1.4 DRAFT: нейро-контрольный конгломерат, конфликт с ENDEAVOR | «Нейро-контрольный конгломерат: влияет на поведение через микросигналы и соперничает с ENDEAVOR.» Без «NEUTRAL» | CREATOR |
| P-16 (C-13) | CREATOR, герой, футер | «ENDEAVOR» — псевдоним автора и имя антагонистической фракции; эмблема-лилия в карточке автора | `06.01_ENDEAVOR` — фракция Seraphine; `03.X_CREATOR` — «не управляет ENDEAVOR» | Оставить намеренно (мета-игра) с пояснением или развести написание/эмблему | CREATOR |

## 3. Неподтверждённые «канонические» ссылки и имитация файлов канона

| # | Где | Сейчас | Проверка | Предложение | Решение |
| --- | --- | --- | --- | --- | --- |
| P-17 (C-15) | MANIFESTO | путь `~/canon/v3/manifest_00.md`, `DOC_ID :: AXS-V3-DOCTRINE-00 · CANON`, «TIER 9» | Такого файла и DOC_ID в каноне нет; «TIER 9» не найдено | Стилистика терминала без имитации реального файла: «DOCTRINE // FRAGMENT 00» | CREATOR |
| P-18 (C-10) | MODULES / WORLD (наследие) | оси «DEPTH / SHIELD / AUTH(ORITY)», «Не география, а маршруты доступа» | В каноне есть `route_authority` (`08.14`), осей depth/shield нет | Художественные подписи HUD или оси из P-05 | CREATOR |
| P-19 (C-29, C-35) | AXIOM ∅, MODULES | «FRAG 0.47/1.00», «RECOMPOSITION RISK HIGH/UNBOUNDED», «INDEXED 20 ENTRIES», «sync — в реальном времени» | Чисел в каноне нет; «20 записей» и «реальное время» не подтверждены | HUD без «измерительных» чисел и без обещаний реального времени | CREATOR (Q-14) |
| P-20 (C-34) | MODULES: CHRONICLE | «UNITS 06 CHAPTERS» | В продукте 4 главы (все `draft`) | «04 CHAPTERS» или без числа | CREATOR |
| P-21 | WORLD-гид (глоссарий), SYSTEM (поток) | «MASTER GRAPH — внутренний инструмент, отображающий отношения между элементами Canon» | Записи графа приходят из курируемого seed с провенансом Canon; типизированные связи канона материализованы частично | Точнее: «граф записей мира с привязкой к Canon» | CREATOR |

## 4. Редакционные предложения W2 (не канон)

| # | Где | Предложение | Почему |
| --- | --- | --- | --- |
| E-01 | WORK, блок WEB CORE | Сократить до одного абзаца + «WHAT IT SOLVES / USER VALUE» | В варианте B блок стоит после архива и дублирует вводный текст раздела |
| E-02 | WORK, вводный текст и текст архива | Свести два абзаца о «публичных и закрытых экранах» в один | Повтор одной мысли (вводный текст раздела + строка архива) |
| E-03 | VISION, B04 | Вернуться к задуманной полосе 16:5 (сейчас высота 330 px из-за атрибута `height`) | На 390 px показывается узкая вырезка панорамы; на 1440@2 резкость упирается в оригинал 1983 px |
| E-04 | SYSTEM, A07 | Другая композиция блока (картинка шире полосы 320 px не вытягивается) | Резкость 0,54 на 1440@2 — предел оригинала 1448 px |
| E-05 | Тикер | Пауза бегущей строки (WCAG 2.2.2) | Отложено в W3 (`OPEN_ISSUES.md` §4) |
| E-06 | HERO | Подсказка у ENTER AXIOM, пока шлюз отвечает 503 | Q-16 |

## 5. Как внедрять

После решения CREATOR по строке — правка текста страницы в W2 одним коммитом на группу (локации, персонажи, наследие), с сохранением исходного текста в `PRESERVATION_REPORT.md` и регрессией. Сам Canon V3 не редактируется в рамках 0524; найденный дрейф портала канона (AI ZONE отсутствует в списке узлов портала, C-01) передаётся владельцу канона отдельно.
