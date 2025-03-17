import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Organic Tomatoes',
    farm: "Miller's Family Farm",
    price: 4.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1546470427-1ec0a9b0be9b',
    category: 'Vegetables',
    description: 'Fresh, locally grown organic tomatoes',
    isOrganic: true,
    inStock: true,
    localDelivery: true
  },
  {
    id: '2',
    name: 'Farm Fresh Eggs',
    farm: 'Happy Hens Farm',
    price: 6.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1569288052389-dac9b0ac7c4a',
    category: 'Dairy & Eggs',
    description: 'Free-range eggs from happy hens',
    isOrganic: true,
    inStock: true,
    localDelivery: true
  },
  // Add more sample products as needed
];

const ProductsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    organicOnly: false,
    inStock: false,
    localDelivery: false
  });

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
          {SAMPLE_PRODUCTS.map(product => (
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