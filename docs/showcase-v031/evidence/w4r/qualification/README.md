<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4R.R1_QUALIFICATION
  title: "W4.R — first concept qualification attempt"
  status: HISTORICAL_HARNESS_FAILURE / SUPERSEDED_BY_RUN002
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# Первый qualification

[Исходный manifest](run-001-manifest.json), [exact helper](capture-first-attempt.cjs.txt). Run001:116 checks,3FAIL,50 transient frames. Все geometry/font/axe checks прошли; три noJS string assertions использовали `innerText` и строчную строку, а CSS `text-transform:uppercase` отдавал другую строку. Это ошибка comparison harness, не доказанный product/noJS defect.

Исправление: `textContent` плюс реальный `isVisible` для archive blockquote в JS-disabled browser context. Никакого изменения product code; в том же concept iteration A дополнительно переработан после visual critique. Run002 выполнен полностью:116/0,52 native frames. Raw first manifest не переписывался. Его50 transient frames не retained и не доступны по перечисленным в нём filenames; hashes фиксируют историческую попытку, не постоянную доступность. Полные финальные52 frames сохранены отдельно.
