import React from 'react';
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
];

const Marketplace: React.FC = () => {
  const handleAddToCart = (product: Product) => {
    console.log('Added to cart:', product);
  };

  const handleToggleWishlist = (product: Product) => {
    console.log('Toggled wishlist:', product);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Marketplace</h1>
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
  );
};

export default Marketplace;