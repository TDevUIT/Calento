import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthCreationFailedException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Failed to create user account',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class UserNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'User not found', HttpStatus.NOT_FOUND);
  }
}

export class DatabaseOperationException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Database operation failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class DuplicateEmailException extends HttpException {
  constructor(email?: string) {
    super(
      `Email ${email ? `'${email}'` : ''} is already registered`,
      HttpStatus.CONFLICT,
    );
  }
}

export class DuplicateUsernameException extends HttpException {
  constructor(username?: string) {
    super(
      `Username ${username ? `'${username}'` : ''} is already taken`,
      HttpStatus.CONFLICT,
    );
  }
}

export class WeakPasswordException extends HttpException {
  constructor() {
    super(
      'Password does not meet security requirements',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PasswordMismatchException extends HttpException {
  constructor() {
    super('Current password is incorrect', HttpStatus.BAD_REQUEST);
  }
}

export class AuthenticationFailedException extends HttpException {
  constructor(message?: string) {
    super(message || 'Authentication failed', HttpStatus.UNAUTHORIZED);
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor(email?: string) {
    super(
      `User with email ${email ? `'${email}'` : ''} already exists`,
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }
}

export class TokenExpiredException extends HttpException {
  constructor() {
    super('Token has expired', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super('Invalid or malformed token', HttpStatus.UNAUTHORIZED);
  }
}

export class UserNotVerifiedException extends HttpException {
  constructor() {
    super(
      'Email address is not verified. Please verify your email before logging in.',
      HttpStatus.FORBIDDEN,
    );
  }
}

export class AccountDisabledException extends HttpException {
  constructor() {
    super(
      'Account has been disabled. Please contact support.',
      HttpStatus.FORBIDDEN,
    );
  }
}

export class RefreshTokenExpiredException extends HttpException {
  constructor() {
    super(
      'Refresh token has expired. Please login again.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidRefreshTokenException extends HttpException {
  constructor() {
    super('Invalid refresh token', HttpStatus.UNAUTHORIZED);
  }
}

export class EmailVerificationRequiredException extends HttpException {
  constructor() {
    super(
      'Email verification is required to complete this action',
      HttpStatus.FORBIDDEN,
    );
  }
}

export class PasswordResetTokenExpiredException extends HttpException {
  constructor() {
    super(
      'Password reset token has expired. Please request a new one.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidPasswordResetTokenException extends HttpException {
  constructor() {
    super('Invalid password reset token', HttpStatus.BAD_REQUEST);
  }
}
