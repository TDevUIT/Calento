'use client';

import { useQuery } from '@tanstack/react-query';
import { authService } from '@/service/auth.service';
import { QUERY_KEYS, QUERY_OPTIONS } from '@/config/key.query';

export const useProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: authService.getCurrentUser,
    staleTime: QUERY_OPTIONS.auth.staleTime,
    gcTime: QUERY_OPTIONS.auth.cacheTime,
    retry: QUERY_OPTIONS.auth.retry,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
