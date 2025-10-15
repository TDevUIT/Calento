import { Injectable, Logger } from '@nestjs/common';
import {
  PaginatedResult,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { Event } from './event';
import { CreateEventDto, UpdateEventDto, PartialUpdateEventDto } from './dto/events.dto';
import { EventRepository } from './event.repository';
import { EventSyncService } from './services/event-sync.service';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventSyncService: EventSyncService,
  ) {}

  async createEvent(
    eventDto: CreateEventDto,
    userId: string,
  ): Promise<Event & { syncedToGoogle?: boolean; googleEventId?: string }> {
    try {
      // Use sync service which will auto-sync to Google if connected
      const result = await this.eventSyncService.createEventWithSync(
        eventDto,
        userId,
      );

      if (result.syncedToGoogle) {
        this.logger.log(
          `Event ${result.event.id} created and synced to Google Calendar`,
        );
      } else {
        this.logger.log(
          `Event ${result.event.id} created locally (not synced to Google)`,
        );
      }

      return {
        ...result.event,
        syncedToGoogle: result.syncedToGoogle,
        googleEventId: result.googleEventId,
      };
    } catch (error) {
      this.logger.error(`Failed to create event: ${error.message}`);
      throw error;
    }
  }

  async replaceEvent(
    eventId: string,
    eventDto: UpdateEventDto,
    userId: string,
    googleEventId?: string,
  ): Promise<Event & { syncedToGoogle?: boolean }> {
    try {
      // Use sync service for update
      const result = await this.eventSyncService.updateEventWithSync(
        eventId,
        eventDto,
        userId,
        googleEventId,
      );

      if (result.syncedToGoogle) {
        this.logger.log(
          `Event ${eventId} updated and synced to Google Calendar`,
        );
      }

      return {
        ...result.event,
        syncedToGoogle: result.syncedToGoogle,
      };
    } catch (error) {
      this.logger.error(`Failed to replace event: ${error.message}`);
      throw error;
    }
  }

  async updateEvent(
    eventId: string,
    eventDto: PartialUpdateEventDto,
    userId: string,
    googleEventId?: string,
  ): Promise<Event & { syncedToGoogle?: boolean }> {
    try {
      // Convert partial update to full update for sync
      const fullDto = eventDto as UpdateEventDto;
      const result = await this.eventSyncService.updateEventWithSync(
        eventId,
        fullDto,
        userId,
        googleEventId,
      );

      if (result.syncedToGoogle) {
        this.logger.log(
          `Event ${eventId} updated and synced to Google Calendar`,
        );
      }

      return {
        ...result.event,
        syncedToGoogle: result.syncedToGoogle,
      };
    } catch (error) {
      this.logger.error(`Failed to update event: ${error.message}`);
      throw error;
    }
  }

  async deleteEvent(
    eventId: string,
    userId: string,
    googleEventId?: string,
  ): Promise<boolean> {
    try {
      const result = await this.eventSyncService.deleteEventWithSync(
        eventId,
        userId,
        googleEventId,
      );

      if (result.deletedFromGoogle) {
        this.logger.log(
          `Event ${eventId} deleted from both local and Google Calendar`,
        );
      } else if (result.deleted) {
        this.logger.log(
          `Event ${eventId} deleted locally (not synced to Google)`,
        );
      }

      return result.deleted;
    } catch (error) {
      this.logger.error(`Failed to delete event: ${error.message}`);
      throw error;
    }
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
