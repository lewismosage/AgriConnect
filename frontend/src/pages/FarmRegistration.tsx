import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, ChevronsRight, MapPin, User, CreditCard, ArrowRight, Upload } from 'lucide-react';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { FarmerRegisterData, useAuth } from '../contexts/AuthContext'; // Import useAuth

// Validation schemas
const farmDetailsSchema = z.object({
  name: z.string().min(3, 'Farm name must be at least 3 characters'),
  location: z.string().min(1, 'Please enter a location'),
  specialty: z.string().min(1, 'Please enter a specialty'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  // We'll handle the image validation separately since it's not a simple text field
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
  path: ['confirmPassword'],
});

const paymentDetailsSchema = z.object({
  paymentMethod: z.enum(['mpesa', 'bank']), // Payment method
  mpesaNumber: z.string().optional(), // MPESA number
  bankDetails: z.object({
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    name: z.string().optional(),
  }).optional(), // Bank details
});

type FarmDetailsForm = z.infer<typeof farmDetailsSchema>;
type FarmerDetailsForm = z.infer<typeof farmerDetailsSchema>;
type PaymentDetailsForm = z.infer<typeof paymentDetailsSchema>;

const FarmRegistration = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const {
    register: registerFarm,
    handleSubmit: handleSubmitFarm,
    formState: { errors: farmErrors },
    watch: watchFarm,
  } = useForm<FarmDetailsForm>({
    resolver: zodResolver(farmDetailsSchema),
  });

  const {
    register: registerFarmerForm, // Renamed to avoid conflict
    handleSubmit: handleSubmitFarmer,
    formState: { errors: farmerErrors },
    watch: watchFarmer,
  } = useForm<FarmerDetailsForm>({
    resolver: zodResolver(farmerDetailsSchema),
    defaultValues: {
      password: '', // Provide a default value for password
    },
  });

  const {
    register: registerPayment,
    handleSubmit: handleSubmitPayment,
    formState: { errors: paymentErrors },
    watch: watchPayment,
  } = useForm<PaymentDetailsForm>({
    resolver: zodResolver(paymentDetailsSchema),
  });

  const { registerFarmer: registerFarmerAuth } = useAuth(); // Access registerFarmer from AuthContext and rename it

  const password = watchFarmer('password'); // Watch password for validation

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    farmName: '',
    location: '',
    specialty: '',
    description: '',
    profileImage: null as File | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePassword = (password: string | undefined) => {
    if (!password) {
      return {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        isValid: false,
      };
    }

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
      isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
    };
  };

  const passwordStrength = validatePassword(password);

  const onSubmitFarmDetails = async (data: FarmDetailsForm) => {
    try {
      setIsLoading(true);

      // Validate profile image
      if (!profileImage) {
        setError('Please upload a farm profile image');
        setIsLoading(false);
        return;
      }

      // Update formData state with farm details
      setFormData((prev) => ({
        ...prev,
        farmName: data.name,
        location: data.location,
        specialty: data.specialty,
        description: data.description,
        profileImage: profileImage,
      }));

      setStep(2); // Move to the next step
    } catch (error) {
      setError('Failed to save farm details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitFarmerDetails = async (data: FarmerDetailsForm) => {
    try {
      setIsLoading(true);
      console.log('Farmer Details Submitted:', data); // Debugging
      setFormData((prev) => ({
        ...prev,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }));
      setStep(3); // Move to the next step
    } catch (error) {
      setError('Failed to save farmer details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectPlan = (plan: 'free' | 'premium') => {
    setSelectedPlan(plan);
    if (plan === 'free') {
      // For free plan, skip the payment step and directly complete registration
      completeRegistration();
    } else {
      // For premium plan, proceed to payment
      setStep(4);
    }
  };

  const completeRegistration = async () => {
    try {
      setIsLoading(true);
  
      // Validate form data before proceeding
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      if (!passwordStrength.isValid) {
        setError('Password does not meet the requirements');
        return;
      }
  
      if (!formData.phoneNumber) {
        setError('Phone number is required');
        return;
      }
  
      // Prepare the farmer registration data
      const farmerData: FarmerRegisterData = {
        user: {
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          user_type: 'farmer',
        },
        farmer_profile: {
          farm_name: formData.farmName,
          location: formData.location,
          specialty: formData.specialty,
          description: formData.description,
          // Include profile image if available
          profile_image: formData.profileImage,
        },
      };
  
      // Submit the farmer registration data to the backend using registerFarmerAuth from AuthContext
      await registerFarmerAuth(farmerData);
  
      // Show success screen
      setStep(5);
  
      // Delay navigation to allow the user to see the success message
      setTimeout(() => {
        navigate('/farmer-dashboard');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPayment = async (data: PaymentDetailsForm) => {
    // For premium plan with payment details
    await completeRegistration();
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className={`flex items-center ${step > 1 ? 'text-emerald-600' : 'text-gray-600'}`}>
          <div className={`rounded-full p-2 ${step >= 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
            <MapPin className="h-6 w-6" />
          </div>
          <span className="ml-2 text-sm font-medium">Farm Details</span>
        </div>
        <ChevronsRight className={`h-4 w-4 ${step > 1 ? 'text-emerald-600' : 'text-gray-300'} hidden sm:block`} />
        <div className={`flex items-center ${step > 2 ? 'text-emerald-600' : 'text-gray-600'}`}>
          <div className={`rounded-full p-2 ${step >= 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
            <User className="h-6 w-6" />
          </div>
          <span className="ml-2 text-sm font-medium">Farmer Account</span>
        </div>
        <ChevronsRight className={`h-4 w-4 ${step > 2 ? 'text-emerald-600' : 'text-gray-300'} hidden sm:block`} />
        <div className={`flex items-center ${step > 3 ? 'text-emerald-600' : 'text-gray-600'}`}>
          <div className={`rounded-full p-2 ${step >= 3 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
            <CreditCard className="h-6 w-6" />
          </div>
          <span className="ml-2 text-sm font-medium">Plan & Payment</span>
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

      {/* Farm Profile Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Farm Profile Image
        </label>
        <div className="flex items-center space-x-4">
          <div 
            className={`relative border-2 border-dashed rounded-md p-4 ${
              imagePreview ? 'border-emerald-300 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'
            } focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500 cursor-pointer`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="flex flex-col items-center justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Profile Preview" 
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <span className="text-xs text-emerald-500 mt-2">Change image</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="block text-sm font-medium text-gray-700">
                    Upload farm image
                  </span>
                  <span className="block text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {error && error.includes('image') && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="inline-block h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></span>
              Processing...
            </>
          ) : (
            <>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
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
            {...registerFarmerForm('firstName')}
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
            {...registerFarmerForm('lastName')}
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
          {...registerFarmerForm('email')}
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
          {...registerFarmerForm('phone')}
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
            {...registerFarmerForm('password')}
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
            {...registerFarmerForm('confirmPassword')}
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
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="inline-block h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></span>
              Processing...
            </>
          ) : (
            <>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );

  const renderPlanSelection = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Free Plan */}
        <div className={`border rounded-lg p-6 ${selectedPlan === 'free' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Free Trial</h3>
              <p className="mt-2 text-sm text-gray-500">Start with a free trial to explore AgriConnect.</p>
            </div>
            {selectedPlan === 'free' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Selected
              </span>
            )}
          </div>
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
            <li className="flex items-center">
              <Check className="h-4 w-4 text-emerald-500 mr-2" />
              <span className="text-sm text-gray-600">No payment required</span>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => onSelectPlan('free')}
            disabled={isLoading}
            className={`mt-8 w-full inline-flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-md ${
              selectedPlan === 'free'
                ? 'border-transparent text-white bg-emerald-600 hover:bg-emerald-700'
                : 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading && selectedPlan === 'free' ? (
              <>
                <span className="inline-block h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></span>
                Processing...
              </>
            ) : (
              'Select Free Trial'
            )}
          </button>
        </div>

        {/* Premium Plan */}
        <div className={`border rounded-lg p-6 ${selectedPlan === 'premium' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Premium</h3>
              <p className="mt-2 text-sm text-gray-500">Full access to all premium features.</p>
            </div>
            {selectedPlan === 'premium' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Selected
              </span>
            )}
          </div>
          <p className="mt-4">
            <span className="text-3xl font-bold text-gray-900">$19.99</span>
            <span className="text-sm text-gray-500">/month</span>
          </p>
          <ul className="mt-6 space-y-4">
            <li className="flex items-center">
              <Check className="h-4 w-4 text-emerald-500 mr-2" />
              <span className="text-sm text-gray-600">Unlimited product listings</span>
            </li>
            <li className="flex items-center">
              <Check className="h-4 w-4 text-emerald-500 mr-2" />
              <span className="text-sm text-gray-600">Premium analytics</span>
            </li>
            <li className="flex items-center">
              <Check className="h-4 w-4 text-emerald-500 mr-2" />
              <span className="text-sm text-gray-600">Priority customer support</span>
            </li>
            <li className="flex items-center">
              <Check className="h-4 w-4 text-emerald-500 mr-2" />
              <span className="text-sm text-gray-600">Advanced marketing tools</span>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => onSelectPlan('premium')}
            disabled={isLoading}
            className={`mt-8 w-full inline-flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-md ${
              selectedPlan === 'premium'
                ? 'border-transparent text-white bg-emerald-600 hover:bg-emerald-700'
                : 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading && selectedPlan === 'premium' ? (
              <>
                <span className="inline-block h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></span>
                Processing...
              </>
            ) : (
              'Select Premium Plan'
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <form onSubmit={handleSubmitPayment(onSubmitPayment)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative">
            <input
              type="radio"
              id="mpesa"
              value="mpesa"
              {...registerPayment('paymentMethod')}
              className="sr-only"
            />
            <label
              htmlFor="mpesa"
              className={`block p-4 border rounded-md cursor-pointer ${
                watchPayment('paymentMethod') === 'mpesa'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`rounded-full w-5 h-5 border flex items-center justify-center ${
                  watchPayment('paymentMethod') === 'mpesa' 
                    ? 'border-emerald-500' 
                    : 'border-gray-400'
                }`}>
                  {watchPayment('paymentMethod') === 'mpesa' && (
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  )}
                </div>
                <span className="ml-3 font-medium">M-PESA</span>
              </div>
            </label>
          </div>

          <div className="relative">
            <input
              type="radio"
              id="bank"
              value="bank"
              {...registerPayment('paymentMethod')}
              className="sr-only"
            />
            <label
              htmlFor="bank"
              className={`block p-4 border rounded-md cursor-pointer ${
                watchPayment('paymentMethod') === 'bank'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`rounded-full w-5 h-5 border flex items-center justify-center ${
                  watchPayment('paymentMethod') === 'bank' 
                    ? 'border-emerald-500' 
                    : 'border-gray-400'
                }`}>
                  {watchPayment('paymentMethod') === 'bank' && (
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  )}
                </div>
                <span className="ml-3 font-medium">Bank Card</span>
              </div>
            </label>
          </div>
        </div>
        {paymentErrors.paymentMethod && (
          <p className="mt-1 text-sm text-red-600">{paymentErrors.paymentMethod.message}</p>
        )}
      </div>

      {/* Conditional payment fields based on payment method */}
      {watchPayment('paymentMethod') === 'mpesa' && (
        <div>
          <label htmlFor="mpesaNumber" className="block text-sm font-medium text-gray-700">
            M-PESA Phone Number
          </label>
          <input
            type="tel"
            id="mpesaNumber"
            {...registerPayment('mpesaNumber')}
            placeholder="e.g., 254712345678"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          />
          {paymentErrors.mpesaNumber && (
            <p className="mt-1 text-sm text-red-600">{paymentErrors.mpesaNumber.message}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            You will receive an STK push to complete the payment.
          </p>
        </div>
      )}

      {watchPayment('paymentMethod') === 'bank' && (
        <>
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              {...registerPayment('bankDetails.cardNumber')}
              placeholder="XXXX XXXX XXXX XXXX"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
            {paymentErrors.bankDetails?.cardNumber && (
              <p className="mt-1 text-sm text-red-600">{paymentErrors.bankDetails.cardNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                {...registerPayment('bankDetails.expiryDate')}
                placeholder="MM/YY"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              />
              {paymentErrors.bankDetails?.expiryDate && (
                <p className="mt-1 text-sm text-red-600">{paymentErrors.bankDetails.expiryDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                {...registerPayment('bankDetails.cvv')}
                placeholder="123"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              />
              {paymentErrors.bankDetails?.cvv && (
                <p className="mt-1 text-sm text-red-600">{paymentErrors.bankDetails.cvv.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardHolderName"
              {...registerPayment('bankDetails.name')}
              placeholder="John Doe"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
            {paymentErrors.bankDetails?.name && (
              <p className="mt-1 text-sm text-red-600">{paymentErrors.bankDetails.name.message}</p>
            )}
          </div>
        </>
      )}

      {/* Order Summary */}
      <div className="mt-6 bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-900">Order Summary</h3>
        <div className="mt-2 border-t border-gray-200 pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Premium Plan (Monthly)</span>
            <span className="font-medium text-gray-900">$19.99</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Taxes</span>
            <span className="font-medium text-gray-900">$0.00</span>
          </div>
          <div className="flex justify-between text-base mt-2 border-t border-gray-200 pt-2">
            <span className="font-medium">Total</span>
            <span className="font-medium text-gray-900">$19.99</span>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(3)}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading || !watchPayment('paymentMethod')}
          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="inline-block h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></span>
              Processing...
            </>
          ) : (
            'Complete Registration'
          )}
        </button>
      </div>
    </form>
  );

  const renderSuccessScreen = () => (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-gray-900">Registration Successful!</h2>
      <p className="mt-2 text-lg text-gray-500">
        Your farm has been successfully registered on AgriConnect.
      </p>
      <p className="mt-1 text-sm text-gray-500">
        {selectedPlan === 'free' 
          ? 'You have started your free trial. Enjoy exploring AgriConnect!'
          : 'Your premium account is now active. Enjoy all the premium features!'}
      </p>
      <div className="mt-8">
        <button
          type="button"
          onClick={() => navigate('/farmer-dashboard')}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Farm Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1 && "Tell us about your farm"}
          {step === 2 && "Create your farmer account"}
          {step === 3 && "Choose your subscription plan"}
          {step === 4 && "Complete your payment details"}
          {step === 5 && "Welcome to AgriConnect!"}
        </p>
      </div>

      {/* Progress steps (don't show on success screen) */}
      {step < 5 && renderStepIndicator()}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Error display at the top if global error */}
          {error && !error.includes('image') && step !== 5 && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p>{error}</p>
            </div>
          )}

          {step === 1 && renderFarmDetailsForm()}
          {step === 2 && renderFarmerDetailsForm()}
          {step === 3 && renderPlanSelection()}
          {step === 4 && renderPaymentForm()}
          {step === 5 && renderSuccessScreen()}
        </div>
      </div>
    </div>
  );
};

export default FarmRegistration;