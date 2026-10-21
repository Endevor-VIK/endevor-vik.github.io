<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.PERF_BUDGETS
  title: "W4.R — predeclared performance budgets (committed before results)"
  status: PREDECLARED / RUN_IN_PROGRESS
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: false
-->
# Производительность W4.R — бюджеты, объявленные до результатов

Документ записан и закоммичен **во время** замера — до того, как открыты результаты. После этого бюджеты не меняются.

## Методика

- `tests/browser/w4_perf.cjs`, как в W4 (Lighthouse 12.8.2, Chromium 149, Playwright 1.61.1).
- BEFORE `b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5` / AFTER `b6040e3cbd110b807c5a33d6cccf4b52f7b05ed7`. Корни — `git archive` этих SHA; раннер сверяет каждый файл с блобом коммита до и после замера.
- Два фиксированных прогона по 5 пар. В каждой паре: mobile BEFORE → AFTER, затем desktop BEFORE → AFTER. Итого **40 наблюдений, n = 10** на профиль и вариант. Свежий профиль Chrome на каждое наблюдение, simulated throttling, первый визит.
- Хост перед стартом: C: 62,1 ГиБ свободно (12,1 %); 8 ядер; load ~1,2 — фон VS Code / codex / rust-analyzer, не принадлежит задаче. Нагрузка пишется каждые 15 с.
- Исключений нет: в анализ входят все 40 наблюдений. Сорванное наблюдение или прогон делает результат INCOMPLETE, а не «отбрасывается».

## Бюджеты (по медианам n = 10; дельты — медиана попарных AFTER − BEFORE)

| # | Метрика | PASS | STOP / расследование |
| --- | --- | --- | --- |
| B1 | Lighthouse Performance AFTER | mobile ≥ 90, desktop ≥ 95 (пороги W4) | ниже порога |
| B2 | LCP | дельта не превышает одновременно +10 % И +150 мс (порог W4); mobile AFTER ≤ 2 500 мс | обе границы превышены или mobile AFTER > 2 500 мс |
| B3 | CLS | дельта ≤ +0,02 (W4); AFTER ≤ 0,1 | выше |
| B4 | TBT | mobile AFTER ≤ 200 мс; дельта ≤ +50 мс | выше |
| B5 | FCP | дельта не превышает одновременно +10 % И +150 мс | обе границы превышены |
| B6 | Accessibility / Best Practices / SEO AFTER | не ниже BEFORE | ниже |

Отдельно сообщаются средние, SD, размах, вес передачи и запросы. Это лабораторные данные: никаких выводов о статистической эквивалентности или реальных устройствах. Нарушение бюджета → STOP MERGE, классификация и точечное исправление.
