# Competitor-informed Discovery Lab (experimental)

## Competitor research, November 2026
- TasteRay: natural-language mood requests and taste-aware discovery; use as benchmark for nuanced intent, not as a data source.
- WatchNext: remembered watched/disliked titles and contextual availability; our preview now excludes watched/disliked films.
- Intertitle: Letterboxd history, taste embeddings and concise ranked recommendations; our preview adds locally stored ratings as an honest first step.

Sources: https://www.tasteray.com/ , https://watchnext.ai/faq , https://intertitle.app/ .

## Implemented
The isolated `/discover` preview uses the existing 23-film editorial catalog. It offers free-text EN/EL keyword interpretation, two-film DNA blends, time and region filters, local ratings, exclusion of watched/disliked titles, explanations and a short ranked lineup. All user data stays in browser localStorage, and a clear-data control is provided. Scores are **heuristic similarities**, not probabilities. No TMDB poster dependency is introduced in this page.

## Not yet implemented
No real multilingual semantic model in this frontend; no Letterboxd import, account sync, large catalog, Greece streaming availability, actual hidden-gem classification or direct backend integration. These require catalog ID harmonization and a secure backend integration contract. The intelligence prototype uses eight *different* axes from the frontend and only 12 films: do not silently mix their scores.

## Verification
Run `npm install && npm run build`. The branch's GitHub Actions workflow performs the build. Do not merge or deploy before build passes and owner approves.
