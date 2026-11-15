<!--
AXS_HEADER_META:
  id: AXS.SHOWCASE.LOADER_MOBILE_HUD.SPEC
  title: "Mobile loader — bounded layout correction"
  status: DISCOVERY
  deployment: NOT_DEPLOYED
  mode: Task Contract
  goal: "Устранить наложения HUD и controls на мобильном loader"
  scope: loader.html mobile layout only
  lang: ru
  last_updated: 2026-11-15
  editable_by_agents: true
  change_policy: "Только loader geometry; main merge/deploy отдельно CREATOR"
-->
# Контракт: mobile loader HUD

Основание: текущее продолжение CREATOR и [Principal comment в PR #15](https://github.com/Endevor-VIK/endevor-vik.github.io/pull/15#issuecomment-6892798010).
Отдельная ветка `fix/showcase-mobile-loader-hud` от main
`adb87e5b8c8ba778aedfddd0655ec0b957e045ef`; isolated worktree, foreign delta нет.
PR #15 runtime сохраняется. Эта ветка не включает bilingual typography.

Наблюдаемый дефект 390px: верхние и нижние HUD пары занимают одну строку без
учёта ширины; term-head/log labels и progress labels пересекаются; ENTER переносит
каждое слово и пересекается с ENG/RU controls. Причина — fixed coordinates и
nowrap desktop rhythm при отсутствии mobile composition.

Результат: сохранить весь контент, RED PROTOCOL, шрифты, wordmark, существующие
animations/тайминг/storage/escape/keyboard/language behavior; дать HUD строкам,
терминалу, logo/progress и controls отдельные области. Без удаления художественного
контента, уменьшения значимого текста до нечитаемого размера и изменения runtime JS.
Desktop (>1080px и высота >520px) остаётся прежним. В tablet 721–1080px
разносится только нижняя HUD/hex полоса; короткий landscape ≤1024px использует
прокручиваемую мобильную композицию. На коротком mobile viewport допускается
прокрутка композиции вместо скрытия содержания; controls доступны без перекрытия.

QA: сначала reproduce + BEFORE, затем PASS/FAIL geometry текстовых bounds и
keyboard hit targets, ENG/RU × 320/390/430/768/1440 + landscape 844×390,
Chromium/Firefox, normal/reduced motion и embedded loader. Проверить имитацию
READY, language switch/Space/Enter/Escape и host release. Source smoke и прежние
loader/i18n регрессии. AFTER screenshots той же среды и исходных размеров.

Вне scope: index.html, typography PR #15 runtime, Canon/версии/root gitlinks,
production, main merge. GitHub PR для независимого ревью. Rollback — revert
одного scoped fix commit после отдельного решения; никаких history rewrite.

Resources: Windows C ~90.6 GiB free; existing Playwright reused; owned temporary
runs bounded 32 MiB, last 3 /14 days. Выбранное evidence коммитится, свои tmp удаляются.
