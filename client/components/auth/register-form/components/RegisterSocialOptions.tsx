'use client';

import { Separator } from '@/components/ui/separator'
import { SocialLoginButton } from '@/components/atoms'

type RegisterSocialOptionsProps = {
  onGoogleRegister?: () => void
}

export const RegisterSocialOptions: React.FC<RegisterSocialOptionsProps> = ({
  onGoogleRegister,
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3">
        <SocialLoginButton
          provider="google"
          onClick={onGoogleRegister}
        />
        <SocialLoginButton
          provider="microsoft"
          disabled
          isComingSoon
        />
      </div>

      <div className="relative py-2.5 md:py-3 w-full">
        <Separator className="bg-gray-200 dark:bg-gray-700" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 md:px-3 text-[10px] md:text-xs text-muted-foreground font-medium">
          or sign up with email
        </span>
      </div>
    </div>
  )
}
