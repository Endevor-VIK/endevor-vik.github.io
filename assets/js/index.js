const indexCursor = document.getElementById('indexCursor');
const isMobileViewport = window.matchMedia('(max-width: 640px)').matches;

document.querySelectorAll('.enter').forEach((btn) => {
  btn.addEventListener('click', () => {
    window.location.href = '404.html';
  });
});

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

// lazily mount the heavy world scene only when it nears the viewport (desktop)
const worldSceneSlot = document.querySelector('[data-scene-slot]');
if(worldSceneSlot){
  const sceneSrc = 'content-html/echelon-node-v2.html?embed=1&fit=frame&zoom=1.03&rev=av_off_10';
  let sceneFrame = null;

  const mountWorldScene = () => {
    if(sceneFrame) return;
    worldSceneSlot.dataset.loaded = '1';

    sceneFrame = document.createElement('iframe');
    sceneFrame.className = 'world-scene-frame';
    sceneFrame.title = 'ECHELON NODE';
    sceneFrame.loading = 'eager';
    sceneFrame.fetchPriority = 'low';
    sceneFrame.setAttribute('aria-hidden', 'true');
    sceneFrame.setAttribute('tabindex', '-1');
    sceneFrame.src = sceneSrc;
    sceneFrame.addEventListener('load', () => {
      worldSceneSlot.classList.add('is-ready');
    }, { once: true });

    worldSceneSlot.appendChild(sceneFrame);
  };

  const desktopMql = window.matchMedia('(min-width: 641px)');
  const mountIfDesktop = () => { if(desktopMql.matches) mountWorldScene(); };

  // defer the heavy 11k-line scene until the World section approaches the viewport
  if('IntersectionObserver' in window){
    const sceneIO = new IntersectionObserver((entries, obs) => {
      if(entries.some((e) => e.isIntersecting)){ obs.disconnect(); mountIfDesktop(); }
    }, { rootMargin: '600px 0px' });
    sceneIO.observe(worldSceneSlot);
  } else {
    mountIfDesktop();
  }

  // if the viewport grows to desktop while the slot is already near view, mount it
  const onDesktopChange = (e) => {
    if(e.matches){
      const r = worldSceneSlot.getBoundingClientRect();
      if(r.top < window.innerHeight + 600) mountWorldScene();
    }
  };
  if(desktopMql.addEventListener){ desktopMql.addEventListener('change', onDesktopChange); }
  else if(desktopMql.addListener){ desktopMql.addListener(onDesktopChange); }
}
