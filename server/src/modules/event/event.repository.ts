import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { PaginationService } from '../../common/services/pagination.service';
import {
  PaginatedResult,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { Event } from './event';
import { CreateEventDto, UpdateEventDto } from './dto/events.dto';
import { UserValidationService } from '../../common/services/user-validation.service';
import { CalendarValidationService } from '../../common/services/calendar-validation.service';
import { EventValidationService } from '../../common/services/event-validation.service';
import {
  RecurringEventsService,
  ExpandedEvent,
} from '../../common/services/recurring-events.service';
import { MessageService } from '../../common/message/message.service';
import { EventCreationFailedException } from './exceptions/event.exceptions';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class EventRepository extends BaseRepository<Event> {
  constructor(
    databaseService: DatabaseService,
    paginationService: PaginationService,
    messageService: MessageService,
    private userValidationService: UserValidationService,
    private calendarValidationService: CalendarValidationService,
    private eventValidationService: EventValidationService,
    private recurringEventsService: RecurringEventsService,
  ) {
    super(databaseService, paginationService, messageService, 'events');
  }

  protected getAllowedSortFields(): string[] {
    return ['created_at', 'updated_at', 'start_time', 'end_time', 'title'];
  }

  /**
   * Normalize event data to ensure frontend compatibility
   * - Convert null attendees/reminders to empty arrays
   * - Ensure all required fields have valid values
   * - Validate date fields to prevent "Invalid time value" errors
   */
  private normalizeEventData(event: Event): Event {
    // Ensure dates are valid Date objects
    const start_time = event.start_time instanceof Date 
      ? event.start_time 
      : new Date(event.start_time);
    
    const end_time = event.end_time instanceof Date
      ? event.end_time
      : new Date(event.end_time);

    // Check for invalid dates
    if (isNaN(start_time.getTime())) {
      this.logger.warn(`Invalid start_time for event ${event.id}`);
    }
    if (isNaN(end_time.getTime())) {
      this.logger.warn(`Invalid end_time for event ${event.id}`);
    }

    return {
      ...event,
      start_time,
      end_time,
      attendees: event.attendees || [],
      reminders: event.reminders || [],
      status: event.status || 'confirmed',
      color: event.color || 'blue',
      is_all_day: event.is_all_day ?? false,
      is_recurring: event.is_recurring ?? false,
      description: event.description || '',
      location: event.location || '',
      timezone: event.timezone || 'UTC',
    };
  }

  async createEvent(eventDto: CreateEventDto, userId: string): Promise<Event> {
    await this.userValidationService.validateUserExists(userId);
    await this.calendarValidationService.validateCalendarExists(userId);

    await this.eventValidationService.validateEvent(
      userId,
      eventDto.title,
      new Date(eventDto.start_time),
      new Date(eventDto.end_time),
      eventDto.description,
      eventDto.recurrence_rule,
    );

    const eventData: Partial<Event> = {
      calendar_id: eventDto.calendar_id,
      title: eventDto.title,
      description: eventDto.description,
      start_time: new Date(eventDto.start_time),
      end_time: new Date(eventDto.end_time),
      location: eventDto.location,
      is_all_day: eventDto.is_all_day || false,
      color: eventDto.color || 'blue',
      recurrence_rule: eventDto.recurrence_rule,
    };

    try {
      const event = await this.create(eventData);
      return this.normalizeEventData(event);
    } catch (error) {
      throw new EventCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async getEvents(
    userId: string,
    options: any,
  ): Promise<PaginatedResult<Event>> {
    await this.userValidationService.validateUserExists(userId);

    try {
      const validatedOptions =
        this.paginationService.validatePaginationOptions(options);
      const { page, limit, sortBy = 'created_at', sortOrder = 'DESC' } = validatedOptions;
      const offset = (page - 1) * limit;

      const { start_date, end_date, calendar_id } = options;

      const allowedSortFields = ['created_at', 'updated_at', 'start_time', 'end_time', 'title'];
      const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
      const safeSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

      const conditions: string[] = ['c.user_id = $1'];
      const params: any[] = [userId];
      let paramIndex = 2;

      if (start_date) {
        conditions.push(`e.start_time >= $${paramIndex}`);
        params.push(start_date);
        paramIndex++;
      }

      if (end_date) {
        conditions.push(`e.end_time <= $${paramIndex}`);
        params.push(end_date);
        paramIndex++;
      }

      if (calendar_id) {
        conditions.push(`e.calendar_id = $${paramIndex}`);
        params.push(calendar_id);
        paramIndex++;
      }

      const whereClause = conditions.join(' AND ');

      const countQuery = `
        SELECT COUNT(*) 
        FROM events e
        INNER JOIN calendars c ON e.calendar_id = c.id
        WHERE ${whereClause}
      `;

      const dataQuery = `
        SELECT e.* 
        FROM events e
        INNER JOIN calendars c ON e.calendar_id = c.id
        WHERE ${whereClause}
        ORDER BY e.${safeSortBy} ${safeSortOrder}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      const [countResult, dataResult] = await Promise.all([
        this.databaseService.query(countQuery, params),
        this.databaseService.query<Event>(dataQuery, [...params, limit, offset]),
      ]);

      const total = parseInt(countResult.rows[0].count);
      const items = dataResult.rows.map(event => this.normalizeEventData(event));

      return this.paginationService.createPaginatedResult(
        items,
        page,
        limit,
        total,
      );
    } catch (error) {
      this.logger.error('Failed to get events:', error);
      throw new EventCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async searchEvents(
    userId: string,
    searchTerm: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Event>> {
    await this.userValidationService.validateUserExists(userId);

    const searchPattern = `%${searchTerm}%`;
    const whereCondition =
      'user_id = $1 AND (title ILIKE $2 OR description ILIKE $2)';
    const whereParams = [userId, searchPattern];

    try {
      const result = await this.search(whereCondition, whereParams, paginationOptions);
      return {
        ...result,
        data: result.data.map(event => this.normalizeEventData(event)),
      };
    } catch (error) {
      this.logger.error('Failed to search events:', error);
      throw new EventCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async getEventById(eventId: string, userId: string): Promise<Event | null> {
    await this.userValidationService.validateUserExists(userId);

    try {
      const event = await this.findById(eventId);
      if (event) {
        // Event ownership is validated through calendar_id
        // No direct user_id check needed
        return this.normalizeEventData(event);
      }
      return null;
    } catch (error) {
      this.logger.error(`Failed to get event ${eventId}:`, error);
      throw new EventCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async updateEvent(
    eventId: string,
    eventDto: UpdateEventDto,
    userId: string,
  ): Promise<Event> {
    await this.userValidationService.validateUserExists(userId);

    const existingEvent = await this.getEventById(eventId, userId);
    if (!existingEvent) {
      throw new EventCreationFailedException(
        this.messageService.get('calendar.event_not_found'),
      );
    }

    // Only validate fields that are being updated
    if (eventDto.title || eventDto.start_time || eventDto.end_time) {
      await this.eventValidationService.validateEvent(
        userId,
        eventDto.title || existingEvent.title,
        eventDto.start_time ? new Date(eventDto.start_time) : existingEvent.start_time,
        eventDto.end_time ? new Date(eventDto.end_time) : existingEvent.end_time,
        eventDto.description,
        eventDto.recurrence_rule,
        eventId,
      );
    }

    const eventData: Partial<Event> = {};
    
    // Only include fields that are provided
    if (eventDto.title !== undefined) eventData.title = eventDto.title;
    if (eventDto.description !== undefined) eventData.description = eventDto.description;
    if (eventDto.start_time !== undefined) eventData.start_time = new Date(eventDto.start_time);
    if (eventDto.end_time !== undefined) eventData.end_time = new Date(eventDto.end_time);
    if (eventDto.location !== undefined) eventData.location = eventDto.location;
    if (eventDto.is_all_day !== undefined) eventData.is_all_day = eventDto.is_all_day;
    if (eventDto.color !== undefined) eventData.color = eventDto.color;
    if (eventDto.recurrence_rule !== undefined) eventData.recurrence_rule = eventDto.recurrence_rule;

    try {
      const updatedEvent = await this.update(eventId, eventData);
      if (!updatedEvent) {
        throw new EventCreationFailedException(
          this.messageService.get('calendar.event_not_found'),
        );
      }
      return this.normalizeEventData(updatedEvent);
    } catch (error) {
      this.logger.error(`Failed to update event ${eventId}:`, error);
      throw new EventCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async deleteEvent(eventId: string, userId: string): Promise<boolean> {
    await this.userValidationService.validateUserExists(userId);

    const existingEvent = await this.getEventById(eventId, userId);
    if (!existingEvent) {
      throw new EventCreationFailedException(
        this.messageService.get('error.event_not_found'),
      );
    }

    try {
      const result = await this.delete(eventId);
      return result !== null;
    } catch (error) {
      this.logger.error(`Failed to delete event ${eventId}:`, error);
      throw new EventCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Event>> {
    await this.userValidationService.validateUserExists(userId);

    const whereCondition =
      'user_id = $1 AND start_time <= $3 AND end_time >= $2';
    const whereParams = [userId, startDate, endDate];

    try {
      const result = await this.search(whereCondition, whereParams, options);
      return {
        ...result,
        data: result.data.map(event => this.normalizeEventData(event)),
      };
    } catch (error) {
      this.logger.error(
        'Failed to get events by user ID and date range:',
        error,
      );
      throw new EventCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }
  async searchEventsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    searchTerm: string,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Event>> {
    await this.userValidationService.validateUserExists(userId);

    const searchPattern = `%${searchTerm}%`;
    const whereCondition = `
            user_id = $1 
            AND start_time <= $4 
            AND end_time >= $3 
            AND (title ILIKE $2 OR description ILIKE $2)
        `;
    const whereParams = [userId, searchPattern, startDate, endDate];

    try {
      const result = await this.search(whereCondition, whereParams, options);
      return {
        ...result,
        data: result.data.map(event => this.normalizeEventData(event)),
      };
    } catch (error) {
      this.logger.error('Failed to search events by date range:', error);
      throw new EventCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async findRecurringEventsForExpansion(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Event[]> {
    await this.userValidationService.validateUserExists(userId);

    const query = `
            SELECT * FROM ${this.tableName}
            WHERE user_id = $1 
                AND recurrence_rule IS NOT NULL 
                AND recurrence_rule != ''
                AND start_time <= $3
            ORDER BY start_time ASC
        `;

    try {
      const result = await this.databaseService.query(query, [
        userId,
        startDate,
        endDate,
      ]);
      return result.rows.map(event => this.normalizeEventData(event));
    } catch (error) {
      this.logger.error(
        'Failed to find recurring events for expansion:',
        error,
      );
      throw new EventCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async expandRecurringEvents(
    userId: string,
    startDate: Date,
    endDate: Date,
    maxOccurrences: number,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<ExpandedEvent>> {
    await this.userValidationService.validateUserExists(userId);

    try {
      const recurringEvents = await this.findRecurringEventsForExpansion(
        userId,
        startDate,
        endDate,
      );
      const expandedEvents = this.recurringEventsService.expandRecurringEvents(
        recurringEvents,
        startDate,
        endDate,
        maxOccurrences,
      );

      return this.paginateExpandedEvents(expandedEvents, options);
    } catch (error) {
      this.logger.error('Failed to expand recurring events:', error);
      throw new EventCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  private paginateExpandedEvents(
    expandedEvents: ExpandedEvent[],
    options: Partial<PaginationOptions>,
  ): PaginatedResult<ExpandedEvent> {
    const validatedOptions =
      this.paginationService.validatePaginationOptions(options);
    const { page, limit } = validatedOptions;

    const startIndex = (page - 1) * limit;
    const paginatedItems = expandedEvents.slice(startIndex, startIndex + limit);

    return this.paginationService.createPaginatedResult(
      paginatedItems,
      page,
      limit,
      expandedEvents.length,
    );
  }
}
