import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CartItem } from '../contexts/types';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  
  // Group items by farm for better organization
  const itemsByFarm = cartItems.reduce((acc, item) => {
    const farmKey = `${item.product.farm.id}-${item.product.farm.name}`;
    if (!acc[farmKey]) {
      acc[farmKey] = {
        farm: item.product.farm,
        items: []
      };
    }
    acc[farmKey].items.push(item);
    return acc;
  }, {} as Record<string, { farm: any; items: CartItem[] }>);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // Implement your checkout logic here
    console.log('Proceeding to checkout with:', cartItems);
    // clearCart(); // Uncomment if you want to clear cart after checkout
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {Object.values(itemsByFarm).map(({ farm, items }) => (
                <div key={farm.id} className="mb-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-2">
                      Farm
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold">{farm.name}</h3>
                      <p className="text-sm text-gray-600">{farm.location}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {items.map(item => (
                      <div
                        key={item.product.id}
                        className="bg-white rounded-lg shadow-md p-6 flex items-center"
                      >
                        <img
                          src={item.product.image || 'https://via.placeholder.com/80'}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                          }}
                        />
                        <div className="ml-6 flex-1">
                          <h3 className="text-lg font-semibold">{item.product.name}</h3>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                              <button 
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-gray-500 hover:text-red-500 p-1"
                                aria-label="Remove item"
                              >
                                <Trash2 size={20} />
                              </button>
                              <div className="mx-4">
                                <select
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                >
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num} value={num}>
                                      {num}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <span className="text-lg font-semibold">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full mt-2 text-red-600 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition duration-300"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some fresh local products to your cart!</p>
            <Link
              to="/products"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;