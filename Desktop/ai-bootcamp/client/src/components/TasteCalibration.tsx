import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { MovieCard } from './MovieCard';
import { fetchCalibrationMovies } from '../utils/api';
import { useAppStore } from '../store/useAppStore';
import type { Movie } from '../types';

export const TasteCalibration = () => {
  const {
    calibrationMovies,
    calibrationIndex,
    ratedMovies,
    addRating,
    nextCalibrationBatch,
    setCalibrationMovies,
    appendCalibrationMovies,
    setCurrentView,
    setIsLoading,
    isLoading,
  } = useAppStore();

  const totalRatings = ratedMovies.length;
  const meaningfulRatings = useMemo(
    () => ratedMovies.filter((movie) => movie.userRating > 0).length,
    [ratedMovies]
  );

  const currentBatch = useMemo(
    () => calibrationMovies.slice(calibrationIndex, calibrationIndex + 3),
    [calibrationMovies, calibrationIndex]
  );

  useEffect(() => {
    if (calibrationMovies.length === 0) {
      loadInitialMovies();
    }
  }, []);

  const loadInitialMovies = async () => {
    setIsLoading(true);
    try {
      const movies = await fetchCalibrationMovies(12);
      setCalibrationMovies(movies);
    } catch (error) {
      toast.error('Unable to load calibration titles right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    setIsLoading(true);
    try {
      const movies = await fetchCalibrationMovies(9);
      appendCalibrationMovies(movies);
      nextCalibrationBatch();
    } catch (error) {
      toast.error('Unable to fetch more titles.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextBatch = async () => {
    if (calibrationIndex + 3 >= calibrationMovies.length) {
      await loadMoreMovies();
    } else {
      nextCalibrationBatch();
    }
  };

  const handleDone = () => {
    if (totalRatings < 3) {
      toast.error('Please rate or mark 3 titles before continuing.');
      return;
    }
    setCurrentView('mood');
  };

  const handleRate = (movie: Movie, rating: number) => {
    addRating(movie, rating);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-primary-600 font-semibold">Step 2 · Taste Calibration</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Tune your compass
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Rate a few titles so we learn your vibe. Choose 1–5 stars or mark “Never seen”.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {totalRatings} of 3 rated (Never Seen counts toward progress)
          </div>
        </div>

        {isLoading && currentBatch.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Loading titles…</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {currentBatch.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onRate={(rating) => handleRate(movie, rating)}
                currentRating={
                  ratedMovies.find((rated) => rated.id === movie.id)?.userRating
                }
              />
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setCurrentView('streaming')}
            className="btn-secondary"
          >
            Back
          </button>
          <button
            onClick={handleNextBatch}
            disabled={isLoading || calibrationMovies.length === 0}
            className="btn-secondary"
          >
            See 3 more
          </button>
          <button
            onClick={handleDone}
            className="btn-primary"
          >
            Done rating
          </button>
        </div>
      </div>
    </div>
  );
};
