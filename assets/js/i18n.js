/* AXIOM SHOWCASE / dependency-free text localization. Authored catalogs: assets/i18n/{en,ru}.json. */
(() => {
  'use strict';
  const catalogs = window.AXIOM_I18N_CATALOGS;
  if (!catalogs || !catalogs.en || !catalogs.ru) return; // source HTML remains usable on a failed asset request
  const preference=window.AXIOMLanguage;
  if(!preference)return;
  const {STORAGE_KEY,valid}=preference;
  let language=preference.detect();
  const root = document.documentElement;
  const bindings = new WeakMap();
  const attributes = ['aria-label', 'alt', 'title', 'content', 'data-text', 'data-showcase-title', 'data-screen-label'];
  const t = (key, values = {}, locale = language) => {
    const value = catalogs[locale][key];
    if (typeof value !== 'string') { console.error('AXIOM i18n missing key:', key); return key; }
    return value.replace(/\{(\w+)\}/g, (match, name) => Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match);
  };
  const copyLanguage = el => el?.closest?.('[data-copy-language]')?.dataset.copyLanguage || language;
  function element(el) {
    if (el.nodeType !== 1) return;
    const locale = copyLanguage(el);
    const key = el.getAttribute('data-i18n');
    if (key && el.textContent !== t(key, {}, locale)) el.textContent = t(key, {}, locale);
    if (el.hasAttribute('data-language-only')) el.hidden = el.dataset.languageOnly !== language;
    for (const attribute of attributes) {
      const key = el.getAttribute('data-i18n-' + attribute);
      if (key && el.getAttribute(attribute) !== t(key, {}, locale)) el.setAttribute(attribute, t(key, {}, locale));
    }
  }
  function bind(comment){
    if(!comment||comment.nodeType!==Node.COMMENT_NODE||!comment.data.startsWith('i18n:'))return;
    const node=comment.nextSibling;
    if(!node||node.nodeType!==Node.TEXT_NODE)return;
    if(!bindings.has(comment)){
      const marker=comment.data.slice(5).trim(),separator=marker.indexOf('|');
      const key=separator<0?marker:marker.slice(0,separator);
      const edges=separator<0?[node.data.match(/^\s*/)[0],node.data.match(/\s*$/)[0]]:JSON.parse(marker.slice(separator+1));
      bindings.set(comment,{key,edges});
    }
    const {key,edges:[before,after]}=bindings.get(comment),value=before+t(key,{},copyLanguage(comment.parentElement))+after;
    if(node.data!==value)node.data=value;
  }
  function apply(scope = document) {
    element(scope);bind(scope);
    if(scope.nodeType===Node.TEXT_NODE)bind(scope.previousSibling);
    if (scope.querySelectorAll) scope.querySelectorAll('[data-language-only],[data-i18n],'+attributes.map(a => '[data-i18n-'+a+']').join(',')).forEach(element);
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_COMMENT);
    let comment;
    while ((comment = walker.nextNode())) bind(comment);
  }
  function sync() {
    root.lang = language;
    root.style.setProperty('--i18n-loading-label', JSON.stringify(t('ui.loading')));
    root.style.setProperty('--i18n-fragment-label', JSON.stringify(t('ui.fragment')));
    document.querySelectorAll('[data-language]').forEach(button => {
      const active = button.dataset.language === language;
      button.setAttribute('aria-pressed', String(active));
    });
  }
  let settleFrame=0,scrollStyles=null;
  function commitLanguage(next, { persist = true } = {}) {
    if (!valid(next)) return;
    const x=window.scrollX,y=window.scrollY;
    if(settleFrame)cancelAnimationFrame(settleFrame);
    if(!scrollStyles)scrollStyles={behavior:root.style.scrollBehavior};
    root.style.overflowAnchor='none';
    language = next;
    if(persist)preference.remember(language);
    root.style.scrollBehavior = 'auto';
    apply(); sync();
    window.dispatchEvent(new CustomEvent('axiom:languagechange', { detail: { language } }));
    window.scrollTo(x, y);
    // An explicit language switch keeps the user’s position instead of the previous language’s anchor.
    // Leave anchoring disabled for later locale reflow, including an open dialog and image decoding.
    // Dialog focus adjustment can also settle after the DOM batch.
    // Hold the viewport through that layout, then restore the original browser behavior.
    settleFrame=requestAnimationFrame(()=>{
      window.scrollTo(x,y);
      settleFrame=requestAnimationFrame(()=>{
        window.scrollTo(x,y);
        root.style.scrollBehavior=scrollStyles.behavior;
        scrollStyles=null;settleFrame=0;
      });
    });
  }
  // Stop only our short viewport hold when the visitor asks to move.
  function releaseScrollHold() {
    if (settleFrame) cancelAnimationFrame(settleFrame);
    settleFrame=0;
    if (scrollStyles) root.style.scrollBehavior=scrollStyles.behavior;
    scrollStyles=null;
  }
  addEventListener('wheel', releaseScrollHold, {passive:true});
  addEventListener('touchstart', releaseScrollHold, {passive:true});
  addEventListener('pointerdown', releaseScrollHold, {passive:true});
  addEventListener('keydown', event => {if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))releaseScrollHold();});
  function motionTargets() {
    const nodes = new Set();
    const add = element => {
      if (!element || element.closest('head,script,style,svg,[aria-hidden="true"]')) return;
      let target=element.closest('h1,h2,h3,p,dt,dd,summary,figcaption,button,a,li') || element;
      if (target.querySelector('img,svg,canvas,video,h1,h2,h3,p')) target=element;
      if (target.matches('html,body,section,article,dialog') || target.querySelector('img,svg,canvas,video')) return;
      nodes.add(target);
    };
    document.querySelectorAll('[data-i18n],[data-heading],.show-lightbox-label,.ax-mode-name,.v23-flow-title,#v23-map-signal,#v23-map-description,#v23-map-active-count,#v23-flow-message,.ax-viewer-zoom').forEach(add);
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_COMMENT);
    let comment;while((comment=walker.nextNode()))if(comment.data.startsWith('i18n:'))add(comment.parentElement);
    return [...nodes];
  }
  const motion=window.AXIOMLanguageMotion?.create({getLanguage:()=>language,commit:commitLanguage,targets:motionTargets,secondary:()=>document.querySelectorAll('[data-language-only]')});
  function setLanguage(next, options) { if(!valid(next))return; motion?.cancel(); commitLanguage(next, options); }
  function transitionTo(next) { return motion ? motion.request(next) : (commitLanguage(next),Promise.resolve()); }
  function switcher() {
    const group = document.createElement('div');
    group.className = 'ax-language';
    group.setAttribute('role', 'group');
    group.setAttribute('data-i18n-aria-label', 'ui.language');
    for (const [lang, label, name] of [['en','ENG','ui.english'],['ru','RU','ui.russian']]) {
      if (group.childNodes.length) { const sep = document.createElement('span'); sep.textContent = '/'; sep.setAttribute('aria-hidden','true'); group.append(sep); }
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.language = lang; button.textContent = label;
      button.setAttribute('data-i18n-aria-label', name);
      group.append(button);
    }
    apply(group);
    group.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.language===language)));
    return group;
  }
  window.AXI18n = Object.freeze({ t, apply, setLanguage, transitionTo, switcher, STORAGE_KEY, get whenSettled() { return motion?.whenSettled || Promise.resolve(); }, get language() { return language; } });
  sync();
  root.classList.add('i18n-loading');
  // A broken unrelated script must never strand the source page behind a loading class.
  const reveal = () => root.classList.remove('i18n-loading');
  const fallback = setTimeout(() => {apply();sync();reveal();}, 2000);
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-language]');
    if (button) transitionTo(button.dataset.language);
  });
  const observer = new MutationObserver(records => {
    // Parser batches report both ancestors and all descendants. Translate each subtree once.
    const scopes=new Set(records.map(record=>record.target));
    for(const scope of scopes){
      let covered=false;
      for(let parent=scope.parentNode;parent;parent=parent.parentNode){if(scopes.has(parent)){covered=true;break;}}
      if(!covered)apply(scope);
    }
    // Mutation observers run before paint: parsed text is ready without waiting for deferred scripts.
    if(document.body)reveal();
  });
  observer.observe(root, { childList: true, characterData: true, subtree: true });
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-language-mount]').forEach(mount => mount.append(switcher()));
    apply(); sync(); clearTimeout(fallback); reveal();
  }, { once: true });
})();
