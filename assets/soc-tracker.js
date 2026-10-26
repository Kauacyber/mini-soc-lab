
/* Mini SOC Lab — Monitoramento */
(() => {
  "use strict";

  const ENDPOINT =
    "https://mini-soc-monitor.kauadossantosnunes3.workers.dev/event";

  // Não registrar visitas quando o usuário optar por não participar
  const params = new URLSearchParams(location.search);

  if (params.has("soc_ignore")) {
    localStorage.setItem("mini_soc_ignore", "1");
  }

  if (localStorage.getItem("mini_soc_ignore") === "1") {
    return;
  }

  // Identificador aleatório para reconhecer visitas recorrentes
  const KEY = "mini_soc_visitor_v1";
  let visitanteId = localStorage.getItem(KEY);

  if (!visitanteId) {
    visitanteId = crypto.randomUUID();
    localStorage.setItem(KEY, visitanteId);
  }

  // Enviar evento ao Cloudflare Worker
  fetch(ENDPOINT, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      visitante_id: visitanteId,
      pagina: location.pathname
    })
  }).catch(() => {
    // Falhas de rede não interrompem a navegação
  });
})();
