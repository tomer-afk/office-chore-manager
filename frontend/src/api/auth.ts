import { apiClient } from './client';
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';

export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<User> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials);
    return data.data.user;
  },

  login: async (credentials: LoginCredentials): Promise<User> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data.data.user;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<AuthResponse>('/auth/me');
    return data.data.user;
  },
};
