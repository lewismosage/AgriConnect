import React from 'react';

const Analytics: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Sales Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-green-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Total Sales</h3>
            <p className="text-2xl font-bold text-green-800">$1,234.56</p>
          </div>
          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Orders</h3>
            <p className="text-2xl font-bold text-blue-800">45</p>
          </div>
          <div className="bg-purple-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Customers</h3>
            <p className="text-2xl font-bold text-purple-800">12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;