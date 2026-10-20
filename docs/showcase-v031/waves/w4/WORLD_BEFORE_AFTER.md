<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4.WORLD_BEFORE_AFTER
  title: "0524.W4 — before/after evidence contract"
  status: BEFORE_AFTER_CAPTURED / GATE_B_PENDING
  deployment: NOT_DEPLOYED
  mode: Native screenshot comparison index
  goal: "Не подменять будущие визуальные доказательства сценарием или старыми скриншотами"
  scope: Frozen G2 / G3 visual evidence
  lang: ru
  last_updated: 2026-10-20
  editable_by_agents: true
  change_policy: "Каждая capture pair получает source SHA, viewport, DPR и environment"
-->

# WORLD — BEFORE / AFTER

**Полный интерактивный индекс пар:** [REVIEW.html](../../evidence/w4/REVIEW.html). Откройте локальный файл: сцена, движок и viewport выбираются сверху. Он показывает все сохранённые нативные сегменты рядом; изображения доступны в исходном разрешении. Страница индекса — review artifact, не часть публичного сайта.

BEFORE — `6b082e5f262c09a123748273da42277d3a29a6c2`, снят **до первой runtime mutation**. AFTER — frozen implementation/test `b85fbb0a1cb4f4370dd35347b5b6dc57fac1f0b5`. Все последующие delivery/report commits сохраняют этот runtime. Gate B PENDING; NOT DEPLOYED.

| Серия | Полный запуск | Сохранено для review | Manifest |
| --- | --- | --- | --- |
| BEFORE | 327 checks, 0 failures, 702 captures | 455 frames | [before](../../evidence/w4/before/manifest.json) |
| AFTER | 1656 checks, 0 failures, 782 captures | 541 frames | [after](../../evidence/w4/after/manifest.json) |

В каждом движке Chromium149 / Firefox151 / WebKit26.5: 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 390×844, 360×800. Основные пары — DPR1/native reduced motion. DPR2 desktop/tablet, DPR3 mobile, обычное движение и no-JS проверены отдельно, не смешаны с этими кадрами.

Полные BLACK SUN, WHAT REMAINS, FACTIONS и WORK снимаются перекрывающимися viewport-сегментами, без ограничения числа кадров. Большая высота BEFORE WHAT REMAINS отражает старую Four Surfaces-витрину. В WORK сначала показана закрытая карточка с реальным screenshot, затем открытый контекст. В BEFORE этих раскрытий нет. Повторяющиеся header/части сцены — естественное перекрытие кадров, а не дублирование на сайте.

Кадры не ретушированы и не склеены; исходный PNG в памяти кодирован в WebP q76. Manifest содержит SHA256 каждого файла, source SHA/trees, runner hash, engine versions, viewport/DPR, scroll/selection/currentSrc, checks. Дополнительные поздние entry/full-protected segments остались transient; ключевые protected map/OMEGA/people/AXIOM∅ и epilogue кадры сохранены для каждого из21 сочетаний. Статус source и measured browser proof — в [QA report](WORLD_QA_REPORT.md). Lossy/subpixel pixel-diff — diagnostic, не заявление pixel identity.

## Полные пары desktop / mobile

Ниже — Chromium1440×900 и390×844. В каждой раскрываемой таблице показаны **все сегменты** выбранной сцены; для других размеров и движков используйте индекс выше.

<details>
<summary>W01 · 1440x900 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/1440x900/entry-1.webp"><img src="../../evidence/w4/before/chromium/1440x900/entry-1.webp" width="460" alt="BEFORE W01 1440x900 entry-1"></a> | <a href="../../evidence/w4/after/chromium/1440x900/entry-1.webp"><img src="../../evidence/w4/after/chromium/1440x900/entry-1.webp" width="460" alt="AFTER W01 1440x900 entry-1"></a> |

</details>

<details>
<summary>W01 · 390x844 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/390x844/entry-1.webp"><img src="../../evidence/w4/before/chromium/390x844/entry-1.webp" width="460" alt="BEFORE W01 390x844 entry-1"></a> | <a href="../../evidence/w4/after/chromium/390x844/entry-1.webp"><img src="../../evidence/w4/after/chromium/390x844/entry-1.webp" width="460" alt="AFTER W01 390x844 entry-1"></a> |

</details>

