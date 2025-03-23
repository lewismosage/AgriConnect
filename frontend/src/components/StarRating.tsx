import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';

interface StarRatingProps {
  farmId: string;
  initialRating: number;
  totalRatings: number;
  onRatingSubmit: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ farmId, initialRating, totalRatings, onRatingSubmit }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleStarClick = async (newRating: number) => {
    try {
      const response = await axios.post(`/api/farms/${farmId}/submit-rating/`, { rating: newRating });
      setRating(response.data.rating);
      setUserRating(newRating);
      onRatingSubmit(newRating);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={`${
            (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
          } transition-colors`}
        >
          <Star className="w-5 h-5" />
        </button>
      ))}
      <span className="text-sm text-gray-600 ml-2">
        ({totalRatings} ratings)
      </span>
    </div>
  );
};

export default StarRating;