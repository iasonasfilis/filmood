"use client";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, Clapperboard, Search, FlaskConical, Heart, RotateCcw, SlidersHorizontal, Sparkles, GitMerge, Fingerprint, Tv, Menu, UserRound, LogIn, LogOut, Shield, FileText, Info, Users, X } from "lucide-react";
import "./studio.css";
import { interpretFilmate } from "./filmate-lite";
import "./filmood-discovery.css";
import "./discovery-layout.css";
import "./extra-features.css";

type Axis = "dark" | "pace" | "emotion" | "mind" | "visual" | "indie" | "humor" | "action";
type DNA = Record<Axis, number>;
type Film = { id:number; title:string; year:number; length:number; region:"American"|"European"|"Asian"|"World"; genres:string[]; description:string; dna:DNA; poster?:string };
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
const FILMS:Film[]=[
  {id:1,title:"Arrival",year:2016,length:116,region:"American",genres:["Sci-fi","Drama"],description:"A profound encounter with language, memory and loss.",dna:dna(59,35,86,88,83,45,5,25),poster:"4Iu5f2nv7huqvuYkmZvSPOtbFjs.jpg"},
  {id:2,title:"Her",year:2013,length:126,region:"American",genres:["Romance","Sci-fi"],description:"A lonely, tender vision of connection and technology.",dna:dna(35,38,91,72,77,55,25,8),poster:"eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg"},
  {id:3,title:"After Yang",year:2021,length:96,region:"American",genres:["Sci-fi","Drama"],description:"A delicate, intimate meditation on memory and family.",dna:dna(40,20,89,72,84,88,10,5)},
  {id:4,title:"Annihilation",year:2018,length:115,region:"American",genres:["Sci-fi","Mystery"],description:"Dreamlike science fiction that becomes deeply unsettling.",dna:dna(86,52,54,95,85,67,4,55)},
  {id:5,title:"Coherence",year:2013,length:89,region:"American",genres:["Sci-fi","Thriller"],description:"A tightly wound, inventive dinner-party mystery.",dna:dna(70,77,46,91,43,94,11,45)},
  {id:6,title:"Ex Machina",year:2014,length:108,region:"European",genres:["Sci-fi","Thriller"],description:"A precise, philosophical game of manipulation.",dna:dna(77,53,58,91,77,55,12,44)},
  {id:7,title:"Moon",year:2009,length:97,region:"European",genres:["Sci-fi","Drama"],description:"An isolated astronaut confronts the meaning of identity.",dna:dna(55,38,77,78,64,74,15,27)},
  {id:8,title:"Eternal Sunshine of the Spotless Mind",year:2004,length:108,region:"American",genres:["Romance","Drama"],description:"An inventive, aching trip through love and memory.",dna:dna(45,64,94,80,88,55,62,14)},
  {id:9,title:"Nightcrawler",year:2014,length:117,region:"American",genres:["Crime","Thriller"],description:"An unnerving portrait of ambition after dark.",dna:dna(94,79,50,68,74,64,45,67),poster:"8oPY6ULFOTbAEskySNhgsUIN4fW.jpg"},
  {id:10,title:"The Nice Guys",year:2016,length:116,region:"American",genres:["Comedy","Crime"],description:"A chaotic buddy mystery with razor-sharp humor.",dna:dna(41,91,42,45,60,35,93,75)},
  {id:11,title:"In Bruges",year:2008,length:107,region:"European",genres:["Crime","Comedy"],description:"Darkly funny, violent and unexpectedly heartfelt.",dna:dna(72,50,84,65,74,66,84,52)},
  {id:12,title:"Kiss Kiss Bang Bang",year:2005,length:103,region:"American",genres:["Crime","Comedy"],description:"A quick-witted noir that constantly surprises.",dna:dna(51,86,52,60,61,50,94,70)},
  {id:13,title:"Parasite",year:2019,length:132,region:"Asian",genres:["Thriller","Drama"],description:"A genre-shifting mix of suspense, satire and family.",dna:dna(74,78,79,85,84,76,71,61)},
  {id:14,title:"Burning",year:2018,length:148,region:"Asian",genres:["Mystery","Drama"],description:"A quietly devastating mystery of uncertainty.",dna:dna(91,25,77,88,91,88,10,25)},
  {id:15,title:"Drive",year:2011,length:100,region:"American",genres:["Crime","Drama"],description:"Neon nights, silence and sudden violence.",dna:dna(76,48,65,63,96,60,12,77)},
  {id:16,title:"The Grand Budapest Hotel",year:2014,length:99,region:"American",genres:["Comedy","Adventure"],description:"Stylized, witty and bittersweet.",dna:dna(37,84,78,67,99,58,86,38),poster:"eWdyYQreja6JGCzqHw5Q3x8l9a2.jpg"},
  {id:17,title:"Aftersun",year:2022,length:102,region:"European",genres:["Drama"],description:"A subtle emotional afterimage of family and memory.",dna:dna(55,20,99,62,85,92,12,5)},
  {id:18,title:"Before Sunset",year:2004,length:80,region:"European",genres:["Romance","Drama"],description:"An intimate conversation heavy with time and longing.",dna:dna(23,35,93,72,78,80,58,0)},
  {id:19,title:"Past Lives",year:2023,length:106,region:"American",genres:["Romance","Drama"],description:"A quietly moving story of paths not taken.",dna:dna(40,25,94,72,82,71,30,2)},
  {id:20,title:"The Handmaiden",year:2016,length:145,region:"Asian",genres:["Thriller","Drama"],description:"Intricate deception, desire and lavish visual style.",dna:dna(87,69,74,89,97,70,42,50)},
  {id:21,title:"Oldboy",year:2003,length:120,region:"Asian",genres:["Thriller","Action"],description:"A brutal, shocking and emotionally charged mystery.",dna:dna(98,79,76,79,90,66,25,90)},
  {id:22,title:"The Lobster",year:2015,length:119,region:"European",genres:["Comedy","Drama"],description:"Absurd dark humor in an unsettling parallel world.",dna:dna(72,30,61,87,90,80,78,20)},
  {id:23,title:"The Worst Person in the World",year:2021,length:128,region:"European",genres:["Comedy","Drama"],description:"A lively, funny and affecting story of growing up.",dna:dna(42,67,87,74,73,83,72,12)}
];
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
const STORAGE="filmood-studio-v1";
const defaultReference="Arrival";
const clamp=(n:number)=>Math.max(0,Math.min(100,n));
const distance=(film:Film,target:DNA)=>AXES.reduce((total,a)=>total+Math.abs(film.dna[a.key]-target[a.key])*({emotion:1.25,mind:1.2,visual:1.0,dark:1.05,pace:1.0,indie:.75,humor:.85,action:.85} as Record<Axis,number>)[a.key],0);
const MATCH_WEIGHTS:Record<Axis,number>={emotion:1.25,mind:1.2,visual:1,dark:1.05,pace:1,indie:.75,humor:.85,action:.85};
const matchPercentage=(film:Film,target:DNA)=>Math.round(Math.max(0,Math.min(100,100-distance(film,target)/AXES.reduce((sum,a)=>sum+MATCH_WEIGHTS[a.key]*100,0)*100)));
const readable=(key:Axis,film:Film)=>AXES.find(a=>a.key===key)!.name.toLowerCase();
export default function Studio(){
 const [mode,setMode]=useState<Mode>("mood");
 const [fusionA,setFusionA]=useState("Arrival");
 const [fusionB,setFusionB]=useState("Parasite");
 const [fusionWeight,setFusionWeight]=useState(60);
 const [situation,setSituation]=useState("Any occasion");
 const [view,setView]=useState<View>("start");
 const [moods,setMoods]=useState<string[]>([]);
 const [chatInput,setChatInput]=useState("");
 const [filmateError,setFilmateError]=useState("");
 const [chatHistory,setChatHistory]=useState<{role:"user"|"guide";text:string}[]>([]);
 const [chatTarget,setChatTarget]=useState<DNA|null>(null);
 const [reference,setReference]=useState(defaultReference);
 const [filmQuery,setFilmQuery]=useState("");
 const [filmSearchOpen,setFilmSearchOpen]=useState(false);
 const [recentFilmSearches,setRecentFilmSearches]=useState<string[]>([]);
 const [filmSearchFocus,setFilmSearchFocus]=useState(false);
 const [keep,setKeep]=useState<string[]>(["Atmosphere","Emotional feeling"]);
 const [mix,setMix]=useState<DNA>({...REFERENCES[0].dna});
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
 const [searchCategory,setSearchCategory]=useState<"films"|"people">("films");
 const [creditsOpen,setCreditsOpen]=useState(false);
 const [details,setDetails]=useState<Film|null>(null);
 const [loaded,setLoaded]=useState(false);
 // A new discovery screen must start at its top, not inherit the previous scroll position.
 useLayoutEffect(()=>{window.scrollTo({top:0,left:0,behavior:"instant"});},[view]);
 useEffect(()=>{try{const history=JSON.parse(localStorage.getItem("filmood-recent-film-searches")||"[]");if(Array.isArray(history))setRecentFilmSearches(history.filter((x:unknown):x is string=>typeof x==="string").slice(0,8));}catch{}},[]);
 useEffect(()=>{try{const s=localStorage.getItem(STORAGE);if(s){const p=JSON.parse(s);if(Array.isArray(p.saved))setSaved(p.saved);if(Array.isArray(p.watched))setWatched(p.watched);if(Array.isArray(p.passed))setPassed(p.passed);if(Array.isArray(p.liked))setLiked(p.liked);if(Array.isArray(p.subscribed))setSubscribed(p.subscribed);}}catch{}setLoaded(true);},[]);
 useEffect(()=>{if(loaded){try{localStorage.setItem(STORAGE,JSON.stringify({saved,watched,passed,liked,subscribed}));}catch{}}},[saved,watched,passed,liked,subscribed,loaded]);
 const fusionDNA=AXES.reduce((a,axis)=>{const first=FILMS.find(f=>f.title===fusionA)?.dna||FILMS[0].dna;const second=FILMS.find(f=>f.title===fusionB)?.dna||FILMS[12].dna;a[axis.key]=Math.round(first[axis.key]*fusionWeight/100+second[axis.key]*(100-fusionWeight)/100);return a;},{} as DNA);
 const fingerprint=useMemo(()=>{const films=FILMS.filter(f=>liked.includes(f.id)||watched.includes(f.id));if(!films.length)return null;return AXES.reduce((a,axis)=>{a[axis.key]=Math.round(films.reduce((sum,f)=>sum+f.dna[axis.key]*(liked.includes(f.id)?2:1),0)/films.reduce((sum,f)=>sum+(liked.includes(f.id)?2:1),0));return a;},{} as DNA);},[liked,watched]);
 const referenceDNA=REFERENCES.find(r=>r.name===reference)?.dna||FILMS.find(f=>f.title===reference)?.dna||REFERENCES[0].dna;
 const moodDNA=AXES.reduce((acc,axis)=>{const selected=MOOD_PRESETS.filter(m=>moods.includes(m.label));acc[axis.key]=selected.length?Math.round(selected.reduce((sum,m)=>sum+m.target[axis.key],0)/selected.length):50;return acc;},{} as DNA);
 const target=view==="lab"?mix:view==="fusion"?fusionDNA:chatTarget|| (mode==="filmood"?referenceDNA:moodDNA);
 const results=useMemo(()=>FILMS.filter(f=>!passed.includes(f.id)&&!watched.includes(f.id))
  .filter(f=>mode!=="filmood"||f.title!==reference)
  .filter(f=>region==="Anywhere"||f.region===region)
  .filter(f=>runtime==="Any length"||(runtime==="Under 100 min"?f.length<100:runtime==="100–140 min"?f.length>=100&&f.length<=140:f.length>140))
  .map(f=>({film:f,score:distance(f,target)+(liked.includes(f.id)?-16:0)+((depth-50)/50)*(f.dna.indie-50)*-.35}))
  .sort((a,b)=>matchPercentage(b.film,target)-matchPercentage(a.film,target)||a.score-b.score||a.film.id-b.film.id).slice(0,6).map(x=>x.film),
  [mode,reference,region,runtime,depth,passed,watched,liked,target]);
 const filmSuggestions=useMemo(()=>{const q=filmQuery.trim().toLowerCase();const pool=FILMS.filter(f=>f.title!==reference);return pool.map(f=>({film:f,score:distance(f,referenceDNA)})).sort((a,b)=>{if(q){const aMatch=a.film.title.toLowerCase().includes(q)?0:1;const bMatch=b.film.title.toLowerCase().includes(q)?0:1;if(aMatch!==bMatch)return aMatch-bMatch;}return matchPercentage(b.film,referenceDNA)-matchPercentage(a.film,referenceDNA)||a.film.id-b.film.id;}).slice(0,6).map(x=>x.film);},[filmQuery,reference,referenceDNA]);
 const launch=()=>{if(mode==="mood"&&moods.length===0&&!chatTarget)return;setMix({...target});setView("results");};
 const chooseMode=(next:Mode)=>{if(next==="mood")setMoods([]);setMode(next);setChatHistory([]);setChatInput("");setChatTarget(null);setFilmQuery("");setView("play");};
 const chooseMood=(label:string)=>{setMoods(prev=>prev.includes(label)?(prev.filter(x=>x!==label)):[...prev,label]);setChatTarget(null);};
 const sendChat=()=>{const input=chatInput.trim();if(!input)return;setFilmateError("");const base=chatTarget||(mode==="mood"?moodDNA:referenceDNA);const analysis=interpretFilmate(input,base,FILMS.map(f=>f.title),chatHistory.length);setChatHistory(h=>[...h,{role:"user",text:input},{role:"guide",text:analysis.reply}]);setChatInput("");setChatTarget(analysis.dna);setMix(analysis.dna);setView("results");};
 const enterLab=(film?:Film)=>{if(film){setReference(film.title);setMix({...film.dna});setMode("filmood");}else setMix({...target});setView("lab");};
 const chooseSearchFilm=(film:Film)=>{changeReference(film.title);setChatTarget(null);setFilmQuery("");setFilmSearchOpen(false);setFilmSearchFocus(false);setRecentFilmSearches(previous=>{const next=[film.title,...previous.filter(x=>x!==film.title)].slice(0,8);try{localStorage.setItem("filmood-recent-film-searches",JSON.stringify(next));}catch{}return next;});setView("results");};
 const liveFilmSearch=useMemo(()=>{const q=filmQuery.trim().toLocaleLowerCase();if(!q)return [];return FILMS.map(f=>({f,title:f.title.toLocaleLowerCase()})).filter(({title})=>title.includes(q)).sort((a,b)=>{const ar=a.title.startsWith(q)?0:1;const br=b.title.startsWith(q)?0:1;return ar-br||a.title.indexOf(q)-b.title.indexOf(q)||a.f.title.localeCompare(b.f.title);}).slice(0,15).map(x=>x.f);},[filmQuery]);
 const changeReference=(value:string)=>{setReference(value);setMix({...(REFERENCES.find(r=>r.name===value)?.dna||FILMS.find(f=>f.title===value)?.dna||REFERENCES[0].dna)});};
 const toggle=(list:number[],fn:(ids:number[])=>void,id:number)=>fn(list.includes(id)?list.filter(x=>x!==id):[...list,id]);
 const reset=()=>{setMix({...referenceDNA});setRegion("Anywhere");setRuntime("Any length");setDepth(52);};
 const sharedReason=(f:Film)=>{const closer=AXES.map(a=>({key:a.key,name:readable(a.key,f),delta:Math.abs(f.dna[a.key]-target[a.key])})).sort((a,b)=>a.delta-b.delta).slice(0,2).map(a=>a.name).join(" and ");const differences=AXES.map(a=>({name:a.name.toLowerCase(),delta:f.dna[a.key]-target[a.key]})).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));const contrast=differences[0];return "The vibe match: "+closer+". Compared with your mix, "+f.title+" leans "+(contrast.delta>0?"more ":"less ")+contrast.name+". "+f.description;};
 return <main className="studio">
  <header className="studio-nav"><button className="studio-menu-toggle" aria-label="Open site menu" aria-expanded={menuOpen} onClick={()=>setMenuOpen(true)}><Menu size={23}/></button>
   <a href="/" className="studio-word">FILMOOD<span>.</span></a>
   <nav aria-label="Discovery navigation">
    <button className={view==="start"?"active":""} onClick={()=>setView("start")}>Discover</button>
    <button className={view==="lab"?"active":""} onClick={()=>enterLab()}><FlaskConical size={15}/> Film Lab</button>
    <button onClick={()=>setView("fusion")}><GitMerge size={15}/> Film Blend</button><button className="studio-account-nav" onClick={()=>setView("fingerprint")}><Fingerprint size={15}/> My fingerprint</button><button className="studio-account-nav" onClick={()=>setProviderOpen(!providerOpen)}><Tv size={15}/> My services</button>
   </nav>
  </header>
  {menuOpen&&<div className="studio-menu-scrim" onClick={()=>setMenuOpen(false)}><aside className="studio-site-drawer" role="dialog" aria-modal="true" aria-label="FILMOOD navigation" onClick={e=>e.stopPropagation()}><div className="studio-drawer-head"><strong>FILMOOD<span>.</span></strong><button aria-label="Close menu" onClick={()=>setMenuOpen(false)}><X size={22}/></button></div><p className="studio-drawer-label">DISCOVER</p><button onClick={()=>{setView("start");setMenuOpen(false);}}><Clapperboard size={19}/> Discover films</button><button onClick={()=>{enterLab();setMenuOpen(false);}}><FlaskConical size={19}/> Film Lab</button><button onClick={()=>{setView("fusion");setMenuOpen(false);}}><GitMerge size={19}/> Film Blend</button><p className="studio-drawer-label">YOUR SPACE</p><button onClick={()=>{setView("fingerprint");setMenuOpen(false);}}><Fingerprint size={19}/> Cinematic Fingerprint</button><button onClick={()=>{setProviderOpen(true);setMenuOpen(false);}}><Tv size={19}/> Streaming services</button><button disabled title="Accounts are not available yet"><UserRound size={19}/> Account <small>COMING SOON</small></button><button disabled title="Sign in is not available yet"><LogIn size={19}/> Sign in <small>COMING SOON</small></button><button disabled title="No account session exists yet"><LogOut size={19}/> Sign out <small>NOT SIGNED IN</small></button><p className="studio-drawer-label">INFORMATION</p><a href="/about"><Info size={19}/> About FILMOOD</a><a href="/privacy"><Shield size={19}/> Privacy policy</a><a href="/terms"><FileText size={19}/> Terms of service</a><div className="studio-drawer-bottom">FILMOOD. · Independent movie discovery prototype</div></aside></div>}
  {filmSearchOpen&&<div className="studio-film-search-overlay" role="dialog" aria-modal="true" aria-label="Search films">
    <div className="studio-film-search-shell"><div className="studio-film-search-header"><button type="button" aria-label="Back to FILMOOD" onClick={()=>{setFilmSearchOpen(false);setFilmSearchFocus(false);setFilmQuery("");}}><ArrowLeft size={24}/></button><form onSubmit={e=>{e.preventDefault();if(liveFilmSearch[0])chooseSearchFilm(liveFilmSearch[0]);}}><input aria-label="Search movie titles" autoFocus={filmSearchFocus} value={filmQuery} onChange={e=>setFilmQuery(e.target.value)} placeholder="Search films…" autoComplete="off"/><button type="submit" aria-label="Search" disabled={!liveFilmSearch.length}><Search size={19}/></button></form><button type="button" aria-label="Clear search" onClick={()=>setFilmQuery("")}><X size={23}/></button></div>
    <div className="studio-film-search-tabs"><button className={searchCategory==="films"?"active":""} onClick={()=>setSearchCategory("films")}>FILMS</button><button className={searchCategory==="people"?"active":""} onClick={()=>setSearchCategory("people")}>CAST &amp; CREW</button></div>
    <div className="studio-film-search-content">{searchCategory==="people"?<div className="studio-people-search-placeholder"><Users size={38}/><h2>Find the people behind the films.</h2><p>Search actors, directors, writers, cinematographers, editors, composers and other cast or crew members.</p><div className="studio-people-query">{filmQuery.trim()?<>SEARCHING PEOPLE FOR <strong>“{filmQuery.trim()}”</strong></>:"TYPE A NAME ABOVE TO BEGIN"}</div><p className="studio-people-note">People search is a preview. A film-credits database is needed before real names and results can appear.</p></div>:filmQuery.trim()?<><p className="studio-film-search-caption">{liveFilmSearch.length?"MATCHING FILMS":"NO MATCHES"}</p>{liveFilmSearch.length?liveFilmSearch.map(f=><button type="button" className="studio-film-search-result" key={f.id} onClick={()=>chooseSearchFilm(f)}><span className="studio-film-search-poster">{f.poster?<img src={"https://image.tmdb.org/t/p/w185/"+f.poster} alt="" loading="lazy"/>:<span>{f.title.slice(0,1)}</span>}</span><span className="studio-film-search-description"><strong>{f.title}</strong><small>{f.year} · {f.genres.join(" · ")}</small></span><ArrowRight size={19}/></button>):<div className="studio-film-search-empty">No matching films in our current 23-film demo catalog. Try a different title.</div>}</>:<><p className="studio-film-search-caption">RECENT SEARCHES</p>{recentFilmSearches.length?recentFilmSearches.map(name=>{const f=FILMS.find(x=>x.title===name);return f?<button type="button" className="studio-film-search-recent" key={name} onClick={()=>chooseSearchFilm(f)}><span><Search size={16}/>{name}</span><span>FILM <ArrowRight size={15}/></span></button>:null;}):<p className="studio-film-search-empty">Your recent searches will appear here once you select a film.</p>}<p className="studio-film-search-caption">START EXPLORING</p>{FILMS.slice(0,4).map(f=><button type="button" className="studio-film-search-result" key={f.id} onClick={()=>chooseSearchFilm(f)}><span className="studio-film-search-poster">{f.poster?<img src={"https://image.tmdb.org/t/p/w185/"+f.poster} alt="" loading="lazy"/>:<span>{f.title.slice(0,1)}</span>}</span><span className="studio-film-search-description"><strong>{f.title}</strong><small>{f.year}</small></span><ArrowRight size={18}/></button>)}</>}</div><p className="studio-film-search-footnote">FILMOOD. · Search currently covers 23 curated films. Larger catalog coming later.</p></div>
   </div>}
  {providerOpen&&<div className="studio-services-backdrop" onClick={()=>setProviderOpen(false)}><section className="studio-services-panel" role="dialog" aria-modal="true" aria-label="Streaming platforms" onClick={e=>e.stopPropagation()}>
    <div className="studio-services-heading"><div><span className="studio-eyebrow">YOUR WATCHING WORLD / 01</span><h2>Where stories <em>live.</em></h2><p>Choose the services you use. Your selection stays in this browser.</p></div><button className="studio-services-close" aria-label="Close streaming platforms" onClick={()=>setProviderOpen(false)}><X size={21}/></button></div>
    <div className="studio-services-count"><span>YOUR STREAMING COLLECTION</span><strong>{subscribed.length+1}<small> / {PROVIDERS.length} services</small></strong></div>
    <div className="studio-services-grid">{PROVIDERS.map((p,i)=>{const selected=Boolean(p.free||subscribed.includes(p.id));return <button type="button" key={p.id} className={"studio-service-tile"+(selected?" selected":"")} aria-pressed={selected} disabled={p.free} onClick={()=>setSubscribed(a=>a.includes(p.id)?a.filter(x=>x!==p.id):[...a,p.id])}><span className="studio-service-number">{String(i+1).padStart(2,"0")}</span><span className="studio-service-mark">{p.name.slice(0,1)}</span><strong>{p.name}</strong><span className="studio-service-status">{p.free?"FREE · INCLUDED":selected?"✓ SELECTED":"+ ADD SERVICE"}</span></button>})}</div>
    <p className="studio-services-disclaimer"><strong>Streaming availability isn't connected yet.</strong> These preferences are saved locally, but do not filter recommendations or verify which films are on each platform in Greece.</p>
    <button className="studio-primary studio-services-done" onClick={()=>setProviderOpen(false)}>Save my selection <Check size={17}/></button>
   </section></div>}
  {view==="start"&&<section className="studio-hero">
   <div className="studio-cinema-backdrop" aria-hidden="true"/>
   <p className="studio-eyebrow">FILMOOD ORIGINAL DISCOVERY EXPERIENCE</p>
   <h1>Some feelings deserve<br/><em>another film.</em></h1>
   <p className="studio-lead">A cinematic experience built around what moves you. Pick a direction. The discovery begins on the next screen.</p>
   <p className="studio-feature-label">CHOOSE YOUR WAY IN <span>01 / 04</span></p>
   <div className="studio-mode-grid">
    <button className="studio-mode" onClick={()=>chooseMode("mood")}><Heart size={27}/><strong>MOOD.</strong><span>Start with a feeling. Discover where it takes you.</span><ArrowRight className="studio-mode-arrow" size={22}/></button>
    <button className="studio-mode" onClick={()=>chooseMode("filmood")}><Clapperboard size={27}/><strong>FILMOOD.</strong><span>Start with a film. Follow its emotional aftertaste.</span><ArrowRight className="studio-mode-arrow" size={22}/></button>
   </div>
   <div className="studio-experiments-heading"><span>THE EXPERIMENTS</span><small>TAKE DISCOVERY FURTHER</small></div>
   <div className="studio-experiments-grid">
    <button className="studio-experiment-card studio-experiment-lab" onClick={()=>enterLab()}><span className="studio-experiment-icon"><FlaskConical size={27}/></span><span className="studio-experiment-number">03 / THE FILM LAB</span><strong>The Film Lab.</strong><small>Rewrite the feeling. Eight cinematic ingredients, one recipe that is entirely yours.</small><span className="studio-experiment-action">ENTER THE LAB <ArrowRight size={17}/></span></button>
    <button className="studio-experiment-card studio-experiment-blend" onClick={()=>setView("fusion")}><span className="studio-experiment-icon"><GitMerge size={27}/></span><span className="studio-experiment-number">04 / THE FILM BLEND</span><strong>The Film Blend.</strong><small>Two films. One new feeling. Discover what happens when cinematic worlds collide.</small><span className="studio-experiment-action">START BLENDING <ArrowRight size={17}/></span></button>
   </div>
  </section>}
  {view==="play"&&<section className="studio-play">
    <button className="studio-back-link" onClick={()=>setView("start")}><ArrowLeft size={16}/> Choose another experience</button>
    <p className="studio-eyebrow">{mode==="mood"?"01 / MOOD.":"02 / FILMOOD."} — YOUR CINEMATIC PLAYGROUND</p>
    <h1>{mode==="mood"?"What does tonight feel like?":"A film is never just a film."}</h1>
    <p className="studio-play-intro">{mode==="mood"?"Choose a visual atmosphere or describe what you're craving. No questionnaire.":"Pick a film that stayed with you. Then tell us what you want to feel again — or just discover."}</p>
    <div className="studio-discovery-columns"><div className="studio-discovery-primary">{mode==="mood"?<div className="studio-visual-moods">{MOOD_PRESETS.map((m,i)=><button key={m.label} type="button" aria-pressed={moods.includes(m.label)} className={"studio-visual-mood mood-"+i+(moods.includes(m.label)?" chosen":"")} onClick={()=>chooseMood(m.label)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();launch();}}}><span className="studio-visual-mood-number">0{i+1}</span><strong>{m.label}</strong><span className="studio-mood-check">{moods.includes(m.label)?"✓ IN YOUR MIX":"ADD TO YOUR MIX"} <ArrowRight size={14}/></span></button>)}</div>
    :<div className="studio-filmood-discovery">
      <div className="studio-filmood-top"><div><span>YOUR CINEMATIC STARTING POINT</span><h2>Six films. One feeling.</h2><p>Inspired by <strong>{reference}</strong>. Ordered by DNA match.</p></div><span className="studio-six-count">06 / FILMS</span></div>
      <button type="button" className="studio-filmood-search studio-search-launch" onClick={()=>{setFilmQuery("");setFilmSearchOpen(true);setFilmSearchFocus(true);}}><span>SEARCH A FILM · LIVE POSTER RESULTS</span><strong><Search size={20}/> Search any film in our catalog…</strong><small>Tap to search by title. Results appear as you type.</small></button>
      <div className="studio-filmood-six">{filmSuggestions.map((f,i)=><button key={f.id} className="studio-filmood-tile" onClick={()=>{changeReference(f.title);setFilmQuery("");setChatTarget(null);}} aria-label={"Find films inspired by "+f.title}><div className="studio-filmood-art">{f.poster?<img src={"https://image.tmdb.org/t/p/w500/"+f.poster} alt="" loading="lazy"/>:<span>{f.title.slice(0,1)}</span>}<small>{String(i+1).padStart(2,"0")}</small></div><strong>{f.title}</strong><span>{f.year} · {matchPercentage(f,referenceDNA)}% DNA</span></button>)}</div>
     </div>}
    {mode==="mood"&&<div className="studio-mood-mix"><span>YOUR MOOD MIX · {moods.length} {moods.length===1?"FEELING":"FEELINGS"}</span><div>{moods.map(m=><button key={m} onClick={()=>chooseMood(m)} title="Remove mood">{m} {moods.length>1?"×":"✓"}</button>)}</div><small>Every selected mood contributes equally to the cinematic DNA used for recommendations.</small></div>}
    <label className="studio-occasion">TONIGHT'S SITUATION<select value={situation} onChange={e=>setSituation(e.target.value)}>{["Any occasion","Watching alone","Date night","With friends","Sunday afternoon","3 AM existential crisis"].map(s=><option key={s}>{s}</option>)}</select></label>
    <div className="studio-play-actions"><button className="studio-primary" disabled={mode==="mood"&&moods.length===0&&!chatTarget} onClick={launch}>Discover films <ArrowRight size={18}/></button></div></div>
    <aside className="studio-chat-panel"><div className="studio-chat-top"><Sparkles size={18}/><div><strong>Tell FILMOOD what you're looking for</strong><small>Say anything, your way · Demo keyword interpretation, not connected to AI yet</small></div></div>
    {chatHistory.length>0&&<div className="studio-chat-history">{chatHistory.map((m,i)=><p key={i} className={"studio-chat-"+m.role}>{m.text}</p>)}</div>}
    {filmateError&&<p className="studio-filmmate-error" role="alert">{filmateError}</p>}
    <form onSubmit={e=>{e.preventDefault();void sendChat();}} className="studio-chat-compose"><input aria-label="Describe your ideal film" value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder={mode==="mood"?"Something beautiful, melancholic and a little mysterious…":"Like Arrival, but darker, stranger and more intense…"} /><button type="submit" disabled={!chatInput.trim()} aria-label="Ask Filmate"><ArrowRight size={20}/></button></form>
    <p className="studio-filmmate-note">Filmate Lite runs locally — no API key, no external AI. It understands selected film preferences and keywords, not unrestricted human conversation.</p></aside></div>
  </section>}
  {view==="fusion"&&<section className="studio-feature-screen studio-experiment">
    <button className="studio-feature-back" onClick={()=>setView("start")}><ArrowLeft size={16}/> Back to discovery</button>
    <div className="studio-feature-banner studio-fusion-banner"><span>THE FILM BLEND / EXPERIMENT NO. 002</span><h1>Two films.<br/><em>One new feeling.</em></h1><p>Blend the cinematic DNA of two stories. Discover the unexpected space between them.</p><div className="studio-feature-steps"><span>01 · PICK TWO FILMS</span><span>02 · FIND THE BALANCE</span><span>03 · DISCOVER THE BLEND</span></div></div>
    <div className="studio-feature-layout"><div className="studio-feature-console"><span className="studio-eyebrow">THE BLENDING DESK</span><h2>Mix your influences.</h2><p>Choose two films and decide how much of each to keep.</p><div className="studio-fusion-controls"><label>FILM 01<select value={fusionA} onChange={e=>setFusionA(e.target.value)}>{FILMS.map(f=><option key={f.id}>{f.title}</option>)}</select></label><label>FILM 02<select value={fusionB} onChange={e=>setFusionB(e.target.value)}>{FILMS.map(f=><option key={f.id}>{f.title}</option>)}</select></label></div><div className="studio-fusion-balance"><span>{fusionWeight}% <small>{fusionA}</small></span><span>{100-fusionWeight}% <small>{fusionB}</small></span></div><label className="studio-fusion-weight"><input aria-label="Balance the two films" type="range" min="0" max="100" value={fusionWeight} onChange={e=>setFusionWeight(Number(e.target.value))}/></label><div className="studio-fusion-dna">{AXES.map(a=><div key={a.key}><span>{a.name}</span><div><i style={{width:fusionDNA[a.key]+"%"}}/></div><strong>{fusionDNA[a.key]}</strong></div>)}</div><a className="studio-primary studio-fusion-results-link" href="#fusion-results">See blended matches <ArrowRight size={18}/></a></div>
    <div id="fusion-results" className="studio-feature-output"><span className="studio-eyebrow">YOUR BLEND RESULTS</span><h2>Somewhere between.</h2><p>Six films closest to your blended DNA, from our current demo catalog.</p><div className="studio-feature-matches">{FILMS.filter(f=>f.title!==fusionA&&f.title!==fusionB).map(f=>({f,score:matchPercentage(f,fusionDNA)})).sort((a,b)=>b.score-a.score).slice(0,6).map(({f,score},i)=><button key={f.id} onClick={()=>{setDetails(f);setCreditsOpen(false);}}><span className="studio-feature-match-rank">{String(i+1).padStart(2,"0")} / BLEND PICK</span><div className="studio-feature-match-poster">{f.poster?<img src={"https://image.tmdb.org/t/p/w342/"+f.poster} alt="" loading="lazy"/>:<span>{f.title.slice(0,1)}</span>}</div><div><strong>{f.title}</strong><span>{score}% DNA MATCH</span><small>{f.description}</small></div></button>)}</div></div></div>
   </section>}
  {view==="fingerprint"&&<section className="studio-feature-screen studio-experiment">
    <button className="studio-feature-back" onClick={()=>setView("start")}><ArrowLeft size={16}/> Back to discovery</button>
    <div className="studio-feature-banner studio-fingerprint-banner"><span>YOUR CINEMATIC IDENTITY / PROFILE NO. 001</span><h1>Every film leaves<br/><em>a fingerprint.</em></h1><p>Your personal cinematic DNA grows from the films you love and the stories you've watched.</p><div className="studio-feature-steps"><span>01 · WATCH</span><span>02 · LOVE</span><span>03 · DISCOVER YOUR DNA</span></div></div>
    <div className="studio-feature-layout"><div className="studio-feature-console"><span className="studio-eyebrow">YOUR FILM PROFILE</span><h2>The films that shaped you.</h2><div className="studio-fingerprint-stats"><div><strong>{watched.length}</strong><span>WATCHED</span></div><div><strong>{liked.length}</strong><span>LOVED</span></div><div><strong>{saved.length}</strong><span>SAVED</span></div></div><p>Mark films as Watched or Liked from discovery results. Your profile is stored only in this browser.</p><button className="studio-primary" onClick={()=>setView("start")}>Discover more films <ArrowRight size={18}/></button></div><div className="studio-feature-output"><span className="studio-eyebrow">THE CINEMATIC READOUT</span><h2>Your signature.</h2>{fingerprint?<><p className="studio-fingerprint-summary">Your strongest signals: {AXES.map(a=>({name:a.name,value:fingerprint[a.key]})).sort((a,b)=>b.value-a.value).slice(0,3).map(a=>a.name.toLowerCase()).join(", ")}.</p><div className="studio-fingerprint-axes">{AXES.map(a=><div key={a.key}><span>{a.name} <strong>{fingerprint[a.key]} / 100</strong></span><progress value={fingerprint[a.key]} max={100}/></div>)}</div></>:<div className="studio-fingerprint-empty"><Sparkles size={30}/><h3>Your story starts here.</h3><p>No fingerprint yet. Like or mark films as watched to reveal your cinematic personality.</p></div>}</div></div>
   </section>}
  {(view==="results"||view==="lab")&&<section className="studio-workspace">
   <div className="studio-workspace-head"><button onClick={()=>setView("play")}><ArrowLeft size={15}/> Back to discovery</button><span>{view==="lab"?"THE FILM LAB.":"YOUR DISCOVERY"}</span><button onClick={()=>enterLab()} disabled={view==="lab"}><SlidersHorizontal size={16}/> Remix</button></div>
   {view==="lab"&&<div className="studio-lab-banner"><span>THE FILM LAB / EXPERIMENT NO. 001</span><h2>Rewrite the feeling.<br/><em>Keep the magic.</em></h2><p>Eight cinematic ingredients. Endless ways to change the atmosphere. Drag, remix, discover.</p><div className="studio-lab-steps"><span>01 · CHOOSE A FILM</span><span>02 · REMIX ITS DNA</span><span>03 · DISCOVER YOUR CUT</span></div></div>}
   <div className={view==="lab"?"studio-columns lab":"studio-columns"}>
    <section className="studio-controls">
     {view==="lab"?<>
       <p className="studio-eyebrow">THE MIXING DESK</p><h1>Your cinematic recipe.</h1><p className="studio-muted">Change the ingredients. The film selection responds as you experiment.</p>
       <div className="studio-base"><label htmlFor="base-film">YOUR BASE RECIPE</label><select id="base-film" value={reference} onChange={e=>changeReference(e.target.value)}>{[...REFERENCES.map(r=>r.name),...FILMS.map(f=>f.title).filter(name=>!REFERENCES.some(r=>r.name===name))].map(name=><option key={name}>{name}</option>)}</select><button onClick={reset} title="Reset recipe"><RotateCcw size={16}/> Reset</button></div>
       <div className="studio-lab-meter"><span>YOUR CURRENT MIX</span><strong>{Math.round(AXES.reduce((n,a)=>n+mix[a.key],0)/AXES.length)}<small> / 100</small></strong><p>Average intensity across your eight ingredients</p></div><div className="studio-sliders">{AXES.map(a=><label key={a.key} className="studio-axis"><span><strong>{a.name}</strong><output>{mix[a.key]}/100</output></span><input type="range" min="0" max="100" step="1" value={mix[a.key]} onChange={e=>setMix(x=>({...x,[a.key]:clamp(Number(e.target.value))}))}/><span className="studio-limits"><small>{a.low}</small><small>{a.high}</small></span></label>)}</div>
     </>:<>
       <p className="studio-eyebrow">{mode==="mood"?"MOOD.":"FILMOOD."}</p><h1>We found your kind of films.</h1><p className="studio-muted">{mode==="mood"?"A few picks for the feeling you're after.":"Inspired by "+reference+" and its emotional signature."}</p>
       <div className="studio-summary studio-reference-summary">{mode==="filmood"&&<div className="studio-reference-poster">{FILMS.find(f=>f.title===reference)?.poster?<img src={"https://image.tmdb.org/t/p/w185/"+FILMS.find(f=>f.title===reference)?.poster} alt={reference+" poster"}/>:<span>{reference.slice(0,1)}</span>}</div>}<div className="studio-reference-copy"><small>{mode==="filmood"?"YOUR STARTING FILM":"YOUR MOOD MIX"}</small><strong>{mode==="mood"?moods.join(" + "):"Inspired by "+reference}</strong>{situation!=="Any occasion"&&<span>{situation}</span>}</div><button onClick={()=>setView("play")}>Change</button></div>
       <button className="studio-lab-invite" onClick={()=>enterLab()}><FlaskConical size={19}/> These are close. Want to experiment? <ArrowRight size={16}/></button>
     </>}
     <div className="studio-more"><label className="studio-occasion">TONIGHT'S SITUATION<select value={situation} onChange={e=>setSituation(e.target.value)}>{["Any occasion","Watching alone","Date night","With friends","Sunday afternoon","3 AM existential crisis"].map(s=><option key={s}>{s}</option>)}</select></label>
      <h3>Explore a little further</h3>
      <div className="studio-fields"><label>Film length<select value={runtime} onChange={e=>setRuntime(e.target.value)}><option>Any length</option><option>Under 100 min</option><option>100–140 min</option><option>Over 140 min</option></select></label>
       <label>Cinema<select value={region} onChange={e=>setRegion(e.target.value)}><option>Anywhere</option><option>American</option><option>European</option><option>Asian</option><option>World</option></select></label></div>
      <label className="studio-axis discovery"><span><strong>Familiar ↔ Hidden gems</strong><output>{depth<34?"Familiar":depth>67?"Deep cuts":"Balanced"}</output></span><input type="range" min="0" max="100" value={depth} onChange={e=>setDepth(Number(e.target.value))}/></label>
     </div>
    </section>
    <section className="studio-results">
<div className="studio-row"><div><p className="studio-eyebrow">LIVE RESULTS</p><h2>{view==="lab"?"The director’s cut":"Your films for tonight"}</h2></div><span className="studio-live"><i/>LIVE</span></div>
     <p className="studio-muted small">Match percentages are illustrative similarities calculated from eight manually estimated cinematic DNA attributes — not AI confidence, ratings or verified streaming listings.</p>
     {results.length===0?<div className="studio-empty">No matches with these constraints. Try changing the region or runtime, or reset a pass.</div>:results.map((f,i)=><article key={f.id} className="studio-film">
       <button className="studio-poster" onClick={()=>setDetails(f)} aria-label={"Details for "+f.title}><span>{f.title.slice(0,1)}</span>{f.poster&&<img src={"https://image.tmdb.org/t/p/w342/"+f.poster} alt="" loading="lazy"/>}</button>
       <div className="studio-film-body"><div className="studio-match-heading"><span className="studio-rank">{String(i+1).padStart(2,"0")} / CURATED PICK</span><span className="studio-match-score" title="Illustrative similarity based on the eight cinematic DNA attributes"><strong>{matchPercentage(f,target)}%</strong><small>DNA MATCH</small></span></div><h3>{f.title}</h3><p>{f.year} · {f.length} min · {f.region}</p><p className="studio-reason">{sharedReason(f)}</p><div className="studio-film-actions"><button onClick={()=>toggle(saved,setSaved,f.id)} title="Watchlist"><Bookmark size={15} fill={saved.includes(f.id)?"currentColor":"none"}/>{saved.includes(f.id)?"Saved":"Save"}</button><button onClick={()=>toggle(watched,setWatched,f.id)} title="Mark watched"><Check size={15}/>{watched.includes(f.id)?"Watched":"Watched?"}</button><button onClick={()=>toggle(liked,setLiked,f.id)} title="More like this"><Heart size={15} fill={liked.includes(f.id)?"currentColor":"none"}/>{liked.includes(f.id)?"Liked":"More like this"}</button><button onClick={()=>setPassed(a=>a.includes(f.id)?a:[...a,f.id])} title="Not for me"><X size={15}/>Pass</button><button onClick={()=>setDetails(f)} title={"Cast and crew for "+f.title}><Clapperboard size={15}/>Cast &amp; crew</button><button onClick={()=>enterLab(f)} title="Remix this film"><FlaskConical size={15}/>Remix</button></div></div>
      </article>)}
     <div className="studio-verification"><strong>Where to watch in Greece</strong><p>Provider availability is not verified in this prototype. We won't invent Netflix, Cinobo, ERTFLIX or other watch links.</p><button onClick={()=>setProviderOpen(true)}>Manage my streaming services <ArrowRight size={15}/></button></div>
     {passed.length>0&&<button className="studio-undo" onClick={()=>setPassed([])}>Restore passed films ({passed.length})</button>}
    </section>
   </div>
  </section>}
  {details&&<div className="studio-overlay" onClick={()=>setDetails(null)}><section className="studio-modal" role="dialog" aria-modal="true" aria-label={details.title} onClick={e=>e.stopPropagation()}><button className="studio-close" onClick={()=>setDetails(null)}><X size={20}/></button><p className="studio-eyebrow">THE FILM</p><h2>{details.title}</h2><p className="studio-muted">{details.year} · {details.length} min · {details.genres.join(" / ")}</p><p>{details.description}</p><p>{sharedReason(details)}</p><div className="studio-credits-panel"><div><strong>Cast &amp; crew</strong><p>Actors, directors, writers, cinematographers, editors, composers and more.</p></div><button type="button" onClick={()=>setCreditsOpen(v=>!v)}>{creditsOpen?"Hide credits":"View cast & crew"} <ArrowRight size={16}/></button></div>{creditsOpen&&<div className="studio-credits-preview"><p className="studio-eyebrow">CREDITS / {details.title.toUpperCase()}</p><div className="studio-credits-roles">{["Cast","Direction","Writing","Cinematography","Editing","Music","Production"].map(role=><div key={role}><strong>{role}</strong><span>Credits coming soon</span></div>)}</div><a href={"https://www.themoviedb.org/search?query="+encodeURIComponent(details.title+" "+details.year)} target="_blank" rel="noopener noreferrer">Explore verified credits on TMDB <ArrowRight size={15}/></a></div>}<p className="studio-disclaimer">Credits are placeholders until a verified credits data source is connected. DNA values are exploratory estimates, not licensed third-party measurements.</p><button className="studio-primary" onClick={()=>{enterLab(details);setDetails(null);}}>Remix this film <ArrowRight size={17}/></button><button className="studio-text" onClick={()=>{toggle(watched,setWatched,details.id);setDetails(null);}}>Mark watched / unwatch</button></section></div>}
  <footer className="studio-footer"><span>FILMOOD. · Some feelings deserve another film.</span><span>Prototype · Estimated DNA · Unverified streaming availability</span><a href="/">Back to main site</a></footer>
 </main>;
}
