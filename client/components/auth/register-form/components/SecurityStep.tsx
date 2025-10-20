'use client';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BackButton } from '@/components/atoms'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'
import { CheckCircle2, XCircle } from 'lucide-react'
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
  
  const passwordsMatch = confirmPassword && password === confirmPassword
  const passwordsDontMatch = confirmPassword && password !== confirmPassword

  return (
    <div className="space-y-3 md:space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-center mb-3 md:mb-4 relative">
        <BackButton onClick={onBack} />
        <h3 className="text-base md:text-lg 2xl:text-xl font-semibold">
          Account Security
        </h3>
      </div>
      
      <div className="space-y-1.5 md:space-y-2">
        <Label htmlFor="username" className="text-sm md:text-base 2xl:text-base font-semibold">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder={AUTH_PLACEHOLDERS.username}
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          required
          className="h-9 md:h-10 2xl:h-11 text-sm md:text-base 2xl:text-base border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all"
        />
        <p className="text-[10px] md:text-xs text-muted-foreground">
          Your display name on Calento (cannot be changed later)
        </p>
      </div>

      <div className="space-y-1.5 md:space-y-2">
        <Label htmlFor="password" className="text-sm md:text-base 2xl:text-base font-semibold">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder={AUTH_PLACEHOLDERS.password}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          className="h-9 md:h-10 2xl:h-11 text-sm md:text-base 2xl:text-base border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all"
        />
        
        <PasswordStrengthIndicator 
          password={password} 
          minLength={PASSWORD_MIN_LENGTH}
          showDetails={false}
        />
      </div>

      <div className="space-y-1.5 md:space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm md:text-base 2xl:text-base font-semibold">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type="password"
            placeholder={AUTH_PLACEHOLDERS.confirmPassword}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            required
            className={`h-9 md:h-10 2xl:h-11 text-sm md:text-base 2xl:text-base pr-10 ${
              passwordsMatch 
                ? 'border-blue-500 dark:border-blue-600 focus-visible:ring-blue-500' 
                : passwordsDontMatch 
                ? 'border-red-500 dark:border-red-600 focus-visible:ring-red-500' 
                : ''
            }`}
          />
          {confirmPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {passwordsMatch ? (
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 dark:text-red-400" />
              )}
            </div>
          )}
        </div>
        
        {/* Realtime Validation Messages */}
        {passwordsMatch && (
          <div className="flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <p className="text-[10px] md:text-xs text-blue-600 dark:text-blue-400 font-medium">
              âœ“ Passwords match
            </p>
          </div>
        )}
        {passwordsDontMatch && (
          <div className="flex items-center gap-1.5 mt-1">
            <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <p className="text-[10px] md:text-xs text-red-600 dark:text-red-400 font-medium">
              âœ— Passwords don&apos;t match
            </p>
          </div>
        )}
        
        {passwordError && !passwordsDontMatch && (
          <p className="text-[10px] md:text-xs text-red-500">{passwordError}</p>
        )}
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
