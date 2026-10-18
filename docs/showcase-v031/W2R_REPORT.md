<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.W2R_REPORT
  title: "AXIOM SHOWCASE V0.3.1 — W2.R report (Principal Recheck)"
  status: READY_FOR_PRINCIPAL_RECHECK
  deployment: NOT_DEPLOYED
  mode: Implementation Report / Evidence
  goal: "Директива 0524.W2.R: редакционное закрытие по решениям CREATOR D-01…D-19, E-01…E-04; подготовка Canon D-06/D-08 в отдельной ветке"
  scope: apps/endevor-vik.github.io + Canon V3 branch — task 0524, wave W2.R
  lang: ru
  last_updated: 2026-10-18
  editable_by_agents: true
  change_policy: "LANDING MAIN MERGE / CANON MAIN MERGE / ROOT GITLINK / VERSION BUMP — FORBIDDEN; PRODUCTION DEPLOY — HOLD; самоприёмка не заявляется"
  links:
    decisions: ./CREATOR_DECISION_REGISTER.md
    matrix_w2: ./W2_CANON_SOURCE_MATRIX.md
    preservation: ./PRESERVATION_REPORT.md
    qa_matrix: ./QA_MATRIX.md
-->

# AXIOM SHOWCASE V0.3.1 — W2.R

**0524.W2.R READY FOR PRINCIPAL RECHECK.** LANDING MAIN MERGE — FORBIDDEN · CANON MAIN MERGE — FORBIDDEN · ROOT GITLINK UPDATE — FORBIDDEN · PRODUCTION DEPLOY — HOLD · VERSION BUMP — FORBIDDEN · SELF-APPROVAL — FORBIDDEN.

## 0. Репозитории и SHA

| Репозиторий | Ветка | База (сверено) | Результат |
| --- | --- | --- | --- |
| Landing `Endevor-VIK/endevor-vik.github.io` | `feature/showcase-v0-3-1-polish`, Draft PR #4 | `0f2e7174` (HEAD PR #4), `main` `2dbb6165` | код `373aeec5` → `42238e83` (9 коммитов), документы — следующий коммит |
| Canon `Endevor-VIK/AXS_CANON_V3` | `agent/0110-black-protocol-neuratech-alignment`, **Draft PR #2** https://github.com/Endevor-VIK/AXS_CANON_V3/pull/2 | `0b1c4bab` (= `origin/main` = root gitlink) | `f004951f` + `af6517e696881a01945782498db9c79324884c02` (HEAD) |
| AXS root | — | gitlink `canon/v3` = `0b1c4bab`, `apps/endevor-vik.github.io` — без изменений | не менялся |

Коммиты лендинга: `373aeec5` D-01 · `8da74a99` D-02/D-04/D-05/D-07 · `077c8c0a` D-03/D-14 · `84d17db0` D-10/D-12/D-13/D-17 · `43d46fb9` E-01/E-02 · `1ea855f4` E-03/E-04 · `71c145bf` smoke-контракт · `04f21583` D-08 · `42238e83` D-02: статы персонажей без обрезки в узких карточках (+R44).

## 1. Реестр решений и исполнение

