<!-- apps/endevor-vik.github.io/README.md -->
<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.PUBLIC_LANDING.README
  title: "endevor-vik.github.io — Public Landing"
  status: ACTIVE
  deployment: ACTIVE
  mode: Public Site
  goal: "Публичный GitHub Pages лендинг профиля ENDEVOR / AXIOM"
  scope: apps/endevor-vik.github.io
  lang: ru
  last_updated: 2026-06-02
  editable_by_agents: true
  change_policy: "Обновлять при изменении структуры/контента лендинга"
  links:
    index: ./index.html
    loader: ./loader.html
    not_found: ./404.html
    assets: ./assets/
    loader_integration: ./docs/LOADER_INTEGRATION.md
-->

# endevor-vik.github.io

Публичный профильный лендинг ENDEVOR / AXIOM для GitHub Pages (`user site`).

## Структура
- `index.html` — основная публичная страница (разметка).
- `assets/css/index.css` — стили лендинга (вынесены из inline).
- `assets/js/index.js` — поведение лендинга (курсор, reveal, ленивый монтаж сцены).
- `loader.html` — boot-loader (CRT/terminal/progress/glitch), подключён как overlay-первый кадр.
- `404.html` — брендированная fallback-страница / holding-хаб (GitHub/Telegram).
- `content-html/echelon-node-v2.html` — анимированная SVG-сцена ECHELON (ленивый iframe в секции World).
- `assets/` — графика; портреты в WebP. `assets/_unused/` — архив неиспользуемых ассетов (не удалять без запроса CREATOR).
- `docs/LOADER_INTEGRATION.md` — протокол и варианты подключения loader.

## Адаптив и доступность
- Мобильная версия (`≤640`) показывает **весь** контент (без вырезания) — адаптация раскладки, не `display:none`.
- Поддержан `prefers-reduced-motion` (гасит зацикленную анимацию, сохраняя финальные состояния).

## Контент
- Обзор AXS-экосистемы (`apps/runtime/canon/ops`).
- Сигналы canon/v3 (machine-first, GMS v3, Master Node Pattern).
- Блок CREATOR как source-authority в контуре проекта.

## Публикация
Для публикации на GitHub Pages обновляйте файлы в этом репозитории и пушьте в `main` ветку `Endevor-VIK/endevor-vik.github.io`.
