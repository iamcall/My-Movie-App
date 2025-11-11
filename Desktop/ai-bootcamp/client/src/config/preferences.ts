export const STREAMING_SERVICES = [
  { id: 'Netflix', name: 'Netflix' },
  { id: 'Hulu', name: 'Hulu' },
  { id: 'Prime Video', name: 'Prime Video' },
  { id: 'Disney+', name: 'Disney+' },
  { id: 'HBO Max', name: 'HBO Max' },
  { id: 'Apple TV+', name: 'Apple TV+' },
];

export const MOODS = [
  { id: 'Cozy', label: 'Cozy' },
  { id: 'Thrilling', label: 'Thrilling' },
  { id: 'Dark Comedy', label: 'Dark Comedy' },
  { id: 'Romance', label: 'Romance' },
  { id: 'Family-Friendly', label: 'Family-Friendly' },
  { id: 'Mind-Bending', label: 'Mind-Bending' },
];

export const TONES = [
  { id: 'Light-Hearted', label: 'Light-Hearted' },
  { id: 'Emotional', label: 'Emotional' },
  { id: 'Gritty', label: 'Gritty' },
];

export const RUNTIMES = [
  { id: '<90', label: '<90 min' },
  { id: '<120', label: '<120 min' },
  { id: '>150', label: 'Epic (>150)' },
];

export const EXTRAS = [
  { id: 'Award-winning', label: 'Award-winning' },
  { id: 'Underrated', label: 'Underrated Gems' },
];

// Mood to genre/keyword mapping with weights
export interface PreferenceWeight {
  genres?: string[];
  keywords?: string[];
  certifications?: string[];
  runtimeMin?: number;
  runtimeMax?: number;
  imdbMin?: number;
  weight: number;
}

export const MOOD_WEIGHTS: { [key: string]: PreferenceWeight } = {
  'Cozy': {
    genres: ['Comedy', 'Romance', 'Family'],
    certifications: ['G', 'PG', 'PG-13'],
    imdbMin: 6.5,
    weight: 1.2,
  },
  'Thrilling': {
    genres: ['Thriller', 'Action', 'Mystery'],
    imdbMin: 6.0,
    weight: 1.3,
  },
  'Dark Comedy': {
    genres: ['Comedy', 'Crime', 'Drama'],
    imdbMin: 6.5,
    weight: 1.1,
  },
  'Romance': {
    genres: ['Romance', 'Drama'],
    imdbMin: 6.0,
    weight: 1.0,
  },
  'Family-Friendly': {
    genres: ['Family', 'Animation', 'Adventure'],
    certifications: ['G', 'PG'],
    imdbMin: 6.5,
    weight: 1.2,
  },
  'Mind-Bending': {
    genres: ['Sci-Fi', 'Thriller', 'Mystery'],
    imdbMin: 7.0,
    weight: 1.4,
  },
};

export const TONE_WEIGHTS: { [key: string]: PreferenceWeight } = {
  'Light-Hearted': {
    genres: ['Comedy', 'Family', 'Animation'],
    weight: 1.0,
  },
  'Emotional': {
    genres: ['Drama', 'Romance'],
    weight: 1.1,
  },
  'Gritty': {
    genres: ['Crime', 'Thriller', 'Drama'],
    certifications: ['R'],
    weight: 1.2,
  },
};

export const RUNTIME_CONSTRAINTS: { [key: string]: { min?: number; max?: number } } = {
  '<90': { max: 90 },
  '<120': { max: 120 },
  '>150': { min: 150 },
};

export const EXTRA_WEIGHTS: { [key: string]: PreferenceWeight } = {
  'Award-winning': {
    imdbMin: 7.5,
    weight: 1.3,
  },
  'Underrated': {
    imdbMin: 6.8,
    weight: 1.1,
  },
};
