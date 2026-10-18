<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.AAA_MASTER_ROADMAP
  title: "AXIOM SHOWCASE — AAA Quality Master Roadmap"
  status: STRATEGY / CREATOR-DIRECTED / WAVE AUTHORIZATION REQUIRED
  deployment: NOT_DEPLOYED
  mode: Roadmap / Quality Strategy
  goal: "AAA-level visual, narrative and engineering credibility without turning the landing into an advertising sheet"
  scope: endeavor-vik.github.io / showcase v0.3.1 and successor iterations
  lang: ru
  last_updated: 2026-10-18
  editable_by_agents: true
  change_policy: "CREATOR controls goals and major design decisions; Principal signs review gates; update with evidence and explicit change log"
  links:
    protocol: ./AAA_AGENT_PROTOCOL.md
    quality: ./AAA_REVIEW_SCORECARD.md
    handoff: ./AAA_CURRENT_HANDOFF.md
-->
# AXIOM SHOWCASE — AAA QUALITY MASTER ROADMAP
> **Strategy rev:** 2026-10-18 · **Status:** direction approved by CREATOR; future wave implementation requires distinct authorization. No automatic merge/deploy.

## 0. Executive intent / North Star

**Make the showcase feel professionally authored, visually distinctive and technically credible without turning it into a commercial sales sheet.** A new visitor should leave with three complementary impressions:
- **Prospective client/partner:** “I could commission this caliber of design or engineering; there are real results and thoughtful execution.”
- **Reader:** “This world has depth, clear entrypoints and intriguing mysteries; I want to explore.”
- **Engineer:** “The system is designed and implemented, not just rendered; its architecture, proof and limitations are represented honestly.”

**Not:** a generic agency landing, product price list, fake metrics, customer testimonials without evidence, indiscriminate animation, sci-fi theme pasted over every card, reimagined mythology, aggressive lead funnels.

**Show, don't shout.** Separate art, actual screenshots, architectural descriptions, live service states and Canon-level claims. Give each honest provenance. Strong pacing and detail sell competence.

## 1. Baseline and non-negotiable preservation

This roadmap starts from task 0524 W0→W2.R in landing Draft PR #4. The operational SHA is not frozen; see `AAA_CURRENT_HANDOFF.md`.

Preserve **RED PROTOCOL**: original cinematic composition, branded red `#ff2034`, near-black/graphite, neutral type; limited semantic cyan/gold; no pink, salmon, purple, plum or accidental magenta mixing. Keep source forms, radar/emblem character, CRT/glitch nuance and world atmosphere — don't flatten graphics to pass automated palette checks.

Preserve **TYPE A** (Oswald display / JetBrains Mono technical / Golos Text prose), **WORK B** (one eight-screen interactive archive; A01 atmospheric band), original narrative section order, six canonical world nodes and approved map V10, AXIOM entity, factions, characters, MANIFESTO and lore. Keep approved custom cursor; do not propose another uniform bright-white focus treatment without CREATOR request.

Preserve **mystery**: verified facts grounded in Canon; DRAFT/WORKING handled carefully; unanswered authorship of Erasure, details of Black Protocol and the Curator are not page spoilers. Intrigue is allowed. Fabricating definite explanations is not.

Preserve **engineering honesty**: internal UI screenshots are demonstrative proof, not a claim that an unavailable live service is running. Design HUD is artistic unless an independently validated data source makes it real. No simulated FPS, fabricated server availability, fictional external reviews or performance guarantees.

Preserve **accessibility and resource discipline**: semantic navigation, correct keyboard/focus, reduced motion, JS-off fallback, mobile content parity, meaningful text; heavy interaction/media loads only when necessary. Site must feel valuable on a weaker phone, not merely responsive in screenshots.

## 2. Experience architecture / three audiences without three separate sites

The page has one editorial narrative. Three audience paths are discoverable by microcopy and navigational shortcuts, **not** by duplicating everything into dedicated funnels or changing approved section order.

