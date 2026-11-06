"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, Clapperboard,
  Compass, Film, Heart, Menu, Moon, Play, Search, Settings2, Sparkles,
  Sun, ThumbsDown, UserRound, X, CloudRain, Clock3, SlidersHorizontal
} from "lucide-react";

type Movie = {
  id: number; title: string; year: number; runtime: string; genres: string[];
  rating: string; image: string; backdrop: string; synopsis: string;
  match: number; reason: string; mood: string;
};

const movies: Movie[] = [
  {
    id: 1, title: "The Grand Budapest Hotel", year: 2014, runtime: "1h 39m",
    genres: ["Comedy", "Drama", "Adventure"], rating: "8.1",
    image: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHw5Q3x8l9a2.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/nX5XotM9yprCKarRH4fzOq1VM1J.jpg",
    synopsis: "A legendary concierge and his young protégé become embroiled in the theft of a priceless Renaissance painting and the battle for an enormous family fortune.",
    match: 96, reason: "Its bittersweet charm and meticulous world-building fit your appetite for clever, emotionally resonant storytelling.", mood: "Lighthearted"
  },
  {
    id: 2, title: "Arrival", year: 2016, runtime: "1h 56m",
    genres: ["Sci-Fi", "Drama", "Mystery"], rating: "7.9",
    image: "https://image.tmdb.org/t/p/w500/4Iu5f2nv7huqvuYkmZvSPOtbFjs.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/yZ5j5l7z9eZ9w0x7x6j9.jpg",
    synopsis: "A linguist is recruited by the military to communicate with mysterious spacecraft that have landed around the world.",
    match: 94, reason: "A thoughtful, quietly intense sci-fi story that rewards curiosity and leaves an emotional afterimage.", mood: "Mind-bending"
  },
  {
    id: 3, title: "Her", year: 2013, runtime: "2h 6m",
    genres: ["Romance", "Sci-Fi", "Drama"], rating: "8.0",
    image: "https://image.tmdb.org/t/p/w500/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/7XLSwxpfpPoJyTdJVot6a4jGf4g.jpg",
    synopsis: "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.",
    match: 92, reason: "Intimate, melancholic and quietly philosophical — a strong match for a reflective night.", mood: "Melancholic"
  },
  {
    id: 4, title: "Nightcrawler", year: 2014, runtime: "1h 57m",
    genres: ["Thriller", "Crime", "Drama"], rating: "7.8",
    image: "https://image.tmdb.org/t/p/w500/8oPY6ULFOTbAEskySNhgsUIN4fW.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/9t6lQZcQ2J0.jpg",
    synopsis: "A driven freelance crime journalist dives into the nocturnal world of Los Angeles crime journalism.",
    match: 90, reason: "A tense character study with a dark pulse and an unsettling look at ambition.", mood: "Dark & Intense"
  },
  {
    id: 5, title: "About Time", year: 2013, runtime: "2h 3m",
    genres: ["Romance", "Comedy", "Drama"], rating: "7.8",
    image: "https://image.tmdb.org/t/p/w500/iR1bVfURbN7r1C46WHFbwCkVve.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/9zZl6W3e0z.jpg",
    synopsis: "A young man discovers he can travel through time and uses his ability to improve his life and find love.",
    match: 88, reason: "Warm, funny and deeply human — ideal when you want a lift without switching your brain off.", mood: "Lighthearted"
  }
];

