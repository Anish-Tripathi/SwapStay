
import axios from 'axios';

// Create an axios instance with our base URL and default headers
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true 
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
   
    return response;
  },
  error => {
    console.error(`API Response Error: ${error.response?.status || 'NETWORK ERROR'}`, 
      error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth-related API calls
export const authAPI = {
  sendReactivationOTP: (email) => {
    return api.post('/api/auth/reactivate/send-otp', { email });
  },
  
  verifyReactivationOTP: (email, otp) => {
    return api.put('/api/auth/reactivate/verify-otp', { email, otp });
  }
};

export default api;