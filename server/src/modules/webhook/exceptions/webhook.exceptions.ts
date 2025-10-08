import { HttpException, HttpStatus } from '@nestjs/common';

export class WebhookChannelCreationFailedException extends HttpException {
  constructor(message: string = 'Failed to create webhook channel') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class WebhookChannelNotFoundException extends HttpException {
  constructor(channelId: string) {
    super(`Webhook channel ${channelId} not found`, HttpStatus.NOT_FOUND);
  }
}

export class WebhookChannelUnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized to access this webhook channel') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class WebhookChannelAlreadyExistsException extends HttpException {
  constructor(calendarId: string) {
    super(
      `Active webhook channel already exists for calendar ${calendarId}`,
      HttpStatus.CONFLICT,
    );
  }
}

export class GoogleCalendarNotConnectedException extends HttpException {
  constructor(message: string = 'Not connected to Google Calendar') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class WebhookNotificationProcessingException extends HttpException {
  constructor(message: string = 'Failed to process webhook notification') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
