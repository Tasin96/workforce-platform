import React from 'react';
import { HiStar } from 'react-icons/hi';

const RatingStars = ({ rating = 0, count, size = 'text-sm' }) => {
  const numRating = Number(rating) || 0;
  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex items-center ${size} text-amber-400`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <HiStar
            key={n}
            className={n <= Math.round(numRating) ? 'opacity-100' : 'opacity-20 text-slate-300'}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-700">
        {numRating.toFixed(1)}
        {count !== undefined && <span className="font-normal text-slate-400 ml-1">({count})</span>}
      </span>
    </div>
  );
};

export default RatingStars;
