/* Shared preference contract for the showcase and its existing standalone archive. */
(() => {
  'use strict';
  const STORAGE_KEY='axiom.showcase.language.v1';
  const valid=value=>value==='en'||value==='ru';
  function detect(){
    const query=new URLSearchParams(location.search).get('lang');
    if(valid(query))return query;
    try{const saved=localStorage.getItem(STORAGE_KEY);if(valid(saved))return saved;}catch(_){}
    const primary=(navigator.languages&&navigator.languages[0])||navigator.language||'';
    return /^ru(?:-|$)/i.test(primary)?'ru':'en';
  }
  function remember(language){
    if(!valid(language))return;
    try{localStorage.setItem(STORAGE_KEY,language);}catch(_){}
    const url=new URL(location.href);
    if(url.searchParams.has('lang')){url.searchParams.set('lang',language);try{history.replaceState(history.state,'',url);}catch(_){}}
  }
  window.AXIOMLanguage=Object.freeze({STORAGE_KEY,valid,detect,remember});
})();
