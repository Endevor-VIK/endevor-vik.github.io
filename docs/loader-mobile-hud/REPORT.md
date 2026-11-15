<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.LOADER_MOBILE_HUD.REPORT
  title: "Mobile loader HUD — implementation and QA"
  status: READY_FOR_REVIEW / CREATOR_VISUAL_PENDING
  deployment: NOT_DEPLOYED
  mode: Delivery Report
  goal: "Показать устранение мобильных наложений отдельно от typography PR15"
  scope: loader-mobile-hud
  lang: ru
  last_updated: 2026-11-15
  editable_by_agents: true
  change_policy: "Measured QA и exact refs; main merge/deploy отдельно"
-->
# Mobile loader HUD — отчёт

IMPLEMENTED + VERIFIED (automated); визуальная приёмка CREATOR pending.
Base main `adb87e5b8c8ba778aedfddd0655ec0b957e045ef`.
Fix `8d26d0a143240fd1fe095eee48edfee9e6757161` на отдельной ветке
`fix/showcase-mobile-loader-hud`; PR15 runtime не изменён.

На 390px верхние HUD подписи пересекались; нижний HUD занимал ту же полосу,
что hex dump; ENTER переносился узкой колонкой и пересекался с ENG/RU.
[BEFORE](evidence/before.json): 4/4 воспроизведения FAIL, ENG/RU × Chromium/Firefox.
Это подтверждённый прежний дефект, не проблема новой typography.

Теперь на телефоне инструменты, терминал, wordmark, progress и controls занимают
отдельные строки. Короткий viewport прокручивается, сохраняя весь контент.
В short landscape терминал/progress и wordmark стоят в двух колонках.
В tablet 721–1080px перенесена только нижняя HUD/hex полоса.
Декоративные corner brackets не перехватывают нажатия. Desktop 1440×900
сохраняет прежнюю композицию. Существующие animations, boot duration, storage,
Escape/Enter/Space, логика embedded и preference helper сохранены.

**Только CSS:** [preservation](evidence/preservation.json) подтверждает byte identity
всего loader вне style, в том числе scripts, markup, translation bindings и URLs.
Каталоги и прочие runtime файлы не менялись. Изменение совместимо с main и PR15:
их loader differences вне изменённого mobile CSS.

| Проверка | Результат | Evidence |
| --- | --- | --- |
| Layout / controls / language / keyboard | 64/64 PASS, 0 FAIL / NOT_RUN | [layout-browser.json](evidence/layout-browser.json) |
| Прежние loader i18n / stream / embedded | 8/8 PASS, 0 FAIL / NOT_RUN | [existing-loader-i18n.json](evidence/existing-loader-i18n.json) |
| Source/catalog | 5/5 PASS | `python3 tests/test_i18n.py` |
| Structural smoke | 2/2 PASS | `smoke_showcase.py`, `smoke_showcase_v23.py` |
| Non-CSS preservation / diff whitespace | PASS | [preservation.json](evidence/preservation.json) |

Матрица: ENG/RU, reduced/no-preference, Chromium 149 / Firefox 151,
320×568 / 390×844 / 430×932 / 720×900 / 768×1024 / 1440×900 / 844×390.
Проверяются фактические текстовые bounds, межблочные пересечения, hit targets
после прокрутки и смены языка, клавиши выхода, session mark и отсутствие внутренних
controls у embedded loader. При проверке hex dump учитывается его исходная
12%-ная маска: прозрачные края не считаются непрозрачной подписью.

64-case run измеряет рабочий loader по SHA256, до commit; hash совпадает с fix
`8d26d0a` и проверен в preservation JSON. После commit отдельный прежний 8-case
набор выполнен на точном `8d26d0a`, hashes до/после совпадают.
Предыдущий промежуточный [30-FAIL diagnostic](evidence/first-correction-diagnostic.json)
сохранён: выявлены masked hex bounds, corner hit interception и tablet/landscape
раскладка. [Portrait/tablet gate](evidence/portrait-tablet-gate.json) прошёл 64/64
до финального улучшения landscape; итоговый full matrix снова 64/64.

Скриншоты: [BEFORE ENG 390](evidence/before-chromium-en-390.png),
[BEFORE RU 390](evidence/before-chromium-ru-390.png),
[AFTER ENG 390](evidence/after-chromium-en-390.png),
[AFTER RU 390](evidence/after-chromium-ru-390.png),
[AFTER RU 320](evidence/after-chromium-ru-320.png),
[AFTER RU landscape](evidence/after-chromium-ru-844.png).
На коротком экране первоначальный кадр показывает начало композиции; последующие
controls доступны прокруткой и проверены на попадание указателя.

NOT_RUN: настоящие телефоны/GPU, manual screen reader, Safari/WebKit, полная новая
232-case регрессия. Она не объявляется повторно пройденной этим scoped исправлением.
Требуются независимое ревью и CREATOR visual acceptance; main merge и Pages deployment
не выполнялись. Версии, Canon и root gitlinks не менялись.

Воспроизведение:

```sh
NODE_PATH=/path/to/node_modules node tests/browser/loader_layout.cjs
NODE_PATH=/path/to/node_modules node tests/browser/i18n_regression.cjs --match loader
python3 tests/test_i18n.py
```

Temporary output: последние 3 runs /14 дней, 32 MiB/run. Выбранные screenshots,
raw JSON и hash manifest сохраняются в Git; свои временные артефакты очищаются.


## Remote delivery / preview

[PR16](https://github.com/Endevor-VIK/endevor-vik.github.io/pull/16) OPEN/DRAFT;
remote delivery `19d9b2b0fb4afd68d2d0a67fd2e18e55396ad023`, runtime `8d26d0a`.
[Закрытый PREVIEW / NOT LIVE](https://axiom-showcase-pr15-preview.endeavor-prime.chatgpt.site/preview.html)
даёт loader до/после. Export сочетает PR15 markup/scripts с этим CSS;
[10/10 composition checks](evidence/preview-composition.json) PASS. Native private
stand publication succeeded 2026-11-15 10:43:59 UTC; GitHub main/Pages не изменены.
Новое CLI `--page` поддерживает проверку отдельного loader-fixed.html; default
loader.html и runtime fix не изменились. Main merge / live verification ожидают CREATOR.
