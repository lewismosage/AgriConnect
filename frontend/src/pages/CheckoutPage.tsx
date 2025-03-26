import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import ShippingInformation from './ShippingInformation';
import PaymentInformation from './PaymentInformation';
import { Truck } from 'lucide-react';

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

  const [shippingDetails, setShippingDetails] = useState({
    selectedAddressId: 0
  });

  const [paymentDetails, setPaymentDetails] = useState({
    selectedMethodId: 0
  });

  const subtotal = items.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that an address and payment method are selected
    if (!shippingDetails.selectedAddressId) {
      alert('Please select a shipping address');
      return;
    }
    
    if (!paymentDetails.selectedMethodId) {
      alert('Please select a payment method');
      return;
    }

    // Simulate order processing
    console.log('Order submitted:', { 
      shippingDetails, 
      paymentDetails, 
      items 
    });
    
    // Show order confirmation
    alert('Order placed successfully!');
    
    // Clear cart and redirect to order confirmation
    clearCart();
    navigate('/order-confirmation');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping and Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <ShippingInformation 
              onSelectAddress={(addressId) => 
                setShippingDetails(prev => ({
                  ...prev,
                  selectedAddressId: addressId
                }))
              }
            />
            
            {/* Payment Information */}
            <PaymentInformation 
              onSelectMethod={(methodId) => 
                setPaymentDetails(prev => ({
                  ...prev,
                  selectedMethodId: methodId
                }))
              }
            />
          </div>

          {/* Right Column - Order Summary */}
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