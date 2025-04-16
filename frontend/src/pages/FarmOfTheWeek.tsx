import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, Farm } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface FarmOfTheWeekProps {
  products: Product[];
  onViewAll: (sectionName: string, items: Product[], farmImage?: string) => void;
  onAddToCart: (product: Product) => void;
}

const FarmOfTheWeek: React.FC<FarmOfTheWeekProps> = ({ products, onViewAll, onAddToCart }) => {
  const [farmOfTheWeek, setFarmOfTheWeek] = useState<Product[]>([]);
  const [farmImage, setFarmImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { cartItems } = useCart();

  useEffect(() => {
    if (!products.length) return;

    // Group products by farm
    const farmGroups = products.reduce((acc, product) => {
      if (!acc[product.farm.id]) {
        acc[product.farm.id] = { farm: product.farm, products: [] };
      }
      acc[product.farm.id].products.push(product);
      return acc;
    }, {} as Record<string, { farm: Farm, products: Product[] }>);

    const farms = Object.values(farmGroups);
    const selectedFarm = farms[Math.floor(Math.random() * farms.length)];
    setFarmOfTheWeek(selectedFarm?.products || []);

    // Fetch farm image if available
    const fetchFarmImage = async () => {
      try {
        const response = await axios.get(`/api/farms/${selectedFarm.farm.id}/`);
        const farmData = response.data;
        
        // Handle the image URL properly as in FarmDetailPage
        const getImageUrl = (img: string | null | undefined) => {
          if (!img) return '/placeholder-farm.jpg';
          return img.startsWith('http') ? img : `${import.meta.env.VITE_BACKEND_URL}${img}`;
        };
        
        // Use farm_image if available, otherwise fall back to image
        const imageUrl = getImageUrl(farmData.farm_image || farmData.image);
        setFarmImage(imageUrl);
      } catch (error) {
        console.error('Failed to fetch farm image:', error);
        setFarmImage('/placeholder-farm.jpg');
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedFarm) {
      fetchFarmImage();
    } else {
      setIsLoading(false);
    }
  }, [products]);

  if (isLoading || !farmOfTheWeek.length) return null;

  const farm = farmOfTheWeek[0].farm;

  // Pass the farmImage to onViewAll when clicking the View All button
  const handleViewAll = () => {
    onViewAll(`Farm: ${farm.name}`, farmOfTheWeek, farmImage);
  };

  return (
    <div className="mb-12 bg-amber-50 rounded-2xl overflow-hidden shadow-md">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-amber-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 ml-3">Farm of the Week</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="aspect-square bg-amber-200 rounded-lg overflow-hidden">
              <img 
                src={farmImage} 
                alt={farm.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-farm.jpg';
                }}
              />
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-gray-900">{farm.name}</h3>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(farm.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">{farm.rating?.toFixed(1) || '0.0'}</span>
              </div>
              <p className="text-gray-600 mt-2">{farm.location}</p>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <div className="flex justify-between items-end mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Products from {farm.name}</h4>
              {farmOfTheWeek.length > 3 && (
                <button 
                  onClick={handleViewAll}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View All
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {farmOfTheWeek.slice(0, 3).map(product => {
                // Also handle product images the same way
                const productImage = product.image 
                  ? product.image.startsWith('http') 
                    ? product.image 
                    : `${import.meta.env.VITE_BACKEND_URL}${product.image}`
                  : '/placeholder-product.jpg';
                
                return (
                  <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-32 mb-3 overflow-hidden rounded-md">
                      <img 
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>
                    <h5 className="font-medium text-gray-900">{product.name}</h5>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => onAddToCart(product)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmOfTheWeek;