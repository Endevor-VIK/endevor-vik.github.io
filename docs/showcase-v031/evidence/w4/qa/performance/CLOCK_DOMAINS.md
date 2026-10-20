<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4.CLOCK_DOMAINS
  title: "W4 — performance clock domains and limits"
  status: RECORDED / CAUSE_NOT_ESTABLISHED
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# W4 — clock domains

Дата этого отчёта:21.10.2026. Измерения выполнены20.10 UTC; исходные timestamps не изменялись. [Derived JSON](clock-domains.json) сохраняет хэши обоих original guard records, полную временную линию246 samples cohort5 и семь явно выделенных UTC/MONOTONIC расхождений. Это дополнительная диагностика метода, не коррекция Lighthouse metrics.

| Cohort / clock | Median interval, s | Maximum, s | Meaning |
| --- | --- | --- | --- |
|4, original `seconds` |1.003766 |1.011169 | wait-based denominator v1; часть известной scan/write работы не включена |
|4, recorded UTC gaps |1.007407 |4.601346 | разности записанных UTC timestamps; CPU-read MONOTONIC stamps отсутствуют |
|5, CPU-read MONOTONIC |1.006508 |1.022587 | actual CPU denominator v2; совпадает со всеми соседними CPU-read differences |
|5, recorded UTC gaps |1.006598 |4.776223 | другое clock domain; не подменяет MONOTONIC denominator |

Между первым и последним measurement sample cohort5 UTC span271.007534s, MONOTONIC span245.837832s: разница25.169702s. Семь UTC intervals4.350–4.776s имеют MONOTONIC intervals около1.005–1.008s. Причина **не установлена**. Нельзя приписывать расхождение исключительно I/O, VM pause, NTP correction, host suspend или внешней нагрузке. Для cohort4 невозможно восстановить actual CPU-read MONOTONIC intervals по UTC discontinuities; прежняя причинная attribution к overhead снята.

[Guard v2 predeclaration/fixture](guard-v2-validation.json) и source [run_guarded.py](run_guarded.py) задают whole-attempt rejection при CPU-read **MONOTONIC interval>3s**. Этот predicate пройден; max scan.011263s. Это не утверждение UTC wallgap≤3s, непрерывной секундной тишины или калибровки физического времени. `/proc` sampling не исключает краткие процессы между samples и Windows-host activity.

Одинаковые source/Lighthouse settings и instrumentation внутри каждого B/A cohort подтверждены; версии внешнего guard и ephemeral ports между cohorts различаются. Все40 observations сохранены без пересчёта raw timings или исключений. [Independent G4](../../../../waves/w4/W4_G4_REVIEW.md) принимает только bounded simulated lab comparison с этой оговоркой. Причинная эквивалентность, нулевая стоимость, field CWV/INP и перенос на физические устройства не доказаны.
