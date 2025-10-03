'use client';

import { useEffect } from 'react';
import { useGoogleAuth } from './use-google-auth';

export const useGoogleTokenRefresh = () => {
  const { isConnected, connectionStatus, refreshToken } = useGoogleAuth();

  useEffect(() => {
    if (!isConnected || !connectionStatus?.expires_at) {
      return;
    }

    const expiresAt = new Date(connectionStatus.expires_at);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();

    const refreshTime = Math.max(timeUntilExpiry - (10 * 60 * 1000), 60 * 1000);

    const timer = setTimeout(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.warn('Failed to auto-refresh Google token:', error);
      }
    }, refreshTime);

    return () => clearTimeout(timer);
  }, [isConnected, connectionStatus?.expires_at, refreshToken]);
};
