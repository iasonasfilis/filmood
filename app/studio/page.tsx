"use client";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, Clapperboard, Search, FlaskConical, Heart, RotateCcw, SlidersHorizontal, Sparkles, Dna, Fingerprint, Tv, Menu, UserRound, LogIn, LogOut, Shield, FileText, Info, Users, X } from "lucide-react";
import "./studio.css";
import { interpretFilmate } from "./filmate-lite";
import "./filmood-discovery.css";
import "./discovery-layout.css";
import "./extra-features.css";
import "./compact-experiences.css";
import "./studio-polish.css";
import { FILMS, type Film } from "./film-data";

type Axis = "dark" | "pace" | "emotion" | "mind" | "visual" | "indie" | "humor" | "action";
type DNA = Record<Axis, number>;
type Mode = "mood" | "filmood";
type View = "start" | "play" | "results" | "lab" | "fusion" | "fingerprint";
const AXES: {key:Axis; name:string; low:string; high:string}[] = [
  {key:"dark",name:"Atmosphere",low:"Bright & comforting",high:"Dark & unsettling"},
  {key:"pace",name:"Pacing",low:"Slow burn",high:"Fast & kinetic"},
  {key:"emotion",name:"Emotional impact",low:"Detached",high:"Heartbreaking"},
  {key:"mind",name:"Story complexity",low:"Easy to follow",high:"Mind-bending"},
  {key:"visual",name:"Visual storytelling",low:"Understated",high:"Highly stylized"},
  {key:"indie",name:"Production feel",low:"Mainstream",high:"Indie & arthouse"},
  {key:"humor",name:"Humor",low:"Very serious",high:"Witty & funny"},
  {key:"action",name:"Action / tension",low:"Quiet & gentle",high:"High stakes"}
];
const dna = (dark:number,pace:number,emotion:number,mind:number,visual:number,indie:number,humor:number,action:number):DNA=>({dark,pace,emotion,mind,visual,indie,humor,action});
const REFERENCES:{name:string;dna:DNA}[]=[
 {name:"Arrival",dna:FILMS[0].dna},{name:"Drive",dna:FILMS[14].dna},{name:"Before Sunset",dna:FILMS[17].dna},
 {name:"Pulp Fiction",dna:dna(67,80,53,74,79,38,88,85)},
 {name:"Game of Thrones",dna:dna(87,76,81,88,91,27,32,96)},
 {name:"Fleabag",dna:dna(45,85,92,77,66,83,96,24)}
];
const MOOD_PRESETS=[
 {label:"Make me feel good",target:dna(20,72,58,35,60,40,80,35)},
 {label:"Keep me guessing",target:dna(78,67,63,94,74,63,23,65)},
 {label:"Make me cry",target:dna(53,27,97,66,78,75,18,12)},
 {label:"Something intense",target:dna(90,86,76,77,80,55,21,91)},
 {label:"Quiet and beautiful",target:dna(33,24,81,61,92,84,24,8)},
 {label:"Unexpectedly funny",target:dna(45,80,52,66,65,61,93,40)}
];
const PROVIDERS=[
 {id:"netflix",name:"Netflix"},{id:"max",name:"HBO Max"},{id:"prime",name:"Amazon Prime Video"},
 {id:"apple",name:"Apple TV"},{id:"disney",name:"Disney+ / Hulu"},{id:"vodafone",name:"Vodafone TV"},
 {id:"magenta",name:"Magenta TV"},{id:"cinobo",name:"Cinobo"},{id:"ertflix",name:"ERTFLIX",free:true}
];
const HOME_BACKDROPS=[
 {title:"Oppenheimer",image:"8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"},
 {title:"Inception",image:"s3TBrRGB1iav7gFOCNx3H31MoES.jpg"},
 {title:"Interstellar",image:"xJHokMbljvjADYdit5fK5VQsXEG.jpg"},
 {title:"Dune: Part Two",image:"xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg"},
 {title:"Parasite",image:"TU9NIjwzjoKPwQHoHshkFcQUCG.jpg"}
] as const;
const STORAGE="filmood-studio-v1";
const defaultReference="Arrival";
const neutralDNA=AXES.reduce((acc,axis)=>{acc[axis.key]=50;return acc;},{} as DNA);
const clamp=(n:number)=>Math.max(0,Math.min(100,n));
const distance=(film:Film,target:DNA)=>AXES.reduce((total,a)=>total+Math.abs(film.dna[a.key]-target[a.key])*({emotion:1.25,mind:1.2,visual:1.0,dark:1.05,pace:1.0,indie:.75,humor:.85,action:.85} as Record<Axis,number>)[a.key],0);
const MATCH_WEIGHTS:Record<Axis,number>={emotion:1.25,mind:1.2,visual:1,dark:1.05,pace:1,indie:.75,humor:.85,action:.85};
const matchPercentage=(film:Film,target:DNA)=>Math.round(Math.max(0,Math.min(100,100-distance(film,target)/AXES.reduce((sum,a)=>sum+MATCH_WEIGHTS[a.key]*100,0)*100)));
const readable=(key:Axis,film:Film)=>AXES.find(a=>a.key===key)!.name.toLowerCase();
function FusionDnaIcon(){return <span className="studio-fusion-mark" aria-hidden="true"><Dna className="studio-fusion-strand studio-fusion-strand-left" size={23} strokeWidth={1.8}/><Dna className="studio-fusion-strand studio-fusion-strand-right" size={23} strokeWidth={1.8}/></span>}

