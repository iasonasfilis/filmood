import Link from "next/link";
export default function Page(){return <main style={{minHeight:"100vh",background:"#141119",color:"#f4e9f0",padding:"min(9vw,80px) 24px",fontFamily:"Arial,sans-serif"}}><div style={{maxWidth:760,margin:"auto"}}>
<Link href="/studio" style={{color:"#d7b6cb",textDecoration:"none"}}>← Back to FILMOOD.</Link>
<p style={{marginTop:65,color:"#d4b1c7",letterSpacing:3,fontSize:11}}>FILMOOD / INFORMATION</p>
<h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(40px,6vw,68px)",fontWeight:400}}>About FILMOOD</h1>
<p style={{fontSize:17,lineHeight:1.9,color:"#c6bac6"}}>FILMOOD is an independent experimental film-discovery project. It explores movie recommendations based on mood, storytelling and cinematic attributes. The current catalog is limited, similarity scores are estimates, and film availability in Greece is not yet verified.</p>
<section style={{marginTop:42,padding:"24px 26px",border:"1px solid #a981a64f",borderRadius:12,background:"#ffffff07"}}>
<p style={{fontSize:11,color:"#d4b1c7",letterSpacing:2,fontWeight:700}}>ARTWORK &amp; ATTRIBUTION</p>
<p style={{fontSize:14,lineHeight:1.8,color:"#d7c5d7"}}>Film posters and rotating cinematic backdrops are served from <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" style={{color:"#e8c2e8"}}>TMDB (The Movie Database)</a> for this non-commercial prototype. Artwork belongs to its respective rights holders.</p>
<p style={{fontSize:13,lineHeight:1.7,color:"#e5d3e3"}}>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
<a href="https://www.themoviedb.org/about/logos-attribution" target="_blank" rel="noopener noreferrer" style={{color:"#d8b6d5",fontSize:12}}>TMDB logo and attribution information ↗</a>
</section>
<p style={{marginTop:35,fontSize:12,color:"#948796"}}>Last updated: November 2026 · Prototype information</p>
</div></main>}