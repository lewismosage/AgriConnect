import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import ShippingInformation from './ShippingInformation';
import PaymentInformation from './PaymentInformation';
import { Truck, Check, X } from 'lucide-react';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <p className="mt-2 text-gray-600">{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

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

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Modal state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const subtotal = items.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  const generateOrderNumber = () => {
    // Generate a random 8-digit order number
    return 'ORD-' + Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that an address and payment method are selected
    if (!shippingDetails.selectedAddressId) {
      showAlert('Missing Information', 'Please select a shipping address');
      return;
    }
    
    if (!paymentDetails.selectedMethodId) {
      showAlert('Missing Information', 'Please select a payment method');
      return;
    }
  
    try {
      // Prepare order data
      const orderData = {
        farm: items[0].product.farm.id, // Assuming all items are from the same farm
        shipping_address: shippingDetails.selectedAddressId, // Corrected to use selectedAddressId
        payment_method: paymentDetails.selectedMethodId,   // Corrected to use selectedMethodId
        items: items.map((item: CartItem) => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };
  
      // Send to backend
      const response = await fetch('/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(orderData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
  
      const order = await response.json();
      setOrderNumber(order.order_number);
      setOrderPlaced(true);
      clearCart();
      
    } catch (error) {
      showAlert('Error', 'Failed to place order. Please try again.');
      console.error(error);
    }

    // Generate order number
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);

    // Simulate order processing
    console.log('Order submitted:', { 
      orderNumber: newOrderNumber,
      shippingDetails, 
      paymentDetails, 
      items 
    });
    
    // Set order as placed
    setOrderPlaced(true);
    
    // Clear cart
    clearCart();

    // After generating the order number
    const newOrder = {
      id: Date.now().toString(),
      orderNumber: newOrderNumber,
      date: new Date().toISOString(),
      items,
      shippingAddress: 'Your selected address', // Replace with actual address
      paymentMethod: 'Your selected method',   // Replace with actual method
      subtotal,
      shipping,
      tax,
      total,
      status: 'Processing'
    };

    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('agriConnectOrders') || '[]');
    localStorage.setItem('agriConnectOrders', JSON.stringify([newOrder, ...existingOrders]));
  };

  const renderSuccessScreen = () => (
    <div className="text-center py-12">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-gray-900">Order Placed Successfully!</h2>
      <p className="mt-2 text-lg text-gray-500">
        Thank you for your order with AgriConnect.
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Your order number is: <span className="font-semibold">{orderNumber}</span>
      </p>
      <p className="mt-2 text-gray-500">
        We've sent a confirmation email with your order details.
      </p>
      <div className="mt-8">
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );

  if (orderPlaced) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderSuccessScreen()}
        </div>
      </div>
    );
  }

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

      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </div>
  );
};

export default CheckoutPage;