import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../config/constants';
import toast from 'react-hot-toast';
import type { LoginCredentials, RegisterCredentials } from '../types/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, clearUser } = useAuthStore();

  // Get current user query
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update store when user data changes
  useEffect(() => {
    if (user) {
      setUser(user);
    } else if (isError) {
      clearUser();
    }
  }, [user, isError, setUser, clearUser]);

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
  });

  // Handle registration
  const register = async (credentials: RegisterCredentials) => {
    try {
      const user = await registerMutation.mutateAsync(credentials);
      setUser(user);
      queryClient.setQueryData(['currentUser'], user);
      toast.success('Registration successful!');
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  // Handle login
  const login = async (credentials: LoginCredentials) => {
    try {
      const user = await loginMutation.mutateAsync(credentials);
      setUser(user);
      queryClient.setQueryData(['currentUser'], user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      clearUser();
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      // Even if logout fails on backend, clear local state
      clearUser();
      queryClient.clear();
      navigate(ROUTES.LOGIN);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
  };
};
