'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { LoginFormProps } from '@/types/auth.types'
import { LoginOptions, EmailLoginForm } from './components'
import { useLogin } from '@/hook/auth/use-login'
import { 
  AUTH_SUCCESS_MESSAGES,
  REDIRECT_DELAY_MS,
  ERROR_TOAST_DURATION,
  SUCCESS_TOAST_DURATION
} from '@/constants/auth.constants'
import { getLoginErrorNotification } from '@/utils/auth-error.utils'

const LoginForm: React.FC<LoginFormProps> = ({ 
  className, 
  onGoogleLogin, 
  onSubmitEmailPassword 
}) => {
  const router = useRouter()
  const { login, isLoading, error, isSuccess } = useLogin()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showEmailForm, setShowEmailForm] = useState(false)

  useEffect(() => {
    if (isSuccess) {
      toast.success('🎉 ' + AUTH_SUCCESS_MESSAGES.login.title, {
        description: '🚀 ' + AUTH_SUCCESS_MESSAGES.login.description,
        duration: SUCCESS_TOAST_DURATION,
      })
      setTimeout(() => {
        router.push('/dashboard')
      }, REDIRECT_DELAY_MS)
    }
  }, [isSuccess, router])

  useEffect(() => {
    if (error) {
      const { title, description } = getLoginErrorNotification(error)
      toast.error(title, {
        description,
        duration: ERROR_TOAST_DURATION,
      })
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
      onSubmitEmailPassword?.({ email, password, remember })
    } catch {
    }
  }

  const handleBackToOptions = () => {
    setShowEmailForm(false)
    setEmail('')
    setPassword('')
  }

  return (
    <div className={cn('w-full max-w-md space-y-6', className)}>
      {!showEmailForm ? (
        <LoginOptions
          onGoogleLogin={onGoogleLogin}
          onEmailLoginClick={() => setShowEmailForm(true)}
        />
      ) : (
        <EmailLoginForm
          email={email}
          password={password}
          remember={remember}
          loading={isLoading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onRememberChange={setRemember}
          onSubmit={handleSubmit}
          onBack={handleBackToOptions}
        />
      )}
    </div>
  )
}

export default LoginForm
