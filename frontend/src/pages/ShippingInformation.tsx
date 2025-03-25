import React, { useState } from 'react';
import { Truck, Plus, Edit, Trash2 } from 'lucide-react';

// Interface for Shipping Address
interface ShippingAddress {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const ShippingInformation: React.FC = () => {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([
    {
      id: 1,
      name: 'John Doe',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'United States',
      isDefault: true
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<ShippingAddress | null>(null);

  const openAddressModal = (address?: ShippingAddress) => {
    setCurrentAddress(address || {
      id: Date.now(),
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false
    });
    setIsModalOpen(true);
  };

  const handleSaveAddress = () => {
    if (!currentAddress) return;

    // Validate required fields
    if (!currentAddress.name || !currentAddress.address || !currentAddress.city || 
        !currentAddress.state || !currentAddress.zipCode) {
      alert('Please fill in all required fields');
      return;
    }

    // If setting as default, unset other defaults
    if (currentAddress.isDefault) {
      setAddresses(prevAddresses => 
        prevAddresses.map(addr => ({...addr, isDefault: false}))
      );
    }

    // Update or add address
    setAddresses(prevAddresses => {
      const existingIndex = prevAddresses.findIndex(addr => addr.id === currentAddress.id);
      
      if (existingIndex > -1) {
        // Update existing address
        const updatedAddresses = [...prevAddresses];
        updatedAddresses[existingIndex] = currentAddress;
        return updatedAddresses;
      } else {
        // Add new address
        return [...prevAddresses, currentAddress];
      }
    });

    setIsModalOpen(false);
  };

  const handleDeleteAddress = (id: number) => {
    // Prevent deletion of the only or default address
    if (addresses.length === 1 || addresses.find(addr => addr.id === id)?.isDefault) {
      alert('Cannot delete the only or default address');
      return;
    }

    setAddresses(prevAddresses => 
      prevAddresses.filter(addr => addr.id !== id)
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Truck className="mr-2 w-6 h-6 text-green-600" />
          Shipping Information
        </h2>
        <button 
          onClick={() => openAddressModal()}
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <Plus className="mr-2 w-5 h-5" />
          Add New Address
        </button>
      </div>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div 
            key={address.id} 
            className="p-4 border border-gray-200 rounded-lg relative"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{address.name}</p>
                <p className="text-sm text-gray-500">
                  {address.address}, {address.city}, {address.state} {address.zipCode}
                </p>
                <p className="text-sm text-gray-500">{address.country}</p>
                {address.isDefault && (
                  <span className="text-sm text-green-600 absolute top-4 right-20">
                    Default Address
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => openAddressModal(address)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {currentAddress?.id ? 'Edit Address' : 'Add New Address'}
            </h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={currentAddress?.name || ''}
                  onChange={(e) => setCurrentAddress(prev => 
                    prev ? {...prev, name: e.target.value} : null
                  )}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={currentAddress?.address || ''}
                  onChange={(e) => setCurrentAddress(prev => 
                    prev ? {...prev, address: e.target.value} : null
                  )}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={currentAddress?.city || ''}
                    onChange={(e) => setCurrentAddress(prev => 
                      prev ? {...prev, city: e.target.value} : null
                    )}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={currentAddress?.state || ''}
                    onChange={(e) => setCurrentAddress(prev => 
                      prev ? {...prev, state: e.target.value} : null
                    )}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={currentAddress?.zipCode || ''}
                    onChange={(e) => setCurrentAddress(prev => 
                      prev ? {...prev, zipCode: e.target.value} : null
                    )}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    id="country"
                    value={currentAddress?.country || 'United States'}
                    onChange={(e) => setCurrentAddress(prev => 
                      prev ? {...prev, country: e.target.value} : null
                    )}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  checked={currentAddress?.isDefault || false}
                  onChange={(e) => setCurrentAddress(prev => 
                    prev ? {...prev, isDefault: e.target.checked} : null
                  )}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor="defaultAddress" 
                  className="ml-2 block text-sm text-gray-900"
                >
                  Set as default address
                </label>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingInformation;