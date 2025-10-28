'use client';

import { Button } from '@/components/ui/button'
import { BackButton, TermsAndPolicy, Spinner } from '@/components/atoms'
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
    <form onSubmit={onSubmit} className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-center mb-4 relative">
        <BackButton onClick={onBack} />
        <h3 className="text-lg font-semibold">
          Almost Done!
        </h3>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
        <p className="text-sm font-medium">Review your information:</p>
        <p className="text-sm text-muted-foreground">
          <strong>Name:</strong> {firstName} {lastName}
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Email:</strong> {email}
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Username:</strong> {username}
        </p>
      </div>

      <div className="pt-2">
        <TermsAndPolicy 
          text="By creating an account, you agree to our"
          className="text-xs"
        />
      </div>

      <Button 
        type="submit"
        className="w-full rounded-lg h-11 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner size="md" className="-ml-1 mr-2" />
            {AUTH_BUTTON_TEXT.register.loading}
          </>
        ) : (
          <>
            {AUTH_BUTTON_TEXT.register.idle}
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </>
        )}
      </Button>
    </form>
  )
}
