import { api, getErrorMessage } from '../config/axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  AuthTokens,
} from '../interface/auth.interface';

const BASE_ENDPOINT = '/auth';

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(`${BASE_ENDPOINT}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(`${BASE_ENDPOINT}/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post(`${BASE_ENDPOINT}/logout`);
  } catch (error) {
    console.warn('Logout request failed:', getErrorMessage(error));
  }
};

export const refreshToken = async (): Promise<AuthTokens> => {
  try {
    const response = await api.post<{ tokens: AuthTokens }>(`${BASE_ENDPOINT}/refresh`);
    return response.data.tokens;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.post<User>(`${BASE_ENDPOINT}/me`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    await getCurrentUser();
    return true;
  } catch (error) {
    return false;
  }
};

// Legacy object export for backward compatibility
export const authService = {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  checkAuthStatus,
};

export default authService;