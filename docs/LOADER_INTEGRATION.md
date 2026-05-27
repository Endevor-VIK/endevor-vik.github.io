<!-- apps/endevor-vik.github.io/docs/LOADER_INTEGRATION.md -->
<!--
AXS_HEADER_META:
  id: AXS.APPS.ENDEVOR_GITHUB_IO.DOCS.LOADER_INTEGRATION
  title: "AXIOM CORE Loader — Integration Guide"
  status: ACTIVE
  deployment: ACTIVE
  mode: Integration Guide
  goal: "Описать подключение boot-loader к публичному лендингу endevor-vik.github.io"
  scope: apps/endevor-vik.github.io/docs/LOADER_INTEGRATION.md
  lang: ru
  last_updated: 2026-05-27
  editable_by_agents: true
  change_policy: "Обновлять при изменении сценария интеграции loader.html"
  links:
    app_readme: ../README.md
    app_index: ../index.html
    app_loader: ../loader.html
-->

# AXIOM CORE Loader — Integration Guide

`loader.html` — самостоятельная киберпанк-страница загрузки в стиле основного лендинга
(`index.html`). Поведение: CRT-power-on → терминал с потоком handshake-логов → проявление
wordmark **AXIOM** → прогресс-бар 0→100% → глитч-переход на целевую страницу.

Длительность по умолчанию **~4.8 c**. Skip — `ESC` / `Enter` / `Space` / клик по prompt / клик по кнопке `ESC`.

---

## 1. Файлы

```
loader.html              ← новая страница загрузки (drop-in, без зависимостей)
index.html               ← существующий лендинг (для варианта B дополняется overlay-snippet)
LOADER_INTEGRATION.md    ← этот документ
```

Никаких локальных ассетов loader не подгружает (только Google Fonts, уже используемые в
`index.html` — `JetBrains Mono` + `Oswald`). Можно копировать в любой проект.

---

## 2. Способы подключения

### Вариант A — Loader как точка входа (рекомендуется)

Самый чистый путь. Пользователь всегда заходит на `loader.html`, после анимации его
перебрасывает на `index.html`.

**Действия для агента / деплоя:**

1. Сделать `loader.html` корневой страницей сайта:
   - На статическом хостинге (Vercel/Netlify/Cloudflare Pages) переименовать:
     ```
     mv index.html app.html
     mv loader.html index.html
     ```
     и в новой корневой `index.html` (бывший loader) поправить атрибут:
     ```html
     <body data-target="app.html" data-duration="4800">
     ```
   - **Или** оставить имена как есть и настроить редирект `/ → /loader.html`
     (например, в `vercel.json`):
     ```json
     { "redirects": [{ "source": "/", "destination": "/loader.html", "permanent": false }] }
     ```

2. На последующих заходах в той же сессии loader сам ставит флаг в `sessionStorage`
   (`axiom_loader_seen=1`). Можно использовать его в корневом скрипте, чтобы пропустить
   повторный показ (см. сниппет ниже).

### Вариант B — Loader как оверлей внутри `index.html`

Если переименовывать страницы нельзя, встроить loader как первый кадр поверх лендинга
через `<iframe>` + сообщение о готовности.

В `<head>` или начале `<body>` `index.html` добавить:

```html
<!-- AXIOM boot overlay -->
<div id="axiom-boot" style="position:fixed;inset:0;z-index:9999;background:#000">
  <iframe src="loader.html?target=about:blank&duration=4400&auto=false"
          style="border:0;width:100%;height:100%;display:block"
          title="AXIOM boot"></iframe>
</div>
<script>
  (function(){
    // Не показывать повторно в той же сессии
    if (sessionStorage.getItem('axiom_loader_seen') === '1') {
      var el = document.getElementById('axiom-boot');
      if (el) el.remove();
      return;
    }
    // Клик/ESC внутри iframe инициирует glitch-out и редирект на about:blank,
    // мы перехватываем переход iframe и просто прячем оверлей.
    var frame = document.querySelector('#axiom-boot iframe');
    var hide = function(){
      var el = document.getElementById('axiom-boot');
      if (!el) return;
      el.style.transition = 'opacity .35s ease';
      el.style.opacity = '0';
      setTimeout(function(){ el.remove(); }, 400);
      sessionStorage.setItem('axiom_loader_seen', '1');
    };
    // Авто-скрытие через DURATION + запас на glitch
    setTimeout(hide, 5400);
    // Если пользователь нажмёт skip, iframe попробует уйти на about:blank — ловим
    frame.addEventListener('load', function(e){
      try {
        if (frame.contentWindow.location.href !== new URL('loader.html', location.href).href) {
          hide();
        }
      } catch(_){ hide(); }
    });
  })();
</script>
```

