import React, { useState } from 'react';
import axios from '../contexts/axiosConfig';  
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, ChevronsRight, MapPin, User, CreditCard, ArrowRight } from 'lucide-react';
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

// Validation schemas
const farmDetailsSchema = z.object({
  name: z.string().min(3, 'Farm name must be at least 3 characters'),
  location: z.string().min(1, 'Please enter a location'),
  specialty: z.string().min(1, 'Please enter a specialty'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

const farmerDetailsSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FarmDetailsForm = z.infer<typeof farmDetailsSchema>;
type FarmerDetailsForm = z.infer<typeof farmerDetailsSchema>;

const FarmRegistration = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register: registerFarm,
    handleSubmit: handleSubmitFarm,
    formState: { errors: farmErrors },
  } = useForm<FarmDetailsForm>({
    resolver: zodResolver(farmDetailsSchema),
  });

  const {
    register: registerFarmer,
    handleSubmit: handleSubmitFarmer,
    formState: { errors: farmerErrors },
    watch,
  } = useForm<FarmerDetailsForm>({
    resolver: zodResolver(farmerDetailsSchema),
  });

  const password = watch('password', '');

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    return {
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      isValid:
        minLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber &&
        hasSpecialChar,
    };
  };

  const passwordStrength = validatePassword(password);

  const onSubmitFarmDetails = async (data: FarmDetailsForm) => {
    try {
      setIsLoading(true);
      setStep(2); // Move to the next step
    } catch (error) {
      setError("Failed to save farm details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitFarmerDetails = async (data: FarmerDetailsForm) => {
    try {
      setIsLoading(true);
      setStep(3); // Move to the next step
    } catch (error) {
      setError("Failed to save farmer details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectPlan = (plan: 'free' | 'premium') => {
    setSelectedPlan(plan);
    if (plan === 'free') {
      // Skip payment step for free plan
      setStep(4);
    } else {
      setStep(4); // For premium, proceed to payment
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center ${step > 1 ? 'text-emerald-600' : 'text-gray-600'}`}>
          <div className={`rounded-full p-2 ${step >= 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
            <MapPin className="h-6 w-6" />
          </div>
          <span className="ml-2 text-sm font-medium">Farm Details</span>
        </div>
        <ChevronsRight className={`h-4 w-4 ${step > 1 ? 'text-emerald-600' : 'text-gray-300'}`} />
        <div className={`flex items-center ${step > 2 ? 'text-emerald-600' : 'text-gray-600'}`}>
          <div className={`rounded-full p-2 ${step >= 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
            <User className="h-6 w-6" />
          </div>
          <span className="ml-2 text-sm font-medium">Farmer Account</span>
        </div>
        <ChevronsRight className={`h-4 w-4 ${step > 2 ? 'text-emerald-600' : 'text-gray-300'}`} />
        <div className={`flex items-center ${step > 3 ? 'text-emerald-600' : 'text-gray-600'}`}>
          <div className={`rounded-full p-2 ${step >= 3 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
            <CreditCard className="h-6 w-6" />
          </div>
          <span className="ml-2 text-sm font-medium">Plan Selection</span>
        </div>
      </div>
    </div>
  );

  const renderFarmDetailsForm = () => (
    <form onSubmit={handleSubmitFarm(onSubmitFarmDetails)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Farm Name
        </label>
        <input
          type="text"
          id="name"
          {...registerFarm('name')}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
        {farmErrors.name && (
          <p className="mt-1 text-sm text-red-600">{farmErrors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          {...registerFarm('location')}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
        {farmErrors.location && (
          <p className="mt-1 text-sm text-red-600">{farmErrors.location.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
          Specialty
        </label>
        <input
          type="text"
          id="specialty"
          {...registerFarm('specialty')}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
        {farmErrors.specialty && (
          <p className="mt-1 text-sm text-red-600">{farmErrors.specialty.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...registerFarm('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        />
        {farmErrors.description && (
          <p className="mt-1 text-sm text-red-600">{farmErrors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Next Step
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </form>
  );

  const renderFarmerDetailsForm = () => (
    <form onSubmit={handleSubmitFarmer(onSubmitFarmerDetails)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            {...registerFarmer('firstName')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
          {farmerErrors.firstName && (
            <p className="mt-1 text-sm text-red-600">{farmerErrors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            {...registerFarmer('lastName')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
          {farmerErrors.lastName && (
            <p className="mt-1 text-sm text-red-600">{farmerErrors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          {...registerFarmer('email')}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
        {farmerErrors.email && (
          <p className="mt-1 text-sm text-red-600">{farmerErrors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          {...registerFarmer('phone')}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
        {farmerErrors.phone && (
          <p className="mt-1 text-sm text-red-600">{farmerErrors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            {...registerFarmer('password')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {farmerErrors.password && (
          <p className="mt-1 text-sm text-red-600">{farmerErrors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="mt-1 relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            {...registerFarmer('confirmPassword')}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {farmerErrors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{farmerErrors.confirmPassword.message}</p>
        )}
      </div>

      {password && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">
            Password must contain:
          </p>
          <ul className="space-y-1">
            <li className="flex items-center text-xs">
              {passwordStrength.minLength ? (
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <AlertCircle className="h-3 w-3 text-gray-300 mr-1" />
              )}
              <span
                className={
                  passwordStrength.minLength
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                At least 8 characters
              </span>
            </li>
            <li className="flex items-center text-xs">
              {passwordStrength.hasUppercase ? (
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <AlertCircle className="h-3 w-3 text-gray-300 mr-1" />
              )}
              <span
                className={
                  passwordStrength.hasUppercase
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                At least one uppercase letter
              </span>
            </li>
            <li className="flex items-center text-xs">
              {passwordStrength.hasLowercase ? (
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <AlertCircle className="h-3 w-3 text-gray-300 mr-1" />
              )}
              <span
                className={
                  passwordStrength.hasLowercase
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                At least one lowercase letter
              </span>
            </li>
            <li className="flex items-center text-xs">
              {passwordStrength.hasNumber ? (
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <AlertCircle className="h-3 w-3 text-gray-300 mr-1" />
              )}
              <span
                className={
                  passwordStrength.hasNumber
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                At least one number
              </span>
            </li>
            <li className="flex items-center text-xs">
              {passwordStrength.hasSpecialChar ? (
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <AlertCircle className="h-3 w-3 text-gray-300 mr-1" />
              )}
              <span
                className={
                  passwordStrength.hasSpecialChar
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                At least one special character
              </span>
            </li>
          </ul>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Next Step
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </form>
  );

  const renderPlanSelection = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Free Plan */}
        <div className={`border rounded-lg p-6 ${selectedPlan === 'free' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
          <h3 className="text-lg font-medium text-gray-900">Free Trial</h3>
          <p className="mt-2 text-sm text-gray-500">Start with a free trial to explore AgriConnect.</p>
          <p className="mt-4">
            <span className="text-3xl font-bold text-gray-900">$0</span>
            <span className="text-sm text-gray-500">/month</span>
          </p>
          <ul className="mt-6 space-y-4">
            <li className="flex items-center">
              <Check className="h-4 w-4 text-emerald-500 mr-2" />
              <span className="text-sm text-gray-600">1-month free access</span>
            </li>
            <li className="flex items-center">
              <Check className="h-4 w-4 text-emerald-500 mr-2" />
              <span className="text-sm text-gray-600">Basic features</span>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => onSelectPlan('free')}
            className={`mt-8 w-full inline-flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-md ${
              selectedPlan === 'free'
                ? 'border-transparent text-white bg-emerald-600 hover:bg-emerald-700'
                : 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            Select Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className={`border rounded-lg p-6 ${selectedPlan === 'premium' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
          <h3 className="text-lg font-medium text-gray-900">Premium</h3>
          <p className="mt-2 text-sm text-gray-500">Unlock advanced features for your farm.</p>
          <p className="mt-4">
            <span className="text-3xl font-bold text-gray-900">$10</span>
            <span className="text-sm text-gray-500">/month</span>
          </p>
          <ul className="mt-6 space-y-4">
            <li className="flex items-center">
              <Check className="h-4 w-4 text-emerald-500 mr-2" />
              <span className="text-sm text-gray-600">Advanced analytics</span>
            </li>
            <li className="flex items-center">
              <Check className="h-4 w-4 text-emerald-500 mr-2" />
              <span className="text-sm text-gray-600">Priority support</span>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => onSelectPlan('premium')}
            className={`mt-8 w-full inline-flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-md ${
              selectedPlan === 'premium'
                ? 'border-transparent text-white bg-emerald-600 hover:bg-emerald-700'
                : 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            Select Plan
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100">
        <Check className="h-6 w-6 text-emerald-600" />
      </div>
      <h3 className="mt-2 text-lg font-medium text-gray-900">Registration Successful!</h3>
      <p className="mt-2 text-sm text-gray-500">
        Your farm has been registered successfully. You will be redirected to your dashboard shortly.
      </p>
      <div className="mt-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Register Your Farm</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Complete the following steps to join the AgriConnect Farmers Directory
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderStepIndicator()}
          
          {step === 1 && renderFarmDetailsForm()}
          {step === 2 && renderFarmerDetailsForm()}
          {step === 3 && renderPlanSelection()}
          {step === 4 && renderSuccess()}
        </div>
      </div>
    </div>
  );
};

export default FarmRegistration;