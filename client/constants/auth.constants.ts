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
  passwordMismatch: 'Mật khẩu xác nhận không khớp',
  passwordTooShort: `Mật khẩu phải có ít nhất ${PASSWORD_MIN_LENGTH} ký tự`,
  requiredField: 'Trường này là bắt buộc',
  invalidEmail: 'Email không hợp lệ',
  invalidUsername: 'Tên đăng nhập không hợp lệ',
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
  409: 'Email hoặc tên đăng nhập đã được sử dụng. Vui lòng chọn thông tin khác.',
  400: 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.',
  401: 'Thông tin đăng nhập không chính xác.',
  403: 'Bạn không có quyền thực hiện hành động này.',
  500: 'Đã xảy ra lỗi từ phía máy chủ. Vui lòng thử lại sau.',
  network: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.',
  timeout: 'Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.',
  default: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.',
} as const

export const AUTH_SUCCESS_MESSAGES = {
  register: {
    title: 'Đăng ký thành công!',
    description: 'Chào mừng bạn đến với Tempra. Đang chuyển hướng...',
  },
  login: {
    title: 'Đăng nhập thành công!',
    description: 'Chào mừng bạn trở lại.',
  },
} as const
