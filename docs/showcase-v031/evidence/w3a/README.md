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

Только доказательства. Файлы этой папки **не подключены к сайту** и не являются его модулями. Прототипы хранятся как `.css.txt`, чтобы GitHub Pages не отдавал их как стили.

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

## 3. SHA-256
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
2bd0e2bef6ceb97c085a6a3792dc44c7df03af8bfed5c307bfc928d27218dcda  ./tools/prototype_measure.cjs
f755a06cee57868f521cdfe17063e8977d3a16b9650ff1be45b9a66bbdbd2e86  ./tools/prototype_microtype.cjs
5117178ace18b4d23a8e83c90e3bb00e742d80d515a58efecf9ba8e6293597fe  ./tools/serve.cjs
```
