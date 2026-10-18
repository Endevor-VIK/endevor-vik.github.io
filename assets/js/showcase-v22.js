/* V2.2: inexpensive, accessible section progress and navigation state */
(()=> {
 /* 0524 W3.A (F-02): the floating section label is retired at every width — the sticky menu and the swipe nav
    mark the current section (aria-current) and every section kicker carries its number */
 const ids=['top','about','creator','work','system','world-guide','vision','collaboration'];
 const nodes=ids.map(id=>({id,el:document.getElementById(id)})).filter(x=>x.el);
 const line=document.getElementById('v22-scroll-fill');
 const navLinks=[...document.querySelectorAll('.menu a[href^="#"],.show-mobile-nav a[href^="#"]')];
 const strip=document.querySelector('.show-mobile-nav');
 let scheduled=false,lastId=null;
 /* 0524 W1: the swipe strip follows the reader, so VISION and CONTACT come into view on their own (horizontal scroll only) */
 function reveal(a){
  if(!strip||!a||strip.scrollWidth<=strip.clientWidth)return;
  const l=a.offsetLeft-24,r=a.offsetLeft+a.offsetWidth+24;
  if(l<strip.scrollLeft)strip.scrollLeft=Math.max(0,l);
  else if(r>strip.scrollLeft+strip.clientWidth)strip.scrollLeft=r-strip.clientWidth;
 }
 function update(){
  scheduled=false;
  const root=document.documentElement;
  const max=Math.max(1,root.scrollHeight-innerHeight);
  if(line) line.style.width=(Math.min(100,Math.max(0,scrollY/max*100))).toFixed(1)+'%';
  let current=nodes[0];
  for(const n of nodes){if(n.el.getBoundingClientRect().top<=innerHeight*.35)current=n;}
  for(const a of navLinks){if(a.getAttribute('href')==='#'+current.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}
  if(current.id!==lastId){lastId=current.id;if(current.id==='top'&&strip)strip.scrollLeft=0;else reveal(strip&&strip.querySelector('a[href="#'+current.id+'"]'));}
 }
 /* 0524 W3.A (F-06): an anchor jump lands on the bridge question above a section, not under the sticky chrome —
    each bridged section's scroll-margin spans from the bridge's top edge to the section (html scroll-padding-top
    already covers the chrome); the CSS fallback in showcase-v22.css approximates it without JS */
 const bridged=[...document.querySelectorAll('.v22-bridge')].map(b=>({b,s:b.nextElementSibling})).filter(x=>x.s&&x.s.tagName==='SECTION'&&x.s.id);
 /* offsetTop, not the bounding box: unrevealed sections still carry the scroll-reveal translateY */
 function fitBridges(){for(const x of bridged)x.s.style.scrollMarginTop=(x.s.offsetTop-x.b.offsetTop)+'px';}
 fitBridges();
 if('ResizeObserver' in window){const ro=new ResizeObserver(fitBridges);for(const x of bridged)ro.observe(x.b);}
 addEventListener('resize',fitBridges,{passive:true});
 function request(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
 addEventListener('scroll',request,{passive:true});
 addEventListener('resize',request,{passive:true});
 update();
})();
