"use client";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, Clapperboard, FlaskConical, Heart, RotateCcw, SlidersHorizontal, Sparkles, X } from "lucide-react";
import "./studio.css";
import { interpretFilmate } from "./filmate-lite";
import "./filmood-discovery.css";
import "./discovery-layout.css";

type Axis = "dark" | "pace" | "emotion" | "mind" | "visual" | "indie" | "humor" | "action";
type DNA = Record<Axis, number>;
type Film = { id:number; title:string; year:number; length:number; region:"American"|"European"|"Asian"|"World"; genres:string[]; description:string; dna:DNA; poster?:string };
type Mode = "mood" | "filmood";
type View = "start" | "play" | "results" | "lab" | "fusion" | "fingerprint" | "blind";
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
 const [surpriseLevel,setSurpriseLevel]=useState("Unexpected");
 const [blindFilm,setBlindFilm]=useState<number|null>(null);
 const [blindRevealed,setBlindRevealed]=useState(false);
 const [surpriseNonce,setSurpriseNonce]=useState(0);
 const [view,setView]=useState<View>("start");
 const [moods,setMoods]=useState<string[]>([]);
 const [chatInput,setChatInput]=useState("");
 const [filmateError,setFilmateError]=useState("");
 const [chatHistory,setChatHistory]=useState<{role:"user"|"guide";text:string}[]>([]);
 const [chatTarget,setChatTarget]=useState<DNA|null>(null);
 const [reference,setReference]=useState(defaultReference);
 const [filmQuery,setFilmQuery]=useState("");
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
 const [details,setDetails]=useState<Film|null>(null);
 const [loaded,setLoaded]=useState(false);
 // A new discovery screen must start at its top, not inherit the previous scroll position.
 useLayoutEffect(()=>{window.scrollTo({top:0,left:0,behavior:"instant"});},[view]);
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
 const selectSurprise=()=>{const pool=FILMS.filter(f=>!watched.includes(f.id)&&!passed.includes(f.id));if(!pool.length){setBlindFilm(null);setView("blind");return;}const sorted=pool.map(f=>({film:f,match:matchPercentage(f,target)})).sort((a,b)=>b.match-a.match);const candidates=surpriseLevel==="Safe"?sorted.slice(0,Math.max(1,Math.ceil(sorted.length*.3))):surpriseLevel==="Wild Card"?sorted.slice(Math.floor(sorted.length*.5)):sorted.slice(Math.floor(sorted.length*.2),Math.max(1,Math.ceil(sorted.length*.8)));const pick=candidates[(surpriseNonce+Math.floor(Math.random()*candidates.length))%candidates.length];setBlindFilm(pick?.film.id??null);setBlindRevealed(false);setSurpriseNonce(n=>n+1);setView("blind");};
 const launch=()=>{if(mode==="mood"&&moods.length===0&&!chatTarget)return;setMix({...target});setView("results");};
 const chooseMode=(next:Mode)=>{if(next==="mood")setMoods([]);setMode(next);setChatHistory([]);setChatInput("");setChatTarget(null);setFilmQuery("");setView("play");};
 const chooseMood=(label:string)=>{setMoods(prev=>prev.includes(label)?(prev.filter(x=>x!==label)):[...prev,label]);setChatTarget(null);};
 const sendChat=()=>{const input=chatInput.trim();if(!input)return;setFilmateError("");const base=chatTarget||(mode==="mood"?moodDNA:referenceDNA);const analysis=interpretFilmate(input,base,FILMS.map(f=>f.title),chatHistory.length);setChatHistory(h=>[...h,{role:"user",text:input},{role:"guide",text:analysis.reply}]);setChatInput("");setChatTarget(analysis.dna);setMix(analysis.dna);setView("results");};
 const enterLab=(film?:Film)=>{if(film){setReference(film.title);setMix({...film.dna});setMode("filmood");}else setMix({...target});setView("lab");};
 const changeReference=(value:string)=>{setReference(value);setMix({...(REFERENCES.find(r=>r.name===value)?.dna||FILMS.find(f=>f.title===value)?.dna||REFERENCES[0].dna)});};
 const toggle=(list:number[],fn:(ids:number[])=>void,id:number)=>fn(list.includes(id)?list.filter(x=>x!==id):[...list,id]);
 const reset=()=>{setMix({...referenceDNA});setRegion("Anywhere");setRuntime("Any length");setDepth(52);};
 const sharedReason=(f:Film)=>{const closer=AXES.map(a=>({key:a.key,name:readable(a.key,f),delta:Math.abs(f.dna[a.key]-target[a.key])})).sort((a,b)=>a.delta-b.delta).slice(0,2).map(a=>a.name).join(" and ");const differences=AXES.map(a=>({name:a.name.toLowerCase(),delta:f.dna[a.key]-target[a.key]})).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));const contrast=differences[0];return "The vibe match: "+closer+". Compared with your mix, "+f.title+" leans "+(contrast.delta>0?"more ":"less ")+contrast.name+". "+f.description;};
 return <main className="studio">
  <header className="studio-nav">
   <a href="/" className="studio-word">FILMOOD<span>.</span></a>
   <nav aria-label="Discovery navigation">
    <button className={view==="start"?"active":""} onClick={()=>setView("start")}>Discover</button>
    <button className={view==="lab"?"active":""} onClick={()=>enterLab()}><FlaskConical size={15}/> Film Lab</button>
    <button onClick={()=>setView("fusion")}>DNA Fusion</button><button onClick={()=>setView("fingerprint")}>My fingerprint</button><button onClick={()=>setProviderOpen(!providerOpen)}>My services</button>
   </nav>
  </header>
  {providerOpen&&<section className="studio-providers">
    <div className="studio-row"><div><strong>Available streaming services</strong><p>Pick your subscriptions. ERTFLIX is free.</p></div><button aria-label="Close services" onClick={()=>setProviderOpen(false)}><X size={18}/></button></div>
    <div className="studio-provider-grid">{PROVIDERS.map(p=><label key={p.id}><input type="checkbox" checked={p.free?true:subscribed.includes(p.id)} disabled={p.free} onChange={()=>setSubscribed(a=>a.includes(p.id)?a.filter(x=>x!==p.id):[...a,p.id])}/>{p.name}{p.free&&<small> Free</small>}</label>)}</div>
    <p className="studio-disclaimer">We save your choices in this browser. Greece-specific catalog coverage and direct-watch links are not integrated yet; these selections do not currently filter the demo recommendations.</p>
   </section>}
  {view==="start"&&<section className="studio-hero">
   <div className="studio-cinema-backdrop" aria-hidden="true"/>
   <p className="studio-eyebrow">FILMOOD ORIGINAL DISCOVERY EXPERIENCE</p>
   <h1>Some feelings deserve<br/><em>another film.</em></h1>
   <p className="studio-lead">A cinematic experience built around what moves you. Pick a direction. The discovery begins on the next screen.</p>
   <p className="studio-feature-label">CHOOSE YOUR WAY IN <span>01 / 03</span></p>
   <div className="studio-mode-grid">
    <button className="studio-mode" onClick={()=>chooseMode("mood")}><Heart size={27}/><strong>MOOD.</strong><span>Start with a feeling. Discover where it takes you.</span><ArrowRight className="studio-mode-arrow" size={22}/></button>
    <button className="studio-mode" onClick={()=>chooseMode("filmood")}><Clapperboard size={27}/><strong>FILMOOD.</strong><span>Start with a film. Follow its emotional aftertaste.</span><ArrowRight className="studio-mode-arrow" size={22}/></button>
   </div>
   <div className="studio-new-features"><button onClick={()=>setView("fusion")}>DNA Fusion · Blend two films <ArrowRight size={16}/></button><button onClick={()=>setView("fingerprint")}>Your cinematic fingerprint <ArrowRight size={16}/></button><button onClick={selectSurprise}>Blind date with a film <ArrowRight size={16}/></button></div>
   <button className="studio-teaser" onClick={()=>enterLab()}><FlaskConical size={20}/><span><strong>The Film Lab.</strong><small>Mix your cinematic DNA. Make something unexpected.</small></span><ArrowRight size={18}/></button>
  </section>}
  {view==="play"&&<section className="studio-play">
    <button className="studio-back-link" onClick={()=>setView("start")}><ArrowLeft size={16}/> Choose another experience</button>
    <p className="studio-eyebrow">{mode==="mood"?"01 / MOOD.":"02 / FILMOOD."} — YOUR CINEMATIC PLAYGROUND</p>
    <h1>{mode==="mood"?"What does tonight feel like?":"A film is never just a film."}</h1>
    <p className="studio-play-intro">{mode==="mood"?"Choose a visual atmosphere or describe what you're craving. No questionnaire.":"Pick a film that stayed with you. Then tell us what you want to feel again — or just discover."}</p>
    <div className="studio-discovery-columns"><div className="studio-discovery-primary">{mode==="mood"?<div className="studio-visual-moods">{MOOD_PRESETS.map((m,i)=><button key={m.label} type="button" aria-pressed={moods.includes(m.label)} className={"studio-visual-mood mood-"+i+(moods.includes(m.label)?" chosen":"")} onClick={()=>chooseMood(m.label)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();launch();}}}><span className="studio-visual-mood-number">0{i+1}</span><strong>{m.label}</strong><span className="studio-mood-check">{moods.includes(m.label)?"✓ IN YOUR MIX":"ADD TO YOUR MIX"} <ArrowRight size={14}/></span></button>)}</div>
    :<div className="studio-filmood-discovery">
      <div className="studio-filmood-top"><div><span>YOUR CINEMATIC STARTING POINT</span><h2>Six films. One feeling.</h2><p>Inspired by <strong>{reference}</strong>. Ordered by DNA match.</p></div><span className="studio-six-count">06 / FILMS</span></div>
      <form className="studio-filmood-search" onSubmit={e=>{e.preventDefault();const found=FILMS.find(f=>f.title.toLowerCase()===filmQuery.trim().toLowerCase())||FILMS.find(f=>f.title.toLowerCase().includes(filmQuery.trim().toLowerCase()));if(found&&filmQuery.trim()){changeReference(found.title);setFilmQuery("");setChatTarget(null);setView("results");}}}><label htmlFor="studio-film-search">SEARCH A FILM · LIVE POSTER RESULTS</label><input id="studio-film-search" value={filmQuery} onChange={e=>setFilmQuery(e.target.value)} placeholder="Type a film title… Press Enter" autoComplete="off"/><p>Search the 23-film demo catalog. Choose a poster or press Enter to discover films inspired by the first matching title.</p></form>
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
  {view==="fusion"&&<section className="studio-feature-screen"><p className="studio-eyebrow">FILMOOD EXPERIMENTS / 01</p><h1>Movie DNA Fusion.</h1><p>Blend the emotional signature of two films. Find something between them.</p><div className="studio-fusion-controls"><label>FIRST FILM<select value={fusionA} onChange={e=>setFusionA(e.target.value)}>{FILMS.map(f=><option key={f.id}>{f.title}</option>)}</select></label><label>SECOND FILM<select value={fusionB} onChange={e=>setFusionB(e.target.value)}>{FILMS.map(f=><option key={f.id}>{f.title}</option>)}</select></label></div><label className="studio-fusion-weight"><span>{fusionA} {fusionWeight}% · {fusionB} {100-fusionWeight}%</span><input type="range" min="0" max="100" value={fusionWeight} onChange={e=>setFusionWeight(Number(e.target.value))}/></label><button className="studio-primary" onClick={()=>{setMix({...fusionDNA});setView("lab");}}>Remix in Film Lab <ArrowRight size={18}/></button><h2>Your fused film matches</h2><div className="studio-feature-matches">{FILMS.filter(f=>f.title!==fusionA&&f.title!==fusionB).map(f=>({f,score:matchPercentage(f,fusionDNA)})).sort((a,b)=>b.score-a.score).slice(0,6).map(({f,score})=><button key={f.id} onClick={()=>setDetails(f)}><strong>{f.title}</strong><span>{score}% DNA match</span><small>{f.description}</small></button>)}</div></section>}
  {view==="fingerprint"&&<section className="studio-feature-screen"><p className="studio-eyebrow">YOUR CINEMATIC IDENTITY</p><h1>Your cinematic fingerprint.</h1><p>Built locally from films you marked Watched or Liked. Nothing is sent to a server.</p>{fingerprint?<><p className="studio-fingerprint-summary">Your strongest signals: {AXES.map(a=>({name:a.name,value:fingerprint[a.key]})).sort((a,b)=>b.value-a.value).slice(0,3).map(a=>a.name.toLowerCase()).join(", ")}.</p><div className="studio-fingerprint-axes">{AXES.map(a=><div key={a.key}><span>{a.name} · {fingerprint[a.key]}%</span><progress value={fingerprint[a.key]} max={100}/></div>)}</div></>:<p className="studio-empty">No fingerprint yet. Open a film, mark it Watched, or tap More like this on a recommendation to start building your profile.</p>}<button className="studio-primary" onClick={()=>setView("start")}>Explore films <ArrowRight size={18}/></button></section>}
  {view==="blind"&&<section className="studio-feature-screen"><p className="studio-eyebrow">NO POSTERS. NO SPOILERS.</p><h1>Blind date with a film.</h1><p>Discover a film without judging its title or popularity first.</p><label className="studio-occasion">HOW ADVENTUROUS?<select value={surpriseLevel} onChange={e=>setSurpriseLevel(e.target.value)}>{["Safe","Unexpected","Wild Card"].map(x=><option key={x}>{x}</option>)}</select></label>{(()=>{const f=FILMS.find(x=>x.id===blindFilm);return f?<div className="studio-blind-card"><span>THE MYSTERY PICK</span><h2>{blindRevealed?f.title:"A film waiting to be discovered."}</h2><p>{blindRevealed?f.description:"Atmosphere: "+(f.dna.dark>60?"Dark and moody":"Warm or balanced")+". Pacing: "+(f.dna.pace>60?"Energetic":"Unhurried")+". Story: "+(f.dna.mind>65?"Thought-provoking":"Accessible")+". "}</p>{blindRevealed?<p>{f.year} · {f.length} min · {f.genres.join(", ")}</p>:<button className="studio-primary" onClick={()=>setBlindRevealed(true)}>Reveal the film <ArrowRight size={18}/></button>}</div>:<p className="studio-empty">No unseen films left in the demo catalog. Restore passed films or try another discovery.</p>;})()}<button className="studio-feature-secondary" onClick={selectSurprise}>Another mystery pick <RotateCcw size={16}/></button></section>}
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
       <div className="studio-summary"><span>{situation!=="Any occasion"?situation+" · ":""}{mode==="mood"?moods.join(" + "):"Inspired by "+reference}</span><button onClick={()=>setView("play")}>Change</button></div>
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
     <div className="studio-surprise-actions"><label>Surprise level <select value={surpriseLevel} onChange={e=>setSurpriseLevel(e.target.value)}>{["Safe","Unexpected","Wild Card"].map(s=><option key={s}>{s}</option>)}</select></label><button onClick={selectSurprise}>Surprise me <Sparkles size={16}/></button><button onClick={()=>setView("fusion")}>Fuse two films <ArrowRight size={16}/></button></div><div className="studio-row"><div><p className="studio-eyebrow">LIVE RESULTS</p><h2>{view==="lab"?"The director’s cut":"Your films for tonight"}</h2></div><span className="studio-live"><i/>LIVE</span></div>
     <p className="studio-muted small">Match percentages are illustrative similarities calculated from eight manually estimated cinematic DNA attributes — not AI confidence, ratings or verified streaming listings.</p>
     {results.length===0?<div className="studio-empty">No matches with these constraints. Try changing the region or runtime, or reset a pass.</div>:results.map((f,i)=><article key={f.id} className="studio-film">
       <button className="studio-poster" onClick={()=>setDetails(f)} aria-label={"Details for "+f.title}><span>{f.title.slice(0,1)}</span>{f.poster&&<img src={"https://image.tmdb.org/t/p/w342/"+f.poster} alt="" loading="lazy"/>}</button>
       <div className="studio-film-body"><div className="studio-match-heading"><span className="studio-rank">{String(i+1).padStart(2,"0")} / CURATED PICK</span><span className="studio-match-score" title="Illustrative similarity based on the eight cinematic DNA attributes"><strong>{matchPercentage(f,target)}%</strong><small>DNA MATCH</small></span></div><h3>{f.title}</h3><p>{f.year} · {f.length} min · {f.region}</p><p className="studio-reason">{sharedReason(f)}</p><div className="studio-film-actions"><button onClick={()=>toggle(saved,setSaved,f.id)} title="Watchlist"><Bookmark size={15} fill={saved.includes(f.id)?"currentColor":"none"}/>{saved.includes(f.id)?"Saved":"Save"}</button><button onClick={()=>toggle(liked,setLiked,f.id)} title="More like this"><Heart size={15} fill={liked.includes(f.id)?"currentColor":"none"}/>{liked.includes(f.id)?"Liked":"More like this"}</button><button onClick={()=>setPassed(a=>a.includes(f.id)?a:[...a,f.id])} title="Not for me"><X size={15}/>Pass</button><button onClick={()=>enterLab(f)} title="Remix this film"><FlaskConical size={15}/>Remix</button></div></div>
      </article>)}
     <div className="studio-verification"><strong>Where to watch in Greece</strong><p>Provider availability is not verified in this prototype. We won't invent Netflix, Cinobo, ERTFLIX or other watch links.</p><button onClick={()=>setProviderOpen(true)}>Manage my streaming services <ArrowRight size={15}/></button></div>
     {passed.length>0&&<button className="studio-undo" onClick={()=>setPassed([])}>Restore passed films ({passed.length})</button>}
    </section>
   </div>
  </section>}
  {details&&<div className="studio-overlay" onClick={()=>setDetails(null)}><section className="studio-modal" role="dialog" aria-modal="true" aria-label={details.title} onClick={e=>e.stopPropagation()}><button className="studio-close" onClick={()=>setDetails(null)}><X size={20}/></button><p className="studio-eyebrow">THE FILM</p><h2>{details.title}</h2><p className="studio-muted">{details.year} · {details.length} min · {details.genres.join(" / ")}</p><p>{details.description}</p><p>{sharedReason(details)}</p><p className="studio-disclaimer">DNA values are exploratory estimates, not licensed third-party measurements.</p><button className="studio-primary" onClick={()=>{enterLab(details);setDetails(null);}}>Remix this film <ArrowRight size={17}/></button><button className="studio-text" onClick={()=>{toggle(watched,setWatched,details.id);setDetails(null);}}>Mark watched / unwatch</button></section></div>}
  <footer className="studio-footer"><span>FILMOOD. · Some feelings deserve another film.</span><span>Prototype · Estimated DNA · Unverified streaming availability</span><a href="/">Back to main site</a></footer>
 </main>;
}
