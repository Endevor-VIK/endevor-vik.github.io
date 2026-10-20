<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4RP.EVIDENCE
  title: "R1.P — native real-page preservation evidence"
  status: PROPOSED / GATE_R_A_CHANGES_REQUESTED
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# R1.P evidence

[Открыть BEFORE / CURRENT / A+](REVIEW.html). Все 346 кадров сохранены нативно, 1:1, без stitched полотна или уменьшенных thumbnail вместо proof. Пять полных секций × три версии × четыре viewport; дополнительно полные Four Surfaces и WORK02/03/05. CURRENT раскрытия явно выделены как отдельное состояние.

[Handoff и точные SHA](../../waves/w4rp/R1P_HANDOFF.md) · [Матрица сохранения / все намеренные изменения](../../waves/w4rp/PRESERVATION_MATRIX.md) · [Canon trace](../../waves/w4rp/R1P_CANON_TRACE.md) · [Authority](../../waves/w4rp/PRINCIPAL_CHANGES_REQUESTED.md).

`manifest.json`: raw bounds, source/input hashes, Chromium/Playwright, states, screenshot scrollY, viewport/DPR, bytes/SHA256 каждого файла. `source-validation.json`: protected exact source/4 original graphic topologies/SVG geometry. `probe-validation.json`: scoped interactive/a11y/motion checks и axe incompletes. `review-validation.json`: 111 offline routes. `artifact-validation.json`: нативные dimensions/hashes, полное покрытие с overlap, frozen inputs/ссылки. `qualification/`: прозрачный audit промежуточных неокончательных попыток. `cleanup.json`: удаление только собственного временного scratch после проверки durable hashes.

`preview/aplus.html` — **полная** b85 landing с предложенными внешними секциями и исходными runtime assets, не самостоятельная маленькая страница. Она корректно работает через `node preview/serve.cjs`; сервер читает Git refs без копирования assets. `/before/` читает6b082e5; `/current/` читаетb85fbb0; `/aplus/` добавляет только snapshot/r1p.css. Сервер использует loopback, bounded24MiB cache; записи/публикации нет. `build_aplus.py` сохраняет product freeze. Никакой `dist`, новый package manager или dependency download не создавались.

Ни один результат этого пакета не является художественным PASS. R2/R3/R4/performance не выполнялись; старые W4/W4R evidence сохранены. Пакет нового R1.P ограничен32MiB; собственные transient runs удерживаются3/14дней и удаляются после durable проверки. Host C≈47GiB/9.95% free — WARNING; foreign browser/build workloads не останавливались, quiet-window не заявлено.