| Audience | Entry attraction | Proof / substance | Next natural action |
| --- | --- | --- | --- |
| Client / partner | strong HERO and coherent art direction | WORK archive, SYSTEM, CREATOR judgment/process, credible interfaces | CONTACT (Telegram/GitHub) without pushy sales text |
| Reader | WORLD introduction, entity teaser, lore and MANIFESTO | six-node map, factions, AXIOM, canonical vocabulary, tasteful mystery | enter available public experience or browse related sections |
| Engineer | SYSTEM explanation and proof annotations | architecture of Canon → Master Graph → WEB CORE → AXCHAT, real screen captures, provenance and limitations | inspect engineering details / GitHub or discuss collaboration |

Every block must answer “why here, why now, for whom?” Avoid forcing clients through walls of lore or exposing readers to an unstructured tool inventory. Story tension, engineering proof and design polish should reinforce rather than compete with one another.

### 2.1 Per-section high-level goals

| Zone | Purpose | Approved direction / possible later improvement | Anti-pattern |
| --- | --- | --- | --- |
| HERO | immediate premium first impression, intelligible identity, primary action | controlled headline hierarchy, radar presence, legible CTA, network card/legend never overlaps, proper small-landscape | overlong microtext, duplicate badges and unverifiable uptime |
| ABOUT | explain AXIOM simply without degrading complexity | one strong proposition and 3–4 explanatory beats; reading rhythm | marketing adjectives instead of explanation |
| CREATOR | authorship, intent, professional judgment | accessible author story and intentional proof; respect personal-data choices | boast list, invented work history/testimonials |
| WORK | prove execution | one 8-screen archive; high-sharpness 1:1, case context and clear public/internal state; maintain A01 as separate art | redundant galleries, concept art presented as shipped UI |
| SYSTEM | make architecture tangible for engineers and curious readers | readable diagram, clear Canon/Graph/Web Core/AXCHAT distinctions, screenshot A07 fit | invented real-time status, dense unlabelled spaghetti |
| WORLD and Lore | discovery, not complete encyclopedia | six Canon IDs, V10 map, factions, entities, MANIFESTO with deliberate mystery | reordering without authority, fabricated spoilers or geo links |
| VISION | forward-looking aspiration, emotional lift near later page | B04 planetary visual fit per device, balanced text and art, realistic language | pretending aspirational roadmap is shipped functionality |
| CONTACT | easy respectful connection and confidence | Telegram, GitHub, official AXIOM entry; status gate manual TTL, no false “online” | hard-sell forms, repetitive CTAs, intrusive popups |
| Loader / 404 | memorable entry and safe fallback | fast skip, once/24h, reduced-motion and storage-failure safety; consistent branded 404 | blocking boot animation, 404 dead-end |

## 3. Approach: visual surgery instead of full redesign

The AAA bar is a **curated series of before/after improvements**, not a percentage of changed CSS. Each task requires: measured or illustrated problem → creative alternatives and rationale → reversible scoped patch → desktop/mobile evidence → verification → Principal acceptance → CREATOR visual decision when appropriate.

**Design review questions:** What is the visual center? Does it communicate purpose? Is the typography hierarchical at 390 and 1440? Is there a memorable “hero object”? Is there room to breathe? Does the page have coherent chapter rhythm? Are images pixel-sharp at their *actual* display DPR? Does any motion help orientation? Is contrast sufficient *on the actual layered pixels*?

**No degradation by optimization:** Never remove major lore, original authored imagery, or meaningful animations purely to improve benchmark numbers. Instead use containment, progressive enhancement, compositional adaptation, lazy media, resource budgets and offscreen throttling. Escalate real art-generation needs to CREATOR with brief and size/crop specs.

## 4. Wave roadmap (proposed sequence; not automatic GO)

A wave may be split into independently reviewable slices. Keep no more than one **integration wave** actively modifying the landing at a time; reconnaissance for later slices can run in parallel. Next wave starts after current Principal handoff and bounded CREATOR approval.

