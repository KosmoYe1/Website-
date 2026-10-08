/* ============================================================
   EDITA AQUI AS DATAS DO CALENDÁRIO
   Formato: { data: "AAAA-MM-DD", titulo: "...", hora: "HH:MM", local: "...", descricao: "..." }
   Para adicionar um evento, copia uma linha e muda os valores.
   Para apagar, remove a linha. (Os de baixo são só exemplos.)
   ============================================================ */
const EVENTOS = [
  { data: "2026-10-17", titulo: "Jantar comunitário (exemplo)", hora: "19:30", local: "LAR.go Lisboa", descricao: "Jantar aberto a todos. Voluntários bem-vindos!" },
  { data: "2026-10-31", titulo: "Jantar comunitário (exemplo)", hora: "19:30", local: "LAR.go Lisboa", descricao: "" },
  { data: "2026-11-14", titulo: "Dia de voluntariado (exemplo)", hora: "10:00", local: "A confirmar", descricao: "Atividade de serviço à comunidade." }
];
/* ============================================================ */

const MESES=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const DOW=["S","T","Q","Q","S","S","D"];
const hoje=new Date();
let ano=hoje.getFullYear(), mes=hoje.getMonth(), sel=null;
const pad=n=>String(n).padStart(2,"0");
const key=(y,m,d)=>`${y}-${pad(m+1)}-${pad(d)}`;
const esc=s=>String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function render(){
  document.getElementById("mes").textContent=`${MESES[mes]} ${ano}`;
  const g=document.getElementById("dias");
  let h=DOW.map(d=>`<div class="dow">${d}</div>`).join("");
  const first=(new Date(ano,mes,1).getDay()+6)%7;
  const n=new Date(ano,mes+1,0).getDate();
  for(let i=0;i<first;i++)h+="<div></div>";
  for(let d=1;d<=n;d++){
    const k=key(ano,mes,d), has=EVENTOS.some(e=>e.data===k);
    const cls=["d",has&&"has",k===key(hoje.getFullYear(),hoje.getMonth(),hoje.getDate())&&"today",k===sel&&"sel"].filter(Boolean).join(" ");
    h+=`<button class="${cls}" data-k="${k}" ${has?"":"tabindex='-1'"}>${d}</button>`;
  }
  g.innerHTML=h;
  g.querySelectorAll(".has").forEach(b=>b.onclick=()=>{sel=sel===b.dataset.k?null:b.dataset.k;render()});
  lista();
}
function lista(){
  const pref=`${ano}-${pad(mes+1)}`;
  let ev=EVENTOS.filter(e=>sel?e.data===sel:e.data.startsWith(pref)).sort((a,b)=>a.data.localeCompare(b.data)||(a.hora||"").localeCompare(b.hora||""));
  const t=sel?`Dia ${sel.split("-").reverse().join("/")}`:`Eventos de ${MESES[mes]}`;
  document.getElementById("lista").innerHTML=`<h3 style="margin-top:0">${t}</h3>`+(ev.length?ev.map(e=>{
    const [y,m,d]=e.data.split("-");
    return `<div class="ev"><b>${esc(e.titulo)}</b><small>${d}/${m}/${y}${e.hora?" · "+esc(e.hora):""}${e.local?" · "+esc(e.local):""}</small>${e.descricao?`<div>${esc(e.descricao)}</div>`:""}</div>`;
  }).join(""):`<p class="empty">Sem eventos marcados.</p>`);
}
document.getElementById("prev").onclick=()=>{mes--;if(mes<0){mes=11;ano--}sel=null;render()};
document.getElementById("next").onclick=()=>{mes++;if(mes>11){mes=0;ano++}sel=null;render()};
render();

/* ============================================================
   FOTOS: cada foto é { src: "...", legenda: "..." }.
   Mete as imagens na pasta "fotos" e usa o caminho em "src",
   ex.: { src: "fotos/evento1.jpg", legenda: "Jantar de outubro" }.
   ============================================================ */
const FOTOS = [
  
];
(function(){
  const gal=document.getElementById("gal");
  gal.innerHTML=FOTOS.length?FOTOS.map((f,i)=>`<figure data-i="${i}"><img src="${f.src}" alt="${esc(f.legenda)}" loading="lazy"><figcaption>${esc(f.legenda)}</figcaption></figure>`).join(""):`<p class="empty">Ainda não há fotos. Em breve!</p>`;
  const lb=document.getElementById("lb");
  gal.onclick=e=>{const f=e.target.closest("figure");if(!f)return;const o=FOTOS[f.dataset.i];document.getElementById("lbimg").src=o.src;document.getElementById("lbcap").textContent=o.legenda||"";lb.hidden=false};
  lb.onclick=()=>lb.hidden=true;
  const home=document.getElementById("home"),fv=document.getElementById("fotos-view");
  function route(){
    const f=location.hash==="#fotos";
    home.hidden=f;fv.hidden=!f;
    document.querySelector(".navfotos").style.fontWeight=f?"800":"";
    if(f)window.scrollTo(0,0);
    else if(location.hash.length>1){const t=document.querySelector(location.hash);if(t)t.scrollIntoView()}
    else window.scrollTo(0,0);
  }
  window.addEventListener("hashchange",route);route();
})();
