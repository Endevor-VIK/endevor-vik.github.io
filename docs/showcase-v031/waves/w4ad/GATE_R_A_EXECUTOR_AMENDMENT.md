<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4AD.EXECUTOR_AMENDMENT
  title: "W4.AD — CREATOR executor reassignment: Opus takes R2"
  status: ACTIVE / CREATOR_AUTHORIZED / R2_AUTHORIZED / GATE_B_HOLD
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
-->
# 0524.W4.R — CREATOR EXECUTOR REASSIGNMENT

**Authority:** CREATOR, explicit directive in review conversation, 2026-10-21: «можешь исключить sol из работы opus продолжает далее. либо закончи ты».

**Decision: OPUS TAKES OVER R2. SOL IS REMOVED FROM THIS LANDING WORKFLOW.**

This is a **role amendment**, not a modification of the approved design. It supersedes references assigning R2 implementation to Sol in `GATE_R_A_AUTHORIZATION.md`, `OPUS_STAGE_REVIEW_PROTOCOL.md`, `AD_REVIEW.md` and other handoffs. Those historical records are preserved; this amendment controls from its commit forward.

## 1. Immutable decisions

- **Gate R-A: APPROVED** by CREATOR, unchanged.
- **Art baseline:** `9cf78b0` / A+AD, unchanged; Opus cannot replace approved design without CREATOR's new permission.
- **Implementation baseline:** `b85fbb0a` until R2 starts; PR #12 initially at `895b7cf` (verify current head before taking over).
- **Gate B:** PENDING. No merge, deployment, Canon edit, root gitlink or version bump without separate CREATOR approval.
- Preserve real 8-shot WORK archive, protected WORLD map/OMEGA-0/portraits/AXIOM ∅/SYSTEM and original design identity.

## 2. Role ownership — now

- **Opus:** sole R2 implementation executor, art director and internal visual QA owner for R2.1/R2.2/R2.3; prepares commits, native proof, test results, and stage records.
- **AXIOM / Principal Reviewer:** independent external review of delivered evidence and final artistic/technical concerns when presented; not the implementation executor.
- **Independent QA reviewer:** independent R3/R4 once the integrated runtime is frozen; must not mistake Opus's own tests for independent review.
- **CREATOR:** final Gate B, merge/deploy authority.
- **Sol:** no further implementation, reviews, commits or decisions for this LANDING task unless CREATOR explicitly reauthorizes.

Because Opus now codes and directs art, an Opus stage note is **SELF-REVIEW**, never independent artistic PASS. Independent R3/R4 and CREATOR Gate B remain mandatory.

## 3. R2 sequence — unchanged technical/art scope

1. **R2.1:** BLACK SUN/DOCTRINE + WHAT REMAINS: three-zone archive, fractured ring and true qualitative states, five recognition traces with BIO boundary, A08 from approved original derivatives, dependency scene, mobile traces rail.
2. **R2.2:** WORK / four full SURFACE STUDIES after the real gallery; mobile rail with accessibility/keyboard/touch/no-JS; remove duplicated simplified disclosures; SYSTEM unchanged.
3. **R2.3:** outside introductions / bilingual typography for WORLD GRID and CHARACTERS only; protected internals byte-identical.

Per stage: record exact runtime SHA, diff of product files, native implemented images at 1440/390/360 (1920 for doctrine), section heights vs A+AD, no-JS/keyboard/touch/RM results, protected comparison, and exceptions. Use the frozen `9cf78b0` prototype and the established tolerance (> max(1%,16px) needs recorded explanation), without blindly optimizing for height instead of design. Opus can proceed between internal stages after SELF-CHECK; external Principal may request corrections; stage notes may not be labeled independent PASS.

Before final Gate B: independent Chromium/Firefox/WebKit, actual 200% zoom, full responsiveness, qualified paired performance, access checks, protection proofs, evidence-size audit, independent R4 verdict.

## 4. Git takeover / preservation

Opus's documentation branch `docs/0524-w4-ad-opus-art-direction` was based on PR #12 at `895b7cf`. After checking branch refs and both working trees are clean, Opus may fast-forward `w4/world-narrative` to this documentation branch, **only if fast-forward remains valid**. Do not force-push, reset, cherry-pick blindly or rewrite approved snapshot commits. If branches diverged, stop and reconcile before changing PR #12.

Implement R2 only on the authorized isolated feature branch / worktree; do not change production, root or Canon. Keep the documentation/audit trail.

## 5. First next action

**Opus begins R2.1 directly** on the approved A+AD and presents an implementation SHA + evidence. No additional A/B/C concept cycle, and no further Sol handoff is required.

This document does **not** claim Opus has started, nor does it claim a merge/deployment or an independent QA pass.
