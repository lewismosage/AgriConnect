// components/FarmOrdersPreview.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  total: string;
  customer: {
    first_name: string;
    last_name: string;
  };
  items: Array<{
    product: {
      name: string;
    };
    quantity: number;
  }>;
}

const FarmOrdersPreview: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/orders/farm/', {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
        setOrders(response.data.slice(0, 5)); // Get first 5 orders
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.farmer_profile) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center">
          <Package className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold ml-2">Recent Orders</h2>
        </div>
        <div className="p-4 text-center text-gray-500">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center">
          <Package className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold ml-2">Recent Orders</h2>
        </div>
        <div className="p-4 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <Package className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold ml-2">Recent Orders</h2>
        </div>
        <button 
        onClick={() => navigate('/orders')}
        className="text-sm text-green-600 font-medium hover:text-green-700 flex items-center"
      >
        View all <ChevronRight className="w-4 h-4 ml-1" />
      </button>
      </div>
      
      <div className="divide-y divide-gray-100">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 bg-gray-100 rounded-full p-2">
                    <Package className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">Order #{order.order_number}</p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} items • ${order.total}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Customer: {order.customer.first_name} {order.customer.last_name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No recent orders
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmOrdersPreview;