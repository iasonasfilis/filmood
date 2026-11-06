"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, Clapperboard, FlaskConical, Heart, RotateCcw, SlidersHorizontal, Sparkles, X } from "lucide-react";
import "./studio.css";

type Axis = "dark" | "pace" | "emotion" | "mind" | "visual" | "indie" | "humor" | "action";
type DNA = Record<Axis, number>;
type Film = { id:number; title:string; year:number; length:number; region:"American"|"European"|"Asian"|"World"; genres:string[]; description:string; dna:DNA; poster?:string };
type Mode = "mood" | "filmood";
type View = "start" | "results" | "lab";
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
const readable=(key:Axis,film:Film)=>AXES.find(a=>a.key===key)!.name.toLowerCase();
export default function Studio(){
 const [mode,setMode]=useState<Mode>("mood");
 const [view,setView]=useState<View>("start");
 const [mood,setMood]=useState(MOOD_PRESETS[1].label);
 const [reference,setReference]=useState(defaultReference);
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
 useEffect(()=>{try{const s=localStorage.getItem(STORAGE);if(s){const p=JSON.parse(s);if(Array.isArray(p.saved))setSaved(p.saved);if(Array.isArray(p.watched))setWatched(p.watched);if(Array.isArray(p.passed))setPassed(p.passed);if(Array.isArray(p.liked))setLiked(p.liked);if(Array.isArray(p.subscribed))setSubscribed(p.subscribed);}}catch{}setLoaded(true);},[]);
 useEffect(()=>{if(loaded){try{localStorage.setItem(STORAGE,JSON.stringify({saved,watched,passed,liked,subscribed}));}catch{}}},[saved,watched,passed,liked,subscribed,loaded]);
 const referenceDNA=REFERENCES.find(r=>r.name===reference)?.dna||REFERENCES[0].dna;
 const moodDNA=MOOD_PRESETS.find(m=>m.label===mood)?.target||MOOD_PRESETS[1].target;
 const target=view==="lab"?mix:mode==="filmood"?referenceDNA:moodDNA;
 const results=useMemo(()=>FILMS.filter(f=>!passed.includes(f.id)&&!watched.includes(f.id))
  .filter(f=>mode!=="filmood"||f.title!==reference)
  .filter(f=>region==="Anywhere"||f.region===region)
  .filter(f=>runtime==="Any length"||(runtime==="Under 100 min"?f.length<100:runtime==="100–140 min"?f.length>=100&&f.length<=140:f.length>140))
  .map(f=>({film:f,score:distance(f,target)+(liked.includes(f.id)?-16:0)+((depth-50)/50)*(f.dna.indie-50)*-.35}))
  .sort((a,b)=>a.score-b.score||a.film.id-b.film.id).slice(0,3).map(x=>x.film),
  [mode,reference,region,runtime,depth,passed,watched,liked,target]);
 const launch=()=>{setMix({...mode==="mood"?moodDNA:referenceDNA});setView("results");};
 const enterLab=(film?:Film)=>{if(film){setReference(film.title);setMix({...film.dna});setMode("filmood");}else setMix({...target});setView("lab");};
 const changeReference=(value:string)=>{setReference(value);setMix({...REFERENCES.find(r=>r.name===value)!.dna});};
 const toggle=(list:number[],fn:(ids:number[])=>void,id:number)=>fn(list.includes(id)?list.filter(x=>x!==id):[...list,id]);
 const reset=()=>{setMix({...referenceDNA});setRegion("Anywhere");setRuntime("Any length");setDepth(52);};
 const sharedReason=(f:Film)=>{const closer=AXES.map(a=>({key:a.key,name:readable(a.key,f),delta:Math.abs(f.dna[a.key]-target[a.key])})).sort((a,b)=>a.delta-b.delta).slice(0,2).map(a=>a.name).join(" and ");return "Close to your selected "+closer+" preferences. "+f.description;};
 return <main className="studio">
  <header className="studio-nav">
   <a href="/" className="studio-word">FILMOOD<span>.</span></a>
   <nav aria-label="Discovery navigation">
    <button className={view==="start"?"active":""} onClick={()=>setView("start")}>Discover</button>
    <button className={view==="lab"?"active":""} onClick={()=>enterLab()}><FlaskConical size={15}/> Film Lab</button>
    <button onClick={()=>setProviderOpen(!providerOpen)}>My services</button>
   </nav>
  </header>
  {providerOpen&&<section className="studio-providers">
    <div className="studio-row"><div><strong>Available streaming services</strong><p>Pick your subscriptions. ERTFLIX is free.</p></div><button aria-label="Close services" onClick={()=>setProviderOpen(false)}><X size={18}/></button></div>
    <div className="studio-provider-grid">{PROVIDERS.map(p=><label key={p.id}><input type="checkbox" checked={p.free?true:subscribed.includes(p.id)} disabled={p.free} onChange={()=>setSubscribed(a=>a.includes(p.id)?a.filter(x=>x!==p.id):[...a,p.id])}/>{p.name}{p.free&&<small> Free</small>}</label>)}</div>
    <p className="studio-disclaimer">We save your choices in this browser. Greece-specific catalog coverage and direct-watch links are not integrated yet; these selections do not currently filter the demo recommendations.</p>
   </section>}
  {view==="start"&&<section className="studio-hero">
   <p className="studio-eyebrow">TWO WAYS TO FIND THE FEELING</p>
   <h1>Your next favorite film<br/><em>starts with a feeling.</em></h1>
   <p className="studio-lead">You don't need to know what to watch. Just know how you feel — or remember how another film made you feel.</p>
   <div className="studio-mode-grid">
    <button className={mode==="mood"?"studio-mode selected":"studio-mode"} onClick={()=>setMode("mood")}><Heart size={26}/><strong>MOOD.</strong><span>How do you want to feel?</span></button>
    <button className={mode==="filmood"?"studio-mode selected":"studio-mode"} onClick={()=>setMode("filmood")}><Clapperboard size={26}/><strong>FILMOOD.</strong><span>Remember a film. Find the feeling.</span></button>
   </div>
   {mode==="mood"?<div className="studio-quick"><h2>Tonight, I want something that will...</h2><div className="studio-chips">{MOOD_PRESETS.map(m=><button key={m.label} className={mood===m.label?"chosen":""} onClick={()=>setMood(m.label)}>{m.label}</button>)}</div></div>
    :<div className="studio-quick"><h2>What film or series gave you that feeling?</h2><select aria-label="Reference film" value={reference} onChange={e=>changeReference(e.target.value)}>{REFERENCES.map(r=><option key={r.name}>{r.name}</option>)}</select><p>Not a genre search. We'll explore the tone, atmosphere and emotional aftertaste you remember.</p><div className="studio-chips">{["Atmosphere","Emotional feeling","Storytelling","Visuals","Characters"].map(v=><button key={v} className={keep.includes(v)?"chosen":""} onClick={()=>setKeep(a=>a.includes(v)?a.filter(x=>x!==v):[...a,v])}>{keep.includes(v)?"✓ ":""}{v}</button>)}</div></div>}
   <div className="studio-launch"><button className="studio-primary" onClick={launch}>Find my film <ArrowRight size={18}/></button><span>No account needed · Exploratory prototype</span></div>
   <button className="studio-teaser" onClick={()=>enterLab()}><FlaskConical size={19}/><span><strong>Feeling cinephile today?</strong><small>Mix the DNA of your perfect film in The Film Lab.</small></span><ArrowRight size={17}/></button>
  </section>}
  {view!=="start"&&<section className="studio-workspace">
   <div className="studio-workspace-head"><button onClick={()=>setView("start")}><ArrowLeft size={15}/> Back</button><span>{view==="lab"?"THE FILM LAB.":"YOUR DISCOVERY"}</span><button onClick={()=>enterLab()} disabled={view==="lab"}><SlidersHorizontal size={16}/> Remix</button></div>
   <div className={view==="lab"?"studio-columns lab":"studio-columns"}>
    <section className="studio-controls">
     {view==="lab"?<>
       <p className="studio-eyebrow">FILMOOD. PRESENTS</p><h1>The Film Lab.</h1><p className="studio-muted">Feeling cinephile today? Move a slider. Watch the recommendations change instantly.</p>
       <div className="studio-base"><label htmlFor="base-film">YOUR BASE RECIPE</label><select id="base-film" value={REFERENCES.some(r=>r.name===reference)?reference:defaultReference} onChange={e=>changeReference(e.target.value)}>{REFERENCES.map(r=><option key={r.name}>{r.name}</option>)}</select><button onClick={reset} title="Reset recipe"><RotateCcw size={16}/> Reset</button></div>
       <div className="studio-sliders">{AXES.map(a=><label key={a.key} className="studio-axis"><span><strong>{a.name}</strong><output>{mix[a.key]}/100</output></span><input type="range" min="0" max="100" step="1" value={mix[a.key]} onChange={e=>setMix(x=>({...x,[a.key]:clamp(Number(e.target.value))}))}/><span className="studio-limits"><small>{a.low}</small><small>{a.high}</small></span></label>)}</div>
     </>:<>
       <p className="studio-eyebrow">{mode==="mood"?"MOOD.":"FILMOOD."}</p><h1>We found your kind of films.</h1><p className="studio-muted">{mode==="mood"?"A few picks for the feeling you're after.":"Inspired by "+reference+" and its emotional signature."}</p>
       <div className="studio-summary"><span>{mode==="mood"?mood:"Inspired by "+reference}</span><button onClick={()=>setView("start")}>Change</button></div>
       <button className="studio-lab-invite" onClick={()=>enterLab()}><FlaskConical size={19}/> These are close. Want to experiment? <ArrowRight size={16}/></button>
     </>}
     <div className="studio-more">
      <h3>Explore a little further</h3>
      <div className="studio-fields"><label>Film length<select value={runtime} onChange={e=>setRuntime(e.target.value)}><option>Any length</option><option>Under 100 min</option><option>100–140 min</option><option>Over 140 min</option></select></label>
       <label>Cinema<select value={region} onChange={e=>setRegion(e.target.value)}><option>Anywhere</option><option>American</option><option>European</option><option>Asian</option><option>World</option></select></label></div>
      <label className="studio-axis discovery"><span><strong>Familiar ↔ Hidden gems</strong><output>{depth<34?"Familiar":depth>67?"Deep cuts":"Balanced"}</output></span><input type="range" min="0" max="100" value={depth} onChange={e=>setDepth(Number(e.target.value))}/></label>
     </div>
    </section>
    <section className="studio-results">
     <div className="studio-row"><div><p className="studio-eyebrow">LIVE RESULTS</p><h2>{view==="lab"?"Your live mix":"Your films for tonight"}</h2></div><span className="studio-live"><i/>LIVE</span></div>
     <p className="studio-muted small">Ranked instantly from illustrative attributes. These aren't verified AI predictions or streaming listings.</p>
     {results.length===0?<div className="studio-empty">No matches with these constraints. Try changing the region or runtime, or reset a pass.</div>:results.map((f,i)=><article key={f.id} className="studio-film">
       <button className="studio-poster" onClick={()=>setDetails(f)} aria-label={"Details for "+f.title}><span>{f.title.slice(0,1)}</span>{f.poster&&<img src={"https://image.tmdb.org/t/p/w342/"+f.poster} alt="" loading="lazy"/>}</button>
       <div className="studio-film-body"><span className="studio-rank">{String(i+1).padStart(2,"0")} / CURATED PICK</span><h3>{f.title}</h3><p>{f.year} · {f.length} min · {f.region}</p><p className="studio-reason">{sharedReason(f)}</p><div className="studio-film-actions"><button onClick={()=>toggle(saved,setSaved,f.id)} title="Watchlist"><Bookmark size={15} fill={saved.includes(f.id)?"currentColor":"none"}/>{saved.includes(f.id)?"Saved":"Save"}</button><button onClick={()=>toggle(liked,setLiked,f.id)} title="More like this"><Heart size={15} fill={liked.includes(f.id)?"currentColor":"none"}/>{liked.includes(f.id)?"Liked":"More like this"}</button><button onClick={()=>setPassed(a=>[...new Set([...a,f.id])])} title="Not for me"><X size={15}/>Pass</button><button onClick={()=>enterLab(f)} title="Remix this film"><FlaskConical size={15}/>Remix</button></div></div>
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
