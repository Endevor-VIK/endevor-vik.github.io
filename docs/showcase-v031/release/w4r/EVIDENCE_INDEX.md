<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.RELEASE_EVIDENCE_INDEX
  title: "0524.W4.R — evidence index for the clean release"
  lang: ru
  last_updated: 2026-10-22
  editable_by_agents: false
-->
# W4.R — где лежат доказательства

Доказательства W4.R не публикуются на GitHub Pages: в `main` попадают только продукт, тесты и этот индекс. Полный архив — ветка PR #12, закреплённая неизменяемым тегом.

| Объект | Значение |
| --- | --- |
| Тег архива | [`evidence/0524-w4r-pr12`](https://github.com/Endevor-VIK/endevor-vik.github.io/tree/evidence/0524-w4r-pr12) — аннотированный, объект `f17d3eb0a33ca67598726c85cc947f269ba6502e` → коммит `2df1592ee6b4cf92a883f318c7dfc440ad1d63cd` |
| Манифест | [`PR12_EVIDENCE_MANIFEST.sha256`](PR12_EVIDENCE_MANIFEST.sha256): SHA256 всех 2 453 файлов дерева `2df1592` (179 751 777 байт), sha256 самого манифеста `69b109fdf3cb1f29faba6402dd3b5716e026d48aff87d500a9aced6ff6b9e590`. Проверено: `git archive 2df1592` восстанавливает все файлы, 0 расхождений |
| Runtime, прошедший независимый R4 | `685140a40e55f151f9edcf9e7ab0170773ad4f55`. Ветка релиза вне `docs/` равна ему, кроме версии v0.3.1 (3 файла: `index.html` — шапка, тикер, подвал; два теста, следующих за разметкой) |

## Ключевые записи (по тегу)

- [Gate B](https://github.com/Endevor-VIK/endevor-vik.github.io/blob/evidence/0524-w4r-pr12/docs/showcase-v031/waves/w4ad/GATE_B_PACKAGE.md)
- [Независимый R4 — PASS WITH RECORDED LIMITS](https://github.com/Endevor-VIK/endevor-vik.github.io/blob/evidence/0524-w4r-pr12/docs/showcase-v031/evidence/w4r2/r4/R4_INDEPENDENT_REVIEW.md)
- [R3 исполнителя](https://github.com/Endevor-VIK/endevor-vik.github.io/blob/evidence/0524-w4r-pr12/docs/showcase-v031/waves/w4ad/R3_REPORT.md)
- [Бюджеты производительности и результаты](https://github.com/Endevor-VIK/endevor-vik.github.io/blob/evidence/0524-w4r-pr12/docs/showcase-v031/waves/w4ad/R3P_PERF_BUDGETS.md)
- [Отклонения от A+AD (D-01…D-06)](https://github.com/Endevor-VIK/endevor-vik.github.io/blob/evidence/0524-w4r-pr12/docs/showcase-v031/waves/w4ad/OPUS_DECISIONS.md)
- [Трасса Canon](https://github.com/Endevor-VIK/endevor-vik.github.io/blob/evidence/0524-w4r-pr12/docs/showcase-v031/waves/w4ad/R3_CANON_TRACE.md)
- [Утверждение Gate R-A](https://github.com/Endevor-VIK/endevor-vik.github.io/blob/evidence/0524-w4r-pr12/docs/showcase-v031/waves/w4ad/GATE_R_A_AUTHORIZATION.md)

Проверить архив: `git fetch origin tag evidence/0524-w4r-pr12`, затем `git archive evidence/0524-w4r-pr12 | tar -x -C <пустая папка>` и `sha256sum -c` по манифесту (строки `#` пропустить).
