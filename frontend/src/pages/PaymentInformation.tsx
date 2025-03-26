import React, { useState } from 'react';
import { CreditCard, Plus, Edit, Trash2 } from 'lucide-react';

interface PaymentMethod {
  id: number;
  cardType: string;
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface PaymentInformationProps {
  onSelectMethod: (methodId: number) => void;
}

const PaymentInformation: React.FC<PaymentInformationProps> = ({ onSelectMethod }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      cardType: 'Visa',
      cardNumber: '•••• •••• •••• 1234',
      cardHolder: 'John Doe',
      expiryMonth: '12',
      expiryYear: '25',
      isDefault: true
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod | null>(null);

  const openPaymentModal = (method?: PaymentMethod) => {
    setCurrentMethod(method || {
      id: Date.now(),
      cardType: 'Visa',
      cardNumber: '',
      cardHolder: '',
      expiryMonth: '',
      expiryYear: '',
      isDefault: false
    });
    setIsModalOpen(true);
  };

  const handleSavePaymentMethod = () => {
    if (!currentMethod) return;

    if (!currentMethod.cardHolder || !currentMethod.cardNumber || 
        !currentMethod.expiryMonth || !currentMethod.expiryYear) {
      alert('Please fill in all required fields');
      return;
    }

    if (currentMethod.isDefault) {
      setPaymentMethods(prevMethods => 
        prevMethods.map(method => ({...method, isDefault: false}))
      );
    }

    setPaymentMethods(prevMethods => {
      const existingIndex = prevMethods.findIndex(method => method.id === currentMethod.id);
      
      if (existingIndex > -1) {
        const updatedMethods = [...prevMethods];
        updatedMethods[existingIndex] = currentMethod;
        return updatedMethods;
      } else {
        return [...prevMethods, currentMethod];
      }
    });

    // Notify parent component about the selected/default method
    if (currentMethod.isDefault) {
      onSelectMethod(currentMethod.id);
    }

    setIsModalOpen(false);
  };

  const handleDeletePaymentMethod = (id: number) => {
    if (paymentMethods.length === 1 || paymentMethods.find(method => method.id === id)?.isDefault) {
      alert('Cannot delete the only or default payment method');
      return;
    }

    setPaymentMethods(prevMethods => 
      prevMethods.filter(method => method.id !== id)
    );
  };

  const formatCardNumber = (cardNumber: string) => {
    if (cardNumber.length <= 4) return cardNumber;
    return `•••• •••• •••• ${cardNumber.slice(-4)}`;
  };

  const handleSelectMethod = (methodId: number) => {
    onSelectMethod(methodId);
  };

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
              method.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
            onClick={() => handleSelectMethod(method.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{method.cardType}</p>
                <p className="text-sm text-gray-500">{formatCardNumber(method.cardNumber)}</p>
                <p className="text-sm text-gray-500">Expires {method.expiryMonth}/{method.expiryYear}</p>
                <p className="text-sm text-gray-500">Cardholder: {method.cardHolder}</p>
                {method.isDefault && (
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
              {currentMethod?.id ? 'Edit Payment Method' : 'Add New Payment Method'}
            </h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="cardType" className="block text-sm font-medium text-gray-700">
                  Card Type
                </label>
                <select
                  id="cardType"
                  value={currentMethod?.cardType || 'Visa'}
                  onChange={(e) => setCurrentMethod(prev => 
                    prev ? {...prev, cardType: e.target.value} : null
                  )}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                >
                  <option value="Visa">Visa</option>
                  <option value="MasterCard">MasterCard</option>
                  <option value="American Express">American Express</option>
                  <option value="Discover">Discover</option>
                </select>
              </div>
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={currentMethod?.cardNumber || ''}
                  onChange={(e) => setCurrentMethod(prev => 
                    prev ? {...prev, cardNumber: e.target.value} : null
                  )}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardHolder"
                  value={currentMethod?.cardHolder || ''}
                  onChange={(e) => setCurrentMethod(prev => 
                    prev ? {...prev, cardHolder: e.target.value} : null
                  )}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700">
                    Expiry Month
                  </label>
                  <select
                    id="expiryMonth"
                    value={currentMethod?.expiryMonth || ''}
                    onChange={(e) => setCurrentMethod(prev => 
                      prev ? {...prev, expiryMonth: e.target.value} : null
                    )}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  >
                    <option value="">Month</option>
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={(i+1).toString().padStart(2, '0')}>
                        {(i+1).toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700">
                    Expiry Year
                  </label>
                  <select
                    id="expiryYear"
                    value={currentMethod?.expiryYear || ''}
                    onChange={(e) => setCurrentMethod(prev => 
                      prev ? {...prev, expiryYear: e.target.value} : null
                    )}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  >
                    <option value="">Year</option>
                    {Array.from({length: 10}, (_, i) => {
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
                  id="defaultMethod"
                  checked={currentMethod?.isDefault || false}
                  onChange={(e) => setCurrentMethod(prev => 
                    prev ? {...prev, isDefault: e.target.checked} : null
                  )}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                />
                <label 
                  htmlFor="defaultMethod" 
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