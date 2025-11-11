import { useEffect, useState } from 'react';
import type { Movie } from '../types';

interface RatingModalProps {
  movie: Movie | null;
  isOpen: boolean;
  initialRating?: number;
  onClose: () => void;
  onSave: (rating: number) => void;
}

export const RatingModal = ({
  movie,
  isOpen,
  initialRating = 0,
  onClose,
  onSave,
}: RatingModalProps) => {
  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating, movie]);

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="w-20 h-28 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">🎞️</span>
            )}
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-400 mb-1">
              Rate & refine
            </p>
            <h3 className="text-xl font-semibold text-gray-900">{movie.title}</h3>
            <p className="text-sm text-gray-500">{movie.year}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            How did you like it?
          </p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-3xl transition-transform hover:scale-110"
              >
                {rating >= star ? (
                  <span className="text-yellow-400">★</span>
                ) : (
                  <span className="text-gray-300">★</span>
                )}
              </button>
            ))}
            <button
              onClick={() => setRating(0)}
              className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                rating === 0 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Never seen
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              onSave(rating);
              onClose();
            }}
          >
            Save rating
          </button>
        </div>
      </div>
    </div>
  );
};
