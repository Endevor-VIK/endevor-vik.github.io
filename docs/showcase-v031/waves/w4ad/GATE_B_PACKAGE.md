<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.GATE_B_PACKAGE
  title: "0524.W4.R — Gate B package for CREATOR"
  status: GATE_B_PENDING / R4_PENDING / PERFORMANCE_BLOCKED / MERGE_DEPLOY_NOT_AUTHORIZED
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# Gate B — пакет для CREATOR

## Что готово к решению

| Объект | Значение |
| --- | --- |
| Implementation SHA (runtime-заморозка) | **`b6040e3cbd110b807c5a33d6cccf4b52f7b05ed7`** |
| Ветка / PR | `w4/world-narrative`, PR #12, Draft (fast-forward от `895b7cf` через ветку Opus) |
| Утверждённый эталон | A+AD `9cf78b0`, Gate R-A APPROVED |
| Продукт до R2 | `b85fbb0a` (на сайте сейчас `main` `6b082e5`) |

Стадии (Opus — исполнитель и арт-директор, записи — SELF-CHECK):

| Стадия | SHA | Запись |
| --- | --- | --- |
| R2.1 BLACK SUN / WHAT REMAINS | `e651c63` | [OPUS_REVIEW_R2_1](OPUS_REVIEW_R2_1.md) |
| R2.2 WORK / FOUR SURFACES | `4446747` | [OPUS_REVIEW_R2_2](OPUS_REVIEW_R2_2.md) |
| R2.3 WORLD GRID / CHARACTERS | `8815f17` | [OPUS_REVIEW_R2_3](OPUS_REVIEW_R2_3.md) |
| R3 fit fixes D-04/D-05 | `b6040e3` | [R3_REPORT](R3_REPORT.md) |

Отклонения от A+AD — пять, все в CSS, разметка равна прототипу: [OPUS_DECISIONS](OPUS_DECISIONS.md). D-01 — белая искра пульса вместо розовой (правило палитры). D-02…D-05 — посадка текста на узких телефонах и планшетах.

## Визуальная передача

- **До → после R2:** [`evidence/w4r2/r3/handoff.html`](../../evidence/w4r2/r3/handoff.html), опубликована приватно: https://claude.ai/artifact/7CXkQXnRonabYL6BKu2R7q. Пять секций, BEFORE `b85fbb0a` / IMPLEMENTED `b6040e3`, нативные кадры 1440/390, контроль в Chromium, Firefox и WebKit.
- **A+ → A+AD** (художественное решение): https://claude.ai/artifact/REi9LvzkgmXBga9hRtu7xw.

## Проверки

R3 исполнителя: [R3_REPORT](R3_REPORT.md). Коротко:
- матрица из 3 движков и 10 размеров — 224/225 (один нестабильный шаг клавиатуры в WebKit; дополнительная проверка 40/40);
- проход ширин — 0 сбоев в 1 403 ширинах;
- zoom 200 % — 22/22;
- регрессия — 230/2 (только долги HERO);
- самопроверки стадий — 61/61, 46/46, 47/47;
- axe — 0 нарушений;
- защищённое (карта, OMEGA-0, W04, портреты, AXIOM ∅, viewer, 8 скриншотов) — побайтно как было.

## Открытые пункты до Gate B

1. **Производительность — BLOCKED** из-за диска хоста (C: 14,15 ГиБ, 2,97 %). Нужно восстановить место на хосте (сжатие vhdx / очистка — операция хоста), затем парный замер (~25 мин).
2. **Независимый R4 — не выполнен.** Исполнитель не может быть своим проверяющим. Бриф: [R4_INDEPENDENT_BRIEF](R4_INDEPENDENT_BRIEF.md).
3. **Размещение доказательств перед merge** (77 МиБ в `docs/showcase-v031/evidence/**`): [R3_PR_SIZE_AUDIT](R3_PR_SIZE_AUDIT.md).
4. Базовые долги HERO `W4-DEBT-HERO-01/02` — вне R2, отдельной задачей.

Merge, deploy, Canon, root gitlink и версия — не разрешены, до отдельного решения CREATOR.
