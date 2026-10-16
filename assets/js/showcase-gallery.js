/* AXIOM Showcase / accessible screenshot viewer */
(()=>{const dialog=document.getElementById('showcase-lightbox');
if(!dialog)return;
const image=document.getElementById('showcase-full-image');
const caption=document.getElementById('showcase-full-caption');
const closeBtn=dialog.querySelector('.show-lightbox-close');
let lastTrigger=null;
document.querySelectorAll('.show-shot-trigger').forEach(btn=>btn.addEventListener('click',()=>{
 lastTrigger=btn;image.src=btn.dataset.showcaseSrc;image.alt=btn.dataset.showcaseTitle;caption.textContent=btn.dataset.showcaseTitle;
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
 closeBtn.focus();
}));
function close(){if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open');image.removeAttribute('src');lastTrigger?.focus();}
closeBtn.addEventListener('click',close);
dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
dialog.addEventListener('close',()=>{image.removeAttribute('src');lastTrigger?.focus()});
})();