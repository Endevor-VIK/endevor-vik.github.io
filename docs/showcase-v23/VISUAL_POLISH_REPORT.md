# AXIOM SHOWCASE V2.3 — VISUAL POLISH REPORT

**Status:** SOURCE IMPLEMENTATION COMPLETED / BROWSER REVIEW BLOCKED / PRODUCTION HOLD

**Scope:** V2.3 continuation from V2.2 head `9f832ad037850b8b2f59bc81631440b05b58ae7c`. Dedicated branch `feature/showcase-v2-3-visual-polish`, stacked on V2.2, NOT `main`.

## 01. Requested changes
- Replaced old ECHELON-focused WORLD section with CREATOR's exact six-district map image, resized from original 2048×1152 PNG into 960/1440/2048 responsive WebP variants (high quality). Full image accessible in dialog, static original scene HTML untouched and never auto-mounted.
- WORLD six selector cards now update node name, short thematic summary and description. No speculative positional pins assigned to the artwork.
- Original art and content sections remain available unchanged.
- Added type scale with Unbounded, Tektur and Golos Text (fallback to Oswald, JetBrains Mono and system fonts); visually decorative original logo retained.
- New styles use RED PROTOCOL red, black/graphite, cold neutral ink with restricted cyan/gold; selected pink/rose accents removed from later additive CSS.
- Converted system component trail into four keyboard-focusable controls with context descriptions.
- WORK stage is a real-image selector with improved source sizes, descriptions and full-resolution gallery overlay.
- VISION uses staggered stage panels; disabled unnecessary motion under reduced-motion preferences.
- Replaced all public-facing "CONCEPT ART / NOT EVIDENCE" audit banners with project labels. Explicit product access statuses remain on the screen; internal evidence matrix remains in docs.

## 02. Image quality policy
- Eight original product screenshots preserved at 1919×1079 as lossless WebP "full" assets (combined ~6.9 MiB). Smaller 960px thumb variants for compact layout and lazy loading.
- WORLD map 960w ~318 KiB, 1440w ~772 KiB, 2048w ~1685 KiB, all from the original supplied PNG.
- Five selected Visual Library images have higher-quality derivatives without recompression of the former heavily compressed WebP.
- Image weight is a tradeoff. Image/network waterfall and actual LCP/CLS/INP must be profiled in a browser; claim neither higher real-frame fidelity nor speed without validation.

## 03. Typography and color
- Original RED PROTOCOL typography still dominates existing artistic sections.
- Unbounded is used for major headings, Tektur for selected UI typography, Golos Text for longform.
- Current load uses Google Fonts with `display=swap`. Native font fallback remains available. Self-hosting is a future optional task after licence and subset/performance review.
- Initial V2.3 CSS reuses existing decorative crimson, but removes pastel rose and pink from newly modified design layers; **do not change original artistic file indiscriminately**.

## 04. Tests and remaining blockers
- Structured source scan found no missing local file paths, broken anchors, missing screenshots, missing concept art, or JS parse errors. Static test in `tests/smoke_showcase_v23.py` must still run on actual checkout and CI.
- Browser preview still NOT VERIFIED: no connected staging or browser execution. A commit-pinned raw.githack URL might work, but this is not a verified preview.
- Unrun: viewport 360/390/430/768/1024/1440/1920, Firefox/Chrome/Edge, keyboard Escape/focus, touch, loader failure, LCP/INP/CLS, font timing.
- CREATOR screenshot privacy signoff and map composition signoff required before any public merge.

**Git policy:** MAIN MERGE FORBIDDEN; PRODUCTION DEPLOY HOLD.
