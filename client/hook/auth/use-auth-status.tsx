'use client';

import { useQuery } from '@tanstack/react-query';
import { authService } from '../../service';
import { QUERY_KEYS, QUERY_OPTIONS } from '../../config/key.query';

export const useAuthStatus = () => {
  return useQuery({
    queryKey: QUERY_KEYS.auth.session(),
    queryFn: authService.checkAuthStatus,
    staleTime: QUERY_OPTIONS.auth.staleTime,
    gcTime: QUERY_OPTIONS.auth.cacheTime,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000,
  });
};
