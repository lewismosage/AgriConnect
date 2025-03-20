import React, { useState } from 'react';
import { BarChart, Package, Truck, DollarSign, MessageSquare, Bell, Settings, LogOut, Image as ImageIcon, Edit } from 'lucide-react';
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
  
        farmImageUrl = uploadResponse.data.url; // Get the URL of the uploaded image
      }
  
      // Update the farmer profile with the new data and image URL
      await updateFarmerProfile({
        farm_name: data.name,
        location: data.location,
        specialty: data.specialty,
        description: data.description,
        farm_image: farmImageUrl, // Use the updated image URL
      });
  
      setIsEditFormOpen(false); // Close the edit form
    } catch (error) {
      console.error('Error updating farm details:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-white w-64 p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-8">Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            <li className="flex items-center text-gray-700 hover:text-green-600 cursor-pointer">
              <MessageSquare className="w-5 h-5 mr-3" />
              Messages
            </li>
            <li className="flex items-center text-gray-700 hover:text-green-600 cursor-pointer">
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </li>
            <li className="flex items-center text-gray-700 hover:text-green-600 cursor-pointer">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </li>
            <li
              className="flex items-center text-gray-700 hover:text-green-600 cursor-pointer"
              onClick={logout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              {/* Farm Image Upload */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  {farmImagePreview || user?.farmer_profile?.farm_image ? (
                    <img
                      src={farmImagePreview ? farmImagePreview : user?.farmer_profile?.farm_image || ''}
                      alt="Farm Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsEditFormOpen(true)}
                  className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100"
                >
                  <Edit className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 ml-4">{farmName} Dashboard</h1>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300">
              Add New Product
            </button>
          </div>

          {/* Edit Farm Details Form */}
          {isEditFormOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-6">Edit Farm Details</h2>
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
                    <input
                      type="file"
                      id="farmImage"
                      accept="image/*"
                      onChange={handleFarmImageChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
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

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                  <p className="text-2xl font-semibold text-gray-900">$1,234.56</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Active Products</h3>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
                  <p className="text-2xl font-semibold text-gray-900">5</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <BarChart className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Growth</h3>
                  <p className="text-2xl font-semibold text-gray-900">+15%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders and Inventory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                  <div key={order} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Order #{order}123</p>
                      <p className="text-sm text-gray-600">2 items • $24.99</p>
                    </div>
                    <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                      Processing
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Product Inventory</h2>
              <div className="space-y-4">
                {[
                  { name: 'Organic Tomatoes', stock: 45, status: 'In Stock' },
                  { name: 'Fresh Eggs', stock: 12, status: 'Low Stock' },
                  { name: 'Honey', stock: 0, status: 'Out of Stock' },
                ].map((product) => (
                  <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.stock} units</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        product.status === 'In Stock'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'Low Stock'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;