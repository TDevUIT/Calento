'use client';

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TermsAndPolicy, Spinner } from '@/components/atoms'
import {
  AUTH_PLACEHOLDERS, 
  AUTH_BUTTON_TEXT, 
  POLICY_LINKS 
} from '@/constants/auth.constants'

type EmailLoginFormProps = {
  email: string
  password: string
  remember: boolean
  loading: boolean
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onRememberChange: (remember: boolean) => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
}

export const EmailLoginForm: React.FC<EmailLoginFormProps> = ({
  email,
  password,
  remember,
  loading,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onSubmit,
  onBack,
}) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-1.5 h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <h2 className="text-xl font-semibold text-foreground">Sign in with Email</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-foreground">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={AUTH_PLACEHOLDERS.email}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            autoComplete="email"
            className="h-11 rounded-lg border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all"
          />
          <p className="text-xs text-muted-foreground">
            Enter the email you registered with Calento
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold text-foreground">
              Password
            </Label>
            <Link 
              href={POLICY_LINKS.forgotPassword}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder={AUTH_PLACEHOLDERS.password}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            autoComplete="current-password"
            className="h-11 rounded-lg border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all"
          />
          <p className="text-xs text-muted-foreground">
            Password must be at least 6 characters
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
            checked={remember}
            onChange={(e) => onRememberChange(e.target.checked)}
          />
          <Label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer">
            Keep me signed in
          </Label>
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 rounded-lg font-semibold text-base shadow-md hover:shadow-lg transition-all" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="md" className="-ml-1 mr-2" />
              {AUTH_BUTTON_TEXT.login.loading}
            </>
          ) : AUTH_BUTTON_TEXT.login.idle}
        </Button>

        <div className="pt-2">
          <TermsAndPolicy />
        </div>
      </form>
    </div>
  )
}
