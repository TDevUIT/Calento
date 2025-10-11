'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { AxiosError } from 'axios';
import { UseLoginReturn, LoginRequest } from '../../interface/auth.interface';
import { authService } from '../../service/auth.service';
import { QUERY_KEYS, MUTATION_KEYS } from '../../config/key.query';
import { getErrorDetails } from '../../utils/error.utils';
import { AUTH_ERROR_MESSAGES } from '../../constants/auth.constants';

export const useLogin = (): UseLoginReturn => {
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  
  const mutation = useMutation({
    mutationKey: [MUTATION_KEYS.auth.login],
    mutationFn: async (credentials: LoginRequest) => {
      const result = await authService.login(credentials);
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

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsSuccess(false);
    setErrorStatus(null);
    return mutation.mutateAsync(credentials);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get user-friendly error message based on status code
  const getUserFriendlyError = (): string | null => {
    if (!mutation.error) return null;
    
    if (errorStatus === 401) return AUTH_ERROR_MESSAGES[401];
    if (errorStatus === 400) return AUTH_ERROR_MESSAGES[400];
    if (errorStatus === 403) return AUTH_ERROR_MESSAGES[403];
    if (errorStatus && errorStatus >= 500) return AUTH_ERROR_MESSAGES[500];
    
    // Check for network errors
    if (mutation.error instanceof AxiosError) {
      if (!mutation.error.response) return AUTH_ERROR_MESSAGES.network;
      if (mutation.error.code === 'ECONNABORTED') return AUTH_ERROR_MESSAGES.timeout;
    }
    
    return AUTH_ERROR_MESSAGES.default;
  };

  return {
    login,
    isLoading: mutation.isPending,
    error: getUserFriendlyError(),
    isSuccess,
  };
};
