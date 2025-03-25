import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../contexts/AuthContext';
import ProductCard from '../pages/ProductCard';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addedProductIds, setAddedProductIds] = useState<string[]>([]);

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
    // Add to cart logic here
    setAddedProductIds(prev => [...prev, product.id]); // Persist the added state
  };

  const handleToggleWishlist = (product: Product) => {
    console.log('Wishlist toggled:', product);
    // Implement wishlist logic
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
              onToggleWishlist={handleToggleWishlist}
              isAddedToCart={addedProductIds.includes(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;