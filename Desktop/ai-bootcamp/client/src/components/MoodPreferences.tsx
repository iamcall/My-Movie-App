import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MOODS, TONES, RUNTIMES, EXTRAS } from '../config/preferences';
import { searchMovies } from '../utils/api';
import { buildUserProfile, scoreAndRankMovies } from '../utils/scoring';

export const MoodPreferences = () => {
  const {
    filters,
    toggleMood,
    toggleTone,
    toggleRuntime,
    toggleExtra,
    ratedMovies,
    selectedServices,
    setIsLoading,
    isLoading,
    setRecommendations,
    setCurrentView,
  } = useAppStore();

  const hasFilters = useMemo(() => {
    return (
      filters.moods.length > 0 ||
      filters.tones.length > 0 ||
      filters.runtimes.length > 0 ||
      filters.extras.length > 0
    );
  }, [filters]);

  const handleFindMatches = async () => {
    if (selectedServices.length === 0) {
      toast.error('Select at least one streaming service.');
      setCurrentView('streaming');
      return;
    }

    const totalRatings = ratedMovies.length;
    const meaningfulRatings = ratedMovies.filter((movie) => movie.userRating > 0);

    if (totalRatings < 3) {
      toast.error('Please finish rating or marking at least 3 titles first.');
      setCurrentView('calibration');
      return;
    }

    setIsLoading(true);
    try {
      const seedIds = meaningfulRatings.map((movie) => movie.id);
      const candidates = await searchMovies(selectedServices, seedIds, filters);
      const profile = buildUserProfile(meaningfulRatings);
      const scored = scoreAndRankMovies(candidates, profile, filters);

      if (scored.length === 0) {
        toast('No strong matches found. Try toggling a different mood.', {
          icon: '🌀',
        });
        return;
      }

      setRecommendations(scored);
      setCurrentView('results');
    } catch (error) {
      toast.error('Could not fetch matches right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderButtonGroup = (
    title: string,
    items: { id: string; label: string }[],
    selected: string[],
    toggleFn: (value: string) => void
  ) => (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => {
          const isActive = selected.includes(item.id);
          return (
            <button
              key={item.id}
              className={`pill-button ${isActive ? 'pill-button-active' : ''}`}
              onClick={() => toggleFn(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <p className="text-primary-600 font-semibold">Step 3 · Mood & prefs</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            What are you in the mood for?
          </h2>
          <p className="text-gray-600">
            Pick as many filters as you want—or none at all. No selection means “surprise me”.
          </p>
        </div>

        <div className="grid gap-8">
          {renderButtonGroup('Mood', MOODS, filters.moods, toggleMood)}
          {renderButtonGroup('Tone', TONES, filters.tones, toggleTone)}
          {renderButtonGroup('Runtime', RUNTIMES, filters.runtimes, toggleRuntime)}
          {renderButtonGroup('Extras', EXTRAS, filters.extras, toggleExtra)}
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            className="btn-secondary"
            onClick={() => setCurrentView('calibration')}
          >
            Back to ratings
          </button>
          <button
            className="btn-primary"
            onClick={handleFindMatches}
            disabled={isLoading}
          >
            {isLoading ? 'Crunching matches…' : 'Find Matches'}
          </button>
        </div>

        {hasFilters ? (
          <p className="text-center text-sm text-gray-500">
            Filters applied: {filters.moods.length} mood, {filters.tones.length} tone, {filters.runtimes.length} runtime, {filters.extras.length} bonus
          </p>
        ) : (
          <p className="text-center text-sm text-gray-400">
            No filters selected—pure taste-based recommendations.
          </p>
        )}
      </div>
    </div>
  );
};
