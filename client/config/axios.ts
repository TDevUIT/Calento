import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HTTP_CONFIG, HTTP_STATUS, DEFAULT_HEADERS } from './http.config';
import { shouldRetryRequest, getRetryDelay, markForRetry, delay, RetryConfig } from '../utils/retry.utils';
import { logger } from '../utils/logger.utils';
import { AUTH_ROUTES } from '../constants/routes';

export const api = axios.create({
  baseURL: HTTP_CONFIG.BASE_URL,
  timeout: HTTP_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: DEFAULT_HEADERS,
});

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
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as RetryConfig;
    const status = error.response?.status;
    const responseData = error.response?.data;
    
    logger.error(status || 'Network', originalRequest?.method, originalRequest?.url);
    
    if (responseData?.requiresLogin) {
      logger.warn('Session expired, redirecting to login');
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
        
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = `${AUTH_ROUTES.LOGIN}?session=expired`;
        }
      }
      
      return Promise.reject(error);
    }
    
    if (!shouldRetryRequest(error, originalRequest)) {
      return Promise.reject(error);
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

export { getErrorMessage, getErrorStatus, getErrorDetails, isNetworkError, isTimeoutError, isServerError, isClientError } from '../utils/error.utils';
export default api;
