<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.AAA_CURRENT_HANDOFF
  title: "AXIOM SHOWCASE — Current Review/Agent Handoff"
  status: STRATEGY_BOOTSTRAP / SNAPSHOT / UPDATE_REQUIRED_ON_WAVE
  deployment: NOT_DEPLOYED
  mode: AgentOps / Living State
  goal: "Restore exact scope, review boundaries, dependencies and next steps across compact, agent switch and principal rotation"
  scope: endeavor-vik.github.io / current 0524 and future AAA waves
  lang: ru
  last_updated: 2026-10-18
  editable_by_agents: true
  change_policy: "Snapshot fields are never asserted current without Git recheck; update only in authorized task branch after every review"
  links:
    roadmap: ./AAA_MASTER_ROADMAP.md
    protocol: ./AAA_AGENT_PROTOCOL.md
    scorecard: ./AAA_REVIEW_SCORECARD.md
    task_handoff: ./REVIEW_HANDOFF.md
-->
# AXIOM SHOWCASE — CURRENT HANDOFF / REHYDRATION HUB

## CURRENT OVERRIDE — 2026-10-19 / MAIN IS CANONICAL LANDING BASE

This is the newest explicit CREATOR decision, superseding earlier `main HOLD` for **already approved** W0–W2.R. **Confirm actual GitHub HEAD at session start.**

- On 2026-10-19, CREATOR requested consolidation of the latest completed Landing build into `main` and establishing `main` as common baseline. Landing PR #4 `feature/showcase-v0-3-1-polish` @ `7b25ded0` was merged by Principal as `c6dfe2fcfd837ea9cabdfe0c7054414ba202008c`.
- GitHub Pages `pages build and deployment` automatically starts on main changes; at the time of first review it was **in progress**. A merged Git SHA is not proof the live site has deployed; check its final result and verify URL.
- W3.0 audit branch `docs/0524-w3-0-visual-baseline-audit` @ `30b5be78` contains only two MD and 17 WEBP files on top of feature; historic agent audit base was the same site code. This document is added as reviewed CREATOR decisions to be integrated separately into main.
- **CREATOR W3.A approved choices:** desktop B POSTER FRAME; mobile B with existing SVG radar integrated behind headline; remove floating label on every viewport; 2-line CREATOR byline; HERO lede JetBrains Mono; meaningful labels>=12px, main prose mostly>=14px; bridge questions fully visible. See `waves/W3A_CREATOR_APPROVED_SPEC.md`.
- F-07 was unanswered by CREATOR; Principal resolves engineering topology by **new `w3/a-poster-frame` branch from fresh `main`**, rather than resetting an old Claude branch rooted in pre-W2 main. This does not waive technical QA or code review.
- **W3.A not yet implemented**: shown BASE/A/B images are agent CSS-override prototypes, not product code. Agents must implement approved B, verify same before/after environments, and submit reviewable PR to main. Do not claim preview B is already on live site.
- Remaining unrelated blockers: gate.json manual status should be revalidated before any public release; loader 390 overlay, duplicate ticker screen-reader content, long offscreen animations W4; Firefox/WebKit/real GPU/field CWV not automatically certified by a historical report.
- Page/Canon/root scopes remain distinct. No Canon storyline expansion, root gitlink, unrelated service changes or automatic branch merges; future main integration requires exact SHA/QA review and appropriate CREATOR authority.

**Next 3 safe actions:** (1) verify Pages deployment after `c6dfe2fc` and any audit docs merge; (2) preserve W3.A B override and screenshots to durable branch/repo with provenance; (3) start isolated `w3/a-poster-frame` implementation from refreshed main, not old `claude/wizardly-goldberg-h6xqon`; return for Principal visual + engineering review.



> **Snapshot date:** 2026-10-18 ≈22:00 +03:00, after 0524.CLOSURE-R1 §I–§III (CODEX). This is **not live Git or CI state**. A new agent/reviewer must refresh refs and check current repo status before doing any work.

## CURRENT STATE — 2026-10-18 / AFTER 0524.CLOSURE-R1 §I–§III (CODEX, implementation lead)

**This block supersedes the PREVIOUS OVERRIDE and older operational snapshots below.** Refresh every SHA at takeover; quoting this file is not verification.

**Refs observed 2026-10-18 ≈21:58 +03:00 (GitHub API + local fetch):**
- **Landing feature** `feature/showcase-v0-3-1-polish` = `b63404beff5047444ecf0e5d9c67f4a252f44f5c` (merge of PR #5) + the handoff commit(s) after it. Draft PR #4 (feature → `main`) stays **Draft / NOT RELEASED**.
- **Landing main** `2dbb6165d04f9357be3141570f3b9bd76231bb3a` — unchanged; no Pages/production deploy was triggered.
- **Canon main** `3884ea43e125ddd39b18c80f91cc40310dd65e9f` — chain `0b1c4bab` → `391418c9` (PR #4) → `4aab5985` (PR #2) → `c43e08c1` (PR #5 regen) → `6206aa80` (PR #3) → `d8cd90da` (PR #6 regen) → `3884ea43` (PR #7). No open Canon PRs.
- **AXS root** `main` `a1fe92bfae13a1374f7e79ca816f4b1188848fba`; gitlink `canon/v3` = `0b1c4bab` — **not updated (HOLD)**. Root trace branch `agent/0524-showcase-v031-trace` (no PR) holds the 0524 journal.

**Completed operations (0524.CLOSURE-R1):**
1. **§I deviation record** written in the AXS 0524 integration journal (root trace `f82a70e0`) — see the incident table below.
2. **§II Canon PR #7** (0111 AgentOps record): CODEX QA on main `d8cd90da` (GMS 1610/286, 0 new; relations MATCH; index/export PASS; generated foreign delta 0; diff-check PASS; SPEC/log/ledger vs actual SHAs) → gate-record **GR-01** (root trace `f82a70e0`, before the merge) → merged 2026-10-18T18:51:02Z as `3884ea43` (parents `d8cd90da` + `a57f1179`; tree = qualified model `d6232c81`). Post-merge QA **PASS** (agent-run): GMS 1610/286 (512 files), 0 new; relations MATCH; index 1011/512/12262, regeneration changes only `generated_at`; export 5 docs identical.
3. **§III Landing PR #5:** CODEX independent (non-author) review of `daa7ddff..8c2d2fbb` + cumulative `6f9d5651..8c2d2fbb` — **PASS** (docs only; 31 relative links, 0 broken; 19/19 cited SHAs exist; no conflict with CREATOR decisions; incident preserved; no main/deploy permission) → gate-record **GR-02** (root trace `d53bd2cd`) → merged **into the feature branch only** 2026-10-18T18:55:55Z as `b63404be`. Post-merge: only the 6 doc files differ from `6f9d5651`; smoke PASS (2 scripts); browser regression **130/0** (Chromium 149 + Firefox 151, agent-run).
4. Evidence (local AXS sandbox): `sandbox/evidence/2026-10-18_0524_closure/` (`GATE_RECORDS.md`, `pr7/`, `postmerge-pr7/`, `pr5/`).

**Review-gate incident — append-only record (0524.INTEGRATION; history not rewritten; the missed gate is NOT declared satisfied retroactively):**

| Field | Record |
| --- | --- |
| Missed gate | 0524.INTEGRATION §6.4: only after an **independent** PASS may PR #2 be merged; Principal handoff `0eef10f3` (21:09 +03:00): no further merges until post-merge tests **and** independent review are recorded |
| Cause | Earlier Principal "CONTENT ACCEPTED" for Canon PR #2 (W2.R review) was wrongly treated as a new permission; the fresh handoff commit was not re-read before merging; the pasted R1 directive was truncated and the remainder was not clarified |
| Moment / SHA | PR #2 merged 2026-10-18T18:16:13Z → `4aab5985307d6414f9eae73d8c308b9832d8384f` (parents `391418c9` + `af6517e6`); then without new review records: `c43e08c1`, `6206aa80` (PR #3 had a CODEX independent review), `d8cd90da` |
| Later independent check | Principal 0524.CLOSURE-R1: **POST-FACTUM SOURCE PASS** on `d8cd90da` (15 files); GMS/index/export accepted as agent-verified; no revert required |
| Content defects | None found |
| Prevention | Merge gate-record rule (below); re-read all related PR heads and handoff commits before every merge; a truncated directive authorizes only what it explicitly states |

**Merge gate-record rule (Principal, 0524.CLOSURE-R1, binding for every future merge):** before each merge a separate record for the **exact HEAD**: AUTHOR / REVIEWER, REVIEWED SHA, QA SHA, verdict, allowed target, explicit authority. If the record is missing or does not match the current HEAD — **merge forbidden**.

**Holds (unchanged):** root `canon/v3` gitlink — not updated; Canon main after PR #7 — separate Principal check; Landing `main` — HOLD; production/Pages deploy — HOLD; SHOWCASE version — no bump; BLACK PROTOCOL / Erasure storyline — no expansion; foreign UI/ROOT changes — untouched; Pages build error — separate investigation, never "fixed" by a random deploy (observation: `pages/builds/latest` = `errored` for `2dbb6165` while the `pages-build-deployment` Actions run for the same commit concluded `success`). **No automatic further merges.**

**Next stage — W3.0 only:** read-only AAA Visual Baseline Audit per 0524.CLOSURE-R1 §IV (sections HERO/ABOUT/CREATOR · WORK/SYSTEM · WORLD/MANIFESTO/ENTITIES/FACTIONS · AXIOM ∅/VISION/CONTACT · Loader/404; desktop/tablet/mobile, reduced motion, weak devices; V1–V10 / T01–T10, top-10, W3.A–W3.D SPEC, agent allocation, risks, Preservation Plan). **No design changes before CREATOR / Principal review of W3.0.** Preserve RED PROTOCOL, TYPE A, WORK B, V10 and the section order.

## PREVIOUS OVERRIDE — 2026-10-18 / AFTER CANON INTEGRATION (Principal, `8c2d2fbb`; historical, superseded by CURRENT STATE)

**This section supersedes older operational snapshots below.** All SHAs must still be refreshed at takeover. This document's 0524 historical baseline is retained as evidence, not as the current state.

- **Canon main:** `d8cd90da3a234940dfd430cca944d6662282b461`. GitHub independently confirms merged Canon PR #4 (`391418c9`), PR #2 (`4aab5985`), generated PR #5 (`c43e08c1`), Principal PR #3 (`6206aa80`), and generated PR #6 (`d8cd90da`). Remote aggregate diff since `0b1c4bab`: **15 expected files**. Agent reports post-merge GMS 1610 errors / 286 warnings, relations MATCH, index/export PASS; Principal **did not independently rerun axiomctl**.
- **Review-gate incident:** CODEX merged Canon PR #2 using older `CONTENT ACCEPTED` without the *fresh independent pre-merge review* required by the directive, then continued the chain. This is an actual **process violation** even if the resulting Git/QA are correct. Principal's postfactum source review did not find an unexpected Canon/lore change; it **cannot retroactively turn the missed pre-merge gate into PASS**. No automatic revert is justified by an identified content defect; retain an append-only incident record and mandate explicit fresh evidence before future merges.
- **Canon Draft PR #7 (0111 AgentOps record):** `agent/0111-agentops-record` @ `a57f1179f2feabb04f42bbc366a9e4adfdaa0991`, base Canon main, **NOT MERGED**. Adds 0111 SPEC/log/index plus generated NAV/SEARCH/ANCHOR. Requires actual GMS strict / relations / index/export / diff QA and a scoped independent review before its merge; do not confuse Canon PR #7 with Landing PR #5.
- **Landing:** main `2dbb6165d04f9357be3141570f3b9bd76231bb3a`; PR #4 feature `6f9d565172a38eabeb1e76084d475b5e91f16c73` **Draft / unchanged**. Landing PR #5 remains documentation-only stacked on the feature branch, no main merge or deployment. Pages latest build was **reported by agent** as `errored` from earlier 2026-10-16; this was not independently verified here. No design wave W3.0 has started.
- **Roadmap strategy PR #5:** `docs/0524-aaa-roadmap-agent-continuity`; prior independent CODEX review covered older HEAD `daa7ddff`, not subsequent Principal handoff updates. Before integration into feature, re-review **the exact latest HEAD** (including this status update), check all links and markdown-only diff, then update the living handoff to current verified refs. Principal is the author: **no self-approval**.
- **Next safe sequence:** (1) CODEX documents the skipped review gate, and Principal reviews Canon chain postfactum; (2) QA/Principal reviews Canon PR #7 independently; (3) independent documentation review on current Landing PR #5 and controlled merge into **feature only** if PASS; (4) W3.0 read-only visual audit and SPEC for CREATOR/Principal, **no W3 implementation** without a new directive.
- **Forbidden:** Canon root gitlink change, Landing main merge, Pages/production deployment, storyline expansion, unapproved security permission changes, foreign dirty worktree edits, and automated batch merges.

## 0. Current authorized assignment

CREATOR explicitly requested an AAA-quality strategy, durable agent workflow, continuity after `/compact` (also typed `/comact`) and reviewer rotation, committed to landing Git. The strategy documents are now integrated into the landing feature branch (PR #5 → `b63404be`). Future W3.A–W7 implementation is proposed, not started or implicitly approved.

**Current authorization (0524.CLOSURE-R1, 2026-10-18):** §I–§III done (see CURRENT STATE). §IV — **W3.0 read-only AAA Visual Baseline Audit** only; no design or code changes to the site until CREATOR / Principal review W3.0. No merges without a gate-record; no automatic further merges.

## 1. Refs at snapshot / verify these first

| Repo / object | Snapshot | Observed state / policy |
| --- | --- | --- |
| Landing repo | `Endevor-VIK/endevor-vik.github.io` | GitHub Pages, separate from AXS root |
| Landing main | `2dbb6165d04f9357be3141570f3b9bd76231bb3a` | published baseline as last reported; read-only for this task |
| Landing Draft PR #4 | `feature/showcase-v0-3-1-polish` @ `b63404beff5047444ecf0e5d9c67f4a252f44f5c` (+ handoff commits after it) | W0/W1/W2/W2.R implementation + AAA docs; active target; Draft; NO main merge |
| Canon main | `Endevor-VIK/AXS_CANON_V3` @ `3884ea43e125ddd39b18c80f91cc40310dd65e9f` | PR #4, #2, #5, #3, #6, #7 merged (see CURRENT STATE); root gitlink remains independent |
| Canon PR #2 / #3 | merged as `4aab5985` / `6206aa80` (heads `af6517e6` / `2c9f1392`) | PR #2 merge is the recorded review-gate incident; PR #3 independently reviewed before merge |
| Canon PR #7 | merged as `3884ea43` (head `a57f1179`) | 0111 AgentOps record; gate-record GR-01; post-merge QA PASS (agent-run) |
| AXS root `main` | `a1fe92bfae13a1374f7e79ca816f4b1188848fba`; gitlink `canon/v3` = `0b1c4bab` | root gitlink update prohibited (HOLD) |
| Strategy branch | `docs/0524-aaa-roadmap-agent-continuity` @ `8c2d2fbb` | merged into feature as `b63404be` (PR #5, gate-record GR-02) |

No live agent status, current worktree cleanliness or current CI status is known from this document. Do not conflate GitHub snapshots with active checkout.

## 2. Last relevant reviews and evidence

Entries are chronological; each status reflects the time it was written — the CURRENT STATE block is authoritative for the present.

- **W1.R:** Principal accepted technical conditions with QA limitations; Work B, Type A, screenshot privacy and render palette review performed with limited independent samples.
- **W2:** implementation source accepted; editorial questions subsequently resolved by CREATOR.
- **W2.R:** source review PASS for landing; agent report 130/130 Chromium+Firefox, mobile LH 97 / desktop 100. **Agent-reported**, not independently rerun by Principal; see `W2R_REPORT.md` and `QA_MATRIX.md`.
- **Canon PR #2:** content accepted; prior generator blocker repaired in merged Canon PR #4, but integration of PR #2 awaits fresh post-merge QA and independent review.
- **Canon PR #3:** event attribution clarification committed by Principal; GMS header corrected on `8cdc2e8e`. W2.R-Q reported **one remaining WARN**: linked-objects anchor ahead of heading. Principal moved it under the heading on **`2c9f1392`**. Independent GMS strict on this latest head NOT RUN; CODEX must requalify and record exact deltas.
- **0524 Canon recovery PR #4 MERGED (GitHub verified):** PR #4 `f32e2298` merged on 2026-10-18T18:01:38Z as `391418c9cdffcee10ed5ece5885b0e2e52b91a45` (parents: prior Canon main `0b1c4bab` and PR head `f32e2298`). Principal independently fetched the four files on new main: all `mode: Canon`; SEARCH = 507 records. Existing agent report: GMS 1614→1610, relations MATCH, index/export PASS on premerge checkout; **new-main post-merge command execution remains NOT RUN** because Claude Code blocked subsequent reads. GitHub PR #4 reported zero formal reviews/check runs as of verification; Principal/CREATOR approved the scoped operation independently. No replay of `gh pr merge 4` is permitted. AXS Q1/Q2 reports remain the evidence source for reproducible local QA.
- **0524.CLOSURE-R1 (Principal, 2026-10-18):** Canon chain to `d8cd90da` — POST-FACTUM SOURCE PASS with the recorded process deviation; Canon PR #7 CONDITIONAL GO → merged `3884ea43`; Landing PR #5 — CODEX independent review PASS at `8c2d2fbb` → merged into feature `b63404be`. All post-merge results are **agent-run**, not independently rerun by Principal.
- **Creative boundary:** keep the Curator's participation in Erasure, the responsible commander and BLACK PROTOCOL relationship mysteries unresolved. No new plot developments for website.

## 3. Fixed CREATOR decisions — do not reopen without request

- Premium cinematic RED PROTOCOL, #ff2034/red-graphite, no pink/plum, no generic agency redesign.
- WORK B archive with eight real screenshots and one atmospheric A01 band, approved privacy check (future captures still require new check).
- TYPE A self-hosted Oswald + JetBrains Mono + Golos Text; no Unbounded.
- Canon WORLD nodes `02.01…02.06` and their fixed identity, V10 source/1:1 zoom with proper image provenance.
- Original section order and all substantive authored lore, MANIFESTO, AXIOM world; narrative ambiguity is intentional.
- Custom cursor unchanged; semantic keyboard access still protected.
- Telegram contact and link to official AXIOM entry; manual gate notice `assets/status/gate.json` has checkedAt `2026-10-17`, expires `2026-10-31T00:00:00Z`; verify state before release, do not claim “now offline” based only on old status.
- Commercial attractiveness through **design quality and real evidence**, not pushy marketing claims. Three target audiences: clients, readers, engineers.
- Q-10/D-09 and Q-12 delayed; deeper Black Protocol/Erasure storyline not authorized.

## 4. Pending blocking dependencies and open risks

**For next current operation:** no merge is pending or authorized. Canon integration is complete at `3884ea43` (Principal separate check of Canon main after PR #7 pending); root `canon/v3` gitlink update is a separate gated operation. Next is the read-only W3.0 audit. Do not broaden `.claude/settings.json` permissions or alter existing foreign dirty state without CREATOR authority; use scoped interactive approvals or a sanctioned read-only connector for verification.

**For landing:** PR #4 remains Draft / production HOLD until CREATOR says otherwise. WebKit/Safari, actual devices/GPU, manual screen reader and real-field CWV historically NOT RUN. Softness in remaining source-limited imagery; full AAA visual audit not yet performed. Do not upgrade these to PASS because roadmap says W7.

**For strategy:** integrated into the feature branch (`b63404be`): a feature checkout now contains `AGENTS.md` and the AAA documents; `main` does not.

## 5. Recommended safe next steps (ranked)

1. CODEX: **W3.0 read-only AAA Visual Baseline Audit** on the feature HEAD (0524.CLOSURE-R1 §IV); deliver audit, comparison images, V1–V10 / T01–T10, top-10, W3.A–W3.D SPEC, agent allocation, risks and Preservation Plan for review — status `0524.W3.0 READY FOR PRINCIPAL & CREATOR REVIEW`. No site changes.
2. Principal / CREATOR review W3.0 and decide which W3 slices (if any) are authorized, with bounded scope.
3. Separate gated operations (never bundled with W3): Principal check of Canon main `3884ea43`; root `canon/v3` gitlink update; Pages build-error investigation; Landing `main` merge / production — fresh CREATOR approval only.
4. Then W3 in slices with visual-first Principal + CREATOR checkpoints. W4–W7 remain roadmap proposals, not autonomous actions.

## 6. Copy-ready context recovery instruction

```text
AXIOM SHOWCASE CONTINUATION:
Read AGENTS.md, docs/showcase-v031/AAA_CURRENT_HANDOFF.md, AAA_MASTER_ROADMAP.md,
AAA_AGENT_PROTOCOL.md and AAA_REVIEW_SCORECARD.md. Read latest W2R_REPORT.md,
REVIEW_HANDOFF.md and QA_MATRIX.md on the correct branch. Verify current Git
branches, PR heads, worktree status and CI; handoff SHAs are historical.
CREATOR wants AAA cinematic professional design that speaks to clients,
readers and engineers, without a sales sheet or lore spoilers. Preserve RED
PROTOCOL, TYPE A, WORK B, six Canon IDs, V10, original section order and
the custom cursor. Do not merge main, deploy or change Canon/gitlinks without
fresh explicit permission. Before ANY merge write a gate-record for the exact
HEAD (author/reviewer, reviewed SHA, QA SHA, verdict, allowed target,
authority); missing or mismatched record = merge forbidden. Identify active task, owners, pending reviews, and
deliver a short verified continuation plan before writing.
```

### RESUME PACKET — 2026-10-18 after 0524.CLOSURE-R1 §I–§III

```text
AXIOM SHOWCASE / RESUME PACKET
AUTHORITY: Principal directive 0524.CLOSURE-R1 (2026-10-18), CREATOR approval via Principal
PHASE / TASK: 0524 — §I–§III done; §IV W3.0 read-only AAA Visual Baseline Audit next
REPOS + BRANCHES + LAST VERIFIED HEADS: landing feature/showcase-v0-3-1-polish
  b63404be (+ handoff commits) | landing main 2dbb6165 | Canon main 3884ea43 |
  AXS root main a1fe92bf, gitlink canon/v3 0b1c4bab | root trace
  agent/0524-showcase-v031-trace d53bd2cd (+ later trace commits)
CLEAN/DIRTY: landing worktree clean after commit; AXS root has foreign dirty
  paths (.claude/settings.json, apps/*, canon/v3 pointer) — do not touch
LAST ACCEPTED BASELINE: W2.R SOURCE PASS (landing); Canon POST-FACTUM SOURCE PASS
DONE: deviation record; GR-01 + Canon PR #7 merge 3884ea43 + post-merge QA PASS;
  GR-02 + Landing PR #5 merge b63404be (feature only) + smoke PASS + 130/0
PENDING: W3.0 audit; Principal check of Canon main 3884ea43; Pages error study
NOT RUN: WebKit/Safari, real devices/GPU, manual screen reader, field CWV
CREATOR FROZEN CHOICES: RED PROTOCOL; TYPE A; WORK B; six Canon IDs; V10;
  no spoiler; original section order; custom cursor
CURRENT EVIDENCE + COMMANDS: AXS sandbox/evidence/2026-10-18_0524_closure/;
  python3 tests/smoke_showcase.py; python3 tests/smoke_showcase_v23.py;
  NODE_PATH=<playwright node_modules> node tests/browser/showcase_regression.cjs --firefox
EXPLICIT FORBIDDENS: no main merge, no production deploy, no root gitlink, no
  version bump, no BLACK PROTOCOL/Erasure expansion, no self-approval, no merge
  without a gate-record for the exact HEAD, no automatic further merges
NEXT 1-3 SAFE ACTIONS: (1) W3.0 read-only audit -> READY FOR PRINCIPAL &
  CREATOR REVIEW; (2) wait for review; (3) gated operations only by new directive
STOP CONDITIONS: PR/branch HEAD changed unexpectedly; foreign delta; disk WARNING;
  any design change before W3.0 review
FIRST ACTION: reread AGENTS.md + roadmap/protocol/handoff; verify git/PR/CI before editing.
```

## 7. Post-compact / reviewer takeover record — TEMPLATE

- **Checked at (timezone):** TBD
- **New agent / Principal:** TBD
- **Verified landing branch/HEAD, main:** TBD
- **Verified Canon PR heads, root gitlinks:** TBD
- **Worktree state and foreign dirty paths:** TBD
- **Reviewed code, tested screenshots and actual test commands:** TBD
- **Latest last-accepted baseline + source:** TBD
- **Open P0/P1/P2 and untested surfaces:** TBD
- **Design decisions requiring CREATOR:** TBD
- **Next authorized action / do not touch list:** TBD
- **Compaction RESUME PACKET and evidence links:** TBD

**Reminder:** No replacement reviewer can promote previously reported results to independent verification merely by quoting this file.
