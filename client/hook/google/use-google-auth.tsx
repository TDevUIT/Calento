'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { UseGoogleAuthReturn, GoogleCalendar } from '../../interface/google.interface';
import { googleService } from '../../service/google.service';
import { QUERY_KEYS, MUTATION_KEYS, QUERY_OPTIONS } from '../../config/key.query';

export const useGoogleAuth = (): UseGoogleAuthReturn => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const connectionQuery = useQuery({
    queryKey: QUERY_KEYS.google.status(),
    queryFn: googleService.getConnectionStatus,
    staleTime: QUERY_OPTIONS.google.staleTime,
    gcTime: QUERY_OPTIONS.google.cacheTime,
    retry: QUERY_OPTIONS.google.retry,
  });

  const disconnectMutation = useMutation({
    mutationKey: [MUTATION_KEYS.google.disconnect],
    mutationFn: googleService.disconnect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.google.all });
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
    },
  });

  const syncCalendarsMutation = useMutation({
    mutationKey: [MUTATION_KEYS.google.syncCalendars],
    mutationFn: googleService.syncCalendars,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.google.calendars.all() });
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to sync calendars');
    },
  });

  const refreshTokenMutation = useMutation({
    mutationKey: [MUTATION_KEYS.google.refreshToken],
    mutationFn: googleService.refreshToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.google.status() });
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to refresh token');
    },
  });

  const getAuthUrl = useCallback(async (): Promise<string> => {
    try {
      setError(null);
      const result = await googleService.getAuthUrl();
      return result.auth_url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get auth URL';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const disconnect = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await disconnectMutation.mutateAsync();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disconnect';
      setError(message);
      throw new Error(message);
    }
  }, [disconnectMutation]);

  const syncCalendars = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await syncCalendarsMutation.mutateAsync();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sync calendars';
      setError(message);
      throw new Error(message);
    }
  }, [syncCalendarsMutation]);

  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await refreshTokenMutation.mutateAsync();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh token';
      setError(message);
      throw new Error(message);
    }
  }, [refreshTokenMutation]);

  const getCalendars = useCallback(async (): Promise<GoogleCalendar[]> => {
    try {
      setError(null);
      const result = await googleService.getCalendars();
      return result.calendars;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get calendars';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const checkConnectionStatus = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await connectionQuery.refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to check connection status';
      setError(message);
      throw new Error(message);
    }
  }, [connectionQuery]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    connectionStatus: connectionQuery.data || null,
    isConnected: !!connectionQuery.data?.connected,
    isLoading: connectionQuery.isLoading || 
               disconnectMutation.isPending || 
               syncCalendarsMutation.isPending || 
               refreshTokenMutation.isPending,
    error: error || connectionQuery.error?.message || null,
    getAuthUrl,
    disconnect,
    refreshToken,
    syncCalendars,
    getCalendars,
    checkConnectionStatus,
    clearError,
  };
};
