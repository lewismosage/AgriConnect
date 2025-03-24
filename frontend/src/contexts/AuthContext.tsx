// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from './axioConfig';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

      // Skip redirect for login endpoint
      if (error.response.status === 401 && !error.config.url?.includes("/api/accounts/login/")) {
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

// Define the FarmerProfile interface
export interface FarmerProfile {
  id: string;
  farm_name: string;
  location: string;
  specialty: string;
  description: string;
  farm_image?: string;
  about?: string;
  sustainability?: string;
  // ... any other existing fields
}

//Farm Type
export interface Farm {
  id: string;
  name: string; 
  location: string;
  rating?: number;
  specialty?: string;
  description: string;
  image: string;
  about?: string;
  sustainability?: string;
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
}

// Update the User interface to include farmer_profile
interface User {
  id: number;
  email: string;
  username: string;
  first_name: string; 
  last_name: string;  
  phone_number?: string;
  profile_picture?: string;
  user_type: string; 
  date_joined?: string;
  is_farmer?: boolean;  
  is_consumer?: boolean;
  farmer_profile?: FarmerProfile;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  registerFarmer: (farmerData: FarmerRegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateFarmerProfile: (farmerProfile: Partial<FarmerProfile>) => Promise<void>; // Add this function
  setUser: (user: User | null) => void;
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
}

// Create and export AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export useAuth hook
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
  const [loading, setLoading] = useState(true); // Start with loading true
  const navigate = useNavigate();

  // Restore user from localStorage on app initialization
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // Restore user from localStorage
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    // Validate token and fetch user data
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
      
      // Process the user data with full farm image URL
      const processedUser = {
        ...response.data,
        farmer_profile: response.data.farmer_profile 
          ? {
              ...response.data.farmer_profile,
              farm_image: response.data.farmer_profile.farm_image 
                ? (response.data.farmer_profile.farm_image.startsWith('http') 
                    ? response.data.farmer_profile.farm_image 
                    : `${import.meta.env.VITE_BACKEND_URL}${response.data.farmer_profile.farm_image}`)
                : null
            }
          : null
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

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/accounts/login/", {
        email,
        password,
      });
  
      const { access, user, user_type, farmer_profile } = response.data;
  
      // Ensure the farm_image URL is complete
      const processedUser = {
        ...user,
        farmer_profile: farmer_profile ? {
          ...farmer_profile,
          farm_image: farmer_profile.farm_image 
            ? (farmer_profile.farm_image.startsWith('http') 
                ? farmer_profile.farm_image 
                : `${import.meta.env.VITE_BACKEND_URL}${farmer_profile.farm_image}`)
            : null
        } : null
      };
  
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(processedUser));
  
      setUser(processedUser);
  
      toast.success("Login successful!");
  
      if (user_type === 'farmer') {
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
        // Check for the specific email error
        if (error.response.data.email) {
          const emailError = error.response.data.email[0]; // Extract the first error message
          throw new Error(emailError); // Throw the specific email error
        } else {
          // Handle other validation errors
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
      // Create a FormData object
      const formData = new FormData();
  
      // Append user data as nested fields
      formData.append('user[email]', farmerData.user.email);
      formData.append('user[password]', farmerData.user.password);
      formData.append('user[first_name]', farmerData.user.first_name);
      formData.append('user[last_name]', farmerData.user.last_name);
      formData.append('user[phone_number]', farmerData.user.phone_number);
      formData.append('user[user_type]', farmerData.user.user_type);
  
      // Append farmer profile data as nested fields
      formData.append('farmer_profile[farm_name]', farmerData.farmer_profile.farm_name);
      formData.append('farmer_profile[location]', farmerData.farmer_profile.location);
      formData.append('farmer_profile[specialty]', farmerData.farmer_profile.specialty);
      formData.append('farmer_profile[description]', farmerData.farmer_profile.description);
  
      // Append the farm image file if it exists
      if (farmerData.farmer_profile.farm_image) {
        formData.append('farmer_profile[farm_image]', farmerData.farmer_profile.farm_image);
      }
  
      // Send the request with multipart/form-data
      const response = await axios.post('/api/accounts/register/farmer/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type
        },
      });
  
      const { access, user, farmer_profile } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      toast.success('Farmer registration successful!');
      return response.data; // Return the response data
    } catch (error) {
      console.error('Farmer registration failed:', error);
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorMessage = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        toast.error(errorMessage);
      } else {
        toast.error('Farmer registration failed. Please try again.');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/accounts/logout/");
      localStorage.removeItem("token");
      localStorage.removeItem("user"); 
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await axios.patch(`/api/auth/user/${user?.id}/`, userData);
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data)); // Save updated user data
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Profile update failed. Please try again.");
      throw error;
    }
  };

  const updateFarmerProfile = async (farmerProfile: Partial<FarmerProfile>) => {
    try {
      const formData = new FormData();
      if (farmerProfile.farm_name) formData.append('farm_name', farmerProfile.farm_name);
      if (farmerProfile.location) formData.append('location', farmerProfile.location);
      if (farmerProfile.specialty) formData.append('specialty', farmerProfile.specialty);
      if (farmerProfile.description) formData.append('description', farmerProfile.description);
  
      // Append farm_image only if it's a File
      if (farmerProfile.farm_image && typeof farmerProfile.farm_image !== 'string') {
        formData.append('farm_image', farmerProfile.farm_image);
      }
  
      const response = await axios.patch(`/api/accounts/farmer/profile/update/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Update the user context with the new farmer profile data
      if (user) {
        const updatedUser = {
          ...user,
          farmer_profile: {
            ...user.farmer_profile,
            ...response.data, // Update with the new farm details
          },
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Save updated user data
      }
  
      toast.success("Farm details updated successfully!");
    } catch (error) {
      console.error("Failed to update farm details:", error);
      toast.error("Failed to update farm details. Please try again.");
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    registerFarmer, 
    logout,
    updateUser,
    updateFarmerProfile, // Add the new function to the context value
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;