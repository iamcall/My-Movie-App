import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { MatchCard } from './MatchCard';
import { RatingModal } from './RatingModal';
import { useAppStore } from '../store/useAppStore';
import type { MatchResult } from '../types';

export const RecommendationsList = () => {
  const {
    recommendations,
    setCurrentView,
    addRating,
    ratedMovies,
  } = useAppStore();

  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [ratingTarget, setRatingTarget] = useState<MatchResult | null>(null);

  const visibleRecommendations = useMemo(
    () => recommendations.filter((match) => !dismissedIds.has(match.id)),
    [recommendations, dismissedIds]
  );

  const handleSkip = (id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleSaveRating = (rating: number) => {
    if (!ratingTarget) return;
    addRating(ratingTarget, rating);
    toast.success(`Saved your rating for ${ratingTarget.title}`);
  };

  const getExistingRating = (movieId: string) =>
    ratedMovies.find((movie) => movie.id === movieId)?.userRating;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <p className="text-primary-600 font-semibold">Matches ready</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Tonight’s picks
          </h2>
          <p className="text-gray-600">
            Curated across your services with your taste and mood baked in.
          </p>
        </div>

        {visibleRecommendations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <p className="text-lg text-gray-600 mb-4">
              No matches left on this list.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn-primary" onClick={() => setCurrentView('mood')}>
                Adjust filters
              </button>
              <button className="btn-secondary" onClick={() => setCurrentView('calibration')}>
                Rate more titles
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {visibleRecommendations.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onRate={(m) => setRatingTarget(m)}
                onSkip={handleSkip}
              />
            ))}
          </div>
        )}
      </div>

      <RatingModal
        movie={ratingTarget}
        isOpen={Boolean(ratingTarget)}
        initialRating={
          ratingTarget ? getExistingRating(ratingTarget.id) ?? 0 : 0
        }
        onClose={() => setRatingTarget(null)}
        onSave={handleSaveRating}
      />
    </div>
  );
};
