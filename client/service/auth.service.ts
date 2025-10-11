import { api, getErrorMessage } from '../config/axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  AuthTokens,
  ApiSuccessResponse,
} from '../interface/auth.interface';
import { API_ROUTES } from '../constants/routes';

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<ApiSuccessResponse<AuthResponse>>(
      API_ROUTES.AUTH_REGISTER, 
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
      API_ROUTES.AUTH_LOGIN, 
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
    await api.post(API_ROUTES.AUTH_LOGOUT, {}, { withCredentials: true });
  } catch (error) {
    // Silently fail - logout should always succeed on client side
    if (process.env.NODE_ENV === 'development') {
      console.warn('Logout request failed:', getErrorMessage(error));
    }
  }
};

export const refreshToken = async (): Promise<AuthTokens> => {
  try {
    const response = await api.post<ApiSuccessResponse<{ tokens: AuthTokens }>>(
      API_ROUTES.AUTH_REFRESH,
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
      API_ROUTES.AUTH_ME,
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