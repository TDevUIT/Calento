import { logger } from './logger.utils';

export const clearAuthStorage = () => {
  try {
    localStorage.removeItem('auth-storage');
    sessionStorage.removeItem('auth-storage');
    logger.info('Auth storage cleared successfully');
  } catch (error) {
    logger.error(`Failed to clear auth storage: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getStoredAuthData = () => {
  try {
    const data = localStorage.getItem('auth-storage');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Failed to parse auth storage: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
};

export const debugAuthStorage = () => {
  const data = getStoredAuthData();
  logger.info('Current auth storage:', data);
  
  if (data?.state?.user) {
    logger.info('User data structure:', {
      hasData: !!data.state.user.data,
      hasDirectFields: !!data.state.user.first_name,
      user: data.state.user,
    });
  }
  
  return data;
};
