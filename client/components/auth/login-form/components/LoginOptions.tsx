'use client';

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Mail } from 'lucide-react'
import { SocialLoginButton, TermsAndPolicy } from '@/components/atoms'

type LoginOptionsProps = {
  onGoogleLogin?: () => void
  onEmailLoginClick: () => void
  isGoogleLoading?: boolean
}

export const LoginOptions: React.FC<LoginOptionsProps> = ({
  onGoogleLogin,
  onEmailLoginClick,
  isGoogleLoading = false,
}) => {
  return (
    <div className="space-y-3 flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3 w-full max-w-sm">
        <SocialLoginButton
          provider="google"
          onClick={onGoogleLogin}
          disabled={isGoogleLoading}
          isLoading={isGoogleLoading}
        />
        <SocialLoginButton
          provider="microsoft"
          disabled
          isComingSoon
        />
      </div>

      <div className="relative py-4 w-full max-w-sm">
        <Separator className="bg-gray-200 dark:bg-gray-700" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground font-medium">
          or
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full px-1.5 max-w-sm justify-start bg-neutral-700 hover:bg-neutral-600 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-[4px] border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 h-11 md:h-12 lg:h-11 2xl:h-12"
        onClick={onEmailLoginClick}
      >
        <div className="flex items-center justify-center mr-2 bg-white rounded-[2px] px-1.5 md:px-2 lg:px-2.5 2xl:px-2.5 py-1 md:py-1.5 lg:py-2 2xl:py-2">
          <Mail className="w-5 h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 text-gray-700 dark:text-gray-300" />
        </div>
        <span className="text-white text-xs md:text-sm lg:text-xs 2xl:text-sm font-medium">
          Sign in with Email
        </span>
      </Button>

      <div className="pt-4 w-full max-w-sm">
        <TermsAndPolicy />
      </div>
    </div>
  )
}
