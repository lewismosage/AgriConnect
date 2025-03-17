import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-700">Email</p>
            <button className="text-green-600 hover:text-green-700">Change</button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-700">Password</p>
            <button className="text-green-600 hover:text-green-700">Change</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;