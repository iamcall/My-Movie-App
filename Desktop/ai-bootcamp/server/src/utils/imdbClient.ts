import axios from 'axios';
import { cache, getCacheKey } from './cache.js';
import { IMDbTitle } from '../types/index.js';

const IMDB_BASE_URL = process.env.IMDB_API_BASE_URL || 'https://imdb.iamidiotareyoutoo.com';

const imdbClient = axios.create({
  baseURL: IMDB_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const searchTitles = async (query: string, type?: string): Promise<IMDbTitle[]> => {
  const cacheKey = getCacheKey('search', `${query}-${type || 'all'}`);
  const cached = cache.get<IMDbTitle[]>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await imdbClient.get('/search', {
      params: { q: query, type }
    });

    const titles = response.data.results || [];
    cache.set(cacheKey, titles);
    return titles;
  } catch (error) {
    console.error('Error searching titles:', error);
    return [];
  }
};

export const getTitleDetails = async (titleId: string): Promise<IMDbTitle | null> => {
  const cacheKey = getCacheKey('title', titleId);
  const cached = cache.get<IMDbTitle>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await imdbClient.get(`/title/${titleId}`);
    const title = response.data;
    cache.set(cacheKey, title);
    return title;
  } catch (error) {
    console.error(`Error fetching title ${titleId}:`, error);
    return null;
  }
};

export const getTopRatedTitles = async (genre?: string, limit: number = 50): Promise<IMDbTitle[]> => {
  const cacheKey = getCacheKey('toprated', genre || 'all');
  const cached = cache.get<IMDbTitle[]>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await imdbClient.get('/chart/top', {
      params: { genre, limit }
    });

    const titles = response.data.results || [];
    cache.set(cacheKey, titles);
    return titles;
  } catch (error) {
    console.error('Error fetching top rated titles:', error);
    return [];
  }
};

export const getTitlesByGenre = async (genre: string, limit: number = 30): Promise<IMDbTitle[]> => {
  const cacheKey = getCacheKey('genre', `${genre}-${limit}`);
  const cached = cache.get<IMDbTitle[]>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    // New API contract requires a 'q' parameter, so search using text queries
    const response = await imdbClient.get('/search', {
      params: {
        q: `${genre} movies`,
        type: 'movie',
        limit
      }
    });

    let titles = response.data.results || [];

    if (titles.length === 0) {
      const fallback = await imdbClient.get('/search', {
        params: {
          q: genre,
          type: 'movie',
          limit
        }
      });
      titles = fallback.data.results || [];
    }

    cache.set(cacheKey, titles);
    return titles;
  } catch (error) {
    console.error(`Error fetching titles for genre ${genre}:`, error);
    return [];
  }
};

// Mock streaming availability (since the unofficial API might not have this)
export const getStreamingAvailability = async (titleId: string, services: string[]): Promise<string[]> => {
  // Temporary behavior: treat every title as available on all selected services.
  cache.set(getCacheKey('streaming', titleId), services);
  return services;
};
