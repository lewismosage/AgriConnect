// axiosConfig.tsx
import axios from 'axios';

// Configure Axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

// Add request interceptor to include CSRF token
axios.interceptors.request.use(async (config) => {
  if (config.method?.toLowerCase() === 'post' || config.method?.toLowerCase() === 'put' || config.method?.toLowerCase() === 'delete') {
    const csrfToken = await axios.get("/api/csrf-token/").then((res) => res.data.csrfToken);
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

export default axios;