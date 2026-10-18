<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.SHOWCASE_V031.EVIDENCE.W3A
  title: "AXIOM SHOWCASE — W3.A evidence manifest (prototypes, tools, measurements)"
  status: EVIDENCE / APPEND-ONLY
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-19
  editable_by_agents: true
-->
# W3.A — evidence manifest

Только доказательства (прототипы takeover 2026-10-18 и QA реализации W3.A 2026-10-19). Файлы этой папки **не подключены к сайту** и не являются его модулями. Прототипы хранятся как `.css.txt`, чтобы GitHub Pages не отдавал их как стили.

## 1. Прототипы A/B (решение CREATOR 2026-10-19: выбран B)

| Что | Происхождение |
| --- | --- |
| `prototypes/variant-a.prototype.css.txt`, `variant-b.prototype.css.txt`, `variant-a-golos.prototype.css.txt` | CSS-оверрайды агента (takeover 2026-10-18), внедрялись через `page.addStyleTag` в неизменяемый снимок `git archive 30b5be78` (код сайта = `7b25ded0` = код сайта `main c430017b`). В продукт не входили |
| `prototypes/*-report.json` | Вывод `tools/prototype_measure.cjs`: Chromium (Playwright 1.56.1), 11 вьюпортов W3.0, геометрия первого экрана, попадание плавающей метки на текст и контролы при посадке на 17 секций, ошибки консоли, переполнение. `a-z`/`b-z` — повтор 960×540 после правки для 200 % zoom. `a-golos` — образец лида в Golos (отклонён, F-04) |
| `prototype-sheets/*.webp` | Листы BASE / A / B, которые видел CREATOR (перекодированы из JPEG в WebP q80; пиксели — те же кадры Playwright) |

**Ограничение:** прототип B — эскиз решения. Продуктовая реализация W3.A (см. `../../waves/W3A_REPORT.md`) сделана заново в разметке и каскаде сайта, без копирования оверрайдов; где поведение отличается от прототипа, это записано в отчёте.

## 2. Инструменты

| Файл | Что делает | Происхождение |
| --- | --- | --- |
| `tools/serve.cjs` | Статический сервер снимка, 404-фолбэк как Pages | написан агентом, takeover |
| `tools/prototype_measure.cjs` | Геометрия первого экрана и коллизии метки (прототипная версия) | написан агентом, takeover |
| `tools/prototype_microtype.cjs` | Инвентарь текста мельче порога в зоне W3.A | написан агентом, takeover |

Инструменты W3.0 (`w3-audit`, `w3-preserve`, `pink-metric` и др.) лежат в AXS `sandbox/evidence/…` и в этом репозитории **недоступны**; здесь не воссоздавались под их именами.

## 3. QA реализации W3.A (точный SHA `e9ac3eb` против `c430017b`)

| Файл | Что | Инструмент |
| --- | --- | --- |
| `qa/measure-{before,after}.json` | 11 вьюпортов: хром, бровь, заголовок, лид, ENTER, подпись статуса, рельс, подпись CREATOR, радар, рамка постера, SIGNAL TRACE, длина страницы, переполнение, ошибки консоли; метка поверх текста на 17 посадках; bridge и `aria-current` после клика по меню / swipe-nav | `tools/w3a_measure.cjs` |
| `qa/preserve-{before,after}.json` | порядок 17 секций, sha256 видимого текста по секциям, Canon ID, шрифты, токены, изображения, no-JS | `tools/w3a_preserve.cjs` (своя реализация по описанию `w3-preserve` из W3.0; исходник W3.0 недоступен) |
| `qa/type-{before,after}.json` | смысловой текст < 12 px, проза < 14 px на телефоне, трекинг > .2em в зоне W3.A (360/390/1024/1440) | `tools/w3a_type.cjs` |
| `qa/contrast-{before,after}.json` | контраст текста HERO к фону под глифами (P95), 3 кадра анимации радара, 360/390/430 | `tools/w3a_contrast.cjs` + `tools/w3a_contrast.py` |
| `qa/axe-{before,after}.json` | axe-core 4.12.1, 390 и 1440 | `tools/axe-run.cjs` |
| `qa/regression-{before,after}.{log,json}` | `tests/browser/showcase_regression.cjs`, Chromium | репозиторий |
| `qa/lighthouse-summary.txt`, `qa/lighthouse-runs-round1-5452b03.json`, `qa/lighthouse-runs-round2-e9ac3eb.json` | Lighthouse 12.8.2, по 5 прогонов через один BEFORE/AFTER, mobile (по умолчанию) и desktop (`--preset=desktop`); раунд 1 — до удержания радара, раунд 2 — QA SHA | `tools/lh-run.sh`, `tools/lh-summary.py` |
| `qa/lighthouse-control-radar-off.json` | контроль 3 + 3 (mobile): `5452b03` против той же сборки с выключенными анимациями радара на телефоне | вручную, тот же Lighthouse |

