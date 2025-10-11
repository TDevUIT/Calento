'use client';

import { Button } from '@/components/ui/button'
import { BackButton, TermsAndPolicy } from '@/components/atoms'
import { AUTH_BUTTON_TEXT } from '@/constants/auth.constants'

type ReviewStepProps = {
  firstName: string
  lastName: string
  email: string
  username: string
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  firstName,
  lastName,
  email,
  username,
  loading,
  onSubmit,
  onBack,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3 md:space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-center mb-3 md:mb-4 relative">
        <BackButton onClick={onBack} />
        <h3 className="text-base md:text-lg 2xl:text-xl font-semibold">
          Almost Done!
        </h3>
      </div>
      
      <div className="bg-muted/50 p-3 md:p-4 rounded-lg space-y-1.5 md:space-y-2">
        <p className="text-xs md:text-sm font-medium">Review your information:</p>
        <p className="text-xs md:text-sm text-muted-foreground">
          <strong>Name:</strong> {firstName} {lastName}
        </p>
        <p className="text-xs md:text-sm text-muted-foreground">
          <strong>Email:</strong> {email}
        </p>
        <p className="text-xs md:text-sm text-muted-foreground">
          <strong>Username:</strong> {username}
        </p>
      </div>

      <div className="pt-1 md:pt-2">
        <TermsAndPolicy 
          text="By creating an account, you agree to our"
          className="text-[10px] md:text-xs"
        />
      </div>

      <Button 
        type="submit"
        className="w-full mt-2 md:mt-0 h-10 md:h-11 2xl:h-12 text-sm md:text-base 2xl:text-base"
        disabled={loading}
      >
        {loading ? AUTH_BUTTON_TEXT.register.loading : AUTH_BUTTON_TEXT.register.idle}
      </Button>
    </form>
  )
}
