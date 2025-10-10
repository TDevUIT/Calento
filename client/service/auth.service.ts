import { api, getErrorMessage } from '../config/axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  AuthTokens,
  ApiSuccessResponse,
} from '../interface/auth.interface';

const BASE_ENDPOINT = 'auth';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api';

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<ApiSuccessResponse<AuthResponse>>(
      `${API_PREFIX}/${BASE_ENDPOINT}/register`, 
      userData,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<ApiSuccessResponse<AuthResponse>>(
      `${API_PREFIX}/${BASE_ENDPOINT}/login`, 
      credentials,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post(`${API_PREFIX}/${BASE_ENDPOINT}/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.warn('Logout request failed:', getErrorMessage(error));
  }
};

export const refreshToken = async (): Promise<AuthTokens> => {
  try {
    const response = await api.post<ApiSuccessResponse<{ tokens: AuthTokens }>>(
      `${API_PREFIX}/${BASE_ENDPOINT}/refresh`,
      {},
      { withCredentials: true }
    );
    return response.data.data.tokens;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.post<ApiSuccessResponse<User>>(
      `${API_PREFIX}/${BASE_ENDPOINT}/me`,
      {},
      { withCredentials: true }
    );
    return response.data.data;
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

export const authService = {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  checkAuthStatus,
};

export default authService;