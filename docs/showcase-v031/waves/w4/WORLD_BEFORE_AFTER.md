<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4.WORLD_BEFORE_AFTER
  title: "0524.W4 — before/after evidence contract"
  status: BASELINE_IDENTIFIED / W4_AFTER_NOT_CREATED
  deployment: NOT_DEPLOYED
  mode: Evidence plan and semantic comparison
  goal: "Не подменять будущие визуальные доказательства сценарием или старыми скриншотами"
  scope: G0/G1 baseline / future G3–G4 comparisons
  lang: ru
  last_updated: 2026-10-19
  editable_by_agents: true
  change_policy: "Каждая capture pair получает source SHA, viewport, DPR и environment"
-->

# WORLD — before/after

**Сейчас это структурное сравнение и договор будущей съёмки. W4 AFTER screenshots отсутствуют.** Ветка содержит документы; runtime на ней равен `6b082e5`. Предоставленные CREATOR screenshots — визуальная обратная связь без machine-verifiable capture manifest, не W4 QA evidence.

## 1. Что изменится после Gate A

| BEFORE `6b082e5` | PROPOSED AFTER, ещё не внедрено | Проверяемый результат |
| --- | --- | --- |
| RU entry title | `WORLD AFTER / BLACK SUN.` | Прежние W01/art/CTA + правильные переносы |
| Доктрина до экспозиции | 4 такта внутри `#manifesto` | Сначала роль AXIOM в старом мире, затем установленный разлом, затем архивная доктрина/вопрос |
| Five repeated fragments | Подчинённое пояснение остаточных форм | Нет троекратного объяснения «спасение через ампутацию» |
| Product Four Surfaces в WORLD | WHAT REMAINS на прежнем `#modules` | Fiction flow объясняет последствия, без product cards/counters |
| Отдельные концептуальные карточки | 3 context disclosures WORK 02/03/05 | 8 реальных captures остаются основным архивом, схемы подписаны, вторая gallery отсутствует |
| Два factions headings о порядке | Один heading и ясный конфликт | W08/карточная структура и statuses сохранены |
| Map/OMEGA/characters | Тот же source content и behavior | Protected diff пуст, новые CSS не меняют rendering непреднамеренно |

Точные тексты — [WORLD_SCENE_SCRIPT](WORLD_SCENE_SCRIPT.md); protected label exceptions — [typography audit](WORLD_TYPOGRAPHY_AUDIT.md).

## 2. Доступное историческое evidence

- `6b082e5` — принятый W3.C baseline, runtime `index.html/assets/tests` равен `b53350e` (проверено `git diff --name-only b53350e 6b082e5 -- index.html assets tests`: пусто).
- [W3.C report](../W3C_IMPLEMENTATION_REPORT.md) и [evidence README](../../evidence/w3c-impl/README.md) привязывают съёмку к QA SHA `b53350e`.
- Existing `captures/w3c-impl/after-{1440,1920,390}-f2-threshold-W01.jpg`, `after-1440-f4-chapter-I.jpg`, `after-{1440,1920,390}-omega0-descent-W03.jpg`, `after-{1440,390}-omega0-return-02.05.jpg`, `after-{1440,390}-f5-epilogue-W07.jpg` — **исторический AFTER W3.C**, то есть полезный reference для W4 BEFORE. Они не переименованы в заново снятые W4 captures.
- Полного актуального набора BEFORE по всем 7 viewport × 3 engines ещё нет. Получить его до первой G2 runtime mutation на изолированном snapshot `6b082e5`.

## 3. Capture contract для G3/G4

Для каждого требуемого viewport: **1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 390×844, 360×800**, Chromium/Firefox/WebKit. Основная сравнимая серия DPR1; Retina samples DPR2 desktop/tablet и DPR3 mobile отмечаются отдельно, без сравнения разных DPR как одинаковых условий.

Пары: W01 после menu jump; W02 целиком сегментами; W03 WHAT REMAINS; WORK panels 02/03/05 с закрытым и открытым контекстом; factions; protected map/OMEGA до/после node return; chars/AXIOM ∅; W07→VISION. У protected областей одинаковые selection/scroll/animation state. Для visual diffs фиксировать reduced motion либо ждать одинакового stable state; motion behavior проверять отдельным прогоном.

Каждая запись manifest: `baseline_sha`, `after_sha`, `runtime_tree`, engine/version, viewport CSS px, DPR, OS/tool versions, motion/JS/cache/network profile, selected panel/node, target/scroll method, relative path, SHA256. Не использовать full-page canvas, если браузер оставляет нижние сегменты пустыми; снимать bounded sections/segments.

Сохранить baseline `#modules` с четырьмя visuals, HUD и исходные fragments как воспроизводимый before: immutable Git source плюс выбранные captures. Публичные artwork originals не удаляются. Схемы и их source SVG остаются восстановимыми.

## 4. Storage и retention

Новая stage G0/G1 не создаёт браузерных профилей, traces, videos, assets-копий или тяжёлых bundles. До G3 повторить Windows host disk guard.

Для будущих transient запусков — отдельный именованный scratch вне project tree; при записи удерживать последние **3 runs и не старше 14 дней** (пересечение ограничений), prune только принадлежащих W4 запусков. Не копировать readonly art assets в каждый arm. Размер log ≤10 MiB/run, screenshots selected/compressed; profiles/traces/videos удалять после разбора собственного запуска. Retained review evidence — маленькая зафиксированная подборка с manifest в `docs/showcase-v031/`, полный ephemeral bundle не является единственным доказательством.

**G4 comparison verdict: NOT RUN.** Последовательность и тексты готовы для согласования, измеренной визуальной дельты W4 пока нет.
