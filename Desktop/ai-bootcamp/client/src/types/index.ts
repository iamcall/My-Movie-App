export interface Movie {
  id: string;
  title: string;
  year?: number;
  rating?: number;
  runtime?: number;
  genres?: string[];
  plot?: string;
  poster?: string;
  directors?: string[];
  actors?: string[];
  certification?: string;
  streamingServices?: string[];
}

export interface RatedMovie extends Movie {
  userRating: number; // 1-5 or 0 for "Never seen"
}

export interface UserPreferences {
  genres: { [genre: string]: number };
  runtimes: { short: number; medium: number; long: number };
  talents: { [name: string]: number }; // actors/directors
  avgRating: number;
}

export interface MatchResult extends Movie {
  matchScore: number; // 0-100
  matchReason: string;
}

export interface Filters {
  moods: string[];
  tones: string[];
  runtimes: string[];
  extras: string[];
}

export type AppView = 'landing' | 'streaming' | 'calibration' | 'mood' | 'results';
