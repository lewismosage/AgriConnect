import React from 'react';
import { Heart, Check, Star } from 'lucide-react';
import { Product } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isAddedToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist = () => {},
  isAddedToCart = false
}) => {
  const { wishlistItems, toggleWishlist } = useCart();
  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    onToggleWishlist(product);
  };

  const handleAddToCart = () => {
    if (!isAddedToCart) {
      onAddToCart(product);
    }
  };

  // Get the rating from product.farm.rating or default to 0
  const rating = product.farm?.rating || 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300';
          }}
        />
        {product.isOrganic && (
          <span className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Organic
          </span>
        )}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <Heart 
            size={20} 
            className={isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'} 
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        {product.farm?.name && (
          <p className="text-sm text-gray-600 mb-2">{product.farm.name}</p>
        )}
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-1 text-sm text-gray-600">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isAddedToCart}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isAddedToCart 
                ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'
            }`}
          >
            {isAddedToCart ? (
              <>
                <Check size={18} className="text-green-600" />
                <span>Added</span>
              </>
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;