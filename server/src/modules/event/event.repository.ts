import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { PaginationService } from '../../common/services/pagination.service';
import {
  PaginatedResult,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { Event, EventAttendee } from './event';
import {
  CreateEventDto,
  UpdateEventDto,
  PartialUpdateEventDto,
} from './dto/events.dto';
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
        u.avatar as creator_avatar,
        t.id as team_ref_id,
        t.name as team_ref_name
      FROM ${this.tableName} e
      LEFT JOIN users u ON e.organizer_id = u.id
      LEFT JOIN teams t ON e.team_id = t.id
    `;
    if (!includeDeleted && this.isSoftDeletable()) {
      query += ` WHERE e.deleted_at IS NULL`;
    }
    return query;
  }

  private async validateTeamAccess(
    teamId: string,
    userId: string,
  ): Promise<void> {
    const result = await this.databaseService.query(
      `SELECT 1
       FROM teams t
       LEFT JOIN team_members tm
         ON tm.team_id = t.id
        AND tm.user_id = $2
        AND tm.status = 'active'
       WHERE t.id = $1
         AND (t.owner_id = $2 OR tm.id IS NOT NULL)
       LIMIT 1`,
      [teamId, userId],
    );

    if (result.rowCount === 0) {
      throw new Error('Team not found or access denied');
    }
  }

  async findById(id: string): Promise<Event | null> {
    const baseQuery = this.buildSelectQuery();
    const hasWhereClause = baseQuery.toUpperCase().includes('WHERE');
    const connector = hasWhereClause ? 'AND' : 'WHERE';
    const query = `${baseQuery} ${connector} e.id = $1`;

    try {
      const result = await this.databaseService.query<any>(query, [id]);
      if (!result.rows[0]) return null;
      return this.normalizeEventDataWithCreator(result.rows[0]);
    } catch (error) {
      this.logger.error(`Failed to find ${this.tableName} by ID ${id}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  private serializeJsonField(value: any): any {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        this.logger.debug(`Parsed JSON string back to object:`, {
          original: value,
          parsed,
        });
        return parsed;
      } catch (error) {
        this.logger.debug(`String is not JSON, returning as-is:`, value);
        return value;
      }
    }

    this.logger.debug(`Returning object/array as-is:`, value);
    return value;
  }

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

  private async createWithJsonHandling(data: Partial<Event>): Promise<Event> {
    const jsonFields = ['attendees', 'reminders', 'conference_data'];
    const processedData = { ...data };

    for (const field of jsonFields) {
      if (processedData[field] !== undefined) {
        const value = processedData[field];

        if (value === null || value === undefined) {
          processedData[field] = null;
        } else if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            processedData[field] = JSON.stringify(parsed);
            this.logger.debug(`Parsed and stringified JSON field ${field}:`, {
              original: value,
              result: processedData[field],
            });
          } catch (error) {
            this.logger.warn(
              `Invalid JSON in field ${field}, setting to null:`,
              value,
            );
            processedData[field] = null;
          }
        } else if (typeof value === 'object') {
          processedData[field] = JSON.stringify(value);
          this.logger.debug(`Stringified object field ${field}:`, {
            original: value,
            result: processedData[field],
          });
        } else {
          this.logger.warn(
            `Unexpected type for JSON field ${field}, setting to null:`,
            typeof value,
          );
          processedData[field] = null;
        }
      }
    }

    this.logger.debug('Final processed data for database:', processedData);

    return await super.create(processedData);
  }

  private async updateWithJsonHandling(
    id: string,
    data: Partial<Event>,
  ): Promise<Event | null> {
    const jsonFields = ['attendees', 'reminders', 'conference_data'];
    const processedData = { ...data };

    for (const field of jsonFields) {
      if (processedData[field] !== undefined) {
        const value = processedData[field];

        if (value === null || value === undefined) {
          processedData[field] = null;
        } else if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            processedData[field] = JSON.stringify(parsed);
            this.logger.debug(
              `Parsed and stringified JSON field ${field} for update:`,
              { original: value, result: processedData[field] },
            );
          } catch (error) {
            this.logger.warn(
              `Invalid JSON in field ${field} for update, setting to null:`,
              value,
            );
            processedData[field] = null;
          }
        } else if (typeof value === 'object') {
          processedData[field] = JSON.stringify(value);
          this.logger.debug(`Stringified object field ${field} for update:`, {
            original: value,
            result: processedData[field],
          });
        } else {
          this.logger.warn(
            `Unexpected type for JSON field ${field} in update, setting to null:`,
            typeof value,
          );
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
        this.logger.error(
          `Missing start_time for event ${event.id}, using current time`,
        );
        start_time = new Date();
      }

      if (event.end_time instanceof Date) {
        end_time = event.end_time;
      } else if (event.end_time) {
        end_time = new Date(event.end_time);
      } else {
        this.logger.error(
          `Missing end_time for event ${event.id}, using start_time + 1 hour`,
        );
        end_time = new Date(start_time.getTime() + 3600000);
      }

      if (isNaN(start_time.getTime())) {
        this.logger.error(
          `Invalid start_time for event ${event.id}: ${event.start_time}`,
        );
        start_time = new Date();
      }
      if (isNaN(end_time.getTime())) {
        this.logger.error(
          `Invalid end_time for event ${event.id}: ${event.end_time}`,
        );
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

  async syncAttendeesToDatabase(
    eventId: string,
    attendees: EventAttendee[],
    organizerEmail: string,
  ): Promise<void> {
    if (!attendees || attendees.length === 0) {
      this.logger.debug(`No attendees to sync for event ${eventId}`);
      return;
    }

    this.logger.log(
      `ðŸ“§ Syncing ${attendees.length} attendees to database for event ${eventId}`,
    );

    try {
      for (const attendee of attendees) {
        const isOrganizer =
          attendee.email.toLowerCase() === organizerEmail.toLowerCase();

        await this.databaseService.query(
          `INSERT INTO event_attendees 
           (event_id, email, name, response_status, is_organizer, is_optional, comment)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (event_id, email) 
           DO UPDATE SET 
             name = EXCLUDED.name,
             response_status = CASE 
               WHEN event_attendees.is_organizer = true THEN event_attendees.response_status
               ELSE event_attendees.response_status
             END,
             is_organizer = EXCLUDED.is_organizer,
             is_optional = EXCLUDED.is_optional,
             comment = EXCLUDED.comment,
             updated_at = NOW()`,
          [
            eventId,
            attendee.email,
            attendee.name || null,
            isOrganizer ? 'accepted' : 'needsAction',
            isOrganizer,
            attendee.is_optional || false,
            attendee.comment || null,
          ],
        );

        this.logger.debug(
          `âœ… Synced attendee: ${attendee.email} (is_organizer: ${isOrganizer})`,
        );
      }

      this.logger.log(
        `âœ… Successfully synced ${attendees.length} attendees to database`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to sync attendees to database: ${error.message}`,
        error.stack,
      );
    }
  }

  private normalizeEventDataWithCreator(row: any): Event {
    const creator_id = row.creator_id;
    const creator_name = row.creator_name;
    const creator_email = row.creator_email;
    const creator_avatar = row.creator_avatar;

    const team_ref_id = row.team_ref_id;
    const team_ref_name = row.team_ref_name;

    this.logger.debug('normalizeEventDataWithCreator - Raw row data:', {
      event_id: row.id,
      event_title: row.title,
      organizer_id: row.organizer_id,
      creator_id,
      creator_name,
      creator_email,
      creator_avatar,
    });

    if (!row.organizer_id) {
      this.logger.warn(
        `Event ${row.id} has null organizer_id - creator info will be missing`,
      );
    }

    const {
      creator_id: _,
      creator_name: __,
      creator_email: ___,
      creator_avatar: ____,
      team_ref_id: _____,
      team_ref_name: ______,
      ...eventData
    } = row;

    const normalizedEvent = this.normalizeEventData(eventData as Event);

    if (creator_id) {
      const creatorInfo = {
        id: creator_id,
        name: creator_name || undefined,
        email: creator_email || undefined,
        avatar: creator_avatar || undefined,
      };

      this.logger.debug(
        'normalizeEventDataWithCreator - Attaching creator:',
        creatorInfo,
      );

      return {
        ...normalizedEvent,
        creator: creatorInfo,
        ...(team_ref_id
          ? { team: { id: team_ref_id, name: team_ref_name || undefined } }
          : {}),
      };
    }

    this.logger.warn(
      'normalizeEventDataWithCreator - No creator_id found, returning event without creator',
    );
    return {
      ...normalizedEvent,
      ...(team_ref_id
        ? { team: { id: team_ref_id, name: team_ref_name || undefined } }
        : {}),
    };
  }

  async createEvent(eventDto: CreateEventDto, userId: string): Promise<Event> {
    await this.userValidationService.validateUserExists(userId);
    await this.calendarValidationService.validateCalendarExists(userId);

    if (eventDto.team_id) {
      await this.validateTeamAccess(eventDto.team_id, userId);
    }

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
      team_id: eventDto.team_id,
      google_event_id: undefined,
      title: eventDto.title,
      description: eventDto.description,
      start_time: new Date(eventDto.start_time),
      end_time: new Date(eventDto.end_time),
      location: eventDto.location,
      timezone: eventDto.timezone,
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

      const userResult = await this.databaseService.query(
        'SELECT email FROM users WHERE id = $1',
        [userId],
      );
      const organizerEmail = userResult.rows[0]?.email;

      if (
        eventDto.attendees &&
        eventDto.attendees.length > 0 &&
        organizerEmail
      ) {
        await this.syncAttendeesToDatabase(
          event.id,
          eventDto.attendees,
          organizerEmail,
        );
      }

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
      const {
        page,
        limit,
        sortBy = 'created_at',
        sortOrder = 'DESC',
      } = validatedOptions;
      const offset = (page - 1) * limit;

      const { start_date, end_date, calendar_id, team_id } = options;

      const allowedSortFields = [
        'created_at',
        'updated_at',
        'start_time',
        'end_time',
        'title',
      ];
      const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : 'created_at';
      const safeSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

      const conditions: string[] = ['e.organizer_id = $1'];
      const params: any[] = [userId];
      let paramIndex = 2;

      if (start_date) {
        conditions.push(`e.end_time > $${paramIndex}`);
        params.push(start_date);
        paramIndex++;
      }

      if (end_date) {
        conditions.push(`e.start_time < $${paramIndex}`);
        params.push(end_date);
        paramIndex++;
      }

      if (calendar_id) {
        conditions.push(`e.calendar_id = $${paramIndex}`);
        params.push(calendar_id);
        paramIndex++;
      }

      if (team_id) {
        conditions.push(`e.team_id = $${paramIndex}`);
        params.push(team_id);
        paramIndex++;
      }

      const whereClause = conditions.join(' AND ');

      const countQuery = `
        SELECT COUNT(*) 
        FROM events e
        WHERE ${whereClause}
      `;

      const dataQuery = `
        SELECT 
          e.*,
          u.id as creator_id,
          COALESCE(
            NULLIF(TRIM(CONCAT(u.first_name, ' ', u.last_name)), ''),
            u.username,
            u.email
          ) as creator_name,
          u.email as creator_email,
          u.avatar as creator_avatar,
          t.id as team_ref_id,
          t.name as team_ref_name
        FROM events e
        LEFT JOIN users u ON e.organizer_id = u.id
        LEFT JOIN teams t ON e.team_id = t.id
        WHERE ${whereClause}
        ORDER BY e.${safeSortBy} ${safeSortOrder}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      const [countResult, dataResult] = await Promise.all([
        this.databaseService.query(countQuery, params),
        this.databaseService.query<Event>(dataQuery, [
          ...params,
          limit,
          offset,
        ]),
      ]);

      const total = parseInt(countResult.rows[0].count);
      const items = dataResult.rows.map((row) =>
        this.normalizeEventDataWithCreator(row),
      );

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
      'e.organizer_id = $1 AND (e.title ILIKE $2 OR e.description ILIKE $2)';
    const whereParams = [userId, searchPattern];

    try {
      const result = await this.search(
        whereCondition,
        whereParams,
        paginationOptions,
      );
      return {
        ...result,
        data: result.data.map((event) =>
          this.normalizeEventDataWithCreator(event),
        ),
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
      team_id: eventDto.team_id,
      title: eventDto.title,
      description: eventDto.description,
      start_time: new Date(eventDto.start_time),
      end_time: new Date(eventDto.end_time),
      location: eventDto.location,
      timezone: eventDto.timezone,
      is_all_day: eventDto.is_all_day ?? false,
      color: eventDto.color,
      recurrence_rule: eventDto.recurrence_rule,
      attendees: eventDto.attendees,
      conference_data: eventDto.conference_data,
      reminders: eventDto.reminders,
      visibility: eventDto.visibility,
      response_status: eventDto.response_status,
    };

    if (eventDto.team_id) {
      await this.validateTeamAccess(eventDto.team_id, userId);
    }

    try {
      const updatedEvent = await this.updateWithJsonHandling(
        actualId,
        eventData,
      );
      if (!updatedEvent) {
        throw new EventCreationFailedException(
          this.messageService.get('calendar.event_not_found'),
        );
      }

      const userResult = await this.databaseService.query(
        'SELECT email FROM users WHERE id = $1',
        [userId],
      );
      const organizerEmail = userResult.rows[0]?.email;

      if (eventDto.attendees && organizerEmail) {
        await this.syncAttendeesToDatabase(
          actualId,
          eventDto.attendees,
          organizerEmail,
        );
      }

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
        eventDto.start_time
          ? new Date(eventDto.start_time)
          : existingEvent.start_time,
        eventDto.end_time
          ? new Date(eventDto.end_time)
          : existingEvent.end_time,
        eventDto.description,
        eventDto.recurrence_rule,
        actualId,
      );
    }

    if (eventDto.team_id) {
      await this.validateTeamAccess(eventDto.team_id, userId);
    }

    const eventData: Partial<Event> = {};

    if (eventDto.calendar_id !== undefined)
      eventData.calendar_id = eventDto.calendar_id;
    if (eventDto.team_id !== undefined) eventData.team_id = eventDto.team_id;
    if (eventDto.title !== undefined) eventData.title = eventDto.title;
    if (eventDto.description !== undefined)
      eventData.description = eventDto.description;
    if (eventDto.start_time !== undefined)
      eventData.start_time = new Date(eventDto.start_time);
    if (eventDto.end_time !== undefined)
      eventData.end_time = new Date(eventDto.end_time);
    if (eventDto.location !== undefined) eventData.location = eventDto.location;
    if (eventDto.timezone !== undefined) eventData.timezone = eventDto.timezone;
    if (eventDto.is_all_day !== undefined)
      eventData.is_all_day = eventDto.is_all_day;
    if (eventDto.color !== undefined) eventData.color = eventDto.color;
    if (eventDto.recurrence_rule !== undefined)
      eventData.recurrence_rule = eventDto.recurrence_rule;
    if (eventDto.attendees !== undefined)
      eventData.attendees = eventDto.attendees;
    if (eventDto.conference_data !== undefined)
      eventData.conference_data = eventDto.conference_data;
    if (eventDto.reminders !== undefined)
      eventData.reminders = eventDto.reminders;
    if (eventDto.visibility !== undefined)
      eventData.visibility = eventDto.visibility;
    if (eventDto.response_status !== undefined)
      eventData.response_status = eventDto.response_status;

    try {
      const updatedEvent = await this.updateWithJsonHandling(
        actualId,
        eventData,
      );
      if (!updatedEvent) {
        throw new EventCreationFailedException(
          this.messageService.get('calendar.event_not_found'),
        );
      }

      if (eventDto.attendees !== undefined) {
        const userResult = await this.databaseService.query(
          'SELECT email FROM users WHERE id = $1',
          [userId],
        );
        const organizerEmail = userResult.rows[0]?.email;

        if (organizerEmail) {
          await this.syncAttendeesToDatabase(
            actualId,
            eventDto.attendees,
            organizerEmail,
          );
        }
      }

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
      'organizer_id = $1 AND start_time <= $3 AND end_time >= $2';
    const whereParams = [userId, startDate, endDate];

    try {
      const result = await this.search(whereCondition, whereParams, options);
      return {
        ...result,
        data: result.data.map((event) =>
          this.normalizeEventDataWithCreator(event),
        ),
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
            organizer_id = $1 
            AND start_time <= $4 
            AND end_time >= $3 
            AND (title ILIKE $2 OR description ILIKE $2)
        `;
    const whereParams = [userId, searchPattern, startDate, endDate];

    try {
      const result = await this.search(whereCondition, whereParams, options);
      return {
        ...result,
        data: result.data.map((event) =>
          this.normalizeEventDataWithCreator(event),
        ),
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
        u.avatar as creator_avatar,
        t.id as team_ref_id,
        t.name as team_ref_name
      FROM ${this.tableName} e
      INNER JOIN calendars c ON e.calendar_id = c.id
      LEFT JOIN users u ON e.organizer_id = u.id
      LEFT JOIN teams t ON e.team_id = t.id
      WHERE c.user_id = $1 
        AND e.is_recurring = true
        AND e.recurrence_rule IS NOT NULL
        AND e.recurrence_rule != ''
      ORDER BY e.start_time ASC
    `;

    try {
      const result = await this.databaseService.query(query, [userId]);

      this.logger.debug(
        'findRecurringEventsForExpansion - Raw query results:',
        {
          count: result.rows.length,
          sample: result.rows[0]
            ? {
                id: result.rows[0].id,
                title: result.rows[0].title,
                organizer_id: result.rows[0].organizer_id,
                creator_id: result.rows[0].creator_id,
                creator_name: result.rows[0].creator_name,
              }
            : null,
        },
      );

      return result.rows.map((row) => this.normalizeEventDataWithCreator(row));
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
