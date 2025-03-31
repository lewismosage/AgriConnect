import React, { useState, useEffect } from "react";
import { CreditCard, Plus, Edit, Trash2 } from "lucide-react";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "../contexts/AuthContext";

interface PaymentMethod {
  id: number;
  card_type: string;
  last_four: string;
  expiry_month: string;
  expiry_year: string;
  is_default: boolean;
}

interface PaymentMethodFormData extends Omit<PaymentMethod, "last_four"> {
  card_number: string;
}

interface PaymentInformationProps {
  onSelectMethod: (methodId: number) => void;
}

const PaymentInformation: React.FC<PaymentInformationProps> = ({
  onSelectMethod,
}) => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMethod, setCurrentMethod] =
    useState<PaymentMethodFormData | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get<PaymentMethod[]>(
          "/api/accounts/payment-methods/"
        );
        setPaymentMethods(response.data);
        const defaultMethod = response.data.find(
          (method: PaymentMethod) => method.is_default
        );
        if (defaultMethod) {
          onSelectMethod(defaultMethod.id);
        }
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPaymentMethods();
    }
  }, [user, onSelectMethod]);

  const openPaymentModal = (method?: PaymentMethod) => {
    setCurrentMethod(
      method
        ? {
            id: method.id,
            card_type: method.card_type,
            card_number: "",
            expiry_month: method.expiry_month,
            expiry_year: method.expiry_year,
            is_default: method.is_default,
          }
        : {
            id: 0,
            card_type: "Visa",
            card_number: "",
            expiry_month: "",
            expiry_year: "",
            is_default: false,
          }
    );
    setIsModalOpen(true);
  };

  const handleSavePaymentMethod = async () => {
    if (!currentMethod) return;

    try {
      const payload = {
        card_type: currentMethod.card_type,
        expiry_month: currentMethod.expiry_month,
        expiry_year: currentMethod.expiry_year,
        is_default: currentMethod.is_default,
        card_number: currentMethod.card_number,
      };

      let response: AxiosResponse<PaymentMethod>;
      if (currentMethod.id) {
        response = await axios.put<PaymentMethod>(
          `/api/accounts/payment-methods/${currentMethod.id}/`,
          payload
        );
        setPaymentMethods(
          paymentMethods.map((method) =>
            method.id === currentMethod.id ? response.data : method
          )
        );
      } else {
        response = await axios.post<PaymentMethod>(
          "/api/accounts/payment-methods/",
          payload
        );
        setPaymentMethods([...paymentMethods, response.data]);
      }

      if (response.data.is_default) {
        onSelectMethod(response.data.id);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save payment method:", error);
      alert("Failed to save payment method. Please try again.");
    }
  };

  const handleDeletePaymentMethod = async (id: number) => {
    try {
      await axios.delete(`/api/accounts/payment-methods/${id}/`);
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    } catch (error) {
      console.error("Failed to delete payment method:", error);
      alert("Failed to delete payment method. Please try again.");
    }
  };

  const handleSelectMethod = (methodId: number) => {
    onSelectMethod(methodId);
  };

  if (loading) {
    return <div>Loading payment methods...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <CreditCard className="mr-2 w-6 h-6 text-green-600" />
          Payment Information
        </h2>
        <button
          onClick={() => openPaymentModal()}
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <Plus className="mr-2 w-5 h-5" />
          Add New Payment Method
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 border rounded-lg relative cursor-pointer ${
              method.is_default
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
            onClick={() => handleSelectMethod(method.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{method.card_type}</p>
                <p className="text-sm text-gray-500">
                  {`•••• •••• •••• ${method.last_four}`}
                </p>
                <p className="text-sm text-gray-500">
                  Expires {method.expiry_month}/{method.expiry_year}
                </p>
                {method.is_default && (
                  <span className="text-sm text-green-600 absolute top-4 right-20">
                    Default Method
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openPaymentModal(method);
                  }}
                  className="text-green-600 hover:text-green-700"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePaymentMethod(method.id);
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

      {/* Payment Method Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {currentMethod?.id
                ? "Edit Payment Method"
                : "Add New Payment Method"}
            </h3>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="card_type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Card Type
                </label>
                <select
                  id="card_type"
                  value={currentMethod?.card_type || "Visa"}
                  onChange={(e) =>
                    setCurrentMethod((prev) =>
                      prev ? { ...prev, card_type: e.target.value } : null
                    )
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                >
                  <option value="Visa">Visa</option>
                  <option value="MasterCard">MasterCard</option>
                  <option value="American Express">American Express</option>
                  <option value="Discover">Discover</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="card_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="card_number"
                  value={currentMethod?.card_number || ""}
                  onChange={(e) =>
                    setCurrentMethod((prev) =>
                      prev ? { ...prev, card_number: e.target.value } : null
                    )
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiry_month"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Expiry Month
                  </label>
                  <select
                    id="expiry_month"
                    value={currentMethod?.expiry_month || ""}
                    onChange={(e) =>
                      setCurrentMethod((prev) =>
                        prev ? { ...prev, expiry_month: e.target.value } : null
                      )
                    }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option
                        key={i + 1}
                        value={(i + 1).toString().padStart(2, "0")}
                      >
                        {(i + 1).toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="expiry_year"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Expiry Year
                  </label>
                  <select
                    id="expiry_year"
                    value={currentMethod?.expiry_year || ""}
                    onChange={(e) =>
                      setCurrentMethod((prev) =>
                        prev ? { ...prev, expiry_year: e.target.value } : null
                      )
                    }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year.toString().slice(-2)}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={currentMethod?.is_default || false}
                  onChange={(e) =>
                    setCurrentMethod((prev) =>
                      prev ? { ...prev, is_default: e.target.checked } : null
                    )
                  }
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                />
                <label
                  htmlFor="is_default"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Set as default payment method
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
                  onClick={handleSavePaymentMethod}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Payment Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentInformation;