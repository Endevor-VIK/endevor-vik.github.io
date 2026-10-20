<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4.G2_SPEC
  title: "0524.W4 — controlled implementation contract"
  status: IMPLEMENTED_FROZEN / G3_G4_RESULTS_SEPARATE
  deployment: NOT_DEPLOYED
  mode: Task SPEC and ownership
  goal: "Внедрить принятый G1 с R1–R6, доказать сохранность и передать Gate B"
  scope: Landing W4 G2–G4
  lang: ru
  last_updated: 2026-10-20
  editable_by_agents: true
  change_policy: "Не расширять protected/Canon/release scope; изменения трассировать"
-->

# W4 G2–G4 — execution contract

Execution snapshot: S0–S3 выполнены отдельными commits; runtime/test freeze `b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5`. BELOW сохраняет исходный execution contract. Фактическое прохождение G3/G4 фиксируется в [WORLD_QA_REPORT](WORLD_QA_REPORT.md), а не выводится из плана. Gate B PENDING.

Authority: [Gate A acceptance](W4_GATE_A_ACCEPTANCE.md), reviewed proposal `af20ff6`. Предыдущие G0/G1 документы в PR #11 — принятый исторический proposal; условия R1–R6 имеют приоритет над его исходной формулировкой.

Baseline runtime — `6b082e5f262c09a123748273da42277d3a29a6c2`; новая implementation branch `w4/world-narrative` от `af20ff6be8909b641070003795ff13ffadc334fd`, worktree `/home/axiom/ENDEAVOR/AXS-WORKTREES/0524-w4-world-implementation`. Отдельный immutable BEFORE worktree `/tmp/axs-0524-w4-before-6b082e5`. Root/main/PR #11 не меняются этой веткой. Canon read-only `3884ea43`.

## Slice order and ownership

| Slice | Owner / writable paths | Verification / barrier |
| --- | --- | --- |
| S0 authority + BEFORE | Lead docs; QA agent `tests/browser/w4_qa.cjs`, `docs/showcase-v031/evidence/w4/tools/**` | BEFORE captures на 7 viewports ×3 engines; manifest source SHA/versions/DPR; **до runtime edits** |
| S1 entry + BLACK SUN | Lead `index.html`, scoped `assets/css/showcase-v23.css` | 4 beats, readable reconstruction label/caption R1, original W01/W06 images; targeted source/geometry |
| S2 WHAT REMAINS + WORK | Lead same two runtime files | Human city/memory/body consequences R2/R3; four static schemes in three native collapsed disclosures R4; eight actual captures unchanged |
| S3 factions / copy | Lead same two runtime files | One heading, unchanged art/card structure/statuses; NEURA phrased through legacy R5; exact protected HTML/data/asset checks R6 |
| S4 G3 freeze | QA tools + Lead existing relevant smoke/browser contracts | Complete engines/viewports, axe/semantics/keyboard/no-JS/RM, anchors/overflow, source/visual preservation, paired lab perf |
| S5 G4 and delivery | Independent reviewer who authored no runtime patch | Frozen implementation SHA + comparison pairs + QA logs; findings resolved/rechecked; Gate B pending |

One writer for `index.html` and CSS: Lead. Read-only editorial/WORK agents do not modify runtime. QA tooling may be written while baseline remains byte-identical. No new app JS required. No new fonts/media assets; selected evidence captures are not runtime payload. New top-level sections: zero.

## Editorial deltas required by Gate A

- **R1:** visible `NEXARCH · АВТОРСКАЯ РЕКОНСТРУКЦИЯ` plus ordinary readable attribution explaining that this is page-authored prose, not a quotation from a Canon document. No fake `cite` source.
- **R2/R3:** W02 owns fragmentation, retained layers and uncertainty. WHAT REMAINS covers access through the city, competing memory and medicine/implant dependence; no repeated part/whole lesson.
- **R4:** disclosures closed initially and placed as third grid row after real screenshot/case. Native details/summary, small static figures, clear conceptual label, no live-looking counters/second gallery/viewer entries/loops.
- **R5:** NEURA described through research legacy and the approved relation core only; no present existence/operations, destruction or revival claims. Existing protected status labels unchanged.
- **R6:** all HTML `#world` and `#chars` including external III/IV labels, map data/handlers, OMEGA, AXIOM ∅ remain byte-identical. Source proof plus visual/behavior regression ensures shared styles did not change them.

## DoD / QA / resource and rollback

Public intent: a first visitor can describe old-world trust, known Black Sun loss, surviving life and conflict without learning an engineering architecture. One dominant h2 per changed scene; keep original RED PROTOCOL / TYPE A / WORK B and imagery. Body is Golos; small Mono labels support navigation. New text is reachable without JavaScript/reveal.

Technical matrix and budget follow [WORLD_QA_REPORT](WORLD_QA_REPORT.md) §3–4: seven specified viewports × Chromium/Firefox/WebKit; DPR samples; keyboard, reduced motion/no-JS, axe + semantic inspection; all anchors and protected/gallery behavior. Fresh comparable five interleaved lab pairs mobile/desktop against fixed baseline. Field INP/real devices/manual NVDA/VoiceOver remain separately reported if unavailable. No pretending emulated zoom is actual browser zoom.

Host guard before execution: Windows C free `54,243,803,136` bytes (~50.52 GiB, 10.61%); source trees 85 MiB each, missing WebKit expected <1 GiB install, evidence budget <50 MiB. Repeat host check before perf. Own transient run directories retain max3 and age≤14 days at write; no videos/traces; own temporary baseline worktree removed after evidence delivery, never other owners' files/processes.

Each slice commits explicit files only after targeted checks. Freeze exact runtime/test SHA before full final capture/perf/G4. Keep baseline source/hash/captures plus optimized review pairs. A new Draft implementation PR is separate from #11 and requires no merge of #11. Gate B and production remain pending.

Rollback: normal reviewed revert of W4 runtime commits; never force/reset main or remove original art. Stop for scope/Canon conflict, host critical resource state, foreign delta, unexpected baseline movement or protected regression.
