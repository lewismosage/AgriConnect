import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Truck,
  CreditCard,
  Calendar,
  Hash,
  Check,
  X,
  ArrowLeft,
  Trash2,
  Loader2,
} from "lucide-react";
import axios from "../contexts/axioConfig";
import { useAuth } from "../contexts/AuthContext";

interface Product {
  id: string;
  name: string;
  price: number | string;
  image?: string;
  farm: {
    id: string;
    name: string;
  };
}

interface OrderItem {
  product: Product;
  quantity: number;
  price: number | string;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  items: OrderItem[];
  shipping_address: string;
  payment_method: string;
  subtotal: number | string;
  shipping_cost: number | string;
  tax: number | string;
  total: number | string;
  status: string;
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Order>(`/api/orders/${id}/`);
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user && id) {
      fetchOrder();
    } else {
      navigate("/login");
    }
  }, [id, user, navigate]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatPrice = (price: number | string) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return num.toFixed(2);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    switch (status.toLowerCase()) {
      case "completed":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Completed
          </span>
        );
      case "processing":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            Processing
          </span>
        );
      case "shipped":
        return (
          <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
            Shipped
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Cancelled
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {status}
          </span>
        );
    }
  };

  const handleDeleteOrder = async () => {
    if (!order) return;

    try {
      setIsDeleting(true);
      await axios.delete(`/api/orders/${order.id}/`);
      navigate("/orders", { state: { message: "Order deleted successfully" } });
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Order not found</div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
          </button>

          <div className="flex space-x-4">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete Order
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Hash className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Order #{order.order_number}
                  </h2>
                  <div className="flex items-center mt-2">
                    {getStatusBadge(order.status)}
                    {order.status.toLowerCase() === "shipped" && (
                      <button
                        onClick={() => navigate(`/orders/${order.id}/tracking`)}
                        className="ml-3 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        Track Product
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Placed on {formatDate(order.created_at)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-gray-500" />
                    Shipping Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {order.shipping_address}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                    Payment Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700">
                      {order.payment_method}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.product.id}`}
                      className="p-4 flex"
                    >
                      <img
                        src={
                          item.product.image || "https://via.placeholder.com/50"
                        }
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${formatPrice(item.product.price)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          From: {item.product.farm.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>${formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Shipping</span>
                      <span>${formatPrice(order.shipping_cost)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Tax</span>
                      <span>${formatPrice(order.tax)}</span>
                    </div>
                    <div className="flex justify-between text-base font-medium text-gray-900 pt-2 border-t border-gray-200 mt-2">
                      <span>Total</span>
                      <span>${formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this order? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                disabled={isDeleting}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-70"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                    Deleting...
                  </>
                ) : (
                  "Delete Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
