'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { notificationService, PendingEmailNotification } from '@/service';

export const NOTIFICATION_QUERY_KEYS = {
  all: ['notifications'] as const,
  pending: () => [...NOTIFICATION_QUERY_KEYS.all, 'pending'] as const,
} as const;

export const usePendingNotifications = (): UseQueryResult<PendingEmailNotification[], Error> => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.pending(),
    queryFn: () => notificationService.getPendingNotifications(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
