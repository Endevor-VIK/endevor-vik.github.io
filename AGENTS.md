# AXIOM SHOWCASE — Agent Entrypoint

**Applies to this repository.** This document is a continuity entrypoint for Codex/agents and reviewers, not an instruction to override CREATOR or approve releases.

## Mandatory startup and recovery (including after `/compact`, context loss, or reviewer replacement)

1. Read this file, then [AAA_CURRENT_HANDOFF](docs/showcase-v031/AAA_CURRENT_HANDOFF.md), [AAA_MASTER_ROADMAP](docs/showcase-v031/AAA_MASTER_ROADMAP.md), [AAA_AGENT_PROTOCOL](docs/showcase-v031/AAA_AGENT_PROTOCOL.md) and [AAA_REVIEW_SCORECARD](docs/showcase-v031/AAA_REVIEW_SCORECARD.md).
2. Read task-specific [REVIEW_HANDOFF](docs/showcase-v031/REVIEW_HANDOFF.md), [QA_MATRIX](docs/showcase-v031/QA_MATRIX.md), [PRESERVATION_REPORT](docs/showcase-v031/PRESERVATION_REPORT.md), and latest wave report, **if present on the current checked-out branch**. These may exist on the feature branch even if absent from `main`.
3. Independently run `git status --short --branch`, `git rev-parse HEAD`, inspect `git remote -v`, identify active PR HEADs and any pending review; refresh from GitHub if connected. **All SHA values in handoff files are snapshots, never evidence of present state.**
4. Confirm the current task's explicit authorization (CREATOR approval, Principal directive, scope, allowed branches). If absent, perform read-only review or request authorization; do not infer permission from the roadmap.
5. Never change an active PR, `main`, root gitlink, Canon, build/dist or GitHub Pages deployment just because a roadmap says a wave is next.
6. Before any new implementation, produce a compact task contract (goal, non-goals, ownership, preservation list, DoD, QA, rollback), as specified in the agent protocol.
7. Before compaction, interruption, handoff, or reviewer switch, update the living handoff in the active task branch and leave a **copy-ready RESUME PACKET** (see protocol). The new agent must reverify HEAD, working tree, CI and blockers before editing.

## Fixed CREATOR direction

**AAA quality through demonstrated craft, not an advertising sheet.** The landing addresses clients (design/engineering proof), readers (world/mystery), and engineers (credible system evidence). Preserve the cinematic original **RED PROTOCOL** look, #ff2034 / neutral graphite (no pink/purple/salmon), official six-node Canon map, original lore and order of sections, WORK B single archive, TYPE A self-hosted Oswald/JetBrains Mono/Golos Text, and approved custom cursor. Avoid total redesign, aggressive sales copy, invented live telemetry, claims unsupported by real code, spoilers, or silent Canon changes. Reduced motion and weaker devices must remain first-class.

Current release boundary as of 2026-10-18: landing PR #4 is **DRAFT / NOT RELEASED**; both `main` merge and production deployment require fresh CREATOR approval. Canon-related PRs and index/export recovery are a **separate stream**. Read current handoff for observed refs; do not assume this remains true indefinitely.

## Authority and gates

**CREATOR** approves aesthetics, canon extensions, major scope and release. **Principal Reviewer** evaluates evidence and can authorize bounded branch work, but cannot self-approve their own changes. **Implementation lead** coordinates scoped agents, protects working trees and produces evidence; green tests do not imply design acceptance or merge authorization.

Use `PASS / FAIL / NOT RUN / INCOMPLETE / BLOCKED / OBSERVED` literally. Do not substitute reported metrics for independently rerun tests. Do not fabricate screenshots, routes, customers, benchmarks, or production status.

**Durable truth priority:** explicit latest CREATOR instruction → reviewed canon/product sources and repo constraints → approved decision register → current committed handoff/roadmap → agent report → chat summary. When sources conflict, stop and escalate. The roadmap sets direction, **not automatic execution permission**.
