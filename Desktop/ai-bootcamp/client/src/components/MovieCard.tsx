import type { Movie } from '../types';
import { useEffect, useState } from 'react';

interface MovieCardProps {
  movie: Movie;
  onRate: (rating: number) => void;
  showRating?: boolean;
  currentRating?: number;
}

export const MovieCard = ({
  movie,
  onRate,
  showRating = true,
  currentRating,
}: MovieCardProps) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [localRating, setLocalRating] = useState<number | null>(
    typeof currentRating === 'number' ? currentRating : null
  );
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (typeof currentRating === 'number') {
      setLocalRating(currentRating);
    }
  }, [currentRating]);

  const displayRating =
    hoveredRating !== null
      ? hoveredRating
      : localRating !== null
        ? localRating
        : 0;

  const handleStarClick = (rating: number) => {
    setLocalRating(rating);
    onRate(rating);
  };

  const handleNeverSeen = () => {
    setLocalRating(0);
    onRate(0);
  };

  return (
    <div className="card animate-slide-up">
      <div className="flex flex-col h-full">
        {/* Movie Poster */}
        <div className="mb-4 relative overflow-hidden rounded-lg bg-gray-200 h-64">
          {movie.poster && !imageError ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-6xl">🎬</span>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {movie.title}
          </h3>

          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
            {movie.year && <span>{movie.year}</span>}
            {movie.rating && (
              <span className="flex items-center gap-1">
                ⭐ {movie.rating.toFixed(1)}
              </span>
            )}
            {movie.runtime && <span>{movie.runtime} min</span>}
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {movie.plot && (
            <p className="text-sm text-gray-600 h-16 overflow-hidden mb-4">
              {movie.plot}
            </p>
          )}
        </div>

        {/* Rating Section */}
        {showRating && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Rate this movie:
            </p>
            <div className="flex justify-between items-center gap-2">
              {/* Star ratings 1-5 */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => {
                  const isFilled = displayRating >= rating;
                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleStarClick(rating)}
                      onMouseEnter={() => setHoveredRating(rating)}
                      onMouseLeave={() => setHoveredRating(null)}
                      className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                    >
                      <span className={isFilled ? 'text-amber-400' : 'text-gray-300'}>
                        {isFilled ? '★' : '☆'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Never Seen button */}
              <button
                onClick={handleNeverSeen}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  localRating === 0
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Never Seen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
