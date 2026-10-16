
# AXIOM SHOWCASE V2.1 — RECHECK / IMPLEMENTATION

Reference baseline: `80595af2b2e21d18e86713971e6bb071b679dfb3`
Working branch: `feature/showcase-v2-1-preservation`

## Implemented
- Maintains existing hero decor and RED PROTOCOL identity, ticker, manifest, modules, World, ENTITIES, AXIOM entity, factions, 404, loader and original scenery assets.
- Sections added: CREATOR, WORK, SYSTEM, four-stage VISION, COLLABORATION.
- Reuses exact repository SVG logo (`assets/endeavor_logo_no_text_no_frame.svg`).
- Hero and closing ENTER AXIOM buttons are now plain semantic `<a href="https://axiomgates.com">`.
- Original ECHELON HTML scene is archived in place but is no longer mounted by JS; repo PNG / mobile WebP remain the world visual.
- Eight authentic CREATOR screenshot subjects (login, dashboard, Chronicle, AXCHAT, library, Viktor dossier, news, Master Graph) are present in `assets/showcase/`: 800w and 1440w WebP each; total 1.08 MB, lazy loading.
- Accessible native dialog image viewer, keyboard focus restoration and reduced-motion styling.
- Vision 2026 original HTML preserved byte-for-byte as `docs/AXIOM_SYSTEM_VISION_2026.html` (Git blob SHA `7568ef0188485a202d98c8fd7e1b2e72b42c63f8`).

## Verified by source-level checks
- All referenced internal assets exist in repository tree.
- Zero unresolved in-page anchors.
- Native ENTER AXIOM URLs point to official site.
- Heavy scene auto-mount code absent from `assets/js/index.js`.
- All legacy section IDs exist and work gallery contains 8 image triggers.

## Remaining before production
1. CREATOR visual sign-off for hero/title and photo framing.
2. Browser/device checks at 360/390/430/768/1024/1440/1920px, keyboard interaction, scroll smoothness, language content.
3. Loader usability and image/Lighthouse performance measurement; these have not been benchmarked.
4. Confirm public contact channel (present placeholder is GitHub profile).
5. Verify marketing copy and roadmap status labels, then explicit CREATOR permission to merge. **Do not merge automatically.**

## Original screenshot preservation
Exact original PNGs are retained in the user-provided source pack. The deployable Git branch includes optimized WebP renderings, not duplicate heavyweight originals. The original ECHELON artwork remains tracked in `assets/echelon_city.png`.
