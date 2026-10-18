<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.AAA_AGENT_PROTOCOL
  title: "AXIOM SHOWCASE — Agent Operations & Continuity Protocol"
  status: STRATEGY / BRANCH-ONLY / CREATOR REVIEW
  deployment: NOT_DEPLOYED
  mode: AgentOps / Handoff Contract
  goal: "Continuation after /compact, agent handover, reviewer change and parallel scope coordination"
  scope: endeavor-vik.github.io / successor AAA waves
  lang: ru
  last_updated: 2026-10-18
  editable_by_agents: true
  change_policy: "Append wave-specific overrides to handoff; never silently waive authority, ownership or quality gates"
  links:
    roadmap: ./AAA_MASTER_ROADMAP.md
    review: ./AAA_REVIEW_SCORECARD.md
    handoff: ./AAA_CURRENT_HANDOFF.md
-->
# AXIOM SHOWCASE — AGENT ORCHESTRATION & CONTINUITY PROTOCOL

## 0. Mission, hierarchy and hard boundaries

Mission: turn the existing RED PROTOCOL showcase into a high-polish digital work while preserving original lore and credible real system proof. CREATOR's desired result is **AAA execution**, not maximum animation, maximum code or a brochure.

Authority hierarchy:
1. **CREATOR:** aesthetic direction, Canon/story authority, privacy-sensitive publishing choices, major tradeoffs, explicit final release decision.
2. **AXIOM Principal Reviewer:** architecture/design/QA review and bounded agent directives; no self-approval of their own Git changes.
3. **Implementation Lead (CODEX or designated lead):** plan, decomposition, integration, measured QA and evidence; no auto-merge/deploy.
4. **Specialist agents:** scoped implementation or read-only research under Lead.
5. **QA / adversarial verifier:** tries to break and falsify assumptions, independent of implementing authors where feasible.

When rules conflict, stop and request CREATOR or Principal decision; never use the roadmap as authorization for unattended branch writes.

## 1. Work topology / preferred team

**Default:** 1 Lead + 1–2 focused implementers + 1 QA reviewer, subject to workspace performance. More agents increase overhead and conflicts; parallelize *read-only analysis* first, code only on isolated paths.

| Role | Primary responsibilities | Exclusions |
| --- | --- | --- |
| Lead / Integrator | create wave SPEC, task DAG, exact HEAD baseline, assign file ownership, integrate scoped branches, cross-regressions, evidence, status updates | do not replace CREATOR design approval; do not self-review own code |
| Visual Lead | per-section composition, type hierarchy, visual tokens, responsive geometry, before/after design options | no uncontrolled typography/palette reset; no automatic deletion of original art |
| Interaction / Motion | hover/press/scroll, viewers, focus, motion physics, cancellation and reduced motion | no unrelated Canon or copy rewrites; no GPU-heavy effect without low-power path |
| Media / Performance | source audit, DPR/resolution, responsive formats, lazy-loading, perf and image requests | no unapproved reconstruction of canon artwork; no fake sharpness |
| Editorial / Canon | concise page narrative, proof claims, Canon source matrix, ambiguity/spoiler preservation | no promotion of DRAFT into CANON, no invented live states |
| QA / Accessibility | Chromium/Firefox/WebKit where possible, smoke/axe/manual focus, no-JS, perf and preservation | cannot mark NOT RUN as PASS or certify own unverified measurements |
| Principal | independent design and engineering verdict, release risk assessment and blockers | cannot quietly merge after own review; own changes require independent recheck |

**One writer per overlapping asset/file group at a time.** If two tasks edit `index.html` or shared stylesheet, serialize writes or isolate commits and integrate in a controlled order. No shared dirty worktree across writers; report all preexisting changes without cleaning or reverting.

**Streams:** A Design/Editorial (proposals, comparison comps), B Frontend Implementation (controlled writes), C QA/Perf (mostly read-only), D Canon Research (read-only unless separately authorized). Canon and Pages deploy are different repositories/authority gates; never combine their merges as a convenience.

## 2. Explicit wave work contract / before touching product code

At each new wave create `docs/showcase-v031/waves/W{N}_SPEC.md` (or an approved successor path) with:
- issue and status; exact start SHA and target branch;
- UX problem and *observable before* condition;
- audience impact, proposed change, and comparable alternatives;
- in/out-of-scope boundaries; full preservation list;
- list of owned files and another agent's reserved paths;
- dependencies, design decisions, Canon source/truth-level, privacy considerations;
- expected change budget, reversible plan, visual DoD, technical DoD;
- test viewport/device/motion/no-JS matrix, perf budgets;
- rollback procedure, stop conditions, expected report paths;
- review authority, explicit CREATOR approval if aesthetic/story change.

