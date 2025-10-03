'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { UseLoginReturn, LoginRequest } from '../../interface/auth.interface';
import { authService } from '../../service/auth.service';
import { QUERY_KEYS, MUTATION_KEYS } from '../../config/key.query';

export const useLogin = (): UseLoginReturn => {
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const mutation = useMutation({
    mutationKey: [MUTATION_KEYS.auth.login],
    mutationFn: async (credentials: LoginRequest) => {
      const result = await authService.login(credentials);
      return result;
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.all });
      queryClient.setQueryData(QUERY_KEYS.auth.me(), data.user);
    },
    onError: () => {
      setIsSuccess(false);
    },
  });

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsSuccess(false);
    return mutation.mutateAsync(credentials);
  }, [mutation]);

  return {
    login,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
    isSuccess,
  };
};
