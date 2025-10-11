'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { AxiosError } from 'axios';
import { UseRegisterReturn, RegisterRequest } from '../../interface/auth.interface';
import { authService } from '../../service/auth.service';
import { QUERY_KEYS, MUTATION_KEYS } from '../../config/key.query';
import { getErrorDetails } from '../../utils/error.utils';
import { AUTH_ERROR_MESSAGES } from '../../constants/auth.constants';

export const useRegister = (): UseRegisterReturn => {
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  
  const mutation = useMutation({
    mutationKey: [MUTATION_KEYS.auth.register],
    mutationFn: async (userData: RegisterRequest) => {
      const result = await authService.register(userData);
      return result;
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      setErrorStatus(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.all });
      queryClient.setQueryData(QUERY_KEYS.auth.me(), data.user);
    },
    onError: (error) => {
      setIsSuccess(false);
      const { status } = getErrorDetails(error);
      setErrorStatus(status);
    },
  });

  const register = useCallback(async (userData: RegisterRequest) => {
    setIsSuccess(false);
    setErrorStatus(null);
    return mutation.mutateAsync(userData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get error message from server response or fallback to generic message
  const getUserFriendlyError = (): string | null => {
    if (!mutation.error) return null;
    
    // Check for network errors first
    if (mutation.error instanceof AxiosError) {
      if (!mutation.error.response) return AUTH_ERROR_MESSAGES.network;
      if (mutation.error.code === 'ECONNABORTED') return AUTH_ERROR_MESSAGES.timeout;
    }
    
    // Get actual error message from server response
    const { message } = getErrorDetails(mutation.error);
    
    // Return server message if available, otherwise fallback to generic message
    if (message && message !== 'An unexpected error occurred' && message !== 'An unknown error occurred') {
      return message;
    }
    
    // Fallback to generic messages based on status code
    if (errorStatus === 409) return AUTH_ERROR_MESSAGES[409];
    if (errorStatus === 400) return AUTH_ERROR_MESSAGES[400];
    if (errorStatus === 401) return AUTH_ERROR_MESSAGES[401];
    if (errorStatus === 403) return AUTH_ERROR_MESSAGES[403];
    if (errorStatus && errorStatus >= 500) return AUTH_ERROR_MESSAGES[500];
    
    return AUTH_ERROR_MESSAGES.default;
  };

  return {
    register,
    isLoading: mutation.isPending,
    error: getUserFriendlyError(),
    isSuccess,
  };
};
