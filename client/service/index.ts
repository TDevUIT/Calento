// Core Services - explicitly re-export to avoid conflicts
export * from './core/user-settings.service';
export * from './core/health.service';
export {
    register,
    login,
    loginWithGoogle as completeGoogleLogin,
    logout,
    refreshToken,
    getCurrentUser,
    checkAuthStatus,
    requestPasswordReset,
    resetPassword,
    authService
} from './core/auth.service';

// Scheduling Services  
export * from './scheduling';

// Collaboration Services
export * from './collaboration';

// Integration Services - explicitly re-export to avoid conflicts
export * from './integration/cloudinary.service';
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
    loginWithGoogle as initiateGoogleLogin,
    createGoogleMeet,
    googleService
} from './integration/google.service';

// Content Services
export * from './content';

// Analytics Services
export * from './analytics';

// AI Services
export * from './ai';

// Priority Services
export * from './priority';

// Re-export axios utilities
export { default as api, getErrorMessage, isNetworkError, isTimeoutError, isServerError, isClientError } from '../config/axios';
