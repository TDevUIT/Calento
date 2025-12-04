'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, Calendar, Sparkles } from 'lucide-react';
import { authService } from '@/service';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';

type AuthStatus = 'loading' | 'success' | 'error';
type ProcessStep = 'authenticating' | 'connecting-calendar' | 'complete';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [step, setStep] = useState<ProcessStep>('authenticating');
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

        setMessage('Verifying your credentials...');
        const authResponse = await authService.loginWithGoogle(code);
        setUser(authResponse.user);

        try {
          setStep('connecting-calendar');
          setMessage('Setting up Google Calendar...');
          const { getConnectionStatus, getAuthUrl } = await import('@/service');
          const connectionStatus = await getConnectionStatus();

          if (!connectionStatus.connected) {
            const { auth_url } = await getAuthUrl();

            const popup = window.open(auth_url, 'google-calendar-connect', 'width=600,height=700,left=200,top=100');

            const checkPopup = setInterval(() => {
              if (popup?.closed) {
                clearInterval(checkPopup);
                finishAuthentication(authResponse.user.email, true);
              }
            }, 500);

            setTimeout(() => {
              clearInterval(checkPopup);
              if (popup && !popup.closed) popup.close();
              finishAuthentication(authResponse.user.email, false);
            }, 60000);
          } else {
            finishAuthentication(authResponse.user.email, false);
          }
        } catch (calendarError) {
          console.warn('Calendar connection failed:', calendarError);
          finishAuthentication(authResponse.user.email, false);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
        setStatus('error');
        setMessage(errorMessage);
        toast.error('Google Login Failed', { description: errorMessage });
        setTimeout(() => router.push('/auth/login'), 3000);
      }
    };

    const finishAuthentication = (email: string, calendarConnected: boolean) => {
      setStep('complete');
      setStatus('success');
      setMessage('Login successful! Redirecting...');
      toast.success('🎉 Welcome back!', {
        description: calendarConnected ? `Logged in as ${email}. Calendar connected!` : `Logged in as ${email}`
      });
      setTimeout(() => router.push('/dashboard/calendar'), 500);
    };

    handleCallback();
  }, [searchParams, router, setUser]);

  const renderIcon = () => {
    if (status === 'success') return <CheckCircle className="w-16 h-16 text-green-500 animate-in zoom-in duration-300" />;
    if (status === 'error') return <XCircle className="w-16 h-16 text-red-500 animate-in zoom-in duration-300" />;

    if (step === 'connecting-calendar') {
      return (
        <div className="relative">
          <Calendar className="w-16 h-16 text-blue-500 animate-pulse" />
          <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-spin" />
        </div>
      );
    }

    return <Loader2 className="w-16 h-16 animate-spin text-blue-500" />;
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return {
          text: 'text-green-600 dark:text-green-400',
          bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
          border: 'border-green-200 dark:border-green-800'
        };
      case 'error':
        return {
          text: 'text-red-600 dark:text-red-400',
          bg: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
          border: 'border-red-200 dark:border-red-800'
        };
      default:
        return {
          text: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
          border: 'border-blue-200 dark:border-blue-800'
        };
    }
  };

  const styles = getStatusStyles();

  const getStepIndicator = () => {
    const steps = [
      { key: 'authenticating', label: 'Authenticating' },
      { key: 'connecting-calendar', label: 'Connecting Calendar' },
      { key: 'complete', label: 'Complete' }
    ];

    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((s, index) => (
          <div key={s.key} className="flex items-center">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step === s.key ? 'bg-blue-500 w-8' :
                steps.findIndex(x => x.key === step) > index ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            {index < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-700" />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-md w-full mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className={`${styles.bg} ${styles.border} border-2 rounded-2xl shadow-2xl p-8 text-center backdrop-blur-sm`}>
          <div className="flex justify-center mb-6">
            {renderIcon()}
          </div>

          {status === 'loading' && getStepIndicator()}

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            Google Authentication
          </h1>

          <p className={`text-base font-medium ${styles.text} mb-6 animate-pulse`}>
            {message}
          </p>

          {status === 'loading' && (
            <div className="space-y-2">
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-progress" style={{
                  animation: 'progress 2s ease-in-out infinite'
                }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Please wait while we set up your account...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                Redirecting back to login page...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Taking you to your calendar...
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