| ID | Решение CREATOR | Сделано | Коммит |
| --- | --- | --- | --- |
| D-01 | ID Canon обязательны | WORLD: карточки `02.01…02.06` в порядке канона (FACELESS BASE 02.03 перед ECHELON 02.04); данные — по `canonicalId`, порядок показа отдельно; полные имена в описании (§2) | `373aeec5` |
| D-02 | A | Виктор: STATUS `OFFICIALLY DEAD`, подпись `OPERATIONALLY ACTIVE`; в тексте карточки — «По документам мёртв, но продолжает действовать.» (03.01 v2.3: `officially dead / operationally active`). Найдено при проверке переносов: в трёхколоночной сетке на 768 и 1100 px строка статов обрезала «UNCLASSIFIED» — исправлено (трекинг по ширине карточки, перенос строки статов), R44 | `8da74a99`, `42238e83` |
| D-03 | A | Фрагмент 03 — `ECHO LAYER — петли, фантомные ответы и отголоски AXIOM…` (03.03 v3.4 CANON, `echo_mode`), подвал `SOURCE AXIOM · MODE ECHO` вместо `HOST NEXARCH · CLASS SHADOW`; подпись `// signed: NEXARCH`. Метка BLACK ECHO на карточке Серафин сохранена (03.21, WORKING) | `077c8c0a` |
| D-04 | A | Лиза: `LINK · VOIDLINK` | `8da74a99` |
| D-05 | A | AXIOM ∅: `SYSTEM INTELLIGENCE · FRACTURED` в подзаголовке, классе, NATURE и заголовке блока (03.03: `PRIMARY SYSTEM INTELLIGENCE / FRACTURED …`). Проза манифеста, включая «третью форму сознания», сохранена | `8da74a99` |
| D-06 | Развивать существующий Canon | Сводка употреблений и подготовка Canon (§3); на лендинге фрагмент 04 «Black Protocol / OPERATOR CURATOR» уже согласован с действующими источниками — не менялся | Canon `f004951f`, `af6517e6` |
| D-07 | B | `WITNESSES` → `CONTACTS`; строка терминала `witness ::` → `contact ::` | `8da74a99` |
| D-08 | Конкуренты, ранее совместные разработки | Хронология в Canon (§4); карточка NEURA TECH: «— NEURO-CONTROL CONGLOMERATE», «Когда-то вёл совместные разработки с ENDEAVOR — теперь её конкурент. Общее технологическое прошлое не отменило борьбы за контроль.», `TIER CORPORATE · STATE RIVAL` (было `SIGNAL ANALYTICS`, `OBSERVER`, `NEUTRAL`) | `04f21583` |
| D-10 | B | Оси из 02.00: в CARTOGRAPHY (текст и подписи схемы), в нижней строке WORLD; `DEPTH / SHIELD / AUTHORITY` убраны. Новых связей нет | `84d17db0` |
| D-12 | B | CHRONICLE: `CHRONICLE · STORY ARCHIVE` вместо `UNITS · 06 CHAPTERS` | `84d17db0` |
| D-13 | A | Master Graph — «граф записей мира с привязкой к Canon» в глоссарии, SYSTEM, карточке архива и сообщении схемы; «контроль целостности» убран | `84d17db0` |
| D-14 | B | `TIER 9` / `T9` → `SEALED` (штамп, CLEARANCE, REDACTED, подвал фрагмента 01 `ARCHIVE · SEALED`, `ctrl_bus :: SEALED active`); в журнале терминала `archive.lock Ω` | `077c8c0a` |
| D-15 / D-16 | A / A | Без переделки: `gate.json` (`checkedAt 2026-10-17`, `expires 2026-10-31` — 14 суток), текст «Вход временно закрыт · статус на 17.10»; smoke проверяет TTL ≤ 14 суток, R41 — шесть состояний флага | `71c145bf` |
| D-17 | B | CONTENT: `PUBLISHED` вместо `LIVE`; журнал PING сохранён | `84d17db0` |
| D-19 | A | `/reindex` на скриншоте оставлен; privacy-review Q-15 в силе | — |
| E-01 | — | WEB CORE: «Публичная точка входа в AXIOM: история, персонажи, материалы Canon, Chronicle и Content Library — в одном читательском интерфейсе.» + WHAT IT SOLVES / USER VALUE | `43d46fb9` |
| E-02 | — | Разграничение публичных и закрытых экранов — один раз в шапке WORK; в архиве — «уровень доступа указан у каждого экрана» (у всех 8 экранов есть «ДОСТУП: …») | `43d46fb9` |
| E-03 | — | B04: desktop — вся панорама 2,5:1 без кропа; планшет — 2:1; телефон — 5:4 вокруг планеты с красным ободом; `sizes` по нарисованной ширине. Источник 1983 px не растягивается: на desktop HiDPI резкость 0,72 — предел оригинала, нового источника не требуется для mobile/tablet | `1ea855f4` |
| E-04 | — | A07: рядом с пояснением схемы, 16:10, до 560 px (на DPR 2 — 1,29 от нужного), ниже 980 px — на всю колонку 16:10; вместо полосы 1351×320 (0,54 на DPR 2) | `1ea855f4` |

