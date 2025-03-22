import React, { useState, useEffect } from 'react';
import {
  BarChart, Package, Truck, DollarSign, MessageSquare, Bell, 
  Settings, LogOut, Image as ImageIcon, Edit, Menu, X, ChevronRight, Home, ShoppingBag
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

// Validation schema for farm details
const farmDetailsSchema = z.object({
  name: z.string().min(3, 'Farm name must be at least 3 characters'),
  location: z.string().min(1, 'Please enter a location'),
  specialty: z.string().min(1, 'Please enter a specialty'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type FarmDetailsForm = z.infer<typeof farmDetailsSchema>;

const FarmerDashboard: React.FC = () => {
  const { user, logout, updateFarmerProfile } = useAuth();
  const [farmImagePreview, setFarmImagePreview] = useState<string | null>(null);
  const [farmImageFile, setFarmImageFile] = useState<File | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dynamically get the farm name from the user's farmer_profile
  const farmName = user?.farmer_profile?.farm_name || "Farm";

  // React Hook Form for farm details
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FarmDetailsForm>({
    resolver: zodResolver(farmDetailsSchema),
    defaultValues: {
      name: user?.farmer_profile?.farm_name || '',
      location: user?.farmer_profile?.location || '',
      specialty: user?.farmer_profile?.specialty || '',
      description: user?.farmer_profile?.description || '',
    },
  });

  // Detect screen size and set state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle farm image change
  const handleFarmImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFarmImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFarmImageFile(file);
    }
  };

  // Handle farm details form submission
  const onSubmitFarmDetails = async (data: FarmDetailsForm) => {
    try {
      let farmImageUrl = user?.farmer_profile?.farm_image || null;
  
      // If a new farm image file is selected, upload it first
      if (farmImageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', farmImageFile);
  
        const uploadResponse = await axios.post('/api/accounts/upload-farm-image/', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        farmImageUrl = uploadResponse.data.url;
      }
  
      // Update the farmer profile with the new data and image URL
      await updateFarmerProfile({
        farm_name: data.name,
        location: data.location,
        specialty: data.specialty,
        description: data.description,
        farm_image: farmImageUrl,
      });
  
      setIsEditFormOpen(false);
    } catch (error) {
      console.error('Error updating farm details:', error);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'products', label: 'Products', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'spacer', label: '', icon: null }, // Empty space
    { id: 'divider', isDivider: true }, // Divider
    { id: 'logout', label: 'Logout', icon: <LogOut className="w-5 h-5" />, onClick: logout },
  ];
  
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Top Navigation Bar - Mobile */}
      <div className="bg-white shadow-sm py-3 px-4 flex items-center justify-between md:hidden z-10">
        <button onClick={toggleSidebar} className="p-1">
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        <div className="flex items-center">
          <div 
            className="w-8 h-8 rounded-full overflow-hidden mr-2 cursor-pointer"
            onClick={() => setIsEditFormOpen(true)}
          >
            {farmImagePreview || user?.farmer_profile?.farm_image ? (
              <img
                src={farmImagePreview || user?.farmer_profile?.farm_image || ''}
                alt="Farm Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <h1 className="text-lg font-bold">{farmName}</h1>
        </div>
        <div className="w-6"></div> {/* Empty div for flex alignment */}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - overlay on mobile, fixed on desktop */}
        <div 
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out fixed md:relative z-20 md:z-0 h-full md:translate-x-0 bg-white shadow-md flex flex-col md:w-64 w-3/4`}
        >
          {/* Sidebar Header */}
          <div className="p-4 flex items-center justify-between border-b">
            <h2 className="text-xl font-bold text-gray-900">
              {isMobile ? `${farmName}` : 'Dashboard'}
            </h2>
            {isMobile && (
              <button onClick={toggleSidebar} className="p-1">
                <X className="h-6 w-6 text-gray-700" />
              </button>
            )}
            {!isMobile && (
              <button 
                onClick={toggleSidebar} 
                className="p-1 rounded hover:bg-gray-100"
              >
                <ChevronRight className={`h-5 w-5 text-gray-500 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
              </button>
            )}
          </div>

          {/* Sidebar Content */}
          <nav className="px-2">
            <ul className="space-y-1">
              {navItems.map((item) => {
                if (item.isDivider) {
                  return <li key={item.id} className="my-3 border-t border-gray-200"></li>;
                } else if (item.id === 'spacer') {
                  return <li key={item.id} className="h-6"></li>; // Empty space
                } else {
                  return (
                    <li key={item.id}>
                      <button
                        className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                          activeTab === item.id
                            ? 'bg-green-50 text-green-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => item.onClick ? item.onClick() : setActiveTab(item.id)}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                          {item.label}
                        </span>
                      </button>
                    </li>
                  );
                }
              })}
            </ul>
          </nav>

          {/* Sidebar Footer - Keep this for desktop view consistency */}
          <div className="p-4 border-t hidden md:block">
          <button
              className="{/* Empty div for flex alignment */}"
            >
            </button>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                {/* Farm Image and Title - Desktop */}
                <div className="hidden md:flex items-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                    {farmImagePreview || user?.farmer_profile?.farm_image ? (
                      <img
                        src={farmImagePreview || user?.farmer_profile?.farm_image || ''}
                        alt="Farm Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    </div>
                    <button
                      onClick={() => setIsEditFormOpen(true)}
                      className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 ml-4">{farmName} Dashboard</h1>
                </div>
              </div>
              
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 w-full md:w-auto">
                Add New Product
              </button>
            </div>

            {/* Farm Stats */}
            <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg shadow-md p-6 mb-8 overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10">
                <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50,0 L100,50 L150,0 L200,50 L150,100 L200,150 L150,200 L100,150 L50,200 L0,150 L50,100 L0,50 Z" fill="white" />
                </svg>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between text-white">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Farm Overview</h2>
                  <p className="opacity-90 mb-1">{user?.farmer_profile?.location || 'Location not set'}</p>
                  <p className="opacity-90">Specialty: {user?.farmer_profile?.specialty || 'Not specified'}</p>
                </div>
                <div className="mt-4 md:mt-0 bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="font-semibold text-lg">$1,234.56</p>
                  <p className="text-sm opacity-90">Total Revenue</p>
                </div>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                    <p className="text-2xl font-semibold text-gray-900">$1,234.56</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-green-500 text-sm font-medium">+12.5%</span>
                  <span className="ml-2 text-gray-500 text-sm">from last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Active Products</h3>
                    <p className="text-2xl font-semibold text-gray-900">12</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-green-500 text-sm font-medium">+2</span>
                  <span className="ml-2 text-gray-500 text-sm">new this week</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Truck className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
                    <p className="text-2xl font-semibold text-gray-900">5</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-yellow-500 text-sm font-medium">+1</span>
                  <span className="ml-2 text-gray-500 text-sm">since yesterday</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <BarChart className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Growth</h3>
                    <p className="text-2xl font-semibold text-gray-900">+15%</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-green-500 text-sm font-medium">+3%</span>
                  <span className="ml-2 text-gray-500 text-sm">from Q1</span>
                </div>
              </div>
            </div>

            {/* Recent Orders and Inventory */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold">Recent Orders</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { id: '1123', items: 2, price: 24.99, status: 'Processing', date: 'Mar 19, 2025' },
                    { id: '2123', items: 5, price: 89.95, status: 'Shipped', date: 'Mar 18, 2025' },
                    { id: '3123', items: 1, price: 14.50, status: 'Delivered', date: 'Mar 15, 2025' },
                  ].map((order) => (
                    <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 bg-gray-100 rounded-full p-2">
                            <Package className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">{order.items} items • ${order.price}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">{order.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <button className="text-sm text-green-600 font-medium hover:text-green-700">
                    View all orders
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold">Product Inventory</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { id: 1, name: 'Organic Tomatoes', stock: 45, status: 'In Stock', price: '$4.99/lb' },
                    { id: 2, name: 'Fresh Eggs', stock: 12, status: 'Low Stock', price: '$6.99/dozen' },
                    { id: 3, name: 'Honey', stock: 0, status: 'Out of Stock', price: '$12.99/jar' },
                  ].map((product) => (
                    <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 bg-gray-100 rounded-full p-2">
                            <ShoppingBag className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.price} • {product.stock} units</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          product.status === 'In Stock'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'Low Stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <button className="text-sm text-green-600 font-medium hover:text-green-700">
                    Manage inventory
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Farm Details Modal */}
      {isEditFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Farm Details</h2>
              <button 
                onClick={() => setIsEditFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitFarmDetails)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Farm Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  {...register('location')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                  Specialty
                </label>
                <input
                  type="text"
                  id="specialty"
                  {...register('specialty')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                {errors.specialty && (
                  <p className="mt-1 text-sm text-red-600">{errors.specialty.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register('description')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="farmImage" className="block text-sm font-medium text-gray-700">
                  Farm Image
                </label>
                <div className="mt-1 flex items-center">
                  <div className="w-16 h-16 mr-4 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                  {farmImagePreview || user?.farmer_profile?.farm_image ? (
                    <img
                      src={farmImagePreview || user?.farmer_profile?.farm_image || ''}
                      alt="Farm Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  </div>
                  <input
                    type="file"
                    id="farmImage"
                    accept="image/*"
                    onChange={handleFarmImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditFormOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;