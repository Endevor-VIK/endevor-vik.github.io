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
  last_updated: 2026-10-16
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
- `content-html/echelon-node-v2.html` — архивная HTML/SVG-сцена ECHELON; не монтируется на страницу. Публичный World использует статичный PNG / mobile WebP.
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


## SHOWCASE V2.1 (draft feature branch)
- Preserves the original RED PROTOCOL hero and all lore sections. Original scene HTML remains archived.
- Adds CREATOR / WORK / SYSTEM / VISION / COLLABORATION sections in `index.html`.
- Supplemental styling: `assets/css/showcase.css`.
- Screenshot viewer: `assets/js/showcase-gallery.js`.
- Eight two-size image previews: `assets/showcase/*-800w.webp` and `*-1440w.webp`.
- Vision source: `docs/AXIOM_SYSTEM_VISION_2026.html`; QA plan: `docs/SHOWCASE_V2_1_WORKLOG.md`.
- World ECHELON uses existing static `assets/echelon_city.png` and mobile WebP; heavyweight scene iframe no longer mounts.
- Both native `ENTER AXIOM` links lead to `https://axiomgates.com`.
- DO NOT merge without CREATOR approval and visual QA.


## V2.2 preservation & UX reconstruction (feature branch only)
- Entry narrative: HERO → WHAT IS AXIOM → CREATOR → WORK → SYSTEM → WORLD intro + original lore → VISION → COLLABORATION.
- Detail-rich proof cards reveal claims and limits. Screenshots are VISUAL ONLY unless externally verified.
- `assets/showcase/visual-library/` holds all 17 recompressed decorative WebP candidates. Full-resolution source PNGs are retained in the creator-supplied archive, not deployed as unneeded page payload.
- `assets/css/showcase-v22.css`, `assets/js/showcase-v22.js` are additive implementation layers.
- Original loader has safe skip/time cap/storage exception handling. The 4 principles retain their visual structure but avoid unverified operational promises.
- Production and main merge remain prohibited until CREATOR review and reproducible browser QA.


## Current published-branch milestone — AXIOM SHOWCASE v0.3.0.0 (2026-10-16)
- Incremental release of the personal CREATOR / ENDEAVOR / AXIOM SYSTEM showcase, integrating V2.1 → V2.2 → V2.3.
- **Still in development**: this is not a final release or confirmation of full responsive/accessibility/performance QA.
- The original artwork, lore sections, and archived ECHELON HTML remain; main WORLD now uses the CREATOR-supplied six-node image.
- 8 real interface screenshots, high-quality/full-size versions, 17-image Visual Library, revised colors and typography, new UX controls.
- Historical release notices for AXIOM WEB CORE UI v0.2.7.0 are preserved as historical records and do **not** represent the landing's current version.
- CREATOR explicitly authorized version bump and main integration on 2026-10-16; original V2.1–V2.3 HOLD instructions are superseded for **this integration only**. Post-merge improvements require their own review.
- Unresolved: real browser viewport QA, image/privacy approval, keyboard and reduced-motion interactions, Lighthouse/INP/LCP/CLS, font loading and accessibility audit.


## V0.3.1 polish (feature branch `feature/showcase-v0-3-1-polish`, AgentOps 0524)
- W0 audit in real browsers (Chromium 149 + Firefox 151), Canon V3 cross-check, image audit, draft visual system: `docs/showcase-v031/`.
- W0.1 fixes of confirmed technical defects only (no redesign): phone/tablet WORK layout (P0), gallery columns, sharp WORK stage after selection, viewer focus return, on-demand map dialog image, visible pointer in dialogs, reduced-motion SVG SMIL, anchor offset, label-in-name, 404 nested-path return, loader console error.
- Browser regression suite: `NODE_PATH=<playwright node_modules> node tests/browser/showcase_regression.cjs --firefox` (52 checks).
- MAIN MERGE and PRODUCTION DEPLOY remain on HOLD until AXIOM Principal Review and CREATOR visual approval.
