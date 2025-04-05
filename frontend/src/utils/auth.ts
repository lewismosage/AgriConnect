// auth.ts
import axios from 'axios';
import toast from 'react-hot-toast';
import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { User } from '../types/index';

export const handleSocialLogin = async (
  token: string,
  provider: 'google' | 'microsoft',
  setUser: Dispatch<SetStateAction<User | null>>,
  navigate: NavigateFunction
): Promise<boolean> => {
  try {
    const endpoint = `/api/accounts/${provider}-login/`;
    const response = await axios.post<{
      access: string;
      user: User;
    }>(endpoint, { token });
    
    const { access, user } = response.data;
    localStorage.setItem('token', access);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    toast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful!`);
    
    if (user.user_type === 'farmer') {
      navigate('/farmer-dashboard');
    } else {
      navigate('/customer-dashboard');
    }
    
    return true;
  } catch (error) {
    console.error(`${provider} login error:`, error);
    toast.error(`Failed to log in with ${provider}. Please try again.`);
    return false;
  }
};