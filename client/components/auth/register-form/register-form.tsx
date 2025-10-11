'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { RegisterFormProps, RegistrationStep } from '@/types/auth.types'
import { 
  AUTH_VALIDATION_MESSAGES, 
  PASSWORD_MIN_LENGTH, 
  AUTH_ROUTES 
} from '@/constants/auth.constants'
import {
  ProgressIndicator,
  RegisterSocialOptions,
  PersonalInfoStep,
  SecurityStep,
  ReviewStep,
} from './components'
import { useRegister } from '@/hook/auth/use-register'
import { useToast } from '@/components/ui/use-toast'

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  className, 
  onGoogleRegister, 
  onSubmitEmailPassword 
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const { register, isLoading, error, isSuccess } = useRegister()
  
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Registration successful!',
        description: 'Welcome to Tempra',
      })
      router.push('/dashboard')
    }
  }, [isSuccess, router, toast])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Registration failed',
        description: error,
        variant: 'destructive',
      })
    }
  }, [error, toast])

  const handleNextStep = () => {
    if (currentStep === 1 && (!firstName || !lastName || !email)) {
      return
    }
    if (currentStep === 2 && (!username || !password || !confirmPassword)) {
      return
    }
    setCurrentStep((prev) => (prev + 1) as RegistrationStep)
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => (prev - 1) as RegistrationStep)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setPasswordError(AUTH_VALIDATION_MESSAGES.passwordMismatch)
      return
    }
    
    if (password.length < PASSWORD_MIN_LENGTH) {
      setPasswordError(AUTH_VALIDATION_MESSAGES.passwordTooShort)
      return
    }
    
    setPasswordError('')
    try {
      await register({ 
        email, 
        username, 
        password, 
        first_name: firstName, 
        last_name: lastName 
      })
      onSubmitEmailPassword?.({ 
        email, 
        username, 
        password, 
        confirmPassword,
        firstName, 
        lastName 
      })
    } catch {
      // Error handled by hook
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setPasswordError('')
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    setPasswordError('')
  }

  return (
    <div className={cn('w-full flex justify-center', className)}>
      <div className="w-full max-w-sm 2xl:max-w-md space-y-4 md:space-y-5">
        <RegisterSocialOptions onGoogleRegister={onGoogleRegister} />

        <ProgressIndicator currentStep={currentStep} />

        <div className="space-y-3 md:space-y-4 min-h-[350px] md:min-h-[400px] relative">
          {currentStep === 1 && (
            <PersonalInfoStep
              firstName={firstName}
              lastName={lastName}
              email={email}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
              onEmailChange={setEmail}
              onNext={handleNextStep}
            />
          )}

          {currentStep === 2 && (
            <SecurityStep
              username={username}
              password={password}
              confirmPassword={confirmPassword}
              passwordError={passwordError}
              onUsernameChange={setUsername}
              onPasswordChange={handlePasswordChange}
              onConfirmPasswordChange={handleConfirmPasswordChange}
              onNext={handleNextStep}
              onBack={handlePrevStep}
            />
          )}

          {currentStep === 3 && (
            <ReviewStep
              firstName={firstName}
              lastName={lastName}
              email={email}
              username={username}
              loading={isLoading}
              onSubmit={handleSubmit}
              onBack={handlePrevStep}
            />
          )}

          <div className="text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href={AUTH_ROUTES.login} className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
