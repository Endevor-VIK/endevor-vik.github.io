<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.README
  title: "AXIOM SHOWCASE V0.3.1 — документы итерации"
  status: ACTIVE
  deployment: NOT_DEPLOYED
  mode: Index
  goal: "Вход в документы итерации V0.3.1 (AgentOps 0524)"
  scope: apps/endevor-vik.github.io/docs/showcase-v031
  lang: ru
  last_updated: 2026-10-17
  editable_by_agents: true
  change_policy: "Обновлять при добавлении документов или волн"
-->

# AXIOM SHOWCASE V0.3.1 — документы итерации

Ветка `feature/showcase-v0-3-1-polish` · AgentOps `0524` · MAIN MERGE = HOLD · PRODUCTION DEPLOY = HOLD.

| Документ | Что внутри |
| --- | --- |
| [W2R_REPORT.md](./W2R_REPORT.md) | **W2.R (Principal Recheck):** решения CREATOR D-01…D-19, E-01…E-04; ID Canon в WORLD; BLACK PROTOCOL и NEURA TECH × ENDEAVOR с источниками; Canon Draft PR #2; QA |
| [W2_REPORT.md](./W2_REPORT.md) | **W2 (пакет на Principal Review):** карта V10 1:1, правки текста по Canon V3, подсказка у ENTER AXIOM, версии, измерения, NOT RUN |
| [W2_CANON_SOURCE_MATRIX.md](./W2_CANON_SOURCE_MATRIX.md) | Каждая правка W2 — файл Canon V3, версия, статус, уровень истины, коммит |
| [CREATOR_DECISION_REGISTER.md](./CREATOR_DECISION_REGISTER.md) | Спорные формулировки и продуктовые решения D-01…D-20 с вариантами (в UI не внедрены) |
| [W1R_REPORT.md](./W1R_REPORT.md) | **W1.R (Principal Recheck):** финальные WORK B / TYPE A, остаток розового по отрисовке, регрессии, Lighthouse, NOT RUN |
| [PRIVACY_CHECK_W1R.md](./PRIVACY_CHECK_W1R.md) | Privacy gate Q-15: все варианты 8 скриншотов, реестр значений и рисков |
| [W1_REPORT.md](./W1_REPORT.md) | **W1 (пакет на Principal Review):** решения Q-01…Q-09 и что сделано, реестр изменений с SHA, варианты A/B на решение CREATOR, измерения (регрессия, axe, контраст, палитра, резкость, Lighthouse), что не проверено, вопросы |
| [W2_CANON_EDITORIAL_PROPOSALS.md](./W2_CANON_EDITORIAL_PROPOSALS.md) | Вход в W2: расхождения с Canon V3 (OMEGA-0, FACELESS BASE, AI ZONE, NIGHTMARE, X-CLASS, имитация файлов канона) и редакционные предложения — на решение CREATOR |
| [AUDIT_REPORT.md](./AUDIT_REPORT.md) | Посекционный аудит W0: находки P0–P3, доказательства, причины, предложения, опровергнутые гипотезы, что исправлено в W0.1, план W1 |
| [VISUAL_SYSTEM.md](./VISUAL_SYSTEM.md) | Черновик листа решений: палитра, роли шрифтов, отступы, примитивы, движение, решения по экранам |
| [CANON_REVIEW.md](./CANON_REVIEW.md) | Сверка терминов с Canon V3 (`canon/v3` @ `0b1c4bab`): VERIFIED / REWORD / AMBIGUOUS |
| [IMAGE_AUDIT.md](./IMAGE_AUDIT.md) | Происхождение, пиксели, вес и резкость изображений; план переэкспорта из оригиналов |
| [QA_MATRIX.md](./QA_MATRIX.md) | Среды, матрица снимков, интерактив, доступность, производительность — PASS/FAIL/NOT RUN |
| [PRESERVATION_REPORT.md](./PRESERVATION_REPORT.md) | Что из оригинала сохранено/изменено (W0/W0.1: ничего; W1: структура WORK, тексты HERO/индексов/CONTACT — с исходниками дословно) |
| [OPEN_ISSUES.md](./OPEN_ISSUES.md) | Решения CREATOR (Q-01…Q-18), блокеры, отложенное, перенос пунктов V2.2 |
| [REVIEW_HANDOFF.md](./REVIEW_HANDOFF.md) | Git, коммиты, воспроизведение, ручная проверка, риски |
| [captures/w1/](./captures/w1/) | Отобранные сравнения W1 (WebP): первый экран до/после, WORK «до» / B / A, шрифты A/B; полный набор — в `sandbox/evidence/2026-10-16_0524_showcase-v031-w1/` |
| [captures/w0/](./captures/w0/) | 13 отобранных снимков-доказательств (JPEG, ≈ 0,9 МБ); полный набор — в `sandbox/evidence/2026-10-16_0524_showcase-v031-w0-audit/` рабочего пространства AXS |

Браузерная регрессия: [`tests/browser/showcase_regression.cjs`](../../tests/browser/showcase_regression.cjs) — 65 проверок × Chromium + Firefox (W2.R).
