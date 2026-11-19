<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.BILINGUAL_HEADINGS.PUBLICATION_HANDOFF
  title: "PR15 — code, preview, main and public deployment boundaries"
  status: CLOSED / PUBLIC_VERIFIED
  deployment: GITHUB_PAGES_SUCCEEDED
  mode: Publication Handoff
  goal: "Зафиксировать разрешённые merge, Pages deployment и фактическую public verification"
  scope: PR15 typography and independent PR16 loader correction
  lang: ru
  last_updated: 2026-11-15
  editable_by_agents: true
  change_policy: "Новые публикации требуют собственной authority; snapshot проверять по Git и deployment"
-->
# Публикация PR15 / PR16 — 2026-11-15

CREATOR принял визуальный результат и разрешил merge: «визульный момент одобряю.
можно вливать». Прежний MERGE HOLD снят этой текущей инструкцией.

| Состояние | Факт / evidence |
| --- | --- |
| PR CODE VERIFIED | YES; approved heads PR15 `77df187c5428d15d240d2877182ff65cc729b96c`, PR16 `22240f4384b9082c7d7438bd41bc5bc3ee41e05f` |
| CREATOR VISUAL ACCEPTANCE | YES; 2026-11-15, текущее сообщение CREATOR |
| MAIN MERGED | YES; PR15 → `a493da6fe6f7ed47c2703c7dde9d4c71c2bca21d`; PR16 → `bfdc1911a59efd46cb6230eb207f873a93d87c94` |
| GITHUB PAGES | SUCCESS; [run 43710554890](https://github.com/Endevor-VIK/endevor-vik.github.io/actions/runs/43710554890), terminal success 2026-11-15T11:47:33Z, final main `bfdc191` |
| LIVE VERIFIED | YES; independent public HTTP 6/6 exact byte matches; 37 main bilingual headings; 12 typography/motion + 22 loader browser checks PASS |

[Живой сайт](https://endevor-vik.github.io/) · [Release report](publication/REPORT.md) ·
[Deployment trace](publication/deployment.json) · [HTTP](publication/http.json) ·
[Public headings](publication/headings.json) · [Public loader](publication/loader.json).

Проверки выполнены на public host в чистых Chromium/Firefox contexts, без
локального server/interception/source substitution. BLACK SUN — EN canonical
headline в обеих локалях; русский subtitle только RU; ENG скрывает его без места.
Переключение сохраняет scroll. Loader проверен ENG/RU, 320×568, 390×844,
844×390 и 1440×900; controls доступны, Escape/Enter/Space завершают intro.

Release evidence и актуальный handoff сохраняются отдельно в
`docs/showcase-publication-20261115`; продуктовый main после двух merge не менялся.
Canon, версии и root index gitlink сохранены. Safari/WebKit, real devices/GPU,
manual screen reader, fresh Lighthouse/field CWV в этой публикации NOT RUN.

## Исторический snapshot до разрешения merge

Всё ниже описывает этап preview до текущего разрешения CREATOR. Его NO/HOLD
не являются актуальным состоянием; текущий результат указан выше.



Основание: текущее поручение CREATOR и [Principal comment](https://github.com/Endevor-VIK/endevor-vik.github.io/pull/15#issuecomment-6892798010).
Причина старой типографики подтверждена по exact Git refs: PR15 не объединён.
Это не повод переписывать реализованные headlines или выдавать branch screenshots
за опубликованный main. Визуальный PASS из review относится к sampled feature screenshots.

| Состояние | Факт / SHA | Evidence |
| --- | --- | --- |
| PR CODE VERIFIED | YES; reviewed PR head `6887f74`, runtime `ae3dc2d`; последующие commits только tests/docs | [first paint 10/10](review-publication/first-paint.json), [BLACK SUN 8/8](review-publication/black-sun-pointer.json) |
| PRIVATE REVIEW STAND | SUCCEEDED, 2026-11-15 10:43:59 UTC (13:43:59 MSK) | [Native deployment trace](review-publication/preview.json) |
| MAIN MERGED | NO; GitHub main остаётся `adb87e5b8c8ba778aedfddd0655ec0b957e045ef` | fresh ls-remote / PR metadata |
| LIVE VERIFIED | NO; новая typography не публиковалась на GitHub Pages | требуется merge authorization, затем Pages verification |

## Доступный предпросмотр

[PREVIEW / NOT LIVE — вход](https://axiom-showcase-pr15-preview.endeavor-prime.chatgpt.site/preview.html).
Literal deployed Site URL: https://axiom-showcase-pr15-preview.endeavor-prime.chatgpt.site

Входная страница даёт BLACK SUN RU/ENG, весь showcase, loader до/после.
Это отдельный закрытый Sites-стенд, доступный владельцу через ChatGPT sign-in.
Его существующая аудитория не расширялась. Основной GitHub Pages не изменён.
На root routes сохранены byte-identical runtime-файлы reviewed PR15; отдельный
`loader-fixed.html` сочетает его markup/scripts с CSS независимого loader fix.
[Read-only merge-tree](review-publication/combined-loader.json) подтвердил отсутствие
конфликтов и byte identity этого loader с кандидатом объединения PR15 + loader fix;
реальное слияние и передвижение product refs не выполнялись.

Source стенда: `e5c06d1bbfb1b61c9fb103c4182f1ae1efdaf411`.
Sites initial Git push 76.4 MiB превысил лимит 64 MiB. Передача разбита на два
пакета через дополнительный media bootstrap и merge commit с неизменным source
деревом. Исходный commit сохранён; force/rebase/amend не выполнялись.
Архив принят, private deployment завершился `succeeded`.
Native result проверяет публикацию стенда; браузерный проход за owner sign-in
удалённо не выполнялся. Локально проверен тот же export/комбинированный loader.

## Повторная проверка BLACK SUN

Fresh first/streamed paint + canonical semantics: **10/10 PASS** Chromium/Firefox.
BLACK SUN: **8/8 PASS**, обе локали × 390/1440 × оба движка. Headline всегда
`WHEN HOPE BECAME A THREAT.` с `lang=en`; RU subtitle ровно один, в ENG hidden /
`display:none` / height 0, повторной строки среди body paragraphs нет. Обычный
viewport mouse click сохраняет абсолютный scrollY; event trace записан в JSON.
Четыре native screenshots лежат в [review-publication](review-publication).

Промежуточные `locator.click()` прогоны дали 4 FAIL в Chromium: автоматизация
сама scrollIntoView sticky control до dispatch, на 424–467px. Их raw JSON сохранены
как `locator-scroll-diagnostic-*`; прямой pointer input и trace подтвердили, что
runtime scroll не меняется. Typography code не менялся.

Свежий preservation guard сначала ошибочно считал добавленные evidence PNG
изменёнными runtime assets. [Диагностика](review-publication/preservation-diagnosis.json)
сохранена; guard теперь защищает media/fonts в assets/ и serafim-veyr/, отдельно
от намеренно сохранённых docs captures. Source 6/6 и corrected preservation PASS.
Исторические 440 PASS относятся к прежнему frozen-source full run; сейчас
повторены scoped 18 cases, полный 132-case heading suite повторно не заявляется.

## Независимое исправление loader

[PR #16](https://github.com/Endevor-VIK/endevor-vik.github.io/pull/16), OPEN / DRAFT,
CSS-only runtime `8d26d0a143240fd1fe095eee48edfee9e6757161`, delivery `19d9b2b`.
BEFORE 4/4 expected FAIL → **64/64** layout/control checks PASS + **8/8** прежних
loader i18n PASS; source 5/5 + smoke 2/2. Markup/scripts/timeline/storage не менялись.
Preview composition дополнительно **10/10 PASS**, ENG/RU normal/reduced,
Chromium/Firefox; это отдельное evidence, не часть старых 440.
См. owning REPORT в PR16. Чужие runtime/core/Canon/version/gitlinks не тронуты.

## После разрешения CREATOR

1. Проверить exact HEADs, визуальное принятие и разрешение merge для PR15/PR16.
2. Убрать Draft, объединить разрешённые PR без history rewrite, записать merge SHAs.
3. Наблюдать фактический GitHub Pages deployment до terminal success для итогового main.
4. Независимо запросить public index.html с cache-busted URL: проверить bilingual
   bindings и подключения bilingual-headings.css / language-motion.js.
5. В clean browser session проверить BLACK SUN RU/ENG и loader на опубликованном
   хосте. Только затем сообщать MAIN MERGED / LIVE VERIFIED = YES.

Текущий этап заканчивается перед разрешением. No merge / no GitHub Pages deploy.
Rollback preview — отдельная версия закрытого стенда; product rollback после
возможного merge — обычный revert только по соответствующей authority.
