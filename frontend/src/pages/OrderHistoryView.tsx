import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Check, Clock } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  itemCount: number;
  total: number;
  customerName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

const OrderHistoryView: React.FC = () => {
  // Sample data - replace with your actual data fetching logic
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-20250327-C4CE84',
      date: '2025-03-27',
      itemCount: 2,
      total: 221.99,
      customerName: 'John Smith',
      status: 'shipped'
    },
    {
      id: '2',
      orderNumber: 'ORD-20250326-9FE8D0',
      date: '2025-03-26',
      itemCount: 1,
      total: 146.39,
      customerName: 'John Smith',
      status: 'processing'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shipped':
      case 'delivered':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

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
                <h3 className="font-medium">Order #{order.orderNumber}</h3>
                <p className="text-sm text-gray-600">
                  {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'} • ${order.total.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">Customer: {order.customerName}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <span className="ml-2 text-sm capitalize">{order.status}</span>
                </div>
                <span className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryView;