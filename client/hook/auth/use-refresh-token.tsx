'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { authService } from '../../service/auth.service';
import { QUERY_KEYS, MUTATION_KEYS } from '../../config/key.query';

export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationKey: [MUTATION_KEYS.auth.refreshToken],
    mutationFn: authService.refreshToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.all });
    },
  });

  const refreshToken = useCallback(async () => {
    return mutation.mutateAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    refreshToken,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
  };
};
