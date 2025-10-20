'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth.store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    
    hasInitialized.current = true;
    checkAuthStatus().catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Auth initialization failed:', error);
      }
    });
  }, []);

  return <>{children}</>;
};
