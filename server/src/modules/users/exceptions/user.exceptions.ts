import { HttpException, HttpStatus } from '@nestjs/common';

export class UserCreationFailedException extends HttpException {
  constructor(message?: string) {
    super(message || 'Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class UserNotFoundException extends HttpException {
  constructor(userId?: string) {
    super(
      `User ${userId ? `with ID ${userId}` : ''} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UserValidationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class DuplicateUserException extends HttpException {
  constructor(field: string, value: string) {
    super(`User with ${field} '${value}' already exists`, HttpStatus.CONFLICT);
  }
}

export class UserUpdateFailedException extends HttpException {
  constructor(message?: string) {
    super(message || 'Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class UserDeactivationFailedException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Failed to deactivate user',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
