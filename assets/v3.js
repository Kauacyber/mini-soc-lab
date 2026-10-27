(()=>{
 'use strict';
 // 100% local, purely educational scenarios. No network calls for this widget.
 const scenarios=[
  ['AUTH_FAIL · 5 falhas de autenticação em 60 s','Possível tentativa automatizada, mas também pode ser um usuário com senha desatualizada. Correlacione contas e origem.','Revisar histórico de autenticação e contexto.'],
  ['DNS_LOOKUP · consultas para domínio incomum','Um domínio desconhecido não prova infecção. É necessário considerar reputação, frequência, dispositivo e contexto.','Reunir eventos DNS e confirmar finalidade das consultas.'],
  ['WEB_404 · 23 erros de caminho em 2 min','Pode ser um scanner de caminhos, um crawler ou links antigos. A repetição isolada não confirma ataque.','Comparar User-Agent, sequência de páginas e origem, respeitando a privacidade.'],
  ['LOGIN_OK · novo dispositivo no perfil','Mudança de dispositivo pode ser normal. Avalie horário, histórico de autenticação e eventos relacionados.','Verificar se houve alteração de conta ou comunicação legítima com o usuário.']
 ];
 const next=document.getElementById('sim-next-button');
 if(next){let i=0;next.addEventListener('click',()=>{i=(i+1)%scenarios.length;['sim-event','sim-explain','sim-next'].forEach((id,j)=>{document.getElementById(id).textContent=scenarios[i][j]});document.getElementById('sim-counter').textContent=`Cenário ${i+1} de ${scenarios.length}`;});}
 const search=document.getElementById('glossary-search');
 if(search){const terms=[...document.querySelectorAll('.v3-term')],empty=document.getElementById('glossary-empty');const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();search.addEventListener('input',()=>{let count=0,q=normalize(search.value.trim());terms.forEach(t=>{let show=normalize(t.dataset.term).includes(q);t.hidden=!show;if(show)count++;});empty.hidden=count!==0;});}
 const opt=document.getElementById('privacy-optout'),status=document.getElementById('privacy-status');
 if(opt){const render=()=>{let off=false;try{off=localStorage.getItem('mini_soc_ignore')==='1'}catch{}opt.textContent=off?'Reativar telemetria de página':'Desativar telemetria de página';status.textContent=off?'Preferência local: telemetria de página desativada neste navegador.':'Preferência local: telemetria de página permitida, quando o Worker estiver configurado.';};opt.addEventListener('click',()=>{try{if(localStorage.getItem('mini_soc_ignore')==='1'){localStorage.removeItem('mini_soc_ignore');}else{localStorage.setItem('mini_soc_ignore','1');}render();}catch{status.textContent='Seu navegador bloqueou o armazenamento local. A preferência não pôde ser salva.';}});render();}
})();
