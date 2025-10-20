export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar?: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
  full_name?: string;
  reset_token_identifier?: string | null;
  reset_token_secret?: string | null;
  reset_token_expires_at?: string | Date | null;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: User;
  login_at: Date;
}

export interface ApiSuccessResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  status: number;
  timestamp: Date;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token?: string;
}


export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UseAuthReturn extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

export interface UseLoginReturn {
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export interface UseRegisterReturn {
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export interface UseLogoutReturn {
  logout: () => Promise<void>;
  isLoading: boolean;
}

export interface CookieConfig {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
}

export interface AuthServiceConfig {
  baseURL: string;
  apiVersion: string;
  cookieEnabled: boolean;
  tokenStorageKey: string;
  refreshTokenStorageKey: string;
}

export interface LoginFormProps {
  className?: string;
  onGoogleLogin?: () => void;
  onSubmitEmailPassword?: (payload: LoginPayload) => void;
}

export interface RegisterFormProps {
  className?: string;
  onGoogleRegister?: () => void;
  onSubmitEmailPassword?: (payload: RegisterPayload) => void;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export type RegistrationStep = 1 | 2 | 3;

export interface StepValidation {
  isValid: boolean;
  error?: string;
}
