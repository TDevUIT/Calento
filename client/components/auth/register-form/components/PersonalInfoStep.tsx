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
    <div className="space-y-3 md:space-y-4 animate-in fade-in duration-300">
      <h3 className="text-base md:text-lg 2xl:text-xl font-semibold text-center mb-3 md:mb-4">
        Personal Information
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3">
        <div className="space-y-1.5 md:space-y-2">
          <Label htmlFor="firstName" className="text-sm md:text-base 2xl:text-base font-semibold">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder={AUTH_PLACEHOLDERS.firstName}
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            required
            className="h-9 md:h-10 2xl:h-11 text-sm md:text-base 2xl:text-base border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all"
          />
        </div>
        
        <div className="space-y-1.5 md:space-y-2">
          <Label htmlFor="lastName" className="text-sm md:text-base 2xl:text-base font-semibold">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder={AUTH_PLACEHOLDERS.lastName}
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            required
            className="h-9 md:h-10 2xl:h-11 text-sm md:text-base 2xl:text-base border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5 md:space-y-2">
        <Label htmlFor="email" className="text-sm md:text-base 2xl:text-base font-semibold">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={AUTH_PLACEHOLDERS.email}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="h-9 md:h-10 2xl:h-11 text-sm md:text-base 2xl:text-base border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all"
        />
        <p className="text-[10px] md:text-xs text-muted-foreground">
          Use your real email to verify your account
        </p>
      </div>

      <Button 
        type="button"
        onClick={onNext}
        className="w-full mt-2 md:mt-0 rounded-lg h-10 md:h-11 2xl:h-12 text-sm md:text-base 2xl:text-base font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
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