const moods = [
  { name: "Melancholic", sub: "Something that stays with you", image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900&q=85", tone: "mood-purple" },
  { name: "Mind-bending", sub: "Make me think. Then think again.", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=85", tone: "mood-blue" },
  { name: "Lighthearted", sub: "A little escape, a little joy", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=85", tone: "mood-amber" },
  { name: "Dark & Intense", sub: "Give me the edge of my seat", image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900&q=85", tone: "mood-red" },
  { name: "Romantic", sub: "Feel something real", image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900&q=85", tone: "mood-rose" },
  { name: "Adventurous", sub: "Take me somewhere else", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85", tone: "mood-green" }
];

type Page = "home" | "discover" | "results" | "watchlist" | "profile";

export default function Home() {
  const [page, setPage] = useState<Page>("home");
  const [moodIndex, setMoodIndex] = useState(0);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [saved, setSaved] = useState<number[]>([3]);
  const [liked, setLiked] = useState<number[]>([]);
  const [disliked, setDisliked] = useState<number[]>([]);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [energy, setEnergy] = useState("Balanced");
  const [complexity, setComplexity] = useState("A little depth");
  const [duration, setDuration] = useState("Any length");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const filteredMovies = useMemo(() => {
    const pool = selectedMoods.length
      ? movies.filter(m => selectedMoods.includes(m.mood) || selectedMoods.includes("Any mood"))
      : movies;
    return pool.length ? pool : movies;
  }, [selectedMoods]);

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => prev.includes(mood) ? prev.filter(x => x !== mood) : [...prev, mood]);
  };
  const nextMood = (direction: number) => {
    setMoodIndex(i => (i + direction + moods.length) % moods.length);
  };
  const saveMovie = (id: number) => setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const goDiscover = () => { setPage("discover"); setMoodIndex(0); };
  const goResults = () => setPage("results");

  const Nav = () => (
    <header className="topbar">
      <button className="wordmark" onClick={() => setPage("home")} aria-label="FILMOOD home">FILMOOD<span>.</span></button>
      <nav className="desktop-nav">
        <button className={page === "discover" ? "nav-link active" : "nav-link"} onClick={goDiscover}>Discover</button>
        <button className={page === "watchlist" ? "nav-link active" : "nav-link"} onClick={() => setPage("watchlist")}>Watchlist <span className="nav-count">{saved.length}</span></button>
        <button className={page === "profile" ? "nav-link active" : "nav-link"} onClick={() => setPage("profile")}>My taste</button>
      </nav>
      <div className="top-actions">
        <button className="icon-button" aria-label="Search" onClick={() => setPage("results")}><Search size={17}/></button>
        <button className="avatar" onClick={() => setPage("profile")}>G</button>
        <button className="mobile-menu icon-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Open menu"><Menu size={19}/></button>
      </div>
      {mobileMenu && <div className="mobile-dropdown">
        <button onClick={goDiscover}>Discover</button><button onClick={() => setPage("watchlist")}>Watchlist</button><button onClick={() => setPage("profile")}>My taste</button>
      </div>}
    </header>
  );

  const MovieCard = ({ movie, index }: { movie: Movie; index: number }) => (
    <article className="movie-card" style={{ animationDelay: `${index * 80}ms` }}>
      <button className="poster-button" onClick={() => setActiveMovie(movie)}>
        <img src={movie.image} alt={`${movie.title} poster`} className="poster" onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.25"; }}/>
        <span className="poster-overlay"><span className="play-circle"><Play size={17} fill="currentColor"/></span></span>
        <span className="match-pill"><Sparkles size={12}/>{movie.match}% match</span>
      </button>
      <div className="movie-meta">
        <div className="movie-title-line"><h3>{movie.title}</h3><button className={saved.includes(movie.id) ? "save-button saved" : "save-button"} onClick={() => saveMovie(movie.id)} aria-label="Save movie"><Bookmark size={16} fill={saved.includes(movie.id) ? "currentColor" : "none"}/></button></div>
        <p>{movie.year} <span>·</span> {movie.runtime} <span>·</span> ★ {movie.rating}</p>
        <div className="genre-row">{movie.genres.slice(0,2).map(g => <span key={g}>{g}</span>)}</div>
      </div>
    </article>
  );

  return (
    <main className="app-shell">
      <Nav />
      {page === "home" && <>
        <section className="hero">
          <div className="hero-backdrop"></div>
          <div className="hero-content">
            <div className="eyebrow"><span className="eyebrow-line"></span> THE ART OF FINDING YOUR FILM</div>
            <h1>Tonight deserves<br/><em>a better</em> movie.</h1>
            <p className="hero-copy">Not just what's popular. What feels right.<br className="desktop-break"/> Discover films that meet you where you are.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={goDiscover}>Find my Filmood <ArrowRight size={17}/></button>
              <button className="text-button" onClick={() => setShowOnboarding(true)}>How it works <span>↗</span></button>
            </div>
            <div className="hero-foot"><span><span className="live-dot"></span> A more personal kind of movie night</span><span className="hero-foot-right">MOOD · TASTE · MOMENT</span></div>
          </div>
          <div className="hero-art">
            <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
            <div className="hero-poster hero-poster-back"><img src="https://image.tmdb.org/t/p/w500/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg" alt="Film still"/></div>
            <div className="hero-poster hero-poster-front"><img src="https://image.tmdb.org/t/p/w500/8oPY6ULFOTbAEskySNhgsUIN4fW.jpg" alt="Film still"/></div>
            <div className="floating-note"><Sparkles size={14}/><span>Picked for your mood</span></div>
          </div>
        </section>
        <section className="below-hero">
          <div className="section-heading"><div><span className="eyebrow">A DIFFERENT WAY TO DISCOVER</span><h2>Less scrolling.<br/><em>More feeling.</em></h2></div><p>Because the right film isn't always the highest-rated one. It's the one that meets the moment.</p></div>
          <div className="feature-grid">
            <div className="feature"><div className="feature-icon"><Moon size={19}/></div><span>01 / MOOD FIRST</span><h3>Start with how<br/>you feel.</h3><p>Choose the energy you're looking for. We'll take it from there.</p></div>
            <div className="feature"><div className="feature-icon"><Heart size={19}/></div><span>02 / YOUR TASTE</span><h3>It gets to know<br/>your kind of cinema.</h3><p>Your favorites and feedback shape a profile that feels like you.</p></div>
            <div className="feature"><div className="feature-icon"><Sparkles size={19}/></div><span>03 / THE RIGHT MOMENT</span><h3>A little context.<br/>A better match.</h3><p>Your mood, preferences and the moment come together.</p></div>
          </div>
        </section>
      </>}

      {page === "discover" && <section className="page-section discover-page">
        <div className="page-kicker">YOUR MOMENT · 01 / 03</div>
        <div className="discover-heading"><h1>What's your<br/><em>mood tonight?</em></h1><p>Swipe through the feeling you're after.<br/>There are no wrong answers.</p></div>
        <div className="swipe-layout">
          <div className="swipe-card-wrap">
            <div
              className="swipe-card"
              key={moodIndex}
              style={{ backgroundImage: `linear-gradient(180deg,rgba(10,10,13,.05),rgba(10,10,13,.9)),url(${moods[moodIndex].image})`, touchAction: "pan-y" }}
              onPointerDown={(e) => setDragStartX(e.clientX)}
              onPointerUp={(e) => {
                if (dragStartX !== null) {
                  const delta = e.clientX - dragStartX;
                  if (delta > 65) { toggleMood(moods[moodIndex].name); nextMood(1); }
                  else if (delta < -65) { nextMood(1); }
                }
                setDragStartX(null);
              }}
              onPointerCancel={() => setDragStartX(null)}
            >
              <div className="swipe-top"><span>MOOD {String(moodIndex + 1).padStart(2,"0")} / 06</span><span>SWIPE TO EXPLORE</span></div>
              <div className="swipe-bottom"><span className="mood-overline">I'M IN THE MOOD FOR</span><h2>{moods[moodIndex].name}</h2><p>{moods[moodIndex].sub}</p></div>
            </div>
            <div className="swipe-controls">
              <button className="swipe-control skip" onClick={() => nextMood(1)} aria-label="Skip mood"><X size={21}/></button>
              <button className="swipe-control select" onClick={() => { toggleMood(moods[moodIndex].name); nextMood(1); }} aria-label="Select mood"><Heart size={21}/></button>
              <button className="swipe-control next" onClick={() => nextMood(1)} aria-label="Next mood"><ArrowRight size={20}/></button>
            </div>
            <div className="swipe-hint">Tap <b>♥</b> to add a mood · <b>×</b> to pass</div>
          </div>
          <aside className="mood-side">
            <div className="side-label">YOUR SELECTED MOODS <span>{selectedMoods.length}</span></div>
            {selectedMoods.length ? <div className="selected-list">{selectedMoods.map(m => <button key={m} onClick={() => toggleMood(m)}>{m}<X size={13}/></button>)}</div> : <p className="empty-note">Your mood mix will appear here. Pick one or more.</p>}
            <div className="side-divider"></div>
            <div className="side-label">FINE-TUNE YOUR NIGHT</div>
            <label className="field-label">Energy</label><div className="choice-row">{["Low-key","Balanced","High energy"].map(x => <button key={x} className={energy === x ? "choice active" : "choice"} onClick={() => setEnergy(x)}>{x}</button>)}</div>
            <label className="field-label">How much depth?</label><div className="choice-row">{["Easy watch","A little depth","Challenge me"].map(x => <button key={x} className={complexity === x ? "choice active" : "choice"} onClick={() => setComplexity(x)}>{x}</button>)}</div>
            <label className="field-label">Runtime</label><div className="choice-row">{["Under 90m","Any length","2h+"].map(x => <button key={x} className={duration === x ? "choice active" : "choice"} onClick={() => setDuration(x)}>{x}</button>)}</div>
            <button className="primary-button full-button" onClick={goResults}>Find my films <ArrowRight size={16}/></button>
            <p className="privacy-note"><span>✦</span> Your mood is yours. Nothing is shared.</p>
          </aside>
        </div>
      </section>}

      {page === "results" && <section className="page-section results-page">
        <div className="results-top"><div><div className="page-kicker">YOUR FILMOOD · TONIGHT</div><h1>A night for<br/><em>{selectedMoods[0] || "something memorable"}.</em></h1><p className="results-sub">A few films that feel right for this moment.</p></div><button className="outline-button" onClick={goDiscover}><SlidersHorizontal size={15}/> Adjust mood</button></div>
        <div className="context-strip"><span><CloudRain size={15}/> A little atmosphere goes a long way</span><span><Clock3 size={15}/> Your evening, your pace</span><span><Sparkles size={15}/> Personalised selection</span></div>
        <div className="recommendation-grid">{filteredMovies.map((m,i) => <MovieCard movie={m} index={i} key={m.id}/>)}</div>
        <div className="results-bottom"><span>NOT QUITE THE RIGHT FEELING?</span><button className="text-button" onClick={goDiscover}>Fine-tune your mood <ArrowRight size={15}/></button></div>
      </section>}

      {page === "watchlist" && <section className="page-section">
        <div className="page-kicker">YOUR PERSONAL COLLECTION</div><h1>Your <em>watchlist.</em></h1><p className="results-sub">The films you want to come back to.</p>
        {saved.length ? <div className="recommendation-grid">{movies.filter(m => saved.includes(m.id)).map((m,i)=><MovieCard movie={m} index={i} key={m.id}/>)}</div> : <div className="empty-state"><Bookmark size={28}/><h2>Nothing saved. Yet.</h2><p>When a film catches your eye, save it here.</p><button className="primary-button" onClick={goDiscover}>Discover films <ArrowRight size={16}/></button></div>}
      </section>}

      {page === "profile" && <section className="page-section profile-page">
        <div className="page-kicker">YOUR CINEMATIC DNA</div><h1>Your taste,<br/><em>your story.</em></h1>
        <div className="profile-card"><div className="profile-avatar">G</div><div><h2>Guest cinephile</h2><p>Your taste profile is just getting started.</p></div><button className="outline-button" onClick={() => setShowOnboarding(true)}>Build profile <ArrowRight size={15}/></button></div>
        <div className="profile-columns"><div className="profile-panel"><span className="side-label">YOUR MOOD HISTORY</span>{selectedMoods.length ? selectedMoods.map(m=><div className="history-row" key={m}>{m}<span>Selected</span></div>) : <p className="empty-note">Your selected moods will show up here.</p>}</div><div className="profile-panel"><span className="side-label">YOUR FILM ACTIVITY</span><div className="history-row">Saved films <span>{saved.length}</span></div><div className="history-row">Liked films <span>{liked.length}</span></div><div className="history-row">Passed films <span>{disliked.length}</span></div></div></div>
      </section>}

      <footer className="footer"><span className="footer-logo">FILMOOD<span>.</span></span><span>Find your mood. Find your movie.</span><span>© 2026 FILMOOD</span></footer>

      {activeMovie && <div className="modal-backdrop" onClick={() => setActiveMovie(null)}><div className="movie-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setActiveMovie(null)}><X size={19}/></button>
        <div className="modal-image" style={{backgroundImage:`linear-gradient(0deg,#111 0%,transparent 85%),url(${activeMovie.backdrop})`}}></div>
        <div className="modal-content"><div className="page-kicker">A FILMOOD MATCH · {activeMovie.match}%</div><h2>{activeMovie.title}</h2><p className="modal-facts">{activeMovie.year} · {activeMovie.runtime} · ★ {activeMovie.rating}</p><div className="genre-row">{activeMovie.genres.map(g=><span key={g}>{g}</span>)}</div><p className="modal-synopsis">{activeMovie.synopsis}</p><div className="why-box"><Sparkles size={16}/><div><b>Why this film?</b><p>{activeMovie.reason}</p></div></div><div className="modal-actions"><button className="primary-button" onClick={() => saveMovie(activeMovie.id)}>{saved.includes(activeMovie.id) ? <Check size={16}/> : <Bookmark size={16}/>} {saved.includes(activeMovie.id) ? "Saved to watchlist" : "Add to watchlist"}</button><button className="outline-button" onClick={() => setActiveMovie(null)}>Back to films</button></div></div>
      </div></div>}

      {showOnboarding && <div className="modal-backdrop" onClick={() => setShowOnboarding(false)}><div className="onboarding-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setShowOnboarding(false)}><X size={19}/></button><div className="feature-icon"><Sparkles size={20}/></div><div className="page-kicker">A MORE PERSONAL MOVIE NIGHT</div><h2>Three things make<br/><em>the right film.</em></h2><div className="how-row"><Moon/><div><b>Your mood</b><p>Tell us what kind of feeling you're looking for right now.</p></div></div><div className="how-row"><Heart/><div><b>Your taste</b><p>We'll learn from the films you love, save and skip.</p></div></div><div className="how-row"><Sparkles/><div><b>Your moment</b><p>Time and context help us find the right fit.</p></div></div><button className="primary-button full-button" onClick={() => {setShowOnboarding(false);goDiscover();}}>Let's find your film <ArrowRight size={16}/></button></div></div>}
    </main>
  );
}
