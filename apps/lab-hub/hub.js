(()=>{
const TOOLS=(window.LAB_INDEX||[]).map(x=>({...x}));
const $=id=>document.getElementById(id),ui={guideFields:$("guideFields"),pickList:$("pickList"),pickState:$("pickState"),recent:$("recent"),recentList:$("recentList"),tabs:$("tabs"),search:$("search"),directory:$("directory"),summary:$("summary")};
if(!TOOLS.length||Object.values(ui).some(v=>!v)){document.body.innerHTML='<main style="padding:32px;font-family:system-ui">도구 목록을 불러오지 못했습니다.</main>';return}
const GA_ID="",CLARITY_ID="";
if(GA_ID){const s=document.createElement("script");s.async=1;s.src="https://www.googletagmanager.com/gtag/js?id="+GA_ID;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config",GA_ID)}
if(CLARITY_ID){(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script",CLARITY_ID)}
function track(n,p={}){window.gtag&&gtag("event",n,p);if(window.clarity){clarity("event",n);Object.entries(p).forEach(([k,v])=>clarity("set",k,String(v)))}}
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const cats=["전체",...new Set(TOOLS.map(t=>t.cat))];
const guideDefs=[
["need","지금 고민",["오늘","돈","관계","집","가족","커리어","건강","디지털","여행","콘텐츠","배움","나"]],
["time","쓸 수 있는 시간",["5분","15분","30분+"]],
["energy","결정할 힘",["거의 없음","보통","차분히 볼 수 있음"]]
];
let guide={need:"오늘",time:"5분",energy:"거의 없음"},category="전체",query="";
function markUse(t,source){let r=[];try{r=JSON.parse(localStorage.getItem("today-decision:recent")||"[]")}catch(e){}r=[t.slug,...r.filter(x=>x!==t.slug)].slice(0,8);try{localStorage.setItem("today-decision:recent",JSON.stringify(r))}catch(e){}track("hub_lab_click",{lab_slug:t.slug,lab_num:t.num,category:t.cat,entry_source:source});}
function recommendationScore(t){let s=t.cat===guide.need?12:0;
const quick=[4,5,7,12,14,15,20,23,24,25,26,27,30,32,47,51,52,56,60,67,81,82,83,87,90,92,100];
const lowEnergy=[2,8,9,13,15,24,26,27,31,37,38,40,47,49,50,61,64,65,72,80,89,90,91,93,97,99,100];
if(guide.time==="5분"&&quick.includes(t.num))s+=4;if(guide.time==="15분"&&t.num%3!==0)s+=2;if(guide.energy==="거의 없음"&&lowEnergy.includes(t.num))s+=4;
if(guide.need==="오늘"&&["오늘","건강","여행"].includes(t.cat))s+=2;
return s+(101-t.num)/1000}
function renderGuide(){ui.guideFields.innerHTML=guideDefs.map(([key,label,vals])=>`<div class="guide-field"><label>${label}</label><div class="chips">${vals.map(v=>`<button type="button" class="chip ${guide[key]===v?"on":""}" data-key="${key}" data-value="${v}">${v}</button>`).join("")}</div></div>`).join("");
ui.guideFields.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{guide[b.dataset.key]=b.dataset.value;track("hub_filter_change",{filter:b.dataset.key,value:b.dataset.value});renderGuide()});
const picks=[...TOOLS].sort((a,b)=>recommendationScore(b)-recommendationScore(a)||a.num-b.num).slice(0,3);ui.pickState.textContent=guide.need+" · "+guide.time;
ui.pickList.innerHTML=picks.map((t,i)=>`<a class="pick" href="${t.url}" data-slug="${t.slug}"><span class="n">0${i+1}</span><strong>${esc(t.title)}</strong><span>→</span></a>`).join("");
ui.pickList.querySelectorAll("a").forEach(a=>a.onclick=()=>markUse(TOOLS.find(t=>t.slug===a.dataset.slug),"recommendation"))}
function renderTabs(){ui.tabs.innerHTML=cats.map(c=>`<button type="button" class="tab ${category===c?"on":""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
ui.tabs.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{category=b.dataset.cat;track("hub_category_select",{category});renderTabs();renderDirectory()})}
function renderDirectory(){const q=query.trim().toLowerCase();const items=TOOLS.filter(t=>(category==="전체"||t.cat===category)&&(!q||(t.title+" "+t.desc+" "+t.cat+" "+t.slug).toLowerCase().includes(q)));
ui.directory.innerHTML=items.length?items.map(t=>`<a class="tool" href="${t.url}" data-slug="${t.slug}"><span class="labno">LAB-${String(t.num).padStart(3,"0")}</span><h3>${esc(t.title)}</h3><span class="cat">${esc(t.cat)}</span><p>${esc(t.desc)}</p><span class="open">열기 →</span></a>`).join(""):`<div class="empty">조건에 맞는 도구가 없습니다.</div>`;
ui.directory.querySelectorAll(".tool").forEach(a=>a.onclick=()=>markUse(TOOLS.find(t=>t.slug===a.dataset.slug),"directory"))}
function renderRecent(){let recent=[];try{recent=JSON.parse(localStorage.getItem("today-decision:recent")||"[]")}catch(e){}const items=recent.map(s=>TOOLS.find(t=>t.slug===s)).filter(Boolean);ui.recent.classList.toggle("on",items.length>0);ui.recentList.innerHTML=items.map(t=>`<a href="${t.url}" data-slug="${t.slug}">${esc(t.title)}</a>`).join("");ui.recentList.querySelectorAll("a").forEach(a=>a.onclick=()=>markUse(TOOLS.find(t=>t.slug===a.dataset.slug),"recent"))}
function renderSummary(){const counts=cats.filter(c=>c!=="전체").map(c=>[c,TOOLS.filter(t=>t.cat===c).length]);ui.summary.innerHTML=counts.map(([c,n])=>`<div class="summary-item"><b>${n}</b><span>${esc(c)}</span></div>`).join("")}
ui.search.oninput=e=>{query=e.target.value;renderDirectory();track("hub_search",{query_length:query.length})};
const legacy=new URLSearchParams(location.search).get("lab");if(legacy){const t=TOOLS.find(x=>x.slug===legacy);if(t){location.replace(t.url);return}}
renderGuide();renderTabs();renderDirectory();renderRecent();renderSummary();track("hub_view",{tool_count:TOOLS.length});
})();