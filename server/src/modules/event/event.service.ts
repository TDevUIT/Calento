import { Injectable, Logger } from '@nestjs/common';
import {
  PaginatedResult,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { Event } from './event';
import { CreateEventDto, UpdateEventDto, PartialUpdateEventDto } from './dto/events.dto';
import { EventRepository } from './event.repository';
import { EventSyncService } from './services/event-sync.service';
import { EventInvitationService } from './services/event-invitation.service';
import { VectorService } from '../vector/vector.service';
import { UserService } from '../users/user.service';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventSyncService: EventSyncService,
    private readonly invitationService: EventInvitationService,
    private readonly userService: UserService,
    private readonly vectorService: VectorService,
  ) { }

  private async syncEventToVector(event: Event, userId: string): Promise<void> {
    try {
      if (!event) return;

      const context = {
        type: 'event',
        eventId: event.id,
        title: event.title,
        description: event.description || '',
        start: event.start_time,
        end: event.end_time,
        location: event.location || '',
        attendees: event.attendees?.map(a => a.email).join(', ') || ''
      };

      const textToEmbed = `Event: ${event.title}. 
      When: ${new Date(event.start_time).toLocaleString()} to ${new Date(event.end_time).toLocaleString()}. 
      Where: ${event.location || 'No location'}. 
      Description: ${event.description || ''}. 
      Attendees: ${context.attendees}.`;

      await this.vectorService.storeContext(userId, context, undefined, textToEmbed);
      this.logger.log(`Synced event ${event.id} to vector store for user ${userId}`);
    } catch (error) {
      this.logger.warn(`Failed to sync event ${event.id} to vector store: ${error.message}`);
    }
  }

  async createEvent(
    eventDto: CreateEventDto,
    userId: string,
  ): Promise<Event & { syncedToGoogle?: boolean; googleEventId?: string }> {
    try {
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

      await this.syncEventToVector(result.event, userId);

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

      // Update vector store: delete old and add new
      await this.vectorService.deleteContextByMetadata(userId, 'eventId', eventId);
      await this.syncEventToVector(result.event, userId);

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

      // Update vector store: delete old and add new
      await this.vectorService.deleteContextByMetadata(userId, 'eventId', eventId);
      await this.syncEventToVector(result.event, userId);

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

      await this.vectorService.deleteContextByMetadata(userId, 'eventId', eventId);

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

  async sendEventInvitations(
    eventId: string,
    userId: string,
    emails?: string[],
    showAttendees = true,
  ): Promise<{ sent: number; failed: number; results: any[] }> {
    try {
      const event = await this.eventRepository.findById(eventId);
      if (!event || event.creator?.id !== userId) {
        throw new Error('Event not found or access denied');
      }

      const user = await this.userService.getUserById(userId);

      if (!user || !user.email) {
        throw new Error('User not found or user email is missing');
      }
      const organizerName = `${user.first_name} ${user.last_name}`.trim() || user.email;

      this.logger.debug(`ðŸ“§ SendEventInvitations Debug:`, {
        eventId,
        totalAttendees: event.attendees?.length || 0,
        attendees: event.attendees,
        organizerEmail: user.email,
      });

      let attendeesToInvite = event.attendees || [];
      if (emails && emails.length > 0) {
        attendeesToInvite = attendeesToInvite.filter(a => emails.includes(a.email));
      }

      this.logger.debug(`ðŸ“§ Attendees to invite:`, {
        count: attendeesToInvite.length,
        attendees: attendeesToInvite.map(a => ({
          email: a.email,
          is_organizer: a.is_organizer,
        })),
      });

      const result = await this.invitationService.sendBulkInvitations(
        event,
        attendeesToInvite,
        userId,
        organizerName,
        user.email,
        user.avatar ?? undefined,
        showAttendees,
      );

      this.logger.log(`ðŸ“§ Invitation results: sent=${result.sent}, failed=${result.failed}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send invitations: ${error.message}`);
      throw error;
    }
  }

  async sendInvitationReminders(
    eventId: string,
    userId: string,
  ): Promise<{ sent: number; failed: number }> {
    return this.invitationService.sendReminders(eventId, userId);
  }

  async getInvitationDetails(token: string): Promise<any> {
    return this.invitationService.getInvitationByToken(token);
  }

  async respondToInvitation(
    token: string,
    action: 'accept' | 'decline' | 'tentative',
    comment?: string,
  ): Promise<any> {
    return this.invitationService.respondToInvitation(token, action, comment);
  }

  /**
   * One-time migration: Sync all event attendees to event_attendees table
   * This fixes the 404 invitation token error for events created before the fix
   */
  async syncAllEventAttendeesToDatabase(userId: string): Promise<{ synced: number; failed: number }> {
    try {
      this.logger.log(`ðŸ”„ Starting attendees sync for user ${userId}`);

      const user = await this.userService.getUserById(userId);
      if (!user?.email) {
        throw new Error('User not found or email missing');
      }

      const result = await this.eventRepository.getEvents(userId, {
        page: 1,
        limit: 1000, // Get all events
      });

      let synced = 0;
      let failed = 0;

      for (const event of result.data) {
        try {
          if (event.attendees && event.attendees.length > 0) {
            await this.eventRepository.syncAttendeesToDatabase(
              event.id,
              event.attendees,
              user.email,
            );
            synced++;
            this.logger.debug(`âœ… Synced ${event.attendees.length} attendees for event ${event.id}`);
          }
        } catch (error) {
          this.logger.error(`Failed to sync attendees for event ${event.id}: ${error.message}`);
          failed++;
        }
      }

      this.logger.log(`âœ… Sync complete: ${synced} events synced, ${failed} failed out of ${result.data.length} events`);

      return { synced, failed };
    } catch (error) {
      this.logger.error(`Failed to sync attendees: ${error.message}`);
      throw error;
    }
  }
}
