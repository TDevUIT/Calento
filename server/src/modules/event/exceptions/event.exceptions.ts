import { HttpException, HttpStatus } from '@nestjs/common';

export class EventCreationFailedException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Failed to create event',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class EventNotFoundException extends HttpException {
  constructor(eventId?: string) {
    super(
      `Event ${eventId ? `with ID ${eventId}` : ''} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class EventValidationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class CalendarSyncException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Calendar synchronization failed',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
