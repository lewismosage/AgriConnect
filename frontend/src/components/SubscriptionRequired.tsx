// components/SubscriptionRequired.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionRequiredProps {
  message: string;
  subscriptionData?: any;
}

const SubscriptionRequired: React.FC<SubscriptionRequiredProps> = ({ 
  message, 
  subscriptionData 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Subscription Required
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>
          
          {subscriptionData && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">
                Your Subscription Status
              </h3>
              <p className="text-sm text-gray-600">
                Plan: {subscriptionData.plan}
              </p>
              <p className="text-sm text-gray-600">
                Status: {subscriptionData.status}
              </p>
              {subscriptionData.days_remaining > 0 && (
                <p className="text-sm text-gray-600">
                  Days remaining: {subscriptionData.days_remaining}
                </p>
              )}
            </div>
          )}
          
          <button
            onClick={() => navigate('/subscription')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRequired;