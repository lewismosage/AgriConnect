// pages/SubscriptionPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../contexts/axioConfig';
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Calendar,
  DollarSign,
  History,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface PaymentHistory {
  id: string;
  amount: number;
  date: string;
  status: string;
  description: string;
}

const SubscriptionPage: React.FC = () => {
  const { user, subscriptionStatus, checkSubscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const navigate = useNavigate();

  const plans: SubscriptionPlan[] = [
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 19.99,
      features: [
        'Unlimited product listings',
        'Advanced analytics dashboard',
        'Priority customer support',
        'Marketing tools',
        'Direct customer messaging'
      ]
    },
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 9.99,
      features: [
        'Up to 20 product listings',
        'Basic analytics',
        'Email support',
        'Standard marketing tools'
      ]
    }
  ];

  useEffect(() => {
    if (user?.user_type === 'farmer') {
      fetchPaymentHistory();
      checkSubscription(); // Ensure subscription status is checked
    }
  }, [user]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/subscriptions/payments/');
      setPaymentHistory(response.data);
    } catch (error) {
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }

    try {
      setPaymentLoading(true);
      let paymentData: any = {
        plan: selectedPlan,
        payment_method: paymentMethod
      };

      if (paymentMethod === 'mpesa') {
        if (!mpesaNumber) {
          toast.error('Please enter your MPESA number');
          return;
        }
        paymentData.mpesa_number = mpesaNumber;
      } else {
        // Validate card details
        if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
          toast.error('Please enter all card details');
          return;
        }
        paymentData.card_details = cardDetails;
      }

      await axios.post('/api/subscriptions/pay/', paymentData);
      toast.success('Payment processed successfully!');
      
      // Refresh subscription status
      await checkSubscription();
      await fetchPaymentHistory();
      
      setSelectedPlan(null);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      await axios.post('/api/subscriptions/cancel/');
      toast.success('Subscription cancelled. It will remain active until the end of the current billing period.');
      await checkSubscription();
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.user_type !== 'farmer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Subscription Required</h2>
          <p className="text-gray-600 mb-6">
            This page is only available to farmers with an active subscription.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your AgriConnect subscription and billing information
          </p>
        </div>

        {/* Current Subscription Status */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Current Subscription
          </h2>
          
          {subscriptionStatus?.subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium">
                    {subscriptionStatus.subscription.plan === 'free_trial' ? 'Free Trial' : 
                     subscriptionStatus.subscription.plan === 'premium' ? 'Premium Plan' : 'Basic Plan'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {subscriptionStatus.subscription.status === 'active' ? 
                     'Active' : subscriptionStatus.subscription.status === 'trial' ? 
                     'Trial' : 'Inactive'}
                  </p>
                  {subscriptionStatus.subscription.next_billing_date && (
                    <p className="text-sm text-gray-500">
                      Next billing: {new Date(subscriptionStatus.subscription.next_billing_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium">
                    ${subscriptionStatus.subscription.plan === 'premium' ? '19.99' : 
                       subscriptionStatus.subscription.plan === 'basic' ? '9.99' : '0.00'} / month
                  </p>
                  {subscriptionStatus.subscription.status === 'trial' && subscriptionStatus.subscription.next_billing_date && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {Math.max(0, Math.ceil((new Date(subscriptionStatus.subscription.next_billing_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining
                    </p>
                  )}
                </div>
              </div>

              {subscriptionStatus.subscription.status === 'active' && (
                <button
                  onClick={cancelSubscription}
                  disabled={loading}
                  className="mt-4 text-red-600 text-sm font-medium hover:text-red-700 flex items-center"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    'Cancel Subscription'
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-600">No active subscription found</p>
              <button
                onClick={() => setSelectedPlan('premium')}
                className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
              >
                Subscribe Now
              </button>
            </div>
          )}
        </div>

        {/* Plan Selection */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Choose a Plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`border rounded-lg p-6 transition-all ${selectedPlan === plan.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">{plan.name}</h3>
                  {selectedPlan === plan.id && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Selected
                    </span>
                  )}
                </div>
                
                <p className="text-2xl font-bold mb-4">
                  ${plan.price} <span className="text-sm font-normal text-gray-500">/month</span>
                </p>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-2 px-4 rounded-md ${selectedPlan === plan.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-800'} hover:bg-emerald-700 hover:text-white transition`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        {selectedPlan && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Payment Method
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'mpesa' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
                  onClick={() => setPaymentMethod('mpesa')}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === 'mpesa' ? 'border-emerald-500' : 'border-gray-400'}`}>
                      {paymentMethod === 'mpesa' && <div className="w-3 h-3 rounded-full bg-emerald-500"></div>}
                    </div>
                    <span className="font-medium">MPESA</span>
                  </div>
                  {paymentMethod === 'mpesa' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        MPESA Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 0712345678"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={mpesaNumber}
                        onChange={(e) => setMpesaNumber(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === 'card' ? 'border-emerald-500' : 'border-gray-400'}`}>
                      {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-emerald-500"></div>}
                    </div>
                    <span className="font-medium">Credit/Debit Card</span>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md">
                <div>
                  <p className="font-medium">Total Due</p>
                  <p className="text-sm text-gray-500">
                    {selectedPlan === 'premium' ? 'Premium Plan' : 'Basic Plan'} - Billed monthly
                  </p>
                </div>
                <p className="text-xl font-bold">
                  ${selectedPlan === 'premium' ? '19.99' : '9.99'}
                </p>
              </div>
              
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 flex items-center justify-center"
              >
                {paymentLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Complete Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <History className="w-5 h-5 mr-2" />
            Payment History
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : paymentHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${payment.amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{payment.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No payment history found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;