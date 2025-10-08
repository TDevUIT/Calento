import { HttpException, HttpStatus } from '@nestjs/common';

export class AvailabilityNotFoundException extends HttpException {
  constructor(id?: string) {
    super(id || 'Availability rule not found', HttpStatus.NOT_FOUND);
  }
}

export class AvailabilityCreationFailedException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Failed to create availability rule',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidTimeRangeException extends HttpException {
  constructor(message?: string) {
    super(message || 'Invalid time range', HttpStatus.BAD_REQUEST);
  }
}

export class OverlappingAvailabilityException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Overlapping availability rule detected',
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidDateRangeException extends HttpException {
  constructor(message?: string) {
    super(message || 'Invalid date range provided', HttpStatus.BAD_REQUEST);
  }
}

export class NoAvailabilityFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'No availability rules found', HttpStatus.NOT_FOUND);
  }
}

export class UserNotAvailableException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'User is not available at the requested time',
      HttpStatus.CONFLICT,
    );
  }
}
