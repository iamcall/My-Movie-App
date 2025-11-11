import type { Movie, RatedMovie, UserPreferences, MatchResult, Filters } from '../types';
import {
  MOOD_WEIGHTS,
  TONE_WEIGHTS,
  RUNTIME_CONSTRAINTS,
  EXTRA_WEIGHTS,
} from '../config/preferences';

// Build user preference profile from rated movies
export const buildUserProfile = (ratedMovies: RatedMovie[]): UserPreferences => {
  const profile: UserPreferences = {
    genres: {},
    runtimes: { short: 0, medium: 0, long: 0 },
    talents: {},
    avgRating: 0,
  };

  if (ratedMovies.length === 0) return profile;

  let totalRating = 0;
  let ratingCount = 0;

  ratedMovies.forEach((movie) => {
    if (movie.userRating === 0) return; // Skip "Never seen"

    const weight = movie.userRating / 5; // Normalize to 0-1

    // Track genres
    movie.genres?.forEach((genre) => {
      profile.genres[genre] = (profile.genres[genre] || 0) + weight;
    });

    // Track runtimes
    if (movie.runtime) {
      if (movie.runtime < 100) {
        profile.runtimes.short += weight;
      } else if (movie.runtime <= 130) {
        profile.runtimes.medium += weight;
      } else {
        profile.runtimes.long += weight;
      }
    }

    // Track actors and directors
    movie.actors?.slice(0, 3).forEach((actor) => {
      profile.talents[actor] = (profile.talents[actor] || 0) + weight;
    });
    movie.directors?.forEach((director) => {
      profile.talents[director] = (profile.talents[director] || 0) + weight;
    });

    totalRating += movie.userRating;
    ratingCount++;
  });

  profile.avgRating = ratingCount > 0 ? totalRating / ratingCount : 0;

  return profile;
};

// Calculate similarity score between user profile and candidate movie
const calculateSimilarity = (profile: UserPreferences, movie: Movie): number => {
  let score = 0;
  let maxScore = 0;

  // Genre similarity (0-40 points)
  const genreScore = movie.genres?.reduce((sum, genre) => {
    return sum + (profile.genres[genre] || 0);
  }, 0) || 0;
  score += Math.min(genreScore * 10, 40);
  maxScore += 40;

  // Runtime similarity (0-20 points)
  if (movie.runtime) {
    const runtimeBucket =
      movie.runtime < 100 ? 'short' : movie.runtime <= 130 ? 'medium' : 'long';
    score += profile.runtimes[runtimeBucket] * 20;
  }
  maxScore += 20;

  // Talent overlap (0-20 points)
  const talentScore =
    [...(movie.actors || []).slice(0, 3), ...(movie.directors || [])].reduce(
      (sum, person) => sum + (profile.talents[person] || 0),
      0
    ) / 4;
  score += Math.min(talentScore * 20, 20);
  maxScore += 20;

  return maxScore > 0 ? score / maxScore : 0;
};

// Calculate mood alignment score. Returns -1 if movie fails mandatory filters.
const calculateMoodAlignment = (movie: Movie, filters: Filters): number => {
  let score = 0;

  const movieGenres = movie.genres || [];

  const requiresMood = filters.moods.length > 0;
  if (requiresMood) {
    const matchesMood = filters.moods.some((mood) => {
      const config = MOOD_WEIGHTS[mood];
      if (!config?.genres?.length) return false;
      return movieGenres.some((genre) => config.genres!.includes(genre));
    });
    if (!matchesMood) {
      return -1; // reject outright
    }
    filters.moods.forEach((mood) => {
      const config = MOOD_WEIGHTS[mood];
      if (!config) return;
      score += 25 * (config.weight || 1);
      if (config.imdbMin && movie.rating && movie.rating >= config.imdbMin) {
        score += 5;
      }
    });
  }

  const requiresTone = filters.tones.length > 0;
  if (requiresTone) {
    const matchesTone = filters.tones.some((tone) => {
      const config = TONE_WEIGHTS[tone];
      if (!config?.genres?.length) return false;
      return movieGenres.some((genre) => config.genres!.includes(genre));
    });
    if (!matchesTone) {
      return -1;
    }
    filters.tones.forEach((tone) => {
      const config = TONE_WEIGHTS[tone];
      if (!config) return;
      score += 15 * (config.weight || 1);
    });
  }

  if (filters.runtimes.length > 0) {
    const meetsRuntime = filters.runtimes.some((runtimeId) => {
      const constraint = RUNTIME_CONSTRAINTS[runtimeId];
      if (!movie.runtime) return true; // unknown runtime -> allow
      const meetsMin = !constraint.min || movie.runtime >= constraint.min;
      const meetsMax = !constraint.max || movie.runtime <= constraint.max;
      return meetsMin && meetsMax;
    });

    if (!meetsRuntime) {
      return -1;
    }

    score += 10;
  }

  filters.extras.forEach((extra) => {
    const config = EXTRA_WEIGHTS[extra];
    if (!config) return;
    if (config.imdbMin && movie.rating && movie.rating >= config.imdbMin) {
      score += 10 * (config.weight || 1);
    }
  });

  return Math.min(score, 100);
};

