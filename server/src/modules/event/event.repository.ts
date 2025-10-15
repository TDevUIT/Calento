import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { PaginationService } from '../../common/services/pagination.service';
import {
  PaginatedResult,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { Event } from './event';
import { CreateEventDto, UpdateEventDto, PartialUpdateEventDto } from './dto/events.dto';
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
   * Override buildSelectQuery to automatically JOIN with users table for creator info
   * This ensures ALL queries return creator information without manual JOIN in each method
   */
  protected buildSelectQuery(includeDeleted = false): string {
    let query = `
      SELECT 
        e.*,
        u.id as creator_id,
        COALESCE(
          NULLIF(TRIM(CONCAT(u.first_name, ' ', u.last_name)), ''),
          u.username,
          u.email
        ) as creator_name,
        u.email as creator_email,
        u.avatar as creator_avatar
      FROM ${this.tableName} e
      LEFT JOIN users u ON e.organizer_id = u.id
    `;
    if (!includeDeleted && this.isSoftDeletable()) {
      query += ` WHERE e.deleted_at IS NULL`;
    }
    return query;
  }

  /**
   * Override findById to use table alias in WHERE clause
   * This prevents "column reference 'id' is ambiguous" error when JOINing with users table
   */
  async findById(id: string): Promise<Event | null> {
    const query = `${this.buildSelectQuery()} WHERE e.id = $1`;

    try {
      const result = await this.databaseService.query<any>(query, [id]);
      if (!result.rows[0]) return null;
      return this.normalizeEventDataWithCreator(result.rows[0]);
    } catch (error) {
      this.logger.error(`Failed to find ${this.tableName} by ID ${id}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  /**
   * Properly serialize JSON fields for PostgreSQL JSONB columns
   * Handles null/undefined values and prevents double-encoding
   */
  private serializeJsonField(value: any): any {
    if (value === null || value === undefined) {
      return null;
    }
    
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        this.logger.debug(`Parsed JSON string back to object:`, { original: value, parsed });
        return parsed;
      } catch (error) {
        this.logger.debug(`String is not JSON, returning as-is:`, value);
        return value;
      }
    }
    
    this.logger.debug(`Returning object/array as-is:`, value);
    return value;
  }

  /**
   * Properly deserialize JSON fields from PostgreSQL JSONB columns
   * Handles null values and provides fallback defaults
   */
  private deserializeJsonField(value: any, defaultValue: any = null): any {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    
    if (typeof value === 'object') {
      return value;
    }
    
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (error) {
        this.logger.warn(`Failed to parse JSON field: ${value}`, error);
        return defaultValue;
      }
    }
    
    return defaultValue;
  }

  /**
   * Create method with proper JSON field handling for PostgreSQL JSONB columns
   * This method ensures JSON fields are properly formatted before database insertion
   */
  private async createWithJsonHandling(data: Partial<Event>): Promise<Event> {
    const jsonFields = ['attendees', 'reminders', 'conference_data'];
    const processedData = { ...data };

    // Process JSON fields to ensure they're in the correct format
    for (const field of jsonFields) {
      if (processedData[field] !== undefined) {
        const value = processedData[field];
        
        if (value === null || value === undefined) {
          processedData[field] = null;
        } else if (typeof value === 'string') {
          try {
            // If it's a JSON string, parse it first, then stringify it properly
            const parsed = JSON.parse(value);
            processedData[field] = JSON.stringify(parsed);
            this.logger.debug(`Parsed and stringified JSON field ${field}:`, { original: value, result: processedData[field] });
          } catch (error) {
            this.logger.warn(`Invalid JSON in field ${field}, setting to null:`, value);
            processedData[field] = null;
          }
        } else if (typeof value === 'object') {
          // If it's an object, stringify it for PostgreSQL JSONB
          processedData[field] = JSON.stringify(value);
          this.logger.debug(`Stringified object field ${field}:`, { original: value, result: processedData[field] });
        } else {
          this.logger.warn(`Unexpected type for JSON field ${field}, setting to null:`, typeof value);
          processedData[field] = null;
        }
      }
    }

    this.logger.debug('Final processed data for database:', processedData);

    return await super.create(processedData);
  }

  /**
   * Update method with proper JSON field handling for PostgreSQL JSONB columns
   */
  private async updateWithJsonHandling(id: string, data: Partial<Event>): Promise<Event | null> {
    const jsonFields = ['attendees', 'reminders', 'conference_data'];
    const processedData = { ...data };

    // Process JSON fields to ensure they're in the correct format
    for (const field of jsonFields) {
      if (processedData[field] !== undefined) {
        const value = processedData[field];
        
        if (value === null || value === undefined) {
          processedData[field] = null;
        } else if (typeof value === 'string') {
          try {
            // If it's a JSON string, parse it first, then stringify it properly
            const parsed = JSON.parse(value);
            processedData[field] = JSON.stringify(parsed);
            this.logger.debug(`Parsed and stringified JSON field ${field} for update:`, { original: value, result: processedData[field] });
          } catch (error) {
            this.logger.warn(`Invalid JSON in field ${field} for update, setting to null:`, value);
            processedData[field] = null;
          }
        } else if (typeof value === 'object') {
          // If it's an object, stringify it for PostgreSQL JSONB
          processedData[field] = JSON.stringify(value);
          this.logger.debug(`Stringified object field ${field} for update:`, { original: value, result: processedData[field] });
        } else {
          this.logger.warn(`Unexpected type for JSON field ${field} in update, setting to null:`, typeof value);
          processedData[field] = null;
        }
      }
    }

    this.logger.debug('Final processed data for update:', processedData);

    return await super.update(id, processedData);
  }

  private normalizeEventData(event: Event): Event {
    let start_time: Date;
    let end_time: Date;

    try {
      if (event.start_time instanceof Date) {
        start_time = event.start_time;
      } else if (event.start_time) {
        start_time = new Date(event.start_time);
      } else {
        this.logger.error(`Missing start_time for event ${event.id}, using current time`);
        start_time = new Date();
      }

      if (event.end_time instanceof Date) {
        end_time = event.end_time;
      } else if (event.end_time) {
        end_time = new Date(event.end_time);
      } else {
        this.logger.error(`Missing end_time for event ${event.id}, using start_time + 1 hour`);
        end_time = new Date(start_time.getTime() + 3600000);
      }

      if (isNaN(start_time.getTime())) {
        this.logger.error(`Invalid start_time for event ${event.id}: ${event.start_time}`);
        start_time = new Date();
      }
      if (isNaN(end_time.getTime())) {
        this.logger.error(`Invalid end_time for event ${event.id}: ${event.end_time}`);
        end_time = new Date(start_time.getTime() + 3600000); 
      }
    } catch (error) {
      this.logger.error(`Error parsing dates for event ${event.id}:`, error);
      start_time = new Date();
      end_time = new Date(start_time.getTime() + 3600000);
    }

    return {
      ...event,
      start_time,
      end_time,
      attendees: this.deserializeJsonField(event.attendees, []),
      reminders: this.deserializeJsonField(event.reminders, []),
      conference_data: this.deserializeJsonField(event.conference_data, null),
      status: event.status || 'confirmed',
      color: event.color || 'blue',
      is_all_day: event.is_all_day ?? false,
      is_recurring: event.is_recurring ?? false,
      description: event.description || '',
      location: event.location || '',
      timezone: event.timezone || 'UTC',
    };
  }

  /**
   * Normalize event data with creator information from JOIN query
   * Extracts creator fields from row and attaches them to the event object
   */
  private normalizeEventDataWithCreator(row: any): Event {
    // Extract creator fields
    const creator_id = row.creator_id;
    const creator_name = row.creator_name;
    const creator_email = row.creator_email;
    const creator_avatar = row.creator_avatar;

    // Debug logging
    this.logger.debug('normalizeEventDataWithCreator - Raw row data:', {
      event_id: row.id,
      event_title: row.title,
      organizer_id: row.organizer_id,
      creator_id,
      creator_name,
      creator_email,
      creator_avatar,
    });

    // If organizer_id is null, this is likely a data issue
    if (!row.organizer_id) {
      this.logger.warn(`Event ${row.id} has null organizer_id - creator info will be missing`);
    }

    // Remove creator fields from row to avoid duplication
    const { creator_id: _, creator_name: __, creator_email: ___, creator_avatar: ____, ...eventData } = row;

    // Normalize the event data first
    const normalizedEvent = this.normalizeEventData(eventData as Event);

    // Attach creator info if available
    if (creator_id) {
      const creatorInfo = {
        id: creator_id,
        name: creator_name || undefined,
        email: creator_email || undefined,
        avatar: creator_avatar || undefined,
      };
      
      this.logger.debug('normalizeEventDataWithCreator - Attaching creator:', creatorInfo);
      
      return {
        ...normalizedEvent,
        creator: creatorInfo,
      };
    }

    this.logger.warn('normalizeEventDataWithCreator - No creator_id found, returning event without creator');
    return normalizedEvent;
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

    this.logger.debug('CreateEvent DTO received:', {
      attendees: eventDto.attendees,
      attendees_type: typeof eventDto.attendees,
      reminders: eventDto.reminders,
      reminders_type: typeof eventDto.reminders,
      conference_data: eventDto.conference_data,
      conference_data_type: typeof eventDto.conference_data,
    });

    const eventData: Partial<Event> = {
      calendar_id: eventDto.calendar_id,
      google_event_id: undefined,
      title: eventDto.title,
      description: eventDto.description,
      start_time: new Date(eventDto.start_time),
      end_time: new Date(eventDto.end_time),
      location: eventDto.location,
      is_all_day: eventDto.is_all_day || false,
      color: eventDto.color || '#3b82f6',
      recurrence_rule: eventDto.recurrence_rule,
      organizer_id: userId,
      attendees: eventDto.attendees || [],
      conference_data: eventDto.conference_data,
      reminders: eventDto.reminders || [],
      visibility: eventDto.visibility || 'default',
    };

    this.logger.debug('Processed event data:', {
      attendees: eventData.attendees,
      attendees_type: typeof eventData.attendees,
      reminders: eventData.reminders,
      reminders_type: typeof eventData.reminders,
      conference_data: eventData.conference_data,
      conference_data_type: typeof eventData.conference_data,
    });

    try {
      const event = await this.createWithJsonHandling(eventData);
      // After creating, fetch the event with creator info using the JOIN query
      const eventWithCreator = await this.findById(event.id);
      return eventWithCreator || this.normalizeEventData(event);
    } catch (error) {
      this.logger.error('Failed to create event:', error);
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
        SELECT 
          e.*,
          u.id as creator_id,
          CONCAT(u.first_name, ' ', u.last_name) as creator_name,
          u.email as creator_email,
          u.avatar as creator_avatar
        FROM events e
        INNER JOIN calendars c ON e.calendar_id = c.id
        LEFT JOIN users u ON e.organizer_id = u.id
        WHERE ${whereClause}
        ORDER BY e.${safeSortBy} ${safeSortOrder}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      const [countResult, dataResult] = await Promise.all([
        this.databaseService.query(countQuery, params),
        this.databaseService.query<Event>(dataQuery, [...params, limit, offset]),
      ]);

      const total = parseInt(countResult.rows[0].count);
      const items = dataResult.rows.map(row => this.normalizeEventDataWithCreator(row));

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
    // Use 'e.' alias because buildSelectQuery joins with users table
    const whereCondition =
      'e.user_id = $1 AND (e.title ILIKE $2 OR e.description ILIKE $2)';
    const whereParams = [userId, searchPattern];

    try {
      const result = await this.search(whereCondition, whereParams, paginationOptions);
      return {
        ...result,
        data: result.data.map(event => this.normalizeEventDataWithCreator(event)),
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
      if (eventId.includes('_occurrence_')) {
        const [originalId, occurrencePart] = eventId.split('_occurrence_');
        const occurrenceIndex = parseInt(occurrencePart, 10);

        if (isNaN(occurrenceIndex)) {
          this.logger.warn(`Invalid occurrence index in ID: ${eventId}`);
          return null;
        }

        const originalEvent = await this.findById(originalId);
        if (!originalEvent) {
          return null;
        }

        const occurrence = this.recurringEventsService.getOccurrenceById(
          originalEvent,
          occurrenceIndex,
        );

        return occurrence;
      }

      return await this.findById(eventId);
    } catch (error) {
      this.logger.error(`Failed to get event ${eventId}:`, error);
      throw new EventCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async replaceEvent(
    eventId: string,
    eventDto: UpdateEventDto,
    userId: string,
  ): Promise<Event> {
    await this.userValidationService.validateUserExists(userId);

    const actualId = eventId.includes('_occurrence_') 
      ? eventId.split('_occurrence_')[0] 
      : eventId;

    const existingEvent = await this.getEventById(actualId, userId);
    if (!existingEvent) {
      throw new EventCreationFailedException(
        this.messageService.get('calendar.event_not_found'),
      );
    }

    await this.eventValidationService.validateEvent(
      userId,
      eventDto.title,
      new Date(eventDto.start_time),
      new Date(eventDto.end_time),
      eventDto.description,
      eventDto.recurrence_rule,
      actualId,
    );

    const eventData: Partial<Event> = {
      calendar_id: eventDto.calendar_id,
      title: eventDto.title,
      description: eventDto.description,
      start_time: new Date(eventDto.start_time),
      end_time: new Date(eventDto.end_time),
      location: eventDto.location,
      is_all_day: eventDto.is_all_day ?? false,
      color: eventDto.color,
      recurrence_rule: eventDto.recurrence_rule,
      attendees: eventDto.attendees,
      conference_data: eventDto.conference_data,
      reminders: eventDto.reminders,
      visibility: eventDto.visibility,
      response_status: eventDto.response_status,
    };

    try {
      const updatedEvent = await this.updateWithJsonHandling(actualId, eventData);
      if (!updatedEvent) {
        throw new EventCreationFailedException(
          this.messageService.get('calendar.event_not_found'),
        );
      }
      // After updating, fetch the event with creator info using the JOIN query
      const eventWithCreator = await this.findById(actualId);
      return eventWithCreator || this.normalizeEventData(updatedEvent);
    } catch (error) {
      this.logger.error(`Failed to replace event ${actualId}:`, error);
      throw new EventCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async updateEvent(
    eventId: string,
    eventDto: PartialUpdateEventDto,
    userId: string,
  ): Promise<Event> {
    await this.userValidationService.validateUserExists(userId);

    const actualId = eventId.includes('_occurrence_') 
      ? eventId.split('_occurrence_')[0] 
      : eventId;

    const existingEvent = await this.getEventById(actualId, userId);
    if (!existingEvent) {
      throw new EventCreationFailedException(
        this.messageService.get('calendar.event_not_found'),
      );
    }

    if (eventDto.title || eventDto.start_time || eventDto.end_time) {
      await this.eventValidationService.validateEvent(
        userId,
        eventDto.title || existingEvent.title,
        eventDto.start_time ? new Date(eventDto.start_time) : existingEvent.start_time,
        eventDto.end_time ? new Date(eventDto.end_time) : existingEvent.end_time,
        eventDto.description,
        eventDto.recurrence_rule,
        actualId,
      );
    }

    const eventData: Partial<Event> = {};
    
    if (eventDto.calendar_id !== undefined) eventData.calendar_id = eventDto.calendar_id;
    if (eventDto.title !== undefined) eventData.title = eventDto.title;
    if (eventDto.description !== undefined) eventData.description = eventDto.description;
    if (eventDto.start_time !== undefined) eventData.start_time = new Date(eventDto.start_time);
    if (eventDto.end_time !== undefined) eventData.end_time = new Date(eventDto.end_time);
    if (eventDto.location !== undefined) eventData.location = eventDto.location;
    if (eventDto.is_all_day !== undefined) eventData.is_all_day = eventDto.is_all_day;
    if (eventDto.color !== undefined) eventData.color = eventDto.color;
    if (eventDto.recurrence_rule !== undefined) eventData.recurrence_rule = eventDto.recurrence_rule;
    if (eventDto.attendees !== undefined) eventData.attendees = eventDto.attendees;
    if (eventDto.conference_data !== undefined) eventData.conference_data = eventDto.conference_data;
    if (eventDto.reminders !== undefined) eventData.reminders = eventDto.reminders;
    if (eventDto.visibility !== undefined) eventData.visibility = eventDto.visibility;
    if (eventDto.response_status !== undefined) eventData.response_status = eventDto.response_status;

    try {
      const updatedEvent = await this.updateWithJsonHandling(actualId, eventData);
      if (!updatedEvent) {
        throw new EventCreationFailedException(
          this.messageService.get('calendar.event_not_found'),
        );
      }
      // After updating, fetch the event with creator info using the JOIN query
      const eventWithCreator = await this.findById(actualId);
      return eventWithCreator || this.normalizeEventData(updatedEvent);
    } catch (error) {
      this.logger.error(`Failed to update event ${actualId}:`, error);
      throw new EventCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async deleteEvent(eventId: string, userId: string): Promise<boolean> {
    await this.userValidationService.validateUserExists(userId);

    const actualId = eventId.includes('_occurrence_') 
      ? eventId.split('_occurrence_')[0] 
      : eventId;

    const existingEvent = await this.getEventById(actualId, userId);
    if (!existingEvent) {
      throw new EventCreationFailedException(
        this.messageService.get('error.event_not_found'),
      );
    }

    try {
      const result = await this.delete(actualId);
      return result !== null;
    } catch (error) {
      this.logger.error(`Failed to delete event ${actualId}:`, error);
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
      'e.user_id = $1 AND e.start_time <= $3 AND e.end_time >= $2';
    const whereParams = [userId, startDate, endDate];

    try {
      const result = await this.search(whereCondition, whereParams, options);
      return {
        ...result,
        data: result.data.map(event => this.normalizeEventDataWithCreator(event)),
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
            e.user_id = $1 
            AND e.start_time <= $4 
            AND e.end_time >= $3 
            AND (e.title ILIKE $2 OR e.description ILIKE $2)
        `;
    const whereParams = [userId, searchPattern, startDate, endDate];

    try {
      const result = await this.search(whereCondition, whereParams, options);
      return {
        ...result,
        data: result.data.map(event => this.normalizeEventDataWithCreator(event)),
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
      SELECT 
        e.*,
        u.id as creator_id,
        COALESCE(
          NULLIF(TRIM(CONCAT(u.first_name, ' ', u.last_name)), ''),
          u.username,
          u.email
        ) as creator_name,
        u.email as creator_email,
        u.avatar as creator_avatar
      FROM ${this.tableName} e
      INNER JOIN calendars c ON e.calendar_id = c.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE c.user_id = $1 
        AND e.recurrence_rule IS NOT NULL 
        AND e.recurrence_rule != ''
        AND e.start_time <= $2
      ORDER BY e.start_time ASC
    `;

    try {
      const result = await this.databaseService.query(query, [
        userId,
        endDate,
      ]);
      
      this.logger.debug('findRecurringEventsForExpansion - Raw query results:', {
        count: result.rows.length,
        sample: result.rows[0] ? {
          id: result.rows[0].id,
          title: result.rows[0].title,
          organizer_id: result.rows[0].organizer_id,
          creator_id: result.rows[0].creator_id,
          creator_name: result.rows[0].creator_name,
        } : null,
      });
      
      return result.rows.map(row => this.normalizeEventDataWithCreator(row));
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
