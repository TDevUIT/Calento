export const PASSWORD_MIN_LENGTH = 8

export const AUTH_PLACEHOLDERS = {
  email: 'you@company.com',
  username: 'johndoe',
  password: '••••••••',
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

export const FORM_FIELD_SIZES = {
  height: 'h-9 md:h-10 2xl:h-11',
  text: 'text-sm md:text-base 2xl:text-base',
} as const

export const BUTTON_SIZES = {
  social: 'h-11 md:h-12 lg:h-11 2xl:h-12',
  submit: 'h-10 md:h-11 2xl:h-12',
  padding: 'px-1.5 md:px-2 lg:px-2.5 2xl:px-2.5 py-1 md:py-1.5 lg:py-2 2xl:py-2',
} as const

export const ICON_SIZES = {
  social: 'w-5 h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6',
  navigation: 'w-4 h-4 md:w-5 md:h-5',
} as const
