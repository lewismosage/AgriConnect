import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Check, Clock, Loader2 } from 'lucide-react';
import axios from '../contexts/axioConfig';
import { useAuth } from '../contexts/AuthContext';

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
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

const OrderHistoryView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/orders/');
        // Get the first 5 most recent orders
        const recentOrders = response.data.slice(0, 5);
        setOrders(recentOrders);
      } catch (err) {
        console.error('Error fetching recent orders:', err);
        setError('Failed to load recent orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecentOrders();
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'shipped':
      case 'processing':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatPrice = (price: number | string) => {
    // Convert to number if it's a string
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numericPrice.toFixed(2);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link 
            to="/orders-history" 
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            View all &gt;
          </Link>
        </div>
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link 
            to="/orders-history" 
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            View all &gt;
          </Link>
        </div>
        <div className="text-center text-red-500 py-4">{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link 
            to="/orders-history" 
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            View all &gt;
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <Link 
          to="/orders-history" 
          className="text-sm font-medium text-green-600 hover:text-green-700"
        >
          View all &gt;
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Order #{order.order_number}</h3>
                <p className="text-sm text-gray-600">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • ${formatPrice(order.total)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {order.shipping_address.split(',')[0]} {/* Show first line of address */}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <span className="ml-2 text-sm capitalize">{order.status.toLowerCase()}</span>
                </div>
                <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryView;