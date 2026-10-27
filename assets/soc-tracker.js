/* Mini SOC Lab - analytics consensual de primeira parte.
   Configure abaixo o endereço HTTPS do seu Cloudflare Worker. */
(()=>{
  'use strict';
  const ENDPOINT = 'https://SUBSTITUA-PELO-SEU-WORKER.workers.dev';
  if(ENDPOINT.includes('SUBSTITUA-PELO-SEU-WORKER')) return;
  try {
    if(new URLSearchParams(location.search).has('soc_ignore')) {
      localStorage.setItem('mini_soc_ignore','1');
    }
    if(localStorage.getItem('mini_soc_ignore') === '1') return;
    const key='mini_soc_visitor_v1';
    let visitorId=localStorage.getItem(key);
    if(!visitorId){visitorId=crypto.randomUUID();localStorage.setItem(key,visitorId);}
    const payload={id:visitorId,path:location.pathname,referrer:document.referrer?new URL(document.referrer).hostname:'',tz:Intl.DateTimeFormat().resolvedOptions().timeZone||''};
    fetch(ENDPOINT.replace(/\/$/,'')+'/collect',{
      method:'POST',mode:'cors',keepalive:true,
      headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
    }).catch(()=>{});
  }catch(_e){}
})();
