(()=>{
const ALL=[...(window.LABS_A||[]),...(window.LABS_B||[]),...(window.LABS_C||[]),...(window.LABS_D||[]),...(window.LABS_E||[]),...(window.LABS_F||[])];
const INDEX=window.LAB_INDEX||[];
const params=new URLSearchParams(location.search);
const pathSlug=location.pathname.split("/").filter(Boolean).pop();
const slug=window.LAB_SLUG||params.get("lab")||((pathSlug&&pathSlug!=="labs")?pathSlug:"running-today");
const raw=ALL.find(x=>x[1]===slug)||ALL[0];
if(!raw){document.body.innerHTML='<main style="padding:32px;font-family:system-ui">도구 데이터를 불러오지 못했습니다.</main>';return}
const C={num:raw[0],slug:raw[1],title:raw[2],subtitle:raw[3],motif:raw[4],accent:raw[5],bg:raw[6],ink:raw[7],
controls:raw[8].map(x=>({key:x[0],label:x[1],values:x[2]})),
results:raw[9].map(x=>({title:x[0],why:x[1],meta:x[2]||[],steps:x[3]||[],match:x[4]||{}})),
note:raw[10]||"개인화 결과는 현재 선택값을 정리하기 위한 참고용입니다."};
const I=INDEX.find(x=>x.slug===C.slug)||{cat:"생활",desc:C.subtitle,url:"/labs/"+C.slug+"/"};
C.cat=I.cat||"생활";C.defaults=Object.fromEntries(C.controls.map(x=>[x.key,x.values[0][0]]));
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const kind=(window.LAB_KINDS||{})[C.slug]||("lab-"+C.num);
document.documentElement.style.cssText=`--bg:${C.bg};--ink:${C.ink};--accent:${C.accent}`;
document.body.dataset.layout=kind;document.body.dataset.lab=String(C.num);
const st=document.createElement("style");st.textContent=(window.LAB_BASE_CSS||"")+((window.LAB_CSS||{})[kind]||"");document.head.appendChild(st);
const template=(window.LAB_LAYOUTS||{})[C.slug]||(window.LAB_LAYOUTS||{})["running-today"];
if(!template){document.body.innerHTML='<main style="padding:32px;font-family:system-ui">화면 구성을 불러오지 못했습니다.</main>';return}
document.body.innerHTML=template
.replaceAll("__TITLE__",esc(C.title)).replaceAll("__SUB__",esc(C.subtitle))
.replaceAll("__NUM__",String(C.num).padStart(3,"0")).replaceAll("__CAT__",esc(C.cat)).replaceAll("__MOTIF__",esc(C.motif||C.cat));
document.title=C.title+" | 오늘결정";
function setMeta(name,value,property=false){let node=document.head.querySelector(`meta[${property?"property":"name"}="${name}"]`);if(!node){node=document.createElement("meta");node.setAttribute(property?"property":"name",name);document.head.appendChild(node)}node.content=value}
setMeta("description",I.desc||C.subtitle);setMeta("og:title",C.title,true);setMeta("og:description",I.desc||C.subtitle,true);
let canonical=document.head.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement("link");canonical.rel="canonical";document.head.appendChild(canonical)}
canonical.href="https://beerandnacho.github.io/labs/"+C.slug+"/";
const home=document.createElement("a");home.className="lab-home";home.href="/labs/";home.textContent="전체 도구";document.body.appendChild(home);
try{const recent=JSON.parse(localStorage.getItem("today-decision:recent")||"[]"),next=[C.slug,...recent.filter(x=>x!==C.slug)].slice(0,8);localStorage.setItem("today-decision:recent",JSON.stringify(next))}catch(e){}
const el=id=>document.getElementById(id),ui={controls:el("controls"),title:el("resultTitle"),why:el("why"),meta:el("meta"),steps:el("steps"),alts:el("alts"),again:el("again"),save:el("save"),share:el("share"),notice:el("notice")};
if(Object.values(ui).some(v=>!v)){document.body.innerHTML='<main style="padding:32px;font-family:system-ui">화면을 불러오지 못했습니다. 페이지를 새로고침해 주세요.</main>';return}
const GA_ID="",CLARITY_ID="";
if(GA_ID){const s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+GA_ID;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config",GA_ID)}
if(CLARITY_ID){(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script",CLARITY_ID)}
function track(n,d={}){window.gtag&&gtag("event",n,d);if(window.clarity){clarity("event",n);Object.entries(d).forEach(([k,v])=>clarity("set",k,String(v)))}}
let prefs={...C.defaults},variant=0,ranked=[];
try{const saved=JSON.parse(localStorage.getItem("lab:"+C.slug+":prefs")||"null");if(saved)prefs={...prefs,...saved}}catch(e){}
function hash(s){let h=0;for(const c of s)h=((h<<5)-h+c.charCodeAt(0))|0;return Math.abs(h)}
function score(r){let s=0,matched=0;for(const[k,vals]of Object.entries(r.match||{})){if(k in prefs&&vals.map(String).includes(String(prefs[k]))){s+=5;matched++}}return s+matched+(hash(r.title+JSON.stringify(prefs))%31)/100}
function current(){ranked=C.results.map(x=>({...x,_score:score(x)})).sort((a,b)=>b._score-a._score);return ranked[variant%Math.max(1,Math.min(4,ranked.length))]}
function renderControls(){ui.controls.innerHTML=C.controls.map(c=>`<div class="control"><div class="control-label">${esc(c.label)}</div><div class="opts">${c.values.map(v=>`<button type="button" class="opt ${String(prefs[c.key])===String(v[0])?"on":""}" data-key="${esc(c.key)}" data-value="${esc(String(v[0]))}">${esc(v[1])}</button>`).join("")}</div></div>`).join("");
ui.controls.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{const c=C.controls.find(x=>x.key===b.dataset.key);if(!c)return;const selected=c.values.find(v=>String(v[0])===b.dataset.value);if(!selected)return;prefs[b.dataset.key]=selected[0];variant=0;try{localStorage.setItem("lab:"+C.slug+":prefs",JSON.stringify(prefs))}catch(e){}track("lab_filter_change",{lab_slug:C.slug,lab_num:C.num,filter:b.dataset.key,value:b.dataset.value});render()})}
function renderResult(){const r=current();ui.title.textContent=r.title;ui.why.textContent=r.why;ui.meta.innerHTML=r.meta.map(x=>`<span>${esc(x)}</span>`).join("");
ui.steps.innerHTML=r.steps.map((x,i)=>`<div class="step"><strong>${esc(x)}</strong><p>${i===0?"먼저 이것부터 시작합니다.":i===r.steps.length-1?"여기까지 하면 이번 결정은 끝입니다.":"앞 단계가 끝나면 바로 이어갑니다."}</p></div>`).join("");
const alternatives=ranked.filter(x=>x.title!==r.title).slice(0,3);ui.alts.innerHTML=alternatives.map((x,i)=>`<button type="button" class="alt" data-title="${encodeURIComponent(x.title)}"><span>${String(i+1).padStart(2,"0")} · </span><strong>${esc(x.title)}</strong><small>${esc(x.meta[0]||"")}</small></button>`).join("");
ui.alts.querySelectorAll(".alt").forEach(b=>b.onclick=()=>{const t=decodeURIComponent(b.dataset.title),idx=ranked.slice(0,4).findIndex(x=>x.title===t);if(idx>=0)variant=idx;renderResult()});track("lab_result_view",{lab_slug:C.slug,lab_num:C.num,category:C.cat,result_name:r.title})}
function render(){renderControls();renderResult()}
ui.again.onclick=()=>{variant=(variant+1)%Math.max(1,Math.min(4,C.results.length));track("lab_regenerate",{lab_slug:C.slug,lab_num:C.num});renderResult()};
ui.save.onclick=()=>{const r=current();try{localStorage.setItem("lab:"+C.slug+":saved",JSON.stringify({prefs,result:r.title,at:new Date().toISOString()}));ui.notice.textContent="이 기기에 저장했습니다.";track("lab_save",{lab_slug:C.slug,result_name:r.title})}catch(e){ui.notice.textContent="저장할 수 없는 환경입니다."}};
ui.share.onclick=async()=>{const r=current(),text=C.title+" — "+r.title+"\n"+r.why;try{if(navigator.share){await navigator.share({title:C.title,text,url:canonical.href});track("lab_share",{lab_slug:C.slug,method:"web_share"})}else if(navigator.clipboard){await navigator.clipboard.writeText(text+"\n"+canonical.href);ui.notice.textContent="결과를 복사했습니다.";track("lab_share",{lab_slug:C.slug,method:"clipboard"})}}catch(e){}};
render();track("lab_start",{lab_slug:C.slug,lab_num:C.num,category:C.cat});
})();