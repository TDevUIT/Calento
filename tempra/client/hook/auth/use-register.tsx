'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { UseRegisterReturn, RegisterRequest } from '../../interface/auth.interface';
import { authService } from '../../service/auth.service';
import { QUERY_KEYS, MUTATION_KEYS } from '../../config/key.query';

export const useRegister = (): UseRegisterReturn => {
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const mutation = useMutation({
    mutationKey: [MUTATION_KEYS.auth.register],
    mutationFn: async (userData: RegisterRequest) => {
      const result = await authService.register(userData);
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

  const register = useCallback(async (userData: RegisterRequest) => {
    setIsSuccess(false);
    return mutation.mutateAsync(userData);
  }, [mutation]);

  return {
    register,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
    isSuccess,
  };
};
