'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { googleService } from '../../service/google.service';
import { useGoogleAuth } from './use-google-auth';

export const useGoogleOAuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkConnectionStatus } = useGoogleAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (isProcessing) return;

      const params = new URLSearchParams(searchParams.toString());
      const callbackParams = googleService.handleOAuthCallback(params);

      if (!callbackParams.success && !callbackParams.error && !callbackParams.code) {
        return;
      }

      setIsProcessing(true);

      try {
        if (callbackParams.success === 'google_connected') {
          await checkConnectionStatus();
          
          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_SUCCESS',
              data: callbackParams,
            }, window.location.origin);
            window.close();
            return;
          }

          router.push('/settings/integrations?success=google_connected');
        } else if (callbackParams.error) {
          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_ERROR',
              error: callbackParams.error,
            }, window.location.origin);
            window.close();
            return;
          }

          router.push(`/settings/integrations?error=${encodeURIComponent(callbackParams.error)}`);
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: 'Failed to process authentication',
          }, window.location.origin);
          window.close();
        } else {
          router.push('/settings/integrations?error=processing_failed');
        }
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, router, checkConnectionStatus, isProcessing]);

  return {
    isProcessing,
  };
};
