# W3.C — CREATOR FINAL ART DIRECTION / VARIANT A + OMEGA-0 SCENE

**Decision by CREATOR (2026-10-19):** “мне A нравится; так же можно интегрировать про OMEGA-0. Там как раз есть изображение сопутствующее этому ... не просто интегрировать её, а через режиссуру. а так мне все нравится.”

**Status:** A **CREATOR VISUAL DIRECTION ACCEPTED**, W03 **OMEGA-0 TIE-IN AUTHORIZED**, **IMPLEMENTATION CAN BEGIN IN ISOLATED BRANCH**, full visual/code QA and explicit publication gate still required. No change to `main` or production by this directive.

## 1. Frozen selection

- **A / ПОРОГ** (not B): W01 `682462bb-2c81-49d2-b873-f88cfe6e4ef9` **SYSTEM→WORLD entry**; current A's atmospheric statement; five navigable thematic chapters with W06 (cropped safely), W02, W04, W08; **W07 epilogue** before VISION.
- **Do not add B's three windows** to A unless CREATOR later asks; the hybrid has not been approved.
- CREATOR's “а так мне всё нравится” accepts A's concept composition and chapter questions as the implementation basis. Keep mood text concise and canonical; do not append new undisclosed lore.
- **OMEGA-0** is approved as a coherent mini-scene within A, using library **W03** and attached `W3C_OMEGA0_CANON_CONTEXT_PACK.md`.
- W03 moves from `RESERVE / NEEDS_CREATOR_BINDING` to `APPROVED_FOR_ARTISTIC_OMEGA0_ASSOCIATION` in the implementation's manifest (not literal architecture approval).
- No new locations, incident mechanics, world geography, or extra Canon data changes.

## 2. Régie / staged WORLD sequence

**Act I · THRESHOLD** — visitor leaves technical SYSTEM and enters WORLD through W01 (approved A). On mobile preserve W01 wide atmospheric image and accessible text below.

**Act II · WORLD FEELING** — short atmospheric claim after BLACK SUN; thematic chapters (five original links/IDs). Existing MANIFESTO, MODULES, WORLD MAP, people and factions remain intact and in canonical order.

**Act III · OMEGA-0 / THE DESCENT** — add a **single contained narrative vignette** with W03 after geography is introduced, preferably after/within the `#world` world-spine / map chapter before `#chars`. The reader first recognizes Gluhaya and the system of six nodes; then one node becomes a *place you can almost descend into*. Do **not** break the existing `#world` anchor, node selection, maps, tab/keyboard behavior or 17-section order.

Micro-direction:
1. **Approach / surface:** sparse typography `GLUHAYA STATION → OMEGA-0`, restrained environment fade, no new fabricated route coordinates.
2. **Descent / reveal:** masked W03 unveils red shaft/internal depth while the outside station recedes; on desktop use editorial split-stage with visual on one side, not full-bleed blurry source.
3. **Silence / consequence:** one short Canon-supported line about secrecy/research (see context pack), optional one mystery-driven line, not a data sheet.
4. **Return to exploration:** existing 02.05 world node/card/map is the genuine detailed entry; allow `ИЗУЧИТЬ 02.05 ↓` only if it has a real existing and accessible target/selection. No invented service endpoint.

**Act IV · PEOPLE AND POWERS** — smoothly resume `#chars`, AXIOM and factions, retaining existing deep HUD cards.

**Act V · EPILOGUE** — W07 and final A closing motif transition to real-world VISION.

**Audience objective:** first-timer feels secrecy, scale and depth; enthusiast has a path to learn more; engineer still sees authentic canonical structures, not implied realtime systems.

## 3. Composition and asset constraints

- Preserve existing W01 as centerpiece of the entry. W03 must not compete with it for the same first-fold hero role.
- W03 original 1672×941; max ~830 CSS width at DPR2 for 1:1. At 1440×900 and 1920×1080, build **large, crisp, editorial inset** with depth, dark negative space and compelling focal crop. Do not stretch W03 to 1440/1920 @2 or overcompress it; no fake 4K upscaling.
- At 390/430: the scene becomes portrait-like through responsive composition without cropping away the lower shaft; essential text below/over a verified dark zone, no white-on-bright failures. Optimize via existing 960/1280/1672 AVIF+WebP `srcset/sizes`, `loading=lazy`, no eager request on initial landing open.
- No forced long scroll, no scroll hijacking or cinematic gate requiring click. Use modest masked reveal on scroll only as progressive enhancement. If JS off/reduced-motion, W03 + copy must remain legible and immediately available.
- Source W03 contains **painted-in surface structures and lettering**: do not claim the surface architecture is a literal plan for Gluhaya; use image as artistic illustration of depth. Avoid giant “CONCEPT ART” disclaimer.
- Use RED PROTOCOL only; no plum/pink/purple from older Canon pages; no new decorative emblem which might be read as official faction symbol.

## 4. Suggested implementation slices (record SHA and evidence separately)

1. **S1:** Integrate selected A threshold, W01, revised intro/mode change and safe reading entry.
2. **S2:** Existing A statement and five question-led chapter markers; preserve all original text/anchors.
3. **S3:** W03 OMEGA-0 vignette, canonical microcopy, responsive treatment, real 02.05 deep link and optional minimal reveal; independent source check via compact Canon pack.
4. **S4:** W07 exit/outro WORLD→VISION with respectful return to real product trajectory.
5. **S5:** Preservation, no-JS, axe, Chromium+Firefox when available, responsive 360/390/430/768/1024/1440/1920, WCAG AA contrast over art, sharpness DPR1/2, Lighthouse comparables and selected capture atlas.
6. **S6:** Final source/truth check, privacy/asset provenance, Principal code/visual review; CREATOR decides final merge to main and Page deployment.

If the implementation architecture makes S1–S4 different, explain re-slicing in SPEC without silently adding B hybrid or new story.

## 5. Scope, gates and handoff

- Work from **latest Landing main** in isolated `w3/c-world-immersion` implementation worktree/branch; existing research branch currently holds assets + concepts but not site code. Preserve its provenance and avoid overwriting another agent's dirty worktree.
- Review W3C_WORLD_CONCEPTS.md, world-library manifest, W3C_OMEGA0_CANON_CONTEXT_PACK.md; do not re-traverse Canon unless a claim is genuinely missing from pack.
- Prepare a separate W3C IMPLEMENTATION SPEC, SHA-labelled before/after captures and preservation/QA report. Previous post-load injected prototypes **do not** substitute for LCP/CLS/Lighthouse or no-JS tests.
- Check W01 @2 sharpness; if full-bleed scene still limited by 1672 source, surface an explicit asset-quality exception or CREATOR master request. Avoid claiming 1:1 across all desktop DPRs.
- No main merge, no live deployment, no Canon write, no root gitlink, no automatic version bump or unapproved new plot.
- Ready state: `0524.W3.C.A+OMEGA0 — READY FOR PRINCIPAL & CREATOR VISUAL RECHECK`.

**Principal message to CODEX:** it is not enough to insert a picture of OMEGA-0. The visitor must feel *approach, descent, depth, silence, return*. Keep the world mysterious and deeply designed, with underlying dossiers as secondary discovery.
