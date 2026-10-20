<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.R1_QA
  title: "W4.R — concept checks and limits"
  status: R1_CHECKED / R3_R4_NOT_RUN
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# R1 — проверки макетов

Product freeze: b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5. Reporting start7413405628aba95ff7b34d486d6b3d167d32f66b. Изменены только docs/prototypes/evidence; runtime/assets/tests diff empty. Отдельный [manifest](../../evidence/w4r/manifest.json) содержит exact hashes всех prototype inputs и52 native captures. Code-based mockups не представлены как новая интеграция сайта.

| Check | Result / limit |
| --- | --- |
| Concept geometry/fonts/static state |105 checks, PASS: A/B/C ×7 sizes ×5assertions |
| Sizes |1920×1080,1440×900,1366×768,1024×768,768×1024,390×844,360×800 |
| Assertions |No page h-overflow; h2/h3/RU bounds; prose≥16px;3 self-hosted fonts available;0 active animations |
| Axe |6 samples,0 violations; exact incomplete targets in manifest, not WCAG certification |
| JS-disabled archive prose |3/3 visible/readable DOM-content assertions; static comp, no app scripts |
| Runtime console/network |0 page errors,0 HTTP errors;2checks |
| Total comp checks |**116 /0 failures** on run002 |
| Offline review router |**33/0**, A/B/C×desktop/mobile×5scenes; bounds1440/390; keyboard focus;0 page errors |
| Captures |**52** native1440×900/390×844 WebP80/DPR1/RM, all doctrine/aftermath segments + external introduction/spotlight |
| Old references |**38** native W4 frames reused without copies; byte hashes match original BEFORE/AFTER manifests |
| Source/Canon |Existing b85 runtime preserved; Canon3884ea43 read-only; first-use proposals traced individually |

Chromium149.0.7827.55 / Playwright1.61.1; no package installs/downloads. HostC47.25GiB/~9.92% WARNING, budget128MiB transient/6MiB durable fits, no critical condition. Runs sequential; own browser/server closed in finally. [First noJS harness failure](../../evidence/w4r/qualification/README.md) retained literally, corrected full run independent of it; no retroactive PASS.

Personally inspected BEFORE black-sun1/2/3, CURRENT black-sun1/2, BEFORE/CURRENT WHAT REMAINS, CURRENT AXIOM∅ and mobile aftermath; then R1 A desktop archive/aftermath+mobile doctrine/aftermath/geography, B desktop opening/archive/aftermath+mobile opening, C desktop opening/archive/aftermath+mobile archive. This is Lead self-critique/sample review, **not independent R4**, user research or final aesthetic approval. First critique changed A ghost orb to archive planes, removed borrowed∅, added original W04 detail at access threshold, and fixed whitespace around mobile boundary text.

R3 **NOT RUN**: product Chromium/Firefox/WebKit matrix, actual200%, keyboard/viewer/map regression, paired Lighthouse againstb85, real devices/AT/field metrics. New composition has not received a performance PASS. R4 independent artistic/technical recheck **NOT RUN**. Old1656checks/fixed40/G4 remain evidence for rejected b85 only. Legacy two HERO defects remain separate debt. Map/chars external previews omit protected internals deliberately; they do not prove the R2 exact-preservation test, which must be rerun on new implementation SHA.

Gate B NOT ACCEPTED / Gate R-A selection PENDING. No merge/deploy/main/Canon/gitlink/version actions. [Directive/spec](W4R_SPEC.md), [visual choices](R1_VISUAL_CHOICES.md).
