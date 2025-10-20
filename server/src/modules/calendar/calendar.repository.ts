import { Injectable, Logger } from '@nestjs/common';
import { UserOwnedRepository } from '../../common/repositories/base.repository';
import { DatabaseService } from '../../database/database.service';
import { PaginationService } from '../../common/services/pagination.service';
import { MessageService } from '../../common/message/message.service';
import { UserValidationService } from '../../common/services/user-validation.service';
import { CreateCalendarDto, UpdateCalendarDto } from './dto/calendar.dto';
import {
  PaginatedResult,
  PaginationOptions,
  SearchOptions,
} from '../../common/interfaces/pagination.interface';
import {
  CalendarCreationFailedException,
  CalendarNotFoundException,
  DuplicateCalendarException,
  CalendarUpdateFailedException,
} from './exceptions/calendar.exceptions';
import { Calendar } from './calendar';

@Injectable()
export class CalendarRepository extends UserOwnedRepository<Calendar> {
  constructor(
    databaseService: DatabaseService,
    paginationService: PaginationService,
    messageService: MessageService,
    private userValidationService: UserValidationService,
  ) {
    super(databaseService, paginationService, messageService, 'calendars');
  }

  protected getAllowedSortFields(): string[] {
    return ['created_at', 'updated_at', 'name', 'is_primary'];
  }

  async createCalendar(
    calendarDto: CreateCalendarDto,
    userId: string,
  ): Promise<Calendar> {
    await this.userValidationService.validateUserExists(userId);

    const existingCalendar = await this.findByGoogleCalendarId(
      userId,
      calendarDto.google_calendar_id,
    );
    if (existingCalendar) {
      throw new DuplicateCalendarException(calendarDto.google_calendar_id);
    }

    if (calendarDto.is_primary) {
      await this.unsetPrimaryCalendars(userId);
    }

    const calendarData: Partial<Calendar> = {
      user_id: userId,
      google_calendar_id: calendarDto.google_calendar_id,
      name: calendarDto.name,
      description: calendarDto.description,
      timezone: calendarDto.timezone,
      is_primary: calendarDto.is_primary || false,
    };

    try {
      return await this.create(calendarData);
    } catch (error) {
      this.logger.error('Failed to create calendar:', error);
      throw new CalendarCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async getCalendars(
    userId: string,
    options: Partial<SearchOptions>,
  ): Promise<PaginatedResult<Calendar>> {
    await this.userValidationService.validateUserExists(userId);

    try {
      const searchOptions: Partial<SearchOptions> = {
        ...options,
        searchFields: options.search ? ['name', 'description', 'google_calendar_id'] : undefined,
      };
      
      return await this.findByUserId(userId, searchOptions);
    } catch (error) {
      this.logger.error('Failed to get calendars:', error);
      throw new CalendarCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async getCalendarById(
    calendarId: string,
    userId: string,
  ): Promise<Calendar | null> {
    await this.userValidationService.validateUserExists(userId);

    try {
      const calendar = await this.findById(calendarId);
      if (calendar && calendar.user_id === userId) {
        return calendar;
      }
      return null;
    } catch (error) {
      this.logger.error(`Failed to get calendar ${calendarId}:`, error);
      throw new CalendarCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async updateCalendar(
    calendarId: string,
    calendarDto: UpdateCalendarDto,
    userId: string,
  ): Promise<Calendar> {
    await this.userValidationService.validateUserExists(userId);

    const existingCalendar = await this.getCalendarById(calendarId, userId);
    if (!existingCalendar) {
      throw new CalendarNotFoundException(calendarId);
    }

    if (calendarDto.is_primary && !existingCalendar.is_primary) {
      await this.unsetPrimaryCalendars(userId);
    }

    const calendarData: Partial<Calendar> = {
      name:
        calendarDto.name !== undefined
          ? calendarDto.name
          : existingCalendar.name,
      description:
        calendarDto.description !== undefined
          ? calendarDto.description
          : existingCalendar.description,
      timezone:
        calendarDto.timezone !== undefined
          ? calendarDto.timezone
          : existingCalendar.timezone,
      is_primary:
        calendarDto.is_primary !== undefined
          ? calendarDto.is_primary
          : existingCalendar.is_primary,
    };

    try {
      const updatedCalendar = await this.update(calendarId, calendarData);
      if (!updatedCalendar) {
        throw new CalendarNotFoundException(calendarId);
      }
      return updatedCalendar;
    } catch (error) {
      this.logger.error(`Failed to update calendar ${calendarId}:`, error);
      throw new CalendarUpdateFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async deleteCalendar(calendarId: string, userId: string): Promise<boolean> {
    await this.userValidationService.validateUserExists(userId);

    const existingCalendar = await this.getCalendarById(calendarId, userId);
    if (!existingCalendar) {
      throw new CalendarNotFoundException(calendarId);
    }

    try {
      const result = await this.delete(calendarId);
      return result !== null;
    } catch (error) {
      this.logger.error(`Failed to delete calendar ${calendarId}:`, error);
      throw new CalendarCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async searchCalendars(
    userId: string,
    searchTerm: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Calendar>> {
    await this.userValidationService.validateUserExists(userId);

    const searchPattern = `%${searchTerm}%`;
    const whereCondition =
      'user_id = $1 AND (name ILIKE $2 OR description ILIKE $2)';
    const whereParams = [userId, searchPattern];

    try {
      return await this.search(whereCondition, whereParams, paginationOptions);
    } catch (error) {
      this.logger.error('Failed to search calendars:', error);
      throw new CalendarCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }

  async findByGoogleCalendarId(
    userId: string,
    googleCalendarId: string,
  ): Promise<Calendar | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE user_id = $1 AND google_calendar_id = $2 LIMIT 1`;

    try {
      const result = await this.databaseService.query(query, [
        userId,
        googleCalendarId,
      ]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      this.logger.error(
        'Failed to find calendar by Google Calendar ID:',
        error,
      );
      return null;
    }
  }

  async getPrimaryCalendar(userId: string): Promise<Calendar | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE user_id = $1 AND is_primary = true LIMIT 1`;

    try {
      const result = await this.databaseService.query(query, [userId]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      this.logger.error('Failed to get primary calendar:', error);
      return null;
    }
  }

  private async unsetPrimaryCalendars(userId: string): Promise<void> {
    const query = `UPDATE ${this.tableName} SET is_primary = false WHERE user_id = $1 AND is_primary = true`;

    try {
      await this.databaseService.query(query, [userId]);
    } catch (error) {
      this.logger.error('Failed to unset primary calendars:', error);
    }
  }

  async findByTimezone(
    userId: string,
    timezone: string,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Calendar>> {
    await this.userValidationService.validateUserExists(userId);

    const whereCondition = 'user_id = $1 AND timezone = $2';
    const whereParams = [userId, timezone];

    try {
      return await this.search(whereCondition, whereParams, options);
    } catch (error) {
      this.logger.error('Failed to find calendars by timezone:', error);
      throw new CalendarCreationFailedException(
        this.messageService.get('error.internal_server_error'),
      );
    }
  }
}
