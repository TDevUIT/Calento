import { User } from '../../users/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
  type?: 'access' | 'refresh';
}

export interface JwtRefreshPayload {
  sub: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
  type: 'refresh';
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type: 'Bearer';
  expires_in: number;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: Omit<User, 'password_hash'>;
  login_at: Date;
}

export interface AuthUser extends Omit<User, 'password_hash'> {}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  new_password: string;
}

export interface EmailVerification {
  token: string;
}

export interface AuthSession {
  user_id: string;
  session_id: string;
  ip_address: string;
  user_agent: string;
  created_at: Date;
  expires_at: Date;
  is_active: boolean;
}
