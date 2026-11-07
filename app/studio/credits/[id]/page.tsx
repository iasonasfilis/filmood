import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { findFilmById } from "../../film-data";
import { VERIFIED_CREDITS, type CreditRole } from "../../credits-data";
import "../../studio.css";
import "../../extra-features.css";

const ROLES:CreditRole[]=["Cast","Direction","Writing","Cinematography","Editing","Music","Production"];

export default async function CreditsPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 const film=findFilmById(Number(id));
 if(!film)notFound();
 const credits=VERIFIED_CREDITS[film.id]||[];
 return <main className="studio studio-credits-route">
  <header className="studio-nav"><Link href="/studio" className="studio-word">FILMOOD<span>.</span></Link><span className="studio-eyebrow">THE PEOPLE BEHIND THE FILM</span></header>
  <div className="studio-credits-page">
   <Link className="studio-credits-back" href="/studio"><ArrowLeft size={16}/> Back to FILMOOD</Link>
   <div className="studio-credits-heading">
    <div className="studio-credits-poster">{film.poster?<img src={"https://image.tmdb.org/t/p/w342/"+film.poster} alt={film.title+" poster"}/>:film.title.slice(0,1)}</div>
    <div><span className="studio-eyebrow">CAST &amp; CREW / {film.year}</span><h1>{film.title}</h1><p>{film.genres.join(" / ")} · {film.length} min</p></div>
   </div>
   {credits.length===0&&<div className="studio-credits-empty">
    <h2>The people behind the story.</h2>
    <p>This page is the foundation for verified cast, directors, writers and crew. The current prototype has no connected credits database, so we are not presenting made-up names or filmographies. Each verified person will be linked to their other films in a later phase.</p>
    <a href={"https://www.themoviedb.org/search?query="+encodeURIComponent(film.title+" "+film.year)} target="_blank" rel="noopener noreferrer">Look up this film on TMDB <ArrowUpRight size={15}/></a>
   </div>}
   <div className="studio-credits-role-grid">{ROLES.map(role=><section key={role} className="studio-credits-role"><h3>{role}</h3>{credits.filter(c=>c.role===role).length?credits.filter(c=>c.role===role).map((credit,i)=><a key={credit.personId+"-"+i} href={"https://www.themoviedb.org/search?query="+encodeURIComponent(credit.name)} target="_blank" rel="noopener noreferrer" title={"Explore "+credit.name+" on TMDB"}>{credit.name}{credit.character?" · "+credit.character:""} <ArrowUpRight size={12}/></a>):<p>Awaiting verified credits</p>}</section>)}</div>
   <p className="studio-film-detail-footnote">Credit names and filmographies will be sourced from verified data, not estimated by FILMOOD. This product uses TMDB imagery but is not endorsed or certified by TMDB.</p>
  </div>
 </main>;
}
