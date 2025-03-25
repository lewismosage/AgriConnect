import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import {Product} from './../pages/FarmDetailPage';

const FarmShopPage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get farm name and products from navigation state
  const { farmName, products } = location.state as {
    farmName: string;
    products: Product[];
  };

  // State for cart items
  const [cart, setCart] = useState<Record<string, { product: Product; quantity: number }>>({});

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart(prev => ({
      ...prev,
      [product.id]: {
        product,
        quantity: prev[product.id] ? prev[product.id].quantity + 1 : 1
      }
    }));
  };

  // Remove product from cart or decrease quantity
  const removeFromCart = (productId: string) => {
    setCart(prev => {
      if (!prev[productId]) return prev;
      
      if (prev[productId].quantity === 1) {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      }
      
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: prev[productId].quantity - 1
        }
      };
    });
  };

  // Calculate total items in cart
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  const totalPrice = Object.values(cart).reduce((sum, item) => {
    return sum + (parseFloat(item.product.price) * item.quantity);
  }, 0);

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
              <button 
                className="flex items-center text-gray-600 hover:text-gray-900"
                onClick={() => navigate('/cart')} // You might want to implement this route
              >
                <ShoppingCart className="w-5 h-5 mr-1" />
                Cart ({totalItems})
              </button>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Products List */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Available Products</h2>
            
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No products available from this farm at the moment.
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                        <div className="mt-1 text-green-600 font-semibold">
                          ${product.price} / {product.unit}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => removeFromCart(product.id)}
                        disabled={!cart[product.id]}
                        className={`p-1 rounded-full ${cart[product.id] ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400'}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">
                        {cart[product.id]?.quantity || 0}
                      </span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Your Order</h2>
              
              {totalItems === 0 ? (
                <p className="text-gray-500 text-sm">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {Object.values(cart).map(item => (
                      <div key={item.product.id} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.product.name}</span>
                          <span className="text-gray-500 text-sm ml-2">
                            {item.quantity} × ${item.product.price}
                          </span>
                        </div>
                        <div className="font-medium">
                          ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
                    onClick={() => {
                      // Here you would typically proceed to checkout
                      // For now, we'll just show an alert
                      alert('Proceeding to checkout!');
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmShopPage;