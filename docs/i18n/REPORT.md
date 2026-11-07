<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.I18N.REPORT
  title: "AXIOM SHOWCASE — ENG/RU implementation and QA"
  status: TECH_PASS / CREATOR_VISUAL_REVIEW_PENDING
  deployment: NOT_DEPLOYED
  mode: Implementation / Evidence Handoff
  goal: "Передать реализацию и воспроизводимые проверки на визуальную приёмку"
  scope: landing localization
  lang: ru
  last_updated: 2026-11-07
  editable_by_agents: true
  change_policy: "Результаты сверять с приложенным evidence, не считать отчёт доказательством"
-->
# ENG / RU — реализация и приёмка

Ветка `feature/showcase-i18n-en-ru`, база `b4d9c4dcd63131079c0cf8ccee80ecc00d3c5994`.
Runtime commit: `4aafcbe9ef022f612ddc29e0de671d6aab565da9`.
Следующий commit `8da15b60471b3d892bc8fb78ebc88081d5b25eda` меняет только ожидание
состояния навигации в regression harness. Runtime побайтно совпадает с `4aafcbe`.
Merge, deployment и визуальная приёмка CREATOR не выполнялись.

## Changelog

- Добавлены 929 одинаковых непустых ключей ENG/RU, централизованные словари,
  статически сгенерированный browser catalog и runtime без сторонних библиотек.
- Язык определяется по `?lang=`, сохранённому ручному выбору и главному языку
  браузера; unsupported → ENG. Storage exceptions безопасны. ENG / RU в шапке
  и dialogs переключает язык без reload и сброса scroll/zoom/selected/open state.
- Переведены narrative, восемь экранов WORK и их alt/caption, карта/flow,
  ошибки viewer, исторический ticker, metadata, accessibility labels,
  loader/его динамические состояния и 404/печатающийся терминал.
- Существующий самостоятельный Serafim Veyr archive получил общий preference
  helper и безопасное отображение своих прежних переводов; его галерея сохранена.
- Добавлены проверки полноты, browser scenarios и streamed HTML: translation
  не оставляет исходный хвост текста, когда сеть разделяет один text node.

## Проверки

| Проверка | Результат | Основание |
| --- | --- | --- |
| Полнота/непустота/равенство ключей, placeholders, static text/attributes, dynamic sources, generated catalog | PASS, 5/5 | `python3 tests/test_i18n.py` на runtime `4aafcbe` |
| Оба существующих structural smoke | PASS, 2/2 | `python3 tests/smoke_showcase.py`; `python3 tests/smoke_showcase_v23.py` |
| ENG/RU browser contract | **PASS, 84/84**, 0 FAIL, 0 NOT_RUN внутри набора | [Raw JSON](evidence/i18n-browser.json), Chromium 149 / Firefox 151, clean `4aafcbe`, source hashes совпадают до/после |
| Существующая browser regression | **PASS, 232/232**, 0 FAIL, 0 SKIP | [Raw JSON](evidence/existing-browser.json), последовательный Chromium 149 / Firefox 151; test harness `8da15b6`, runtime unchanged `4aafcbe` |
| Сохранение секций/Canon ID/ссылок/ресурсов | PASS | [Preservation manifest](evidence/preservation.json) |
| Local performance / geometry / console | PASS в измеренном scope | [Raw performance JSON](evidence/performance.json) |
| Визуальные samples обоих языков | OBSERVED: блокирующих наложений не обнаружено | 40 captures полного browser run; выбранные originals/сравнения ниже; агентский просмотр всех шести ширин, не приёмка CREATOR |

Browser contract проверяет первый вход `ru-RU` / `en-US` / `en-GB` / `de-DE`,
главный язык `[de-DE, ru-RU]`, query/saved/browser precedence, invalid values,
storage failures, Tab/Enter/Space/focus, manual/reload/URL persistence,
HERO/WORK scroll, все восемь screens, открытый viewer с 1:1/pan/close,
все шесть узлов карты и четыре flow steps в обоих языках, map viewer,
image-load errors, metadata и literal XSS payload, loader standalone/embedded,
переключение 404 во время typing, navigation/anchors, no-JS fallback,
standalone archive preference и начальную локализацию streamed HTML.

Геометрия и видимость переключателя проверены на **320 / 390 / 768 / 1024 /
1440 / 1600** для ENG и RU в обоих движках. `OBSERVED` записи версий браузеров
не включаются в число PASS. HERO/WORK/WORLD 390/1440 просмотрены root и reviewer; отдельный reviewer
просмотрел ещё 16 HERO PNG: оба движка × ENG/RU × 320/768/1024/1600.
Клавиатурные проверки автоматизированы; живой
screen reader не использовался.

