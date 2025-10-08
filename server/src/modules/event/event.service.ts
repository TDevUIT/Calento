import { Injectable } from '@nestjs/common';
import {
  PaginatedResult,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { Event } from './event';
import { CreateEventDto } from './dto/events.dto';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async createEvent(eventDto: CreateEventDto, userId: string): Promise<Event> {
    return this.eventRepository.createEvent(eventDto, userId);
  }

  async updateEvent(
    eventId: string,
    eventDto: CreateEventDto,
    userId: string,
  ): Promise<Event> {
    return this.eventRepository.updateEvent(eventId, eventDto, userId);
  }

  async deleteEvent(eventId: string, userId: string): Promise<boolean> {
    return this.eventRepository.deleteEvent(eventId, userId);
  }

  async getEventById(eventId: string, userId: string): Promise<Event | null> {
    return this.eventRepository.getEventById(eventId, userId);
  }

  async getEvents(
    userId: string,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Event>> {
    return this.eventRepository.getEvents(userId, options);
  }

  async searchEvents(
    userId: string,
    searchTerm: string,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Event>> {
    return this.eventRepository.searchEvents(userId, searchTerm, options);
  }

  async getEventsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Event>> {
    return this.eventRepository.findByUserIdAndDateRange(
      userId,
      startDate,
      endDate,
      options,
    );
  }

  async searchEventsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    searchTerm: string,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Event>> {
    return this.eventRepository.searchEventsByDateRange(
      userId,
      startDate,
      endDate,
      searchTerm,
      options,
    );
  }

  async expandRecurringEvents(
    userId: string,
    startDate: Date,
    endDate: Date,
    maxOccurrences: number = 100,
    options: Partial<PaginationOptions> = {},
  ): Promise<PaginatedResult<Event>> {
    return this.eventRepository.expandRecurringEvents(
      userId,
      startDate,
      endDate,
      maxOccurrences,
      options,
    );
  }
}
