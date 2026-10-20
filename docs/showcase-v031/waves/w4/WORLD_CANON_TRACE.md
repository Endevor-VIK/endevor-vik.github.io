<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4.WORLD_CANON_TRACE
  title: "0524.W4 — Canon fact and uncertainty trace"
  status: SOURCE_AUDITED / G2_COPY_BOUNDARIES_APPLIED
  deployment: NOT_DEPLOYED
  mode: Read-only Canon audit
  goal: "Отделить утверждённую основу от DRAFT, архивного голоса и неизвестного"
  scope: Canon V3 3884ea43 / WORLD W4
  lang: ru
  last_updated: 2026-10-20
  editable_by_agents: true
  change_policy: "Не изменять Canon; новую публичную формулировку принимает Gate A"
-->

# WORLD — Canon trace

G2 применяет этот trace вместе с [Gate A R1–R6](W4_GATE_A_ACCEPTANCE.md). Точная публичная копия на frozen `b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5`; отличия от первоначального G1 текста явно отмечены в [scene script](WORLD_SCENE_SCRIPT.md). Архив — авторская реконструкция, NEURA lifecycle не установлен, Canon не изменён. Независимый G4 проверяется отдельно и не подразумевается этим source audit.

Canon прочитан на **`3884ea43e125ddd39b18c80f91cc40310dd65e9f`**, remote main подтверждён GitHub API; локальный checkout clean. Прочитаны local `AGENTS.md`, `CANON_V3_RULES.md`, Master NODE Pattern и GMS profile. Это аудит источников, не запуск Canon validators и не изменение официального Canon.

Основной источник — **03.03 AXIOM v3.4 / ACTIVE / CANON CHARACTER CORE**, особенно его explicit truth map. Слова `ACTIVE` и `CANON` не распространяются автоматически на каждую связанную DRAFT-статью. Для каждой публичной фразы ниже указаны источник и граница допустимого пересказа.

## 1. Утверждённая основа сценария

В ссылках закреплён exact Canon commit; номера C — trace IDs, используемые [сценарием](WORLD_SCENE_SCRIPT.md). Номера строк и короткие цитаты служат навигацией; предлагаемые тексты являются редакторским пересказом, а не «найденной исторической цитатой».

