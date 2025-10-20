'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { UseGoogleCalendarsReturn } from '../../interface/google.interface';
import { googleService } from '../../service/google.service';
import { QUERY_KEYS, MUTATION_KEYS, QUERY_OPTIONS } from '../../config/key.query';
import { useGoogleAuth } from './use-google-auth';

export const useGoogleCalendars = (): UseGoogleCalendarsReturn => {
  const queryClient = useQueryClient();
  const { isConnected } = useGoogleAuth();
  
  const calendarsQuery = useQuery({
    queryKey: QUERY_KEYS.google.calendars.list(),
    queryFn: googleService.getCalendars,
    enabled: isConnected,
    staleTime: QUERY_OPTIONS.google.staleTime,
    gcTime: QUERY_OPTIONS.google.cacheTime,
    select: (data) => data.calendars,
  });

  const syncMutation = useMutation({
    mutationKey: [MUTATION_KEYS.google.syncCalendars],
    mutationFn: googleService.syncCalendars,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.google.calendars.all() });
    },
  });

  const syncCalendars = useCallback(async (): Promise<void> => {
    await syncMutation.mutateAsync();
  }, [syncMutation]);

  const refetch = useCallback(async (): Promise<void> => {
    await calendarsQuery.refetch();
  }, [calendarsQuery]);

  return {
    calendars: calendarsQuery.data || [],
    isLoading: calendarsQuery.isLoading || syncMutation.isPending,
    error: calendarsQuery.error?.message || syncMutation.error?.message || null,
    syncCalendars,
    refetch,
  };
};
