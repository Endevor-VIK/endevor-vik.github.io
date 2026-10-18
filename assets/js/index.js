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

// reveal an in-page anchor target before the browser scrolls to it, so the pending
// translateY(24px) of an unrevealed section does not shift the landing position
const revealTarget = (id) => {
  const target = id && document.getElementById(id);
  const section = target && (target.closest('section') || target);
  if(section){section.style.transition='none';section.style.opacity=1;section.style.transform='none'}
};
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if(link) revealTarget(decodeURIComponent(link.getAttribute('href').slice(1)));
}, true);
if(location.hash) revealTarget(decodeURIComponent(location.hash.slice(1)));

// 0524 W3.A (F-01M): on phones the HERO radar is part of the first screen; Save-Data, low-memory and two-core
// devices get it still (CSS loops off in showcase-v23.css via .ax-lite, SMIL paused below). Content is unchanged.
const conn = navigator.connection;
const lite = !!(conn && conn.saveData) || (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
if(lite) document.documentElement.classList.add('ax-lite');
const heroRadar = document.querySelector('.hero .radar svg');

// prefers-reduced-motion must also stop SVG SMIL loops (<animate>), which the CSS media query cannot reach
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const syncSmil = () => {
  document.querySelectorAll('svg').forEach((svg) => {
    if(svg.ownerSVGElement || !svg.querySelector('animate, animateTransform, animateMotion')) return;
    if(reducedMotion.matches || (lite && svg === heroRadar)){svg.pauseAnimations();svg.setCurrentTime(0)}
    else svg.unpauseAnimations();
  });
};
syncSmil();
if(reducedMotion.addEventListener) reducedMotion.addEventListener('change', syncSmil);

// ECHELON scene frozen to existing PNG. The original scene HTML remains archived.