type FilmSearchPickerProps={
 value:string;
 onSelect:(film:Film)=>void;
 onClear?:()=>void;
 label:string;
 placeholder?:string;
 variant?:"hero"|"compact";
 recent?:string[];
 onCustom?:()=>void;
};
function FilmSearchPicker({value,onSelect,onClear,label,placeholder="Search films by title…",variant="compact",recent=[],onCustom}:FilmSearchPickerProps){
 const [query,setQuery]=useState(value);
 const [open,setOpen]=useState(false);
 const [active,setActive]=useState(0);
 const root=useRef<HTMLDivElement>(null);
 const input=useRef<HTMLInputElement>(null);
 const id=useId();
 useEffect(()=>{if(!open)setQuery(value);},[value,open]);
 useEffect(()=>{
  const dismiss=(event:PointerEvent)=>{if(root.current&&!root.current.contains(event.target as Node))setOpen(false);};
  document.addEventListener("pointerdown",dismiss);
  return()=>document.removeEventListener("pointerdown",dismiss);
 },[]);
 const matches=useMemo(()=>{
  const q=query.trim().toLocaleLowerCase();
  if(!q){
   const recentFilms=recent.map(name=>FILMS.find(f=>f.title===name)).filter((f):f is Film=>Boolean(f));
   return [...recentFilms,...FILMS.filter(f=>!recentFilms.some(x=>x.id===f.id))].slice(0,6);
  }
  return FILMS.filter(f=>f.title.toLocaleLowerCase().includes(q)).sort((a,b)=>{
   const aPrefix=a.title.toLocaleLowerCase().startsWith(q)?0:1;
   const bPrefix=b.title.toLocaleLowerCase().startsWith(q)?0:1;
   return aPrefix-bPrefix||a.title.localeCompare(b.title);
  }).slice(0,8);
 },[query,recent]);
 const choose=(film:Film)=>{setQuery(film.title);setOpen(false);onSelect(film);input.current?.blur();};
 const selected=FILMS.find(f=>f.title===value);
 return <div className={"studio-film-picker studio-film-picker-"+variant} ref={root}>
  <label className="studio-film-picker-label" htmlFor={id}>{label}</label>
  <div className="studio-film-picker-input-wrap">
   {variant==="hero"&&<span className="studio-film-picker-art">{selected?.poster?<img src={"https://image.tmdb.org/t/p/w185/"+selected.poster} alt="" onError={e=>{e.currentTarget.style.display="none";}}/>:<Search size={32}/>}</span>}
   <input ref={input} id={id} type="search" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={id+"-results"} aria-label={label} value={query} placeholder={placeholder} autoComplete="off" onFocus={()=>{setOpen(true);setActive(0);input.current?.select();}} onChange={e=>{setQuery(e.target.value);setOpen(true);setActive(0);if(e.target.value!==value)onClear?.();}} onKeyDown={e=>{
    if(e.key==="Escape"){e.preventDefault();setOpen(false);input.current?.blur();}
    if(e.key==="ArrowDown"){e.preventDefault();setOpen(true);setActive(i=>Math.min(i+1,matches.length-1));}
    if(e.key==="ArrowUp"){e.preventDefault();setActive(i=>Math.max(0,i-1));}
    if(e.key==="Enter"&&open&&matches[active]){e.preventDefault();choose(matches[active]);}
   }}/>
   <Search className="studio-film-picker-search-icon" size={variant==="hero"?24:18}/>
  </div>
  {open&&<div className="studio-film-picker-results" id={id+"-results"} role="listbox" aria-label={label+" suggestions"}>
   {!query.trim()&&<p className="studio-film-picker-caption">{recent.length?"RECENT SEARCHES & FILMS":"START EXPLORING"}</p>}
   {onCustom&&<button type="button" className="studio-film-picker-custom" onClick={()=>{setQuery("");setOpen(false);onCustom();}}>Start from scratch · Custom recipe</button>}
   {matches.length?matches.map((f,i)=><button type="button" role="option" aria-selected={i===active} className={"studio-film-picker-result"+(i===active?" active":"")} key={f.id} onMouseEnter={()=>setActive(i)} onClick={()=>choose(f)}>
    <span className="studio-film-picker-result-art">{f.poster?<img src={"https://image.tmdb.org/t/p/w185/"+f.poster} alt="" onError={e=>{e.currentTarget.style.display="none";}}/>:f.title.slice(0,1)}</span>
    <span><strong>{f.title}</strong><small>{f.year} · {f.genres.join(" / ")}</small></span><ArrowRight size={16}/>
   </button>):<p className="studio-film-picker-no-results">No match in the current 23-film catalog.</p>}
  </div>}
 </div>;
}