> ⚠️ Вариант A проще и надёжнее. Вариант B оставлен на случай, когда корневая страница
> зашита в CMS.

---

## 3. Параметры конфигурации

Можно задавать двумя способами — атрибутами `<body>` или query-string. Query-string имеет
приоритет.

| Параметр   | Атрибут                  | Query        | Default        | Назначение                                    |
|------------|--------------------------|--------------|----------------|-----------------------------------------------|
| Target URL | `data-target="..."`      | `?target=`   | `index.html`   | Куда вести после анимации                     |
| Длительность (мс) | `data-duration="..."` | `?duration=` | `4800`         | Полная длительность boot-sequence             |
| Автопереход | —                       | `?auto=false`| `true`         | Если `false`, ждать клик/ESC, не уходить сам  |

Примеры:

```html
<body data-target="/app" data-duration="3200">
```

```
loader.html?target=/dashboard&duration=6000
loader.html?target=index.html&auto=false
```

---

## 4. Skip-поведение

- `ESC`, `Enter`, `Space` — мгновенно завершить.
- Клик по prompt `> ENTER AXIOM CORE NETWORK` (появляется на 100%) — то же самое.
- Кнопка `ESC` (правый нижний угол) — то же самое.
- Skip всегда проходит через тот же glitch-transition — выглядит цельно с авто-завершением.

---

## 5. Пропуск при повторных заходах

После успешного перехода loader пишет `sessionStorage.axiom_loader_seen = "1"`. Чтобы
лендинг не показывал boot повторно за одну сессию, в начале `index.html` добавить:

```html
<script>
  // Если человек уже видел boot в этой сессии — не отправляем обратно на loader
  if (location.pathname.endsWith('/loader.html')) {
    if (sessionStorage.getItem('axiom_loader_seen') === '1') {
      location.replace('index.html');
    }
  }
</script>
```

Для Варианта B логика уже встроена в сниппет из §2.

---

## 6. Доступность

- `prefers-reduced-motion` → почти все анимации отключаются, но текст и цвета сохраняются.
- Skip-клавиши работают всегда. Если пользователь не дождался — никакого штрафа.
- Loader блокирует переход к контенту максимум на длительность `DURATION` (по умолчанию
  ~5 c). Для критичных к SEO/CWV сценариев — снизить до `2400–3200`.

---

## 7. Производительность

- Только CSS-анимации + `requestAnimationFrame` для прогресс-бара.
- Лёгкая `<svg>` noise-текстура инлайнится в CSS (без сетевых запросов).
- Loader делает `<link rel="prefetch" href="<target>">` сразу, чтобы переход на лендинг
  был мгновенным.
- Никаких внешних JS-библиотек.

---

## 8. Кастомизация (быстрые точки)

| Что меняем        | Где                                                                  |
|-------------------|----------------------------------------------------------------------|
| Цвет акцента      | `:root --red / --red-2 / --red-3` в `<style>` (синхронно с `index.html`) |
| Wordmark текст    | Блок `<div class="wordmark" id="wordmark">…</div>`                   |
| Eyebrow / Tagline | `.logo-eyebrow` и `.tag-line`                                        |
| Терминальные логи | Массив `LOG_LINES` в `<script>`                                      |
| Фазы прогресса    | Массив `PHASES`                                                      |
| HUD-метки (углы)  | Блок `<div class="hud">…</div>`                                      |
| Длительность      | `data-duration` на `<body>` либо `?duration=`                        |

---

## 9. Чек-лист для агента

- [ ] Положить `loader.html` в корень проекта рядом с `index.html`.
- [ ] Выбрать **Вариант A** (рекомендуется) или **B**.
- [ ] Для A: настроить редирект `/ → /loader.html` ИЛИ переименовать файлы и поправить
      `data-target` в новом корневом `index.html`.
- [ ] (Опционально) Добавить sessionStorage-чек, чтобы не крутить boot повторно в одной
      сессии.
- [ ] (Опционально) Подкрутить `data-duration` под целевой UX (стандарт — 4800 мс).
- [ ] Открыть страницу в инкогнито — убедиться, что после анимации пользователь оказывается
      на актуальном `index.html`.
