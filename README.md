# FILMOOD. — Frontend prototype

A polished, responsive Next.js frontend prototype for the FILMOOD movie discovery product.

## Included
- Cinematic landing page
- Mood discovery flow with selectable mood cards and drag/swipe gestures
- Energy, complexity and runtime preferences
- Demo recommendation results
- Movie detail modal with a "Why this film?" explanation
- Watchlist interactions
- Guest taste profile
- Responsive desktop and mobile layouts

## Requirements
- Node.js 18.17+ (Node 20 LTS recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Production build
```bash
npm run build
npm start
```

## Important implementation notes
This is the **frontend prototype**, not the production backend.
- Movie data and match percentages are illustrative demo data.
- The recommendation ranking is not yet connected to a real AI model.
- Movie poster/backdrop assets use remote image URLs. For production, use licensed TMDB assets and configure Next/Image remote patterns if switching to `next/image`.
- Weather, geolocation, authentication, persistent storage, TMDB API and Supabase are not connected yet.
- No external streaming account integrations are implemented.

## Next development milestone
1. Replace demo movie data with TMDB API data through a server-side route.
2. Add Supabase authentication and persistence.
3. Implement a deterministic recommendation scoring service.
4. Add OpenAI mood interpretation and explanation layer.
5. Add weather context using a privacy-preserving location flow.
6. Add tests, accessibility pass, analytics and production deployment.

## Brand direction
- Wordmark: FILMOOD.
- Interface language: English
- Visual direction: cinematic, dark, editorial, premium
