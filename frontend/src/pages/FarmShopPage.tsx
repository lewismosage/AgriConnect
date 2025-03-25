import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react'; // Added missing imports
import { Product } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

// Extend the Product interface to include the unit property
interface FarmProduct extends Product {
  unit: string;
}

const FarmShopPage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
  
  // Get farm name and products from navigation state
  const { farmName, products } = location.state as {
    farmName: string;
    products: FarmProduct[]; // Use the extended interface
  };

  // Calculate total items from this farm in the main cart
  const farmItemsCount = cartItems
    .filter(item => item.product.farm.id === farmId)
    .reduce((sum, item) => sum + item.quantity, 0);

  const getProductQuantity = (productId: string) => {
    const item = cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to farm
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Shop from {farmName}</h1>
            <div className="relative">
              
              {farmItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {farmItemsCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Products List */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Available Products</h2>
            
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No products available from this farm at the moment.
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => {
                  const quantity = getProductQuantity(product.id);
                  return (
                    <div key={product.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-16 h-16 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                            }}
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                          <p className="text-gray-600 text-sm">{product.description}</p>
                          <div className="mt-1 text-green-600 font-semibold">
                            ${product.price} {product.unit && `/ ${product.unit}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            if (quantity > 1) {
                              updateQuantity(product.id, quantity - 1);
                            } else {
                              removeFromCart(product.id);
                            }
                          }}
                          disabled={quantity === 0}
                          className={`p-1 rounded-full ${quantity > 0 ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400'}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">
                          {quantity}
                        </span>
                        <button 
                          onClick={() => addToCart(product)}
                          className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmShopPage;