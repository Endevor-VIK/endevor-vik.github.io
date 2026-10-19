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
  last_updated: 2026-10-19
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
