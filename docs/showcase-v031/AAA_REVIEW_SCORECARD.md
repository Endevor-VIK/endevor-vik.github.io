<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.AAA_REVIEW_SCORECARD
  title: "AXIOM SHOWCASE — AAA Visual and Engineering Review Scorecard"
  status: PROPOSED / CREATOR-DIRECTED / VERSIONED CRITERIA
  deployment: NOT_DEPLOYED
  mode: Review Rubric / Quality Gates
  goal: "Make design verdicts reproducible and separate visual acceptance from green tests"
  scope: endeavor-vik.github.io / future W3–W7
  lang: ru
  last_updated: 2026-10-18
  editable_by_agents: true
  change_policy: "Criteria may evolve by CREATOR decision; record waiver owner and evidence; no score alone authorizes release"
  links:
    roadmap: ./AAA_MASTER_ROADMAP.md
    protocol: ./AAA_AGENT_PROTOCOL.md
-->
# AXIOM SHOWCASE — AAA PRINCIPAL REVIEW SCORECARD

## 0. Purpose and verdict vocabulary

This sheet translates “AAA” into independent observable tests while accepting that artistic quality ultimately requires CREATOR judgment. Numeric scores are for transparent discussion, **not an algorithm that substitutes for taste**.

Principal issues separate verdicts:
- `TECH PASS` — code correctness, performance and accessibility within agreed limits;
- `VISUAL PASS` — selected design scope clearly improves craftsmanship and preserves identity;
- `EDITORIAL/CANON PASS` — source fidelity, appropriate mystery, credible claims;
- `PRIVACY PASS` — real image/source audit and no exposed secrets;
- `RELEASE READY` — all categories accepted, risks written, CREATOR explicitly approves;
- `CONDITIONAL PASS` or `VISUAL HOLD` — some positive findings, unresolved decisions/defects;
- `BLOCKED` — P0/P1, unauthorized changes, unverifiable critical evidence, dependency or safety issue.

**AAA ACCEPTED** cannot be declared solely from a Lighthouse score, a passing CI, or an assistant's first impression.

## 1. Visual dimensions (each 0–4; per section and overall)

| Criterion | 0 — fail | 2 — competent but imperfect | 4 — exceptional |
| --- | --- | --- | --- |
| V1 Identity & originality | generic template / lost RED PROTOCOL | recognizable theme, uneven polish | unmistakable authorship with coherent restraint |
| V2 Composition & hierarchy | clutter, collisions, no focal point | reasonable focus, too many secondary labels | precise focal rhythm, breathing room and guided eye |
| V3 Typography & content density | illegible or random font styles | readable but crowded/flat | strong Oswald/Golos/Mono hierarchy, expressive purposeful rhythm |
| V4 Imagery & sharpness | blur, fake proof, bad crop | mostly appropriate with exceptions | source-appropriate crispness and intentional PC/mobile framing |
| V5 Motion & tactility | jank, distraction, traps | mostly smooth, some noise | deliberate, informative and cinematic with reduced-motion equivalent |
| V6 Responsive art direction | squeezed desktop / missing content | adaptive grid but weak mobile composition | mobile feels authored, not compromised |
| V7 Story & emotional pacing | brochure or confusing encyclopedia | some intriguing scenes, redundant text | world invites exploration with mystery and clear wayfinding |
| V8 Proof & professional confidence | empty claims, UI theater | basic real examples, unclear limitations | high-trust real screenshots, architecture and precise provenance |
| V9 Accessibility & inclusivity | blocked keyboard/touch or unreadable | mostly usable with localized issues | robust semantics, focus, contrast, no-JS and weaker-device experience |
| V10 Cohesion & completeness | disconnected section styles | largely consistent, unfinished transitions | consistent throughout HERO→CONTACT and 404/loader |

Scoring guide: `0` unacceptable, `1` needs redesign in place, `2` functional/baseline, `3` confidently professional, `4` standout. Every <3 score names the specific image/viewport and proposed repair. No rewarding superficial complexity.

**Indicative bar:** average ≥3.3/4 with no core dimension below 3, separately verified mobile/desktop; this is a discussion threshold, not automatic authorization. Mandatory comparisons in source screenshots at same width/DPR and first-fold/canvas/full-page segment crops.

## 2. Mandatory binary technical gates (any critical FAIL blocks)

