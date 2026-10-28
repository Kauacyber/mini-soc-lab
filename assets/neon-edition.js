/* Visual-only interaction layer: never reads or alters visitor tracking */
(()=>{'use strict';const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress=document.createElement('div');progress.className='scene-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
let ticking=false;function update(){const denom=document.documentElement.scrollHeight-innerHeight;progress.style.width=(denom>0?Math.min(100,scrollY/denom*100):0)+'%';ticking=false}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});update();
if(reduced)return;
const cursor=document.createElement('div');cursor.className='scene-cursor';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);
if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.body.classList.add('has-pointer');document.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'},{passive:true});document.addEventListener('pointerover',e=>{cursor.classList.toggle('is-hover',!!e.target.closest('a,button'))})}
document.addEventListener('click',e=>{const el=e.target.closest('a,button');if(!el||el.classList.contains('menu-button'))return;const r=el.getBoundingClientRect();if(r.width<35||r.height<20)return;const cs=getComputedStyle(el);if(cs.position==='static')el.style.position='relative';const dot=document.createElement('span');dot.className='press-pulse';dot.style.left=e.clientX-r.left+'px';dot.style.top=e.clientY-r.top+'px';el.append(dot);setTimeout(()=>dot.remove(),580)});
})();