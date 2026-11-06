/* SERAFIM VEYR // Night City Archive. Static only, no tracking or external APIs. */
(()=>{'use strict';
const COPY={
 en:{nav_story:'STORY',nav_gallery:'GALLERY',nav_axs:'THE CONNECTION',visit_axiom:'AXIOM PROJECT ↗',hero_eyebrow:'CHARACTER FILE / 2077 / FAN PROJECT',hero_tag:'ONE CHARACTER. COUNTLESS STORIES IN NIGHT CITY.',hero_lede:'A personal Cyberpunk 2077 character — refined through years of play, experimentation and roleplay. This archive is a love letter to the city, not an official game project.',see_gallery:'EXPLORE THE ARCHIVE',read_story:'READ THE STORY',scroll:'SCROLL TO EXPLORE ↓',story_kicker:'THE STORY',story_head:'NOT A NEW LEGEND.<br>JUST MY VERSION OF V.',story_p1:"I've followed Cyberpunk since long before release. Over many playthroughs I completed the story, explored every corner of Night City, experimented with builds and started finding my own pace in its world.",story_p2:"Serafim Veyr was shaped gradually: her face, red hair, cyberware, clothing and even the little rituals of her daily life. I don't rush every quest. Some days she simply walks, takes the metro, visits home and changes her outfit.",story_p3:"I originally made her only for myself. The thought of sharing her grew from curiosity — and from appreciation for the mod authors whose work makes this possible.",dossier_world:'WORLD',dossier_style:'PERSONA',dossier_type:'TYPE',identity_kicker:'THE IDENTITY',identity_head:'BUILT FROM<br>SMALL DETAILS.',identity_p1:'The shape of her face. The red hair. The contrast of dark clothes and luminous Night City. Even when her outfit changes from day to day, the character should still feel recognizable.',identity_p2:'This is a gallery of a player character, not a claim that the altered promotional images represent the exact in-game result.',gallery_kicker:'THE VISUAL LIBRARY',gallery_head:'THE CITY NEVER<br>LOOKS THE SAME TWICE.',gallery_desc:'Browse cinematic AI-enhanced frames, original in-game photographs and the independent penthouse art library. Each item is explicitly labeled.',gallery_note:'Artwork may differ from game geometry, lighting and textures. Original captures remain the reference for the preset.',filter_all:'ALL MEDIA',filter_cinematic:'CINEMATIC / AI',filter_original:'IN-GAME / ORIGINAL',filter_art:'ART COLLECTION',load_more:'LOAD MORE IMAGES',compare_kicker:'REALITY & INTERPRETATION',compare_head:'BEFORE / AFTER.',compare_body:'An unedited game screenshot and a generative AI-enhanced artistic interpretation of that same photo. Drag the slider to compare. The original image shows the real character.',compare_notice:'AI enhancement can change facial details, materials and even scene geometry. It is promotional art, not a guaranteed in-game result.',origin_kicker:'FROM ROLEPLAY TO ORIGINAL FICTION',origin_head:'ONE WORLD<br>INSPIRED ANOTHER.',origin_p1:'Playing and roleplaying Serafim influenced the way I imagined a separate original character in my own fictional universe, AXIOM. Some of the attitude and visual ideas survived that transition, but these are two distinct characters belonging to different worlds.',origin_p2:'This fan archive keeps their origins clear. AXIOM is an independent personal creative and technical project — not an official Cyberpunk 2077 continuation or a CD Projekt RED product.',origin_cta:'VISIT THE AXIOM PROJECT',preset_kicker:'CHARACTER PRESET / RELEASE NOTES',preset_head:'THE PRESET<br>IS STILL BEING BUILT.',preset_intro:'The complete character package is being prepared separately: face, body setup, cyberware, hair, outfit, dependencies and credits. It will only be linked here once it has been tested and published.',status_p:'No public download is claimed here. Full mod files and third-party permissions are verified independently before a Nexus release.',footer_fan:'Unofficial fan project. Cyberpunk 2077 belongs to CD PROJEKT RED and its respective rights holders. No affiliation or endorsement is implied.',footer_media:'MEDIA TRANSPARENCY',footer_ai:'The gallery distinguishes original game captures from generative AI-enhanced promotional material and independent AI-created decorative artwork. Source images were supplied by the player.',footer_links:'LINKS'},
 ru:{nav_story:'ИСТОРИЯ',nav_gallery:'ГАЛЕРЕЯ',nav_axs:'СВЯЗЬ С AXIOM',visit_axiom:'ПРОЕКТ AXIOM ↗',hero_eyebrow:'ДОСЬЕ ПЕРСОНАЖА / 2077 / ФАН-ПРОЕКТ',hero_tag:'ОДИН ПЕРСОНАЖ. БЕСЧИСЛЕННЫЕ ИСТОРИИ В НАЙТ-СИТИ.',hero_lede:'Мой личный персонаж Cyberpunk 2077, которого я годами менял во время прохождений, экспериментов и RP. Это признание в любви к игровому миру, а не официальный проект.',see_gallery:'ОТКРЫТЬ АРХИВ',read_story:'УЗНАТЬ ИСТОРИЮ',scroll:'ЛИСТАЙ НИЖЕ ↓',story_kicker:'ИСТОРИЯ',story_head:'НЕ НОВАЯ ЛЕГЕНДА.<br>ПРОСТО МОЯ ВЕРСИЯ V.',story_p1:'Я следил за Cyberpunk задолго до выхода игры. За множество прохождений изучил Найт-Сити, сюжеты, секреты, разные сборки и постепенно нашёл собственный ритм жизни в этом мире.',story_p2:'Серафим Вейр формировалась постепенно: черты лица, красные волосы, импланты, наряды и даже повседневные привычки. Я не спешу с квестами. Иногда персонаж просто гуляет, ездит на метро, возвращается домой и переодевается.',story_p3:'Изначально я создавал её только для себя. Желание поделиться появилось из любопытства и уважения к авторам модификаций, благодаря которым всё это возможно.',dossier_world:'МИР',dossier_style:'ОБРАЗ',dossier_type:'ТИП',identity_kicker:'ОБРАЗ',identity_head:'ВСЁ РЕШАЮТ<br>ДЕТАЛИ.',identity_p1:'Форма лица. Красные волосы. Контраст тёмной одежды и светящегося города. Даже когда наряды меняются каждый день, персонаж остаётся узнаваемым.',identity_p2:'Это галерея игрового персонажа. Художественно изменённые изображения не гарантируют полного совпадения с тем, что вы увидите в игре.',gallery_kicker:'ВИЗУАЛЬНАЯ БИБЛИОТЕКА',gallery_head:'У КАЖДОГО ВЕЧЕРА<br>СВОЙ НАЙТ-СИТИ.',gallery_desc:'Здесь собраны AI-обработанные кинематографические кадры, исходные игровые фотографии и отдельная библиотека картин для пентхауса. Источник каждого изображения обозначен.',gallery_note:'AI-обработка может изменить свет, фактуры и геометрию. Оригинальные скриншоты остаются эталоном пресета.',filter_all:'ВСЕ МЕДИА',filter_cinematic:'КИНОКАДРЫ / AI',filter_original:'ИЗ ИГРЫ / ОРИГИНАЛ',filter_art:'КАРТИНЫ',load_more:'ПОКАЗАТЬ ЕЩЁ',compare_kicker:'ИСХОДНИК И ИНТЕРПРЕТАЦИЯ',compare_head:'ДО / ПОСЛЕ.',compare_body:'Исходный скриншот из игры и его художественная AI-интерпретация. Двигайте ползунок для сравнения. Оригинал показывает реальную внешность персонажа.',compare_notice:'Генеративная обработка может менять черты лица, материалы и даже геометрию сцены. Это иллюстрация, а не точная копия игрового результата.',origin_kicker:'ОТ RP К АВТОРСКОЙ ВСЕЛЕННОЙ',origin_head:'ОДИН МИР<br>ВДОХНОВИЛ ДРУГОЙ.',origin_p1:'Игра и RP за Серафим повлияли на создание другого, самостоятельного персонажа моей авторской вселенной AXIOM. Некоторые черты и визуальные идеи стали отправной точкой, но это два разных персонажа из разных миров.',origin_p2:'Здесь чётко разделены их истоки. AXIOM — независимый авторский творческий и технический проект, а не официальное продолжение Cyberpunk 2077 и не продукт CD Projekt RED.',origin_cta:'ПЕРЕЙТИ К ПРОЕКТУ AXIOM',preset_kicker:'ПРЕСЕТ / СТАТУС РЕЛИЗА',preset_head:'ПРЕСЕТ<br>ЕЩЁ СОБИРАЕТСЯ.',preset_intro:'Отдельно готовится пакет воспроизведения персонажа: лицо, тело, импланты, волосы, наряд, зависимости и благодарности. Ссылка появится только после проверки и публикации.',status_p:'Мы не заявляем о доступном скачивании. Сначала проверяются файлы и разрешения авторов сторонних модов.',footer_fan:'Неофициальный фан-проект. Cyberpunk 2077 принадлежит CD PROJEKT RED и соответствующим правообладателям. Проект не связан с издателем и не одобрен им.',footer_media:'ПРОЗРАЧНОСТЬ МЕДИА',footer_ai:'В галерее отдельно отмечены оригинальные игровые снимки, AI-обработанные промокадры и самостоятельно сгенерированные декоративные изображения. Исходные игровые кадры предоставлены игроком.',footer_links:'ССЫЛКИ'}
};

Object.assign(COPY.en, {
 skip_content:'Skip to content',brand_top:'Serafim Veyr, top of page',primary_nav:'Primary navigation',language:'Language',
 hero_image:'AI-enhanced portrait of Serafim in a rainy Night City plaza',hero_media:'SV-001 // AI-ENHANCED PORTRAIT',media_types:'SCREENSHOTS · AI MEDIA · ART LIBRARY',
 record_id:'RECORD ID',persona_value:'STREET / CORPO / RP',fan_art:'UNOFFICIAL FAN ART',feature_image:'AI-enhanced portrait of Serafim without glasses',
 feature_caption:'AI-ENHANCED PROMOTIONAL IMAGE / NOT A RAW GAME CAPTURE',visual_dossier:'VISUAL DOSSIER // SERAFIM VEYR / FEMALE V',gallery_filters:'Gallery filters',
 compare_original:'Original Cyberpunk 2077 game screenshot',compare_ai:'AI-enhanced cinematic interpretation',label_ai:'AI ENHANCED',label_original:'GAME CAPTURE',compare_control:'Reveal image processing comparison',
 release_status:'RELEASE STATUS',release_draft:'DRAFT / NOT PUBLIC',distribution:'MOD DISTRIBUTION: NEXUS MODS / WHEN READY',back_top:'BACK TO TOP ↑',archive_name:'SERAFIM VEYR / CHARACTER ARCHIVE',fan_work:'FAN WORK · NO COMMERCIAL AFFILIATION',
 viewer:'Gallery image viewer',close_viewer:'Close image viewer',previous_image:'Previous image',next_image:'Next image',open:'Open',view:'VIEW ↗'
});
Object.assign(COPY.ru, {
 skip_content:'Перейти к содержимому',brand_top:'Serafim Veyr, к началу страницы',primary_nav:'Основная навигация',language:'Язык',
 hero_image:'AI-обработанный портрет Серафим на дождливой площади Найт-Сити',hero_media:'SV-001 // AI-ПРОМОПОРТРЕТ',media_types:'ИГРОВЫЕ СНИМКИ · AI-ПРОМО · КАРТИНЫ',
 record_id:'КОД ДОСЬЕ',persona_value:'УЛИЦА / КОРПО / RP',fan_art:'НЕОФИЦИАЛЬНЫЙ ФАН-АРТ',feature_image:'AI-обработанный портрет Серафим без очков',
 feature_caption:'ХУДОЖЕСТВЕННАЯ AI-ОБРАБОТКА / НЕ ОРИГИНАЛЬНЫЙ СКРИНШОТ',visual_dossier:'ВИЗУАЛЬНОЕ ДОСЬЕ // СЕРАФИМ ВЕЙР / ЖЕНСКАЯ V',gallery_filters:'Фильтры галереи',
 compare_original:'Оригинальный скриншот из Cyberpunk 2077',compare_ai:'Художественная AI-интерпретация',label_ai:'AI-ОБРАБОТКА',label_original:'СНИМОК ИЗ ИГРЫ',compare_control:'Сравнить оригинал и AI-обработку',
 release_status:'СТАТУС РЕЛИЗА',release_draft:'ЧЕРНОВИК / НЕ ОПУБЛИКОВАН',distribution:'ПУБЛИКАЦИЯ: NEXUS MODS / ПОСЛЕ ПРОВЕРКИ',back_top:'К НАЧАЛУ ↑',archive_name:'СЕРАФИМ ВЕЙР / АРХИВ ПЕРСОНАЖА',fan_work:'ФАН-ПРОЕКТ · БЕЗ КОММЕРЧЕСКОЙ АФФИЛИАЦИИ',
 viewer:'Просмотр изображений галереи',close_viewer:'Закрыть изображение',previous_image:'Предыдущее изображение',next_image:'Следующее изображение',open:'Открыть',view:'СМОТРЕТЬ ↗'
});
const library = Array.isArray(window.SV_LIBRARY) ? window.SV_LIBRARY : [];
const grid = document.querySelector('#gallery-grid');
const loadBtn = document.querySelector('#load-more');
const dialog = document.querySelector('#lightbox');
const img = document.querySelector('#lightbox-image');
const title = document.querySelector('#lightbox-title');
const meta = document.querySelector('#lightbox-meta');
const counter = document.querySelector('#lightbox-counter');
const slider = document.querySelector('#compare-range');
const overlay = document.querySelector('#compare-overlay');
const divider = document.querySelector('#compare-divider');
let lang = 'en', filter = 'all', shown = 0, selected = 0, visible = [], lastFocus = null;
const typeName = type => (lang === 'ru'
  ? {cinematic:'AI-ПРОМО',original:'ИЗ ИГРЫ',art:'AI-КАРТИНА'}
  : {cinematic:'AI MEDIA',original:'IN-GAME',art:'AI ART'})[type];
const filtered = () => filter === 'all' ? library : library.filter(item => item.type === filter);

function setLanguage(next) {
  if (!COPY[next]) return;
  lang = next;
  document.documentElement.lang = lang;
  for (const el of document.querySelectorAll('[data-i18n]')) {
    const value = COPY[lang][el.dataset.i18n];
    if (value === undefined) continue;
    if (value.includes('<br>')) el.innerHTML = value;
    else el.textContent = value;
  }
  for (const [data, attribute] of [['i18nAria','aria-label'], ['i18nAlt','alt']]) {
    const selector = data === 'i18nAria' ? '[data-i18n-aria]' : '[data-i18n-alt]';
    for (const el of document.querySelectorAll(selector)) el.setAttribute(attribute, COPY[lang][el.dataset[data]]);
  }
  for (const button of document.querySelectorAll('[data-lang]')) {
    const active = button.dataset.lang === lang;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  render(false);
  updateCompare();
  if (dialog.open) showSelected();
}

function render(reset = true) {
  if (reset) shown = 0;
  visible = filtered();
  grid.textContent = '';
  shown = Math.min(Math.max(shown, 12), visible.length);
  const fragment = document.createDocumentFragment();
  for (let n = 0; n < shown; n++) {
    const item = visible[n];
    const card = document.createElement('figure');
    card.className = 'media-card';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'media-button';
    button.dataset.id = item.id;
    button.dataset.view = COPY[lang].view;
    button.setAttribute('aria-label', `${item.title[lang]} — ${typeName(item.type)} — ${COPY[lang].open}`);
    const thumb = document.createElement('img');
    thumb.src = item.thumb;
    thumb.alt = item.title[lang];
    thumb.width = item.width;
    thumb.height = item.height;
    thumb.loading = 'lazy';
    thumb.decoding = 'async';
    button.append(thumb);
    button.addEventListener('click', () => openAt(n));
    const caption = document.createElement('figcaption');
    caption.className = 'media-caption';
    const name = document.createElement('b');
    name.textContent = item.title[lang];
    const kind = document.createElement('span');
    kind.className = 'media-tag' + (item.ai ? ' ai' : '');
    kind.textContent = typeName(item.type);
    caption.append(name, kind);
    card.append(button, caption);
    fragment.append(card);
  }
  grid.append(fragment);
  loadBtn.hidden = shown >= visible.length;
  document.querySelector('#gallery-status').textContent = lang === 'ru'
    ? `Показано ${shown} из ${visible.length} изображений.`
    : `Showing ${shown} of ${visible.length} images.`;
}

function openAt(index) {
  if (!visible.length) return;
  selected = (index + visible.length) % visible.length;
  lastFocus = document.activeElement;
  showSelected();
  if (!dialog.open) dialog.showModal();
  document.querySelector('#lightbox-close').focus();
}
function showSelected() {
  const item = visible[selected];
  if (!item) return;
  img.src = item.src;
  img.alt = item.title[lang];
  title.textContent = item.title[lang];
  meta.textContent = `${typeName(item.type)} // ${item.source}`;
  counter.textContent = `${selected + 1} / ${visible.length}`;
}
function move(delta) {
  selected = (selected + delta + visible.length) % visible.length;
  showSelected();
}
for (const button of document.querySelectorAll('[data-filter]')) {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    for (const candidate of document.querySelectorAll('[data-filter]')) {
      const active = candidate === button;
      candidate.classList.toggle('active', active);
      candidate.setAttribute('aria-pressed', String(active));
    }
    render();
  });
}
for (const button of document.querySelectorAll('[data-lang]')) {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
}
loadBtn.addEventListener('click', () => {
  const previous = shown;
  shown += 12;
  render(false);
  grid.querySelectorAll('.media-button')[previous]?.focus();
});
document.querySelector('#lightbox-close').addEventListener('click', () => dialog.close());
document.querySelector('#lightbox-next').addEventListener('click', () => move(1));
document.querySelector('#lightbox-prev').addEventListener('click', () => move(-1));
dialog.addEventListener('close', () => {
  img.removeAttribute('src');
  if (lastFocus?.isConnected) lastFocus.focus();
  else grid.querySelector('.media-button')?.focus();
});
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('keydown', event => {
  if (event.key === 'Tab') {
    const first = document.querySelector('#lightbox-close');
    const last = document.querySelector('#lightbox-next');
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
});
function updateCompare() {
  const value = Number(slider.value);
  overlay.style.width = `${value}%`;
  divider.style.left = `${value}%`;
  document.querySelector('.compare-label.before').hidden = value < 35;
  document.querySelector('.compare-label.after').hidden = value > 65;
  slider.setAttribute('aria-valuetext', lang === 'ru'
    ? `AI-обработка: ${value}%; оригинал: ${100 - value}%`
    : `AI-enhanced: ${value}%; original: ${100 - value}%`);
}
slider.addEventListener('input', updateCompare);
for (const type of ['all','cinematic','original','art']) {
  const count = document.querySelector(`#count-${type}`);
  if (count) count.textContent = type === 'all' ? library.length : library.filter(item => item.type === type).length;
}
setLanguage('en');
})();
