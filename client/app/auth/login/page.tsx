import Link from 'next/link';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { LoginForm } from '@/components/auth/login-form';
import { AuthDivider } from '@/components/auth/auth-divider/auth-divider';
import AuthShell from '@/components/auth/auth-shell';
import AuthLogo from '@/components/auth/auth-logo';
import { LegalNotice } from '@/components/auth/legal-notice/legal-notice';

export default function LoginPage() {
  return (
    <AuthShell centered>
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-sm space-y-6 px-4 md:px-0 relative z-10">
          {/* Header */}
          <div className="text-center space-y-6">
            <AuthLogo />

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight theme-text-primary">Sign in to Calento</h1>
              <p className="text-base theme-text-secondary">Welcome back! Please sign in to continue.</p>
            </div>
          </div>

          {/* Auth Card */}
          <div className="px-6 py-8 theme-card-bg/80 backdrop-blur-sm rounded-xl shadow-lg theme-card-border border space-y-6">
            <OAuthButtons mode="login" />
            <AuthDivider label="Or continue with email" />
            <LoginForm />
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
            <LegalNotice variant="login" />
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
