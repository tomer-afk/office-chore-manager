import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login if needed
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);