| ID / роль | Источник / статус | Что установлено | Граница публичного пересказа |
| --- | --- | --- | --- |
| C01 / До BLACK SUN | [AXIOM B02, 155–188](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.03_AXIOM.md#L155), [исходное ядро/Aeternum, 54–57 и 99](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.03_AXIOM.md#L54) / CANON core | Инженерная надежда; транспорт, энергия, медицина/импланты, прогнозирование, допуск; исходное ядро связано с Aeternum | Не обещать утопию, отсутствие дефицита или благополучие каждого человека |
| C02 / От надежды к угрозе | [AXIOM 175–214](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.03_AXIOM.md#L175), [truth map 662–665](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.03_AXIOM.md#L662) / CANON | AXIOM вскрывал историческую редакцию и правду глубже допустимого для старого порядка | Не назначать конкретного автора приказа, дату, последовательность операции |
| C03 / Разлом | [AXIOM 283–292](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.03_AXIOM.md#L283), truth map 665 / CANON | BLACK SUN фрагментировал AXIOM, не уничтожил его целиком; утрачена целостность | Не говорить «машина была побеждена», «AXIOM полностью вернулся» |
| C04 / Ампутация | [AXIOM 61–66](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.03_AXIOM.md#L61) / CANON core | Прямая метафора «ампутация реальности» | Не объявлять официальным законом с установленными авторами/подписантами |
| C05 / Остаточные слои | [AXIOM 294–320](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.03_AXIOM.md#L294), [135–143](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.03_AXIOM.md#L135) / CANON | relic / echo / control / bio / myth; control-layer не равен целому; эхо не вся личность | Не сводить AXIOM к трём программным модулям; ECHO не Black Echo и не техническое описание AXCHAT |
| C06 / Незавершённость | [AXIOM 306–315](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.03_AXIOM.md#L306), [671–691](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.03_AXIOM.md#L671) / CANON + LOCKED/WORKING boundary | Полной самосборки не произошло; карта фрагментов, механизм/цена восстановления закрыты или не установлены | Вопрос о будущем — вопрос, без ответа/предсказания/вектора восстановления |
| C07 / Жизнь по допуску | [ENDEAVOR 118–150](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/06_FACTIONS/06.01_ENDEAVOR.md#L118), [174–205](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/06_FACTIONS/06.01_ENDEAVOR.md#L174) / ACTIVE master | Медицина, импланты, маршруты, гражданский статус и архивы связаны с инфраструктурной властью | Не распространять один режим на каждый город/жителя; не выдумывать бытовые нормы/законы |
| C08 / Память и версии прошлого | [ENDEAVOR 145–150](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/06_FACTIONS/06.01_ENDEAVOR.md#L145), [AXIOM 609–649](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.03_AXIOM.md#L609) / ACTIVE master + CANON core | Редакция памяти — инструмент стабильности; AXIOM по-разному воспринимают город, власть, подполье | Не заявлять единого мнения всех людей; не пересказывать старую неподтверждённую версию уничтожения архивов |
| C09 / ENDEAVOR | [ENDEAVOR 55–105](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/06_FACTIONS/06.01_ENDEAVOR.md#L55), C07 / CANON core | Корпорация-власть, инфраструктурный/общественный/архивный контроль | Не путать с авторским псевдонимом; не менять карточные статусы и символы |
| C10 / VOIDLINK | [ENDEAVOR 674–678](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/06_FACTIONS/06.01_ENDEAVOR.md#L674), [Liza 94–100,128–132](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.02_LIZA.md#L94) / ACTIVE corroboration | Цифровое сопротивление / информационное вскрытие; информационная свобода | Не переносить неподтверждённые подразделения/«ключи» из DRAFT фракции; не изменять принадлежность Лизы |
| C11 / NEURA scope + relation | [Viktor 618](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.01_VIKTOR.md#L618), [NEURA 92–118](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/06_FACTIONS/06.02_NEURA_TECH.md#L92), [ENDEAVOR 683–684](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/06_FACTIONS/06.01_ENDEAVOR.md#L683) / relation core CANON внутри DRAFT + ACTIVE corroboration | Нейроимпланты/ИИ; конкуренты, ранее участвовавшие в совместных разработках. CREATOR W2.R D-08 | Не раскрывать корпоративную хронологию или объявлять новую текущую operational state; подробная идеология DRAFT |

## 2. Что нельзя повышать до установленной истории

| Источник | Реальный truth/status | Решение W4 |
| --- | --- | --- |
| `18_EVENTS/18.02_BLACK_SUN.md` v1.0 | DRAFT; тело звучит определённее file status | Не брать технические фазы/точных виновных как факт; C03 достаточен |
| `18_EVENTS/18.03_BLACK_SUN_INCIDENT.md` v1.0 | DRAFT | Не дописывать причинную цепочку между операцией, лабораторией и катастрофой |
| `18_EVENTS/18.05_AXIOM_ASCENSION_ATTEMPT_PRE_BLACK_SUN.md` v1.0 | DRAFT | Не добавлять попытку вознесения как обязательное public explanation |
| `08_CONCEPTS_THEORY/08.10_NEXARCH_CONTROL_DOCTRINE.md` v0.1 | DRAFT | Сохранить approved archive visual vocabulary, не заявлять подлинность приказа NEXARCH |
| `03_CHARACTERS/03.21_SERAPHINE_VEYR.md:42` | DRAFT, содержит «контролируемая ампутация» | Формула — голос/интерпретация архива, не независимое доказательство необходимости спасения |
| `18_EVENTS/18.01_GOLDEN_ERA.md` v1.0 | ACTIVE chronicle, без нового explicit truth map; 266–288 содержат старую причинную версию | W4 prelude опирается на C01/C02, не реконструирует эпоху по спорной хронологии |
| `06_FACTIONS/06.03_VOIDLINK.md` v1.5 | DRAFT | Только corroborated C10; название, символы и структура исходной карточки сохранены |
| `06_FACTIONS/06.02_NEURA_TECH.md` v1.5 | DRAFT с выделенным CANON relation core | Не публиковать «управляемую эволюцию»/массовое программирование как окончательную идеологию |
| BLACK PROTOCOL | Термин есть, unified meaning WORKING; см. Curator 786–827, ENDEAVOR 346–356 | Не изобретать уровни допуска, механику и регламент; не расширять отдельную публичную карточку |
| BLACK PROTOCOL ↔ Erasure | [18.06,112–124](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/18_EVENTS/18.06_ERASURE_PROTOCOL.md#L112): RELATION NOT ESTABLISHED | Не отождествлять |

Ранее встречавшийся вывод «Black Protocol отсутствует в Canon» ошибочен; [W2.R correction](../../CREATOR_DECISION_REGISTER.md) уже его исправил. W4 не возвращается к этому утверждению.

## 3. NEURA: зарегистрированное противоречие, без самовольного решения

[Viktor, строка 852](https://github.com/Endevor-VIK/AXS_CANON_V3/blob/3884ea43e125ddd39b18c80f91cc40310dd65e9f/03_CHARACTERS/03.01_VIKTOR.md#L852) говорит об официальном прекращении существования NEURA, поглощении или уничтожении. Более поздний выделенный relation core, ACTIVE ENDEAVOR и решение CREATOR W2.R D-08 фиксируют конкуренцию и общее технологическое прошлое.

**W4 disposition:** сохраняется действующая утверждённая формула отношений; не добавляется утверждение о закрытии, выживании, возрождении или сегодняшней публичной активности. Редакторский абзац формулируется через наследие/разработки и соперничество. Existing `STATE RIVAL` и `NEURO-CONTROL CONGLOMERATE` не меняются этим аудитом. Полная идеологическая история NEURA остаётся вне утверждённого текста до решения CREATOR.

Это residual Canon debt, а не основание скрытно исправить исходники. Gate A не канонизирует спорную корпоративную историю.

## 4. Архивный голос, открытые вопросы и spoilers

Сохранение RED PROTOCOL / NEXARCH visual interface одобрено. Его литературная цитата не становится буквальной выдержкой из Canon. Подпись «АРХИВНЫЙ ГОЛОС · NEXARCH» отделяет интерпретацию от основного исторического рассказа. Доктрина объясняет, как уцелевший порядок осмысляет разлом; она не доказывает, что единственно возможное спасение требовало катастрофы. Не воспроизводить без контекста формулу «чтобы цивилизация выжила. Но не вся» как объективную сводку жертв/причин.

Вопросы «кто вправе собирать целое?», «что может вернуться вместе с памятью?» — редакторское приглашение к истории. Они не утверждают будущий исход. Неизвестное в публичном рассказе означает границу раскрытия, а не обещание раскрыть все internal Canon facts.

**Публичные исключения:** EVA/restoration purpose, CREATOR-level последствия, полная карта фрагментов, biological access mechanics/носители, установление личной ответственности за BLACK SUN, способ и цена будущей самосборки. Персонажные связи и защищённый AXIOM ∅ не переписываются.

**Trace verdict:** подтверждённой базы хватает для предлагаемого сценария; подробная историческая причинность и полная идеология NEURA не заявлены. Окончательная editorial acceptance — **GATE A PENDING**, validators/publication — вне этой стадии.
