/* =====================================================
   SISTEMA DE VERSÕES — injetado automaticamente
   Inclua nas páginas com: <script src="versao.js"></script>
   ===================================================== */

(function(){

  if(typeof supabaseClient === "undefined"){
    return;
  }

  /* ---------- 1. Estilos ---------- */

  const estilo = document.createElement("style");
  estilo.textContent = `
    .versao-atual{
      padding:12px 14px;
      margin:12px 8px 0 8px;
      border-radius:10px;
      background:rgba(59,130,246,0.1);
      border:1px solid rgba(59,130,246,0.3);
      color:#93c5fd;
      font-size:13px;
      cursor:pointer;
      text-align:center;
      transition:0.2s;
      position:relative;
    }
    .versao-atual:hover{
      background:rgba(59,130,246,0.18);
    }
    @media (max-width: 860px){
      .sidebar-footer{
        display:block !important;
        padding:0 2px;
        text-align:center;
        font-size:9px;
        line-height:1.35;
      }
      .sidebar-footer svg{
        height:30px !important;
        margin-bottom:5px !important;
      }
      .versao-atual{
        display:block !important;
        margin:8px 0 0 0;
        padding:8px 2px;
        font-size:9px;
      }
      .versao-atual span{
        font-size:0 !important;
        padding:4px !important;
        margin:0 !important;
        position:absolute;
        top:3px;
        right:3px;
        border-radius:50% !important;
      }
    }
  `;
  document.head.appendChild(estilo);

  /* ---------- 2. Botão da versão na sidebar ---------- */

  if(!document.getElementById("btnVersao")){
    const sidebar = document.querySelector(".sidebar");
    if(sidebar){
      sidebar.insertAdjacentHTML(
        "beforeend",
        '<div class="versao-atual" id="btnVersao">Versão ...</div>'
      );
    }
  }

  const btnVersao = document.getElementById("btnVersao");

  if(btnVersao){
    btnVersao.onclick = abrirModalVersoes;
  }

  /* ---------- 3. Modal de histórico ---------- */

  document.body.insertAdjacentHTML("beforeend", `
    <div id="modalVersoes" style="
      display:none;
      position:fixed;
      inset:0;
      background:rgba(0,0,0,0.7);
      z-index:100;
      align-items:center;
      justify-content:center;
      padding:20px;
    ">
      <div style="
        background:#0f1a2e;
        border:1px solid rgba(255,255,255,0.1);
        border-radius:16px;
        max-width:600px;
        width:100%;
        max-height:80vh;
        display:flex;
        flex-direction:column;
        overflow:hidden;
      ">
        <div style="
          padding:20px 24px;
          border-bottom:1px solid rgba(255,255,255,0.08);
          display:flex;
          justify-content:space-between;
          align-items:center;
        ">
          <h2 style="color:#fff; font-size:20px; margin:0;">Histórico de versões</h2>
          <button
            id="fecharModalVersoesBtn"
            style="
              background:none;
              border:none;
              color:#94a3b8;
              font-size:24px;
              cursor:pointer;
              padding:0;
              line-height:1;
            ">×</button>
        </div>
        <div id="modalConteudo" style="
          padding:16px 24px;
          overflow-y:auto;
          display:flex;
          flex-direction:column;
          gap:14px;
        "></div>
      </div>
    </div>
  `);

  /* ---------- 4. Funções ---------- */

  let todasVersoes = [];

  function escapeSeguro(texto){
    return String(texto || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function formatarDataVersao(data){
    return new Date(data).toLocaleDateString(
      "pt-BR",
      { day:"2-digit", month:"2-digit", year:"numeric" }
    );
  }

  function renderizarModalVersoes(){

    const container =
      document.getElementById("modalConteudo");

    if(todasVersoes.length === 0){
      container.innerHTML =
        '<div style="color:#8fa3bb; text-align:center; padding:30px 0;">Nenhuma versão registrada ainda.</div>';
      return;
    }

    container.innerHTML = todasVersoes.map(v => `
      <div style="
        background:#101a2c;
        border:1px solid rgba(255,255,255,0.07);
        border-radius:12px;
        padding:16px 18px;
        display:flex;
        flex-direction:column;
        gap:8px;
      ">
        <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
          <span style="
            background:rgba(59,130,246,0.15);
            color:#93c5fd;
            padding:4px 10px;
            border-radius:999px;
            font-size:12px;
            font-weight:bold;
          ">v${escapeSeguro(v.numero)}</span>
          <span style="color:#64748b; font-size:12px;">
            ${formatarDataVersao(v.criado_em)}
          </span>
        </div>
        <div style="color:#fff; font-size:15px; font-weight:bold;">
          ${escapeSeguro(v.titulo)}
        </div>
        <div style="color:#cbd5e1; font-size:14px; line-height:1.55; white-space:pre-wrap;">
          ${escapeSeguro(v.descricao)}
        </div>
      </div>
    `).join("");
  }

  function verificarNovidades(){

    if(todasVersoes.length === 0) return;

    const ultimaData =
      new Date(todasVersoes[0].criado_em).getTime();

    const ultimaVista =
      parseInt(localStorage.getItem("ultimaVersaoVista") || "0", 10);

    if(ultimaData > ultimaVista && btnVersao){
      if(!btnVersao.querySelector("span")){
        const badge = document.createElement("span");
        badge.className = "badge-novidades";
        badge.innerText = "Novidades!";
        badge.style.cssText =
          "background:#16a34a; color:white; padding:3px 8px; border-radius:999px; font-size:11px; margin-left:8px; font-weight:bold;";
        btnVersao.appendChild(badge);
      }
    }
  }

  async function carregarVersoes(){

    const { data, error } =
      await supabaseClient
        .from("versoes")
        .select("*")
        .order("criado_em", { ascending: false });

    if(error){
      console.log(error);
      return;
    }

    todasVersoes = data || [];

    if(btnVersao){
      btnVersao.innerText =
        "v" + (todasVersoes[0] ? todasVersoes[0].numero : "0.0.0");
      verificarNovidades();
    }
  }

  function abrirModalVersoes(){

    renderizarModalVersoes();

    document.getElementById("modalVersoes")
      .style.display = "flex";

    if(todasVersoes.length > 0){
      localStorage.setItem(
        "ultimaVersaoVista",
        String(new Date(todasVersoes[0].criado_em).getTime())
      );
      const badge = btnVersao && btnVersao.querySelector("span");
      if(badge) badge.remove();
    }
  }

  function fecharModalVersoes(){
    document.getElementById("modalVersoes")
      .style.display = "none";
  }

  /* ---------- 5. Eventos ---------- */

  document.getElementById("fecharModalVersoesBtn")
    .addEventListener("click", fecharModalVersoes);

  document.getElementById("modalVersoes")
    .addEventListener("click", function(e){
      if(e.target.id === "modalVersoes"){
        fecharModalVersoes();
      }
    });

  /* ---------- 6. Iniciar ---------- */

  carregarVersoes();

})();
