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
          <Label htmlFor="firstName" className="text-sm md:text-base 2xl:text-base">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder={AUTH_PLACEHOLDERS.firstName}
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            required
            className="h-9 md:h-10 2xl:h-11 text-sm md:text-base 2xl:text-base"
          />
        </div>
        
        <div className="space-y-1.5 md:space-y-2">
          <Label htmlFor="lastName" className="text-sm md:text-base 2xl:text-base">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder={AUTH_PLACEHOLDERS.lastName}
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            required
            className="h-9 md:h-10 2xl:h-11 text-sm md:text-base 2xl:text-base"
          />
        </div>
      </div>

      <div className="space-y-1.5 md:space-y-2">
        <Label htmlFor="email" className="text-sm md:text-base 2xl:text-base">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={AUTH_PLACEHOLDERS.email}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="h-9 md:h-10 2xl:h-11 text-sm md:text-base 2xl:text-base"
        />
      </div>

      <Button 
        type="button"
        onClick={onNext}
        className="w-full mt-2 md:mt-0 rounded-[4px] h-10 md:h-11 2xl:h-12 text-sm md:text-base 2xl:text-base"
        disabled={!isValid}
      >
        {AUTH_BUTTON_TEXT.continue}
      </Button>
    </div>
  )
}
