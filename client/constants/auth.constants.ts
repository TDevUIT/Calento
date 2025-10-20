export const PASSWORD_MIN_LENGTH = 8
export const REDIRECT_DELAY_MS = 1500
export const ERROR_TOAST_DURATION = 5000
export const SUCCESS_TOAST_DURATION = 3000

export const AUTH_PLACEHOLDERS = {
  email: 'you@company.com',
  username: 'johndoe',
  password: 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢',
  confirmPassword: 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢',
  firstName: 'John',
  lastName: 'Doe',
} as const

export const AUTH_VALIDATION_MESSAGES = {
  passwordMismatch: 'Passwords do not match',
  passwordTooShort: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  requiredField: 'This field is required',
  invalidEmail: 'Invalid email address',
  invalidUsername: 'Invalid username',
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

export const AUTH_ERROR_MESSAGES = {
  409: 'Email or username already in use. Please choose different information.',
  400: 'Invalid information. Please check again.',
  401: 'Invalid login credentials.',
  403: 'You do not have permission to perform this action.',
  500: 'A server error occurred. Please try again later.',
  network: 'Unable to connect to server. Please check your internet connection.',
  timeout: 'Request took too long. Please try again.',
  default: 'An unexpected error occurred. Please try again.',
} as const

export const AUTH_SUCCESS_MESSAGES = {
  register: {
    title: 'Registration successful!',
    description: 'Welcome to Calento. Redirecting...',
  },
  login: {
    title: 'Login successful!',
    description: 'Welcome back.',
  },
} as const
