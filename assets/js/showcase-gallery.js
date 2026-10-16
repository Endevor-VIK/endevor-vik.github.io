/* AXIOM Showcase / WORK archive (ARIA tabs) + screenshot viewer — 0524 W1, Q-01: one archive instead of stage + duplicate grid */
(()=>{const archive=document.getElementById('showcase-gallery');
const dialog=document.getElementById('showcase-lightbox');
if(!archive)return;
const tabs=[...archive.querySelectorAll('[role="tab"]')];
const panels=tabs.map(t=>document.getElementById(t.getAttribute('aria-controls')));
const triggers=panels.map(p=>p&&p.querySelector('.ax-shot-trigger'));
const counter=archive.querySelector('.ax-archive-count');
const live=document.getElementById('ax-archive-live');
const total=tabs.length;
const label=i=>String(i+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');
const titleOf=i=>triggers[i]?triggers[i].dataset.showcaseTitle:'';
let current=Math.max(0,tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'));

/* hidden panels keep lazy images unloaded; after the first interaction the neighbours are fetched ahead of time */
function warm(i){const img=panels[i]&&panels[i].querySelector('img');if(img&&img.loading==='lazy')img.loading='eager'}
function select(i,opts={}){
 i=(i%total+total)%total;
 if(i!==current){
  tabs.forEach((t,j)=>{const on=j===i;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;if(panels[j])panels[j].hidden=!on});
  current=i;
  if(counter)counter.textContent=label(i);
  if(live&&opts.announce)live.textContent=label(i)+' — '+titleOf(i);
 }
 if(opts.focus)tabs[i].focus();
 warm((i+1)%total);warm((i-1+total)%total);
}
tabs.forEach((t,i)=>{
 t.addEventListener('click',()=>select(i));
 t.addEventListener('keydown',e=>{
  const k={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:total-1}[e.key];
  if(k===undefined)return;
  e.preventDefault();select(k,{focus:true});
 });
});
archive.querySelector('.ax-archive-prev')?.addEventListener('click',()=>select(current-1,{announce:true}));
archive.querySelector('.ax-archive-next')?.addEventListener('click',()=>select(current+1,{announce:true}));

/* touch swipe; the flag lets the click that may follow a swipe be ignored, and is cleared by the next touch */
function swipe(el,onSwipe){let x=null,y=0,id=null;
 el.addEventListener('pointerdown',e=>{delete el.dataset.swiped;if(e.pointerType==='mouse')return;x=e.clientX;y=e.clientY;id=e.pointerId},{passive:true});
 el.addEventListener('pointercancel',()=>{x=null});
 el.addEventListener('pointerup',e=>{if(x===null||e.pointerId!==id)return;const dx=e.clientX-x,dy=e.clientY-y;x=null;
  if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.4){el.dataset.swiped='1';onSwipe(dx<0?1:-1)}});
}
const panelsBox=archive.querySelector('.ax-archive-panels');
if(panelsBox)swipe(panelsBox,d=>select(current+d,{announce:true}));

if(!dialog)return;
const image=document.getElementById('showcase-full-image');
const caption=document.getElementById('showcase-full-caption');
const vCounter=document.getElementById('ax-viewer-count');
const stage=dialog.querySelector('.show-lightbox-image');
const closeBtn=dialog.querySelector('.show-lightbox-close');
const zoomBtn=dialog.querySelector('.ax-viewer-zoom');
let vIndex=0,zoomed=false,opened=false;

function zoomState(on){zoomed=on;dialog.classList.toggle('is-zoomed',on);zoomBtn.setAttribute('aria-pressed',String(on));zoomBtn.textContent=on?'FIT':'1:1 ZOOM'}
function setZoom(on,at){
 const t=triggers[vIndex];if(!t)return;
 zoomState(on);
 if(on){/* 1:1 shows the lossless capture */
  image.removeAttribute('srcset');image.removeAttribute('sizes');image.src=t.dataset.showcaseSrc;
  const w=+image.getAttribute('width'),h=+image.getAttribute('height');
  image.style.width=w+'px';image.style.height=h+'px';
  const rx=at?at.x:.5,ry=at?at.y:.5;
  stage.scrollLeft=Math.max(0,rx*w-stage.clientWidth/2);stage.scrollTop=Math.max(0,ry*h-stage.clientHeight/2);
 }else{
  image.style.width='';image.style.height='';
  image.sizes='(max-width: 760px) 98vw, min(1500px, 95vw)';image.srcset=t.dataset.showcaseSrcset;image.src=t.dataset.showcaseSrc;
  stage.scrollLeft=0;stage.scrollTop=0;
 }
}
function show(i){
 vIndex=(i%total+total)%total;const t=triggers[vIndex];if(!t)return;
 stage.classList.add('is-loading');
 image.alt='Скриншот: '+t.dataset.showcaseTitle;caption.textContent=t.dataset.showcaseTitle;vCounter.textContent=label(vIndex);
 setZoom(false);
 select(vIndex);
}
image.addEventListener('load',()=>stage.classList.remove('is-loading'));
image.addEventListener('error',()=>stage.classList.remove('is-loading'));
function open(i){
 show(i);opened=true;
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
 closeBtn.focus();
}
/* the archive follows the viewer, so focus returns to the screen that is current on close — without scrolling */
function restore(){if(!opened)return;opened=false;zoomState(false);image.style.width='';image.style.height='';
 image.removeAttribute('srcset');image.removeAttribute('src');
 const back=triggers[vIndex];if(back)back.focus({preventScroll:true})}
function close(){if(typeof dialog.close==='function'&&dialog.open)dialog.close();else{dialog.removeAttribute('open');restore()}}

triggers.forEach((btn,i)=>btn&&btn.addEventListener('click',()=>{if(panelsBox&&panelsBox.dataset.swiped)return;open(i)}));
closeBtn.addEventListener('click',close);
dialog.querySelector('.ax-viewer-prev').addEventListener('click',()=>show(vIndex-1));
dialog.querySelector('.ax-viewer-next').addEventListener('click',()=>show(vIndex+1));
zoomBtn.addEventListener('click',()=>setZoom(!zoomed));
dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
dialog.addEventListener('close',restore);

/* fit: a click zooms to 1:1 at that point; 1:1: mouse drag pans and a click without drag returns to fit; touch scrolls natively */
let drag=null;
stage.addEventListener('pointerdown',e=>{if(!zoomed||e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,y:e.clientY,l:stage.scrollLeft,t:stage.scrollTop,moved:false};stage.setPointerCapture(e.pointerId);e.preventDefault()});
stage.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4)drag.moved=true;stage.scrollLeft=drag.l-dx;stage.scrollTop=drag.t-dy});
stage.addEventListener('pointerup',()=>{if(!drag)return;const moved=drag.moved;drag=null;if(!moved)setZoom(false)});
stage.addEventListener('pointercancel',()=>{drag=null});
image.addEventListener('click',e=>{if(zoomed||stage.dataset.swiped)return;const r=image.getBoundingClientRect();setZoom(true,{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height})});
swipe(stage,d=>{if(!zoomed)show(vIndex+d)});

/* keys: arrows page (fit) or pan (1:1); Home/End; + − 0 Z by physical key, so a Cyrillic layout works too */
dialog.addEventListener('keydown',e=>{
 if(e.altKey||e.ctrlKey||e.metaKey)return;
 const pan=80;let handled=true;
 switch(e.key){
  case 'ArrowRight':if(zoomed)stage.scrollLeft+=pan;else show(vIndex+1);break;
  case 'ArrowLeft':if(zoomed)stage.scrollLeft-=pan;else show(vIndex-1);break;
  case 'ArrowDown':if(zoomed)stage.scrollTop+=pan;else handled=false;break;
  case 'ArrowUp':if(zoomed)stage.scrollTop-=pan;else handled=false;break;
  case 'Home':show(0);break;
  case 'End':show(total-1);break;
  default:
   if(e.code==='Equal'||e.code==='NumpadAdd')setZoom(true);
   else if(e.code==='Minus'||e.code==='NumpadSubtract'||e.code==='Digit0'||e.code==='Numpad0')setZoom(false);
   else if(e.code==='KeyZ')setZoom(!zoomed);
   else handled=false;
 }
 if(handled)e.preventDefault();
});
})();
