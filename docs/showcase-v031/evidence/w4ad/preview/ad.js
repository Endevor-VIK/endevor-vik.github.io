/* W4.AD prototype only: progressive controls for snap rails. Without JS the rails still scroll natively and the
   study index still works as plain anchors; nothing is hidden or loaded on demand. */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const behavior=()=>reduce.matches?'auto':'smooth';
 const scrollable=rail=>rail.scrollWidth>rail.clientWidth+4;
 for(const rail of document.querySelectorAll('[data-ad-rail]')){
  const items=[...rail.children],pad=()=>parseFloat(getComputedStyle(rail).paddingLeft)||0;
  const bar=document.createElement('div');bar.className='ad-rail-bar';
  bar.innerHTML='<button type="button" aria-label="Предыдущий">←</button><output aria-live="polite"></output><button type="button" aria-label="Следующий">→</button>';
  rail.after(bar);
  const [prev,next]=bar.querySelectorAll('button'),out=bar.querySelector('output');
  const index=document.querySelector(`.ad-surface-index`),links=rail.dataset.adRail==='surfaces'&&index?[...index.querySelectorAll('a')]:[];
  const current=()=>{const x=rail.scrollLeft;let best=0,dist=Infinity;items.forEach((el,i)=>{const d=Math.abs(el.offsetLeft-pad()-x);if(d<dist){dist=d;best=i;}});return best;};
  const go=i=>{const el=items[Math.max(0,Math.min(items.length-1,i))];rail.scrollTo({left:el.offsetLeft-pad(),behavior:behavior()});};
  const sync=()=>{
   const i=current(),on=scrollable(rail);
   out.innerHTML=`<b>${String(i+1).padStart(2,'0')}</b> / ${String(items.length).padStart(2,'0')}`;
   prev.disabled=!on||i===0;next.disabled=!on||i===items.length-1;
   links.forEach((a,k)=>{if(on&&k===i)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
  };
  prev.addEventListener('click',()=>go(current()-1));next.addEventListener('click',()=>go(current()+1));
  let frame=0;rail.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(sync);},{passive:true});
  addEventListener('resize',sync,{passive:true});
  links.forEach((a,k)=>a.addEventListener('click',e=>{
   if(!scrollable(rail))return; // desktop grid: native anchor jump
   e.preventDefault();rail.scrollIntoView({block:'nearest',behavior:behavior()});go(k);
  }));
  sync();
 }
})();
