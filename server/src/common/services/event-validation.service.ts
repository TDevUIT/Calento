import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { MessageService } from '../message/message.service';
import { EventValidationException } from '../../modules/event/exceptions/event.exceptions';
import { BUSINESS_CONSTANTS } from '../constants';

@Injectable()
export class EventValidationService {
  private readonly logger = new Logger(EventValidationService.name);

  constructor(
    private databaseService: DatabaseService,
    private messageService: MessageService,
  ) {}
  async validateEventTimes(startTime: Date, endTime: Date): Promise<void> {
    if (startTime >= endTime) {
      this.logger.warn(
        `Invalid event times: start ${startTime} >= end ${endTime}`,
      );
      throw new EventValidationException(
        this.messageService.get('error.event_invalid_time_range'),
      );
    }

    const now = new Date();
    if (startTime < now) {
      this.logger.warn(`Event start time ${startTime} is in the past`);
    }

    const durationMs = endTime.getTime() - startTime.getTime();
    const maxDurationMs = BUSINESS_CONSTANTS.EVENT.MAX_DURATION_MS;

    if (durationMs > maxDurationMs) {
      this.logger.warn(
        `Event duration ${durationMs}ms exceeds maximum ${maxDurationMs}ms`,
      );
      throw new EventValidationException(
        this.messageService.get('error.event_duration_too_long'),
      );
    }
  }

  async validateEventConflicts(
    userId: string,
    startTime: Date,
    endTime: Date,
    excludeEventId?: string,
    throwOnConflict: boolean = false,
  ): Promise<void> {
    try {
      let query = `
            SELECT e.id, e.title, e.start_time, e.end_time
            FROM events e
            INNER JOIN calendars c ON e.calendar_id = c.id
            WHERE c.user_id = $1
            AND e.start_time < $3
            AND e.end_time > $2
        `;

      const params = [userId, startTime, endTime];

      if (excludeEventId) {
        query += ' AND e.id != $4';
        params.push(excludeEventId);
      }

      const result = await this.databaseService.query(query, params);

      if (result.rows.length > 0) {
        const conflictingEvent = result.rows[0];
        this.logger.warn(
          `Event conflict detected with event ${conflictingEvent.id}: ${conflictingEvent.title}`,
        );

        if (throwOnConflict) {
          throw new EventValidationException(
            `Event time conflicts with existing event: "${conflictingEvent.title}" (${conflictingEvent.start_time} - ${conflictingEvent.end_time})`,
          );
        }
      }

      this.logger.debug(
        `No event conflicts found for user ${userId} in time range ${startTime} - ${endTime}`,
      );
    } catch (error) {
      if (error instanceof EventValidationException) {
        throw error;
      }

      this.logger.error('Failed to check event conflicts:', error);
      this.logger.warn(
        'Event conflict validation failed, proceeding with event creation',
      );
    }
  }

  async validateEventContent(
    title: string,
    description?: string,
  ): Promise<void> {
    if (!title || title.trim().length === 0) {
      throw new EventValidationException(
        this.messageService.get('error.event_title_required'),
      );
    }

    if (title.length > 500) {
      throw new EventValidationException(
        this.messageService.get('error.event_title_too_long'),
      );
    }

    if (description && description.length > 2000) {
      throw new EventValidationException(
        this.messageService.get('error.event_description_too_long'),
      );
    }

    const suspiciousPatterns = [/<script/i, /javascript:/i, /on\w+=/i];
    const contentToCheck = [title, description].filter(
      (content): content is string => Boolean(content),
    );

    for (const content of contentToCheck) {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(content)) {
          this.logger.warn(`Suspicious content detected in event: ${content}`);
          throw new EventValidationException(
            'Event content contains invalid characters or scripts',
          );
        }
      }
    }
  }

  async validateRecurrenceRule(recurrenceRule?: string): Promise<void> {
    if (!recurrenceRule) {
      return;
    }
    if (!recurrenceRule.startsWith('RRULE:')) {
      throw new EventValidationException(
        this.messageService.get('error.event_invalid_recurrence_format'),
      );
    }

    if (!recurrenceRule.includes('FREQ=')) {
      throw new EventValidationException(
        this.messageService.get('error.event_recurrence_missing_freq'),
      );
    }

    const validFreqs = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
    const freqMatch = recurrenceRule.match(/FREQ=(\w+)/);

    if (freqMatch && !validFreqs.includes(freqMatch[1])) {
      throw new EventValidationException(
        this.messageService.get('error.event_invalid_recurrence_freq'),
      );
    }
  }

  async validateEvent(
    userId: string,
    title: string,
    startTime: Date,
    endTime: Date,
    description?: string,
    recurrenceRule?: string,
    excludeEventId?: string,
  ): Promise<void> {
    this.logger.debug(`Validating event for user ${userId}: ${title}`);

    // Run all validations
    await Promise.all([
      this.validateEventContent(title, description),
      this.validateEventTimes(startTime, endTime),
      this.validateRecurrenceRule(recurrenceRule),
      this.validateEventConflicts(userId, startTime, endTime, excludeEventId),
    ]);

    this.logger.debug(`Event validation passed for user ${userId}: ${title}`);
  }
}
