import React, { useEffect, useState } from 'react';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Farm } from '../contexts/AuthContext';

const FarmsPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get('/api/farms/');
        
        const transformedFarms = response.data.map((farm: any): Farm => ({
          id: farm.id,
          name: farm.name,
          location: farm.location,
          rating: typeof farm.rating === 'number' ? farm.rating : 0,
          specialty: farm.specialty || 'No specialty',
          description: farm.description,
          image: farm.farm_image || farm.image || ''
        }));

        setFarms(transformedFarms);
      } catch (err) {
        console.error('Error fetching farms:', err);
        setError('Failed to fetch farms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  const formatRating = (rating: number): string => {
    return rating > 0 ? rating.toFixed(1) : 'Not rated';
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Local Farmers</h1>

        {farms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {farms.map((farm) => (
              <div
                key={farm.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={farm.image || '/placeholder-farm.jpg'}
                    alt={farm.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{farm.name}</h2>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        {formatRating(farm.rating || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{farm.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{farm.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {farm.specialty || 'No specialty'}
                    </div>
                    <Link
                      to={`/farms/${farm.id}`}
                      state={{ farm }}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Farm <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg font-semibold mb-4">There are no farms at the moment.</p>
            <Link
              to="/farm-registration"
              className="inline-block bg-green-600 text-white hover:bg-green-700 font-medium py-3 px-8 rounded-lg transition duration-300"
            >
              Add Farm
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmsPage;