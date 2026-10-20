<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4.EVIDENCE_INDEX
  title: "0524.W4 — retained evidence"
  status: CAPTURED / G4_COMPLETE_WITH_LIMITS / GATE_B_PENDING
  deployment: NOT_DEPLOYED
  mode: Evidence router
  goal: "Найти нативные пары и конкретные измерения без зависимости от /tmp"
  scope: W4 BEFORE / AFTER / G3 / G4
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
  change_policy: "Не менять кадры или source SHA задним числом"
-->
# W4 evidence

Откройте [REVIEW.html](REVIEW.html) локально для всех сцен/движков/viewport. Полные desktop/mobile пары также встроены в [WORLD_BEFORE_AFTER](../../waves/w4/WORLD_BEFORE_AFTER.md). Кадры — нативные viewport screenshot segments, без ретуши/склейки; WebP q76.

- [BEFORE manifest](before/manifest.json): source `6b082e5`, до runtime mutation, 455 сохранённых кадров из702, 327 checks/0 failed.
- [AFTER manifest](after/manifest.json): frozen `b85fbb0`, 541 сохранённый кадр из782, 1656 checks/0 failed. Эти counts относятся к W4 matrix; общая legacy regression и остальные probes имеют отдельные результаты.
- [QA report](../../waves/w4/WORLD_QA_REPORT.md): команды, реальные результаты, residuals и ограничения метода.
- [Independent G4](../../waves/w4/W4_G4_REVIEW.md): reviewer без runtime authorship, exact frozen SHA, source/Canon/visual recheck; Gate B остаётся за CREATOR.
- [Performance observations](qa/performance/OBSERVATIONS.md):fixed40 observations /2 complete cohorts, separate+pooled medians/range/SD, conditions, raw hashes и independent PASS bounded lab with limits. Attempts1–3 excluded. [Clock caveat](qa/performance/CLOCK_DOMAINS.md) и [final cleanup](qa/performance/final-cleanup.json) сохранены. Gate B HOLD. [Draft PR12](https://github.com/Endevor-VIK/endevor-vik.github.io/pull/12) — checkpoint для review.
- [Tooling](tools/README.md), [performance method](tools/PERF_RUNNER.md); `review_index.py` воспроизводит HTML из сохранённых manifests и проверяет SHA256 файлов.

`qualification/after-8816036.json` — manifest первого непрошедшего qualification с11px labels; его transient frames не включены в retained набор. Исправление12px относится к итоговому SHA. Это не финальный PASS run.

BEFORE/AFTER manifests сохраняют environment, source trees, runner hashes и полный check log, но список `captures` содержит только физически сохранённые файлы. `fullRunSummary` отдельно описывает полный transient запуск; `retainedCaptures/retainedBytes` — review subset. Не считать отсутствующие transient captures доступными в Git. Выбранные полные сцены и каждый файл subset проверены по hashes.

Storage: retained review evidence в Git, общий бюджет <50MiB; own transient runs при записи удерживают последние3 и не старше14дней. Browser profiles/videos/traces не сохраняются. Lighthouse full reports, rootless library downloads и временные worktrees не требуются для чтения retained evidence и удаляются после завершения проверки; команды их воспроизведения сохранены.