### W3 — Art Direction & Visual Hierarchy / high priority

**Goal:** make the existing visual identity read like a deliberate high-end editorial/digital installation across desktop, tablet and phone.

- **W3.0 visual diagnosis:** screenshot atlas at 360/390/430/768/1024/1100/1280/1440/1920, DPR and zoom; typography heatmap, text density, repeated primitives, fold-by-fold pacing, anchor map, saturation/contrast heatmaps. Rank 10 changes by user impact × risk × cost.
- **W3.A HERO/ABOUT/CREATOR:** fix relative scales, whitespace, title/kicker/icon collisions, CTA visibility, secondary text hierarchy, meaningful authority/personal proof; retain radar geometry and composition.
- **W3.B WORK/SYSTEM:** frame actual interface evidence like an exhibition; refine archive controls, case summaries and adjacent A07 diagram to sharpen credibility; do not duplicate the archive.
- **W3.C WORLD/ENTITIES/MANIFESTO:** hierarchy between map/art/captions, lore scannability, tiered reveal of detail, preservation of theatrical moods and mystery.
- **W3.D VISION/CONTACT/TRANSITIONS:** pacing and “ending”, reduction of visual fatigue without deleting story, CTA confidence and final impression.
- **Deliverables:** style decisions sheet, token trace (no blanket refactor), side-by-side cropped/whole-page image sets, per-section justification, regression & preservation report. CREATOR authorizes taste changes.
- **Exit:** no visual collisions at audited widths; characterful typography with legible annotations; 3-audience quick scan passes; no unauthorized palette/font/order change.

### W4 — Motion, Interaction & Atmospheric Fidelity / high priority

**Goal:** interactions should feel responsive, cinematic and controlled, not busy.

- Inventory every animation (CSS, SVG, JS, loader, glitch, HUD, cursor, parallax); categorize ambient / informative / interactive / purely decorative.
- Establish a **motion language**: duration/easing hierarchy; stagger as structure, not decoration; no perpetual “movement carpet”; make hover/press/focus transitions precise.
- Offscreen pause/containment, `prefers-reduced-motion` alternatives, tab visibility safety, initialization/cleanup robustness, focus preservation.
- On low-power/Save-Data devices, conditionally simplify *expensive rendering*, not content; no blocking textures or visual surgery by CPU heuristic that deletes sections.
- Touch swipe, pointer drag, viewer pan, map FIT/1:1, keyboard shortcuts, natural scroll and heading anchors are verified; handle scroll lock and native gestures.
- Compare frame-times/long tasks and interaction feel on actual or representative weak hardware; never report “60 fps everywhere” without evidence.
- **Exit:** no motion-induced layout instability; reduced-motion retains meaning; no input trap; interaction stable between repeated opens/cancels; no significant baseline regression in user-perceived responsiveness.

### W5 — Editorial Experience & Proof Architecture / medium-high priority

**Goal:** each audience finds a credible path within one coherent world, without turning the page into a brochure.

- Reconstruct reader journeys from existing sections; explicit narratives for client, reader and engineer (what they understand at 10s/45s/3min).
- Strengthen WORK cases by **what was built / challenge / implementation / visible outcome / evidence / limitation**. Outcomes must be real, not fabricated numbers or customer quotes.
- Clarify SYSTEM flow Canon ↔ Master Graph ↔ UI ↔ AXCHAT with honest maturity states and limited technical vocabulary explanations. Real diagrams can be adjusted without disclosing secrets.
- On WORLD/lore: a one-line hook + compact canon fact + optional detail/mystery; avoid spoiler explanations and label future proposals as future. No unauthorized narrative additions.
- Refine author voice: precise, understated, ambitious. Make copy accessible in Russian, label intentional English HUD, break dense technical text with hierarchy, not arbitrary truncation.
- Link to CONTACT naturally; no auto-popups, pricing funnels or stacked “hire me” CTAs. Run 3 short comprehension tests with real or simulated reader roles (label simulated as heuristic, never as user studies).
- **Exit:** a reader can explain the project in ~1 minute; a prospect can identify substantive work; an engineer finds verifiable implementation context; no canon/source contradictions or false production claims.

### W6 — Imagery & Mobile-First Composition / high priority

**Goal:** desktop-level authorship on a phone without making the phone render a desktop megastructure.

- Asset inventory: provenance/licensing, intrinsic size, 1:1 DPR sharpness, density and compression; prioritize the remaining original-limited soft images (portrait/B02/B04 etc.). Never claim “upscaled” is genuine detail without source.
- Create **CREATOR image request tickets** (purpose, focal subject, aspect ratio, safe crop, minimum 2× target pixels, mood/palette, negative constraints, filename and placement candidates). Agents **must request** images if source resolution blocks quality; no unauthorized generation/reconstruction of canon art.
- Each key section gets a *mobile-specific composition*, not “just shrink”: altered crop/stacking, purposeful focal point, preserve meaningful content and approved lore art.
- Maintain V10 map viewer and WORK archive 1:1; image FIT, pan and focus on touch/keyboard. Avoid loading oversized maps before intent; maintain low-memory fallback.
- Assess weaker devices on layout, memory, image decoding and motion; choose effective format/srcset/sizes/loading with verified network logs.
- **Exit:** no critical primary asset rendered below 0.95 source/render resolution ratio in tested priority states except explicitly documented CREATOR-approved limitations; no horizontal overflow, no clipped artwork/story; mobile performance in acceptable range.

### W7 — AAA Quality Closure & Pre-release Gate / high priority

**Goal:** independent proof that the page has both high polish and robustness.

- Freeze approved design candidate for visual audit; prepare exact source SHA, asset manifest, screenshot atlas, section scorecard and detailed preservation diff.
- Re-run Chromium+Firefox in viewport matrix; WebKit/Safari where environment permits (otherwise NOT RUN and release decision explicitly acknowledges risk); at least one real Android/iOS session if available; do not falsify.
- Keyboard/screen reader manual journey (NVDA/VoiceOver where accessible); no-JS, reduced-motion, 200% zoom, landscape; functional CONTACT links, 404, loader, dialogs and route/accessibility semantics.
- Measure lab LCP/CLS/INP-proxies/long tasks/net transfer with repeat runs; separate lab from real-field metrics; compare to previous benchmark, not only absolute scores.
- Review content truth/provenance with Canon owner, privacy on full-size screenshots and git history, asset licenses, security, no sensitive internals; verify gate.json's checkedAt/expires before release.
- Principal conducts **two separate reviews**: technical/QA and visual/editorial. CREATOR performs final visual acceptance; no agent self-signoff.
- Release only with distinct CREATOR instructions; deploy changes on approved branch and verify live site after, with rollback procedure.
- **Exit:** scorecard passes critical gates, every P0/P1 resolved, P2 justified/accepted, unknowns declared; no release on QA report alone.

### W8 — Optional continuous refinement (not required to declare V0.3.1 done)

If appropriate after W7: targeted experiments from observed visitor friction, information architecture refinements, new approved Canon teasers, additional real case evidence, selective interactivity, asset upgrades, field performance after deployment. No invented testimonials or tracking without consent. Separate spec/authority for every W8 task.

## 5. Operational scheduling and dependency gates

`Canon recovery index/export` and its review currently precede Canon merges but **do not automatically block read-only design planning**. Do not mutate live Canon, root submodule pointers or active PR #4. If PR #4 is still draft, roadmap implementations must wait for current technical operation handoff and a new bounded implementation directive.

Suggested dependency order:
1. Finish current Canon qualification/recovery and resolve independent PR review gates.
2. Obtain latest Landing PR #4 state and baseline acceptance.
3. W3 visual audit/CREATOR directional approval; then reversible slices W3.A–D.
4. W4 and W6 can *research* in parallel, but avoid simultaneous writes to the same assets/CSS or interaction logic.
5. W5 editorial work can draft proposals while W3 code runs, with no unapproved Canon publication.
6. W7 is a stop-the-line gate, not a marketing milestone.
7. Merge/production only after explicit release authorization, not because the roadmap is finished.

Each wave starts with **read-only baseline and risk scan**; publishes a Wn SPEC before writing product code. Every change must map to a tracked issue and verification.

## 6. Evidence and scope-budget rules

**Baseline is comparative, not aspirational.** W2.R lab report: 130/130 Chromium+Firefox tests; mobile LH 97, desktop 100; remaining image softness and NOT RUN tests documented. Re-check current HEAD and environment before treating any number as current.

**Performance targets, not release promises:**
- Aim mobile LH Performance ≥90 (median of comparable lab runs), desktop ≥95, and no material LCP/CLS deterioration. Strive mobile LCP ≤2.5s, CLS ≤0.10, real-world INP ≤200ms when field data exists; compare like-for-like conditions. No gaming the score by hiding content.
- Text contrast WCAG 2.2 AA (4.5:1 ordinary, 3:1 large) with semantic keyboard focus; smaller decorative labels must not be sole carrier of critical info.
- Target all important imagery at a rendered-source pixel ratio ≥0.95, with truthful exception table for limited originals. Use actual viewport/DPR, not file width alone.
- Avoid heavy media before user intent; ensure no runaway animations, duplicate downloads or infinite rerenders.

Performance, accessibility and visual quality are **joint constraints**. A high Lighthouse score is not AAA acceptance, and a great screenshot does not excuse a broken dialog.

**Evidence bundle per slice:** exact before/after SHA, changed-file list, viewport+device/DPR screenshot pairs, interactive walk-through, source/asset provenance, QA commands and results, performance medians/variance, accessibility status, preservation & canon diff, risks/open issues, rollback, independent Principal verdict. Local sandbox bundles may disappear: keep a concise tracked report and manifest in Git; publish only small selected screenshots.

## 7. Hard stop conditions / escalation

Stop edits (and inform CREATOR/Principal) if: source claims conflict with active Canon; any user data/secret seen in a screenshot; an unapproved aesthetic redesign; current PR head changes unexpectedly; rebase conflict, dirty root/gitlink from someone else; unreproducible index/export; major loss of visual content; security regression; significant LCP/CLS/focus failure; expired status flag being described as current; any proposal to “fix” by hiding content.

When dispute is aesthetic, produce A/B evidence and explicit tradeoffs for CREATOR rather than silently deciding. When issue is factual, provide file and truth-level. When performance claim is unverified, write `NOT RUN`.

## 8. Quality bar and release definition

AAA should be **earned by observable craft**:
1. Distinctive RED PROTOCOL art direction and deliberate section cadence.
2. High readability and fluent responsive editorial layout.
3. Real, sharp proof for clients; credible architecture for engineers.
4. World mystery and proper Canon fact boundaries for readers.
5. Cohesive and performant motion/interaction on desktop and mobile.
6. Inclusive keyboard/touch/reduced-motion/no-JS navigation.
7. Honest technical claims, privacy and provenance.
8. Repeatable QA, regression results, ownership and rollback.

Use the independent `AAA_REVIEW_SCORECARD.md`. A wave may be **TECH PASS / VISUAL HOLD**. **AAA ACCEPTED** requires both gates, CREATOR visual decision, no critical failures and recorded exceptions. After release, monitor/measure only with explicit tools and permissions.

## 9. Acceptance authority / roadmap maintenance

The CREATOR owns product direction, story canon expansion, branding, photography/art approval, and release authority. Principal controls review gates, but cannot self-approve their code or incidental commits. Implementation lead owns execution within approved scope. Update this roadmap via design/decision PR with reason and before/after scope. In each handoff, link approved decision register, report, evidence and the newest SHA; **do not rewrite historic verdicts**.

Roadmap intentionally describes waves beyond the current task: **future waves are plans, not permission**.
