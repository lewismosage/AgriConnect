import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Package,
  Truck,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import FarmOrdersPreview from "../pages/FarmOrdersPreview";
import InventoryPreview from "../components/InventoryPreview";
import axios from "axios";

// Define types for our data
interface Order {
  id: string;
  items: number;
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
  date: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const FarmerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 0,
    activeProducts: 0,
    pendingOrders: 0,
    growth: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const navigate = useNavigate();

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Sidebar navigation items
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      onClick: () => setActiveTab("dashboard"),
    },
    {
      id: "products",
      label: "Products",
      icon: <ShoppingBag className="w-5 h-5" />,
      onClick: () => navigate("/farm-products"),
    },
    {
      id: "payment-verification",
      label: "Payment Verification",
      icon: <CreditCard className="w-5 h-5" />,
      onClick: () => navigate("/payments-to-verify"),
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      onClick: () => navigate("/notifications"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      onClick: () => navigate("/settings"),
    },
  ];

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const statsResponse = await axios.get("/api/farm/dashboard-stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDashboardStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Farm details from user context
  const farmProfile = user?.farmer_profile;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white border-r transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-20" : "w-64"
        } flex flex-col`}
      >
        {/* Farm Profile Section - Simplified without image */}
        <div className="p-5 border-b">
          {!sidebarCollapsed && (
            <div>
              <h2 className="font-bold">
                {farmProfile?.farm_name || "My Farm"}
              </h2>
              <p className="text-xs text-gray-500">{farmProfile?.location}</p>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="flex justify-center">
              <ShoppingBag className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full flex items-center p-3 hover:bg-green-50 transition-colors ${
                activeTab === item.id
                  ? "bg-green-100 text-green-600"
                  : "text-gray-600"
              } ${sidebarCollapsed ? "justify-center" : "px-5"}`}
            >
              {item.icon}
              {!sidebarCollapsed && (
                <span className="ml-3 text-sm">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="border-t p-4">
          <button
            onClick={logout}
            className={`w-full flex items-center hover:bg-red-50 text-red-600 p-3 ${
              sidebarCollapsed ? "justify-center" : "px-5"
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="ml-3 text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg shadow-md p-6 mb-8 overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50,0 L100,50 L150,0 L200,50 L150,100 L200,150 L150,200 L100,150 L50,200 L0,150 L50,100 L0,50 Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between text-white">
              <div>
                <h2 className="text-xl font-semibold mb-2">Farm Overview</h2>
                <p className="opacity-90 mb-1">
                  {user?.farmer_profile?.location || "Location not set"}
                </p>
                <p className="opacity-90">
                  Specialty:{" "}
                  {user?.farmer_profile?.specialty || "Not specified"}
                </p>
              </div>
              <div className="mt-4 md:mt-0 bg-white bg-opacity-20 rounded-lg p-4">
                <p className="font-semibold text-lg">
                  {formatCurrency(dashboardStats.totalSales)}
                </p>
                <p className="text-sm opacity-90">Total Revenue</p>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: <DollarSign className="w-6 h-6 text-green-600" />,
                title: "Total Sales",
                value: formatCurrency(dashboardStats.totalSales),
                change: "+12.5%",
                bgColor: "bg-green-100",
              },
              {
                icon: <Package className="w-6 h-6 text-blue-600" />,
                title: "Active Products",
                value: dashboardStats.activeProducts,
                change: "+0 this week",
                bgColor: "bg-blue-100",
              },
              {
                icon: <Truck className="w-6 h-6 text-purple-600" />,
                title: "Pending Orders",
                value: dashboardStats.pendingOrders,
                change: "+0 since yesterday",
                bgColor: "bg-purple-100",
              },
              {
                icon: <Package className="w-6 h-6 text-yellow-600" />,
                title: "Growth",
                value: `${dashboardStats.growth}%`,
                change: "+0% from Q1",
                bgColor: "bg-yellow-100",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-green-500 text-sm font-medium">
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders and Inventory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FarmOrdersPreview />
            <InventoryPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
