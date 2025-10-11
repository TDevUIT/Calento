'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { LoginFormProps } from '@/types/auth.types'
import { LoginOptions, EmailLoginForm } from './components'
import { useLogin } from '@/hook/auth/use-login'
import { useToast } from '@/components/ui/use-toast'

const LoginForm: React.FC<LoginFormProps> = ({ 
  className, 
  onGoogleLogin, 
  onSubmitEmailPassword 
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const { login, isLoading, error, isSuccess } = useLogin()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showEmailForm, setShowEmailForm] = useState(false)

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Login successful!',
        description: 'Welcome back to Tempra',
      })
      router.push('/dashboard')
    }
  }, [isSuccess, router, toast])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Login failed',
        description: error,
        variant: 'destructive',
      })
    }
  }, [error, toast])

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
