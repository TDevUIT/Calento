'use client';

import { useCallback } from 'react';
import { useGoogleStore } from '../../store/google.store';

export const useGoogleAuth = () => {
  const store = useGoogleStore();
  return store;
};

export const useGoogleConnection = () => {
  const connectionStatus = useGoogleStore((state) => state.connectionStatus);
  const isConnected = useGoogleStore((state) => state.isConnected);
  const checkConnectionStatus = useGoogleStore((state) => state.checkConnectionStatus);
  const disconnect = useGoogleStore((state) => state.disconnect);
  const getAuthUrl = useGoogleStore((state) => state.getAuthUrl);
  const isLoading = useGoogleStore((state) => state.isLoading);
  const error = useGoogleStore((state) => state.error);
  const clearError = useGoogleStore((state) => state.clearError);

  return {
    connectionStatus,
    isConnected,
    checkConnectionStatus,
    disconnect,
    getAuthUrl,
    isLoading,
    error,
    clearError,
  };
};

export const useGoogleCalendars = () => {
  const calendars = useGoogleStore((state) => state.calendars);
  const getCalendars = useGoogleStore((state) => state.getCalendars);
  const syncCalendars = useGoogleStore((state) => state.syncCalendars);
  const isLoading = useGoogleStore((state) => state.isLoading);
  const error = useGoogleStore((state) => state.error);

  const refetch = useCallback(async () => {
    return getCalendars();
  }, [getCalendars]);

  return {
    calendars,
    getCalendars,
    syncCalendars,
    refetch,
    isLoading,
    error,
  };
};

export const useGoogleActions = () => {
  const getAuthUrl = useGoogleStore((state) => state.getAuthUrl);
  const checkConnectionStatus = useGoogleStore((state) => state.checkConnectionStatus);
  const disconnect = useGoogleStore((state) => state.disconnect);
  const refreshToken = useGoogleStore((state) => state.refreshToken);
  const syncCalendars = useGoogleStore((state) => state.syncCalendars);
  const getCalendars = useGoogleStore((state) => state.getCalendars);
  const clearError = useGoogleStore((state) => state.clearError);
  const reset = useGoogleStore((state) => state.reset);

  return {
    getAuthUrl,
    checkConnectionStatus,
    disconnect,
    refreshToken,
    syncCalendars,
    getCalendars,
    clearError,
    reset,
  };
};
