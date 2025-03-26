import React, { useState } from 'react';
import { CreditCard, MapPin, Package, Truck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [] as CartItem[], clearCart } = useCart();
  
  // Use cartItems from location state if available, otherwise from context
  const items = location.state?.cartItems || cartItems;

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'paypal'>('credit');
  const [formErrors, setFormErrors] = useState<Partial<ShippingDetails>>({});

  const subtotal = items.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  const validateForm = () => {
    const errors: Partial<ShippingDetails> = {};
    
    if (!shippingDetails.firstName) errors.firstName = 'First name is required';
    if (!shippingDetails.lastName) errors.lastName = 'Last name is required';
    if (!shippingDetails.email || !/\S+@\S+\.\S+/.test(shippingDetails.email)) {
      errors.email = 'Valid email is required';
    }
    if (!shippingDetails.address) errors.address = 'Address is required';
    if (!shippingDetails.city) errors.city = 'City is required';
    if (!shippingDetails.state) errors.state = 'State is required';
    if (!shippingDetails.zipCode) errors.zipCode = 'Zip code is required';
    if (!shippingDetails.phone) errors.phone = 'Phone number is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate order processing
      console.log('Order submitted:', { shippingDetails, items });
      
      // Show order confirmation (you'd typically redirect to an order confirmation page)
      alert('Order placed successfully!');
      
      // Clear cart and redirect to home or order confirmation
      clearCart();
      navigate('/order-confirmation');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Details */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="mr-3 text-green-600" size={24} />
              Shipping Details
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form fields remain the same */}
              {/* ... */}
            </form>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CreditCard className="mr-3 text-green-600" size={24} />
                Payment Method
              </h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => setPaymentMethod('credit')}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    paymentMethod === 'credit' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <CreditCard className="mr-2" size={20} /> Credit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    paymentMethod === 'paypal' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Package className="mr-2" size={20} /> PayPal
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Truck className="mr-3 text-green-600" size={24} />
              Order Summary
            </h2>
            <div className="space-y-4">
              {items.map((item: CartItem) => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img 
                      src={item.product.image || 'https://via.placeholder.com/50'}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} • ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 mt-4"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;