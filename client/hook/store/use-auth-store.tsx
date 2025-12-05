'use client';

import { useCallback } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { LoginRequest, RegisterRequest } from '../../interface';

export const useAuth = () => {
  const store = useAuthStore();
  return store;
};

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleLogin = useCallback(async (credentials: LoginRequest) => {
    clearError();
    return login(credentials);
  }, [login, clearError]);

  return {
    login: handleLogin,
    isLoading,
    error,
  };
};

export const useRegister = () => {
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleRegister = useCallback(async (userData: RegisterRequest) => {
    clearError();
    return register(userData);
  }, [register, clearError]);

  return {
    register: handleRegister,
    isLoading,
    error,
  };
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);

  return {
    logout,
    isLoading,
  };
};

export const useCurrentUser = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
};

export const useAuthActions = () => {
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const clearError = useAuthStore((state) => state.clearError);

  return {
    login,
    register,
    logout,
    refreshToken,
    checkAuthStatus,
    clearError,
  };
};
