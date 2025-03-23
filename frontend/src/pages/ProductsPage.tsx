import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from './../pages/ProductCard';
import { Product } from './../contexts/AuthContext';
import axios from 'axios';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    organicOnly: false,
    inStock: false,
    localDelivery: false
  });

  // Fetch all products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/');
        
        // Ensure price is a number
        const products = response.data.map((product: Product) => ({
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price, // Convert price to a number
        }));
    
        setProducts(products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    // Implement cart functionality
    console.log('Added to cart:', product);
  };

  const handleToggleWishlist = (product: Product) => {
    // Implement wishlist functionality
    console.log('Toggled wishlist:', product);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fresh Local Products</h1>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;