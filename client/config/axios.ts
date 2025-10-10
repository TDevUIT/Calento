import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HTTP_CONFIG, HTTP_STATUS, DEFAULT_HEADERS } from './http.config';
import { shouldRetryRequest, getRetryDelay, markForRetry, delay, RetryConfig } from '../utils/retry.utils';
import { logger } from '../utils/logger.utils';

export const api = axios.create({
  baseURL: HTTP_CONFIG.BASE_URL,
  timeout: HTTP_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: DEFAULT_HEADERS,
});

/**
 * Refresh token helper - uses direct axios call to avoid circular dependency
 * This bypasses the interceptor to prevent infinite loops
 */
const refreshAuthToken = async (): Promise<void> => {
  const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api';
  await axios.post(
    `${HTTP_CONFIG.BASE_URL}${API_PREFIX}/auth/refresh`,
    {},
    { 
      withCredentials: true,
      headers: DEFAULT_HEADERS,
    }
  );
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    logger.request(config.method, config.url);
    return config;
  },
  (error) => {
    logger.error('Request', 'ERROR', error.config?.url);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.response(response.status, response.config.method, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;
    const status = error.response?.status;
    
    logger.error(status || 'Network', originalRequest?.method, originalRequest?.url);
    
    if (!shouldRetryRequest(error, originalRequest)) {
      return Promise.reject(error);
    }

    if (status === HTTP_STATUS.UNAUTHORIZED) {
      // Prevent infinite loop - don't retry refresh endpoint itself
      if (originalRequest?.url?.includes('/auth/refresh')) {
        logger.warn('Refresh token expired, redirecting to login');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(error);
      }
      
      markForRetry(originalRequest!, 'auth');
      
      try {
        logger.info('Attempting token refresh...');
        await refreshAuthToken();
        logger.info('Token refreshed successfully, retrying original request');
        return api(originalRequest!);
      } catch (refreshError) {
        logger.warn('Token refresh failed, redirecting to login');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    if (status === HTTP_STATUS.TOO_MANY_REQUESTS) {
      const retryCount = originalRequest!._retryCount || 0;
      const retryDelay = getRetryDelay(retryCount);
      
      markForRetry(originalRequest!, 'rate_limit');
      logger.retry(retryDelay, retryCount + 1, HTTP_CONFIG.MAX_RETRIES.RATE_LIMIT, 'Rate limited');
      
      await delay(retryDelay);
      return api(originalRequest!);
    }
    
    if (!error.response) {
      const retryCount = originalRequest!._retryCount || 0;
      const retryDelay = getRetryDelay(retryCount);
      
      markForRetry(originalRequest!, 'network');
      logger.retry(retryDelay, retryCount + 1, HTTP_CONFIG.MAX_RETRIES.NETWORK, 'Network error');
      
      await delay(retryDelay);
      return api(originalRequest!);
    }
    
    return Promise.reject(error);
  }
);

export { getErrorMessage, isNetworkError, isTimeoutError, isServerError, isClientError } from '../utils/error.utils';
export default api;