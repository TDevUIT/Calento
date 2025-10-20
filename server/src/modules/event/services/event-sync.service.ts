import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventRepository } from '../event.repository';
import { GoogleCalendarService } from '../../google/services/google-calendar.service';
import { GoogleAuthService } from '../../google/services/google-auth.service';
import { CalendarValidationService } from '../../../common/services/calendar-validation.service';
import { DatabaseService } from '../../../database/database.service';
import { Event } from '../event';
import { CreateEventDto } from '../dto/events.dto';
import { SyncStatus } from '../types/sync.types';
import { EventMappers } from '../utils/event-mappers';
import { SyncChecker } from '../utils/sync-checker';
import pLimit from 'p-limit';

@Injectable()
export class EventSyncService {
  private readonly logger = new Logger(EventSyncService.name);

  private readonly BATCH_SIZE: number;
  private readonly CONCURRENCY_LIMIT: number;
  private readonly RATE_LIMIT_DELAY: number;
  private readonly MAX_RETRIES: number;

  constructor(
    private readonly eventRepository: EventRepository,
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly calendarValidationService: CalendarValidationService,
    private readonly syncChecker: SyncChecker,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    this.BATCH_SIZE = this.configService.get<number>(
      'BATCH_SYNC_BATCH_SIZE',
      50,
    );
    this.CONCURRENCY_LIMIT = this.configService.get<number>(
      'BATCH_SYNC_CONCURRENCY_LIMIT',
      10,
    );
    this.RATE_LIMIT_DELAY = this.configService.get<number>(
      'BATCH_SYNC_RATE_LIMIT_DELAY',
      100,
    );
    this.MAX_RETRIES = this.configService.get<number>(
      'BATCH_SYNC_MAX_RETRIES',
      3,
    );

    this.logger.log(
      `[Batch Sync Config] BATCH_SIZE=${this.BATCH_SIZE}, ` +
        `CONCURRENCY_LIMIT=${this.CONCURRENCY_LIMIT}, ` +
        `RATE_LIMIT_DELAY=${this.RATE_LIMIT_DELAY}ms, ` +
        `MAX_RETRIES=${this.MAX_RETRIES}`,
    );
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async createEventWithSync(
    eventDto: CreateEventDto,
    userId: string,
    options?: { skipGoogleSync?: boolean },
  ): Promise<{
    event: Event;
    syncedToGoogle: boolean;
    googleEventId?: string;
  }> {
    const event = await this.eventRepository.createEvent(eventDto, userId);
    this.logger.log(`Created local event ${event.id} for user ${userId}`);

    if (options?.skipGoogleSync) {
      return { event, syncedToGoogle: false };
    }

    const { canSync, reason } = await this.syncChecker.checkSyncability(userId);

    if (!canSync) {
      this.logger.log(`User ${userId} cannot sync: ${reason}`);
      return { event, syncedToGoogle: false };
    }

    try {
      const googleEvent = await this.googleCalendarService.createEvent(
        userId,
        'primary',
        EventMappers.calentoEventToGoogleInput(event),
      );

      this.logger.log(
        `Synced event ${event.id} to Google Calendar: ${googleEvent.id}`,
      );

      return {
        event,
        syncedToGoogle: true,
        googleEventId: googleEvent.id || undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to sync event ${event.id} to Google:`, error);
      return { event, syncedToGoogle: false };
    }
  }

  async updateEventWithSync(
    eventId: string,
    eventDto: CreateEventDto,
    userId: string,
    googleEventId?: string,
  ): Promise<{ event: Event; syncedToGoogle: boolean }> {
    const event = await this.eventRepository.updateEvent(
      eventId,
      eventDto,
      userId,
    );
    this.logger.log(`Updated local event ${eventId}`);

    const { canSync, reason } = await this.syncChecker.checkSyncability(
      userId,
      true,
      googleEventId,
    );

    if (!canSync) {
      this.logger.log(`User ${userId} cannot sync update: ${reason}`);
      return { event, syncedToGoogle: false };
    }

    try {
      await this.googleCalendarService.updateEvent(
        userId,
        'primary',
        googleEventId!,
        EventMappers.calentoEventToGoogleInput(event),
      );

      this.logger.log(`Synced update for event ${eventId} to Google`);
      return { event, syncedToGoogle: true };
    } catch (error) {
      this.logger.error(`Failed to sync update to Google:`, error);
      return { event, syncedToGoogle: false };
    }
  }

  async deleteEventWithSync(
    eventId: string,
    userId: string,
    googleEventId?: string,
  ): Promise<{ deleted: boolean; deletedFromGoogle: boolean }> {
    const deleted = await this.eventRepository.deleteEvent(eventId, userId);

    if (!deleted) {
      return { deleted: false, deletedFromGoogle: false };
    }

    this.logger.log(`Deleted local event ${eventId}`);

    const isConnected =
      await this.calendarValidationService.isUserConnectedToCalendar(userId);

    if (!isConnected || !googleEventId) {
      return { deleted: true, deletedFromGoogle: false };
    }

    try {
      const deletedFromGoogle = await this.googleCalendarService.deleteEvent(
        userId,
        'primary',
        googleEventId,
      );

      this.logger.log(`Deleted event ${eventId} from Google Calendar`);
      return { deleted: true, deletedFromGoogle };
    } catch (error) {
      this.logger.error(`Failed to delete from Google:`, error);
      return { deleted: true, deletedFromGoogle: false };
    }
  }

  private async processBatchWithLimit(
    batch: any[],
    userId: string,
  ): Promise<Array<{ success: boolean; eventId?: string; error?: string }>> {
    try {
      const results = await this.bulkInsertEvents(batch, userId);
      this.logger.log(
        `[Bulk Insert] Successfully inserted ${results.length}/${batch.length} events`,
      );
      return results;
    } catch (bulkError) {
      this.logger.warn(
        `[Bulk Insert] Failed: ${bulkError.message}. Falling back to individual inserts with retry...`,
      );

      const limit = pLimit(this.CONCURRENCY_LIMIT);

      const promises = batch.map((googleEvent) =>
        limit(async () => {
          return await this.createEventWithRetry(
            googleEvent,
            userId,
            this.MAX_RETRIES,
          );
        }),
      );

      return await Promise.all(promises);
    }
  }

  private async bulkInsertEvents(
    googleEvents: any[],
    userId: string,
  ): Promise<Array<{ success: boolean; eventId?: string; error?: string }>> {
    const validEvents = googleEvents.filter((event) =>
      EventMappers.isValidGoogleEvent(event),
    );

    if (validEvents.length === 0) {
      return googleEvents.map(() => ({
        success: false,
        error: 'Invalid event format',
      }));
    }

    const defaultCalendarId = 'temp-calendar-id'; // This needs to be fixed properly
    
    const eventDtos = validEvents.map((event) =>
      EventMappers.googleEventToDto(event, defaultCalendarId),
    );

    const values: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    for (const dto of eventDtos) {
      const { v4: uuidv4 } = await import('uuid');
      const eventId = uuidv4();

      values.push(`(
                $${paramIndex++},
                $${paramIndex++},
                $${paramIndex++},
                $${paramIndex++},
                $${paramIndex++},
                $${paramIndex++},
                $${paramIndex++},
                $${paramIndex++},
                $${paramIndex++},
                NOW(),
                NOW()
            )`);

      params.push(
        eventId,
        userId,
        dto.title,
        dto.description || null,
        dto.location || null,
        dto.start_time,
        dto.end_time,
        dto.is_all_day || false,
        dto.recurrence_rule || null,
      );
    }

    const query = `
            INSERT INTO events (
                id, user_id, title, description, location,
                start_time, end_time, is_all_day, recurrence_rule,
                created_at, updated_at
            )
            VALUES ${values.join(', ')}
            RETURNING id
        `;

    const result = await this.databaseService.query(
      query,
      params,
    );

    return validEvents.map((_, index) => ({
      success: true,
      eventId: result.rows[index]?.id,
    }));
  }

  private async createEventWithRetry(
    googleEvent: any,
    userId: string,
    maxRetries: number = this.MAX_RETRIES,
  ): Promise<{ success: boolean; eventId?: string; error?: string }> {
    if (!EventMappers.isValidGoogleEvent(googleEvent)) {
      return {
        success: false,
        error: `Invalid event format: ${googleEvent.id || 'unknown'}`,
      };
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const defaultCalendarId = 'temp-calendar-id';
        const eventDto = EventMappers.googleEventToDto(googleEvent, defaultCalendarId);
        const createdEvent = await this.eventRepository.createEvent(
          eventDto,
          userId,
        );

        return {
          success: true,
          eventId: createdEvent.id,
        };
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;

        if (isLastAttempt) {
          this.logger.error(
            `Failed to sync event ${googleEvent.id} after ${maxRetries} attempts: ${error.message}`,
          );

          return {
            success: false,
            error: `Failed after ${maxRetries} retries: ${error.message}`,
          };
        }

        const delay = Math.pow(2, attempt - 1) * 1000;
        this.logger.warn(
          `Retry ${attempt}/${maxRetries} for event ${googleEvent.id} after ${delay}ms`,
        );
        await this.sleep(delay);
      }
    }

    return {
      success: false,
      error: 'Unexpected error in retry logic',
    };
  }

  async pullEventsFromGoogle(
    userId: string,
    options?: {
      timeMin?: Date;
      timeMax?: Date;
      maxResults?: number;
    },
  ): Promise<{
    synced: number;
    failed: number;
    errors: string[];
    duration: number;
  }> {
    const startTime = Date.now();

    const isConnected = await this.googleAuthService.isConnected(userId);
    if (!isConnected) {
      throw new Error('User not connected to Google Calendar');
    }

    try {
      const googleEvents = await this.googleCalendarService.listEvents(
        userId,
        'primary',
        options,
      );

      const totalEvents = googleEvents.length;
      this.logger.log(
        `[Batch Sync] Fetched ${totalEvents} events from Google for user ${userId}`,
      );

      if (totalEvents === 0) {
        return {
          synced: 0,
          failed: 0,
          errors: [],
          duration: Date.now() - startTime,
        };
      }

      const batches = this.chunkArray(googleEvents, this.BATCH_SIZE);
      const totalBatches = batches.length;

      this.logger.log(
        `[Batch Sync] Processing ${totalEvents} events in ${totalBatches} batches (${this.BATCH_SIZE} events/batch)`,
      );

      const errors: string[] = [];
      let syncedCount = 0;
      let failedCount = 0;

      for (let i = 0; i < totalBatches; i++) {
        const batch = batches[i];
        const batchStartTime = Date.now();

        this.logger.log(
          `[Batch Sync] Processing batch ${i + 1}/${totalBatches} (${batch.length} events)...`,
        );

        const results = await this.processBatchWithLimit(batch, userId);

        for (const result of results) {
          if (result.success) {
            syncedCount++;
          } else {
            failedCount++;
            if (result.error) {
              errors.push(result.error);
            }
          }
        }

        const batchDuration = Date.now() - batchStartTime;
        const progress = Math.round(((i + 1) / totalBatches) * 100);
        const eventsProcessed = (i + 1) * this.BATCH_SIZE;

        this.logger.log(
          `[Batch Sync] Batch ${i + 1}/${totalBatches} completed in ${batchDuration}ms | ` +
            `Progress: ${progress}% (${Math.min(eventsProcessed, totalEvents)}/${totalEvents}) | ` +
            `Synced: ${syncedCount}, Failed: ${failedCount}`,
        );

        if (i < totalBatches - 1) {
          await this.sleep(this.RATE_LIMIT_DELAY);
        }
      }

      const duration = Date.now() - startTime;
      const throughput = Math.round((totalEvents / duration) * 1000);

      this.logger.log(
        `[Batch Sync] Completed! Synced: ${syncedCount}/${totalEvents}, Failed: ${failedCount} | ` +
          `Duration: ${duration}ms | Throughput: ${throughput} events/sec`,
      );

      return {
        synced: syncedCount,
        failed: failedCount,
        errors,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `[Batch Sync] Failed to pull events from Google after ${duration}ms: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to sync events from Google Calendar');
    }
  }

  async shouldSyncToGoogle(userId: string): Promise<boolean> {
    return this.calendarValidationService.isUserConnectedToCalendar(userId);
  }

  async getSyncStatus(userId: string): Promise<SyncStatus> {
    const connectionStatus =
      await this.calendarValidationService.getConnectionStatus(userId);

    return {
      connectedToGoogle: connectionStatus.isConnected,
      isSyncEnabled: connectionStatus.isSyncEnabled,
      canSync: connectionStatus.isConnected && connectionStatus.isSyncEnabled,
      lastSyncAt: connectionStatus.lastSyncAt,
    };
  }
}
