/* AXIOM V2.3 / WORLD + SYSTEM interactions; no animation loop */
(()=>{const data=[{"id":"01 / GLUHAYA","signal":"Порог · транзит · первый сигнал","description":"Глухая станция — транзитный порог и первый сигнал. Она связывает знакомое пространство с закрытыми маршрутами системы."},{"id":"02 / NEXUS","signal":"Купол · контроль · глубина","description":"NEXUS — контролируемый купол с внутренними уровнями, изоляцией и собственным порядком."},{"id":"03 / ECHELON","signal":"Вертикаль · власть · иерархия","description":"ECHELON — вертикаль власти и опорный узел иерархии. Здесь архитектура становится инструментом порядка."},{"id":"04 / FACELESS BASE","signal":"Резерв · ремонт · оборона","description":"FACELESS BASE — скрытая автономная крепость за внешним периметром NEXUS: резерв управления, ремонт и оборона купола."},{"id":"05 / OMEGA-0","signal":"Лаборатория · под Глухой станцией","description":"OMEGA-0 — довоенная секретная лаборатория, погребённая под Глухой станцией. После инцидента комплекс запечатан вместе с результатами экспериментов."},{"id":"06 / AI ZONE","signal":"Контакт · удержание · карантин","description":"AI ZONE — закрытый исследовательский комплекс для контролируемого контакта с LIMBO: изоляция, удержание и карантин."}];
const nodes=[...document.querySelectorAll('.v23-map-node')],id=document.getElementById('v23-map-id'),sig=document.getElementById('v23-map-signal'),detail=document.getElementById('v23-map-description'),mapCount=document.getElementById('v23-map-active-count'),mapShell=document.querySelector('.v23-map-composition');
nodes.forEach((n,i)=>n.addEventListener('click',()=>{if(!data[i])return;nodes.forEach((b,j)=>{b.classList.toggle('is-active',i===j);b.setAttribute('aria-pressed',String(i===j))});if(id)id.textContent=data[i].id;if(sig)sig.textContent=data[i].signal;if(detail)detail.textContent=data[i].description;if(mapCount)mapCount.textContent=String(i+1).padStart(2,'0')+' / 06 SELECTED';if(mapShell)mapShell.style.setProperty('--v23-node-progress',String((i+1)/6*100)+'%')}));
const flowMessages=[
  'CANON фиксирует мир и его внутреннюю логику: события, определения, связи и редакционные решения.',
  'MASTER GRAPH показывает отношения сущностей и помогает CREATOR искать противоречия между ними.',
  'WEB CORE представляет утверждённые материалы в читательском интерфейсе, с учётом состояния публикации и доступа.',
  'AXCHAT даёт диалоговый интерфейс к доступному контексту. Инженерный контур проверяет изменения вокруг всей этой цепочки.'
];
const flowButtons=[...document.querySelectorAll('.v23-flow-step')];
const flowMessage=document.getElementById('v23-flow-message');
flowButtons.forEach((btn,i)=>btn.addEventListener('click',()=>{flowButtons.forEach((b,j)=>{b.classList.toggle('is-active',j===i);b.setAttribute('aria-pressed',String(i===j))});if(flowMessage)flowMessage.textContent=flowMessages[i]}));
const trigger=document.getElementById('v23-open-map');
/* 0524 W2 (Q-11): the map viewer follows the archive viewer — FIT ↔ 1:1 on the V10 derivative (1:1 in device pixels), drag / arrows / touch scroll to pan, focus back to the button.
   Nothing is fetched before the first open; 1:1 uses 3840w, or 2880w on low-memory or Save-Data devices */
if(trigger){
 const conn=navigator.connection||{},lite=(navigator.deviceMemory>0&&navigator.deviceMemory<=2)||conn.saveData===true;
 const full=lite?{src:'assets/world/world-spine-map-2880w.webp',w:2880,h:1620}:{src:'assets/world/world-spine-map-3840w.webp',w:3840,h:2160};
 const fitSet='assets/world/world-spine-map-1440w.webp 1440w, assets/world/world-spine-map-2048w.webp 2048w, assets/world/world-spine-map-2880w.webp 2880w';
 const dialog=document.createElement('dialog');dialog.className='show-lightbox ax-viewer v23-map-dialog';dialog.setAttribute('aria-labelledby','v23-map-dialog-title');
 dialog.innerHTML='<div class="show-lightbox-head"><span class="ax-viewer-count">AXIOM / WORLD MAP</span><strong class="show-lightbox-label" id="v23-map-dialog-title">Карта мира AXIOM</strong><div class="ax-viewer-tools"><button type="button" class="ax-viewer-zoom" aria-pressed="false">1:1 ZOOM</button><button type="button" class="show-lightbox-close" aria-label="Закрыть карту">ЗАКРЫТЬ ✕</button></div></div>'
  +'<div class="show-lightbox-image"><img width="'+full.w+'" height="'+full.h+'" decoding="async" draggable="false" alt="Художественная карта мира AXIOM: шесть ключевых локаций, вид с высоты."></div>'
  +'<div class="ax-viewer-hint" aria-hidden="true">КЛИК ИЛИ + — 1:1 · ПЕРЕТАЩИТЬ ИЛИ СТРЕЛКИ — ОБЗОР · ESC — ЗАКРЫТЬ</div>';
 document.body.appendChild(dialog);
 const stage=dialog.querySelector('.show-lightbox-image'),img=stage.querySelector('img'),zoomBtn=dialog.querySelector('.ax-viewer-zoom'),closeBtn=dialog.querySelector('.show-lightbox-close');
 let zoomed=false,drag=null;
 const setZoom=(on,at)=>{
  zoomed=on;dialog.classList.toggle('is-zoomed',on);zoomBtn.setAttribute('aria-pressed',String(on));zoomBtn.textContent=on?'FIT':'1:1 ZOOM';
  if(on){img.removeAttribute('srcset');img.removeAttribute('sizes');if(img.getAttribute('src')!==full.src){stage.classList.add('is-loading');img.src=full.src}
   /* 1:1 = one map pixel per device pixel (a phone at DPR 3 is not upscaled ×3) */
   const zw=Math.round(full.w/Math.min(3,Math.max(1,window.devicePixelRatio||1))),zh=Math.round(zw*full.h/full.w);
   img.style.width=zw+'px';img.style.height=zh+'px';
   const rx=at?at.x:.5,ry=at?at.y:.5;stage.scrollLeft=Math.max(0,rx*zw-stage.clientWidth/2);stage.scrollTop=Math.max(0,ry*zh-stage.clientHeight/2);
  }else{img.style.width='';img.style.height='';img.sizes='min(1800px, 98vw)';img.srcset=fitSet;img.src='assets/world/world-spine-map-2048w.webp';stage.scrollLeft=0;stage.scrollTop=0}
 };
 img.addEventListener('load',()=>stage.classList.remove('is-loading'));
 img.addEventListener('error',()=>stage.classList.remove('is-loading'));
 trigger.addEventListener('click',()=>{if(!img.getAttribute('src'))stage.classList.add('is-loading');setZoom(false);if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');closeBtn.focus()});
 closeBtn.addEventListener('click',()=>{if(typeof dialog.close==='function'&&dialog.open)dialog.close();else{dialog.removeAttribute('open');trigger.focus()}});
 dialog.addEventListener('close',()=>{setZoom(false);trigger.focus({preventScroll:true})});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 zoomBtn.addEventListener('click',()=>setZoom(!zoomed));
 img.addEventListener('click',e=>{if(zoomed)return;const r=img.getBoundingClientRect();
  /* object-fit: contain — map the click to the drawn picture, not to the letterboxed box */
  const k=Math.min(r.width/full.w,r.height/full.h),dw=full.w*k,dh=full.h*k,ox=r.left+(r.width-dw)/2,oy=r.top+(r.height-dh)/2;
  setZoom(true,{x:Math.min(1,Math.max(0,(e.clientX-ox)/dw)),y:Math.min(1,Math.max(0,(e.clientY-oy)/dh))})});
 stage.addEventListener('pointerdown',e=>{if(!zoomed||e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,y:e.clientY,l:stage.scrollLeft,t:stage.scrollTop,moved:false};stage.setPointerCapture(e.pointerId);e.preventDefault()});
 stage.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4)drag.moved=true;stage.scrollLeft=drag.l-dx;stage.scrollTop=drag.t-dy});
 stage.addEventListener('pointerup',()=>{if(!drag)return;const moved=drag.moved;drag=null;if(!moved)setZoom(false)});
 stage.addEventListener('pointercancel',()=>{drag=null});
 /* keys by physical code, so a Cyrillic layout works too; arrows pan only at 1:1 */
 dialog.addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey)return;
  const pan=e.shiftKey?320:80;let handled=true;
  switch(e.key){
   case 'ArrowRight':if(zoomed)stage.scrollLeft+=pan;else handled=false;break;
   case 'ArrowLeft':if(zoomed)stage.scrollLeft-=pan;else handled=false;break;
   case 'ArrowDown':if(zoomed)stage.scrollTop+=pan;else handled=false;break;
   case 'ArrowUp':if(zoomed)stage.scrollTop-=pan;else handled=false;break;
   default:
    if(e.code==='Equal'||e.code==='NumpadAdd')setZoom(true);
    else if(e.code==='Minus'||e.code==='NumpadSubtract'||e.code==='Digit0'||e.code==='Numpad0')setZoom(false);
    else if(e.code==='KeyZ')setZoom(!zoomed);
    else handled=false;
  }
  if(handled)e.preventDefault();
 });
}
/* 0524 W1: the WORK stage was merged into the archive (assets/js/showcase-gallery.js) */
})();
/* 0524 W2 (Q-16): manual AXIOM GATE notice under ENTER AXIOM. CREATOR sets assets/status/gate.json (same origin, one request, 2.5 s timeout);
   the note shows only while state is "unavailable" and the flag has not expired. axiomgates.com is never probed: a CORS or network error says nothing
   about the gate. The buttons themselves do not change */
(()=>{const notes=document.querySelectorAll('.ax-gate-note');if(!notes.length||!window.fetch)return;
 const ctl=window.AbortController?new AbortController():null,timer=setTimeout(()=>{if(ctl)ctl.abort()},2500);
 fetch('assets/status/gate.json',{cache:'no-cache',signal:ctl?ctl.signal:undefined}).then(r=>r.ok?r.json():null).then(s=>{
  if(!s||s.state!=='unavailable'||!(Date.parse(s.expires)>Date.now()))return;
  const day=/^(\d{4})-(\d{2})-(\d{2})/.exec(s.checkedAt||''),date=day?' · статус на '+day[3]+'.'+day[2]:'';
  notes.forEach(n=>{const d=n.querySelector('.ax-gate-date');if(d)d.textContent=date;n.hidden=false});
 }).catch(()=>{}).finally(()=>clearTimeout(timer));
})();
