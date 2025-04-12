import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  CreditCard,
  Truck,
  Settings,
  LogOut,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
} from "lucide-react";
import Wishlist from "./Wishlist";
import ShippingInformation from "./ShippingInformation";
import PaymentInformation from "./PaymentInformation";
import OrderHistoryView from "./OrderHistoryView";

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("orders"); // Default tab
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white border-r z-50 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex md:flex-col w-72`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="font-bold">My Account</h2>
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.username || user?.email}
              </p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center space-x-3 p-2 rounded-lg ${
                activeTab === "orders"
                  ? "bg-green-50 text-green-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Order History</span>
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`w-full flex items-center space-x-3 p-2 rounded-lg ${
                activeTab === "payments"
                  ? "bg-green-50 text-green-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Payment Methods</span>
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`w-full flex items-center space-x-3 p-2 rounded-lg ${
                activeTab === "shipping"
                  ? "bg-green-50 text-green-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Truck className="w-5 h-5" />
              <span>Shipping Information</span>
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`w-full flex items-center space-x-3 p-2 rounded-lg ${
                activeTab === "wishlist"
                  ? "bg-green-50 text-green-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Wishlist</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center space-x-3 p-2 rounded-lg ${
                activeTab === "settings"
                  ? "bg-green-50 text-green-600"
                  : "text-gray-700 hover:bg-gray-50"
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
      <div className="flex-1 overflow-y-auto">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden p-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            {/* Order History */}
            {activeTab === "orders" && <OrderHistoryView />}

            {/* Payment Methods */}
            {activeTab === "payments" && (
              <PaymentInformation onSelectMethod={() => {}} />
            )}

            {/* Shipping Information */}
            {activeTab === "shipping" && (
              <ShippingInformation onSelectAddress={() => {}} />
            )}

            {/* Wishlist */}
            {activeTab === "wishlist" && <Wishlist />}

            {/* Account Settings */}
            {activeTab === "settings" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Account Settings
                </h2>
                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700"
                    >
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
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
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
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
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