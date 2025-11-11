export interface StreamingService {
  name: string;
  id: string;
}

export interface SearchRequest {
  services: string[];
  seeds?: string[];
  filters?: {
    moods?: string[];
    tones?: string[];
    runtimes?: string[];
    extras?: string[];
  };
}

export interface IMDbTitle {
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
}

export interface StreamingAvailability {
  [titleId: string]: {
    services: string[];
    lastUpdated: number;
  };
}

export interface CachedTitle extends IMDbTitle {
  streamingServices?: string[];
}
