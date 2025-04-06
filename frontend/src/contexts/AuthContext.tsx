// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "./axioConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, FarmerProfile } from '../types';
import { checkSubscriptionAccess } from "../services/subscriptionService";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";

// Add axios interceptor for token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add axios interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message =
        error.response.data?.detail ||
        error.response.data?.message ||
        error.response.data?.error ||
        "An error occurred";

      if (
        error.response.status === 401 &&
        !error.config.url?.includes("/api/accounts/login/")
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      toast.error(
        typeof message === "string" ? message : JSON.stringify(message)
      );
    } else if (error.request) {
      toast.error("No response from server. Please check your connection.");
    } else {
      toast.error("Error setting up the request.");
    }
    return Promise.reject(error);
  }
);

export interface Farm {
  id: string;
  name: string;
  location: string;
  description: string;
  image?: string;
  farmer?: number;
  specialty: string;
  farm_image?: string;
  rating: number;
  about: string;
  sustainability: string;
  ratings?: any[];
  farmer_profile?: {
    about?: string;
    sustainability?: string;
    farm_image?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  farm: Farm;
  ratingCount?: number;
  price: number;
  rating: number;
  image?: string;
  category: string;
  description: string;
  isOrganic: boolean;
  inStock: boolean;
  localDelivery: boolean;
  unit?: string;
}

interface SubscriptionStatus {
  has_access: boolean;
  message?: string;
  subscription?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  subscriptionStatus: SubscriptionStatus | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ error?: string; subscriptionData?: any } | void>;
  register: (userData: RegisterData) => Promise<void>;
  registerFarmer: (farmerData: FarmerRegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateFarmerProfile: (
    farmerProfile: Partial<FarmerProfile> | FormData
  ) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  checkSubscription: () => Promise<void>;
  handleGoogleLogin: (credentialResponse: any) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  is_farmer?: boolean;
  is_consumer?: boolean;
  profile_picture?: File;
}

export interface FarmerRegisterData {
  user: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    user_type: string;
  };
  farmer_profile: {
    farm_name: string;
    location: string;
    specialty: string;
    description: string;
    farm_image?: File | null;
  };
  subscription_plan?: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/api/accounts/user/");

      const processedUser = {
        ...response.data,
        farmer_profile: response.data.farmer_profile
          ? {
              ...response.data.farmer_profile,
              farm_image: response.data.farmer_profile.farm_image
                ? response.data.farmer_profile.farm_image.startsWith("http")
                  ? response.data.farmer_profile.farm_image
                  : `${import.meta.env.VITE_BACKEND_URL}${
                      response.data.farmer_profile.farm_image
                    }`
                : null,
            }
          : null,
      };

      setUser(processedUser);
      localStorage.setItem("user", JSON.stringify(processedUser));
    } catch (error) {
      console.error("Auth status check failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!user || user.user_type !== "farmer") {
      setSubscriptionStatus(null);
      return;
    }
  
    try {
      const response = await axios.get('/api/subscriptions/check-access/');
      setSubscriptionStatus(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 402) {
          const subscriptionData = error.response.data?.subscription;
          setSubscriptionStatus({
            has_access: false,
            message: error.response.data?.message || 'Subscription required',
            subscription: subscriptionData || null
          });
        } else {
          console.error("Failed to check subscription:", error);
          setSubscriptionStatus({
            has_access: false,
            message: "Failed to verify subscription status",
            subscription: null
          });
        }
      } else {
        console.error("Unexpected error checking subscription:", error);
        setSubscriptionStatus({
          has_access: false,
          message: "Unexpected error",
          subscription: null
        });
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/accounts/login/", {
        email,
        password,
      });

      const { access, user, user_type, farmer_profile } = response.data;

      const processedUser = {
        ...user,
        farmer_profile: farmer_profile
          ? {
              ...farmer_profile,
              farm_image: farmer_profile.farm_image
                ? farmer_profile.farm_image.startsWith("http")
                  ? farmer_profile.farm_image
                  : `${import.meta.env.VITE_BACKEND_URL}${
                      farmer_profile.farm_image
                    }`
                : null,
            }
          : null,
      };

      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(processedUser));
      setUser(processedUser);

      if (user_type === "farmer") {
        await checkSubscription();
      }

      toast.success("Login successful!");

      if (user_type === "farmer") {
        navigate("/farmer-dashboard");
      } else {
        navigate("/customer-dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        const message = error.response.data.detail || "Invalid credentials";
        toast.error(message);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post("/api/accounts/register/", userData);
      const { access, user } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast.success("Registration successful!");
      navigate("/customer-dashboard");
    } catch (error) {
      console.error("Registration failed:", error);

      if (axios.isAxiosError(error) && error.response?.data) {
        if (error.response.data.email) {
          const emailError = error.response.data.email[0];
          throw new Error(emailError);
        } else {
          const errorMessage = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
          throw new Error(errorMessage);
        }
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    }
  };

  const registerFarmer = async (farmerData: FarmerRegisterData) => {
    try {
      const formData = new FormData();
      formData.append("user[email]", farmerData.user.email);
      formData.append("user[password]", farmerData.user.password);
      formData.append("user[first_name]", farmerData.user.first_name);
      formData.append("user[last_name]", farmerData.user.last_name);
      formData.append("user[phone_number]", farmerData.user.phone_number);
      formData.append("user[user_type]", farmerData.user.user_type);

      formData.append("farmer_profile[farm_name]", farmerData.farmer_profile.farm_name);
      formData.append("farmer_profile[location]", farmerData.farmer_profile.location);
      formData.append("farmer_profile[specialty]", farmerData.farmer_profile.specialty);
      formData.append("farmer_profile[description]", farmerData.farmer_profile.description);

      if (farmerData.farmer_profile.farm_image) {
        formData.append("farmer_profile[farm_image]", farmerData.farmer_profile.farm_image);
      }

      if (farmerData.subscription_plan) {
        formData.append("subscription_plan", farmerData.subscription_plan);
      }

      const response = await axios.post(
        "/api/accounts/register/farmer/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { access, user } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      if (farmerData.subscription_plan) {
        try {
          await axios.post(
            "/api/subscriptions/create/",
            { plan: farmerData.subscription_plan },
            {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            }
          );
        } catch (subError) {
          console.error("Subscription creation error:", subError);
        }
      }
      
      await checkSubscription();
      return response.data;
    } catch (error) {
      console.error("Farmer registration failed:", error);

      let errorMessage = "Farmer registration failed. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage =
            "The email or phone number is already registered. Please use different credentials.";
        } else if (error.response?.data) {
          const errors = error.response.data;
          if (errors.email) {
            errorMessage = `Email: ${errors.email[0]}`;
          } else if (errors.phone_number) {
            errorMessage = `Phone number: ${errors.phone_number[0]}`;
          } else if (errors.detail) {
            errorMessage = errors.detail;
          }
        }
      }

      throw new Error(errorMessage);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const response = await axios.post("/api/accounts/google-login/", {
        token: credentialResponse.credential,
      });
  
      const { access, user, user_type, farmer_profile } = response.data;
  
      const processedUser = {
        ...user,
        farmer_profile: farmer_profile
          ? {
              ...farmer_profile,
              farm_image: farmer_profile.farm_image
                ? farmer_profile.farm_image.startsWith("http")
                  ? farmer_profile.farm_image
                  : `${import.meta.env.VITE_BACKEND_URL}${farmer_profile.farm_image}`
                : null,
            }
          : null,
      };
  
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(processedUser));
      setUser(processedUser);
  
      if (user_type === "farmer") {
        await checkSubscription();
      }
  
      toast.success(
        response.status === 201 
          ? "Google registration successful!" 
          : "Google login successful!"
      );
  
      if (user_type === "farmer") {
        navigate("/farmer-dashboard");
      } else {
        navigate("/customer-dashboard");
      }
    } catch (error) {
      console.error("Google authentication error:", error);
      
      let errorMessage = "Failed to authenticate with Google. Please try again.";
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast.error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/accounts/logout/");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      googleLogout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await axios.patch(
        `/api/auth/user/${user?.id}/`,
        userData
      );
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Profile update failed. Please try again.");
      throw error;
    }
  };

  const updateFarmerProfile = async (
    farmerProfile: Partial<FarmerProfile> | FormData
  ) => {
    try {
      const isFormData = farmerProfile instanceof FormData;
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
        },
      };

      const data = isFormData ? farmerProfile : farmerProfile;

      const response = await axios.patch(
        "/api/accounts/farmer/profile/update/",
        data,
        config
      );

      if (user) {
        const updatedUser = {
          ...user,
          farmer_profile: {
            ...user.farmer_profile,
            ...response.data.farmer_profile,
          },
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return response.data;
    } catch (error) {
      console.error("Failed to update farm details:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    subscriptionStatus,
    setUser,
    login,
    register,
    registerFarmer,
    logout,
    updateUser,
    updateFarmerProfile,
    checkSubscription,
    handleGoogleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
};

export default AuthContext;