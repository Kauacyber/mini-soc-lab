/* Mini SOC Lab: visual feedback only. No tracking, telemetry or backend modifications. */
(()=>{'use strict';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const selector='a[href],button:not([disabled]),[role="button"]';
const decorate=(root=document)=>{root.querySelectorAll(selector).forEach(el=>{if(el.dataset.clickFx)return;el.dataset.clickFx='1';el.classList.add('click-fx');if(el.matches('.card,.article-card,.path-card,[class*="card"],.feature-card'))el.classList.add('click-card')})};
const whenReady=()=>{decorate();document.body.classList.add('page-enter');
let lastNav=0;
document.addEventListener('pointerdown',e=>{const el=e.target.closest(selector);if(!el)return;el.classList.add('is-pressed');setTimeout(()=>el.classList.remove('is-pressed'),210)},{passive:true});
document.addEventListener('click',e=>{const el=e.target.closest(selector);if(!el)return;
if(!reduced){const rect=el.getBoundingClientRect();if(rect.width&&rect.height){const ripple=document.createElement('span');ripple.className='click-ripple';const x=e.detail?e.clientX-rect.left:rect.width/2,y=e.detail?e.clientY-rect.top:rect.height/2;ripple.style.setProperty('--x',x+'px');ripple.style.setProperty('--y',y+'px');ripple.style.setProperty('--r',Math.max(12,Math.ceil(Math.max(rect.width,rect.height)/8)));el.appendChild(ripple);ripple.addEventListener('animationend',()=>ripple.remove(),{once:true});setTimeout(()=>ripple.remove(),800)}}
if(el.matches('button')&&!el.matches('.menu-toggle,[type="submit"]')){el.classList.add('is-confirmed');setTimeout(()=>el.classList.remove('is-confirmed'),500)}
if(reduced||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
const a=el.closest('a[href]');if(!a||a.hasAttribute('download')||a.target&&a.target!=='_self')return;
let u;try{u=new URL(a.href,location.href)}catch{return}
if(u.origin!==location.origin||!['http:','https:','file:'].includes(u.protocol))return;
if(u.pathname===location.pathname&&u.search===location.search)return;
if(Date.now()-lastNav<350)return;
lastNav=Date.now();e.preventDefault();document.body.classList.add('page-exiting');setTimeout(()=>location.assign(u.href),185);
},false);
window.addEventListener('pageshow',()=>document.body.classList.remove('page-exiting'));
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',whenReady,{once:true});else whenReady();
})();
