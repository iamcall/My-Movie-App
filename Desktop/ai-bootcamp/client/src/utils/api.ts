import axios from 'axios';
import type { Movie, Filters } from '../types';
import { SAMPLE_CALIBRATION_MOVIES } from '../data/sampleCalibration';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const pickRandom = (list: Movie[], count: number) => {
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const fallbackRecommendations = (count = 20) => pickRandom(SAMPLE_CALIBRATION_MOVIES, count);

export const fetchCalibrationMovies = async (count: number = 9): Promise<Movie[]> => {
  try {
    const response = await apiClient.get('/calibration', { params: { count } });
    const results: Movie[] = response.data.results || [];
    if (results.length >= count) {
      return pickRandom(results, count);
    }
    // If API returns too few, blend with fallback samples
    return pickRandom([...results, ...SAMPLE_CALIBRATION_MOVIES], count);
  } catch (error) {
    console.warn('Falling back to sample calibration movies:', error);
    return pickRandom(SAMPLE_CALIBRATION_MOVIES, count);
  }
};

export const searchMovies = async (
  services: string[],
  seeds: string[],
  filters: Filters
): Promise<Movie[]> => {
  try {
    const response = await apiClient.post('/search', {
      services,
      seeds,
      filters,
    });
    const results: Movie[] = response.data.results || [];
    if (results.length === 0) {
      return fallbackRecommendations();
    }
    return results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return fallbackRecommendations();
  }
};

export const fetchTitleDetails = async (
  titleId: string,
  services: string[]
): Promise<Movie> => {
  try {
    const response = await apiClient.get(`/title/${titleId}`, {
      params: { services: services.join(',') },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching title details:', error);
    throw new Error('Failed to fetch title details');
  }
};
