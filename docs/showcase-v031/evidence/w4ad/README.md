<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4AD.EVIDENCE
  title: "W4.AD — evidence index (A+ vs A+AD art-direction prototype)"
  status: PROTOTYPE_EVIDENCE / NOT_R3 / NOT_ARTISTIC_PASS
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# W4.AD evidence

Решение и контекст — [AD_REVIEW](../../waves/w4ad/AD_REVIEW.md), условия — [PRINCIPAL_AD_REVIEW](../../waves/w4ad/PRINCIPAL_AD_REVIEW.md). Пакет ~3 МиБ; из ассетов только предложенные производные A08 (636 КиБ).

| Файл | Что это |
| --- | --- |
| `preview/build_ad.py` | Детерминированная сборка `ad.html` из замороженного `w4rp/preview/aplus.html` (SHA256 `fb37809d…`); 22 подписанные правки с проверкой однократного попадания; exact-проверки protected-блоков; пишет `source-proof.json` |
| `preview/ad.html` · `ad.css` · `ad.js` | Прототип A+AD.R1 (HTML SHA256 `699cc4ae…`; точные хэши — `source-proof.json`). `ad.js` — только прогрессивные кнопки лент; без JS всё доступно |
| `preview/build_a08.py` · `preview/proposed-assets/` | Производные A08 из PNG-оригинала Visual Library (941×1672, SHA256 `736a2df3…` = манифест): AVIF/WebP 480/720/941w + `derivatives.json` (PSNR, сохранение резкости). Для R2 переносятся в `assets/` |
| `compare.html` | Страница сравнения A+ → A+AD для ПК и телефона (опубликована приватно: https://claude.ai/artifact/REi9LvzkgmXBga9hRtu7xw); открывает те же `captures/` |
| `preview/serve.cjs` | Loopback-сервер: `/aplus/` и `/ad/`; ассеты — `git show b85fbb0a:`, `/ad/proposed/` — производные A08 |
| `preview/capture.cjs` | Высоты секций в 4 viewport × 2 версии; обзорные кропы 1440/390/360; кадры каждой карточки лент на 390 |
| `preview/probe.cjs` | no-JS / клавиатура (JS и без JS) / touch-свайп / ленты / RM / кадрирование A08 / scoped axe |
| `heights-and-crops.json` | Все замеры, состояния, хэши кропов |
| `probe-validation.json` | 39/39 PASS, axe-результаты обеих версий |
| `qualification/probe-first-attempt.json` · `probe-r1-gesture-and-natural-width.json` | Прогоны с ошибками harness (20/21; 30/39 — `synthesizeScrollGesture` без эффекта, `naturalWidth` при `srcset`) — сохранены |
| `captures/*.webp` | 41 нативный клип DPR 1, WebP q80: doctrine, traces, aftermath, surfaces, world-head, world-intro, chars-head (1440/390), doctrine и aftermath на 360, по кадру на каждую карточку лент A+AD на 390 |

## Воспроизведение

```bash
cd docs/showcase-v031/evidence/w4ad/preview
python3 -I build_a08.py /path/to/AXIOM_SHOWCASE_VISUAL_LIBRARY_V1.zip   # производные A08 (только при смене оригинала)
python3 build_ad.py                       # пересобрать ad.html + source-proof.json
node serve.cjs                            # http://127.0.0.1:<port>/aplus/ и /ad/
NODE_PATH=/home/axiom/ENDEAVOR/AXS/apps/axiom-web-core-ui/node_modules node capture.cjs <fresh-dir> --shots
NODE_PATH=/home/axiom/ENDEAVOR/AXS/apps/axiom-web-core-ui/node_modules node probe.cjs <out.json>
```

Перед повторной съёмкой — host guard из глобального протокола. Выходной каталог capture — свежий, вне репозитория; сырые PNG в репозиторий не попадают.

Ограничения: Chromium (Playwright UI toolchain), DPR 1, `reducedMotion: reduce`, флаг возвращающегося посетителя, gallery 01, map 02.01. В кропах после замеров скрыты фиксированные nav/ticker/курсор/индикатор прокрутки. Кадры лент сняты без `fullPage` (в окне 390×1500), потому что `fullPage` сдвигает snap-ленты. Других изменений стилей нет. Это не R3/G4, не performance и не художественный PASS.
