<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.0524.W4RP.QUALIFICATION
  title: "R1.P — qualification attempts and harness corrections"
  status: HISTORICAL_ATTEMPTS / NOT_FINAL_PROOF
  deployment: NOT_DEPLOYED
  lang: ru
  last_updated: 2026-10-21
  editable_by_agents: true
-->
# Диагностические попытки

Финальное evidence — только `../manifest.json` / capture run-003 и финальные отдельные checks. Промежуточные результаты не смешиваются с его кадрами. Здесь сохранены raw manifests и несколько диагностических нативных кадров, а не второй полный screenshot archive.

- `run-001-manifest.json`: 14 pilot frames, 8 checks. По собственному визуальному разбору исправлены перекрытие малых карточек орбиты на телефоне, читаемость вводной персонажей и недостаточная выразительность объекта зависимости. Два pilot frame сохранены для audit; остальные собственные transient кадры удалены после final promotion.
- `run-002-manifest.json`: 253 intermediate frames, 134 assertions. Обнаружено, что унаследованное mobile rule всё ещё скрывает глифы. И неверный selector `.char .portrait` выбирал пустой набор вместо настоящего `.char .img`; его совпадение не считалось доказательством портретной геометрии. Final run-003 использует frame+image, требует non-empty match и сохраняет все пять глифов. Один нативный intermediate frame оставлен для сравнения.
- `source-first-attempt.json`: три exact tag-list assertions отклонились из-за 4/3/3 текстовых `<br>` в CONTENT/CARTOGRAPHY/WATCH_DOG. Удаление переносов — следствие новой семантической метки и block footer, не потеря визуального компонента. Проверка теперь явно сравнивает упорядоченную frame/graphic topology **без текстовых br**, при этом сохраняет counts обеих версий и отдельно требует точного совпадения всех SVG geometry attributes. Намеренная разница раскрыта в матрице; DOM complexity не используется как KPI.
- `probe-first-attempt.json`: первый smoke дошёл до17 checks. После Escape следующий шаг столкнулся с повторно открытым viewer. Вероятная причина — harness не ждал асинхронного `close`/focus restoration перед следующим Enter; отдельный runtime-дефект этим проходом не установлен. Следующая проверка OMEGA не прошла, клик карты завершился timeout. Добавлено100ms ожидание native event queue после Escape; runtime не менялся. Последующие полные проходы не воспроизвели проблему.
- `probe-second-attempt.json`: 110 checks; 4 fit assertions отклонились из-за исходных глифов с `right:-20px` внутри `overflow:hidden` карточек. Это намеренно обрезанный декоративный слой, не скрытый текст. Final assertion учитывает overflow mode и отдельно проверяет bounds заголовков, prose и footer; все 110 checks прошли. CSS/HTML после final capture не менялись.

До final promotion сверены точные input hashes. Все 346 final frame dimensions/SHA256 совпадают; каждый полный проход имеет перекрытие≥100px, больше sticky chrome, и покрывает начало/конец секции. Неокончательные attempts не объявляются PASS для R-A/R3/G4. Старые W4/W4R артефакты не удалены.
