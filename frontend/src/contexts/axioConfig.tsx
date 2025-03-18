import axios from 'axios';

// Configure Axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

// Add request interceptor to include JWT token
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axios;