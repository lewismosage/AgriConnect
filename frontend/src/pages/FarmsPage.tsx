import React, { useEffect, useState } from 'react';
import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Farm } from '../contexts/AuthContext';

const SAMPLE_FARMS: Farm[] = [
  {
    id: '1',
    name: "Miller's Family Farm",
    location: 'Vermont',
    rating: 4.8,
    specialty: 'Heirloom Vegetables',
    description: 'Three generations of sustainable farming, specializing in heirloom vegetables and organic practices.',
    image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1',
  },
  {
    id: '2',
    name: 'Happy Hens Farm',
    location: 'New Hampshire',
    rating: 4.9,
    specialty: 'Free-Range Eggs',
    description: 'Family-owned farm dedicated to raising happy, healthy hens for the freshest eggs.',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7',
  },
];

const FarmsPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch farms from the backend
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get('/api/farms/');
        console.log('Backend response:', response.data);

        // Transform the data to match the Farm type
        const transformedFarms = response.data.map((farm: any) => ({
          id: farm.id,
          name: farm.name,
          location: farm.location,
          rating: farm.rating || 0,
          specialty: farm.specialty || 'No specialty',
          description: farm.description,
          image: farm.image || 'https://via.placeholder.com/300',
        }));

        setFarms(transformedFarms);
      } catch (err) {
        console.error('Error fetching farms:', err);
        setError('Failed to fetch farms. Using sample data instead.');
        setFarms(SAMPLE_FARMS);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  // Display loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="spinner"></div> {/* Circular spinner */}
      </div>
    );
  }

  // Display error state
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {farms.map((farm) => (
            <Link key={farm.id} to={`/farms/${farm.id}`} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="relative h-48">
                  <img
                    src={farm.image || 'https://via.placeholder.com/300'} // Fallback image
                    alt={farm.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{farm.name}</h2>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">{farm.rating || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{farm.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{farm.description}</p>
                  <div className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {farm.specialty || 'No specialty'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmsPage;