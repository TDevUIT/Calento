import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HTTP_CONFIG, HTTP_STATUS, DEFAULT_HEADERS } from './http.config';
import { shouldRetryRequest, getRetryDelay, markForRetry, delay, RetryConfig } from '../utils/retry.utils';
import { logger } from '../utils/logger.utils';
import { API_ROUTES, AUTH_ROUTES } from '../constants/routes';

export const api = axios.create({
  baseURL: HTTP_CONFIG.BASE_URL,
  timeout: HTTP_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: DEFAULT_HEADERS,
});

let isRefreshing = false;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 1;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const refreshAuthToken = async (): Promise<void> => {
  await axios.post(
    `${HTTP_CONFIG.BASE_URL}${API_ROUTES.AUTH_REFRESH}`,
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
      const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
                            originalRequest?.url?.includes('/auth/register') ||
                            originalRequest?.url?.includes('/auth/refresh');
      
      const isAuthMeEndpoint = originalRequest?.url?.includes('/auth/me');
      
      if (isAuthEndpoint || isAuthMeEndpoint) {
        logger.warn('Auth endpoint failed, skipping refresh');
        
        if (originalRequest?.url?.includes('/auth/refresh')) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
            
            if (!window.location.pathname.includes('/auth/login')) {
              window.location.href = AUTH_ROUTES.LOGIN;
            }
          }
        }
        
        refreshAttempts = 0;
        return Promise.reject(error);
      }
      
      if (originalRequest?._retry) {
        logger.warn('Already retried, giving up');
        refreshAttempts = 0;
        return Promise.reject(error);
      }
      
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        logger.warn(`Max refresh attempts (${MAX_REFRESH_ATTEMPTS}) exceeded, redirecting to login`);
        refreshAttempts = 0;
        isRefreshing = false;
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          
          if (!window.location.pathname.includes('/auth/login')) {
            window.location.href = AUTH_ROUTES.LOGIN;
          }
        }
        
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest!);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      
      markForRetry(originalRequest!, 'auth');
      isRefreshing = true;
      refreshAttempts++;
      
      try {
        logger.info(`Attempting token refresh (attempt ${refreshAttempts}/${MAX_REFRESH_ATTEMPTS})...`);
        await refreshAuthToken();
        logger.info('Token refreshed successfully');
        isRefreshing = false;
        refreshAttempts = 0;
        processQueue();
        return api(originalRequest!);
      } catch (refreshError) {
        logger.warn('Token refresh failed, redirecting to login');
        isRefreshing = false;
        refreshAttempts = 0;
        processQueue(refreshError);
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          
          if (!window.location.pathname.includes('/auth/login')) {
            window.location.href = AUTH_ROUTES.LOGIN;
          }
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

export { getErrorMessage, getErrorStatus, getErrorDetails, isNetworkError, isTimeoutError, isServerError, isClientError } from '../utils/error.utils';
export default api;