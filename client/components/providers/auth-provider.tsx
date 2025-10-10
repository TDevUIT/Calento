'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/auth.store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { checkAuthStatus, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.warn('Auth initialization failed:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [checkAuthStatus]);

  if (!isInitialized && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
