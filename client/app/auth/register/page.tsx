import Link from 'next/link';
import RegisterForm from '@/components/auth/register-form/register-form';
import { OAuthButtons } from '@/components/auth/oauth-buttons';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center theme-hero-bg">
      <div className="w-full max-w-md space-y-8 p-8">
        {/* Header */}
        <div className="text-center space-y-4">
          {/* Logo */}
          <div className="mx-auto w-16 h-16 theme-card-bg rounded-2xl flex items-center justify-center theme-card-border border shadow-sm">
            <div className="w-8 h-8 theme-text-primary font-bold text-xl flex items-center justify-center">
              T
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold theme-text-primary">
              Create an account
            </h1>
            <p className="text-sm theme-text-secondary">
              Join Tempra to start optimizing your time
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="theme-card-bg rounded-xl p-6 shadow-lg theme-card-border border">
          <div className="space-y-6">
            {/* OAuth Buttons */}
            <OAuthButtons />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t theme-card-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 theme-card-bg theme-text-secondary">
                  Or sign up with email
                </span>
              </div>
            </div>

            {/* Register Form */}
            <RegisterForm />
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <p className="text-sm theme-text-secondary">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="theme-text-primary hover:underline font-medium transition-all duration-200"
            >
              Sign in
            </Link>
          </p>

          <div className="flex items-center justify-center space-x-4 text-xs theme-text-muted">
            <Link href="/privacy" className="hover:underline transition-colors duration-200">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline transition-colors duration-200">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/" className="hover:underline transition-colors duration-200">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
