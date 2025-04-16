import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Product } from '../contexts/AuthContext';
import ProductCard from '../pages/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import FarmOfTheWeek from '../pages/FarmOfTheWeek';
import { Link } from 'react-router-dom';

const getRandomItems = <T,>(arr: T[], num: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [modalProducts, setModalProducts] = useState<Product[]>([]);
  const [modalFarmImage, setModalFarmImage] = useState<string>('');
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

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
    
    const refreshTimer = setInterval(() => {
      setLastRefresh(Date.now());
    }, 10 * 60 * 1000);
    
    return () => clearInterval(refreshTimer);
  }, []);

  useEffect(() => {
    if (recentlyShown.length > 0) {
      localStorage.setItem('lastShown', JSON.stringify(recentlyShown));
    }
  }, [recentlyShown]);

  const {
    mostSearched,
    topRated,
    newlyAdded,
    featuredProducts,
    seasonalPicks
  } = useMemo(() => {
    if (!products.length) return {
      mostSearched: [],
      topRated: [],
      newlyAdded: [],
      featuredProducts: [],
      seasonalPicks: []
    };

    const filteredProducts = products.filter(p => !recentlyShown.includes(p.id));
    const sortedByRating = [...products].sort((a, b) => 
      (b.rating || 0) - (a.rating || 0));
    const newProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 12);
    
    return {
      mostSearched: getRandomItems(filteredProducts, 8),
      topRated: sortedByRating.slice(0, 8),
      newlyAdded: newProducts,
      featuredProducts: getRandomItems(filteredProducts, 4),
      seasonalPicks: getRandomItems(filteredProducts, 6)
    };
  }, [products, lastRefresh, recentlyShown]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setRecentlyShown(prev => [...prev.slice(-19), product.id]);
  };

  const handleViewAll = (sectionName: string, items: Product[], farmImage?: string) => {
    setModalProducts(items);
    setActiveSection(activeSection === sectionName ? null : sectionName);
    
    // Save the farm image if provided
    if (farmImage) {
      setModalFarmImage(farmImage);
    } else {
      setModalFarmImage('');
    }
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
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`}>
          {displayItems.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
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
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderViewAllProducts = () => {
    if (!activeSection) return null;
    
    // We now use modalProducts directly, which contains the products we want to show
    const productsToShow = modalProducts;
    const isFarmSection = activeSection.startsWith('Farm:');
    
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
          
          {isFarmSection && productsToShow.length > 0 && (
            <div className="mb-4 p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center">
                <div className="mr-4">
                  <img 
                    src={modalFarmImage || '/placeholder-farm.jpg'} 
                    alt={productsToShow[0].farm.name}
                    className="w-16 h-16 object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-farm.jpg';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{productsToShow[0].farm.name}</h3>
                  <p className="text-sm text-gray-600">{productsToShow[0].farm.location}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productsToShow.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
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
        {renderProductSection('Top Rated Products', topRated, 'Highly rated by our customers')}
        <FarmOfTheWeek products={products} onViewAll={handleViewAll} onAddToCart={handleAddToCart} />
        {renderProductSection('Just Added', newlyAdded, 'Fresh from our farmers')}
        {renderProductSection('Popular Picks', mostSearched, 'What others are looking for')}
        {renderProductSection('Seasonal Favorites', seasonalPicks, 'Perfect for this time of year')}
        
        <div className="my-16 py-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Support Local Farmers</h2>
        <p className="max-w-2xl mx-auto mb-6">Every purchase directly supports local agriculture and sustainable farming practices.</p>
        <Link to="/about" className="inline-block bg-white text-green-700 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition duration-300">
          Learn More About Our Farms
        </Link>
      </div>
      </div>
      
      {renderViewAllProducts()}
    </div>
  );
};

export default ProductsPage;