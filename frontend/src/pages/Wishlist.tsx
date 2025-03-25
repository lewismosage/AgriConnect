import React from 'react';
import { Heart, ShoppingCart, Trash2, Check, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Product } from '../contexts/AuthContext';
import { useState } from 'react';

interface WishlistProps {
  onAddToCart?: (product: Product) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ 
  onAddToCart 
}) => {
  const { wishlistItems, toggleWishlist, addToCart, cartItems } = useCart();
  const [sortOption, setSortOption] = useState<'price-asc' | 'price-desc' | 'name'>('name');

  // Check if product is already in cart
  const isInCart = (productId: string) => {
    return cartItems.some(item => item.product.id === productId);
  };

  // Handle default add to cart if not provided
  const handleAddToCart = onAddToCart || ((product: Product) => {
    addToCart(product);
  });

  // Sorting logic
  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch(sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Heart className="mr-2 text-red-500" />
          My Wishlist
          <span className="ml-2 text-sm text-gray-500">({wishlistItems.length} items)</span>
        </h2>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-xs text-gray-600">Sort by:</label>
          <select 
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="border rounded px-2 py-1 text-xs"
          >
            <option value="name">Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Heart className="mx-auto mb-3 w-10 h-10 text-gray-300" />
          <p className="text-sm">Your wishlist is empty</p>
          <p className="text-xs">Start adding items you love!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedItems.map((product) => {
            const addedToCart = isInCart(product.id);
            
            return (
              <div 
                key={product.id} 
                className="border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="relative">
                  <img 
                    src={product.image || 'https://via.placeholder.com/300'} 
                    alt={product.name} 
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300';
                    }}
                  />
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-white"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                
                <div className="p-3">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{product.name}</h3>
                    <span className="text-green-600 font-medium text-sm">${product.price.toFixed(2)}</span>
                  </div>
                  
                  {product.farm?.name && (
                    <p className="text-xs text-gray-500 mb-1 line-clamp-1">{product.farm.name}</p>
                  )}
                  
                  <div className="flex items-center mb-1">
                    {product.farm?.rating && (
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`w-3 h-3 ${i < (product.farm?.rating ? Math.round(product.farm.rating) : 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => !addedToCart && handleAddToCart(product)}
                    disabled={addedToCart}
                    className={`w-full flex items-center justify-center py-1 px-2 rounded-lg text-sm mt-2 ${
                      addedToCart
                        ? 'bg-green-50 text-green-600 border border-green-200 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="mr-1 w-4 h-4 text-green-600" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-1 w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;