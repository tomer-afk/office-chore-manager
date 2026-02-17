export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar_url: string | null;
  weight_unit_preference: 'lbs' | 'kg';
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
}