<details>
<summary>BLACK SUN · 1440x900 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/1440x900/black-sun-1.webp"><img src="../../evidence/w4/before/chromium/1440x900/black-sun-1.webp" width="460" alt="BEFORE BLACK SUN 1440x900 black-sun-1"></a><br><a href="../../evidence/w4/before/chromium/1440x900/black-sun-2.webp"><img src="../../evidence/w4/before/chromium/1440x900/black-sun-2.webp" width="460" alt="BEFORE BLACK SUN 1440x900 black-sun-2"></a><br><a href="../../evidence/w4/before/chromium/1440x900/black-sun-3.webp"><img src="../../evidence/w4/before/chromium/1440x900/black-sun-3.webp" width="460" alt="BEFORE BLACK SUN 1440x900 black-sun-3"></a> | <a href="../../evidence/w4/after/chromium/1440x900/black-sun-1.webp"><img src="../../evidence/w4/after/chromium/1440x900/black-sun-1.webp" width="460" alt="AFTER BLACK SUN 1440x900 black-sun-1"></a><br><a href="../../evidence/w4/after/chromium/1440x900/black-sun-2.webp"><img src="../../evidence/w4/after/chromium/1440x900/black-sun-2.webp" width="460" alt="AFTER BLACK SUN 1440x900 black-sun-2"></a><br><a href="../../evidence/w4/after/chromium/1440x900/black-sun-3.webp"><img src="../../evidence/w4/after/chromium/1440x900/black-sun-3.webp" width="460" alt="AFTER BLACK SUN 1440x900 black-sun-3"></a> |

</details>

<details>
<summary>BLACK SUN · 390x844 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/390x844/black-sun-1.webp"><img src="../../evidence/w4/before/chromium/390x844/black-sun-1.webp" width="460" alt="BEFORE BLACK SUN 390x844 black-sun-1"></a><br><a href="../../evidence/w4/before/chromium/390x844/black-sun-2.webp"><img src="../../evidence/w4/before/chromium/390x844/black-sun-2.webp" width="460" alt="BEFORE BLACK SUN 390x844 black-sun-2"></a><br><a href="../../evidence/w4/before/chromium/390x844/black-sun-3.webp"><img src="../../evidence/w4/before/chromium/390x844/black-sun-3.webp" width="460" alt="BEFORE BLACK SUN 390x844 black-sun-3"></a><br><a href="../../evidence/w4/before/chromium/390x844/black-sun-4.webp"><img src="../../evidence/w4/before/chromium/390x844/black-sun-4.webp" width="460" alt="BEFORE BLACK SUN 390x844 black-sun-4"></a> | <a href="../../evidence/w4/after/chromium/390x844/black-sun-1.webp"><img src="../../evidence/w4/after/chromium/390x844/black-sun-1.webp" width="460" alt="AFTER BLACK SUN 390x844 black-sun-1"></a><br><a href="../../evidence/w4/after/chromium/390x844/black-sun-2.webp"><img src="../../evidence/w4/after/chromium/390x844/black-sun-2.webp" width="460" alt="AFTER BLACK SUN 390x844 black-sun-2"></a><br><a href="../../evidence/w4/after/chromium/390x844/black-sun-3.webp"><img src="../../evidence/w4/after/chromium/390x844/black-sun-3.webp" width="460" alt="AFTER BLACK SUN 390x844 black-sun-3"></a> |

</details>

<details>
<summary>WHAT REMAINS · 1440x900 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/1440x900/what-remains-1.webp"><img src="../../evidence/w4/before/chromium/1440x900/what-remains-1.webp" width="460" alt="BEFORE WHAT REMAINS 1440x900 what-remains-1"></a><br><a href="../../evidence/w4/before/chromium/1440x900/what-remains-2.webp"><img src="../../evidence/w4/before/chromium/1440x900/what-remains-2.webp" width="460" alt="BEFORE WHAT REMAINS 1440x900 what-remains-2"></a><br><a href="../../evidence/w4/before/chromium/1440x900/what-remains-3.webp"><img src="../../evidence/w4/before/chromium/1440x900/what-remains-3.webp" width="460" alt="BEFORE WHAT REMAINS 1440x900 what-remains-3"></a> | <a href="../../evidence/w4/after/chromium/1440x900/what-remains-1.webp"><img src="../../evidence/w4/after/chromium/1440x900/what-remains-1.webp" width="460" alt="AFTER WHAT REMAINS 1440x900 what-remains-1"></a><br><a href="../../evidence/w4/after/chromium/1440x900/what-remains-2.webp"><img src="../../evidence/w4/after/chromium/1440x900/what-remains-2.webp" width="460" alt="AFTER WHAT REMAINS 1440x900 what-remains-2"></a> |

</details>

<details>
<summary>WHAT REMAINS · 390x844 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/390x844/what-remains-1.webp"><img src="../../evidence/w4/before/chromium/390x844/what-remains-1.webp" width="460" alt="BEFORE WHAT REMAINS 390x844 what-remains-1"></a><br><a href="../../evidence/w4/before/chromium/390x844/what-remains-2.webp"><img src="../../evidence/w4/before/chromium/390x844/what-remains-2.webp" width="460" alt="BEFORE WHAT REMAINS 390x844 what-remains-2"></a><br><a href="../../evidence/w4/before/chromium/390x844/what-remains-3.webp"><img src="../../evidence/w4/before/chromium/390x844/what-remains-3.webp" width="460" alt="BEFORE WHAT REMAINS 390x844 what-remains-3"></a><br><a href="../../evidence/w4/before/chromium/390x844/what-remains-4.webp"><img src="../../evidence/w4/before/chromium/390x844/what-remains-4.webp" width="460" alt="BEFORE WHAT REMAINS 390x844 what-remains-4"></a><br><a href="../../evidence/w4/before/chromium/390x844/what-remains-5.webp"><img src="../../evidence/w4/before/chromium/390x844/what-remains-5.webp" width="460" alt="BEFORE WHAT REMAINS 390x844 what-remains-5"></a> | <a href="../../evidence/w4/after/chromium/390x844/what-remains-1.webp"><img src="../../evidence/w4/after/chromium/390x844/what-remains-1.webp" width="460" alt="AFTER WHAT REMAINS 390x844 what-remains-1"></a><br><a href="../../evidence/w4/after/chromium/390x844/what-remains-2.webp"><img src="../../evidence/w4/after/chromium/390x844/what-remains-2.webp" width="460" alt="AFTER WHAT REMAINS 390x844 what-remains-2"></a><br><a href="../../evidence/w4/after/chromium/390x844/what-remains-3.webp"><img src="../../evidence/w4/after/chromium/390x844/what-remains-3.webp" width="460" alt="AFTER WHAT REMAINS 390x844 what-remains-3"></a> |

</details>

<details>
<summary>WORK 02 · 1440x900 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/1440x900/work-02-closed.webp"><img src="../../evidence/w4/before/chromium/1440x900/work-02-closed.webp" width="460" alt="BEFORE WORK 02 1440x900 work-02-closed"></a> | <a href="../../evidence/w4/after/chromium/1440x900/work-02-closed.webp"><img src="../../evidence/w4/after/chromium/1440x900/work-02-closed.webp" width="460" alt="AFTER WORK 02 1440x900 work-02-closed"></a><br><a href="../../evidence/w4/after/chromium/1440x900/work-02-open.webp"><img src="../../evidence/w4/after/chromium/1440x900/work-02-open.webp" width="460" alt="AFTER WORK 02 1440x900 work-02-open"></a><br><a href="../../evidence/w4/after/chromium/1440x900/work-02-context-1.webp"><img src="../../evidence/w4/after/chromium/1440x900/work-02-context-1.webp" width="460" alt="AFTER WORK 02 1440x900 work-02-context-1"></a> |

</details>

<details>
<summary>WORK 02 · 390x844 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/390x844/work-02-closed.webp"><img src="../../evidence/w4/before/chromium/390x844/work-02-closed.webp" width="460" alt="BEFORE WORK 02 390x844 work-02-closed"></a><br><a href="../../evidence/w4/before/chromium/390x844/work-02-closed-2.webp"><img src="../../evidence/w4/before/chromium/390x844/work-02-closed-2.webp" width="460" alt="BEFORE WORK 02 390x844 work-02-closed-2"></a><br><a href="../../evidence/w4/before/chromium/390x844/work-02-case.webp"><img src="../../evidence/w4/before/chromium/390x844/work-02-case.webp" width="460" alt="BEFORE WORK 02 390x844 work-02-case"></a> | <a href="../../evidence/w4/after/chromium/390x844/work-02-closed.webp"><img src="../../evidence/w4/after/chromium/390x844/work-02-closed.webp" width="460" alt="AFTER WORK 02 390x844 work-02-closed"></a><br><a href="../../evidence/w4/after/chromium/390x844/work-02-closed-2.webp"><img src="../../evidence/w4/after/chromium/390x844/work-02-closed-2.webp" width="460" alt="AFTER WORK 02 390x844 work-02-closed-2"></a><br><a href="../../evidence/w4/after/chromium/390x844/work-02-open.webp"><img src="../../evidence/w4/after/chromium/390x844/work-02-open.webp" width="460" alt="AFTER WORK 02 390x844 work-02-open"></a><br><a href="../../evidence/w4/after/chromium/390x844/work-02-context-1.webp"><img src="../../evidence/w4/after/chromium/390x844/work-02-context-1.webp" width="460" alt="AFTER WORK 02 390x844 work-02-context-1"></a><br><a href="../../evidence/w4/after/chromium/390x844/work-02-context-2.webp"><img src="../../evidence/w4/after/chromium/390x844/work-02-context-2.webp" width="460" alt="AFTER WORK 02 390x844 work-02-context-2"></a> |

