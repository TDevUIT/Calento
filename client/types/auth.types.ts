export type LoginFormProps = {
  className?: string
  onGoogleLogin?: () => void
  onSubmitEmailPassword?: (payload: LoginPayload) => void
}

export type LoginPayload = {
  email: string
  password: string
  remember: boolean
}

export type RegisterFormProps = {
  className?: string
  onGoogleRegister?: () => void
  onSubmitEmailPassword?: (payload: RegisterPayload) => void
}

export type RegisterPayload = {
  email: string
  username: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

export type RegistrationStep = 1 | 2 | 3

export type StepValidation = {
  isValid: boolean
  error?: string
}
