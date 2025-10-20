export interface ErrorNotification {
  title: string
  description: string
}

export const getLoginErrorNotification = (error: string): ErrorNotification => {
  if (error.includes('Invalid email or password')) {
    return {
      title: 'ðŸ”’ Invalid credentials',
      description: 'The email or password you entered is incorrect. Please double-check and try again.'
    }
  }
  
  if (error.includes('User not found')) {
    return {
      title: 'ðŸ‘¤ Account not found',
      description: 'No account exists with this email address. Please register first or check your email.'
    }
  }
  
  if (error.includes('not verified') || error.includes('verify your email')) {
    return {
      title: 'âœ‰ï¸ Email not verified',
      description: 'Please verify your email address before logging in. Check your inbox for the verification link.'
    }
  }
  
  if (error.includes('disabled') || error.includes('contact support')) {
    return {
      title: 'ðŸš« Account disabled',
      description: 'Your account has been disabled. Please contact our support team for assistance.'
    }
  }
  
  if (error.includes('expired') || error.includes('Token has expired')) {
    return {
      title: 'â° Session expired',
      description: 'Your session has expired. Please log in again to continue.'
    }
  }
  
  if (error.toLowerCase().includes('network') ||
      error.toLowerCase().includes('timeout') ||
      error.toLowerCase().includes('fetch')) {
    return {
      title: 'ðŸŒ Connection error',
      description: 'Unable to connect to the server. Please check your internet connection and try again.'
    }
  }
  
  if (error.includes('Authentication failed')) {
    return {
      title: 'âŒ Authentication failed',
      description: 'Unable to authenticate your account. Please try again or contact support if the problem persists.'
    }
  }
  
  return {
    title: 'Login failed',
    description: error
  }
}

export const getRegisterErrorNotification = (error: string): ErrorNotification => {
  if (error.includes('already registered') || 
      error.match(/Email .* is already registered/)) {
    return {
      title: 'ðŸ“§ Email already in use',
      description: 'This email address is already registered. Please use a different email or sign in if you already have an account.'
    }
  }
  
  if (error.includes('already taken') ||
      error.match(/Username .* is already taken/)) {
    return {
      title: 'ðŸ‘¤ Username already taken',
      description: 'This username is already in use. Please choose a different username and try again.'
    }
  }
  
  if (error.includes('does not meet security requirements') ||
      error.includes('Password does not meet')) {
    return {
      title: 'ðŸ”‘ Weak password',
      description: 'Your password doesn\'t meet our security requirements. Use at least 8 characters with uppercase, lowercase, and numbers.'
    }
  }
  
  if (error.includes('already exists')) {
    return {
      title: 'âš ï¸ User already exists',
      description: 'An account with this information already exists. Please try signing in instead.'
    }
  }
  
  if (error.toLowerCase().includes('invalid email') ||
      error.toLowerCase().includes('email format') ||
      error.toLowerCase().includes('must be an email')) {
    return {
      title: 'âœ‰ï¸ Invalid email',
      description: 'Please enter a valid email address in the correct format (e.g., name@example.com).'
    }
  }
  
  if (error.toLowerCase().includes('network') ||
      error.toLowerCase().includes('timeout') ||
      error.toLowerCase().includes('fetch')) {
    return {
      title: 'ðŸŒ Connection error',
      description: 'Unable to connect to the server. Please check your internet connection and try again.'
    }
  }
  
  if (error.includes('Failed to create user account')) {
    return {
      title: 'âŒ Account creation failed',
      description: 'We couldn\'t create your account at this time. Please try again later or contact support.'
    }
  }
  
  return {
    title: 'âŒ Registration failed',
    description: error
  }
}

export const VALIDATION_ERRORS = {
  passwordMismatch: {
    title: 'ðŸ”‘ Passwords don\'t match',
    description: 'Password and confirm password are not the same. Please check again.'
  },
  passwordTooShort: (minLength: number) => ({
    title: 'ðŸ”’ Password too short',
    description: `Password needs at least ${minLength} characters to ensure your account security.`
  })
} as const
