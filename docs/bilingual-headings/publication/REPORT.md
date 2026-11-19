<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.BILINGUAL_HEADINGS.PUBLIC_RELEASE_REPORT
  title: "PR15 + PR16 — Pages publication evidence"
  status: CLOSED / PUBLIC_VERIFIED
  deployment: GITHUB_PAGES_SUCCEEDED
  mode: Release Evidence
  goal: "Различить принятый code, merge, deployment и фактический public runtime"
  scope: Authorized publication of PR15 typography and PR16 loader
  lang: ru
  last_updated: 2026-11-15
  editable_by_agents: true
  change_policy: "Исторические измерения не переписывать; новые проверки привязывать к exact SHA"
-->
# PR15 / PR16 — публичная публикация проверена

CREATOR визуально принял результат и разрешил merge 2026-11-15:
«визульный момент одобряю. можно вливать». Позднейшее «Можно продолжать»
подтвердило продолжение проверки и closure. Предыдущий MERGE HOLD снят.

| Объект | Exact ref / факт |
| --- | --- |
| Baseline | `adb87e5b8c8ba778aedfddd0655ec0b957e045ef` |
| Approved PR15 head | `77df187c5428d15d240d2877182ff65cc729b96c` |
| Approved PR16 head | `22240f4384b9082c7d7438bd41bc5bc3ee41e05f` |
| PR15 merge | `a493da6fe6f7ed47c2703c7dde9d4c71c2bca21d` |
| PR16 merge / published main | `bfdc1911a59efd46cb6230eb207f873a93d87c94` |
| GitHub Pages | [run 43710554890](https://github.com/Endevor-VIK/endevor-vik.github.io/actions/runs/43710554890), SUCCESS, 2026-11-15T11:47:33Z |
| Public site | [endevor-vik.github.io](https://endevor-vik.github.io/) |

Оба PR переведены из Draft и объединены merge commits с expected head SHA.
Build, report-build-status и deploy jobs завершились SUCCESS для итогового main.
[Raw deployment trace](deployment.json) сохраняет head, jobs и время.

## Независимый HTTP

[http.json](http.json): 6/6 HTTP 200, byte-identical к exact final Git source:
`index.html`, `loader.html`, `bilingual-headings.css`, `language-motion.js`,
`i18n.js`, `catalogs.js`. Запросы к публичному хосту имеют release query, данные
не заменялись локальными файлами. Сохранены SHA-256, ETag/Last-Modified и Date.
В main HTML **37** `data-heading-mode="bilingual"`, CSS и motion script подключены.

## Чистые публичные браузерные сессии

Chromium **149.0.7827.55**, Firefox **151.0**, существующий Playwright 1.61.1.
Изолированный checkout exact final main; публичный HTTPS через существующий
host proxy, без local server, route interception или source substitution.
Каждый case создаёт новый context. Только heading checks заранее помечают intro
просмотренным через sessionStorage; loader проверяется отдельно с реальным intro.

| Проверка | Результат | Raw evidence |
| --- | --- | --- |
| Canonical semantics: 37 pairs, RU → ENG | 2/2 PASS | [headings.json](headings.json) |
| BLACK SUN: RU/ENG × 390/1440 × 2 engines | 8/8 PASS | [headings.json](headings.json) |
| Text-only motion 260 ms + subtitle stagger 60 ms | 2/2 PASS | [headings.json](headings.json) |
| Loader: RU/ENG × 4 viewports × 2 engines | 16/16 PASS | [loader.json](loader.json) |
| Loader Escape / Enter / Space × 2 engines | 6/6 PASS | [loader.json](loader.json) |
| Settled public art: RU390 / ENG1440 | 2/2 PASS | [settled-visual.json](settled-visual.json) |

**34/34 browser assertions PASS**, 0 FAIL / NOT_RUN, плюс две отдельные проверки
загрузки/decode публичной иллюстрации. Historical 440 primary checks и прежние
loader 64+8 — отдельное feature evidence, здесь они не заявляются повторёнными.

BLACK SUN headline остаётся `WHEN HOPE BECAME A THREAT.` / `lang=en` в обеих
локалях. Русский subtitle присутствует ровно один раз в RU, в ENG hidden /
display none / height 0; повторов среди body paragraphs нет. Реальный viewport
pointer click сохраняет scrollY; event traces сохранены. Chromium измерил
filtered CLS 0 для text transition; Firefox не предоставляет Layout Instability
API — это ограничение измерения, не выдуманный ноль.

Loader проверен на 320×568, 390×844, 844×390 и 1440×900, reduced motion.
Glyph bounds, HUD/hex/control intersections и hit targets проходят. Переключение
локали не восстанавливает overlap. Escape/Enter/Space переходят в публичный root
и записывают существующий seen marker. Normal motion уже проверен до merge;
в этой public loader matrix он не повторён.

Первые четыре BLACK SUN PNG фиксируют мгновение после scroll jump, до завершения
lazy art load; они сохранены без подмены. Дополнительно дождались real image
complete/naturalWidth/decode и сняли [RU mobile](settled-ru-390-black-sun.png) и
[ENG desktop](settled-en-1440-black-sun.png). Эти два кадра показывают загруженную
иллюстрацию. [Mobile loader RU](after-chromium-ru-390.png),
[ENG](after-chromium-en-390.png). Визуально просмотрены public RU/ENG BLACK SUN
и RU loader captures; это наблюдение агента, CREATOR acceptance записана отдельно.

## Воспроизведение

Из checkout exact `bfdc191` с файлами этого evidence branch:

```bash
python3 docs/bilingual-headings/publication/verify_public.py http --out /tmp/axiom-public-http.json
python3 docs/bilingual-headings/publication/verify_public.py headings --out /tmp/axiom-showcase-public-headings
python3 docs/bilingual-headings/publication/verify_public.py loader --out /tmp/axiom-showcase-public-loader
NODE_PATH=/home/axiom/ENDEAVOR/AXS/apps/axiom-web-core-ui/node_modules node docs/bilingual-headings/publication/settled_visual.cjs
```

Adapter использует неизменные assertions из frozen source harness; единственные
изменения его temporary copy — public base URL, cache-busting и proxy launch.
Исходный и adapted script hash записаны в browser JSON. Temporary adapter удаляется
автоматически; никаких packages/browser downloads. Browser output retention:
last 3 runs / 14 days, 96/32 MiB caps; fixed settled captures 8 MiB ceiling.
Отобранное evidence намеренно хранится в Git; собственные `/tmp` runs после
копирования удалены, browser contexts/processes закрыты.

## Границы и итог

Release closure / актуальный handoff сохранены в отдельной ветке
`docs/showcase-publication-20261115`; её delta к published main — docs/evidence only.
Это не дополнительное product изменение и не ещё один deployment. PR descriptions
ссылаются на этот remote recovery record; premerge snapshots в frozen main
сохраняют свою историческую дату, актуальный статус дан здесь.

Canon, версии, root HEAD `c05d0964daa6f542fa71dc5d3712db7bae99d964` и root index
gitlink `babbaa37baf4a13ea0546f19cc00d4f95b2d23f5` не изменялись. Foreign root
delta сохранена; основной product checkout не использован для QA.
`assets/status/gate.json` проверен: notice TTL истёк 2026-10-31; по существующему
контракту expired notice скрыт. Provider availability не заявляется; gate state
этой типографической публикацией не обновлялся.

Safari/WebKit, real devices/GPU, manual screen reader, fresh Lighthouse/field CWV
в этой публикации **NOT RUN**. Полная AAA acceptance не заявляется.

**PR CODE VERIFIED = YES · MAIN MERGED = YES · LIVE VERIFIED = YES.**
Pending work в разрешённом scope публикации отсутствует.
