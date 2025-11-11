import axios from 'axios';
import { cache, getCacheKey } from './cache.js';

const POSTER_BASE_URL = 'https://api.movieposterdb.com/v1/movie';
const POSTER_KEY = process.env.MOVIE_POSTER_DB_KEY;
const POSTER_SECRET = process.env.MOVIE_POSTER_DB_SECRET;

const POSTER_CACHE_TTL = 60 * 60 * 24; // 24 hours

const isPosterApiConfigured = () => Boolean(POSTER_KEY && POSTER_SECRET);

export const fetchPosterForTitle = async (imdbId: string): Promise<string | null> => {
  if (!imdbId || !isPosterApiConfigured()) {
    return null;
  }

  const cacheKey = getCacheKey('poster', imdbId);
  const cachedPoster = cache.get<string>(cacheKey);
  if (cachedPoster) {
    return cachedPoster;
  }

  try {
    const response = await axios.get(`${POSTER_BASE_URL}/${imdbId}`, {
      params: {
        api_key: POSTER_KEY,
        api_secret: POSTER_SECRET,
      },
      timeout: 10000,
    });

    const data = response.data;
    const posters = data?.posters || data?.data?.posters || [];
    const bestPoster = posters.find((poster: any) => poster?.width >= 500) || posters[0];
    const url = bestPoster?.link || bestPoster?.url || data?.poster || data?.data?.poster;

    if (url) {
      cache.set(cacheKey, url, POSTER_CACHE_TTL);
      return url;
    }
  } catch (error) {
    console.error(`Failed to fetch poster for ${imdbId}`, error);
  }

  return null;
};
