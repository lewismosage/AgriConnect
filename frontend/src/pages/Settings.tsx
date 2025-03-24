import React, { useState } from 'react';
import { Edit, Lock, Mail, User } from 'lucide-react';
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

const farmAboutSchema = z.object({
  about: z.string().min(20, 'About section must be at least 20 characters'),
  sustainability: z.string().min(20, 'Sustainability practices must be at least 20 characters'),
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
  const [activeSection, setActiveSection] = useState<'profile' | 'account' | 'security'>('profile');

  // Farm Details Form
  const { register: registerFarmDetails, handleSubmit: handleFarmDetailsSubmit, formState: { errors: farmDetailsErrors } } = useForm({
    resolver: zodResolver(farmDetailsSchema),
    defaultValues: {
      name: user?.farmer_profile?.farm_name || '',
      location: user?.farmer_profile?.location || '',
      specialty: user?.farmer_profile?.specialty || '',
      description: user?.farmer_profile?.description || '',
    }
  });

  // Farm About & Sustainability Form
  const { register: registerFarmAbout, handleSubmit: handleFarmAboutSubmit, formState: { errors: farmAboutErrors } } = useForm({
    resolver: zodResolver(farmAboutSchema),
    defaultValues: {
      about: user?.farmer_profile?.about || '',
      sustainability: user?.farmer_profile?.sustainability || '',
    }
  });

  // Password Change Form
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm({
    resolver: zodResolver(passwordChangeSchema)
  });

  const handleFarmImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFarmImage(file);
    }
  };

  const onSubmitFarmDetails = async (data: any) => {
    try {
      let farmImageUrl = user?.farmer_profile?.farm_image || null;
  
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
  
      await updateFarmerProfile({
        farm_name: data.name,
        location: data.location,
        specialty: data.specialty,
        description: data.description,
        farm_image: farmImageUrl || undefined,
      });
    } catch (error) {
      console.error('Error updating farm details:', error);
    }
  };

  const onSubmitFarmAbout = async (data: any) => {
    try {
      await updateFarmerProfile({
        about: data.about,
        sustainability: data.sustainability,
      });
      alert('Farm information updated successfully!');
    } catch (error) {
      console.error('Error updating farm information:', error);
      alert('Failed to update farm information. Please try again.');
    }
  };

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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFarmImageChange}
                  className="hidden"
                  id="farmImageUpload"
                />
                <label 
                  htmlFor="farmImageUpload" 
                  className="inline-block px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Upload Farm Image
                </label>
              </div>

              {/* Farm Details Inputs */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Farm Name</label>
                  <input
                    type="text"
                    {...registerFarmDetails('name')}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
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
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
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
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
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
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
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
          <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 font-medium">Email Address</p>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Farm About Section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-6">Farm Information</h2>
              <form onSubmit={handleFarmAboutSubmit(onSubmitFarmAbout)} className="space-y-6">
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                    About the Farm
                  </label>
                  <textarea
                    {...registerFarmAbout('about')}
                    rows={5}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Tell customers about your farm's history, values, and practices..."
                  />
                  {farmAboutErrors.about && (
                    <p className="mt-1 text-sm text-red-600">{farmAboutErrors.about.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="sustainability" className="block text-sm font-medium text-gray-700">
                    Sustainability Practices
                  </label>
                  <textarea
                    {...registerFarmAbout('sustainability')}
                    rows={5}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Describe your farm's sustainability initiatives, certifications, and environmental practices..."
                  />
                  {farmAboutErrors.sustainability && (
                    <p className="mt-1 text-sm text-red-600">{farmAboutErrors.sustainability.message}</p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save Farm Information
                  </button>
                </div>
              </form>
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
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