<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4.QA_TOOLS
  title: "0524.W4 — isolated browser QA tooling"
  status: TOOLING / RESULTS_IN_RUN_MANIFEST
  deployment: NOT_DEPLOYED
  mode: Reproduction instructions
  goal: "Воспроизводимые кадры и проверки на отдельном snapshot без live runtime"
  scope: W4 QA only
  lang: ru
  last_updated: 2026-10-20
  editable_by_agents: true
  change_policy: "Результаты объявлять только по конкретному manifest/source SHA"
-->
# W4 browser QA tools

Runner: `tests/browser/w4_qa.cjs`, Playwright 1.61.1 и axe-core 4.12.1 из существующей установки. Сервис поднимается на случайном localhost-порту; gzip/cache/MIME одинаковы для BEFORE и AFTER. Основной checkout и production-порт не используются.

```bash
NODE_PATH=/home/axiom/ENDEAVOR/AXS/apps/axiom-web-core-ui/node_modules \
  node tests/browser/w4_qa.cjs \
  --root /tmp/axs-0524-w4-before-6b082e5 --phase before \
  --out /tmp/axs-0524-w4-qa/before-matrix1
```

Основная серия: 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 390×844, 360×800, Chromium/Firefox/WebKit по одному движку. DPR1 и native reduced motion обеспечивают сравнимые кадры; motion/no-JS/DPR2–3 samples отмечены отдельно. Все сцены снимаются ограниченными перекрывающимися viewport-сегментами, без искусственного ограничения их количества. Нет инъекции новой разметки или оформления. PNG screenshot существует только в памяти и сразу кодируется Pillow в WebP q76.

Manifest содержит исходный SHA/tree, runtime delta, hashes protected source/screenshot originals, версии движков, SHA256 runner и каждого кадра, viewport/scroll/currentSrc/selection, результаты assertions и axe incomplete. Native keyboard проверяет tab archive, zoom/focus return и OMEGA 02.05; axe не заменяет человеческий screen-reader walkthrough.

`--extend-captures` дополняет именно существующий помеченный owned run, сохраняя предыдущий manifest в истории попыток. Используется для исправления обнаруженного ограничения harness; это не разрешает скрывать product failures. Первичная попытка BEFORE сохранилась отдельно: Firefox no-JS ожидал `document.fonts.ready`, promise при отключённом JS не завершился. Исправлен harness (no-JS использует синхронные измерения), browser был завершён только по собственному PID. Не считать этот сбой дефектом сайта.

Данные находятся вне проекта в `/tmp/axs-0524-w4-qa/`: новые runs удерживают последние три не старше 14 дней, prune только с `.w4-owned`; продолжение существующего run не выполняет retention prune. Capture budget ≤48 MiB/run, без asset copies/profiles/videos/traces. Перед повторным heavy запуском заново проверить Windows free space. До удаления полного run сохранить выбранные review pairs и manifest в долговечном evidence.

## WebKit без системной установки

WebKit 26.5 build 2311 установлен обычным Playwright CLI в browser cache. На хосте не хватало shared libraries, а sudo требует пароль. `webkit_rootless.py` скачивает только необходимую library closure из настроенных официальных Ubuntu apt repositories и извлекает `.deb` в собственный `/tmp/axs-0524-w4-webkit-deps`. Системные пакеты и global env не меняются. Package names/versions/hashes остаются в его `manifest.json`; runner записывает их в run manifest и использует изолированный WPE launcher. После завершения задачи удалить только собственные dependency scratch/debs, browser cache сохраняется.

Performance runner ведёт отдельный owner в `tests/browser/w4_perf.cjs`; не запускать одновременно с browser matrix и не создавать второй Lighthouse pipeline.

## Узкое восстановление landscape evidence после перезапуска хоста

