// src/components/PaymentVerification.tsx
import React, { useState } from "react";
import { DollarSign, Check, CreditCard, Loader2 } from "lucide-react";
import axios from "../contexts/axioConfig";
import { useNavigate } from "react-router-dom";

interface PaymentVerificationProps {
  orderId: string;
  paymentMethod: string;
  amount: string;
  onVerify: (result: { orderId: string; newStatus: string; amount: string }) => void;
  initialVerified?: boolean;
}

const PaymentVerification: React.FC<PaymentVerificationProps> = ({
  orderId,
  paymentMethod,
  amount,
  onVerify,
  initialVerified = false,
}) => {
  const [isVerified, setIsVerified] = useState(initialVerified);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `/api/orders/${orderId}/verify-payment/`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.verified) {
        setIsVerified(true);
        onVerify({
          orderId,
          newStatus: response.data.status,
          amount: response.data.amount
        });
      } else {
        setError("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      setError("Failed to verify payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Order #{orderId}</h2>
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            isVerified
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {isVerified ? "Verified" : "Pending"}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="font-medium">{paymentMethod}</p>
          </div>
        </div>

        <div className="flex items-center">
          <DollarSign className="w-5 h-5 text-gray-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="font-medium">${amount}</p>
          </div>
        </div>

        {error && (
          <div className="p-2 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        {!isVerified ? (
          <button
            onClick={verifyPayment}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
              isLoading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Payment"
            )}
          </button>
        ) : (
          <div className="flex flex-col items-center p-4 bg-green-50 rounded-md">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Payment Verified
              </span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Verified on {new Date().toLocaleString()}
            </p>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() => navigate("/payments-to-verify")}
            className="flex-1 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(`/orders/${orderId}`)}
            className="flex-1 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            View Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;