'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { authService } from '@/service/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          toast.error('Google Login Failed', { description: error });
          setTimeout(() => router.push('/auth/login'), 2000);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received');
          toast.error('Google Login Failed', { description: 'No authorization code' });
          setTimeout(() => router.push('/auth/login'), 2000);
          return;
        }

        setMessage('Logging you in...');
        const authResponse = await authService.loginWithGoogle(code);
        
        setUser(authResponse.user);
        setStatus('success');
        setMessage('Login successful! Redirecting to calendar...');
        toast.success('🎉 Welcome back!', { 
          description: `Logged in as ${authResponse.user.email}` 
        });
        
        setTimeout(() => router.push('/dashboard/calendar'), 500);

      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Login failed. Please try again.');
        toast.error('Google Login Failed', { 
          description: error.message || 'An error occurred' 
        });
        setTimeout(() => router.push('/auth/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, setUser]);

  const renderIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            {renderIcon()}
          </div>
          
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Google Authentication
          </h1>
          
          <p className={`text-sm ${getStatusColor()} mb-4`}>
            {message}
          </p>

          {status === 'error' && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Redirecting back to login page...
            </div>
          )}

          {status === 'success' && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Redirecting to your calendar...
            </div>
          )}
          
          {status === 'loading' && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Please wait...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