После перезапуска `/tmp` был очищен. Основные матрицы и выбранные кадры уже находились в долговечном evidence; исходный дополнительный landscape-run не был сохранён. `w4_landscape_probe.cjs` восстанавливает только парную проверку WORLD menu → CTA на 844×390 для Chromium/Firefox/WebKit. Это не повтор полной матрицы и не восстановление потерянных 364 результатов по сообщению агента.

```bash
NODE_PATH=/home/axiom/ENDEAVOR/AXS/apps/axiom-web-core-ui/node_modules \
  node docs/showcase-v031/evidence/w4/tools/w4_landscape_probe.cjs \
  --before /tmp/axs-0524-w4-before-6b082e5 \
  --after /home/axiom/ENDEAVOR/AXS-WORKTREES/0524-w4-world-implementation \
  --out /tmp/axs-0524-w4-landscape-recovery/run-20261020-1 \
  --durable-out /home/axiom/ENDEAVOR/AXS-WORKTREES/0524-w4-world-implementation/docs/showcase-v031/evidence/w4/qa/landscape-recovery
```

Helper проверяет runtime против frozen BEFORE `6b082e5` и AFTER `b85fbb0`, использует буквальные `serve/context/ready/scroll` из замороженного W4 runner. Движки запускаются последовательно. Настоящий Tab, обычная прокрутка и hit-test проверяют доступность CTA; исходное условие «CTA целиком в первом кадре после WORLD» сохраняет FAIL, если не выполнено. JSON, собственный console log и 18 native WebP пишутся сразу в фиксированный durable package. Перезапись существующих evidence запрещена; own `/tmp` runs имеют retention 3/14 дней, captures≤5MiB, log≤256KiB, без копий source assets. Перед исполнением нужен свободный browser window и Windows disk guard; rootless WebKit библиотеки при необходимости восстанавливаются прежним helper.

В сохранённом recovery-пакете все три BEFORE/AFTER пары имеют одинаковую геометрию исходного ограничения: CTA ниже первого 390px кадра, но один Tab или обычная прокрутка выводят её целиком в область 198–246px с успешным hit-test. Эти измерения не превращают исходные шесть viewport failures в PASS.

## Actual native 200% browser zoom

`native_zoom.cjs` запускает headed Chromium149 в отдельном Xvfb и временном own profile. Минимальное local extension вызывает `chrome.tabs.setZoom/getZoom(2)`; проверяются native DPR2 и `visualViewport.scale=1`, без CSS zoom, pinch или device emulation. Actual CSS viewport959×496 соответствует physical1919×992. Source roots переключаются при `Cache-Control:no-store`; структура сайта не инъецируется.

```bash
NODE_PATH=<existing-node-modules> \
CHROME_PATH=/home/axiom/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome \
xvfb-run -a -s '-screen 0 1920x1080x24' \
  node docs/showcase-v031/evidence/w4/tools/native_zoom.cjs \
  --before-root /tmp/axs-0524-w4-before-6b082e5 \
  --after-root /home/axiom/ENDEAVOR/AXS-WORKTREES/0524-w4-world-implementation \
  --out /tmp/axs-0524-w4-zoom/run-reproduction
```

Native captures используют foreground/software rendering и direct `Page.captureScreenshot` без clip; native view/Xvfb fallback явно записывается, если нужен. Каждый кадр получает image-content guard, dimensions/method/SHA256. Первая попытка Playwright capture дала8 одноцветных JPEG, признанных непригодными G4; exact failed helper сохранён в `native_zoom_attempt1.cjs.txt`, исходные metrics/JPEG — `qa/native-zoom-attempt1`. После исправления все17 кадров неодноцветны;9 полных reading/attribution frames сохранены в `qa/native-zoom`, остальные8 opening-art frames избыточны для review budget. Все31assertions сохранены: AFTER18/18PASS,1baseline old-fragment prose overflow не скрыт. Проверять combined evidence budget<50MiB перед promotion. Own profiles очищаются в finally; scratch retention3/14days, никаких traces/videos.
