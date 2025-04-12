import axios from 'axios';

// Configure Axios defaults
// axiosConfig.tsx
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://agriconnect-backend-2f31.onrender.com";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

// Add request interceptor to include JWT token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add CSRF token to headers for non-GET requests
  if (config.method !== 'get' && config.method !== 'GET') {
    const csrfToken = getCsrfTokenFromCookies(); // Helper function to get CSRF token from cookies
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }

  return config;
});

// Helper function to extract CSRF token from cookies
function getCsrfTokenFromCookies() {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue;
}

export default axios;