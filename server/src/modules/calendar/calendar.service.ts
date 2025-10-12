import { Injectable, Logger } from '@nestjs/common';
import { CalendarRepository } from './calendar.repository';
import { Calendar } from './calendar';
import { CreateCalendarDto, UpdateCalendarDto } from './dto/calendar.dto';
import { PaginationOptions, PaginatedResult, SearchOptions } from '../../common/interfaces/pagination.interface';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(private readonly calendarRepository: CalendarRepository) {}

  async createCalendar(
    calendarDto: CreateCalendarDto,
    userId: string,
  ): Promise<Calendar> {
    this.logger.log(`Creating calendar for user ${userId}`);
    return this.calendarRepository.createCalendar(calendarDto, userId);
  }

  async getCalendars(
    userId: string,
    options: Partial<SearchOptions>,
  ): Promise<PaginatedResult<Calendar>> {
    this.logger.log(`Fetching calendars for user ${userId}${options.search ? ` with search: ${options.search}` : ''}`);
    return this.calendarRepository.getCalendars(userId, options);
  }

  async getCalendarById(
    calendarId: string,
    userId: string,
  ): Promise<Calendar | null> {
    this.logger.log(`Fetching calendar ${calendarId} for user ${userId}`);
    return this.calendarRepository.getCalendarById(calendarId, userId);
  }

  async updateCalendar(
    calendarId: string,
    calendarDto: UpdateCalendarDto,
    userId: string,
  ): Promise<Calendar> {
    this.logger.log(`Updating calendar ${calendarId} for user ${userId}`);
    return this.calendarRepository.updateCalendar(
      calendarId,
      calendarDto,
      userId,
    );
  }

  async deleteCalendar(calendarId: string, userId: string): Promise<boolean> {
    this.logger.log(`Deleting calendar ${calendarId} for user ${userId}`);
    return this.calendarRepository.deleteCalendar(calendarId, userId);
  }

  async searchCalendars(
    userId: string,
    searchTerm: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Calendar>> {
    this.logger.log(
      `Searching calendars for user ${userId} with term: ${searchTerm}`,
    );
    return this.calendarRepository.searchCalendars(
      userId,
      searchTerm,
      paginationOptions,
    );
  }

  async getPrimaryCalendar(userId: string): Promise<Calendar | null> {
    this.logger.log(`Fetching primary calendar for user ${userId}`);
    return this.calendarRepository.getPrimaryCalendar(userId);
  }

  async getCalendarsByTimezone(
    userId: string,
    timezone: string,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Calendar>> {
    this.logger.log(
      `Fetching calendars for user ${userId} in timezone ${timezone}`,
    );
    return this.calendarRepository.findByTimezone(userId, timezone, options);
  }

  async findByGoogleCalendarId(
    userId: string,
    googleCalendarId: string,
  ): Promise<Calendar | null> {
    this.logger.log(
      `Finding calendar with Google ID ${googleCalendarId} for user ${userId}`,
    );
    return this.calendarRepository.findByGoogleCalendarId(
      userId,
      googleCalendarId,
    );
  }
}
