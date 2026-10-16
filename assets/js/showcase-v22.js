/* V2.2: inexpensive, accessible section progress and navigation state */
(()=> {
 const items=[
  ['top','00 / ENTRY'],['about','01 / AXIOM'],['creator','02 / CREATOR'],
  ['work','03 / WORK'],['system','04 / SYSTEM'],['world-guide','05 / WORLD'],
  ['vision','06 / VISION'],['collaboration','07 / COLLABORATION']
 ];
 const nodes=items.map(([id,name])=>({id,name,el:document.getElementById(id)})).filter(x=>x.el);
 const indicator=document.getElementById('v22-current-section');
 const line=document.getElementById('v22-scroll-fill');
 const navLinks=[...document.querySelectorAll('.menu a[href^="#"],.show-mobile-nav a[href^="#"]')];
 let scheduled=false;
 function update(){
  scheduled=false;
  const root=document.documentElement;
  const max=Math.max(1,root.scrollHeight-innerHeight);
  if(line) line.style.width=(Math.min(100,Math.max(0,scrollY/max*100))).toFixed(1)+'%';
  let current=nodes[0];
  for(const n of nodes){if(n.el.getBoundingClientRect().top<=innerHeight*.35)current=n;}
  if(indicator)indicator.textContent=current.name;
  for(const a of navLinks){if(a.getAttribute('href')==='#'+current.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}
 }
 function request(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
 addEventListener('scroll',request,{passive:true});
 addEventListener('resize',request,{passive:true});
 update();
})();