Сервер обоих билдов: `tools/serve-pages.cjs` (gzip, `max-age=600`, 404-фолбэк), неизменяемые снимки `git archive`. Кадры для отчёта: `../../captures/w3a/` (`tools/w3a_sections.cjs` для секций).

## 4. SHA-256

```text
837bfd65495d25285bb585e63c70edf34463581ac4eae3bb4cf163fdc44457eb  ./prototype-sheets/sheet-1024x768_1.webp
61e52c1f154a5df6fc6804a78df9522a70c22e5d15f560a7f1f712f6b49b8177  ./prototype-sheets/sheet-1280x800_1.webp
477c36b445f7e56b7a0956e29c9ee3f89f61254c6b81571f7a6b90868c2dd155  ./prototype-sheets/sheet-1440x900_1.webp
b740390266bf34e219ddb29282c2a95600b0aed253f8477a652180f9d9fa97a9  ./prototype-sheets/sheet-1920x1080_1.webp
8edd40e1c4e1116934dc376e8d3ed4b5991dfb5f8ad2e8018a85012808c05777  ./prototype-sheets/sheet-360x800_2.webp
f117f88d3423787e0f09c2463657ca606aaa7090c55da1d18dee5c9ea7eb5066  ./prototype-sheets/sheet-390x844_3.webp
0641215fb0537d362a7d5a570156e6d4b6b5ef3662d6ff21a6d63fb68293a0b3  ./prototype-sheets/sheet-430x932_3.webp
5abef7e8009f9abdc7772552b058ce42c5e037be7c4bade3922359317443f387  ./prototype-sheets/sheet-768x1024_2.webp
26c3b12784be8451b72d94041d55084a95b382041e51ea07b53ad27a4018b634  ./prototype-sheets/sheet-844x390_3.webp
e13a358fbdbd47663c30c563135c562128ec996c6b02828bfe6b0afb570a29b3  ./prototype-sheets/sheet-960x540_2.webp
8dfec9992f684a2af7cea7a9eab569e5bd9d72de52160c06c5c31bd3aa19e136  ./prototype-sheets/sheet-lede-type.webp
76a7c5a62c94a792ae4e4cfa9838df85294c485f7fe2c5d51b698411279e7ebd  ./prototypes/a-golos-report.json
792a2d3cc25ac655723d2993ce0eb7443131f9bee15a62e22fec347dbe5e6e7c  ./prototypes/a-report.json
9e52a1de0bfaf0e86ab97e4ff24083140bb919f1c6fb346f2c92d7aac8fed962  ./prototypes/a-z-report.json
4b3f38df22d4d579428cac311f2e1cb3faebef0376de21e08a61e9926786062b  ./prototypes/b-report.json
9ee89fe6afd83eb8099025625c43d2c3d0dbc5e172202e3cef07e5c33731ac92  ./prototypes/b-z-report.json
a0abb48cd8c35c176b7efa2d57bed0841b85a8bcd8d1369d17224101a1638d82  ./prototypes/base-report.json
fc668ec099bd4dddcabde90e5c9718914948ceddd7203215b69e0e3e47bd7aaa  ./prototypes/variant-a-golos.prototype.css.txt
58f56f52f2a8b5d0e8825fc4eea5e4ca01fa383327283c14ed4a22163128cd8c  ./prototypes/variant-a.prototype.css.txt
b23754d439daf0c75697b6c2294a0dff76b7c4922bc97cb56c524152101d89b7  ./prototypes/variant-b.prototype.css.txt
0bdfb6c3a164fb792c669e8e19ec227f8a82bf6f26a91e4bbd0ca883a1896432  ./qa/axe-after.json
847b02ede24bbedb57abc05dfcc53fcbd471f0b492a5b055158c357f56471f60  ./qa/axe-before.json
f2496469e9b6403d136fad52758d338b5d4b9e73d4e0e921b2ddc0ec77262e5e  ./qa/contrast-after.json
6bb2adad254a51429f2d485314f11e2f17551a37a2eb51e96e1658149ea250dd  ./qa/contrast-before.json
070306371de670ad61c04841e2cdbfa54bf192ff14094613a71a38ee880b2451  ./qa/lighthouse-control-radar-off.json
b200c7b99d2c8939729ebf1ce66c437c6de543f77cbe7867c12ff0762b927dc7  ./qa/lighthouse-runs-round1-5452b03.json
ba5060a35942c3a7b46ad871c0c68c899f6bd859edfe003d28f23aaaad8510c2  ./qa/lighthouse-runs-round2-e9ac3eb.json
aee3388eb5b0247e5832a499923e0c6656932dd5256c4a0e49d861c9f30eb1d9  ./qa/lighthouse-summary.txt
8000d2a7747f80c60144e12d79371eb48c6255e6ddd6278cbbbd5e1b39e7ce5a  ./qa/measure-after.json
2be75eb8d5e942f176bdd63e569ec03151aa1af1ceadc95fb200642c0900285d  ./qa/measure-before.json
9d4b6924ecef5f0b63ca7e0268d19a902d26fa4de9dcf62dd8a9171053f6b10b  ./qa/preserve-after.json
a5c895c469647bfe686df4263bcf87a573ca2dc2339ae3c69d878c2af99610ea  ./qa/preserve-before.json
3b09c9ebfbd11222a186bcea87b5091737d0aa839a88113baaac330f42969007  ./qa/regression-after.json
d9fb956ed035ffbc1343a48d8b9f2ada841fe96e3a9c4ad77c657e44fbea3705  ./qa/regression-after.log
17ea3715d42b6e68cf8ca7466e2a32d738eba1633cdffee8e8c52d296c893910  ./qa/regression-before.json
c05b7c0f8a5096f34c12ca2c1976100a9a21bce1d30810adb39d26cb3dfd795d  ./qa/regression-before.log
e8281540ff03cc82ec41ad83ad921d532b1f51fa58ebeea9db41038117a18981  ./qa/type-after.json
1f51075f824e3157c6c775acbd54b455ad9f291ecbcf399b136739762c6d88fa  ./qa/type-before.json
c6e836d061841a4448cddf70ea106a02d70c9261060e97f39eae59492d6b675f  ./tools/axe-run.cjs
8fb2e9b5a48b1a0661f277e3f912418e32c815cf256b894123c5e1364a7a3bd1  ./tools/lh-run.sh
ec65a573ee3a5b0417bf83540754fad1e84fa4bdc6615aef41c3a7fbf97eb231  ./tools/lh-summary.py
2bd0e2bef6ceb97c085a6a3792dc44c7df03af8bfed5c307bfc928d27218dcda  ./tools/prototype_measure.cjs
f755a06cee57868f521cdfe17063e8977d3a16b9650ff1be45b9a66bbdbd2e86  ./tools/prototype_microtype.cjs
3b2d03bd9f50e233643b76f1461c7a0f7d2a7de8cd9ee4832a89301c102c53df  ./tools/serve-pages.cjs
5117178ace18b4d23a8e83c90e3bb00e742d80d515a58efecf9ba8e6293597fe  ./tools/serve.cjs
03df0a2ea335d54edbca16d9d8675375b2531deb4ef3f6b613dea1ac870219b6  ./tools/w3a_contrast.cjs
2ae99a00bba69388bf64bd7aa923a89032627ad9ff03c4df11ef4824477537f0  ./tools/w3a_contrast.py
7ffddd427fae4d5bc28eb5376dec9cb4d7e6da50a54160d39da7a81f46b8f42b  ./tools/w3a_measure.cjs
c23fe54e81ac28bdb789f5cb4f11965ac16e683326224cd1de859722079c8dd1  ./tools/w3a_preserve.cjs
cc621d5a63a013e257914638b00d68005c1853224d5a69e742972083f599d86b  ./tools/w3a_sections.cjs
8439cdc21c437d31d778d7bc8ff5b70d2253389b140d09a8eea9f13aec233ab5  ./tools/w3a_type.cjs
```
