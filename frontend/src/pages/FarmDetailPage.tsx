import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Farm } from '../contexts/AuthContext';

// Product type definition
interface Product {
  id: string;
  name: string;
  season: string;
  price: string;
  unit: string;
}

// Sample products for demonstration
const SAMPLE_PRODUCTS: Record<string, Product[]> = {
  '1': [
    { id: '1', name: 'Organic Tomatoes', season: 'June - September', price: '4.99', unit: '/lb' },
    { id: '2', name: 'Fresh Eggs', season: 'Year-round', price: '6.99', unit: '/dozen' },
    { id: '3', name: 'Raw Honey', season: 'August - October', price: '12.99', unit: '/jar' }
  ],
  '2': [
    { id: '1', name: 'Free-Range Eggs', season: 'Year-round', price: '7.99', unit: '/dozen' },
    { id: '2', name: 'Organic Chicken', season: 'Year-round', price: '8.99', unit: '/lb' }
  ]
};

const FarmDetailPage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  
  const [farm, setFarm] = useState<Farm | null>(null);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFarmDetails = async () => {
      if (!farmId) return;
      
      try {
        // Attempt to fetch farm data from API
        const response = await axios.get(`/api/farms/${farmId}`);
        setFarm(response.data);
        
        // Attempt to fetch products
        try {
          const productsResponse = await axios.get(`/api/farms/${farmId}/products`);
          setProducts(productsResponse.data);
        } catch (err) {
          console.log('Using sample products instead');
          // Fallback to sample products if API fails
          setProducts(SAMPLE_PRODUCTS[farmId] || []);
        }
      } catch (err) {
        console.error('Error fetching farm details:', err);
        setError('Failed to fetch farm details.');
        
        // Fallback to sample data
        const sampleFarm = {
          id: '1',
          name: "Miller's Family Farm",
          location: 'Vermont',
          rating: 4.8,
          specialty: 'Heirloom Vegetables',
          description: 'Three generations of sustainable farming, specializing in heirloom vegetables and organic practices.',
          image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1'
        };
        
        setFarm(sampleFarm);
        setProducts(SAMPLE_PRODUCTS[farmId || '1'] || []);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmDetails();
  }, [farmId]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-700">Loading farm details...</div>
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
            src={farm.image || 'https://via.placeholder.com/1200x400'}
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
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span>{farm.rating}</span>
            </div>
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
            <p className="text-gray-700 mb-4">{farm.description}</p>
            <p className="text-gray-700">
              At {farm.name}, we believe in sustainable farming practices that honor the land and provide
              the healthiest, most delicious produce to our community. Our family has been farming in {farm.location}
              for generations, focusing on {farm.specialty ? farm.specialty.toLowerCase() : 'a variety of crops'} and building a transparent relationship
              with our customers.
            </p>
          </div>
        )}
        
        {/* Products Tab Content */}
        {activeTab === 'products' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Available Products</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{product.season}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-semibold">${product.price}{product.unit}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition">
                Shop from Farm
              </button>
            </div>
          </div>
        )}
        
        {/* Sustainability Tab Content */}
        {activeTab === 'sustainability' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Sustainability Practices</h2>
            <p className="text-gray-700 mb-4">
              At {farm.name}, sustainability is at the core of everything we do. We implement regenerative 
              farming practices that improve soil health, conserve water, and promote biodiversity.
            </p>
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Organic Certification</h3>
                <p className="text-green-700">We maintain USDA Organic certification, avoiding synthetic pesticides and fertilizers.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Water Conservation</h3>
                <p className="text-green-700">Our drip irrigation systems and water recycling practices reduce water usage by 60%.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Renewable Energy</h3>
                <p className="text-green-700">Solar panels provide 75% of our energy needs, minimizing our carbon footprint.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmDetailPage;