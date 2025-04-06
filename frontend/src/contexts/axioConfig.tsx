import axios, { InternalAxiosRequestConfig } from 'axios';

// Use VITE_API_URL from environment or fallback to Render backend URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://agriconnect-gfca.onrender.com";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// Request interceptor with proper typing
axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Only add CSRF token for same-origin requests
  if (config.url && (!config.url.startsWith('http') || 
      new URL(config.url, axios.defaults.baseURL).origin === window.location.origin)) {
    const csrfToken = getCsrfTokenFromCookies();
    if (csrfToken && config.method?.toLowerCase() !== 'get') {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }
  
  return config;
});

// Response interceptor for error handling
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Backend connection failed - is the server running?');
    }
    return Promise.reject(error);
  }
);

function getCsrfTokenFromCookies(): string | undefined {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
}

export default axios;