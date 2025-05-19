
import axios from 'axios';

const api = axios.create({
  withCredentials: true 
});


api.interceptors.response.use(
  response => response,
  error => {

    if (error.response?.status === 401 && error.response?.data?.redirectTo) {
      
      window.location.href = '/auth';
      return Promise.reject(new Error('Authentication required'));
    }
    return Promise.reject(error);
  }
);

export default api;