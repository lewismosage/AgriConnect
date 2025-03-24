import React, { useState, useEffect } from 'react';
import { Edit, Image as ImageIcon, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Validation schemas
const farmDetailsSchema = z.object({
  name: z.string().min(3, 'Farm name must be at least 3 characters'),
  location: z.string().min(1, 'Please enter a location'),
  specialty: z.string().min(1, 'Please enter a specialty'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(8, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

const Settings: React.FC = () => {
  const { user, updateFarmerProfile } = useAuth();
  const [farmImage, setFarmImage] = useState<File | null>(null);
  const [farmImagePreview, setFarmImagePreview] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'profile' | 'account' | 'security'>('profile');

  // Farm Details Form
  const {
    register: registerFarmDetails,
    handleSubmit: handleFarmDetailsSubmit,
    formState: { errors: farmDetailsErrors },
    reset: resetFarmDetails
  } = useForm({
    resolver: zodResolver(farmDetailsSchema),
    defaultValues: {
      name: user?.farmer_profile?.farm_name || '',
      location: user?.farmer_profile?.location || '',
      specialty: user?.farmer_profile?.specialty || '',
      description: user?.farmer_profile?.description || '',
    }
  });

  // Password Change Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm({
    resolver: zodResolver(passwordChangeSchema)
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
      setFarmImage(file);
    }
  };

  // Submit farm details
  const onSubmitFarmDetails = async (data: any) => {
    try {
      let farmImageUrl = user?.farmer_profile?.farm_image || null;
  
      // If a new farm image is selected, upload it
      if (farmImage) {
        const imageFormData = new FormData();
        imageFormData.append('file', farmImage);
  
        const uploadResponse = await axios.post('/api/accounts/upload-farm-image/', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        farmImageUrl = uploadResponse.data.url;
      }
  
      // Update farm profile
      await updateFarmerProfile({
        farm_name: data.name,
        location: data.location,
        specialty: data.specialty,
        description: data.description,
        farm_image: farmImageUrl,
      });
    } catch (error) {
      console.error('Error updating farm details:', error);
    }
  };

  // Submit password change
  const onSubmitPasswordChange = async (data: any) => {
    try {
      await axios.post('/api/accounts/change-password', {
        current_password: data.currentPassword,
        new_password: data.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      resetPassword();
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        {/* Navigation */}
        <div className="flex mb-8 border-b">
          {[
            { id: 'profile', label: 'Farm Profile', icon: <User className="mr-2 w-5 h-5" /> },
            { id: 'account', label: 'Account', icon: <Mail className="mr-2 w-5 h-5" /> },
            { id: 'security', label: 'Security', icon: <Lock className="mr-2 w-5 h-5" /> }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`flex items-center px-4 py-2 ${
                activeSection === section.id 
                  ? 'border-b-2 border-green-600 text-green-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Farm Profile</h2>
            <form onSubmit={handleFarmDetailsSubmit(onSubmitFarmDetails)} className="space-y-6">
              {/* Farm Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm Image</label>
                <div className="flex items-center">
                  <div className="w-24 h-24 mr-6 rounded-full overflow-hidden border-2 border-gray-200">
                    {farmImagePreview || user?.farmer_profile?.farm_image ? (
                      <img
                        src={farmImagePreview || user?.farmer_profile?.farm_image || ''}
                        alt="Farm Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFarmImageChange}
                    className="hidden"
                    id="farmImageUpload"
                  />
                  <label 
                    htmlFor="farmImageUpload" 
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Change Image
                  </label>
                </div>
              </div>

              {/* Farm Details Inputs */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Farm Name</label>
                  <input
                    type="text"
                    {...registerFarmDetails('name')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {farmDetailsErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{farmDetailsErrors.name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    {...registerFarmDetails('location')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {farmDetailsErrors.location && (
                    <p className="mt-1 text-sm text-red-600">{farmDetailsErrors.location.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Specialty</label>
                  <input
                    type="text"
                    {...registerFarmDetails('specialty')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {farmDetailsErrors.specialty && (
                    <p className="mt-1 text-sm text-red-600">{farmDetailsErrors.specialty.message}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    {...registerFarmDetails('description')}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {farmDetailsErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{farmDetailsErrors.description.message}</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Account Section */}
        {activeSection === 'account' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Email Address</p>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
                <button className="text-green-600 hover:text-green-700 flex items-center">
                  <Edit className="w-4 h-4 mr-2" /> Change
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Section */}
        {activeSection === 'security' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Change Password</h2>
            <form onSubmit={handlePasswordSubmit(onSubmitPasswordChange)} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  {...registerPassword('currentPassword')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  {...registerPassword('newPassword')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  {...registerPassword('confirmPassword')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;