import { create } from 'zustand';
import type { AppView, RatedMovie, Filters, Movie, MatchResult } from '../types';

interface AppState {
  // Current view
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Streaming services
  selectedServices: string[];
  setSelectedServices: (services: string[]) => void;
  toggleService: (service: string) => void;

  // Rated movies (from calibration)
  ratedMovies: RatedMovie[];
  addRating: (movie: Movie, rating: number) => void;
  updateRating: (movieId: string, rating: number) => void;

  // Calibration
  calibrationMovies: Movie[];
  setCalibrationMovies: (movies: Movie[]) => void;
  appendCalibrationMovies: (movies: Movie[]) => void;
  calibrationIndex: number;
  nextCalibrationBatch: () => void;

  // Mood & preferences
  filters: Filters;
  toggleMood: (mood: string) => void;
  toggleTone: (tone: string) => void;
  toggleRuntime: (runtime: string) => void;
  toggleExtra: (extra: string) => void;

  // Recommendations
  recommendations: MatchResult[];
  setRecommendations: (results: MatchResult[]) => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  currentView: 'landing' as AppView,
  selectedServices: [],
  ratedMovies: [],
  calibrationMovies: [],
  calibrationIndex: 0,
  filters: {
    moods: [],
    tones: [],
    runtimes: [],
    extras: [],
  },
  recommendations: [],
  isLoading: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  setCurrentView: (view) => set({ currentView: view }),

  setSelectedServices: (services) => set({ selectedServices: services }),

  toggleService: (service) =>
    set((state) => ({
      selectedServices: state.selectedServices.includes(service)
        ? state.selectedServices.filter((s) => s !== service)
        : [...state.selectedServices, service],
    })),

  addRating: (movie, rating) =>
    set((state) => ({
      ratedMovies: [
        ...state.ratedMovies.filter((m) => m.id !== movie.id),
        { ...movie, userRating: rating },
      ],
    })),

  updateRating: (movieId, rating) =>
    set((state) => ({
      ratedMovies: state.ratedMovies.map((m) =>
        m.id === movieId ? { ...m, userRating: rating } : m
      ),
    })),

  setCalibrationMovies: (movies) =>
    set({
      calibrationMovies: movies,
      calibrationIndex: 0,
    }),

  appendCalibrationMovies: (movies) =>
    set((state) => ({
      calibrationMovies: [...state.calibrationMovies, ...movies],
    })),

  nextCalibrationBatch: () =>
    set((state) => ({
      calibrationIndex: state.calibrationIndex + 3,
    })),

  toggleMood: (mood) =>
    set((state) => ({
      filters: {
        ...state.filters,
        moods: state.filters.moods.includes(mood)
          ? state.filters.moods.filter((m) => m !== mood)
          : [...state.filters.moods, mood],
      },
    })),

  toggleTone: (tone) =>
    set((state) => ({
      filters: {
        ...state.filters,
        tones: state.filters.tones.includes(tone)
          ? state.filters.tones.filter((t) => t !== tone)
          : [...state.filters.tones, tone],
      },
    })),

  toggleRuntime: (runtime) =>
    set((state) => ({
      filters: {
        ...state.filters,
        runtimes: state.filters.runtimes.includes(runtime)
          ? state.filters.runtimes.filter((r) => r !== runtime)
          : [...state.filters.runtimes, runtime],
      },
    })),

  toggleExtra: (extra) =>
    set((state) => ({
      filters: {
        ...state.filters,
        extras: state.filters.extras.includes(extra)
          ? state.filters.extras.filter((e) => e !== extra)
          : [...state.filters.extras, extra],
      },
    })),

  setRecommendations: (results) => set({ recommendations: results }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  reset: () => set(initialState),
}));
