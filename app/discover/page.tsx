"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {FILMS,type Film,type Axis} from "../studio/film-data";
import "./discover.css";

type Taste = Record<number,number>;
type Stored={ratings:Taste;watched:number[];disliked:number[]};
const KEY="filmood-discovery-v1";
const AXES:Axis[]=["dark","pace","emotion","mind","visual","indie","humor","action"];
const LABELS:Record<Axis,string>={dark:"Atmosphere",pace:"Pacing",emotion:"Emotional impact",mind:"Complexity",visual:"Visual style",indie:"Arthouse",humor:"Humor",action:"Intensity"};
const HINTS:Record<Axis,string[]>={dark:["dark","creepy","sinister","σκοτειν","τρομακ"],pace:["fast","slow","ρυθμ","γρηγορ"],emotion:["sad","cry","emotional","μελαγχολ","συγκιν"],mind:["complex","twist","mystery","μυστηρ","ανατροπ"],visual:["beautiful","visual","cinematography","φωτογραφ","εικον"],indie:["indie","arthouse","independent","σινεφιλ"],humor:["funny","comedy","laugh","κωμωδ","αστει"],action:["intense","tense","action","αγωνι","εντασ"]};
const DEFAULT:Stored={ratings:{},watched:[],disliked:[]};
const clamp=(n:number)=>Math.max(0,Math.min(100,n));
const similarity=(a:Record<Axis,number>,b:Record<Axis,number>)=>1-AXES.reduce((sum,k)=>sum+Math.abs(a[k]-b[k]),0)/(AXES.length*100);
const empty=()=>Object.fromEntries(AXES.map(a=>[a,50])) as Record<Axis,number>;
const hasIntent=(query:string)=>AXES.some(axis=>HINTS[axis].some(term=>query.toLowerCase().includes(term)));
const queryDNA=(query:string)=>{const target=empty();const q=query.toLowerCase();for(const axis of AXES){if(HINTS[axis].some(t=>q.includes(t)))target[axis]=90;}if(/less dark|not dark|λιγοτερο σκοτειν/.test(q))target.dark=15;if(/slow|αργο/.test(q))target.pace=15;if(/less sad|not sad|χωρις θλιψ/.test(q))target.emotion=25;return target;};