export default function Studio(){
 const [mode,setMode]=useState<Mode>("mood");
 const [fusionA,setFusionA]=useState("");
 const [fusionB,setFusionB]=useState("");
 const [fusionWeight,setFusionWeight]=useState(50);
 const [fusionShowResults,setFusionShowResults]=useState(false);
 const [situation,setSituation]=useState("Any occasion");
 const [view,setView]=useState<View>("start");
 const [moods,setMoods]=useState<string[]>([]);
 const [chatInput,setChatInput]=useState("");
 const [filmateError,setFilmateError]=useState("");
 const [chatHistory,setChatHistory]=useState<{role:"user"|"guide";text:string}[]>([]);
 const [chatTarget,setChatTarget]=useState<DNA|null>(null);
 const [reference,setReference]=useState(defaultReference);
 const [filmSelected,setFilmSelected]=useState(false);
 const [recentFilmSearches,setRecentFilmSearches]=useState<string[]>([]);
 const [keep,setKeep]=useState<string[]>(["Atmosphere","Emotional feeling"]);
 const [mix,setMix]=useState<DNA>({...neutralDNA});
 const [labBase,setLabBase]=useState("Custom mix");
 const [region,setRegion]=useState("Anywhere");
 const [runtime,setRuntime]=useState("Any length");
 const [depth,setDepth]=useState(52);
 const [subscribed,setSubscribed]=useState<string[]>([]);
 const [saved,setSaved]=useState<number[]>([]);
 const [watched,setWatched]=useState<number[]>([]);
 const [passed,setPassed]=useState<number[]>([]);
 const [liked,setLiked]=useState<number[]>([]);
 const [providerOpen,setProviderOpen]=useState(false);
 const [menuOpen,setMenuOpen]=useState(false);
 const [showFilmPreferences,setShowFilmPreferences]=useState(false);
 const [backdropIndex,setBackdropIndex]=useState(0);
 const [loadedBackdrops,setLoadedBackdrops]=useState<number[]>([]);
 const [details,setDetails]=useState<Film|null>(null);
 const [loaded,setLoaded]=useState(false);
 // Only rotate through images that the browser actually loaded; a broken TMDB URL
 // must never produce an empty frame in the hero.
 useEffect(()=>{
  if(loadedBackdrops.length && !loadedBackdrops.includes(backdropIndex)){
   setBackdropIndex(loadedBackdrops[0]);
  }
 },[loadedBackdrops,backdropIndex]);
 useEffect(()=>{
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches || loadedBackdrops.length<2)return;
  const timer=window.setInterval(()=>setBackdropIndex(current=>{
   const position=loadedBackdrops.indexOf(current);
   return loadedBackdrops[(position+1)%loadedBackdrops.length];
  }),5000);
  return()=>window.clearInterval(timer);
 },[loadedBackdrops]);

 const navigate=(next:View,nextMode:Mode=mode)=>{
  const url=new URL(window.location.href);
  if(next==="start"){url.searchParams.delete("experience");url.searchParams.delete("mode");url.searchParams.delete("film");url.searchParams.delete("moods");}
  else {
   url.searchParams.set("experience",next);
   url.searchParams.set("mode",nextMode);
   if(next==="results"&&nextMode==="filmood")url.searchParams.set("film",reference);
   else url.searchParams.delete("film");
   if(next==="results"&&nextMode==="mood")url.searchParams.set("moods",moods.join("|"));
   else url.searchParams.delete("moods");
  }
  url.searchParams.delete("detail");
  window.history.pushState({filmood:true},"",url);
  setDetails(null);
  setMode(nextMode);
  setView(next);
 };
 useEffect(()=>{
  const restore=()=>{
   const params=new URLSearchParams(window.location.search);
   const raw=params.get("experience");
   const next:View=raw==="play"||raw==="results"||raw==="lab"||raw==="fusion"||raw==="fingerprint"?raw:"start";
   const nextMode:Mode=params.get("mode")==="filmood"?"filmood":"mood";
   setMode(nextMode);setView(next);
   const film=params.get("film");
   if(film&&FILMS.some(f=>f.title===film)){setReference(film);setFilmSelected(true);}
   const moodsParam=params.get("moods");
   if(moodsParam)setMoods(moodsParam.split("|").filter(name=>MOOD_PRESETS.some(m=>m.label===name)));
   const detail=params.get("detail");
   setDetails(detail?FILMS.find(f=>f.id===Number(detail))||null:null);
  };
  restore();
  window.addEventListener("popstate",restore);
  return()=>window.removeEventListener("popstate",restore);
 },[]);
 const openDetails=(film:Film)=>{const url=new URL(window.location.href);url.searchParams.set("detail",String(film.id));window.history.pushState({filmood:true},"",url);setDetails(film);};
 const closeDetails=()=>{const url=new URL(window.location.href);if(url.searchParams.has("detail")&&window.history.state?.filmood){window.history.back();}else{url.searchParams.delete("detail");window.history.replaceState(window.history.state,"",url);setDetails(null);}};
 // A new discovery screen must start at its top, not inherit the previous scroll position.
 useLayoutEffect(()=>{window.scrollTo({top:0,left:0,behavior:"instant"});},[view]);
 useEffect(()=>{try{const history=JSON.parse(localStorage.getItem("filmood-recent-film-searches")||"[]");if(Array.isArray(history))setRecentFilmSearches(history.filter((x:unknown):x is string=>typeof x==="string").slice(0,8));}catch{}},[]);
 useEffect(()=>{try{const s=localStorage.getItem(STORAGE);if(s){const p=JSON.parse(s);if(Array.isArray(p.saved))setSaved(p.saved);if(Array.isArray(p.watched))setWatched(p.watched);if(Array.isArray(p.passed))setPassed(p.passed);if(Array.isArray(p.liked))setLiked(p.liked);if(Array.isArray(p.subscribed))setSubscribed(p.subscribed);}}catch{}setLoaded(true);},[]);
 useEffect(()=>{if(loaded){try{localStorage.setItem(STORAGE,JSON.stringify({saved,watched,passed,liked,subscribed}));}catch{}}},[saved,watched,passed,liked,subscribed,loaded]);
 const fusionDNA=AXES.reduce((a,axis)=>{const first=FILMS.find(f=>f.title===fusionA)?.dna||FILMS[0].dna;const second=FILMS.find(f=>f.title===fusionB)?.dna||FILMS[12].dna;a[axis.key]=Math.round(first[axis.key]*fusionWeight/100+second[axis.key]*(100-fusionWeight)/100);return a;},{} as DNA);
 const fusionReady=Boolean(fusionA&&fusionB&&fusionA!==fusionB);
 const labReady=labBase!=="Custom mix"||AXES.some(a=>mix[a.key]!==50);
 const fingerprint=useMemo(()=>{const films=FILMS.filter(f=>liked.includes(f.id)||watched.includes(f.id));if(!films.length)return null;return AXES.reduce((a,axis)=>{a[axis.key]=Math.round(films.reduce((sum,f)=>sum+f.dna[axis.key]*(liked.includes(f.id)?2:1),0)/films.reduce((sum,f)=>sum+(liked.includes(f.id)?2:1),0));return a;},{} as DNA);},[liked,watched]);
 const referenceDNA=REFERENCES.find(r=>r.name===reference)?.dna||FILMS.find(f=>f.title===reference)?.dna||REFERENCES[0].dna;
 const moodDNA=AXES.reduce((acc,axis)=>{const selected=MOOD_PRESETS.filter(m=>moods.includes(m.label));acc[axis.key]=selected.length?Math.round(selected.reduce((sum,m)=>sum+m.target[axis.key],0)/selected.length):50;return acc;},{} as DNA);
 const target=view==="lab"?mix:view==="fusion"?fusionDNA:chatTarget|| (mode==="filmood"?referenceDNA:moodDNA);
 const results=useMemo(()=>FILMS.filter(f=>!passed.includes(f.id)&&!watched.includes(f.id))
  .filter(f=>view==="lab"?(labBase==="Custom mix"||f.title!==labBase):(mode!=="filmood"||f.title!==reference))
  .filter(f=>region==="Anywhere"||f.region===region)
  .filter(f=>runtime==="Any length"||(runtime==="Under 100 min"?f.length<100:runtime==="100–140 min"?f.length>=100&&f.length<=140:f.length>140))
  .map(f=>({film:f,score:distance(f,target)+(liked.includes(f.id)?-16:0)+((depth-50)/50)*(f.dna.indie-50)*-.35}))
  .sort((a,b)=>matchPercentage(b.film,target)-matchPercentage(a.film,target)||a.score-b.score||a.film.id-b.film.id).slice(0,6).map(x=>x.film),
  [view,labBase,mode,reference,region,runtime,depth,passed,watched,liked,target]);
 const launch=()=>{if(mode==="mood"&&moods.length===0&&!chatTarget)return;if(mode==="filmood"&&!filmSelected)return;setMix({...target});navigate("results");};
 // Enter discovers from the page; inputs, dialogs and other controls keep their native Enter behavior.
 useEffect(()=>{if(view!=="play")return;const onEnter=(event:KeyboardEvent)=>{if(event.key!=="Enter"||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||menuOpen||providerOpen||details)return;const node=event.target;if(node instanceof Element&&node.closest("input,textarea,select,button,a,[role=dialog],[contenteditable=true]"))return;event.preventDefault();launch();};window.addEventListener("keydown",onEnter);return()=>window.removeEventListener("keydown",onEnter);},[view,launch,menuOpen,providerOpen,details]);
 const chooseMode=(next:Mode)=>{if(next==="mood")setMoods([]);if(next==="filmood")setFilmSelected(false);setMode(next);setChatHistory([]);setChatInput("");setChatTarget(null);navigate("play",next);};
 const chooseMood=(label:string)=>{setMoods(prev=>prev.includes(label)?(prev.filter(x=>x!==label)):[...prev,label]);setChatTarget(null);};
 const sendChat=()=>{const input=chatInput.trim();if(!input||(mode==="filmood"&&!filmSelected))return;setFilmateError("");const base=chatTarget||(mode==="mood"?moodDNA:referenceDNA);const analysis=interpretFilmate(input,base,FILMS.map(f=>f.title),chatHistory.length);setChatHistory(h=>[...h,{role:"user",text:input},{role:"guide",text:analysis.reply}]);setChatInput("");setChatTarget(analysis.dna);setMix(analysis.dna);navigate("results");};
 const enterLab=(film?:Film)=>{if(film){setReference(film.title);setLabBase(film.title);setMix({...film.dna});setMode("filmood");}else{setLabBase("Custom mix");setMix(view==="start"?{...neutralDNA}:{...target});}navigate("lab",film?"filmood":mode);};
 const chooseSearchFilm=(film:Film)=>{changeReference(film.title);setFilmSelected(true);setChatTarget(null);setRecentFilmSearches(previous=>{const next=[film.title,...previous.filter(x=>x!==film.title)].slice(0,8);try{localStorage.setItem("filmood-recent-film-searches",JSON.stringify(next));}catch{}return next;});};
 const changeReference=(value:string)=>{setReference(value);setMix({...(REFERENCES.find(r=>r.name===value)?.dna||FILMS.find(f=>f.title===value)?.dna||REFERENCES[0].dna)});};
 const toggle=(list:number[],fn:(ids:number[])=>void,id:number)=>fn(list.includes(id)?list.filter(x=>x!==id):[...list,id]);
 const reset=()=>{setMix({...(labBase==="Custom mix"?neutralDNA:(REFERENCES.find(r=>r.name===labBase)?.dna||FILMS.find(f=>f.title===labBase)?.dna||neutralDNA))});setRegion("Anywhere");setRuntime("Any length");setDepth(52);};
 const sharedReason=(f:Film)=>{const closer=AXES.map(a=>({key:a.key,name:readable(a.key,f),delta:Math.abs(f.dna[a.key]-target[a.key])})).sort((a,b)=>a.delta-b.delta).slice(0,2).map(a=>a.name).join(" and ");const differences=AXES.map(a=>({name:a.name.toLowerCase(),delta:f.dna[a.key]-target[a.key]})).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));const contrast=differences[0];return "The vibe match: "+closer+". Compared with your mix, "+f.title+" leans "+(contrast.delta>0?"more ":"less ")+contrast.name+". "+f.description;};
 return <main className={"studio"+(view==="start"?" studio-home":"")}>
  <header className="studio-nav"><button className="studio-menu-toggle" aria-label="Open site menu" aria-expanded={menuOpen} onClick={()=>setMenuOpen(true)}><Menu size={23}/></button>
   <a href="/" className="studio-word">FILMOOD<span>.</span></a>
   <nav aria-label="Personal cinema"><button className="studio-account-nav" onClick={()=>navigate("fingerprint")}><Fingerprint size={18}/> My Cinema</button></nav>
  </header>
  {menuOpen&&<div className="studio-menu-scrim" onClick={()=>setMenuOpen(false)}><aside className="studio-site-drawer" role="dialog" aria-modal="true" aria-label="FILMOOD navigation" onClick={e=>e.stopPropagation()}><div className="studio-drawer-head"><strong>FILMOOD<span>.</span></strong><button aria-label="Close menu" onClick={()=>setMenuOpen(false)}><X size={22}/></button></div><p className="studio-drawer-label">DISCOVER</p><button onClick={()=>{navigate("start");setMenuOpen(false);}}><Clapperboard size={19}/> Discover films</button><button onClick={()=>{enterLab();setMenuOpen(false);}}><FlaskConical size={19}/> Film Lab</button><button onClick={()=>{navigate("fusion");setMenuOpen(false);}}><FusionDnaIcon/> Film DNA Fusion</button><p className="studio-drawer-label">YOUR SPACE</p><button onClick={()=>{navigate("fingerprint");setMenuOpen(false);}}><Fingerprint size={19}/> My Cinema · Film Identity</button><button onClick={()=>{setProviderOpen(true);setMenuOpen(false);}}><Tv size={19}/> Streaming services</button><button disabled title="Accounts are not available yet"><UserRound size={19}/> Account <small>COMING SOON</small></button><button disabled title="Sign in is not available yet"><LogIn size={19}/> Sign in <small>COMING SOON</small></button><button disabled title="No account session exists yet"><LogOut size={19}/> Sign out <small>NOT SIGNED IN</small></button><p className="studio-drawer-label">INFORMATION</p><a href="/about"><Info size={19}/> About FILMOOD</a><a href="/privacy"><Shield size={19}/> Privacy policy</a><a href="/terms"><FileText size={19}/> Terms of service</a><div className="studio-drawer-bottom">FILMOOD. · Independent movie discovery prototype</div></aside></div>}
  {providerOpen&&<div className="studio-services-backdrop" onClick={()=>setProviderOpen(false)}><section className="studio-services-panel" role="dialog" aria-modal="true" aria-label="Streaming platforms" onClick={e=>e.stopPropagation()}>
    <div className="studio-services-heading"><div><span className="studio-eyebrow">YOUR WATCHING WORLD / 01</span><h2>Where stories <em>live.</em></h2><p>Choose the services you use. Your selection stays in this browser.</p></div><button className="studio-services-close" aria-label="Close streaming platforms" onClick={()=>setProviderOpen(false)}><X size={21}/></button></div>
    <div className="studio-services-count"><span>YOUR STREAMING COLLECTION</span><strong>{subscribed.length+1}<small> / {PROVIDERS.length} services</small></strong></div>
    <div className="studio-services-grid">{PROVIDERS.map((p,i)=>{const selected=Boolean(p.free||subscribed.includes(p.id));return <button type="button" key={p.id} className={"studio-service-tile"+(selected?" selected":"")} aria-pressed={selected} disabled={p.free} onClick={()=>setSubscribed(a=>a.includes(p.id)?a.filter(x=>x!==p.id):[...a,p.id])}><span className="studio-service-number">{String(i+1).padStart(2,"0")}</span><span className="studio-service-mark">{p.name.slice(0,1)}</span><strong>{p.name}</strong><span className="studio-service-status">{p.free?"FREE · INCLUDED":selected?"✓ SELECTED":"+ ADD SERVICE"}</span></button>})}</div>
    <p className="studio-services-disclaimer"><strong>Streaming availability isn't connected yet.</strong> These preferences are saved locally, but do not filter recommendations or verify which films are on each platform in Greece.</p>
    <button className="studio-primary studio-services-done" onClick={()=>setProviderOpen(false)}>Save my selection <Check size={17}/></button>
   </section></div>}
  {view==="start"&&<section className="studio-hero">
   <div className="studio-cinema-backdrop studio-cinema-carousel" aria-hidden="true">{HOME_BACKDROPS.map((frame,i)=><div key={frame.title} className={"studio-cinema-frame"+(backdropIndex===i&&loadedBackdrops.includes(i)?" is-active":"")}><img src={"https://image.tmdb.org/t/p/w1280/"+frame.image} alt="" loading="eager" decoding="async" onLoad={()=>setLoadedBackdrops(previous=>previous.includes(i)?previous:[...previous,i].sort((a,b)=>a-b))}/></div>)}</div>
   <p className="studio-eyebrow">FILMOOD ORIGINAL DISCOVERY EXPERIENCE</p>
   <h1>Some feelings deserve<br/><em>another film.</em></h1>
   <p className="studio-lead">A cinematic experience built around what moves you. Pick a direction. The discovery begins on the next screen.</p>
   <p className="studio-feature-label">FOUR WAYS TO DISCOVER</p>
   <div className="studio-mode-grid">
    <button className="studio-mode" onClick={()=>chooseMode("mood")}><Heart size={27}/><strong>MOOD.</strong><span>Start with a feeling. Discover where it takes you.</span><ArrowRight className="studio-mode-arrow" size={22}/></button>
    <button className="studio-mode" onClick={()=>chooseMode("filmood")}><Clapperboard size={27}/><strong>FILMOOD.</strong><span>Start with a film. Follow its emotional aftertaste.</span><ArrowRight className="studio-mode-arrow" size={22}/></button>
   </div>
   <div className="studio-experiments-grid">
    <button className="studio-experiment-card studio-experiment-lab" onClick={()=>enterLab()}><span className="studio-experiment-icon"><FlaskConical size={27}/></span><strong>The Film Lab.</strong><small>Rewrite the feeling. Eight cinematic ingredients, one recipe that is entirely yours.</small><span className="studio-experiment-action">ENTER THE LAB <ArrowRight size={17}/></span></button>
    <button className="studio-experiment-card studio-experiment-blend" onClick={()=>navigate("fusion")}><span className="studio-experiment-icon"><FusionDnaIcon/></span><strong>Film DNA Fusion.</strong><small>Two films. One DNA. Discover what happens when their cinematic worlds meet.</small><span className="studio-experiment-action">START FUSING <ArrowRight size={17}/></span></button>
   </div>
  </section>}
  {view==="play"&&<section className={"studio-play studio-play-refined studio-experiment studio-discovery-screen studio-discovery-"+mode}>
    <button className="studio-back-link studio-feature-back" onClick={()=>navigate("start")}><ArrowLeft size={16}/> Back to home</button>
    <div className="studio-feature-banner studio-discovery-banner">
     <span>{mode==="mood"?"MOOD.":"FILMOOD."} / FIND YOUR NEXT FILM</span>
     <h1>{mode==="mood"?"What does tonight feel like?":"Start with a film you love."}</h1>
     <p className="studio-play-intro">{mode==="mood"?"Choose one or more moods, or describe the feeling you want.":"Choose your starting film. We'll find its cinematic relatives."}</p>
    </div>
    <div className="studio-discovery-columns">
     <div className="studio-discovery-primary studio-discovery-console">
      {mode==="mood"?<div className="studio-visual-moods">{MOOD_PRESETS.map((m,i)=><button key={m.label} type="button" aria-pressed={moods.includes(m.label)} className={"studio-visual-mood mood-"+i+(moods.includes(m.label)?" chosen":"")} onClick={()=>chooseMood(m.label)} onKeyDown={e=>{if(e.key==="Enter"&&moods.length>0){e.preventDefault();launch();}}}><span className="studio-visual-mood-number">0{i+1}</span><strong>{m.label}</strong><span className="studio-mood-check">{moods.includes(m.label)?"✓ IN YOUR MIX":"ADD TO YOUR MIX"} <ArrowRight size={14}/></span></button>)}</div>
      :<div className="studio-filmood-discovery studio-filmood-simple">
        <FilmSearchPicker variant="hero" label="YOUR STARTING FILM" value={filmSelected?reference:""} placeholder="Find a film…" recent={recentFilmSearches} onSelect={chooseSearchFilm} onClear={()=>{setFilmSelected(false);setChatTarget(null);}}/>
        <p className="studio-filmood-picker-help">{filmSelected?"Your film is selected. Search again to change it.":"Start typing a film title. Results appear as you type."}</p>
       </div>}
      {mode==="mood"&&moods.length>0&&<div className="studio-mood-mix"><span>YOUR MOOD MIX · {moods.length} {moods.length===1?"FEELING":"FEELINGS"}</span><div>{moods.map(m=><button key={m} onClick={()=>chooseMood(m)} title="Remove mood">{m} ×</button>)}</div></div>}
      <aside className="studio-chat-panel studio-chat-panel-clean studio-chat-inline"><div className="studio-chat-top"><Sparkles size={19}/><div><strong>Describe your ideal film</strong><small>{mode==="filmood"&&!filmSelected?"Choose a starting film first":"Optional · Refine your recommendations with words"}</small></div></div>
       {chatHistory.length>0&&<div className="studio-chat-history">{chatHistory.map((m,i)=><p key={i} className={"studio-chat-"+m.role}>{m.text}</p>)}</div>}
       {filmateError&&<p className="studio-filmmate-error" role="alert">{filmateError}</p>}
       <form onSubmit={e=>{e.preventDefault();sendChat();}} className="studio-chat-compose"><input aria-label="Describe your ideal film" value={chatInput} disabled={mode==="filmood"&&!filmSelected} onChange={e=>setChatInput(e.target.value)} placeholder={mode==="mood"?"Beautiful, melancholic, a little mysterious…":filmSelected?"Like this film, but darker and stranger…":"Select a film to unlock refinement"} /><button type="submit" disabled={!chatInput.trim()||(mode==="filmood"&&!filmSelected)} aria-label="Refine recommendations"><ArrowRight size={20}/></button></form>
      </aside>
     </div>
     <aside className="studio-discover-panel studio-discovery-output">
      <button type="button" className="studio-primary studio-discover-cta" disabled={mode==="mood"?moods.length===0&&!chatTarget:!filmSelected} onClick={launch}><span>Discover films</span><ArrowRight size={32}/></button>
      <div className="studio-discover-meta">
       <p>{mode==="mood"?"Your mood mix becomes six film recommendations.":"Six recommendations inspired by your starting film."}</p>
       <button type="button" className="studio-optional-toggle" aria-expanded={showFilmPreferences} onClick={()=>setShowFilmPreferences(v=>!v)}>{showFilmPreferences?"− Hide viewing occasion":"+ Viewing occasion (optional)"}</button>
       {showFilmPreferences&&<label className="studio-occasion">TONIGHT'S SITUATION<select value={situation} onChange={e=>setSituation(e.target.value)}>{["Any occasion","Watching alone","Date night","With friends","Sunday afternoon","3 AM existential crisis"].map(s=><option key={s}>{s}</option>)}</select></label>}
      </div>
     </aside>
    </div>
  </section>}
  {view==="fusion"&&<section className="studio-feature-screen studio-experiment studio-fusion-screen">
    <button className="studio-feature-back" onClick={()=>navigate("start")}><ArrowLeft size={16}/> Back to home</button>
    <div className="studio-feature-banner studio-fusion-banner studio-fusion-banner-compact"><span>FILM DNA FUSION</span><h1>Two films. <em>One new feeling.</em></h1><p>Pick two films, choose their balance and discover where their cinematic DNA meets.</p></div>
    <div className="studio-feature-layout">
     <div className="studio-feature-console studio-fusion-console">
      <span className="studio-eyebrow">01 / CHOOSE TWO FILMS</span>
      <h2>Create your fusion.</h2>
      <div className="studio-fusion-controls">
       <FilmSearchPicker label="FIRST FILM" placeholder="Search first film…" value={fusionA} recent={recentFilmSearches} onSelect={f=>{setFusionA(f.title);setFusionShowResults(false);}} onClear={()=>{setFusionA("");setFusionShowResults(false);}}/>
       <span className="studio-fusion-plus">+</span>
       <FilmSearchPicker label="SECOND FILM" placeholder="Search second film…" value={fusionB} recent={recentFilmSearches} onSelect={f=>{setFusionB(f.title);setFusionShowResults(false);}} onClear={()=>{setFusionB("");setFusionShowResults(false);}}/>
      </div>
      <div className="studio-fusion-ratio-head"><span className="studio-eyebrow">02 / FIND THE BALANCE</span><strong>{fusionWeight}% <span>/</span> {100-fusionWeight}%</strong></div>
      <div className="studio-fusion-balance"><span>{fusionA||"First film"}</span><span>{fusionB||"Second film"}</span></div>
      <label className="studio-fusion-weight"><input aria-label="Balance the two films" type="range" min="0" max="100" value={fusionWeight} disabled={!fusionReady} onChange={e=>setFusionWeight(Number(e.target.value))}/></label>
      {fusionA&&fusionB&&fusionA===fusionB&&<p className="studio-fusion-validation">Choose two different films to create a fusion.</p>}
      <button type="button" className="studio-primary studio-fusion-launch" disabled={!fusionReady} onClick={()=>setFusionShowResults(true)}><FusionDnaIcon/> Fuse these films <ArrowRight size={19}/></button>
      <details className="studio-fusion-advanced"><summary>Explore the eight DNA ingredients</summary><div className="studio-fusion-dna">{AXES.map(a=><div key={a.key}><span>{a.name}</span><div><i style={{width:fusionDNA[a.key]+"%"}}/></div><strong>{fusionDNA[a.key]}</strong></div>)}</div></details>
     </div>
     <div id="fusion-results" className="studio-feature-output studio-fusion-output">
      {fusionReady&&fusionShowResults?<><span className="studio-eyebrow">YOUR FUSION RESULTS</span><h2>Somewhere between.</h2><p>Six films closest to your combined cinematic DNA.</p><div className="studio-feature-matches">{FILMS.filter(f=>f.title!==fusionA&&f.title!==fusionB).map(f=>({f,score:matchPercentage(f,fusionDNA)})).sort((a,b)=>b.score-a.score).slice(0,6).map(({f,score},i)=><button key={f.id} onClick={()=>openDetails(f)}><span className="studio-feature-match-rank">{String(i+1).padStart(2,"0")} / FUSION PICK</span><div className="studio-feature-match-poster">{f.poster?<img src={"https://image.tmdb.org/t/p/w342/"+f.poster} alt="" loading="lazy" onError={e=>{e.currentTarget.style.display="none";}}/>:<span>{f.title.slice(0,1)}</span>}</div><div><strong>{f.title}</strong><span>{score}% DNA MATCH</span><small>{f.description}</small></div></button>)}</div></>
      :<div className="studio-fusion-empty"><FusionDnaIcon/><span className="studio-eyebrow">YOUR FUSION AWAITS</span><h2>Two stories.<br/>One discovery.</h2><p>Select two different films, adjust their balance and press <strong>Fuse these films</strong> to reveal your matches.</p></div>}
     </div>
    </div>
   </section>}
  {view==="fingerprint"&&<section className="studio-feature-screen studio-experiment">
    <button className="studio-feature-back" onClick={()=>navigate("start")}><ArrowLeft size={16}/> Back to discovery</button>
    <div className="studio-feature-banner studio-fingerprint-banner"><span>MY CINEMA / YOUR FILM IDENTITY</span><h1>Your taste.<br/><em>On film.</em></h1><p>Your personal cinematic DNA grows from the films you love and the stories you've watched.</p><div className="studio-feature-steps"><span>01 · WATCH</span><span>02 · LOVE</span><span>03 · DISCOVER YOUR DNA</span></div></div>
    <div className="studio-feature-layout"><div className="studio-feature-console"><span className="studio-eyebrow">YOUR FILM PROFILE</span><h2>The films that shaped you.</h2><div className="studio-fingerprint-stats"><div><strong>{watched.length}</strong><span>WATCHED</span></div><div><strong>{liked.length}</strong><span>LOVED</span></div><div><strong>{saved.length}</strong><span>SAVED</span></div></div><p>Mark films as Watched or Liked from discovery results. Your profile is stored only in this browser.</p><button className="studio-primary" onClick={()=>navigate("start")}>Discover more films <ArrowRight size={18}/></button></div><div className="studio-feature-output"><span className="studio-eyebrow">THE CINEMATIC READOUT</span><h2>Your signature.</h2>{fingerprint?<><p className="studio-fingerprint-summary">Your strongest signals: {AXES.map(a=>({name:a.name,value:fingerprint[a.key]})).sort((a,b)=>b.value-a.value).slice(0,3).map(a=>a.name.toLowerCase()).join(", ")}.</p><div className="studio-fingerprint-axes">{AXES.map(a=><div key={a.key}><span>{a.name} <strong>{fingerprint[a.key]} / 100</strong></span><progress value={fingerprint[a.key]} max={100}/></div>)}</div></>:<div className="studio-fingerprint-empty"><Sparkles size={30}/><h3>Your story starts here.</h3><p>No fingerprint yet. Like or mark films as watched to reveal your cinematic personality.</p></div>}</div></div>
   </section>}
  {(view==="results"||view==="lab")&&<section className="studio-workspace">
   <div className="studio-workspace-head"><button onClick={()=>navigate("start")}><ArrowLeft size={15}/> Back to home</button><span>{view==="lab"?"THE FILM LAB.":"YOUR DISCOVERY"}</span><button onClick={()=>enterLab()} disabled={view==="lab"}><SlidersHorizontal size={16}/> Remix</button></div>
   {view==="lab"&&<div className="studio-lab-banner studio-lab-banner-compact"><div><span>THE FILM LAB</span><h2>Build your cinematic recipe.</h2><p>Start from scratch or choose a film, then adjust eight ingredients. Matches update live.</p></div><FlaskConical size={34}/></div>}
   <div className={view==="lab"?"studio-columns lab":"studio-columns"}>
    <section className="studio-controls">
     {view==="lab"?<>
       <p className="studio-eyebrow">YOUR MIXING DESK</p><h1>Make it yours.</h1><p className="studio-muted">Move the sliders. Your film matches update instantly.</p>
       <div className="studio-base studio-lab-base-search"><FilmSearchPicker label="CHOOSE BASE FILM" placeholder="Search for a base film…" value={labBase==="Custom mix"?"":labBase} recent={recentFilmSearches} onSelect={f=>{setLabBase(f.title);setReference(f.title);setMix({...f.dna});}} onClear={()=>{setLabBase("Custom mix");setMix({...neutralDNA});}} onCustom={()=>{setLabBase("Custom mix");setMix({...neutralDNA});}}/><button onClick={reset} title="Reset recipe"><RotateCcw size={16}/> Reset</button></div>
       <p className="studio-lab-slider-heading">EIGHT CINEMATIC INGREDIENTS</p><div className="studio-sliders">{AXES.map(a=><label key={a.key} className="studio-axis"><span><strong>{a.name}</strong><output>{mix[a.key]}/100</output></span><input type="range" min="0" max="100" step="1" value={mix[a.key]} onChange={e=>setMix(x=>({...x,[a.key]:clamp(Number(e.target.value))}))}/><span className="studio-limits"><small>{a.low}</small><small>{a.high}</small></span></label>)}</div>
     </>:<>
       <p className="studio-eyebrow">{mode==="mood"?"MOOD.":"FILMOOD."}</p><h1>We found your kind of films.</h1><p className="studio-muted">{mode==="mood"?"A few picks for the feeling you're after.":"Inspired by "+reference+" and its emotional signature."}</p>
       <div className="studio-summary studio-reference-summary">{mode==="filmood"&&<div className="studio-reference-poster">{FILMS.find(f=>f.title===reference)?.poster?<img src={"https://image.tmdb.org/t/p/w185/"+FILMS.find(f=>f.title===reference)?.poster} alt={reference+" poster"}/>:<span>{reference.slice(0,1)}</span>}</div>}<div className="studio-reference-copy"><small>{mode==="filmood"?"YOUR STARTING FILM":"YOUR MOOD MIX"}</small><strong>{mode==="mood"?moods.join(" + "):"Inspired by "+reference}</strong>{situation!=="Any occasion"&&<span>{situation}</span>}</div><button onClick={()=>navigate("play")}>Change</button></div>
       <button className="studio-lab-invite" onClick={()=>enterLab()}><FlaskConical size={19}/> These are close. Want to experiment? <ArrowRight size={16}/></button>
     </>}
     <details className="studio-advanced-filters"><summary>Advanced viewing filters</summary><div className="studio-more"><label className="studio-occasion">TONIGHT'S SITUATION<select value={situation} onChange={e=>setSituation(e.target.value)}>{["Any occasion","Watching alone","Date night","With friends","Sunday afternoon","3 AM existential crisis"].map(s=><option key={s}>{s}</option>)}</select></label>
      <h3>Explore a little further</h3>
      <div className="studio-fields"><label>Film length<select value={runtime} onChange={e=>setRuntime(e.target.value)}><option>Any length</option><option>Under 100 min</option><option>100–140 min</option><option>Over 140 min</option></select></label>
       <label>Cinema<select value={region} onChange={e=>setRegion(e.target.value)}><option>Anywhere</option><option>American</option><option>European</option><option>Asian</option><option>World</option></select></label></div>
      <label className="studio-axis discovery"><span><strong>Familiar ↔ Hidden gems</strong><output>{depth<34?"Familiar":depth>67?"Deep cuts":"Balanced"}</output></span><input type="range" min="0" max="100" value={depth} onChange={e=>setDepth(Number(e.target.value))}/></label>
     </div></details>
    </section>
    {view==="lab"&&!labReady?<section className="studio-results studio-lab-awaiting"><div className="studio-lab-awaiting-content"><Search size={37}/><span className="studio-eyebrow">THE DIRECTOR’S CUT</span><h2>Choose your base film.</h2><p>Search for a film to unlock its cinematic DNA and live recommendations, or adjust a slider to build your own recipe.</p></div></section>:<section className="studio-results">
<div className="studio-row"><div><p className="studio-eyebrow">LIVE RESULTS</p><h2>{view==="lab"?"The director’s cut":"Your films for tonight"}</h2></div><span className="studio-live"><i/>LIVE</span></div>
     <p className="studio-muted small">Match percentages are illustrative similarities calculated from eight manually estimated cinematic DNA attributes — not AI confidence, ratings or verified streaming listings.</p>
     {results.length===0?<div className="studio-empty">No matches with these constraints. Try changing the region or runtime, or reset a pass.</div>:results.map((f,i)=><article key={f.id} className="studio-film">
       <button className="studio-poster" onClick={()=>openDetails(f)} aria-label={"Details for "+f.title}><span>{f.title.slice(0,1)}</span>{f.poster&&<img src={"https://image.tmdb.org/t/p/w342/"+f.poster} alt="" loading="lazy" onError={e=>{e.currentTarget.style.display="none";}}/>}</button>
       <div className="studio-film-body"><div className="studio-match-heading"><span className="studio-rank">{String(i+1).padStart(2,"0")} / CURATED PICK</span><span className="studio-match-score" title="Illustrative similarity based on the eight cinematic DNA attributes"><strong>{matchPercentage(f,target)}%</strong><small>DNA MATCH</small></span></div><h3>{f.title}</h3><p>{f.year} · {f.length} min · {f.region}</p><p className="studio-reason">{sharedReason(f)}</p><div className="studio-film-actions"><button onClick={()=>toggle(saved,setSaved,f.id)} title="Watchlist"><Bookmark size={15} fill={saved.includes(f.id)?"currentColor":"none"}/>{saved.includes(f.id)?"Saved":"Save"}</button><button onClick={()=>toggle(watched,setWatched,f.id)} title="Mark watched"><Check size={15}/>{watched.includes(f.id)?"Watched":"Watched?"}</button><button onClick={()=>toggle(liked,setLiked,f.id)} title="More like this"><Heart size={15} fill={liked.includes(f.id)?"currentColor":"none"}/>{liked.includes(f.id)?"Liked":"More like this"}</button><button onClick={()=>setPassed(a=>a.includes(f.id)?a:[...a,f.id])} title="Not for me"><X size={15}/>Pass</button><button onClick={()=>openDetails(f)} title={"Cast and crew for "+f.title}><Clapperboard size={15}/>Cast &amp; crew</button><button onClick={()=>enterLab(f)} title="Remix this film"><FlaskConical size={15}/>Remix</button></div></div>
      </article>)}
     {view==="lab"?<details className="studio-verification studio-lab-availability"><summary>Where to watch · Availability not verified</summary><p>Streaming listings in Greece are not connected yet.</p><button onClick={()=>setProviderOpen(true)}>Manage streaming services <ArrowRight size={15}/></button></details>:<div className="studio-verification"><strong>Where to watch in Greece</strong><p>Provider availability is not verified in this prototype. We won't invent Netflix, Cinobo, ERTFLIX or other watch links.</p><button onClick={()=>setProviderOpen(true)}>Manage my streaming services <ArrowRight size={15}/></button></div>}
     {passed.length>0&&<button className="studio-undo" onClick={()=>setPassed([])}>Restore passed films ({passed.length})</button>}
    </section>}
   </div>
  </section>}
  {details&&<div className="studio-overlay studio-film-detail-overlay" onClick={closeDetails}>
    <section className="studio-modal studio-film-detail-modal" role="dialog" aria-modal="true" aria-label={details.title} onClick={e=>e.stopPropagation()}>
     <button className="studio-close" aria-label="Close film details" onClick={closeDetails}><X size={22}/></button>
     <div className="studio-film-detail-intro">
      <div className="studio-film-detail-poster">{details.poster?<img src={"https://image.tmdb.org/t/p/w500/"+details.poster} alt={details.title+" poster"} onError={e=>{e.currentTarget.style.display="none";}}/>:null}<span>{details.title.slice(0,1)}</span></div>
      <div className="studio-film-detail-copy">
       <p className="studio-eyebrow">THE FILM / YOUR DISCOVERY</p>
       <h2>{details.title}</h2>
       <p className="studio-film-detail-meta">{details.year} <span>·</span> {details.length} min <span>·</span> {details.genres.join(" / ")}</p>
       <p className="studio-film-detail-synopsis">{details.description}</p>
       <p className="studio-film-detail-vibe">{sharedReason(details).replace(details.description,"").trim()}</p>
      </div>
     </div>
     <div className="studio-film-detail-sections">
      <section className="studio-film-detail-section">
       <div className="studio-film-detail-section-heading"><span>01 / THE PEOPLE BEHIND THE FILM</span><a href={"/studio/credits/"+details.id} target="_blank" rel="noopener noreferrer">Cast &amp; crew <ArrowRight size={15}/></a></div>
       <p>Explore the people who made this film. Individual filmographies will be added when verified credits are connected.</p>
      </section>
      <section className="studio-film-detail-section">
       <div className="studio-film-detail-section-heading"><span>02 / WHERE TO WATCH</span><span className="studio-film-detail-country">GREECE</span></div>
       <p>Streaming availability in Greece has not been verified yet. We won't label a film as available on Netflix, Cinobo or another service without live provider data.</p>
       <a className="studio-film-detail-watch-link" href={"https://www.justwatch.com/gr/search?q="+encodeURIComponent(details.title)} target="_blank" rel="noopener noreferrer">Check on JustWatch Greece <ArrowRight size={15}/></a>
      </section>
     </div>
     <div className="studio-film-detail-actions">
      <button className="studio-primary" onClick={()=>{enterLab(details);closeDetails();}}>Remix this film <ArrowRight size={17}/></button>
      <button className="studio-film-detail-watched" onClick={()=>{toggle(watched,setWatched,details.id);closeDetails();}}>{watched.includes(details.id)?"Remove from watched":"Mark as watched"} <Check size={16}/></button>
     </div>
     <p className="studio-film-detail-footnote">Cinematic DNA values and vibe matches are illustrative estimates. Film artwork is credited to TMDB.</p>
    </section>
   </div>}
  <footer className="studio-footer"><span>FILMOOD. · Some feelings deserve another film.</span><span>Prototype · Estimated DNA · Unverified streaming availability</span><a href="/about">Artwork via TMDB · Credits</a><a href="/">Back to main site</a></footer>
 </main>;
}
