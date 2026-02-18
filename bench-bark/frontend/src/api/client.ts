import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Skip refresh/redirect for these paths (they handle auth state themselves)
const AUTH_PATHS = ['/auth/me', '/auth/login', '/auth/register', '/auth/refresh', '/auth/google'];

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestPath = originalRequest?.url || '';

    // Don't intercept auth endpoints — let them fail naturally
    if (AUTH_PATHS.some((p) => requestPath.includes(p))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        return client(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
