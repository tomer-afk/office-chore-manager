export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
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
  success: boolean;
  data: {
    user: User;
  };
  message: string;
}
