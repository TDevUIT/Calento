'use client';

import { useCallback, useState } from 'react';
import { GoogleOAuthCallbackParams } from '../../interface/google.interface';
import { googleService } from '../../service/google.service';
import { useGoogleAuth } from './use-google-auth';

export const useGoogleOAuthPopup = () => {
  const { checkConnectionStatus } = useGoogleAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAuthPopup = useCallback(async (): Promise<GoogleOAuthCallbackParams> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await googleService.openAuthPopup();
      
      if (result.success) {
        await checkConnectionStatus();
      }
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [checkConnectionStatus]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    openAuthPopup,
    isLoading,
    error,
    clearError,
  };
};
