export const PASSWORD_MIN_LENGTH = 8

export const AUTH_PLACEHOLDERS = {
  email: 'you@company.com',
  username: 'johndoe',
  password: '••••••••',
  confirmPassword: '••••••••',
  firstName: 'John',
  lastName: 'Doe',
} as const

export const AUTH_VALIDATION_MESSAGES = {
  passwordMismatch: 'Passwords do not match',
  passwordTooShort: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  requiredField: 'This field is required',
} as const

export const AUTH_BUTTON_TEXT = {
  login: {
    idle: 'Sign in',
    loading: 'Signing in...',
  },
  register: {
    idle: 'Create Account',
    loading: 'Creating account...',
  },
  continue: 'Continue',
  back: 'Back',
} as const

export const SOCIAL_PROVIDER_LABELS = {
  google: 'Google',
  microsoft: 'Microsoft',
} as const

export const REGISTRATION_STEP_TITLES = {
  1: 'Personal Information',
  2: 'Account Security',
  3: 'Almost Done!',
} as const

export const POLICY_LINKS = {
  terms: '/terms',
  privacy: '/privacy',
  forgotPassword: '/auth/forgot-password',
} as const

export const AUTH_ROUTES = {
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
} as const

export const SOCIAL_PROVIDER_ICONS = {
  google: '/images/google.svg',
  microsoft: '/images/microsoft.svg',
} as const
