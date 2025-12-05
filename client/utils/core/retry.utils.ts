import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { HTTP_CONFIG, HTTP_STATUS } from '../../config/http.config';

export interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

export const shouldRetryRequest = (error: AxiosError, config?: RetryConfig): boolean => {
  if (!config) return false;

  const status = error.response?.status;

  if (status === HTTP_STATUS.UNAUTHORIZED && !config._retry) {
    return true;
  }

  if (status === HTTP_STATUS.TOO_MANY_REQUESTS) {
    const retryCount = config._retryCount || 0;
    return retryCount < HTTP_CONFIG.MAX_RETRIES.RATE_LIMIT;
  }

  if (!error.response && !config._retry) {
    const retryCount = config._retryCount || 0;
    return retryCount < HTTP_CONFIG.MAX_RETRIES.NETWORK;
  }

  return false;
};

export const getRetryDelay = (retryCount: number): number => {
  return HTTP_CONFIG.RETRY_DELAY(retryCount);
};

export const markForRetry = (config: RetryConfig, retryType: 'auth' | 'rate_limit' | 'network'): void => {
  switch (retryType) {
    case 'auth':
      config._retry = true;
      break;
    case 'rate_limit':
    case 'network':
      config._retryCount = (config._retryCount || 0) + 1;
      if (retryType === 'network') {
        config._retry = true;
      }
      break;
  }
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
