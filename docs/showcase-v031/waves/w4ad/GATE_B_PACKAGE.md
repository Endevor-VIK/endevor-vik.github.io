<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.GATE_B_PACKAGE
  title: "0524.W4.R — Gate B record"
  status: R4_PASS_WITH_RECORDED_LIMITS / PERF_PASS_17_OF_17 / CREATOR_AUTHORITY_2026-10-22 / RELEASE_VIA_CLEAN_BRANCH
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-22
  editable_by_agents: true
-->
# Gate B — запись

## Объекты

| Объект | Значение |
| --- | --- |
| Runtime, прошедший R4 | **`685140a40e55f151f9edcf9e7ab0170773ad4f55`** = R2.3 `8815f17` + R3 D-04/D-05 (`b6040e3`) + D-06 perf |
| Ветка доказательств | `w4/world-narrative`, PR #12 (Draft). Не сливается: 87 МиБ доказательств, 37 файлов с локальными путями хоста |
| Ветка релиза | `release/0524-w4r` от `main` `6b082e5`: только продукт и тесты из `685140a` + версия v0.3.1 + короткие release-документы |
| Утверждённый эталон | A+AD `9cf78b0`, Gate R-A APPROVED |
| Продукт до R2 | `b85fbb0a` |

Стадии (Opus — исполнитель и арт-директор, записи — SELF-CHECK):

| Стадия | SHA | Запись |
| --- | --- | --- |
| R2.1 BLACK SUN / WHAT REMAINS | `e651c63` | [OPUS_REVIEW_R2_1](OPUS_REVIEW_R2_1.md) |
| R2.2 WORK / FOUR SURFACES | `4446747` | [OPUS_REVIEW_R2_2](OPUS_REVIEW_R2_2.md) |
| R2.3 WORLD GRID / CHARACTERS | `8815f17` | [OPUS_REVIEW_R2_3](OPUS_REVIEW_R2_3.md) |
| R3 fit fixes D-04/D-05 | `b6040e3` | [R3_REPORT](R3_REPORT.md) |
| D-06 perf (стиль без блокировки отрисовки) | `685140a` | [R3_REPORT](R3_REPORT.md), [OPUS_DECISIONS](OPUS_DECISIONS.md) |

## Проверки

| Проверка | Итог | Запись |
| --- | --- | --- |
| R3 исполнителя на `685140a` (SELF-CHECK) | матрица 225/225, ширины 0 сбоев, zoom 200 % 22/22, регрессия 230/2 (долги HERO), стадии 61/61 · 46/46 · 47/47 | [R3_REPORT](R3_REPORT.md) |
| Производительность, бюджеты объявлены до результатов | `b6040e3` — FAIL B2 (сохранён); `685140a` — **17/17 PASS**, mobile LCP 2 491,7 мс при пороге 2 500 | [R3P_PERF_BUDGETS](R3P_PERF_BUDGETS.md) |
| **Независимый R4** (отдельный агент, не Opus) | **PASS WITH RECORDED LIMITS**, P0 и P1 нет; повторный замер 17/17 PASS (mobile LCP 2 491,2 мс) | [R4_INDEPENDENT_REVIEW](../../evidence/w4r2/r4/R4_INDEPENDENT_REVIEW.md), доказательства `evidence/w4r2/r4/evidence/` (`SHA256SUMS`) |

Исходные отчёты Lighthouse повторного замера R4 (19 МБ) — вне репозитория: `AXS/sandbox/evidence/2026-10-22_0524_w4r-release/r4-perf-raw-reports.tar.gz`, sha256 `f4abd17a50472d689c0fbb083af1738f95ea2c43b451e629c22e90ceda48722b`.

## Находки R4 и решения

| ID | Находка | Решение |
| --- | --- | --- |
| P2-1 | Доказательства PR #12 (1 937 файлов / 87,2 МиБ; 37 файлов с путями хоста) попали бы на GitHub Pages | **Закрыто схемой релиза:** сливается только чистая ветка `release/0524-w4r`; доказательства сохраняются неизменяемым тегом на голове PR #12 + манифест SHA256 в ветке релиза. Аудит размера `R3_PR_SIZE_AUDIT` устарел (1 778 / 78,3 МиБ) — актуальные числа здесь |
| P3-1 | D-06: при искусственной задержке одного `showcase-w4r.css` на 2 с переход по `/#manifesto` и `/#modules` уезжает; при реалистичном троттлинге — как у `b85`. D-06 зависит от inline `onload` — будущий CSP без `'unsafe-inline'` оставит стиль неприменённым | Записанное ограничение. CSP на сайте сейчас нет; при введении CSP — пересмотреть D-06 |
| P3-2 | Firefox, лента следов, 375–430 px: каждое второе ArrowRight не сдвигает ленту; все карточки достижимы | Записанное ограничение, отдельная задача |
| P3-3 | WebKit, нестабильный первый ArrowRight (2/160 в headless WPE), карточка достижима другими способами | Записанное ограничение; проверить на настоящем Safari macOS, исправлять отдельной задачей |
| P3-4 | Исполнитель правил охранные тесты | В рамках Gate R-A; независимое сравнение R4 с `b85fbb0a` подтверждает, что ничего не скрыто |
| P3-5 | Слабости инструментов исполнителя: клавиатурная проверка матрицы откатывается на `scrollBy`; проверка изображений WebKit зависит от времени загрузки; `w4_perf.cjs` жёстко чистит `/tmp/axs-0524-w4-perf` | Записано; инструменты не входят в продукт |
| P3-6 | Пустая строка в `#chars`; на 1024 px терминал выше A+AD на 166 px (у A+AD там наложение текста) | Записано |

Базовые долги HERO `W4-DEBT-HERO-01/02` (`R-W3A-02-poster-frame-1024x768`, `R01-no-h-overflow-720x450@2`) остаются FAIL — они есть и в `b85fbb0a`.

## Полномочия

CREATOR, 2026-10-22: «разрешаю делать: Merge, деплой, Canon, gitlink и версия». Версия — **v0.3.1** (выбор CREATOR). Canon менять не требуется: тексты W4.R сверены с Canon `3884ea43` только на чтение.

## Не проверено

Физические устройства, настоящий Safari macOS/iOS, screen reader, полевые Web Vitals и CDN Pages.

## Визуальная передача

- До → после: https://claude.ai/artifact/7CXkQXnRonabYL6BKu2R7q (`evidence/w4r2/r3/handoff.html`; кадры `b6040e3`, разметка секций с тех пор не менялась).
- A+ → A+AD: https://claude.ai/artifact/REi9LvzkgmXBga9hRtu7xw.
