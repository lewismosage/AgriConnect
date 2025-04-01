import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, MapPin, Calendar, ArrowLeft, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { Farm } from '../contexts/AuthContext';
import StarRating from '../components/StarRating';

export interface Product {
  id: string;
  name: string;
  season: string;
  price: string;
  unit: string;
  category: string;
  description: string;
  image?: string;
}

const FarmDetailPage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [farm, setFarm] = useState<Farm | null>(location.state?.farm || null);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(!location.state?.farm);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [rating, setRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  // Fetch farm details and products
  useEffect(() => {
    const fetchFarmDetails = async () => {
      setLoading(true);
      try {
        // Always fetch fresh farm data from the backend
        const farmResponse = await axios.get(`/api/farms/${farmId}/`);
        const farmData = farmResponse.data;
        
        // Handle the image URL properly
        const getImageUrl = (img: string | null | undefined) => {
          if (!img) return null;
          return img.startsWith('http') ? img : `${import.meta.env.VITE_BACKEND_URL}${img}`;
        };
  
        setFarm({
          ...farmData,
          about: farmData.about,
          sustainability: farmData.sustainability,
          // Use farm_image if available, otherwise fall back to image
          image: getImageUrl(farmData.farm_image || farmData.image),
          farm_image: getImageUrl(farmData.farm_image)
        });
        
        setRating(farmData.rating);
        setTotalRatings(farmData.ratings?.length || 0);
  
        // Fetch products for the farm
        const productsResponse = await axios.get(`/api/farms/${farmId}/products/`);
        setProducts(productsResponse.data);
      } catch (err) {
        console.error('Error fetching farm details:', err);
        setError('Failed to fetch farm details.');
      } finally {
        setLoading(false);
      }
    };
  
    if (farmId) {
      fetchFarmDetails();
    }
  }, [farmId]); 

  const handleRatingSubmit = (newRating: number, newTotalRatings: number) => {
    setRating(newRating);
    setTotalRatings(newTotalRatings);
  };

  const handleShopFromFarm = () => {
    // Navigate to a new page or open a modal for farm-specific shopping
    navigate(`/farm/${farmId}/shop`, { 
      state: { 
        farmName: farm?.name, 
        products: products 
      } 
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !farm) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error || 'Farm not found'}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Farm Hero Section with Banner Image */}
      <div className="relative">
        <div className="h-64 w-full relative">
        <img
            src={farm.image}
            alt={farm.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Farm Title Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full px-6 pb-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{farm.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{farm.location}</span>
            </div>
            <StarRating
              farmId={farmId!}
              initialRating={rating}
              initialTotalRatings={totalRatings}
              onRatingSubmit={handleRatingSubmit}
            />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto">
          <div className="flex">
            <button
              className={`px-6 py-4 font-medium ${activeTab === 'about' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button
              className={`px-6 py-4 font-medium ${activeTab === 'products' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('products')}
            >
              Products & Availability
            </button>
            <button
              className={`px-6 py-4 font-medium ${activeTab === 'sustainability' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('sustainability')}
            >
              Sustainability
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* About Tab Content */}
        {activeTab === 'about' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">About {farm.name}</h2>
            {farm.about ? (
              <div className="text-gray-700 whitespace-pre-line">
                {farm.about}
              </div>
            ) : (
              <div className="text-gray-500 italic">
                This farm hasn't provided an about section yet.
              </div>
            )}
          </div>
        )}

        {/* Products Tab Content */}
        {activeTab === 'products' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Available Products</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">{product.season || 'Available year-round'}</span>
                        </div>
                        {product.description && (
                          <p className="text-gray-500 text-sm mt-2">{product.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">${product.price} / {product.unit}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-500">
                  No products available for this farm.
                </div>
              )}
            </div>

            <div className="mt-8">
              <button 
                onClick={handleShopFromFarm}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center"
              >
                <ShoppingCart className="mr-2" />
                Shop from Farm
              </button>
            </div>
          </div>
        )}

        {/* Sustainability Tab Content */}
        {activeTab === 'sustainability' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Sustainability Practices</h2>
            {farm.sustainability ? (
              <div className="text-gray-700 whitespace-pre-line">
                {farm.sustainability}
              </div>
            ) : (
              <div className="text-gray-500 italic">
                This farm hasn't provided sustainability information yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmDetailPage;