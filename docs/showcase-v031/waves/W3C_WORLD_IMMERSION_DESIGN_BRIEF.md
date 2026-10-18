<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.W3C_WORLD_IMMERSION_DESIGN_BRIEF
  title: "AXIOM SHOWCASE — WORLD Immersion / CREATOR Direction and Design Brief"
  status: CREATOR_INTENT_CONFIRMED / CONCEPT_OPTIONS_UNAPPROVED
  deployment: NOT_DEPLOYED
  mode: Creative Direction / Read-Only Discovery
  scope: Landing / WORLD entry, narrative experience, exit into VISION
  lang: ru
  last_updated: 2026-10-19
  editable_by_agents: true
  change_policy: "CREATOR approves narrative tone and art direction; no Canon story expansion or runtime edits in this document PR"
  links:
    roadmap: ../AAA_MASTER_ROADMAP.md
    protocol: ../AAA_AGENT_PROTOCOL.md
    current_handoff: ../AAA_CURRENT_HANDOFF.md
    visual_audit: ./W3_0_VISUAL_BASELINE_AUDIT.md
-->
# W3.C — WORLD IMMERSION EXPERIENCE / CREATOR BRIEF

> **Status:** CREATOR problem statement approved, solution options **not yet approved**. This brief documents the next artistic goal and authorizes **read-only research and A/B concepts only** until explicit creative approval. No automatic W3.C implementation or main merge.
>
> **Baseline:** Landing main `9dda09557e6fdbbd8665413b909b68d1d3c429d9` (merged W3.A PR #7, CREATOR visual acceptance). Reverify main and GitHub Pages on each task startup.
>
> **CREATOR words, distilled:** WORLD is visually sophisticated but has a high first-visitor entry barrier, the SYSTEM→WORLD transition is too flat, it's unclear that an artistic fictional world is beginning, the visitor receives terminal dossiers rather than an immersive experience; exiting WORLD into VISION is similarly abrupt. **"Если на сайте мы рассказываем про систему, то в блоке WORLD мы должны пользователя погрузить в мир, а не устроить ему досье с терминалами."**

## 1. North star / criterion

**The showcase must have two distinct but related modes:**
- **SYSTEM / WORK:** credible real engineering, interfaces, process and product.
- **WORLD:** an experience of the fictional universe, emotion, place, stakes, mystery and narrative curiosity.

A new visitor should grasp within ~20–30 seconds: **this is the created fictional world**; **something significant happened after BLACK SUN**; **there are people, places and conflicts worth exploring** — without needing to parse ECHELON/OMEGA-0/NEXARCH/VOIDLINK or the Canon data model first.

The site should *show the world before explaining its catalog*. Dossier/terminal components remain available as a second layer for deep inspection. This is not a request to replace high-quality WORLD UI, delete authored lore, reveal spoilers or add invented Canon plot facts.

### Anti-goals
- No generic sci-fi wallpaper or copied film intro.
- No huge loading screen, forced full-screen splash, compulsory cinematic or autoplay sound/video.
- No doubling every WORLD section, large explanatory glossary before emotional hook or intrusive onboarding modal.
- No promise that fictional status telemetry is a live network signal.
- No new mythology presented as Canon; no answer to who ordered Erasure or Black Protocol's unresolved relationship.
- No new app-like route or game mechanics without approval; retain one-page section order and existing links.

## 2. Why current WORLD fails the first-visit test (source-verified)

Current `index.html` user-facing sequence:

1. End of `#system`: `.show-lore-link` says **"Сохраняем первоначальную художественную часть сайта"** then offers five content-category links. This is meta-commentary about the website, not a story-world invitation.
2. A narrow `.v22-bridge` reads **"ТЕХНОЛОГИИ ОБСЛУЖИВАЮТ АВТОРСКИЙ МИР"**. Correct product relationship, but negligible cinematic transition.
3. `#world-guide` begins with **"МИР ПОСЛЕ ЧЁРНОГО СОЛНЦА."**, B02 orbit art, explanations of AXIOM as sci-fi universe, then **CANON / MASTER GRAPH** glossary and warning that original prose begins. This is a useful explanation, but quickly pulls the reader back into internal tool vocabulary.
4. Follow-on content order: `#manifesto` terminal doctrine → `#modules` catalog of fictional systems → `#world` high-quality 6-node V10 map/details → people (`#chars`), AXIOM, factions (`#factions`). The page uses powerful dossier HUD yet lacks a *continuous reader-eye emotional thread*.
5. After `#factions`, `.v22-bridge` asks **"ЧТО ПОЛУЧИТ ПОСЕТИТЕЛЬ В БУДУЩЕМ?"**; `#vision` immediately becomes a product roadmap. No epilogue or thematic return to the engineering work that created the world.

The design problem is predominantly **narrative dramaturgy / content hierarchy / transitions** (not poor color or insufficient cards). A beautiful classification interface alone cannot make a first-time visitor feel a world.

## 3. Proposed experience architecture — FIVE BEATS

**This is a *direction*, not approved final copy/design.**

### 3.1 Threshold: SYSTEM → WORLD (mark the mode change)

Replace/demote meta copy about preserving the original site with a **clear but atmospheric handoff**. The visitor must perceive that an engineering demonstration has ended and the artistic universe has begun.

Proposed on-screen affordance (example, not canon text):
- accessible semantic eyebrow: `AXIOM / ХУДОЖЕСТВЕННАЯ ВСЕЛЕННАЯ`;
- large scene title: `МИР ПОСЛЕ ЧЁРНОГО СОЛНЦА`;
- supporting promise: `Теперь — не о том, как устроен проект. О мире, ради которого он создаётся.`
- organic CTA `ВОЙТИ В МИР ↓` that scrolls to actual next scene. It must not gate ordinary scrolling, direct hashes or screen reader content.

The SYSTEM–WORLD threshold should feel like one authored cinematic transition, not a second marketing HERO. Scale, whitespace and atmosphere can change; brand RED PROTOCOL and type system remain.

### 3.2 Establishing shot: world before glossary

Create a **visually cohesive world scene** with B02/V10 or approved new artwork, and 1–3 short poetic, Canon-constrained lines expressing loss, order and survival. Show *place/consequence/human stake* before revealing faction IDs. Dramaturgy, not false world exposition.

Illustrative tone-only copy **not Canon-approved**:
> «После BLACK SUN мир не закончился. Он изменился. А вместе с ним изменилось то, какой ценой сохраняют порядок.»

Do not state unverified date, who caused BLACK SUN, who personally ordered an operation, or precise undisclosed locations. Any new diegetic prose must be reviewed against current Canon source and accepted by CREATOR.

### 3.3 Human lens: a path into the stakes

A short bridge between abstract introduction and dossiers should give the visitor **a reason to care**:
- a human question (e.g. memory vs enforced order);
- a visible place from the six established nodes;
- an existing character or ideological tension with sourced names/roles.

This can be an editorial triptych of **"Место → Человек → Цена выбора"**, or another CREATOR-approved construct, without inventing plot chronology. The purpose is connection, not a new interactive novel.

At first glance: a newcomer understands the struggle. On optional exploration: a fan can open the underlying Canon card or dossier.

### 3.4 Discover: preserve existing depth

Keep the successful highly-authored modules, map FIT/1:1, entity and faction cards. Improve *framing and progression*:
- give each segment a one-line story-facing introduction before IDs/taxonomy;
- provide meaningful orientation and short optional labels for newcomers;
- preserve high-density terminal HUD for readers who deliberately inspect details;
- reduce upfront unexplained term overload without deleting content;
- keep all six Canon IDs, V10 original geography, original section order, manifesto, factions and AXIOM identity.
- do not turn 17 existing sections into separate fullscreen mandatory chapters.

Optionally introduce a **very light reading trail** across existing sections: `Что произошло? → Где это случилось? → Кому это важно? → Кто определяет порядок?`, with actual anchors. Such a trail is a navigation aid, not invented plot.

### 3.5 Epilogue: WORLD → VISION (close an emotional chapter)

At the end of factions create a deliberate *outro/return bridge*. It acknowledges that this is just a first glimpse of the world, then transitions from fictional stakes to how the project may develop.

Tone-only examples **subject to approval**:
- `«Ты увидел только поверхность.»`
- `«За пределами этих архивов история продолжается.»`

Then transparently reintroduce the real product: VISION is a **roadmap of planned real developments**, not another fictional event. The exit should be as authored and visually satisfying as entry: ambient graphic, typographic breath, motif from the opening scene, one simple `КАК МИР БУДЕТ РАЗВИВАТЬСЯ ↓` action. No spoilers, fictional claims of real functionality or pushy sales language.

## 4. Design directions for CREATOR comparison (NOT approved)

Provide **two genuinely different authored approaches**, plus existing BASE, with real desktop/mobile evidence:

**A — CINEMATIC THRESHOLD (recommended initial study).**
- Strong panoramic world image, very short language, almost silent reveal, clearer mode shift.
- Existing terminal UI remains deeper in the document; no disruptive re-order.
- Lightweight responsive CSS, constrained red/graphite, no new video/audio.
- Best for first-time immersion and continuity with W3.A poster.

**B — LIVING FRAGMENTS.**
- Instead of one big gateway, several short editorial micro-scenes reveal place/person/conflict before the map and cards.
- Greater narrative richness and pacing risk; costs more layout and source-art work.
- Must not require mandatory animation, delayed scroll or fragile parallax.

**C — BASE (current)** to diagnose rather than implement.

CREATOR chooses A/B or a directed hybrid after evidence. Do not treat the reviewer preference as authorization. Consider a compact A+B hybrid only as clearly labeled proposal.

## 5. Asset & visual preservation

Existing assets usable as **candidates**, if source resolution/cropping supports them: `B02_dark_planet_cloudscape` for threshold, V10 world map as exploratory layer, established world and faction artwork for secondary sections. Do not crop V10 into false geography or use art as a fake product screenshot.

If a truly new immersive background is necessary, agent provides a short **CREATOR image-generation brief** (scene, fidelity, palette, subject, crop at 390/768/1440/1920, minimum source dimensions, intended section). No unapproved AI regeneration, no pink/purple, no muddy WebP enlargement.

Keep one artistic visual centerpiece per scene, not a busy collage of dossiers. On mobile compose a separate scene rather than shrinking desktop. Lighter experiences/reduced-motion retain imagery and meaningful text.

## 6. Technical contracts and anchor continuity

The site's existing HTML anchors remain valid: `#world-guide` (nav entry), `#manifesto`, `#modules`, `#world` (actual six-node map), `#chars`, `#factions`, `#vision`. The section order remains fixed until separate CREATOR decision; never rename `#world` to `#world-guide` or break external links. All jump locations must show headings/bridges fully (W3.A F-06).

Use native scroll and accessible semantic structures. Any reveal must be progressive enhancement, with no-JS content immediately readable and no forced animations. Avoid hijacking wheel/touch or vertical snap scrolling; avoid 1,000px empty entrance on phones.

Mobile performance budget should not regress beyond the established W3.A medians (reported: mobile LH 98, LCP ~1.66s under given lab). These are environment-specific, not real CWV. Non-visible artwork is lazily loaded. Measure actual image decode, LCP/CLS and source/DPR fidelity after implementation.

Anchor transitions should communicate **where user is**: TECHNICAL PROJECT → FICTIONAL WORLD → FUTURE PRODUCT ROADMAP. For screen readers, the switch cannot rely only on lighting/color/glitch.

## 7. Discovery deliverables (AUTHORIZED for read-only concepts, NOT implementation)

1. **Story onboarding audit:** first-visitor walkthrough without assuming names, reading at 10s/30s/90s. Exact points of confusion by visible text/screenshot.
2. **Narrative source matrix:** proposed copy → Canon file/section/truth-level; mark mood-only proposals. Respect unresolved Black Protocol/Erasure and the Curator.
3. **A/B concept previews:** separate desktop 1440/1920 and mobile 390/430 screenshots for threshold, first 2 scrolls, transition at factions→vision, preserving old BASE alongside.
4. **Mobile viability:** on 390, readable atmosphere scene and understandable route without a second oversized long scroll; no cut-off image/CTA.
5. **Asset tickets:** image refs/provenance and separate new art prompts for CREATOR if truly needed.
6. **Evidence:** canonical before SHA, proposed ephemeral CSS/scenes, current QA status and NOT RUN list, preservation trace.
7. **Proposal to Principal/CREATOR:** two visual solutions, tradeoffs, recommended composition and precise implementation slices.
8. **Explicit authorization gate:** no publishing new storyline or W3.C CSS/HTML into main from this brief alone.

## 8. Acceptance criteria / what success feels like

A newcomer who has never heard of AXIOM should, without learning acronyms:
- recognize in the first screen of `#world-guide` that the page switched from **real systems to a fictional universe**;
- feel a place and stakes **before** the dense terminal taxonomy;
- understand that the world has a history and people, not just six classifications;
- be able to reach locations, characters and factions naturally, also by keyboard;
- leave through a meaningful narrative close, rather than a sudden unrelated product roadmap;
- retain curiosity and **not** learn spoiler-level answers;
- experience an intentional original design on both desktop and mobile.

**Failure:** adding a giant decorative banner but leaving the same cold archival flow; writing a novel-length introduction; deleting strong WORLD UI; inventing Canon; LCP regression; navigating only via animated transitions.

## 9. Handoff rules and priority

Current CREATOR statement supersedes generic roadmap ordering when deciding *what to study*. W3.C immersive WORLD is a HIGH-PRIORITY **creative research track**. W3.B WORK/SYSTEM quality work may continue independently, but avoid parallel writes to shared bridge/scroll CSS.

W3.A CREATOR visually accepted, PR #7 merged into Landing main `9dda09557e6fdbbd8665413b909b68d1d3c429d9`; GitHub Pages build was **in progress at first check**. Do not assert production verified until final build/live evidence.

**Do not merge this brief with actual runtime code.** Scope is strategy and design evidence only; Principal/CREATOR must approve visual choice and later exact production SHA before merge.
