import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Truck, CreditCard, Calendar, Hash } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../contexts/axioConfig';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  farm: {
    id: string;
    name: string;
  };
}

interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  items: OrderItem[];
  shipping_address: string;
  payment_method: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: string;
}

interface TransformedOrder extends Omit<Order, 'order_number' | 'created_at' | 'shipping_cost' | 'shipping_address' | 'payment_method'> {
  orderNumber: string;
  date: string;
  shipping: number;
  shippingAddress: string;
  paymentMethod: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<TransformedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Order[]>('/api/orders/');
        
        const transformedOrders = response.data.map((order): TransformedOrder => ({
          ...order,
          orderNumber: order.order_number,
          date: order.created_at,
          shipping: order.shipping_cost,
          shippingAddress: order.shipping_address,
          paymentMethod: order.payment_method,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1)
        }));
        
        setOrders(transformedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300 animate-pulse" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading your order history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Found</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
        
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <Hash className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Order #{order.orderNumber}</h3>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(order.status)}
                        <span className="ml-2 text-sm text-gray-500 capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Placed on {formatDate(order.date)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                        <Truck className="h-4 w-4 mr-2" />
                        Shipping Address
                      </h4>
                      <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Method
                      </h4>
                      <p className="text-sm text-gray-700">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
                  <ul className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <li key={item.product.id} className="py-4 flex">
                        <img
                          src={item.product.image || 'https://via.placeholder.com/50'}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                          <p className="text-xs text-gray-400">From: {item.product.farm.name}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium text-gray-900 mt-2 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Details <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;