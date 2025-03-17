import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { Link } from 'react-router-dom';

const SAMPLE_CART_ITEMS: CartItem[] = [
  {
    product: {
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
    quantity: 2
  }
];

const CartPage: React.FC = () => {
  const subtotal = SAMPLE_CART_ITEMS.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {SAMPLE_CART_ITEMS.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {SAMPLE_CART_ITEMS.map(item => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-lg shadow-md p-6 mb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="ml-6 flex-1">
                      <h3 className="text-lg font-semibold">{item.product.name}</h3>
                      <p className="text-gray-600">{item.product.farm}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <button className="text-gray-500 hover:text-gray-700">
                            <Trash2 size={20} />
                          </button>
                          <div className="mx-4">
                            <select
                              value={item.quantity}
                              onChange={() => {}}
                              className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                              {[1, 2, 3, 4, 5].map(num => (
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
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300">
                  Proceed to Checkout
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