// Auth service functions
export {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  checkAuthStatus,
  authService,
} from './auth.service';

// Google service functions
export {
  getAuthUrl,
  getConnectionStatus,
  disconnect,
  syncCalendars,
  getCalendars,
  refreshToken as refreshGoogleToken,
  openAuthPopup,
  handleOAuthCallback,
  isConnected,
  isTokenExpired,
  ensureValidToken,
  googleService,
} from './google.service';

// HTTP utilities
export { default as api, getErrorMessage, isNetworkError, isTimeoutError, isServerError, isClientError } from '../config/axios';
