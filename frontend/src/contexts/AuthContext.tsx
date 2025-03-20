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
interface FarmerProfile {
  farm_name: string;
  location: string;
  specialty: string;
  description: string;
  farm_image?: string | null;
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
      setLoading(false); // No token, stop loading
      return;
    }
  
    try {
      const response = await axios.get("/api/accounts/user/");  
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data)); // Save user to localStorage
    } catch (error) {
      console.error("Auth status check failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Clear user data on error
      setUser(null);
    } finally {
      setLoading(false); // Stop loading after auth check
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login/", {
        email,
        password,
      });
  
      const { access, user, user_type } = response.data;
  
      console.log("User object from login:", user);  // Log the user object
  
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(user));
  
      setUser(user);
  
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
      const response = await axios.post("/api/auth/register/", userData);
      const { access, user } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast.success("Registration successful!");
      navigate("/customer-dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorMessage = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        toast.error(errorMessage);
      } else {
        toast.error("Registration failed. Please try again.");
      }
      throw error;
    }
  };
  
  const registerFarmer = async (farmerData: FarmerRegisterData) => {
    try {
      const response = await axios.post("/api/accounts/register/farmer/", farmerData);
      const { access, user, farmer_profile } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast.success("Farmer registration successful!");
      return response.data; // Return the response data
    } catch (error) {
      console.error("Farmer registration failed:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorMessage = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        toast.error(errorMessage);
      } else {
        toast.error("Farmer registration failed. Please try again.");
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

  const value = {
    user,
    loading,
    login,
    register,
    registerFarmer, 
    logout,
    updateUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;