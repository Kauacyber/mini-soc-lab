/* Mini SOC Lab | by Kauã — telemetria consentida (v2)
 * Não identifica nomes. Não monitora teclado, formulários ou outras abas.
 * Configure apenas o endereço público do Worker; NUNCA coloque token admin aqui.
 */
(()=>{
  'use strict';
  const ENDPOINT='https://mini-soc-monitor.kauadossantosnunes3.workers.dev';
  const ACTIVE_URL=ENDPOINT.replace(/\/$/,'')+'/collect';
  const CONSENT_KEY='mini_soc_analytics_consent_v2';
  const IGNORE_KEY='mini_soc_ignore';
  const VISITOR_KEY='mini_soc_visitor_v1';
  const SESSION_KEY='mini_soc_session_v2';
  const IDLE_MS=30*60*1000;
  const PING_MS=10*1000; // Verifica atividade apenas enquanto a página estiver visível.
  let on=false,visitorId='',sessionId='',activeMs=0,visibleSince=null,pingTimer=null,lastVisibleAt=Date.now();
  const enabled=!ENDPOINT.includes('SUBSTITUA-PELO-SEU-WORKER');
  const consent=()=>{try{return localStorage.getItem(CONSENT_KEY)||'unset';}catch{return 'unset';}};
  const ignored=()=>{try{return localStorage.getItem(IGNORE_KEY)==='1'||new URLSearchParams(location.search).has('soc_ignore');}catch{return true;}};
  function uuid(){return crypto.randomUUID();}
  function path(){return location.pathname.slice(0,200);}
  function referrer(){try{return document.referrer?new URL(document.referrer).hostname.slice(0,120):'';}catch{return '';}}
  function elapsed(){return Math.min(86400,Math.round((activeMs+(visibleSince!==null?performance.now()-visibleSince:0))/1000));}
  function payload(event){return JSON.stringify({event,id:visitorId,session:sessionId,path:path(),referrer:referrer(),seconds:elapsed()});}
  function post(event,beacon=false){
    if(!on||!enabled)return;
    const data=payload(event);
    try{
      if(beacon&&navigator.sendBeacon){
        const blob=new Blob([data],{type:'text/plain'});
        if(navigator.sendBeacon(ACTIVE_URL,blob))return;
      }
      fetch(ACTIVE_URL,{method:'POST',mode:'cors',keepalive:beacon,headers:{'Content-Type':'text/plain'},body:data,credentials:'omit'}).catch(()=>{});
    }catch{}
  }
  function storeSession(){try{sessionStorage.setItem(SESSION_KEY,JSON.stringify({session:sessionId,used:Date.now(),total:elapsed()}));}catch{}}
  function pause(){if(visibleSince!==null){activeMs+=performance.now()-visibleSince;visibleSince=null;}clearInterval(pingTimer);pingTimer=null;storeSession();}
  function play(){if(visibleSince===null)visibleSince=performance.now();lastVisibleAt=Date.now();if(!pingTimer)pingTimer=setInterval(()=>{if(document.visibilityState==='visible'){storeSession();post('ping');}},PING_MS);}
  function verifiedSession(old){return typeof old.used==='number'&&typeof old.session==='string'&&/^[a-f0-9-]{36}$/i.test(old.session);}
  function start(){
    if(on||!enabled||ignored()||consent()!=='yes')return;
    try{
      visitorId=localStorage.getItem(VISITOR_KEY)||uuid();localStorage.setItem(VISITOR_KEY,visitorId);
      const old=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');
      if(old&&verifiedSession(old)&&Date.now()-old.used<IDLE_MS){sessionId=old.session;activeMs=Math.max(0,Math.min(86400,Number(old.total)||0))*1000;}else{sessionId=uuid();activeMs=0;}
      storeSession();
      on=true;
      if(document.visibilityState==='visible')play();
      post('view');
    }catch{}
  }
  document.addEventListener('visibilitychange',()=>{
    if(!on)return;
    if(document.visibilityState==='hidden'){pause();lastVisibleAt=Date.now();post('hidden',true);}else{
      const returnedAfterIdle=Date.now()-lastVisibleAt>=IDLE_MS;
      if(returnedAfterIdle){sessionId=uuid();activeMs=0;visibleSince=null;}
      play();storeSession();post(returnedAfterIdle?'view':'resume');
    }
  });
  window.addEventListener('pagehide',()=>{if(!on)return;pause();post('hidden',true);});
  function setConsent(value){
    try{
      localStorage.setItem(CONSENT_KEY,value);
      if(value==='no'){
        on=false;pause();localStorage.removeItem(VISITOR_KEY);sessionStorage.removeItem(SESSION_KEY);
      }
    }catch{}
    document.querySelector('.soc-consent')?.remove();
    if(value==='yes')start();
    document.dispatchEvent(new CustomEvent('mini-soc-consent-changed',{detail:value}));
  }
  window.miniSocConsent={get:consent,set:setConsent};
  if(ignored()){
    try{localStorage.setItem(IGNORE_KEY,'1');}catch{}
    return;
  }
  if(consent()==='yes')start();
  else if(consent()==='unset'){
    const show=()=>{
      if(consent()!=='unset'||ignored())return;
      const box=document.createElement('section');box.className='soc-consent';box.setAttribute('role','region');box.setAttribute('aria-label','Preferência de análise de visitas');
      box.innerHTML='<div><strong>Privacidade no Mini SOC Lab</strong><p>Podemos registrar, com sua permissão, páginas acessadas, um código anônimo para reconhecer retornos, IP mascarado, informações aproximadas do dispositivo e tempo estimado de visita para estudos de segurança. O código pode permanecer até 90 dias sem novo acesso. Não identificamos seu nome. <a href="'+(location.pathname.includes('/artigos/')?'../':'')+'privacidade.html">Saiba mais</a>.</p></div><div class="soc-consent-buttons"><button type="button" data-action="no">Recusar</button><button type="button" data-action="yes">Permitir análise</button></div>';
      box.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>setConsent(button.dataset.action)));
      document.body.append(box);
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show,{once:true});else show();
  }
})();
