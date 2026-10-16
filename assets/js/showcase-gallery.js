/* AXIOM Showcase / accessible screenshot viewer */
(()=>{const dialog=document.getElementById('showcase-lightbox');
if(!dialog)return;
const image=document.getElementById('showcase-full-image');
const caption=document.getElementById('showcase-full-caption');
const closeBtn=dialog.querySelector('.show-lightbox-close');
const triggers=[...document.querySelectorAll('.show-shot-trigger')];
let returnTo=null;
/* origin = the control that opened the viewer (gallery card or WORK stage button); focus returns there without scrolling */
function open(index,origin){const btn=triggers[index];if(!btn)return;
 returnTo=origin||btn;image.src=btn.dataset.showcaseSrc;image.alt=btn.dataset.showcaseTitle;caption.textContent=btn.dataset.showcaseTitle;
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
 closeBtn.focus();}
function restore(){image.removeAttribute('src');if(returnTo){returnTo.focus({preventScroll:true});returnTo=null}}
function close(){if(typeof dialog.close==='function'&&dialog.open)dialog.close();else{dialog.removeAttribute('open');restore()}}
triggers.forEach((btn,i)=>btn.addEventListener('click',()=>open(i)));
closeBtn.addEventListener('click',close);
dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
dialog.addEventListener('close',restore);
window.AXShowcaseLightbox={open};
})();
