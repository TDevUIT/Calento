'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { UseLogoutReturn } from '../../interface/auth.interface';
import { authService } from '../../service';
import { QUERY_KEYS, MUTATION_KEYS } from '../../config/key.query';

export const useLogout = (): UseLogoutReturn => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationKey: [MUTATION_KEYS.auth.logout],
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.removeQueries({ queryKey: QUERY_KEYS.auth.all });
    },
  });

  const logout = useCallback(async () => {
    return mutation.mutateAsync();
  }, []);

  return {
    logout,
    isLoading: mutation.isPending,
  };
};
