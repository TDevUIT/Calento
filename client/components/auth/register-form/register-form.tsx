'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { RegisterFormProps, RegistrationStep } from '@/interface'
import { 
  PASSWORD_MIN_LENGTH, 
  AUTH_ROUTES,
  AUTH_SUCCESS_MESSAGES,
  REDIRECT_DELAY_MS,
  ERROR_TOAST_DURATION,
  SUCCESS_TOAST_DURATION
} from '@/constants/auth.constants'
import { PROTECTED_ROUTES } from '@/constants/routes'
import {
  ProgressIndicator,
  RegisterSocialOptions,
  PersonalInfoStep,
  SecurityStep,
  ReviewStep,
} from './components'
import { useRegister } from '@/hook/auth/use-register'
import { getRegisterErrorNotification, VALIDATION_ERRORS } from '@/utils/auth-error.utils'

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  className, 
  onGoogleRegister, 
  onSubmitEmailPassword 
}) => {
  const router = useRouter()
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
      toast.success('🎉 ' + AUTH_SUCCESS_MESSAGES.register.title, {
        description: '✨ ' + AUTH_SUCCESS_MESSAGES.register.description,
        duration: SUCCESS_TOAST_DURATION,
      })
      setTimeout(() => {
        router.push(PROTECTED_ROUTES.DASHBOARD_CALENDAR)
      }, REDIRECT_DELAY_MS)
    }
  }, [isSuccess, router])

  useEffect(() => {
    if (error) {
      const { title, description } = getRegisterErrorNotification(error)
      toast.error(title, {
        description,
        duration: ERROR_TOAST_DURATION,
      })
    }
  }, [error])

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
      setPasswordError('Passwords do not match')
      const { title, description } = VALIDATION_ERRORS.passwordMismatch
      toast.error(title, {
        description,
        duration: ERROR_TOAST_DURATION,
      })
      return
    }
    
    if (password.length < PASSWORD_MIN_LENGTH) {
      setPasswordError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
      const { title, description } = VALIDATION_ERRORS.passwordTooShort(PASSWORD_MIN_LENGTH)
      toast.error(title, {
        description,
        duration: ERROR_TOAST_DURATION,
      })
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
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setPasswordError('')
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
  }

  return (
    <div className={cn('w-full flex justify-center', className)}>
      <div className="w-full max-w-md space-y-5">
        <RegisterSocialOptions onGoogleRegister={onGoogleRegister} />

        <div className="max-h-[70vh] lg:max-h-[75vh] overflow-y-auto overflow-x-hidden pr-2 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <ProgressIndicator currentStep={currentStep} />

          <div className="space-y-4 relative pb-4">
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

            <div className="text-center pt-2 pb-4">
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
    </div>
  )
}

export default RegisterForm
