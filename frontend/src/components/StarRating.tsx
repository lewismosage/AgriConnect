import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';

interface StarRatingProps {
  farmId: string;
  initialRating: number;
  initialTotalRatings: number;
  onRatingSubmit: (rating: number, totalRatings: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  farmId, 
  initialRating, 
  initialTotalRatings, 
  onRatingSubmit 
}) => {
  const [averageRating, setAverageRating] = useState(initialRating);
  const [totalRatings, setTotalRatings] = useState(initialTotalRatings);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch rating data on component mount
  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const response = await axios.get(`/api/farms/${farmId}/rating-info/`);
        setAverageRating(response.data.averageRating || 0);
        setTotalRatings(response.data.totalRatings || 0);
        setUserRating(response.data.userRating || null);
      } catch (error) {
        console.error('Failed to fetch rating data:', error);
        // Fall back to initial props if API fails
        setAverageRating(initialRating);
        setTotalRatings(initialTotalRatings);
      }
    };

    fetchRatingData();
  }, [farmId]);

  const handleStarClick = async (star: number) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const isRemoving = userRating === star;
      const response = await axios.post(`/api/farms/${farmId}/rate/`, {
        rating: isRemoving ? 0 : star
      });

      setAverageRating(response.data.averageRating);
      setTotalRatings(response.data.totalRatings);
      setUserRating(isRemoving ? null : star);
      onRatingSubmit(response.data.averageRating, response.data.totalRatings);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || 'Failed to submit rating');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const roundedRating = Math.round(averageRating * 2) / 2; // Round to nearest 0.5

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= roundedRating;
      const isHalfFilled = i - 0.5 === roundedRating;
      const isUserRated = userRating && i <= userRating;

      stars.push(
        <button
          key={i}
          onClick={() => handleStarClick(i)}
          disabled={isLoading}
          className="relative"
        >
          <Star 
            className={`w-5 h-5 ${isFilled || isUserRated ? 'text-yellow-400' : 'text-gray-300'}`}
            fill={isUserRated ? 'currentColor' : isFilled ? 'currentColor' : 'none'}
          />
          {isHalfFilled && !isUserRated && (
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
          )}
        </button>
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        {renderStars()}
      </div>
      <span className="text-sm text-gray-600 ml-2">
        ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
      </span>
    </div>
  );
};

export default StarRating;