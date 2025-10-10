'use client';

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BackButton } from '@/components/atoms'
import { 
  AUTH_PLACEHOLDERS, 
  AUTH_BUTTON_TEXT, 
  FORM_FIELD_SIZES, 
  BUTTON_SIZES,
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
        <Label htmlFor="username" className={FORM_FIELD_SIZES.text}>
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder={AUTH_PLACEHOLDERS.username}
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          required
          className={`${FORM_FIELD_SIZES.height} ${FORM_FIELD_SIZES.text}`}
        />
      </div>

      <div className="space-y-1.5 md:space-y-2">
        <Label htmlFor="password" className={FORM_FIELD_SIZES.text}>
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder={AUTH_PLACEHOLDERS.password}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          className={`${FORM_FIELD_SIZES.height} ${FORM_FIELD_SIZES.text}`}
        />
        <p className="text-[10px] md:text-xs text-muted-foreground">
          Must be at least {PASSWORD_MIN_LENGTH} characters
        </p>
      </div>

      <div className="space-y-1.5 md:space-y-2">
        <Label htmlFor="confirmPassword" className={FORM_FIELD_SIZES.text}>
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={AUTH_PLACEHOLDERS.password}
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
          className={`${FORM_FIELD_SIZES.height} ${FORM_FIELD_SIZES.text}`}
        />
        {passwordError && (
          <p className="text-[10px] md:text-xs text-red-500">{passwordError}</p>
        )}
      </div>

      <Button 
        type="button"
        onClick={onNext}
        variant="outline"
        className={`w-full mt-2 md:mt-0 rounded-[4px] ${BUTTON_SIZES.submit} ${FORM_FIELD_SIZES.text}`}
        disabled={!isValid}
      >
        {AUTH_BUTTON_TEXT.continue}
      </Button>
    </div>
  )
}
