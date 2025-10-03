import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception thrown when calendar creation fails
 */
export class CalendarCreationFailedException extends HttpException {
    constructor(reason?: string) {
        const message = reason 
            ? `Failed to create calendar: ${reason}` 
            : 'Failed to create calendar';
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Exception thrown when calendar is not found
 */
export class CalendarNotFoundException extends HttpException {
    constructor(calendarId?: string) {
        const message = calendarId 
            ? `Calendar with ID ${calendarId} not found` 
            : 'Calendar not found';
        super(message, HttpStatus.NOT_FOUND);
    }
}

/**
 * Exception thrown when calendar validation fails
 */
export class CalendarValidationException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}

/**
 * Exception thrown when calendar sync fails
 */
export class CalendarSyncException extends HttpException {
    constructor(reason?: string) {
        const message = reason 
            ? `Calendar sync failed: ${reason}` 
            : 'Calendar sync failed';
        super(message, HttpStatus.SERVICE_UNAVAILABLE);
    }
}

/**
 * Exception thrown when duplicate calendar is detected
 */
export class DuplicateCalendarException extends HttpException {
    constructor(googleCalendarId: string) {
        super(
            `Calendar with Google Calendar ID ${googleCalendarId} already exists`,
            HttpStatus.CONFLICT
        );
    }
}

/**
 * Exception thrown when calendar update fails
 */
export class CalendarUpdateFailedException extends HttpException {
    constructor(reason?: string) {
        const message = reason 
            ? `Failed to update calendar: ${reason}` 
            : 'Failed to update calendar';
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Exception thrown when user is not authorized to access calendar
 */
export class UnauthorizedCalendarAccessException extends HttpException {
    constructor() {
        super(
            'You are not authorized to access this calendar',
            HttpStatus.FORBIDDEN
        );
    }
}
