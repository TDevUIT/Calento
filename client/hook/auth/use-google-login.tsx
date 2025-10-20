'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { googleService } from '@/service/google.service';
import { useAuthStore } from '@/store/auth.store';
import { 
  ERROR_TOAST_DURATION,
} from '@/constants/auth.constants';

export interface UseGoogleLoginReturn {
  loginWithGoogle: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export const useGoogleLogin = (): UseGoogleLoginReturn => {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      setError(null);
      await googleService.loginWithGoogle();
      return null;
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Failed to start Google login';
      setError(errorMessage);
      toast.error('âŒ Google Login Failed', {
        description: errorMessage,
        duration: ERROR_TOAST_DURATION,
      });
    },
  });

  const loginWithGoogle = async () => {
    await mutation.mutateAsync();
  };

  return {
    loginWithGoogle,
    isLoading: mutation.isPending,
    error,
    isSuccess: mutation.isSuccess,
  };
};

export default useGoogleLogin;
