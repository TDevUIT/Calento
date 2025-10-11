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
    // Prevent multiple calls in React StrictMode or re-renders
    if (hasInitialized.current) return;
    
    hasInitialized.current = true;
    checkAuthStatus().catch((error) => {
      // Failed to check auth - user will see login page if needed
      if (process.env.NODE_ENV === 'development') {
        console.warn('Auth initialization failed:', error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};
