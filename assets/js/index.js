const indexCursor = document.getElementById('indexCursor');
const isMobileViewport = window.matchMedia('(max-width: 640px), (prefers-reduced-motion: reduce)').matches;

if(indexCursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches){
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let cursorRaf = null;

  const placeCursor = () => {
    cursorRaf = null;
    indexCursor.style.left = cx + 'px';
    indexCursor.style.top = cy + 'px';
  };

  window.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
    indexCursor.style.opacity = '1';
    if (cursorRaf === null) cursorRaf = requestAnimationFrame(placeCursor);
  });
  window.addEventListener('mouseleave', () => { indexCursor.style.opacity = '0'; });
  window.addEventListener('mouseenter', () => { indexCursor.style.opacity = '1'; });

  document.addEventListener('mouseover', (e) => {
    const interactive = e.target.closest('a, button, [role="button"], input, textarea, select, label');
    indexCursor.classList.toggle('active', Boolean(interactive));
  });
}

// reveal sections on scroll (disabled on mobile for simpler/readable flow)
if(isMobileViewport){
  document.querySelectorAll('section').forEach((s)=>{
    s.style.opacity=1;
    s.style.transform='none';
  });
} else {
  const io = new IntersectionObserver((entries)=>{
    for(const e of entries){
      if(e.isIntersecting){
        e.target.style.opacity=1;
        e.target.style.transform='translateY(0)';
        io.unobserve(e.target);
      }
    }
  },{threshold:0.08});
  document.querySelectorAll('section').forEach(s=>{
    if(s.id === 'world'){
      s.style.opacity=1;
      s.style.transform='none';
      return;
    }
    s.style.opacity=0;
    s.style.transform='translateY(24px)';
    s.style.transition='opacity .8s ease, transform .8s cubic-bezier(.2,.8,.2,1)';
    io.observe(s);
  });
}
// keep hero visible immediately
const hero = document.querySelector('.hero');
if(hero){hero.style.opacity=1;hero.style.transform='none'}

// ECHELON scene frozen to existing PNG. The original scene HTML remains archived.
