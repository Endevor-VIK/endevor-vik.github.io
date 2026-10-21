# AXIOM SHOWCASE v0.3.1 — PUBLIC ITERATION

**Release date:** 2026-10-22  
**Release scope:** GitHub Pages personal landing `Endevor-VIK/endevor-vik.github.io`  
**State:** PUBLIC ITERATION / WORK IN PROGRESS — NOT FINAL  
**Authorized by:** CREATOR, 2026-10-22 — merge, deploy and version bump; version number v0.3.1 chosen by CREATOR.

## Included
W4.R (task 0524) on top of W3.C (already public since `6b082e5`): five sections rebuilt to the CREATOR-approved art direction A+AD (`9cf78b0`) —
BLACK SUN / WHAT REMAINS, WORK / FOUR SURFACES, WORLD GRID, CHARACTERS intro, the études and traces rails, the A08 protocol-gate image.
Protected content (map, OMEGA-0, W04, character cards, AXIOM ∅, viewer, eight real screenshots) is unchanged.

Runtime that passed independent review: `685140a40e55f151f9edcf9e7ab0170773ad4f55`. This release equals it outside `docs/`, plus the version label.

## Verification
- Independent R4 (separate agent): **PASS WITH RECORDED LIMITS**, no P0/P1.
- Performance against the previous product `b85fbb0a`, budgets declared before results: 17/17 PASS (twice); mobile LCP median 2 491 ms against a 2 500 ms budget — a narrow margin, lab data only.
- Browser regression Chromium + Firefox: only the two known HERO baseline debts fail (`W4-DEBT-HERO-01/02`), as before W4.R.

## Recorded limits
- Keyboard step quirks: WebKit first ArrowRight (rare, headless WPE), Firefox traces rail at 375–430 px. All cards stay reachable.
- The W4.R stylesheet loads without blocking first paint via an inline `onload`; revisit if a CSP is introduced.
- Not verified: physical devices, real Safari, screen readers, field Web Vitals.

## Evidence
Not published on Pages. Index: [`docs/showcase-v031/release/w4r/EVIDENCE_INDEX.md`](../showcase-v031/release/w4r/EVIDENCE_INDEX.md) — archive tag `evidence/0524-w4r-pr12` + SHA256 manifest.

## Deployment
`main` serves GitHub Pages (legacy build) and publishes automatically on merge. Rollback anchor: previous `main` `6b082e5f262c09a123748273da42277d3a29a6c2`.

Do not label the landing COMPLETE, FINAL or STABLE.