Не пересматривались (§XVIII директивы): D-09/Q-10, D-11/Q-14, D-18 (версия v0.3.0.0), Q-12, Q-17, порядок VISION/CONTACT, палитра, шрифты, WORK B, одна галерея.

## 2. D-01 — канонические ID WORLD

| Canon ID | Карточка | Описание (полное имя) | Источник |
| --- | --- | --- | --- |
| 02.01 | GLUHAYA | 02.01 / GLUHAYA STATION | `02.01_GLUHAYA_STATION/02.01.01_GLUHAYA_STATION.md` (DRAFT / EXECUTION WAVE 1) |
| 02.02 | NEXUS | 02.02 / NEXUS | `02.02_NEXUS/02.02.01_NEXUS.md` (DRAFT / EXECUTION WAVE 1) |
| 02.03 | FACELESS BASE | 02.03 / FACELESS BASE | `02.03_FACELESS_BASE/02.03.01_FACELESS_BASE.md` (ACTIVE / CANON_WITH_OPEN_DETAILS) |
| 02.04 | ECHELON | 02.04 / ECHELON | `02.04_ECHELON/02.04.01_ECHELON.md` (SYSTEM STRUCTURE) |
| 02.05 | OMEGA-0 | 02.05 / LABORATORY OMEGA-0 | `02.05_LABORATORY_OMEGA_0/02.05.00.r_README.md` (SYSTEM STRUCTURE) |
| 02.06 | AI ZONE | 02.06 / AI ZONE | `02.06_LOCATION_AI_ZONE/02.06.01_AI_ZONE.md` (ACTIVE) |

Реализация: у кнопки — `data-canon-id`, данные — объект по ID, счётчик «0N / 06 SELECTED» — по позиции карточки. Координаты карты к ID не привязывались (Q-12 отложен), заголовок и V10 не менялись. R42 проверяет порядок, совпадение ID / имени / описания / выделения при выборе мышью и клавиатурой в Chromium и Firefox.

## 3. D-06 — BLACK PROTOCOL и Куратор

**Поправка к W1/W2.** В W1 (`W2_CANON_EDITORIAL_PROPOSALS.md`, P-11) и W2 (D-06) было сказано, что «Black Protocol» как термин в каноне не найден. Это неполный вывод: термин употребляется в 12 Markdown-файлах Canon V3 и в реестре и графе типизированных связей.

| Употребление | Источник | Статус / truth |
| --- | --- | --- |
| Режим эскалации силового контура ENDEAVOR | `06.01_ENDEAVOR.md` B04.S02 | ACTIVE |
| Маршрутизация и интерфейсы башни | `06.01` B02.S03, B05.S01 | ACTIVE |
| UI-маркер ENDEAVOR | `06.01` B11.S02; `03.22` B04.S01.P01 | ACTIVE; WORKING |
| Категория классификации цели | `03.22` B03.S01.P03 | WORKING |
| Маршрутный профиль Куратора: purpose-bound, без суверенной власти | `08.14` (`creator_decision`), typed relation `ECHELON_ROUTE_06` | DRAFT / AUTHORIZED; CREATOR decision; CANON_WITH_OPEN_DETAILS |
| Совет → Куратор: решение превращается в процедуру | `06.01.04` B05.S01; `03.22` B05.S01 | WORKING |
| Ветка наследия `Forgotten Branch` | `06.01` B13.S02 | WORKING |
| Канал вертикального перемещения вверх | `02.04.01_ECHELON.md` | SYSTEM STRUCTURE |
| «black protocol сценарии» в башне | `02.04.20.02_ENDEAVOR_TOWER` | ACTIVE |
| Граница: Mira — не black-protocol executor | `03.23_MIRA_ELLARD.md` | DRAFT / WORKING |
| Семантический слой «чёрный протокол» | `07.03_SERAPHINE_VEYR.md` (notes) | DRAFT |
| Возможные закрытые зоны, визуальные носители, кандидаты | `02.04.98`, `06.01.05`, `05.30`, `09.08` | possible / visual / candidate |

