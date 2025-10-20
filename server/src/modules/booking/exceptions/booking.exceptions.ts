import { HttpException, HttpStatus } from '@nestjs/common';

export class BookingLinkNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'Booking link not found', HttpStatus.NOT_FOUND);
  }
}

export class BookingNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'Booking not found', HttpStatus.NOT_FOUND);
  }
}

export class BookingLinkInactiveException extends HttpException {
  constructor(message?: string) {
    super(message || 'Booking link is not active', HttpStatus.BAD_REQUEST);
  }
}

export class BookingSlugExistsException extends HttpException {
  constructor(message?: string) {
    super(message || 'Booking link slug already exists', HttpStatus.CONFLICT);
  }
}

export class BookingTimeUnavailableException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Selected time slot is not available',
      HttpStatus.CONFLICT,
    );
  }
}

export class BookingPastDateException extends HttpException {
  constructor(message?: string) {
    super(message || 'Cannot book for past dates', HttpStatus.BAD_REQUEST);
  }
}

export class BookingAdvanceNoticeException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Booking does not meet minimum advance notice',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class BookingOutsideWindowException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Booking is outside the allowed booking window',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class BookingDailyLimitException extends HttpException {
  constructor(message?: string) {
    super(message || 'Daily booking limit reached', HttpStatus.CONFLICT);
  }
}

export class BookingAlreadyCancelledException extends HttpException {
  constructor(message?: string) {
    super(message || 'Booking is already cancelled', HttpStatus.BAD_REQUEST);
  }
}

export class BookingCannotCancelException extends HttpException {
  constructor(message?: string) {
    super(message || 'Cannot cancel booking', HttpStatus.BAD_REQUEST);
  }
}

export class BookingCreationFailedException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Failed to create booking',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
