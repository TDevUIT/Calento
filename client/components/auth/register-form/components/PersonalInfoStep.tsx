'use client';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AUTH_PLACEHOLDERS, AUTH_BUTTON_TEXT } from '@/constants/auth.constants'

type PersonalInfoStepProps = {
  firstName: string
  lastName: string
  email: string
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onNext: () => void
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  firstName,
  lastName,
  email,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onNext,
}) => {
  const isValid = firstName && lastName && email

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h3 className="text-lg font-semibold text-center mb-4">
        Personal Information
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-semibold">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder={AUTH_PLACEHOLDERS.firstName}
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            required
            className="h-10 text-sm border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-semibold">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder={AUTH_PLACEHOLDERS.lastName}
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            required
            className="h-10 text-sm border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={AUTH_PLACEHOLDERS.email}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="h-10 text-sm border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all"
        />
        <p className="text-xs text-muted-foreground">
          Use your real email to verify your account
        </p>
      </div>

      <Button 
        type="button"
        onClick={onNext}
        className="w-full rounded-lg h-11 text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
        disabled={!isValid}
      >
        {isValid ? (
          <>
            {AUTH_BUTTON_TEXT.continue}
            <svg className="ml-2 h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Please fill in all fields
          </span>
        )}
      </Button>
    </div>
  )
}
