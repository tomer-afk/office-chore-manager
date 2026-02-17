import client from './client';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';

export const authApi = {
  register: (data: RegisterCredentials) =>
    client.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: LoginCredentials) =>
    client.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  googleLogin: (credential: string) =>
    client.post<AuthResponse>('/auth/google', { credential }).then((r) => r.data),

  logout: () =>
    client.post('/auth/logout').then((r) => r.data),

  getCurrentUser: () =>
    client.get<AuthResponse>('/auth/me').then((r) => r.data),
};
