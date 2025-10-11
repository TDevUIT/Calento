'use client';

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BackButton } from '@/components/atoms'
import { 
  AUTH_PLACEHOLDERS, 
  AUTH_BUTTON_TEXT, 
  PASSWORD_MIN_LENGTH 
} from '@/constants/auth.constants'

type SecurityStepProps = {
  username: string
  password: string
  confirmPassword: string
  passwordError: string
  onUsernameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

export const SecurityStep: React.FC<SecurityStepProps> = ({
  username,
  password,
  confirmPassword,
  passwordError,
  onUsernameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onNext,
  onBack,
}) => {
  const isValid = username && password && confirmPassword && password === confirmPassword

  return (
    <div className="space-y-3 md:space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-center mb-3 md:mb-4 relative">
        <BackButton onClick={onBack} />
        <h3 className="text-base md:text-lg 2xl:text-xl font-semibold">
          Account Security
        </h3>
      </div>
      
      <div className="space-y-1.5 md:space-y-2">
        <Label htmlFor="username" className="text-sm md:text-base 2xl:text-base">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder={AUTH_PLACEHOLDERS.username}
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          required
          className="h-9 md:h-10 2xl:h-11 text-sm md:text-base 2xl:text-base"
        />
      </div>

      <div className="space-y-1.5 md:space-y-2">
        <Label htmlFor="password" className="text-sm md:text-base 2xl:text-base">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder={AUTH_PLACEHOLDERS.password}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          className="h-9 md:h-10 2xl:h-11 text-sm md:text-base 2xl:text-base"
        />
        <p className="text-[10px] md:text-xs text-muted-foreground">
          Must be at least {PASSWORD_MIN_LENGTH} characters
        </p>
      </div>

      <div className="space-y-1.5 md:space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm md:text-base 2xl:text-base">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={AUTH_PLACEHOLDERS.confirmPassword}
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
          className="h-9 md:h-10 2xl:h-11 text-sm md:text-base 2xl:text-base"
        />
        {passwordError && (
          <p className="text-[10px] md:text-xs text-red-500">{passwordError}</p>
        )}
      </div>
      <Button 
        type="button"
        onClick={onNext}
        variant="outline"
        className="w-full mt-2 md:mt-0 rounded-[4px] h-10 md:h-11 2xl:h-12 text-sm md:text-base 2xl:text-base"
        disabled={!isValid}
      >
        {AUTH_BUTTON_TEXT.continue}
      </Button>
    </div>
  )
}
