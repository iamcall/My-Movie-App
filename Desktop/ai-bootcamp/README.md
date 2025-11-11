## Next Watch Compass

AI-assisted movie picker that learns your tastes, lets you toggle mood & runtime “chips,” and returns personalized matches sourced from the unofficial IMDb API proxy.

### Prerequisites
- Node.js 18+ and npm

### Setup
1. Install client deps (re-run after this update to pull Tailwind, Axios, Zustand, Toast):
   ```bash
   cd client
   npm install
   ```
2. Install server deps:
   ```bash
   cd server
   npm install
   ```
3. Copy the provided env template:
   ```bash
   cp server/.env.example server/.env
   ```
   Optionally tune `PORT`, `IMDB_API_BASE_URL`, or `CACHE_TTL`.
   - **MoviePosterDB posters:** add your `MOVIE_POSTER_DB_KEY` and `MOVIE_POSTER_DB_SECRET` (free tier available in their dashboard). When these values are set, calibration cards and recommendation results will fetch high-quality art from https://api.movieposterdb.com/v1/movie/`<imdbId>`.
4. Expose the API base URL to Vite (create `client/.env` if needed):
   ```
   VITE_API_BASE_URL=http://localhost:3001
   ```

### Development
Run both apps in separate terminals:
```bash
cd server && npm run dev
cd client && npm run dev
```

### What’s Built
- **Client (Vite + React + Tailwind + Zustand):**
  - Hero landing → streaming-service selector → taste calibration carousel (rate/“never seen”).
  - Mood, tone, runtime, and bonus preference chips.
  - Recommendation list with match % badges, streaming availability, details toggle, and a rating modal for continuous learning.
  - Toast notifications + global loading overlay.
- **Server (Express + Axios + NodeCache):**
  - `/api/calibration` picks diverse titles.
  - `/api/search` accepts `{ services, seeds, filters }`, fetches candidate titles, enriches with pseudo streaming availability, and returns candidates.
  - `/api/title/:id` proxies detail lookups.
  - In-memory caching + `.env` configuration.

You now have the full scaffold Claude stalled on—launch the dev servers and open Vite’s URL to start iterating on styles or the recommender logic.