</details>

<details>
<summary>WORK 03 · 1440x900 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/1440x900/work-03-closed.webp"><img src="../../evidence/w4/before/chromium/1440x900/work-03-closed.webp" width="460" alt="BEFORE WORK 03 1440x900 work-03-closed"></a> | <a href="../../evidence/w4/after/chromium/1440x900/work-03-closed.webp"><img src="../../evidence/w4/after/chromium/1440x900/work-03-closed.webp" width="460" alt="AFTER WORK 03 1440x900 work-03-closed"></a><br><a href="../../evidence/w4/after/chromium/1440x900/work-03-open.webp"><img src="../../evidence/w4/after/chromium/1440x900/work-03-open.webp" width="460" alt="AFTER WORK 03 1440x900 work-03-open"></a><br><a href="../../evidence/w4/after/chromium/1440x900/work-03-context-1.webp"><img src="../../evidence/w4/after/chromium/1440x900/work-03-context-1.webp" width="460" alt="AFTER WORK 03 1440x900 work-03-context-1"></a> |

</details>

<details>
<summary>WORK 03 · 390x844 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/390x844/work-03-closed.webp"><img src="../../evidence/w4/before/chromium/390x844/work-03-closed.webp" width="460" alt="BEFORE WORK 03 390x844 work-03-closed"></a><br><a href="../../evidence/w4/before/chromium/390x844/work-03-closed-2.webp"><img src="../../evidence/w4/before/chromium/390x844/work-03-closed-2.webp" width="460" alt="BEFORE WORK 03 390x844 work-03-closed-2"></a><br><a href="../../evidence/w4/before/chromium/390x844/work-03-case.webp"><img src="../../evidence/w4/before/chromium/390x844/work-03-case.webp" width="460" alt="BEFORE WORK 03 390x844 work-03-case"></a> | <a href="../../evidence/w4/after/chromium/390x844/work-03-closed.webp"><img src="../../evidence/w4/after/chromium/390x844/work-03-closed.webp" width="460" alt="AFTER WORK 03 390x844 work-03-closed"></a><br><a href="../../evidence/w4/after/chromium/390x844/work-03-closed-2.webp"><img src="../../evidence/w4/after/chromium/390x844/work-03-closed-2.webp" width="460" alt="AFTER WORK 03 390x844 work-03-closed-2"></a><br><a href="../../evidence/w4/after/chromium/390x844/work-03-open.webp"><img src="../../evidence/w4/after/chromium/390x844/work-03-open.webp" width="460" alt="AFTER WORK 03 390x844 work-03-open"></a><br><a href="../../evidence/w4/after/chromium/390x844/work-03-context-1.webp"><img src="../../evidence/w4/after/chromium/390x844/work-03-context-1.webp" width="460" alt="AFTER WORK 03 390x844 work-03-context-1"></a> |

</details>

<details>
<summary>WORK 05 · 1440x900 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/1440x900/work-05-closed.webp"><img src="../../evidence/w4/before/chromium/1440x900/work-05-closed.webp" width="460" alt="BEFORE WORK 05 1440x900 work-05-closed"></a> | <a href="../../evidence/w4/after/chromium/1440x900/work-05-closed.webp"><img src="../../evidence/w4/after/chromium/1440x900/work-05-closed.webp" width="460" alt="AFTER WORK 05 1440x900 work-05-closed"></a><br><a href="../../evidence/w4/after/chromium/1440x900/work-05-open.webp"><img src="../../evidence/w4/after/chromium/1440x900/work-05-open.webp" width="460" alt="AFTER WORK 05 1440x900 work-05-open"></a><br><a href="../../evidence/w4/after/chromium/1440x900/work-05-context-1.webp"><img src="../../evidence/w4/after/chromium/1440x900/work-05-context-1.webp" width="460" alt="AFTER WORK 05 1440x900 work-05-context-1"></a> |

</details>

<details>
<summary>WORK 05 · 390x844 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/390x844/work-05-closed.webp"><img src="../../evidence/w4/before/chromium/390x844/work-05-closed.webp" width="460" alt="BEFORE WORK 05 390x844 work-05-closed"></a><br><a href="../../evidence/w4/before/chromium/390x844/work-05-closed-2.webp"><img src="../../evidence/w4/before/chromium/390x844/work-05-closed-2.webp" width="460" alt="BEFORE WORK 05 390x844 work-05-closed-2"></a><br><a href="../../evidence/w4/before/chromium/390x844/work-05-case.webp"><img src="../../evidence/w4/before/chromium/390x844/work-05-case.webp" width="460" alt="BEFORE WORK 05 390x844 work-05-case"></a> | <a href="../../evidence/w4/after/chromium/390x844/work-05-closed.webp"><img src="../../evidence/w4/after/chromium/390x844/work-05-closed.webp" width="460" alt="AFTER WORK 05 390x844 work-05-closed"></a><br><a href="../../evidence/w4/after/chromium/390x844/work-05-closed-2.webp"><img src="../../evidence/w4/after/chromium/390x844/work-05-closed-2.webp" width="460" alt="AFTER WORK 05 390x844 work-05-closed-2"></a><br><a href="../../evidence/w4/after/chromium/390x844/work-05-open.webp"><img src="../../evidence/w4/after/chromium/390x844/work-05-open.webp" width="460" alt="AFTER WORK 05 390x844 work-05-open"></a><br><a href="../../evidence/w4/after/chromium/390x844/work-05-context-1.webp"><img src="../../evidence/w4/after/chromium/390x844/work-05-context-1.webp" width="460" alt="AFTER WORK 05 390x844 work-05-context-1"></a> |

</details>

<details>
<summary>FACTIONS · 1440x900 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/1440x900/factions-1.webp"><img src="../../evidence/w4/before/chromium/1440x900/factions-1.webp" width="460" alt="BEFORE FACTIONS 1440x900 factions-1"></a><br><a href="../../evidence/w4/before/chromium/1440x900/factions-2.webp"><img src="../../evidence/w4/before/chromium/1440x900/factions-2.webp" width="460" alt="BEFORE FACTIONS 1440x900 factions-2"></a> | <a href="../../evidence/w4/after/chromium/1440x900/factions-1.webp"><img src="../../evidence/w4/after/chromium/1440x900/factions-1.webp" width="460" alt="AFTER FACTIONS 1440x900 factions-1"></a><br><a href="../../evidence/w4/after/chromium/1440x900/factions-2.webp"><img src="../../evidence/w4/after/chromium/1440x900/factions-2.webp" width="460" alt="AFTER FACTIONS 1440x900 factions-2"></a> |

</details>

<details>
<summary>FACTIONS · 390x844 · полные BEFORE / AFTER</summary>

| BEFORE · 6b082e5 | AFTER · b85fbb0 |
| --- | --- |
| <a href="../../evidence/w4/before/chromium/390x844/factions-1.webp"><img src="../../evidence/w4/before/chromium/390x844/factions-1.webp" width="460" alt="BEFORE FACTIONS 390x844 factions-1"></a><br><a href="../../evidence/w4/before/chromium/390x844/factions-2.webp"><img src="../../evidence/w4/before/chromium/390x844/factions-2.webp" width="460" alt="BEFORE FACTIONS 390x844 factions-2"></a><br><a href="../../evidence/w4/before/chromium/390x844/factions-3.webp"><img src="../../evidence/w4/before/chromium/390x844/factions-3.webp" width="460" alt="BEFORE FACTIONS 390x844 factions-3"></a> | <a href="../../evidence/w4/after/chromium/390x844/factions-1.webp"><img src="../../evidence/w4/after/chromium/390x844/factions-1.webp" width="460" alt="AFTER FACTIONS 390x844 factions-1"></a><br><a href="../../evidence/w4/after/chromium/390x844/factions-2.webp"><img src="../../evidence/w4/after/chromium/390x844/factions-2.webp" width="460" alt="AFTER FACTIONS 390x844 factions-2"></a><br><a href="../../evidence/w4/after/chromium/390x844/factions-3.webp"><img src="../../evidence/w4/after/chromium/390x844/factions-3.webp" width="460" alt="AFTER FACTIONS 390x844 factions-3"></a> |

</details>

## Preservation / recovery

Original Four Surfaces/fragment cards сохранены в exact BEFORE Git и кадрах; все187 baseline assets остаются на месте. `#world`, `#chars`, map/OMEGA/AXIOM∅ и внешние III/IV labels сохранены целиком. Их source/behavior/computed-style checks отделены от визуальной оценки.

W3.C screenshots из прежнего отчёта остаются историческим W3.C AFTER; эта серия создана отдельно и не выдаёт их за новую съёмку. Retained review evidence хранится в Git; временные run bundles ограничены последними3/14днями, profiles/videos/traces не сохраняются. Reproduction tooling: [README](../../evidence/w4/tools/README.md).
