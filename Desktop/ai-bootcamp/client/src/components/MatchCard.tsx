import { useState } from 'react';
import type { MatchResult } from '../types';

interface MatchCardProps {
  match: MatchResult;
  onRate: (match: MatchResult) => void;
  onSkip: (id: string) => void;
}

export const MatchCard = ({ match, onRate, onSkip }: MatchCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="card grid gap-6 md:grid-cols-[180px,1fr]">
      <div className="relative h-64 md:h-full rounded-xl overflow-hidden bg-gray-100">
        {match.poster ? (
          <img
            src={match.poster}
            alt={match.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
            🎥
          </div>
        )}
        <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
          {match.matchScore}% match
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{match.title}</h3>
            <p className="text-gray-500">
              {match.year && `${match.year} • `}
              {match.runtime && `${match.runtime} min`}
            </p>
          </div>
          {match.rating && (
            <div className="text-lg font-semibold text-gray-800">
              ⭐ {match.rating.toFixed(1)} IMDb
            </div>
          )}
        </div>

        {match.genres && (
          <div className="mt-3 flex flex-wrap gap-2">
            {match.genres.slice(0, 4).map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {match.streamingServices && match.streamingServices.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
              Available on
            </p>
            <div className="flex flex-wrap gap-2">
              {match.streamingServices.map((service) => (
                <span
                  key={service}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="mt-4 text-gray-700">{match.matchReason}</p>

        {showDetails && match.plot && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            {match.plot}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn-primary" onClick={() => onRate(match)}>
            Rate
          </button>
          <button
            className="btn-secondary"
            onClick={() => match.plot && setShowDetails(!showDetails)}
            disabled={!match.plot}
          >
            {showDetails ? 'Hide details' : 'See details'}
          </button>
          <button
            className="btn-secondary"
            onClick={() => onSkip(match.id)}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};
