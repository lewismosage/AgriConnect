// src/pages/OrdersPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package,
  ChevronLeft,
  Check,
  X,
  Truck,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Order {
  id: string;
  order_number: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  total: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
  items: Array<{
    product: {
      name: string;
      image: string;
      price: string;
    };
    quantity: number;
  }>;
  shipping_address: string;
  payment_method: string;
}

// Type guard for order status
const isOrderStatus = (
  status: string
): status is "pending" | "processing" | "completed" | "cancelled" => {
  return ["pending", "processing", "completed", "cancelled"].includes(status);
};

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/orders/farm/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Validate the status of each order
        const validatedOrders = response.data.map((order: any) => ({
          ...order,
          status: isOrderStatus(order.status) ? order.status : "pending", // default to pending if invalid
        }));

        setOrders(validatedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.farmer_profile) {
      fetchOrders();
    }
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    // Search filter
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.first_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customer.last_name.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter ? order.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.patch(
        `/api/orders/${orderId}/status/`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as "pending" | "processing" | "completed" | "cancelled" } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <RefreshCw className="w-4 h-4" />;
      case "processing":
        return <Truck className="w-4 h-4" />;
      case "completed":
        return <Check className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={() => navigate(-1)} className="mr-4">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Orders</h1>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            Loading orders...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={() => navigate(-1)} className="mr-4">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Orders</h1>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 w-full border border-green-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-green-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-5 h-5 mr-2" />
                <span>Filters</span>
                {showFilters ? (
                  <ChevronUp className="w-5 h-5 ml-2" />
                ) : (
                  <ChevronDown className="w-5 h-5 ml-2" />
                )}
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
                  <h3 className="font-medium mb-2">Order Status</h3>
                  <div className="space-y-2">
                    {["pending", "processing", "completed", "cancelled"].map(
                      (status) => (
                        <label key={status} className="flex items-center">
                          <input
                            type="radio"
                            name="status"
                            checked={statusFilter === status}
                            onChange={() =>
                              setStatusFilter(
                                statusFilter === status ? null : status
                              )
                            }
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 capitalize">{status}</span>
                        </label>
                      )
                    )}
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        checked={statusFilter === null}
                        onChange={() => setStatusFilter(null)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-2">All Statuses</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredOrders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Package className="w-5 h-5 text-gray-500 mr-2" />
                        <h3 className="font-medium">
                          Order #{order.order_number}
                        </h3>
                        <span
                          className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(
                            order.status
                          )} flex items-center`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1">
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </span>
                      </div>

                      <div className="ml-7">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Customer:</span>{" "}
                          {order.customer.first_name} {order.customer.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Date:</span>{" "}
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Total:</span> $
                          {order.total}
                        </p>
                      </div>

                      {/* Order Items */}
                      <div className="mt-4 ml-7">
                        <h4 className="text-sm font-medium mb-2">Items:</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-start">
                              {item.product.image ? (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-10 h-10 rounded-md object-cover mr-3"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                                  <Package className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm">{item.product.name}</p>
                                <p className="text-xs text-gray-500">
                                  {item.quantity} × ${item.product.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-col items-end space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                            className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Payment:</span>{" "}
                          {order.payment_method}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Shipping:</span>{" "}
                          {order.shipping_address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              {orders.length === 0
                ? "You have no orders yet"
                : "No orders match your filters"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
