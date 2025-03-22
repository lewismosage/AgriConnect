import React from 'react';

const Messages: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Customer Messages</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-4">You have 2 unread messages</p>

        {/* Message List */}
        <div className="space-y-4">
          {/* Message 1 */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Join Dee</h3>
              <button className="text-sm text-green-600 hover:text-green-700">
                Mark as Read
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              Hi, I was wondering if you have any organic tomatoes available this week?
            </p>
          </div>

          {/* Message 2 */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Jane Smith</h3>
              <button className="text-sm text-green-600 hover:text-green-700">
                Mark as Read
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              When will the next batch of honey be available?
            </p>
          </div>

          {/* Message 3 */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Mike Johnson</h3>
              <button className="text-sm text-gray-600 hover:text-gray-700">
                Mark as Unread
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              Thank you for the fresh eggs! They were delicious.
            </p>
          </div>
        </div>

        {/* Quick Reply Templates */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Quick Reply Templates</h2>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold">Availability</h3>
              <p className="text-gray-600 mt-2">
                Thank you for your interest. The product will be available on [DATE]. Would you like me to notify you when it’s in stock?
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold">Thank You</h3>
              <p className="text-gray-600 mt-2">
                Thank you for your feedback! We’re glad you enjoyed our products. Your support means a lot to us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;