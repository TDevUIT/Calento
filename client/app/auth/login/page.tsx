import Link from 'next/link';
import { OAuthButtons } from '@/components/auth/oauth-buttons';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col theme-bg-subtle">
      {/* Top Banner */}
      <div className="w-full theme-bg-alt p-3 text-center text-sm theme-text-secondary">
        <p>
          This is a project for the community.
          <Link href="/github" className="font-medium theme-text-primary hover:underline ml-1">
            Star us on GitHub
          </Link>
        </p>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-sm space-y-6 px-4 md:px-0">
          {/* Header */}
          <div className="text-center space-y-4">
            {/* Logo */}
            <div className="mx-auto w-14 h-14 theme-card-bg rounded-2xl flex items-center justify-center theme-card-border border shadow-sm">
              <div className="w-8 h-8 theme-text-primary font-bold text-xl flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 3.5L29.5 10.25V23.75L16 30.5L2.5 23.75V10.25L16 3.5Z"
                    className="theme-fill-primary"
                  />
                  <path
                    d="M16 14.5L29.5 21V23.75L16 30.5L2.5 23.75V21L16 14.5Z"
                    className="theme-fill-secondary"
                  />
                </svg>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold theme-text-primary">
                Sign in to Tempra
              </h1>
              <p className="text-sm theme-text-secondary">
                Welcome back! Please sign in to continue.
              </p>
            </div>
          </div>

          {/* Auth Card */}
          <div className="px-6 py-8 theme-card-bg rounded-xl shadow-lg theme-card-border border">
            <OAuthButtons isLoginPage={true} />
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-4">
            <p className="text-sm theme-text-secondary">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="theme-text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
            <p className="text-xs theme-text-muted">
              By using Tempra, you agree to our{' '}
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
