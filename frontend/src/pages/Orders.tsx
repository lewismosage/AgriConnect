import React from 'react';

const Orders: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(order => (
            <div key={order} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Order #{order}123</p>
                <p className="text-sm text-gray-600">2 items • $24.99</p>
              </div>
              <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                Processing
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;