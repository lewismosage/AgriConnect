// src/components/PaymentVerification.tsx
import React, { useState } from 'react';
import { DollarSign, Check, X } from 'lucide-react';
import axios from '../contexts/axioConfig';

interface PaymentVerificationProps {
  orderId: string;
  paymentMethod: string;
  amount: string;
  onVerify: (verified: boolean) => void;
}

const PaymentVerification: React.FC<PaymentVerificationProps> = ({ 
  orderId, 
  paymentMethod, 
  amount,
  onVerify 
}) => {
  const [isVerified, setIsVerified] = useState(false);

  const verifyPayment = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}/verify-payment/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setIsVerified(true);
      onVerify(true);
    } catch (error) {
      console.error('Payment verification failed:', error);
      onVerify(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`p-2 rounded-full ${
        isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {isVerified ? <Check className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
      </div>
      <div>
        <p className="text-sm font-medium">
          {isVerified ? 'Payment Verified' : 'Verify Payment'}
        </p>
        <p className="text-xs text-gray-500">
          {paymentMethod} • ${amount}
        </p>
      </div>
      {!isVerified && (
        <button 
          onClick={verifyPayment}
          className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
        >
          Verify
        </button>
      )}
    </div>
  );
};

export default PaymentVerification;