import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';
import { Product } from '../contexts/AuthContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const renderRatingStars = () => {
    if (!product.farm.rating) return null;
    
    const stars = [];
    const roundedRating = Math.round(product.farm.rating * 2) / 2; // Round to nearest 0.5

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i}
          className={`w-4 h-4 ${i <= roundedRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }

    return (
      <div className="flex items-center mt-1">
        <div className="flex mr-1">
          {stars}
        </div>
        <span className="text-xs text-gray-500">
          {product.farm.name}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="h-48 w-full relative">
        <img
          src={product.image || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        {renderRatingStars()}
        <div className="flex justify-between items-center mt-2">
          <span className="text-green-600 font-semibold">${product.price.toFixed(2)}</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  const handleAddToCart = (product: Product) => {
    console.log('Added to cart:', product);
    // Implement your cart logic here
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Fresh Local Products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;