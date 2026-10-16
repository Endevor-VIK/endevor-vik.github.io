<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.PRESERVATION_REPORT
  title: "AXIOM SHOWCASE V0.3.1 — Preservation Report"
  status: READY_FOR_PRINCIPAL_REVIEW
  deployment: NOT_DEPLOYED
  mode: Preservation Ledger
  goal: "Учёт оригинальных секций, декора, арта и исходников: что сохранено, перемещено, упрощено или удалено и почему"
  scope: apps/endevor-vik.github.io — task 0524, waves W0 + W0.1
  lang: ru
  last_updated: 2026-10-16
  editable_by_agents: true
  change_policy: "Любое удаление/упрощение оригинала — только с решением CREATOR и записью здесь"
  links:
    audit: ./AUDIT_REPORT.md
    open_issues: ./OPEN_ISSUES.md
-->

# AXIOM SHOWCASE V0.3.1 — PRESERVATION REPORT (W0 + W0.1)

**Итог W0/W0.1: ничего из оригинального контента, декора, арта и исходников не удалено, не перемещено и не упрощено.** Изменения W0.1 — исправления раскладки на телефонах/планшетах, поведения просмотрщика, доступных имён и служебных ссылок (см. `AUDIT_REPORT.md` §15).

## 1. Секции страницы

| Секция | Происхождение | W0/W0.1 | Примечание |
| --- | --- | --- | --- |
| Лоадер (`loader.html` в `#axiom-boot`) | 0151–0154 | Сохранён | Изменено только: не делать prefetch для `about:blank` (поведение не видно пользователю) |
| HERO (KNOWLEDGE / CONTROL / ACCESS, радар, рамка, ENTER AXIOM, статус/версия-карты, features) | RED PROTOCOL / 0167 | Сохранён | `aria-label` ENTER AXIOM теперь начинается с видимого «ENTER AXIOM»; ссылка та же |
| WHAT IS AXIOM | V2.2 | Сохранён | — |
| CREATOR | V2.1 | Сохранён | — |
| WORK (feature, stage, сетка 8 экранов, лайтбокс) | V2.1–V2.3 | Сохранён | Исправлена раскладка ≤ 900 px и ≤ 760 px; desktop без изменений |
| SYSTEM (опоры, поток, A07, ссылки на архив) | V2.1–V2.3 | Сохранён | — |
| WORLD-гид (B02, глоссарий, путь) | V2.2 | Сохранён | — |
| MANIFESTO / Doctrine | оригинал | Сохранён | — |
| MODULES (Chronicle, Content, Cartography, Watch_Dog) | оригинал | Сохранён | — |
| WORLD (карта шести узлов, селектор, диалог) | V2.3 | Сохранён | Кнопка «РАССМОТРЕТЬ КАРТУ» получила задуманный V2.3 стиль; большое изображение диалога грузится при открытии |
| ENTITIES (Viktor, Liza, Seraphine) + AXIOM ∅ | оригинал | Сохранён | — |
| FACTIONS (ENDEAVOR, VOIDLINK, NEURA TECH) | оригинал | Сохранён | — |
| VISION (4 фазы, B04) | V2.1–V2.3 | Сохранён | Подпись «Зависимость» больше не слипается |
| CONTACT, финальный CTA, футер | V2.1 / оригинал | Сохранены | — |
| 404 | 0167/0168 | Сохранён | «Return // Landing Node» → `/` (работает на вложенных путях) |

## 2. Декор и анимации

Сохранены все HUD-элементы, рамки, угловые засечки, сканлайны, радары, пульсы, тикер, кастомный курсор, глитчи. Изменения W0.1:

- кастомный курсор скрывается **только пока открыт модальный диалог** (иначе указатель был невидим);
- при `prefers-reduced-motion` SVG SMIL-анимации ставятся на паузу (CSS-анимации и раньше останавливались).

## 3. Исходники и архивы (не тронуты)

| Объект | Где | Статус |
| --- | --- | --- |
| Архивная SVG/HTML-сцена ECHELON | `content-html/echelon-node-v2.html` | Сохранена, не монтируется |
| Архив неиспользуемых ассетов (портреты PNG и др.) | `assets/_unused/` (11,6 МБ) | Сохранён |
| `echelon_city.png`, `echelon_city_mobile.webp` и их CSS-правила | `assets/`, `index.css` | Сохранены (правила без элементов — отмечено в `IMAGE_AUDIT.md`) |
| Visual Library: 17 WebP + 4 HQ + README | `assets/showcase/visual-library/` | Сохранены |
| Lossless оригиналы 8 скриншотов | `assets/showcase/hq/*-full.webp` | Сохранены |
| PNG-оригиналы Visual Library | `C:\Users\CREATOR\Downloads\AXIOM_SHOWCASE_VISUAL_LIBRARY_V1.zip` | Найдены, вне репозитория, не изменялись |
| Мастер карты V10 (3840×2160) | `download/canon-v3-map-4k/05_final/` (AXS) | Найден, не использовался (ограничение README 0394) |
| Документы V2.1–V2.3 | `docs/SHOWCASE_V2_1_WORKLOG.md`, `docs/showcase-v22/`, `docs/showcase-v23/`, `docs/releases/` | Сохранены как исторические |

## 4. Тексты

Ни один текст на странице в W0/W0.1 не переписан. Изменены только невидимые доступные имена (`aria-label`) у ENTER AXIOM и 8 кнопок скриншотов. Все редакционные и канонические правки — предложения в `AUDIT_REPORT.md`/`CANON_REVIEW.md`, внедряются только после решений CREATOR.

## 5. Тесты

`tests/smoke_showcase.py`: правило «на странице обязана быть плашка CONCEPT ART» (V2.2) заменено на действующий контракт V2.3/V0.3.1 «внутренние QA-плашки не попадают в публичный интерфейс» — прежний тест падал на `main` и противоречил `smoke_showcase_v23.py`.
