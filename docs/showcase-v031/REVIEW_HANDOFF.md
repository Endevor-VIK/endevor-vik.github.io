<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.REVIEW_HANDOFF
  title: "AXIOM SHOWCASE V0.3.1 — Review Handoff (W0 + W0.1)"
  status: READY_FOR_PRINCIPAL_REVIEW
  deployment: NOT_DEPLOYED
  mode: Handoff
  goal: "Git-состояние, изменения, команды воспроизведения, что проверить вручную, риски и статус для AXIOM Principal Review и CREATOR"
  scope: apps/endevor-vik.github.io — task 0524, waves W0 + W0.1
  lang: ru
  last_updated: 2026-10-16
  editable_by_agents: true
  change_policy: "Обновлять на каждой волне; SHA — только фактические"
  links:
    audit: ./AUDIT_REPORT.md
    qa_matrix: ./QA_MATRIX.md
    open_issues: ./OPEN_ISSUES.md
-->

# AXIOM SHOWCASE V0.3.1 — REVIEW HANDOFF (W0 + W0.1)

## 1. Статус

**W0 — аудит: COMPLETE. W0.1 — исправление подтверждённых технических дефектов: IMPLEMENTED + VERIFIED (52/52 браузерных проверок). READY FOR PRINCIPAL REVIEW.**
MAIN MERGE = **HOLD** · PRODUCTION DEPLOY = **HOLD** · самоприёмка не заявляется: визуальное решение — за CREATOR.

## 2. Git

| Поле | Значение |
| --- | --- |
| Репозиторий | `Endevor-VIK/endevor-vik.github.io` (сабмодуль `apps/endevor-vik.github.io` в AXS) |
| База | `main` = `2dbb6165d04f9357be3141570f3b9bd76231bb3a` (совпадает с живым сайтом) |
| Ветка | `feature/showcase-v0-3-1-polish` (запушена) |
| Коммиты W0.1 (от базы) | `ce45ee60e49bad29d9bb74637c52e19202d52c8c` test: регрессионный набор + smoke · `5afb4509857bd900f4e39bc82974bfc3c34cc173` fix: раскладка WORK/галереи/VISION · `c7eae11b0a0e74690058174538a0d2b15ea0bffa` fix: stage srcset, фокус просмотрщика, карта по запросу · `a06533f8c839d7c5e119c1c1a560c0f060ea6916` fix: указатель в диалогах, SMIL, якоря · `397c69e057117de5305755a5f23494983e61d0ca` fix: имена, кнопка карты, 404, лоадер |
| Документы W0 | коммит с `docs/showcase-v031/` идёт следом за кодом (SHA — в журнале AgentOps 0524 и сообщении о передаче) |
| `main` | не тронут; PR не создавался (W4) |
| Gitlink в AXS | **не двигался** (`apps/endevor-vik.github.io` в корне по-прежнему указывает на свой прежний коммит; продвижение — отдельная операция после принятого `main`) |
| Рабочие деревья | `/home/axiom/ENDEAVOR/AXS-WORKTREES/0524-showcase-v031-polish` (ветка), `/home/axiom/ENDEAVOR/AXS-WORKTREES/0524-showcase-baseline-2dbb616` (detached база для сравнений); общий checkout сабмодуля не менялся |

Изменённые файлы (код): `index.html`, `404.html`, `loader.html`, `assets/css/{index,showcase,showcase-v22,showcase-v23}.css`, `assets/js/{index,showcase-gallery,showcase-v23}.js`, `tests/smoke_showcase.py`, `tests/browser/showcase_regression.cjs` (новый). 12 файлов, +268 / −32.

## 3. Что изменено (W0.1, без изменения дизайна)

См. `AUDIT_REPORT.md` §15: мобильный WORK (P0), галерея в одну колонку на телефонах, резкий stage после выбора, возврат фокуса просмотрщика без прыжка, карта по запросу (−1,68 МБ начальной загрузки), указатель мыши в диалогах, SMIL при reduced-motion, точные якоря, «Зависимость» в VISION, стиль кнопки карты, label-in-name, 404 на вложенных путях, ошибка консоли лоадера, противоречивый smoke.

