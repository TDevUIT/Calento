import { AxiosError } from 'axios';
import { ErrorResponse, ServerErrorResponse } from '../../interface';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      const errorData = error.response.data as ServerErrorResponse | ErrorResponse;

      if ('status' in errorData && 'message' in errorData && 'errors' in errorData) {
        return errorData.message || 'An unexpected error occurred';
      }

      if ('message' in errorData) {
        return errorData.message || 'An unexpected error occurred';
      }
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
};

export const getErrorStatus = (error: unknown): number | null => {
  if (error instanceof AxiosError) {
    return error.response?.status || null;
  }
  return null;
};

export const getErrorDetails = (error: unknown): { message: string; status: number | null; data?: any } => {
  if (error instanceof AxiosError) {
    return {
      message: getErrorMessage(error),
      status: error.response?.status || null,
      data: error.response?.data
    };
  }
  return {
    message: getErrorMessage(error),
    status: null
  };
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response && error.code !== 'ECONNABORTED';
  }
  return false;
};

export const isTimeoutError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.code === 'ECONNABORTED' || error.message.includes('timeout');
  }
  return false;
};

export const isServerError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    return !!status && status >= 500 && status < 600;
  }
  return false;
};

export const isClientError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    return !!status && status >= 400 && status < 500;
  }
  return false;
};