// Normalize IMDb rating to 0-1
const normalizeIMDbRating = (rating?: number): number => {
  if (!rating) return 0.5;
  return Math.min(Math.max(rating / 10, 0), 1);
};

// Main scoring function
export const scoreMovie = (
  movie: Movie,
  profile: UserPreferences,
  filters: Filters
): number => {
  const w_pref = 0.25;
  const w_mood = 0.55;
  const w_imdb = 0.2;

  const similarity = calculateSimilarity(profile, movie);
  const moodAlignment = calculateMoodAlignment(movie, filters);
  if (moodAlignment < 0) {
    return 0; // fails mandatory filters
  }
  const imdbNormalized = normalizeIMDbRating(movie.rating);

  const score =
    w_pref * similarity * 100 +
    w_mood * moodAlignment +
    w_imdb * imdbNormalized * 100;

  return Math.min(Math.max(Math.round(score), 0), 100);
};

// Generate match reason text
export const generateMatchReason = (
  movie: Movie,
  profile: UserPreferences,
  filters: Filters,
  score: number
): string => {
  const reasons: string[] = [];

  // Top genre matches
  const topGenres = movie.genres
    ?.filter((g) => profile.genres[g] && profile.genres[g] > 0.5)
    .slice(0, 2);

  if (topGenres && topGenres.length > 0) {
    reasons.push(`Matches your love for ${topGenres.join(' and ')}`);
  }

  // Mood matches
  const matchedMoods = filters.moods.filter((mood) => {
    const config = MOOD_WEIGHTS[mood];
    return movie.genres?.some((g) => config.genres?.includes(g));
  });

  if (matchedMoods.length > 0) {
    reasons.push(`Perfect for a ${matchedMoods[0].toLowerCase()} mood`);
  }

  // Runtime preference
  if (movie.runtime && filters.runtimes.length > 0) {
    if (movie.runtime < 90) {
      reasons.push('Quick watch under 90 minutes');
    } else if (movie.runtime > 150) {
      reasons.push('Epic runtime for deep immersion');
    }
  }

  // High rating
  if (movie.rating && movie.rating >= 8.0) {
    reasons.push(`Highly rated (${movie.rating}/10 on IMDb)`);
  }

  // Talent match
  const knownTalents = [
    ...(movie.actors || []).slice(0, 2),
    ...(movie.directors || []),
  ].filter((person) => profile.talents[person] && profile.talents[person] > 0.3);

  if (knownTalents.length > 0) {
    reasons.push(`Features ${knownTalents[0]}`);
  }

  if (reasons.length === 0) {
    reasons.push('Good match based on your preferences');
  }

  return reasons.slice(0, 3).join('. ') + '.';
};

// Score multiple movies and return sorted results
export const scoreAndRankMovies = (
  movies: Movie[],
  profile: UserPreferences,
  filters: Filters
): MatchResult[] => {
  const scoredMovies = movies.map((movie) => {
    const matchScore = scoreMovie(movie, profile, filters);
    const matchReason = generateMatchReason(movie, profile, filters, matchScore);

    return {
      ...movie,
      matchScore,
      matchReason,
    };
  });

  // Sort by score descending
  return scoredMovies.sort((a, b) => b.matchScore - a.matchScore);
};