Первый existing-suite run дал [231 PASS / 1 FAIL](evidence/existing-initial.json): R29 в Chromium не дождался
`aria-current` за фиксированные 400 ms при параллельных browser runs. Тот же
fixture отдельно прошёл без изменения продукта; Firefox прошёл в полном run.
В harness заменено ожидание времени на bounded ожидание того же exact state,
исходные строгие assertions сохранены. Точный пропущенный event первоначальный
лог не фиксировал; задержка планировщика — объяснение, а не доказанный root cause.
[Изолированная диагностика](evidence/r29-diagnosis.json) и её
[воспроизводимый script](evidence/r29-diagnosis.cjs) сохранены. Последовательный
повтор с bounded ожиданием завершился 232/232 PASS; продукт после `4aafcbe` не менялся.

## Performance и сохранность

Локальный Chromium 149, 390×844, gzip/no-store, reduced motion, 3 interleaved RU
baseline/current loads: FCP median **300 → 164 ms**, LCP **300 → 212 ms**, CLS
**0 → 0**. EN spot: FCP/LCP 236 ms, CLS 0. Эти числа показывают отсутствие
существенной регрессии в данном локальном замере; это не field CWV и не оценка
реальной сетевой задержки. Дополнительный сжатый payload: **49 062 B (~47,9 KiB)**.

Первоначальная реализация задерживала первый кадр. Исправлено до final QA:
parser mutation batches переводятся один раз на subtree, локализованный HTML
показывается до завершения deferred scripts. Тексты локализуются до paint;
characterData и исходные whitespace metadata защищают streamed responses.

Сохранены порядок/ID всех секций, шесть Canon ID, назначения всех ссылок,
изображения и srcset/sizes/loading/decoding, исходные шрифты, палитра,
анимации и оригинальная композиция. Растровые тексты не редактировались.
Правки CSS ограничены language controls, размещением длинных viewer labels,
локализованными CSS-generated labels и четырьмя пикселями tablet HERO padding.
Последняя поправка устраняет выход рамки за fold при 1024×768 (после: 767,078 px).

После ручной смены языка browser scroll anchoring отключается до следующей
загрузки, чтобы поздний reflow не возвращал viewport к якорю прежнего языка.
Это исправило воспроизводимый сдвиг 114 px при открытом WORK viewer в обоих
движках; zoom, pan и focus не сбрасываются.

Canon сверялся read-only на `3884ea43e125ddd39b18c80f91cc40310dd65e9f`.
Сохранены имена, технические обозначения, факты и границы готовности продукта.
Serafim Veyr fan archive не отождествляется с Seraphine Veyr из AXIOM.
Версии продукта, Canon, root gitlinks и чужие ветки не изменялись.

## Screenshots

Слева ENG, справа RU; сравнения собраны из оригинальных pixels без scaling:

- [Desktop 1440](captures/compare-1440-hero.png)
- [Mobile 390](captures/compare-390-hero.png)

| Секция | Desktop ENG / RU | Mobile ENG / RU |
| --- | --- | --- |
| HERO | [ENG](captures/en-1440-hero.png) / [RU](captures/ru-1440-hero.png) | [ENG](captures/en-390-hero.png) / [RU](captures/ru-390-hero.png) |
| WORK | [ENG](captures/en-1440-work.png) / [RU](captures/ru-1440-work.png) | [ENG](captures/en-390-work.png) / [RU](captures/ru-390-work.png) |
| WORLD | [ENG](captures/en-1440-world.png) / [RU](captures/ru-1440-world.png) | [ENG](captures/en-390-world.png) / [RU](captures/ru-390-world.png) |
| HERO 320 | — | [ENG](captures/en-320-hero.png) / [RU](captures/ru-320-hero.png) |

[Capture hashes / provenance](evidence/captures.json). В Git сохранены 14 selected
originals и два сравнения (~4 MiB); остальные screenshots временного run не
дублируются в репозитории. Полный matrix воспроизводится browser harness на exact SHA.

## Воспроизведение и ограничения

Команды browser QA используют существующую установку Playwright:

```bash
NODE_PATH=/path/to/existing/node_modules node tests/browser/i18n_regression.cjs
NODE_PATH=/path/to/existing/node_modules node tests/browser/showcase_regression.cjs --firefox
```

Основные checkouts не используются для QA: работа велась в отдельном worktree,
серверы ephemeral localhost, без backend/DB и production visits. На старте
продолжения Windows C имел ~85,3 GiB free. Браузеры/серверы завершены harness;
собственные временные данные после передачи evidence очищаются. Browser output
ограничен тремя runs / 14 днями / 96 MiB на run при записи; profiles/traces/video
не сохраняются. Глобальные caches и чужие процессы/данные не менялись.

**NOT_RUN:** реальные устройства/GPU, Safari/WebKit, ручной screen reader,
Lighthouse и field CWV, crawler SEO localization, live production deployment.
Runtime metadata и `html.lang` не создают отдельные SEO-страницы; hreflang не добавлялся.
Визуальная приёмка и разрешение на merge/deploy остаются за CREATOR.

[Инструкция переводчика](README.md) · [SPEC](SPEC.md) · [AgentOps](AGENTOPS.md).
Полный список файлов доступен в diff PR и [changed-files.txt](evidence/changed-files.txt).
