import React from 'react';

const Subscriptions: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Subscriptions</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Active Subscriptions</h2>
        <div className="space-y-4">
          {[
            { id: 1, name: 'Weekly Veggie Box', status: 'Active' },
            { id: 2, name: 'Monthly Fruit Box', status: 'Active' }
          ].map(subscription => (
            <div key={subscription.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{subscription.name}</p>
                <p className="text-sm text-gray-600">Next delivery: 2023-10-15</p>
              </div>
              <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                {subscription.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;