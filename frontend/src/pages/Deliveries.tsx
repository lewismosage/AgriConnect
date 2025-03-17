import React from 'react';

const Deliveries: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Deliveries</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Upcoming Deliveries</h2>
        <div className="space-y-4">
          {[
            { id: 1, order: '#1234', date: '2023-10-15', status: 'Scheduled' },
            { id: 2, order: '#1235', date: '2023-10-16', status: 'Scheduled' }
          ].map(delivery => (
            <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Order {delivery.order}</p>
                <p className="text-sm text-gray-600">Delivery Date: {delivery.date}</p>
              </div>
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                {delivery.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deliveries;