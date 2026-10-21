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

Решение и контекст — [AD_REVIEW](../../waves/w4ad/AD_REVIEW.md). Пакет ~1,8 МиБ, без копий ассетов.

| Файл | Что это |
| --- | --- |
| `preview/build_ad.py` | Детерминированная сборка `ad.html` из замороженного `w4rp/preview/aplus.html` (SHA256 `fb37809d…`); 22 подписанные правки с проверкой однократного попадания; exact-проверки protected-блоков; пишет `source-proof.json` |
| `preview/ad.html` · `ad.css` · `ad.js` | Прототип A+AD (SHA256 `4e01dbf0…` · `aac1e7be…` · `40947fd5…`). `ad.js` — только прогрессивные кнопки лент; без JS всё доступно |
| `preview/serve.cjs` | Loopback-сервер: `/aplus/` и `/ad/`; ассеты — `git show b85fbb0a:` |
| `preview/capture.cjs` | Высоты секций в 4 viewport × 2 версии + обзорные кропы 1440/390 |
| `preview/probe.cjs` | no-JS / клавиатура / ленты / RM / scoped axe |
| `heights-and-crops.json` | Все замеры, состояния, хэши кропов |
| `probe-validation.json` | 21/21 PASS, axe-результаты обеих версий |
| `qualification/probe-first-attempt.json` | Первый прогон 20/21 (ошибка harness, исправлена) — сохранён |
| `captures/{aplus,ad}-{1440,390}-*.webp` | 24 нативных клипа DPR 1, WebP q80: doctrine, traces, aftermath, surfaces, world-head, chars-head |

## Воспроизведение

```bash
cd docs/showcase-v031/evidence/w4ad/preview
python3 build_ad.py                       # пересобрать ad.html + source-proof.json
node serve.cjs                            # http://127.0.0.1:<port>/aplus/ и /ad/
NODE_PATH=/home/axiom/ENDEAVOR/AXS/apps/axiom-web-core-ui/node_modules node capture.cjs <fresh-dir> --shots
NODE_PATH=/home/axiom/ENDEAVOR/AXS/apps/axiom-web-core-ui/node_modules node probe.cjs <out.json>
```

Перед повторной съёмкой — host guard из глобального протокола. Выходной каталог capture — свежий, вне репозитория; сырые PNG в репозиторий не попадают.

Ограничения: Chromium (Playwright UI toolchain), DPR 1, `reducedMotion: reduce`, флаг возвращающегося посетителя, gallery 01, map 02.01. В кропах после замеров скрыты фиксированные nav/ticker/курсор/индикатор прокрутки. Других изменений стилей нет. Это не R3/G4, не performance и не художественный PASS.