| Gate | Evidence expected | Notes |
| --- | --- | --- |
| T01 source integrity | clean ownership, exact SHA, expected changed paths, preservation | no unauthorized root/canon/main/prod modifications |
| T02 functional navigation | tested desktop/mobile menu, active section, CONTACT, nested 404, loader | no broken URLs or misleading gate states |
| T03 archive and map | eight-screen WORK B, FIT/1:1, full pixel extents, tab/swap/drag/swipe, focus return | never regress Chromium left-edge bug |
| T04 access and semantics | axe plus keyboard focus, no-JS fallback, screen-reader pass if possible | automation cannot replace manual SR; NOT RUN otherwise |
| T05 responsive geometry | 360/390/430/768/1024/1100/1280/1440/1920, phone landscape, 200% zoom | actual zoom where possible, else explicitly emulated |
| T06 performance | LH median & variance, transfer size, LCP/CLS/long tasks; INP field if available | compare identical environment; don't hide features for scores |
| T07 mobile resource behavior | Save-Data, weak memory, reduced motion, offscreen effects and on-demand images | **do not** remove meaningful content |
| T08 content/canon integrity | source file/version/truth-level, exact before-after text, no false live/canon claim | unknown plot details stay unknown |
| T09 privacy/rights | full-size + derivative screenshot audit, media provenance/license | file removed from HEAD may persist in Git history |
| T10 release safety | creator authority, gate.json TTL, no inadvertent Pages deploy, rollback | main merge and prod are separate approvals |

Report `PASS / FAIL / NOT RUN / INCOMPLETE` **per gate**, with evidence for PASS. NOT RUN is an explicit risk, not a waiver. If WebKit/Safari, real devices, screen reader or field CWV are missing, describe the exact remaining risk and whether release decision may tolerate it.

## 3. Per-audience confidence audit

**Client / partner:** show two real case screens and a coherent technical description; ask “What service could you plausibly trust the CREATOR to build?” If the answer is marketing adjectives only, FAIL.

**Reader:** show WORLD and a character/mystery. Ask “What is intriguing and how can I explore?” If critical claims are unsupported or spoilers forced, FAIL.

**Engineer:** trace Canon → Master Graph → WEB CORE → AXCHAT; ask “Which parts are implemented, which are artistic representation, and what is the access boundary?” If cannot distinguish, FAIL.

Usability reviews by agents are heuristics, **not** real-user research. If actual user feedback is collected, record origin and consent; don't invent statistics.

## 4. Principal review procedure

1. Verify source SHA and exact changed files, permission and whether reviewer wrote any of them.
2. Review **before/after** 1440 and 390 first; inspect intermediate widths and one hard scenario (200% zoom or landscape). Original comparison source must match the baseline commit.
3. Open WORK, map and dialogs; inspect alt/focus/interaction and intentionally fail high-risk modes; sample reduced motion.
4. Audit source/claims/rights and meaningful mobile image crops, not just test counts.
5. Read QA reports and distinguish agent-reported from independent tests; reproduce at least one high-risk scenario if tools are available.
6. Record score V1–V10 and pass/fail T01–T10 with source/evidence pointer; list P0/P1/P2 and tradeoffs.
7. Issue `ACCEPTED`, `CONDITIONAL PASS`, `TECH PASS / VISUAL HOLD` or `BLOCKED`. A reviewer who authored the patch must route it to a different reviewer for code approval.
8. CREATOR resolves taste/story/canon and decides if any release is authorized.

## 5. Visual failure examples / recurring regressions

- Dense microcopy around HERO CTA, legend headings covering title, status-card collisions.
- Duplicate case studies or modal viewer cutting off left edge.
- Full page snapshots with blank lower segments due to tall Chromium canvas — use segmented captures.
- 1440w previews fed into 1:1 or source pixels < DPR needed; original-limited asset falsely labeled fixed.
- Purple/plum blending in red halos; preserving shape matters as much as palette.
- Responsive rule overridden by later CSS layer; tablet text cropping; 200% zoom overflow.
- “Online/sync” decorative HUD read as actual server health; DRAFT Canon presented as final.
- Motion causing layout shifts or infinite main-thread cost.
- Status notice beyond `gate.json` checkedAt/expires or wrong external URL.
- Pretty static desktop frame with unreadable, cramped phone section.

## 6. Minimum final handoff table (copy)

| Item | Status | Evidence URI/path | Reviewed SHA | Reviewer | Open risk |
| --- | --- | --- | --- | --- | --- |
| Visual V1–V10 | PASS / HOLD | capture atlas + rationale | … | … | … |
| Functional & A11y T01–T05 | PASS / FAIL / NOT RUN | regression / axe / manual | … | … | … |
| Performance T06–T07 | PASS / FAIL / NOT RUN | Lighthouse + perf | … | … | … |
| Canon/privacy T08–T09 | PASS / FAIL / NOT RUN | sources / audit | … | … | … |
| Release T10 | HOLD / READY | explicit CREATOR instruction | … | … | … |

The scorecard can recommend **AAA-ready**; only CREATOR can approve actual final aesthetic and production publication.