## 4. Воспроизведение

Playwright в этом статическом репозитории не является зависимостью; используется установленный в AXS (`apps/axiom-web-core-ui/node_modules`).

```bash
cd apps/endevor-vik.github.io            # или worktree ветки
# 1) структурные smoke
python3 tests/smoke_showcase.py && python3 tests/smoke_showcase_v23.py
# 2) браузерная регрессия (сам поднимает статический сервер репозитория)
NODE_PATH=/home/axiom/ENDEAVOR/AXS/apps/axiom-web-core-ui/node_modules \
  node tests/browser/showcase_regression.cjs --firefox
# ожидание: 52 passed, 0 failed, 0 skipped
# на базе 2dbb616 тот же набор: 17 passed, 35 failed — документирует дефекты
```

Аудиторские инструменты W0 (зонд геометрии, съёмка, интерактив, замер веса, axe, Lighthouse-обвязка) лежат в evidence: `sandbox/evidence/2026-10-16_0524_showcase-v031-w0-audit/tools/` (вне git; README и MANIFEST там же).

## 5. Что попробовать вручную (5 минут)

1. Телефон (или DevTools 390×844): раздел **WORK** — блок AXIOM WEB CORE в одну колонку, заголовок виден; сетка экранов в одну колонку.
2. Ноутбук с Retina/150 %: WORK stage — выбрать «03 CHRONICLE»: мелкий текст скриншота чёткий; «ОТКРЫТЬ В ПОЛНОМ РАЗМЕРЕ» → Esc: страница остаётся на месте, фокус на кнопке.
3. Открыть лайтбокс или карту мышью — указатель виден.
4. WORLD → «РАССМОТРЕТЬ КАРТУ» — кнопка красная в стиле системы; в DevTools Network карта 2048w появляется только после клика.
5. Меню «WORK»/«VISION» — секция встаёт ровно под шапкой.
6. VISION — «Зависимость» отделена от значения.
7. ОС: «Уменьшить движение» — ядро AXIOM в разделе ENTITIES неподвижно.

## 6. Что проверено / не проверено

- Проверено: см. `QA_MATRIX.md` (Chromium 149 + Firefox 151, 9 вьюпортов + ландшафт, интерактив, axe, Lighthouse по живому сайту, вес до/после).
- **Не проверено:** WebKit/Safari, реальные устройства, реальный GPU, браузерный зум «как у пользователя», тайминги FCP/LCP до/после (сторонняя латентность шрифтов), полный проход только клавиатурой.

## 7. Риски

| Риск | Оценка |
| --- | --- |
| Брейкпоинт 900 px для WORK feature: на 761–900 px блок стал одноколоночным (раньше — узкие 2 колонки) | Намеренно (планшеты); проверено на 768 |
| `html:has(dialog[open])` — старые браузеры без `:has` оставят прежнее поведение курсора (невидимость в диалоге) | Не хуже базы; Chromium 105+, Firefox 121+, Safari 15.4+ поддерживают |
| `scroll-padding-top:97px` привязан к высоте десктопной шапки | При изменении шапки в W1 обновить; R14 ловит расхождение |
| Длина страницы на 360 px выросла на 957 px (сетка в одну колонку) | Цена правильной раскладки; решается Q-01 (единый архив) |
| Карточки сетки на телефонах DPR3 теперь растягиваются ×1,1–1,25 | Закрывается `srcset` 1440w в W1 |

## 8. Решения и следующий шаг

Нужны: AXIOM Principal Review этого пакета и ответы CREATOR на Q-01…Q-09 (`OPEN_ISSUES.md`). После этого — W1 по плану `AUDIT_REPORT.md` §16 с той же доказательной базой (снимки до/после, регрессия, Lighthouse в одном временном окне).
