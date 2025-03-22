import React from 'react';

const Notifications: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Order Confirmation Notification */}
        <div className="border-b pb-4">
          <h3 className="font-semibold">Order Confirmation</h3>
          <p className="text-gray-600 mt-2">
            Your order has been confirmed and will be delivered on [DATE]. Thank you for choosing our farm!
          </p>
        </div>

        {/* Out of Stock Notification */}
        <div className="border-b pb-4 mt-4">
          <h3 className="font-semibold">Out of Stock</h3>
          <p className="text-gray-600 mt-2">
            I apologize, but the item you’re interested in is currently out of stock. We expect to have more available by [DATE].
          </p>
        </div>

        {/* General Notification */}
        <div className="mt-4">
          <h3 className="font-semibold">New Product Available</h3>
          <p className="text-gray-600 mt-2">
            We now have fresh organic strawberries in stock! Place your order now.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;