export default function Discover(){
 const [query,setQuery]=useState("");
 const [reference,setReference]=useState("");
 const [second,setSecond]=useState("");
 const [mix,setMix]=useState(50);
 const [runtime,setRuntime]=useState(0);
 const [region,setRegion]=useState("Any");
 const [hiddenGems,setHiddenGems]=useState(false);
 const [taste,setTaste]=useState<Stored>(DEFAULT);
 const [ready,setReady]=useState(false);
 const [showHistory,setShowHistory]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw){const parsed=JSON.parse(raw);if(parsed&&typeof parsed==="object")setTaste({ratings:parsed.ratings||{},watched:Array.isArray(parsed.watched)?parsed.watched:[],disliked:Array.isArray(parsed.disliked)?parsed.disliked:[]});}}catch{}setReady(true);},[]);
 useEffect(()=>{if(ready)localStorage.setItem(KEY,JSON.stringify(taste));},[taste,ready]);
 const referenceFilm=FILMS.find(f=>String(f.id)===reference);
 const secondFilm=FILMS.find(f=>String(f.id)===second);
 const target=useMemo(()=>{const t=query&&hasIntent(query)?queryDNA(query):referenceFilm?{...referenceFilm.dna}:empty();if(referenceFilm&&secondFilm){for(const axis of AXES)t[axis]=referenceFilm.dna[axis]*(1-mix/100)+secondFilm.dna[axis]*mix/100;}if(query&&hasIntent(query)){const q=queryDNA(query);for(const axis of AXES)if(q[axis]!==50)t[axis]=q[axis];}return t;},[query,referenceFilm,secondFilm,mix]);
 const matches=useMemo(()=>{
  const rated=FILMS.filter(f=>taste.ratings[f.id]!==undefined);
  const profile=empty();
  const weights=rated.map(f=>(taste.ratings[f.id]-2.5)/2.5);
  const denom=weights.reduce((s,w)=>s+Math.abs(w),0);
  if(denom)for(const axis of AXES)profile[axis]=clamp(50+weights.reduce((s,w,i)=>s+w*(rated[i].dna[axis]-50),0)/denom);
  const personalized=denom>0;
  const contextual=Boolean(referenceFilm||secondFilm||(query&&hasIntent(query)));
  const list=FILMS.filter(f=>!taste.watched.includes(f.id)&&!taste.disliked.includes(f.id)&&f.id!==referenceFilm?.id&&f.id!==secondFilm?.id&&(runtime===0||f.length<=runtime)&&(region==="Any"||f.region===region));
  return list.map(f=>{
   const context=similarity(f.dna,target);
   const personal=personalized?similarity(f.dna,profile):null;
   const score=contextual?(personal===null?context:.7*context+.3*personal):(personal??.5);
   const matched=AXES.slice().sort((a,b)=>Math.abs(f.dna[a]-target[a])-Math.abs(f.dna[b]-target[b])).slice(0,3);
   return {film:f,score,matched,personal};
  }).sort((a,b)=>b.score-a.score||a.film.id-b.film.id).slice(0,hiddenGems?8:6);
 },[taste,target,referenceFilm,secondFilm,runtime,region,hiddenGems,query]);
 const setRating=(id:number,rating:number)=>setTaste(prev=>({...prev,ratings:{...prev.ratings,[id]:rating}}));
 const toggle=(key:"watched"|"disliked",id:number)=>setTaste(prev=>({...prev,[key]:prev[key].includes(id)?prev[key].filter(v=>v!==id):[...prev[key],id]}));
 return <main className="discover">
  <header className="discover-header"><Link href="/studio" className="discover-brand">FILMOOD<span>.</span></Link><span>DISCOVERY LAB / EXPERIMENTAL</span><Link href="/studio">Back to Studio ↗</Link></header>
  <section className="discover-hero"><p className="discover-eyebrow">YOUR CINEMATIC INTELLIGENCE</p><h1>Not just what to watch.<br/><em>Why it feels right.</em></h1><p>Describe a feeling, blend films, and shape your taste. This experimental preview uses a curated 23-film catalog — no fabricated AI or streaming claims.</p></section>
  <div className="discover-columns">
   <section className="discover-panel" aria-label="Discovery controls">
    <h2>01 / Tell us the feeling</h2><label htmlFor="discovery-query">Mood or cinematic direction</label><textarea id="discovery-query" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Something melancholic and visually beautiful, but not too dark…" rows={3}/><p className="discover-hint">English / Greek keyword interpretation is experimental. Unrecognized descriptions do not imply semantic understanding.</p>
    <h2>02 / Cinephile recipe</h2><label htmlFor="reference-film">Start with a film</label><select id="reference-film" value={reference} onChange={e=>setReference(e.target.value)}><option value="">No reference</option>{FILMS.map(f=><option value={f.id} key={f.id}>{f.title} ({f.year})</option>)}</select>
    <label htmlFor="second-film">Blend with another film</label><select id="second-film" value={second} onChange={e=>setSecond(e.target.value)} disabled={!reference}><option value="">No second film</option>{FILMS.filter(f=>String(f.id)!==reference).map(f=><option value={f.id} key={f.id}>{f.title}</option>)}</select>
    {reference&&second&&<label className="discover-slider">Blend: {mix}% toward {secondFilm?.title}<input type="range" min="0" max="100" value={mix} onChange={e=>setMix(Number(e.target.value))}/></label>}
    <h2>03 / Tonight&apos;s context</h2><div className="discover-two"><div><label htmlFor="runtime">Time available</label><select id="runtime" value={runtime} onChange={e=>setRuntime(Number(e.target.value))}><option value="0">Any length</option><option value="90">Under 90 min</option><option value="110">Under 110 min</option><option value="130">Under 130 min</option></select></div><div><label htmlFor="region">Cinema region</label><select id="region" value={region} onChange={e=>setRegion(e.target.value)}><option>Any</option><option>American</option><option>European</option><option>Asian</option><option>World</option></select></div></div>
    <label className="discover-check"><input type="checkbox" checked={hiddenGems} onChange={e=>setHiddenGems(e.target.checked)}/> Show 8 discoveries instead of 6</label>
    <h2>04 / Your taste</h2><p className="discover-hint">Rate films you know. Your ratings stay in this browser; watched and disliked titles are excluded.</p><button className="discover-secondary" onClick={()=>setShowHistory(v=>!v)}>{showHistory?"Hide":"Edit"} taste profile ({Object.keys(taste.ratings).length} rated)</button>
    {showHistory&&<div className="discover-history">{FILMS.map(f=><div className="discover-history-row" key={f.id}><span>{f.title}</span><select aria-label={`Rate ${f.title}`} value={taste.ratings[f.id]??""} onChange={e=>{const value=e.target.value;if(value)setRating(f.id,Number(value));else setTaste(p=>{const ratings={...p.ratings};delete ratings[f.id];return {...p,ratings};});}}><option value="">Unrated</option>{[0,1,2,3,4,5].map(n=><option value={n} key={n}>{n}/5</option>)}</select></div>)}</div>}
    <button className="discover-clear" onClick={()=>{if(window.confirm("Delete all saved ratings and watched/disliked markers from this browser?"))setTaste(DEFAULT);}}>Clear local taste data</button>
   </section>
   <section className="discover-results" aria-label="Recommendations">
    <div className="discover-results-head"><div><p className="discover-eyebrow">CURATED DISCOVERY / PREVIEW</p><h2>Your lineup</h2></div><span>{matches.length} films</span></div>
    {!matches.length&&<div className="discover-empty">No films match these filters in the current 23-film catalog. Try a longer runtime or a different region.</div>}
    <div className="discover-grid">{matches.map(({film,score,matched,personal},i)=><article className="discover-card" key={film.id}>
      <div className="discover-poster"><div className="discover-poster-placeholder">{film.title}</div><span className="discover-rank">{String(i+1).padStart(2,"0")}</span></div>
      <div className="discover-card-copy"><p className="discover-meta">{film.year} · {film.length} MIN · {film.region}</p><h3>{film.title}</h3><p>{film.description}</p><p className="discover-why"><strong>Why this film:</strong> Closest DNA: {matched.map(a=>LABELS[a]).join(", ")}.</p><div className="discover-card-foot"><span>{Math.round(score*100)} <small>/ 100 similarity</small></span>{personal!==null&&<span className="discover-personal">Taste-aware</span>}</div><div className="discover-actions"><button onClick={()=>toggle("watched",film.id)}>{taste.watched.includes(film.id)?"Undo watched":"Watched"}</button><button onClick={()=>toggle("disliked",film.id)}>Not for me</button><button onClick={()=>setRating(film.id,5)}>Loved it ★</button></div></div>
     </article>)}</div>
    <p className="discover-disclaimer">Scores are heuristic similarities, not probabilities of enjoyment. No real-time Greek streaming availability is claimed. This preview deliberately avoids third-party poster dependencies.</p>
   </section>
  </div>
 </main>;

}
