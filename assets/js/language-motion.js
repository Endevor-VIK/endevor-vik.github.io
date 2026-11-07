/* Text-only language choreography; translation and preference remain with each owning runtime. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function visible(element) {
    if (!(element instanceof HTMLElement) || element.closest('[hidden], [aria-hidden="true"]') || element.closest('[data-language], [data-lang]')) return false;
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < innerHeight && box.right > 0 && box.left < innerWidth && getComputedStyle(element).visibility !== 'hidden';
  }
  function create({getLanguage, commit, targets, secondary = () => []}) {
    let generation = 0, pending = null, phase = '', animations = [], settled = Promise.resolve();
    const root = document.documentElement;
    let interrupted = new Map();
    function state(value) {
      phase = value;
      if (value) root.dataset.languageTransition = value;
      else delete root.dataset.languageTransition;
    }
    function stop(capture = false) {
      interrupted = new Map();
      if(capture)for(const animation of animations){const element=animation.effect.target,style=getComputedStyle(element);interrupted.set(element,{opacity:style.opacity,translate:style.translate});}
      generation++;
      animations.forEach(animation => { animation.effect.target.removeAttribute('data-language-motion'); animation.cancel(); });
      animations = [];
      state('');
      pending = null;
    }
    function cancel() { stop(); settled = Promise.resolve(); }
    function select() {
      const elements = [...new Set(targets())].filter(visible);
      // Only text nodes, never a parent composition plus its descendants.
      return elements.filter(element => !elements.some(parent => parent !== element && parent.contains(element)));
    }
    async function animate(elements, incoming, subtitles) {
      animations = elements.map(element => {
        const delay = incoming && subtitles.has(element) ? 60 : 0;
        const base=getComputedStyle(element),start=interrupted.get(element)||{opacity:base.opacity,translate:base.translate};
        element.setAttribute('data-language-motion', '');
        return element.animate(incoming
          ? [{opacity: 0, translate: '0 8px'}, {opacity: base.opacity, translate: '0 0'}]
          : [{opacity: start.opacity, translate: start.translate}, {opacity: 0, translate: '0 -4px'}],
          {duration: incoming ? 180 : 80, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both'});
      });
      // Offscreen documents can have no visible text; commit immediately in that case.
      await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
    }
    function request(next) {
      if (!['en','ru'].includes(next)) return settled;
      if (phase === 'exit') { pending = next; return settled; }
      if (!phase && getLanguage() === next) { commit(next); return settled; }
      stop(phase === 'enter'); pending = next;
      if (reduced.matches || !Element.prototype.animate) {
        const language = pending; pending = null; commit(language); return settled = Promise.resolve();
      }
      const ticket = generation;
      settled = (async () => {
        state('exit');
        await animate(select(), false, new Set());
        if (ticket !== generation) return;
        const language = pending;
        commit(language);
        animations.forEach(animation => { animation.effect.target.removeAttribute('data-language-motion'); animation.cancel(); }); animations = [];
        state('enter');
        await animate(select(), true, new Set(secondary()));
        if (ticket !== generation) return;
        animations.forEach(animation => { animation.effect.target.removeAttribute('data-language-motion'); animation.cancel(); }); animations = [];
        pending = null; state('');
      })();
      return settled;
    }
    reduced.addEventListener('change', () => {
      if (!reduced.matches || !phase) return;
      const next = pending;
      stop(); if (next) commit(next);
      settled = Promise.resolve();
    });
    return Object.freeze({request, cancel, get whenSettled() { return settled; }});
  }
  window.AXIOMLanguageMotion = Object.freeze({create});
})();
