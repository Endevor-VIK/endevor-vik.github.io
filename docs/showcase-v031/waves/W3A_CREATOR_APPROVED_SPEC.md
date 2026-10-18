<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.WAVES.W3A_CREATOR_APPROVED_SPEC
  title: "AXIOM SHOWCASE — W3.A CREATOR Approved Visual Direction"
  status: CREATOR_APPROVED_DIRECTION / IMPLEMENTATION_NOT_STARTED
  deployment: NOT_DEPLOYED
  mode: AgentOps / Visual Implementation Contract
  scope: Landing main baseline plus isolated W3.A implementation/review
  lang: ru
  last_updated: 2026-10-19
  editable_by_agents: true
  change_policy: "CREATOR directs taste; CODEX implements on isolated branch; Principal independent reviews before integration"
  links:
    baseline: ./W3_0_VISUAL_BASELINE_AUDIT.md
    wave_spec: ./W3_SPEC.md
    roadmap: ../AAA_MASTER_ROADMAP.md
    handoff: ../AAA_CURRENT_HANDOFF.md
-->
# W3.A — CREATOR APPROVED HERO / FOUNDATION / NAVIGATION CONTRACT

> **CREATOR approval:** 2026-10-19. **DESIGN GO**, not an approval of currently uncommitted CSS prototypes or untested implementation.
>
> **Landing main baseline after W0–W2.R:** `c6dfe2fcfd837ea9cabdfe0c7054414ba202008c` (merge of Landing PR #4). Historical W3.0 audit data correspond to page code `7b25ded0` and audit commit `30b5be78`; revalidate new main HEAD before working.
>
> **Work mode:** `main` is the authoritative, up-to-date publication and agent baseline. Use **short-lived branch/worktree from current main** to implement W3.A, then independent QA/Principal review and separately authorized merge into main. Do not directly modify main or enable unreviewed auto-merge. New main commits may publish via GitHub Pages.

## 1. CREATOR CHOICES — FROZEN

| Decision | CREATOR selection | Exact implementation meaning |
| --- | --- | --- |
| F-01D | **B / POSTER FRAME desktop** | Use cinematic first-screen poster composition with a balanced enclosed RED PROTOCOL frame, bottom command rail and coherent hero/radar placement across 1024/1100/1280/1440/1920; no clipping or empty areas that harm hierarchy. |
| F-01M | **B / POSTER FRAME mobile** | Integrate the **existing** SVG radar as part of heading scene (do not duplicate/download a new radar); preserve legibility, focus, contrast and scroll. LCP must be measured in the same throttled environment as baseline; if B's performance regresses, optimize B or escalate, **not silently substitute A**. |
| F-02 | **A / REMOVE FLOATING SECTION LABEL** | Remove obsolete floating section marker at **all viewport widths**, not only <=900px. Preserve accurate nav `aria-current` via sticky/swipe nav, section kickers and visible/focusable anchors. Do not leave useless screen-reader duplication or run stale JS listeners. No overlapping vertical rail at >=1400. |
| F-03 | **A / TWO-LINE CREATOR BYLINE** | Near desktop quick navigation display `CREATOR / ENDEAVOR · DESIGN / CODE / CANON` compactly in two lines at layout widths with space, preserving its wording and meaningful mobile fit. |
| F-04 | **A / JETBRAINS MONO** | Preserve terminal voice of HERO lede. Do not change to Golos and do not import new font families. Golos continues in editorial areas only. |
| F-05 | **B / LEGIBILITY HIGHER BAR** | Meaningful subtitles/functional labels **>=12px**; main prose **mostly >=14px** (on phone); use sensible line heights, reduced tracking <=.2em when needed for legibility. HUD purely decorative/SVG can remain stylized if not sole source of important information. Numbers are design thresholds, not a directive to change every nonsemantic micro-label. |
| F-06 | **A / BRIDGE QUESTION FULLY VISIBLE** | Section anchor navigation must reveal bridge question **fully**, taking sticky headers and scroll offset into account. No hidden fragment or abrupt content jump. Keyboard focus & native hash behavior remain accessible. |
| F-07 | **PRINCIPAL RESOLUTION: NEW BRANCH FROM MAIN** | This was not chosen by CREATOR. Since CREATOR explicitly requires `main` as unified current version, Lead should create isolated `w3/a-poster-frame` worktree from the then-current `main`. Do **not** reset/rebase `claude/wizardly-goldberg-h6xqon` from old main and do not work from stale audit HEAD. |
 
## 2. ACTUAL APPROVAL VERSUS PROTOTYPE STATUS

- CREATOR reviewed supplied BASE / A / B screenshots at 390×844, 1024×768, 1440×900, 1920×1080 plus JetBrains Mono vs Golos samples. **B chosen for desktop and mobile.**
- In the agent report, A/B were CSS overrides on immutable feature `7b25ded0`, tested for basic geometry in **Chromium on 11 viewports**. They **are not yet product CSS** and were stored in ephemeral scratchpad; do not claim the approved B is already on main.
- Agent report: Chromium 65/65 regression on unmodified baseline, smoke ×2. Firefox / WebKit / axe / Lighthouse / physical phones not run in that takeover environment. W3.0 historical baselines were agent-reported separately (LH mobile 97, LCP around 2.40s).
- Before implementing, copy/reconstruct B source from safely preserved artifacts and attach a stable comparison/evidence manifest. If ephemeral assets are gone, reproduce B from audited HTML/CSS and CREATOR's screenshots. Never hardcode screenshots as the live UI.

## 3. DESIGN AND PRESERVATION CONTRACT

**Must preserve** RED PROTOCOL vivid red and charcoal (no pink/purple/plum), Oswald display + JetBrains Mono HUD + Golos prose, WORK B archive, V10 map, canonical six WORLD IDs, original section order and content, eight screenshot privacy gate, original AXIOM logo/radar, custom cursor, status-link scheme and Canon facts. No wholesale redesign. No commercial brochure or pushy marketing CTAs; the page must demonstrate design/engineering craft and invite lore exploration while retaining mysteries.

Specific boundaries:

- HERO main headline `KNOWLEDGE. CONTROL. ACCESS.` remains recognizable and should not be shrunk mechanically to solve vertical spacing; remove unjustified blank padding/chrome first.
- Desktop B poster frame must read **as one high-end composition** rather than a cramped fixed-height scroll trap. At 960×540, 1024×768, 1100×800, 1280×800, CTA AND `gate.json` notice should be fully available in the opening scene when feasible; on very short landscape, natural scroll takes precedence over unreadable reduction.
- Mobile B radar behind headline: ensure local luminance/contrast is controlled across all glyphs and key hit targets, and no horizontal overflow, weird touch capture or large first paint media cost. Keep resource behavior for Save-Data/low-memory.
- Avoid vertical right/left decorative rail that overlaps AXIOM ∅ HUD or content. Floating section marker removal is all widths, including 1440 and 1920.
- CREATOR byline two lines at >=1200 when layout allows; graceful stacking at 390 without “orphan” action cards.
- Lede remains readable and authoritative in JetBrains Mono; don't automatically raise decorative version strings as if essential product text.
- Bridge questions fully visible at scroll-to-section/keyboard nav; verify with sticky nav heights and 200% zoom.
- Keep approved loader/404 behavior. New loader-390 collision (V4.2.1 / NODE and UPLINK / SKIP) is a tracked defect; schedule narrowly in W3.D or independent bugfix, not an uncontrolled W3.A scope expansion.
- Ticker screen-reader duplicate must have `aria-hidden=true` on clone only, with the meaningful original remaining accessible.
- Existing browser regression R29 tests marker text/class and may falsely pass even when hidden. Rewrite to assert marker is removed/absent as approved; verify remaining nav `aria-current`.
- No unapproved A01 “CONCEPT ART” disclaimer. A01 stays its own cinematic art band.

## 4. SOURCE OWNERSHIP AND IMPLEMENTATION CUT

- `index.html`: `#top`, HERO markup, nav/bridge structures, ticker duplicate accessibility only.
- `assets/css/showcase-v23.css`: W3.A poster frame and responsive section foundation in an isolated scoped layer, not unbounded overrides at EOF.
- `assets/css/showcase.css`: quick links, creator byline and meaningful mobile type when necessary.
- `assets/css/showcase-v22.css` and `assets/js/showcase-v22.js`: retire floating section label and any redundant listeners without breaking navigation/current-section behavior.
- `tests/browser/showcase_regression.cjs`: rewrite R29 and add `R-W3A-*` coverage for selected A/B result, bridge, short-screen CTA, mobile radar scene, layout overflow and aria-current.
- Add `docs/showcase-v031/waves/W3A_REPORT.md`, selected `captures/w3a/` (separate images per viewport), a verification manifest, preserved hashes/canon IDs, and update living handoff.
- Never modify root AXS, Canon, public Pages settings, released version or unrelated assets.

## 5. MINIMUM ACCEPTANCE MATRIX

Use the same base and conditions for BEFORE and AFTER. Required coverage:

| Test | Required evidence |
| --- | --- |
| Responsive HERO | 360×800, 390×844, 430×932, 768×1024, 844×390, 960×540, 1024×768, 1100×800, 1280×800, 1440×900, 1920×1080. Capture full first fold and check top chrome, CTA, status and quick links. |
| B mobile image | text/radar contrast, no horizontal overflow, no blocked hit targets, motion/reduced-motion, Save-Data and deviceMemory<=2 path |
| Floating marker | absent at all widths; 17 sections still correctly navigable; sticky/swipe nav aria-current; no overlays on text/buttons |
| Type | meaningful mobile labels>=12px, prose mostly>=14px, legible tracking; 200% zoom/landscape not truncated |
| Bridge | full question visible after direct hash, sticky nav jump, mouse and keyboard |
| Functional | original 8-image WORK B archive + map FIT/1:1, keyboard/focus, loader, 404, no-JS |
| QA | smoke, browser regression (Chromium and Firefox if accessible), axe (if accessible), reduced motion, console, preservation of Canon six IDs, 17 sections and original lore |
| Performance | Lighthouse mobile x3 & desktop x3 when tools available; same CPU/network/site. Target median mobile performance>=90, no unexplained LCP/CLS regression from W3.0 mobile 97 and LCP 2.40s. If LH unavailable, record NOT RUN, don't invent PASS. |
| Documentation | before/after screenshot provenance, commit SHAs, changed-file limits, unresolved findings and explicit Principal acceptance gate |

On critical failure STOP rather than changing to A without CREATOR. Existing scripts from W3.0 external evidence may not be in repo. Copy supported scripts into **ephemeral isolated QA workspace** with provenance; no silently invented tooling.

## 6. RELEASE AND GIT

The user explicitly authorized bringing **completed W0–W2.R** into Landing `main` (merged as `c6dfe2fc`), and requests `main` as new common up-to-date baseline.

**W3.A is a future code change, not included in this approval document merge.** Use a new isolated short-lived task branch from updated `main`. Submit a reviewable PR; Principal/QA must review its exact tested HEAD; merge into main **only after a subsequent express CREATOR or Principal gate**, recognizing that main commits trigger public GitHub Pages publication. Do not self-approve.

After any approved merge, recheck actual main, Pages build and live site. Do not conflate a Git push with a successful public deployment.

**W3.A status after this document:** `CREATOR-DIRECTION-APPROVED / IMPLEMENTATION PENDING`.
