// src/pages/PaymentsToVerifyPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../contexts/axioConfig";
import { DollarSign, CreditCard, Check, Clock, List } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  total: string;
  created_at: string;
  customer: {
    first_name: string;
    last_name: string;
  };
  verified_at?: string;
}

interface VerificationResult {
  orderId: string;
  newStatus: string;
  amount: string;
}

const PaymentsToVerifyPage = () => {
  const [orders, setOrders] = useState<{
    pending: Order[];
    verified: Order[];
  }>({ pending: [], verified: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "verified">("pending");
  const navigate = useNavigate();

  const fetchPayments = async (status: "pending" | "verified") => {
    try {
      const response = await axios.get(
        `/api/orders/payments-to-verify/?status=${status}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        const [pending, verified] = await Promise.all([
          fetchPayments("pending"),
          fetchPayments("verified"),
        ]);
        setOrders({ pending, verified });
      } catch (error) {
        console.error("Error loading payments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const handlePaymentVerified = (result: VerificationResult) => {
    setOrders((prev) => {
      // Find and remove the verified order from pending
      const verifiedOrderIndex = prev.pending.findIndex(
        (o) => o.id.toString() === result.orderId
      );
      if (verifiedOrderIndex === -1) return prev;

      const verifiedOrder = prev.pending[verifiedOrderIndex];
      const updatedPending = [...prev.pending];
      updatedPending.splice(verifiedOrderIndex, 1);

      // Add to verified list with updated status
      return {
        pending: updatedPending,
        verified: [
          {
            ...verifiedOrder,
            status: result.newStatus,
            verified_at: new Date().toISOString(),
          },
          ...prev.verified,
        ],
      };
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentOrders =
    activeTab === "pending" ? orders.pending : orders.verified;

    if (loading) 
      return (
        <div className="p-6 flex justify-center items-center">
          <div className="spinner"></div>
        </div>
      );    

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Management</h1>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "pending"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Pending Verification
            {orders.pending.length > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {orders.pending.length}
              </span>
            )}
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "verified"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("verified")}
        >
          <div className="flex items-center">
            <Check className="w-4 h-4 mr-2" />
            Verified Payments
            {orders.verified.length > 0 && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {orders.verified.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {currentOrders.length === 0 ? (
        <div className="bg-green-50 p-4 rounded-md">
          <p>
            {activeTab === "pending"
              ? "No payments require verification at this time."
              : "No verified payments found."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Order #{order.order_number}</h3>
                  <p className="text-sm text-gray-500">
                    Customer: {order.customer.first_name}{" "}
                    {order.customer.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {formatDate(order.created_at)}
                  </p>
                  {order.verified_at && (
                    <p className="text-sm text-green-600">
                      Verified: {formatDate(order.verified_at)}
                    </p>
                  )}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {order.status}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm">{order.payment_method}</span>
                </div>
                <div className="font-medium">${order.total}</div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                {activeTab === "pending" ? (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/payment-verification/${order.id}`)
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Verify Payment
                    </button>
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      View Order
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsToVerifyPage;