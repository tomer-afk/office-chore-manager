import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import type { LoginCredentials, RegisterCredentials } from '../types/auth';
import { ROUTES } from '../config/constants';

export function useAuthCheck() {
  const { setUser } = useAuthStore();

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const data = await authApi.getCurrentUser();
        setUser(data.user);
        return data.user;
      } catch {
        setUser(null);
        return null;
      }
    },
    retry: false,
    staleTime: Infinity,
  });

  return {
    isLoading: query.isLoading,
    isResolved: query.isFetched,
  };
}

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setUser, logout: clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginCredentials) => authApi.login(data),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['currentUser'], data.user);
      toast.success('Welcome back!');
      navigate(ROUTES.DASHBOARD);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterCredentials) => authApi.register(data),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['currentUser'], data.user);
      toast.success('Account created!');
      navigate(ROUTES.DASHBOARD);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Registration failed');
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: (credential: string) => authApi.googleLogin(credential),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['currentUser'], data.user);
      toast.success('Welcome!');
      navigate(ROUTES.DASHBOARD);
    },
    onError: () => {
      toast.error('Google login failed');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate(ROUTES.LOGIN);
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    googleLogin: googleLoginMutation.mutate,
    logout: logoutMutation.mutate,
  };
}
