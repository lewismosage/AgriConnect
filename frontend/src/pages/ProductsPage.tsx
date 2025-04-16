import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Product, Farm } from '../contexts/AuthContext';
import ProductCard from '../pages/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

// Helper function to get random items from an array
const getRandomItems = <T,>(arr: T[], num: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  // Track recently shown products to avoid repetition
  const [recentlyShown, setRecentlyShown] = useState<string[]>(() => {
    const stored = localStorage.getItem('lastShown');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/');
        const formattedProducts = response.data.map((product: any) => ({
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          farm: {
            ...product.farm,
            rating: product.farm.rating || 0
          }
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    
    // Set up a timer to refresh sections every 10 minutes
    const refreshTimer = setInterval(() => {
      setLastRefresh(Date.now());
    }, 10 * 60 * 1000);
    
    return () => clearInterval(refreshTimer);
  }, []);

  // Store shown products in localStorage
  useEffect(() => {
    if (recentlyShown.length > 0) {
      localStorage.setItem('lastShown', JSON.stringify(recentlyShown));
    }
  }, [recentlyShown]);

  // Creating our product pools - recalculated when products change or refresh happens
  const {
    mostSearched,
    topRated,
    newlyAdded,
    farmOfTheWeek,
    featuredProducts,
    seasonalPicks
  } = useMemo(() => {
    if (!products.length) return {
      mostSearched: [],
      topRated: [],
      newlyAdded: [],
      farmOfTheWeek: [],
      featuredProducts: [],
      seasonalPicks: []
    };

    // Avoid showing recently displayed products
    const filteredProducts = products.filter(p => !recentlyShown.includes(p.id));
    
    // Create product pools - in a real implementation you'd have proper metrics for these
    const sortedByRating = [...products].sort((a, b) => 
      (b.rating || 0) - (a.rating || 0));
    
    // Simulate "new" products by using the first few items
    const newProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 12);
    
    // Group products by farm to create farm of the week
    const farmGroups = products.reduce((acc, product) => {
      if (!acc[product.farm.id]) {
        acc[product.farm.id] = { farm: product.farm, products: [] };
      }
      acc[product.farm.id].products.push(product);
      return acc;
    }, {} as Record<string, { farm: Farm, products: Product[] }>);
    
    const farms = Object.values(farmGroups);
    const selectedFarm = farms[Math.floor(Math.random() * farms.length)];
    
    return {
      mostSearched: getRandomItems(filteredProducts, 8),
      topRated: sortedByRating.slice(0, 8),
      newlyAdded: newProducts,
      farmOfTheWeek: selectedFarm?.products || [],
      featuredProducts: getRandomItems(filteredProducts, 4),
      seasonalPicks: getRandomItems(filteredProducts, 6)
    };
  }, [products, lastRefresh, recentlyShown]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // Add to recently shown
    setRecentlyShown(prev => {
      const updated = [...prev, product.id];
      // Keep only the last 20 products
      return updated.slice(-20);
    });
  };

  const handleToggleWishlist = (product: Product) => {
    // Implement wishlist logic
  };

  const handleViewAll = (sectionName: string, items: Product[]) => {
    // Save the section items to session storage
    sessionStorage.setItem('viewAllProducts', JSON.stringify(items));
    sessionStorage.setItem('viewAllTitle', sectionName);
    // Navigate to view all page or toggle expanded view
    setActiveSection(activeSection === sectionName ? null : sectionName);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const renderProductSection = (title: string, items: Product[], subtitle?: string) => {
    if (!items.length) return null;
    
    const isExpanded = activeSection === title;
    const displayItems = isExpanded ? items : items.slice(0, 4);
    
    return (
      <div className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <button 
            onClick={() => handleViewAll(title, items)}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            {isExpanded ? 'Show Less' : 'View All'}
          </button>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isExpanded ? '' : ''}`}>
          {displayItems.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isAddedToCart={cartItems.some(item => item.product.id === product.id)}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderHeroSection = () => {
    const heroProduct = featuredProducts[0];
    if (!heroProduct) return null;

    return (
      <div className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl overflow-hidden shadow-lg">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <span className="text-green-600 font-medium mb-2">Featured Product</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{heroProduct.name}</h1>
            <p className="text-gray-600 mb-6">{heroProduct.description?.substring(0, 120)}...</p>
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-gray-900">${heroProduct.price.toFixed(2)}</span>
              <span className="ml-2 text-sm text-gray-500">from {heroProduct.farm.name}</span>
            </div>
            <button 
              onClick={() => handleAddToCart(heroProduct)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 w-full sm:w-auto"
            >
              Add to Cart
            </button>
          </div>
          <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={heroProduct.image || '/placeholder-product.jpg'} 
                alt={heroProduct.name} 
                className="object-contain w-full h-full max-h-96"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFarmOfWeek = () => {
    if (!farmOfTheWeek.length) return null;
    const farm = farmOfTheWeek[0].farm;
    
    // Get farm image - check multiple possible locations for the image
    const getFarmImageUrl = () => {
      // Check if the farm object has an image property directly
      if (farm.image) {
        return farm.image.startsWith('http') ? farm.image : `${import.meta.env.VITE_BACKEND_URL}${farm.image}`;
      }
      // Check if the farm object has a farm_image property
      if (farm.farm_image) {
        return farm.farm_image.startsWith('http') ? farm.farm_image : `${import.meta.env.VITE_BACKEND_URL}${farm.farm_image}`;
      }
      // Fallback to placeholder
      return '/placeholder-farm.jpg';
    };
  
    const farmImage = getFarmImageUrl();
    
    // Debugging: Log the farm object and image URL
    console.log('Farm object:', farm);
    console.log('Farm image URL:', farmImage);
    
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
                    // Fallback if image doesn't load
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
                  <span className="ml-1 text-sm text-gray-600">{farm.rating.toFixed(1)}</span>
                </div>
                <p className="text-gray-600 mt-2">{farm.location}</p>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="flex justify-between items-end mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Products from {farm.name}</h4>
                {farmOfTheWeek.length > 3 && (
                  <button 
                    onClick={() => handleViewAll(`Farm: ${farm.name}`, farmOfTheWeek)}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    {activeSection === `Farm: ${farm.name}` ? 'Show Less' : 'View All'}
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(activeSection === `Farm: ${farm.name}` ? farmOfTheWeek : farmOfTheWeek.slice(0, 3))
                  .map(product => (
                    <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="h-32 mb-3 overflow-hidden rounded-md">
                        <img 
                          src={product.image || '/placeholder-product.jpg'}
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
                          onClick={() => handleAddToCart(product)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Create a View All Products component that renders when activeSection is set
  const renderViewAllProducts = () => {
    if (!activeSection) return null;
    
    let productsToShow: Product[] = [];
    
    if (activeSection === 'Top Rated Products') {
      productsToShow = topRated;
    } else if (activeSection === 'Just Added') {
      productsToShow = newlyAdded;
    } else if (activeSection === 'Popular Picks') {
      productsToShow = mostSearched;
    } else if (activeSection === 'Seasonal Favorites') {
      productsToShow = seasonalPicks;
    } else if (activeSection.startsWith('Farm:')) {
      productsToShow = farmOfTheWeek;
    }
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" 
           onClick={() => setActiveSection(null)}>
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-screen overflow-auto p-6"
             onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{activeSection}</h2>
            <button onClick={() => setActiveSection(null)} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productsToShow.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isAddedToCart={cartItems.some(item => item.product.id === product.id)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderHeroSection()}
        
        {/* Top Rated Products */}
        {renderProductSection('Top Rated Products', topRated, 'Highly rated by our customers')}
        
        {/* Farm of the Week */}
        {renderFarmOfWeek()}
        
        {/* Newly Added */}
        {renderProductSection('Just Added', newlyAdded, 'Fresh from our farmers')}
        
        {/* Most Searched */}
        {renderProductSection('Popular Picks', mostSearched, 'What others are looking for')}
        
        {/* Seasonal Picks */}
        {renderProductSection('Seasonal Favorites', seasonalPicks, 'Perfect for this time of year')}
        
        {/* Visual divider with call to action */}
        <div className="my-16 py-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Support Local Farmers</h2>
          <p className="max-w-2xl mx-auto mb-6">Every purchase directly supports local agriculture and sustainable farming practices.</p>
          <button className="bg-white text-green-700 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition duration-300">
            Learn More About Our Farms
          </button>
        </div>
      </div>
      
      {/* Modal for "View All" */}
      {renderViewAllProducts()}
    </div>
  );
};

export default ProductsPage;