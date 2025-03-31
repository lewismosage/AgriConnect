// src/pages/PaymentVerificationPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PaymentVerification from "../components/PaymentVerification";
import axios from "../contexts/axioConfig";

interface VerificationResult {
  orderId: string;
  newStatus: string;
  amount: string;
}

const PaymentVerificationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrder(response.data);
        setIsVerified(response.data.status === "verified" || response.data.is_verified);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleVerification = (result: VerificationResult) => {
    navigate(`/payments-to-verify`, {
      state: {
        verifiedOrderId: result.orderId,
        newStatus: result.newStatus,
      },
    });
  };

  if (loading) return <div className="p-6">Loading order details...</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  return (
    <div className="container mx-auto p-6">
      <PaymentVerification
        orderId={orderId || ""}
        paymentMethod={order.payment_method}
        amount={order.total}
        onVerify={handleVerification}
        initialVerified={isVerified}
      />
    </div>
  );
};

export default PaymentVerificationPage;