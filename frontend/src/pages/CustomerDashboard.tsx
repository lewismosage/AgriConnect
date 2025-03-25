import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Truck, Settings, LogOut, Heart, ShoppingCart, User } from 'lucide-react';
import Wishlist from './Wishlist';
import ShippingInformation from './ShippingInformation'; // Import the ShippingInformation component

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // Default tab

  // Dummy data for demonstration (keeping other sections' mock data)
  const orders = [
    { id: 1, date: '2025-03-01', status: 'Delivered', total: 120.0 },
    { id: 2, date: '2025-03-05', status: 'Shipped', total: 75.5 },
    { id: 3, date: '2025-03-10', status: 'Processing', total: 200.0 },
  ];

  const paymentMethods = [
    { id: 1, type: 'Visa', last4: '1234', expiry: '12/25' },
    { id: 2, type: 'MasterCard', last4: '5678', expiry: '06/26' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-green-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.username || user?.email} {/* Fallback to username or email */}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg ${
                    activeTab === 'orders' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Order History</span>
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg ${
                    activeTab === 'payments' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Methods</span>
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg ${
                    activeTab === 'shipping' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  <span>Shipping Information</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg ${
                    activeTab === 'wishlist' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg ${
                    activeTab === 'settings' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Order History */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <p className="text-sm text-gray-700">{order.status}</p>
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <Link to={`/orders/${order.id}`} className="text-green-600 hover:text-green-700">
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {activeTab === 'payments' && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Methods</h2>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">{method.type} ending in {method.last4}</p>
                        <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                      </div>
                      <button className="text-red-600 hover:text-red-700">Remove</button>
                    </div>
                  ))}
                  <button className="w-full flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <span>Add New Payment Method</span>
                  </button>
                </div>
              </div>
            )}

            {/* Shipping Information - Now using the imported component */}
            {activeTab === 'shipping' && (
              <ShippingInformation />
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <Wishlist />
            )}

            {/* Account Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      defaultValue={`${user?.first_name} ${user?.last_name}`}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      defaultValue={user?.email}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;