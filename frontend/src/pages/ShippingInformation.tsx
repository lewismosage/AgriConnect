import React, { useState, useEffect } from "react";
import { Truck, Plus, Edit, Trash2 } from "lucide-react";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "../contexts/AuthContext";

interface ShippingAddress {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

interface ShippingInformationProps {
  onSelectAddress: (addressId: number) => void;
}

const ShippingInformation: React.FC<ShippingInformationProps> = ({
  onSelectAddress,
}) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<ShippingAddress | null>(
    null
  );

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get<ShippingAddress[]>(
          "/api/accounts/shipping-addresses/"
        );
        setAddresses(response.data);
        const defaultAddress = response.data.find(
          (addr: ShippingAddress) => addr.is_default
        );
        if (defaultAddress) {
          onSelectAddress(defaultAddress.id);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user, onSelectAddress]);

  const openAddressModal = (address?: ShippingAddress) => {
    setCurrentAddress(
      address || {
        id: 0,
        name: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "KENYA",
        is_default: false,
      }
    );
    setIsModalOpen(true);
  };

  const handleSaveAddress = async () => {
    if (!currentAddress) return;

    try {
      let response: AxiosResponse<ShippingAddress>;
      if (currentAddress.id) {
        response = await axios.put<ShippingAddress>(
          `/api/accounts/shipping-addresses/${currentAddress.id}/`,
          currentAddress
        );
        setAddresses(
          addresses.map((addr) =>
            addr.id === currentAddress.id ? response.data : addr
          )
        );
      } else {
        response = await axios.post<ShippingAddress>(
          "/api/accounts/shipping-addresses/",
          currentAddress
        );
        setAddresses([...addresses, response.data]);
      }

      if (response.data.is_default) {
        onSelectAddress(response.data.id);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Failed to save address. Please try again.");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await axios.delete(`/api/accounts/shipping-addresses/${id}/`);
      setAddresses(addresses.filter((addr) => addr.id !== id));
    } catch (error) {
      console.error("Failed to delete address:", error);
      alert("Failed to delete address. Please try again.");
    }
  };

  const handleSelectAddress = (addressId: number) => {
    onSelectAddress(addressId);
  };

  if (loading) {
    return <div>Loading addresses...</div>;
  }

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
            className={`p-4 border rounded-lg relative cursor-pointer ${
              address.is_default
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
            onClick={() => handleSelectAddress(address.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{address.name}</p>
                <p className="text-sm text-gray-500">
                  {address.address}, {address.city}, {address.state}{" "}
                  {address.zip_code}
                </p>
                <p className="text-sm text-gray-500">{address.country}</p>
                {address.is_default && (
                  <span className="text-sm text-green-600 absolute top-4 right-20">
                    Default Address
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openAddressModal(address);
                  }}
                  className="text-green-600 hover:text-green-700"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(address.id);
                  }}
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
              {currentAddress?.id ? "Edit Address" : "Add New Address"}
            </h3>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={currentAddress?.name || ""}
                  onChange={(e) =>
                    setCurrentAddress((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={currentAddress?.address || ""}
                  onChange={(e) =>
                    setCurrentAddress((prev) =>
                      prev ? { ...prev, address: e.target.value } : null
                    )
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={currentAddress?.city || ""}
                    onChange={(e) =>
                      setCurrentAddress((prev) =>
                        prev ? { ...prev, city: e.target.value } : null
                      )
                    }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={currentAddress?.state || ""}
                    onChange={(e) =>
                      setCurrentAddress((prev) =>
                        prev ? { ...prev, state: e.target.value } : null
                      )
                    }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="zip_code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zip_code"
                    value={currentAddress?.zip_code || ""}
                    onChange={(e) =>
                      setCurrentAddress((prev) =>
                        prev ? { ...prev, zip_code: e.target.value } : null
                      )
                    }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    value={currentAddress?.country || "KENYA"}
                    onChange={(e) =>
                      setCurrentAddress((prev) =>
                        prev ? { ...prev, country: e.target.value } : null
                      )
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="KENYA">KENYA</option>
                    <option value="UGANDA">UGANDA</option>
                    <option value="TANZANIA">TANZANIA</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  checked={currentAddress?.is_default || false}
                  onChange={(e) =>
                    setCurrentAddress((prev) =>
                      prev ? { ...prev, is_default: e.target.checked } : null
                    )
                  }
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
