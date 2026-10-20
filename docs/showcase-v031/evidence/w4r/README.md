<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.EVIDENCE_INDEX
  title: "W4.R — R0/R1 proposal evidence"
  status: PROPOSED / GATE_R_A_PENDING
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# W4.R — до выбора направления

[Интерактивное BEFORE/CURRENT/PROPOSED](REVIEW.html) · [три варианта с кадрами](../../waves/w4r/R1_VISUAL_CHOICES.md) · [план и wireframes](../../waves/w4r/R0_R1_PROPOSAL.md).

A — палимпсест архива; B — линия разлома; C — камера свидетельств. Рекомендация Lead — A, выбор CREATOR ещё не дан. Это standalone mockups, не продуктовый AFTER и не завершённая R2. Прямой просмотр: [A](prototypes/a.html), [B](prototypes/b.html), [C](prototypes/c.html). HTML работает локально, с исходными шрифтами/иллюстрациями из assets; сеть/сборка не нужны. Для GitHub чтения используйте встроенные кадры Markdown.

[manifest.json](manifest.json):52 native viewport captures1440×900/390×844, Chromium149, DPR1/RM; все сегменты doctrine/aftermath, archive spotlight и external map/chars introduction previews. Никакой ретуши/склейки. Дополнительно [7 bilingual type specimens](../../waves/w4r/R1_TYPE_SPECIMENS.md):14 native frames entry→epilogue и7 bounds checks; это отдельный типографический лист, не четвёртый вариант. Caption объясняет, где кадр показывает только часть высокой сцены. Source reportingHEAD7413405 + exact prototype hashes; runtime stillb85fbb0. Состав старых W4 кадров не менялся: [38 reused references and hashes](reference-frame-manifest.json), all checked against original manifests. BEFORE6b082e5 и CURRENTb85fbb0 явно разделены с PROPOSED.

[Concept QA](../../waves/w4r/R1_QA_REPORT.md):116/0 mockup checks,6 axe samples/0 violations с incompletes,33/0 offline-router checks. R3 product cross-engine/actual200%/performance и independent R4 NOT RUN. Существующий W4 G4 не принимает новое художественное направление.

Tooling: [generator](prototypes/build_concepts.py), [standalone CSS](prototypes/concepts.css), [capture](prototypes/capture.cjs), [router builder](build_review.py). Capture reproduction: `NODE_PATH=<existing Playwright/axe modules> node docs/showcase-v031/evidence/w4r/prototypes/capture.cjs run-NEW`, new owned scratch path only. Source/assets не копируются в run. После генерации exact prototype hashes должны совпасть с manifest, иначе кадры устарели.

Retention: own scratch last3runs/14days at write; capture ceiling12MiB/run, durable new W4.R R1 budget6MiB; old W4 package49.48MiB preserved separately. No videos/traces/profiles retained. [Cleanup](cleanup.json) records only owned paths. First failed noJS assertion was a harness mismatch with CSS uppercase; [qualification record](qualification/README.md) preserves it, no retroactive PASS.