Вывод: BLACK PROTOCOL — не отдельный документированный протокол, а **закрытый контур эскалации внутренней безопасности ENDEAVOR**. Он объединяет режим эскалации, категорию цели, маршрутный профиль доступа и маркер интерфейсов. `Containment Protocol` в каноне нет и не вводится. Куратор — институциональный антагонист (03.22 B01.S01.P02); запреты B08 (не глава, не Совет, не владелец AXIOM, не абсолютный контролёр) сохранены.

Подготовлено в Canon (`f004951f` + `af6517e6`, Draft PR #2): `03.22` v1.1, BLOCK 12:
- вес Куратора как одного из ключевых антагонистов — CANON по решению CREATOR, только для этого утверждения;
- таблица употреблений;
- сводное чтение — WORKING, без новых механик;
- открытые вопросы для CREATOR: кто санкционирует эскалацию; одна процедура или семейство; связь с Протоколом Стирания.

Статус документа остаётся DRAFT.

## 4. D-08 — NEURA TECH × ENDEAVOR

| Этап | Источник | Статус / truth |
| --- | --- | --- |
| Совместный ранний контур, ACCELERATOR как совместный проект | `06.02` v1.4; `03.20` B01.S01.P03 | DRAFT; DRAFT-зона |
| Caelan — инженер первого круга NEURA TECH в раннем контуре ACCELERATOR | `03.20` B01.S01.P02; `03.01` B06.S01.P01 | CANON_WITH_OPEN_DETAILS; ACTIVE |
| Расхождение по контролю и этике; ENDEAVOR централизует | `06.02`; `03.01`; `05.01` B08.S01 | DRAFT; ACTIVE; «текущий DRAFT-канон» в ACTIVE-файле |
| Протокол Стирания; NEURA TECH теряет контроль | `03.01`; `18.06` | ACTIVE; DRAFT |
| Раздел наследия | `06.02` | DRAFT |
| Сейчас — скрытое противостояние | `06.02`; `03.01` («тайные конфликты NEURA_TECH vs ENDEAVOR») | DRAFT; ACTIVE |

- Поимённо общей разработкой назван только ACCELERATOR. Авторство разделено: ранняя архитектура — Caelan, поздняя система маршрута — MR_X, логика контроля — ENDEAVOR (05.01 B08.S01).
- В ACTIVE `06.01_ENDEAVOR.md` NEURA TECH не упоминалась. В Canon добавлена одна строка в Faction Conflicts (`06.01` v2.1) и хронология в `06.02` v1.5 (DRAFT сохранён).
- Для CREATOR: `03.01`/`03.20` связывают Протокол Стирания с ENDEAVOR, `06.02` не называет исполнителя, `18.06` описывает это как связь (DRAFT).

## 5. W2.R-C — согласованность репозиториев

| Публичная формулировка | Опора | Зависит от непринятой ветки Canon? |
| --- | --- | --- |
| NEURA TECH: «Когда-то вёл совместные разработки с ENDEAVOR — теперь её конкурент…» | Решение CREATOR (директива 0524.W2.R) + `06.02` DRAFT + `03.01` ACTIVE в `main` | **Нет.** ACCELERATOR, даты, условия на странице не названы |
| «NEURO-CONTROL CONGLOMERATE» | Заголовок `06.02` в `main` (DRAFT) | Нет |
| Фрагмент 04 «Black Protocol / OPERATOR CURATOR» | `06.01` ACTIVE, `03.22` WORKING, `08.14` creator_decision — всё в `main` | Нет |
| «Куратор — ключевой антагонист» | Только в ветке Canon | **На странице не используется** — HOLD до приёмки Canon PR #2 |
| Сводное чтение BLACK PROTOCOL | Только в ветке Canon (WORKING) | **На странице не используется** — HOLD |

## 6. QA (W2.R-D)

| Проверка | W2 `0f2e7174` | W2.R `04f21583` |
| --- | --- | --- |
| Браузерная регрессия | 122 / 0 | **130 passed / 0 failed / 0 skipped** (65 × Chromium 149 + Firefox 151) на `42238e83`: новые R42 (ID WORLD), R43 (B04 на телефоне, A07 на 1440@2), R44 (статы персонажей 360…1920) |
| Smoke ×2 | PASS | PASS + контракт D-01…D-17, TTL флага |
| axe-core 4.12.1 desktop / mobile | 0 / 0 | 0 / 0 |
| Текст на красных заливках | 5,31:1 | 5,31:1 |
| Без горизонтальной прокрутки 360…1920, ландшафт, 200 % | PASS | PASS (R01) |
| Карта V10 FIT / 1:1, архив 1:1 с левым краем, диалоги, фокус, клавиатура | PASS | PASS (R05, R19, R38, R39, R40) |
| gate.json: жив / истёк / available / 404 / ошибка / таймаут | PASS | PASS (R41) |
| Reduced motion, без JS, лоадер 24 ч | PASS | PASS |
| Lighthouse, палитра, снимки до/после | — | §6.1 |

### 6.1 Измерения

| Проверка | W2 `0f2e7174` | W2.R |
| --- | --- | --- |
| Lighthouse mobile Perf (прогоны) / FCP / LCP / TBT / CLS | 97 (97/97/97) / 1,58 с / 2,41 с / 0 / 0,019 | 97 (97/97/97) / 1,65 с / 2,40 с / 1 мс / 0,020 |
| Lighthouse desktop Perf / LCP / CLS | 100 / 0,53 с / 0,005 | 100 / 0,52 с / 0,005 |
| Передано (LH) mobile / desktop | 323 / 410 КБ | 324 / 411 КБ |
| Розовый по отрисовке, страница UI 1440 / 390 (строгий / заметный) | 0,650 / 0,048 % · 0,701 / 0,030 % | 0,644 / 0,048 % · 0,699 / 0,030 % |
| Резкость: A07 на 1440@2 | 0,54 | ≥ 0,95 (1,30) |
| Резкость: B04 на 390@3 / 430@3 | 0,80 / 0,80 | 0,92 / 0,83 |
| Резкость: B04 на 960@2 (планшет, кадр 2:1) | 1,14 | 0,91 — цена более высокого кадра; источник 1983 px |
| Резкость: B04 на 1440@2 | 0,73 | 0,73 — предел оригинала (не растягивается) |
| Случаев < 0,95 всего (9 конфигураций) | 13 | 13 (портреты персонажей и B02 — без изменений с W1.R) |
| Карта: 1:1 3840w / слабое устройство 2880w / до открытия 0 Б | как в W2 | как в W2 (`map/map-viewer.json`) |

Lighthouse, палитра, резкость и сеть сняты на `04f21583`; финальная правка `42238e83` меняет только CSS статов персонажей — регрессия, smoke, axe и сравнение ENTITIES перемерены на ней. Снимки до/после (1440@1 и 390@2): первый экран, WORK, SYSTEM, MANIFESTO, MODULES, WORLD, ENTITIES, AXIOM ∅, FACTIONS, VISION — `compare/`.

### 6.2 NOT RUN / BLOCKED

- WebKit/Safari, реальные устройства, скринридер, полевые CWV, живой Pages — NOT RUN.
- Canon: `axiomctl canon v3 index` / `export` — BLOCKED. Генератор отказывает уже на базе `0b1c4bab` (ops-файлы 0108/0109: «mode must be Canon»), поэтому сгенерированные NAV/search/anchor не обновлены. Перед любым слиянием Canon нужна квалификация (QUALIFICATION_REQUIRED). GMS strict и `relations --check` прогнаны на копиях дерева, общий `canon/v3` не трогался.

## 7. Состояние

`main` лендинга `2dbb6165` (= живой сайт), Canon `main` `0b1c4bab`, root gitlink `canon/v3` = `0b1c4bab` — не менялись. Production — HOLD, версия — v0.3.0.0.

## 8. Открытые вопросы CREATOR

1. Приёмка Canon PR #2. До неё статус «ключевого антагониста» и сводное чтение BLACK PROTOCOL на лендинге не используются.
2. Открытые вопросы BLACK PROTOCOL (03.22 B12.S03): кто санкционирует эскалацию; одна процедура или семейство; связь с Протоколом Стирания.
3. Исполнитель Протокола Стирания: расхождение формулировок 03.01/03.20 и 06.02/18.06.
4. Актуальность флага `gate.json` перед любым релизом. Срок истекает 31.10.