No wave or slice may start as “polish everything” without a bounded visual target and comparison. If a change exceeds the spec, write `SCOPE_CHANGE_REQUEST` and wait for appropriate authority.

## 3. Execution loop (repeat for each slice)

**OBSERVE → HYPOTHESIZE → DESIGN → IMPLEMENT → VERIFY → REVIEW → DECIDE → COMMIT/HANDOFF.**

1. Baseline: inspect actual branch/working tree, last report, screenshots/metrics at same configuration, open risks. Identify original source before changing.
2. Design: state problem and exact intended outcome; sketch A/B and seek CREATOR when creative identity shifts. For small uncontroversial geometry defects, implement in the approved style.
3. Implement: small atomic commits; avoid opportunistic changes; unit ownership, stable progressive enhancements, no secret/image leakage.
4. Verify: automated tests and manual visual QA, keyboard/touch, responsive, a11y, image and performance; document reproducibility and what could not be verified.
5. Preserve: mark every modified/removed original design/lore element and why; keep a restoration route.
6. Review: QA examiner + Principal; green CI cannot overrule CREATOR visual veto.
7. Integrate only into an authorized working branch when asked; merging into `main` or deployment require fresh specific CREATOR permission.
8. Close slice with a reproducible report and update living handoff.

**Return states:** `PLANNED`, `DISCOVERY`, `READY_FOR_IMPLEMENTATION`, `IMPLEMENTING`, `READY_FOR_QA`, `READY_FOR_PRINCIPAL_REVIEW`, `CONDITIONAL_PASS`, `TECH_PASS_VISUAL_HOLD`, `BLOCKED`, `ACCEPTED`, `RELEASE_HOLD`, `CLOSED`. Use precise statuses, with separately listed NOT RUN tests.

## 4. Dependency / ownership contracts

Lead maintains task board with fields `ID / audience / section / owner / writable paths / dependency / risk / expected evidence / state / SHA`.

- **Visual+Editorial** can design in parallel with **Canon Research**, but code production waits for agreed composition and facts.
- **UI geometry** and **motion** on the same component are serialized; do not animate unstable layouts under active structural changes.
- **Image pipeline** can produce a brief/asset QA while frontend integration is paused; derived images remain reviewable and provenance-linked.
- **QA** may test an immutable commit in parallel with development, but reports must name *which commit*, not silently refer to moving HEAD.
- **Canon source change** requires a separate scoped branch/PR; landing changes cannot imply approval of unmerged Canon claims.
- **Shared AXS root** is **not** the landing repo. Root gitlink and uncommitted root changes are outside landing task scope; never touch opportunistically.

Conflicts: Lead freezes affected path, requests actual diffs from both agents, keeps two proposed outcomes, chooses through Principal/CREATOR approval and publishes a conflict resolution note. Do not manually interleave arbitrary CSS at the end of a file without evaluating cascade/responsive regressions.

## 5. Compaction protocol (`/compact`, `/comact`, summary loss)

The token-summary mechanism **does not preserve authoritative Git state**. We provide a durable rehydration path that works for new agents and reviewers without relying on memory.

### A. Before compaction / session exit — MANDATORY

Lead writes or updates `AAA_CURRENT_HANDOFF.md` **on the active task branch** (do not quietly update an unrelated active PR), with:
- project target, approved north star, preserved design rules, current phase/slice/state;
- CURRENT EXACT REPO/BRANCH/HEAD, base PR and upstream state, whether dirty, origin and worktree paths;
- other repo/submodule HEADs where dependencies matter, independent holds;
- last verified tests with command, environment and exact SHA; NOT RUN matrix;
- last CREATOR decisions and unresolved questions, canon truth sources;
- files modified/added, pending commits, untracked artifacts, temporary servers, resource constraints;
- next actionable safe command and abort conditions; work items ranked 1–3;
- Principal verdict including whether *only documentation* or actual code is authorized.

Include the following **copy-ready resume packet** in the handoff and conversation:

```text
AXIOM SHOWCASE / RESUME PACKET
AUTHORITY: CREATOR / scoped Principal directive [link/date]
PHASE / TASK: [...]
REPOS + BRANCHES + LAST VERIFIED HEADS: [...]
CLEAN/DIRTY + UNCOMMITTED OWN/FOREIGN WORK: [...]
LAST ACCEPTED BASELINE: [...]
DONE / PENDING / BLOCKED / NOT RUN: [...]
CREATOR FROZEN CHOICES: RED PROTOCOL; TYPE A; WORK B; six Canon IDs; no spoiler; original section order; custom cursor
CURRENT EVIDENCE + COMMANDS: [...]
EXPLICIT FORBIDDENS: no main merge, no production deploy, no root gitlink, no self-approval (unless superseded by CREATOR)
NEXT 1-3 SAFE ACTIONS: [...]
STOP CONDITIONS / CONTACT: [...]
FIRST ACTION: reread AGENTS.md + roadmap/protocol/handoff; verify current git/PR/CI before editing.
```

Summaries may omit detail; links and exact refs may not. Never replace an accurate `NOT RUN` with aspirational “PASS” in a resume packet.

### B. After compaction — REHYDRATE, NOT ASSUME

1. Explicitly read `AGENTS.md` and all three operational docs plus current wave's SPEC/report and decision sources. If missing, fetch from linked strategy PR branch; do not fabricate files.
2. Run local Git checks and inspect actual remote PR HEADs and CI; compare to handoff snapshots. Never continue from stale SHA.
3. Confirm the objective and scope still authorized. If new CREATOR instruction supersedes it, record the supersession.
4. Reconstruct pending task list from committed reports and current worktree diff; do not overwrite unsaved work. Verify ownership.
5. Restate a **3–7 line continuation brief**: current task, verified refs, what changed since snapshot, blockers, next action, which tests will run.
6. Resume only the next approved **bounded task**. If handoff and repository disagree, pause and escalate rather than choose by guess.

### C. Reviewer replacement / principal rotation

Outgoing Principal leaves a signed review capsule in the task handoff:
- reviewed commit, code paths, visual sample scope, independently run tools versus agent-reported tests;
- verdict separated into visual, technical, editorial/canon, privacy and release;
- open P0/P1/P2, uncertainties, unanswered CREATOR decisions, branch/PR authorities;
- any Principal-authored code/commit that **cannot** be self-approved.

Incoming Principal **does not inherit an approval merely by role change**. It repeats risk-driven spotchecks, verifies moving HEAD and recorded evidence, marks prior test reports as *reported* if not independently rerun. It issues explicit scope-limited verdict; reject “all green” when no visual evidence is examined.

## 6. Communication rhythms and stop-the-line

Lead posts meaningful checkpoint after each bounded slice or when blocked: `STATE / SHA / WHAT CHANGED / TESTS / NOT RUN / RISKS / NEXT`. No empty status spam. For time-sensitive blockers (resource exhaustion, disk warning, interrupted WSL), stop background servers, preserve exact worktree state, report recovery command and identify owned vs foreign files.

When work stops mid-step: do not fabricate a successful run or commit, do not promise unattended recovery; leave a durable partial state and the next command.

If reviewer asks for a directive: deliver a complete copyable document **in the chat** or make an authorized Git commit with PR/SHA; never offer an unverified sandbox file as primary handoff.

## 7. QA and principal handoff artifacts

For each wave:
- `W{N}_SPEC.md`, `W{N}_IMPLEMENTATION_REPORT.md`, `W{N}_PRINCIPAL_HANDOFF.md`;
- current `AAA_CURRENT_HANDOFF.md` and append-only decision/change entries;
- source SHA/PR, baseline SHA, preservation diff and rollback;
- selected comparison images in Git; full evidence bundles with SHA manifest (not depending solely on ephemeral local `sandbox/`);
- smoke/browser/a11y/perf/image and real-device tests by exact SHA, environment, command and result; missing = NOT RUN;
- list of factual/canon claims and provenance; sensitive image review;
- final recommendation `TECH PASS / VISUAL HOLD / APPROVED / BLOCKED` given by Principal, final aesthetic/release sign-off by CREATOR.

The `AAA_REVIEW_SCORECARD.md` determines **AAA readiness**. QA is necessary but not sufficient; meaningful differentiation from baseline is required. P0/P1 always block. P2 needs explicit owner and justified disposition.

## 8. Example wave pipeline

`Lead audit` → `visual agent proposes A/B, image agent assesses source, editorial agent checks Canon` → `CREATOR direction where needed` → `single controlled implementation path` → `adversarial QA` → `Principal code/visual review` → `CREATOR visual accept` → `new scoped wave`.

Do not open six parallel modifying agents to “accelerate” work. Correct ordering and evidence have higher value than raw commit velocity.

## 9. Governance and privacy

All captured admin screens: inspect **full-res original, every derivative, metadata and public Git history**, confirm exposure of internal IDs and access roles, do not leak credentials or personal data. Descriptions of API providers/architecture must derive from sources and distinguish demonstration from live availability. Art is art. Do not violate canon truth statuses or turn speculation into an assertion.

The live status `assets/status/gate.json` is manual, TTL-bound and owned by CREATOR; validate before any release. Never ping an external site client-side as a substitute for verified availability.

**Bottom line:** durable state and independent judgment survive agent resets; anonymous chat memory does not.
