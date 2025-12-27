import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { GoogleCalendarService } from '../../google/services/google-calendar.service';
import { EventRepository } from '../event.repository';
import { CreateEventDto } from '../dto/events.dto';
import {
  SyncStrategy,
  SyncConflict,
  InitialSyncResult,
  ConflictReason,
} from '../types/sync.types';
import { EventMappers } from '../utils/event-mappers';

@Injectable()
export class CalendarSyncManagerService {
  private readonly logger = new Logger(CalendarSyncManagerService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly eventRepository: EventRepository,
  ) {}

  async performInitialSync(
    userId: string,
    strategy: SyncStrategy = SyncStrategy.MERGE_PREFER_CALENTO,
  ): Promise<InitialSyncResult> {
    this.logger.log(
      `Starting initial sync for user ${userId} with strategy: ${strategy}`,
    );

    const result: InitialSyncResult = {
      totalGoogleEvents: 0,
      totalCalentoEvents: 0,
      imported: 0,
      conflicts: [],
      errors: [],
    };

    try {
      const calendoEvents = await this.getCalentoEvents(userId);
      result.totalCalentoEvents = calendoEvents.length;

      const timeMin = new Date();
      timeMin.setDate(timeMin.getDate() - 30);
      const timeMax = new Date();
      timeMax.setDate(timeMax.getDate() + 90);

      const googleEvents = await this.googleCalendarService.listEvents(
        userId,
        'primary',
        { timeMin, timeMax },
      );
      result.totalGoogleEvents = googleEvents.length;

      this.logger.log(
        `Found ${result.totalCalentoEvents} Calento events and ${result.totalGoogleEvents} Google events`,
      );

      const conflicts = this.detectConflicts(calendoEvents, googleEvents);
      result.conflicts = conflicts;

      for (const conflict of conflicts) {
        await this.saveConflict({ ...conflict, userId, resolution: strategy });
      }

      switch (strategy) {
        case SyncStrategy.MERGE_PREFER_CALENTO:
          await this.mergePrefCalento(userId, conflicts, googleEvents);
          break;
        case SyncStrategy.MERGE_PREFER_GOOGLE:
          await this.mergePreferGoogle(
            userId,
            conflicts,
            calendoEvents,
            googleEvents,
          );
          break;
        case SyncStrategy.KEEP_BOTH:
          await this.keepBothEvents(userId, googleEvents);
          break;
      }

      for (const googleEvent of googleEvents) {
        const hasConflict = conflicts.some(
          (c) => c.googleEventId === googleEvent.id,
        );
        if (!hasConflict && EventMappers.isValidGoogleEvent(googleEvent)) {
          try {
            await this.importGoogleEvent(userId, googleEvent);
            result.imported++;
          } catch (error) {
            result.errors.push(
              `Failed to import ${googleEvent.id}: ${error.message}`,
            );
          }
        }
      }

      await this.recordSyncStatus(userId, 'completed', result);

      this.logger.log(
        `Initial sync completed for user ${userId}: imported ${result.imported}, conflicts ${result.conflicts.length}`,
      );

      return result;
    } catch (error) {
      this.logger.error(`Initial sync failed for user ${userId}:`, error);
      result.errors.push(error.message);
      await this.recordSyncStatus(userId, 'failed', result);
      throw error;
    }
  }

  async handleDisconnection(userId: string): Promise<void> {
    this.logger.log(
      `Handling Google Calendar disconnection for user ${userId}`,
    );

    try {
      const updateQuery = `
                UPDATE events 
                SET google_event_id = NULL,
                    updated_at = NOW()
                WHERE user_id = $1 
                AND google_event_id IS NOT NULL
            `;
      await this.databaseService.query(updateQuery, [userId]);

      await this.recordSyncStatus(userId, 'disconnected', {
        message:
          'User disconnected from Google Calendar. Local events preserved.',
      });

      this.logger.log(
        `Successfully handled disconnection for user ${userId}. Local events preserved.`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to handle disconnection for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  private detectConflicts(
    calendoEvents: any[],
    googleEvents: any[],
  ): SyncConflict[] {
    const conflicts: SyncConflict[] = [];

    for (const calendoEvent of calendoEvents) {
      for (const googleEvent of googleEvents) {
        if (calendoEvent.google_event_id === googleEvent.id) {
          continue;
        }

        const calendoStart = new Date(calendoEvent.start_time);
        const calendoEnd = new Date(calendoEvent.end_time);
        const googleStart = googleEvent.start?.dateTime
          ? new Date(googleEvent.start.dateTime)
          : null;
        const googleEnd = googleEvent.end?.dateTime
          ? new Date(googleEvent.end.dateTime)
          : null;

        if (!googleStart || !googleEnd) continue;

        const hasOverlap =
          (calendoStart <= googleEnd && calendoEnd >= googleStart) ||
          (googleStart <= calendoEnd && googleEnd >= calendoStart);

        const isSimilar =
          calendoEvent.title.toLowerCase() ===
            (googleEvent.summary || '').toLowerCase() ||
          (calendoEvent.location &&
            calendoEvent.location === googleEvent.location);

        if (hasOverlap && isSimilar) {
          conflicts.push({
            calendoEventId: calendoEvent.id,
            googleEventId: googleEvent.id,
            reason: ConflictReason.DUPLICATE,
            calendoEvent,
            googleEvent,
          });
        }
      }
    }

    return conflicts;
  }

  private async mergePrefCalento(
    userId: string,
    conflicts: SyncConflict[],
    googleEvents: any[],
  ): Promise<void> {
    this.logger.log(`Merging with CALENTO preference for user ${userId}`);

    for (const conflict of conflicts) {
      try {
        if (conflict.calendoEvent && conflict.googleEventId) {
          await this.googleCalendarService.updateEvent(
            userId,
            'primary',
            conflict.googleEventId,
            EventMappers.calentoEventToGoogleInput(conflict.calendoEvent),
          );

          await this.saveEventMapping(
            conflict.calendoEventId!,
            conflict.googleEventId,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to merge conflict for event ${conflict.calendoEventId}:`,
          error,
        );
      }
    }
  }

  private async mergePreferGoogle(
    userId: string,
    conflicts: SyncConflict[],
    calendoEvents: any[],
    googleEvents: any[],
  ): Promise<void> {
    this.logger.log(`Merging with GOOGLE preference for user ${userId}`);

    for (const conflict of conflicts) {
      try {
        if (conflict.googleEvent && conflict.calendoEventId) {
          const defaultCalendarId = 'temp-calendar-id';
          const eventDto = EventMappers.googleEventToDto(
            conflict.googleEvent,
            defaultCalendarId,
          );
          await this.eventRepository.updateEvent(
            conflict.calendoEventId,
            eventDto,
            userId,
          );
          await this.saveEventMapping(
            conflict.calendoEventId,
            conflict.googleEvent.id,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to merge conflict for event ${conflict.googleEventId}:`,
          error,
        );
      }
    }
  }

  private async keepBothEvents(
    userId: string,
    googleEvents: any[],
  ): Promise<void> {
    this.logger.log(
      `Keeping both Calento and Google events for user ${userId}`,
    );

    for (const googleEvent of googleEvents) {
      try {
        if (EventMappers.isValidGoogleEvent(googleEvent)) {
          await this.importGoogleEvent(userId, googleEvent);
        }
      } catch (error) {
        this.logger.error(
          `Failed to import Google event ${googleEvent.id}:`,
          error,
        );
      }
    }
  }

  private async createFromGoogle(
    userId: string,
    googleEvent: any,
  ): Promise<void> {
    const defaultCalendarId = 'temp-calendar-id';
    const eventDto = EventMappers.googleEventToDto(
      googleEvent,
      defaultCalendarId,
    );
    const event = await this.eventRepository.createEvent(eventDto, userId);

    if (googleEvent.id) {
      await this.saveEventMapping(event.id, googleEvent.id);
    }
  }

  private async importGoogleEvent(
    userId: string,
    googleEvent: any,
  ): Promise<void> {
    const defaultCalendarId = 'temp-calendar-id';
    const eventDto = EventMappers.googleEventToDto(
      googleEvent,
      defaultCalendarId,
    );
    const event = await this.eventRepository.createEvent(eventDto, userId);

    if (googleEvent.id) {
      await this.saveEventMapping(event.id, googleEvent.id);
    }
  }

  private async saveEventMapping(
    calendoEventId: string,
    googleEventId: string,
  ): Promise<void> {
    const query = `
            UPDATE events 
            SET google_event_id = $1, updated_at = NOW()
            WHERE id = $2
        `;
    await this.databaseService.query(query, [googleEventId, calendoEventId]);
  }

  private async getCalentoEvents(userId: string): Promise<any[]> {
    const query = `
            SELECT * FROM events 
            WHERE user_id = $1 
            AND deleted_at IS NULL
            ORDER BY start_time ASC
        `;
    const result = await this.databaseService.query(query, [userId]);
    return result.rows;
  }

  private async recordSyncStatus(
    userId: string,
    status: string,
    details: any,
  ): Promise<void> {
    const query = `
            INSERT INTO sync_log (user_id, provider, status, details, created_at)
            VALUES ($1, $2, $3, $4, NOW())
        `;
    await this.databaseService.query(query, [
      userId,
      'google',
      status,
      JSON.stringify(details),
    ]);
  }

  async getConflicts(
    userId: string,
    resolvedFilter?: boolean,
  ): Promise<SyncConflict[]> {
    this.logger.log(
      `Fetching conflicts for user ${userId}, resolved filter: ${resolvedFilter}`,
    );

    let query = `
            SELECT 
                id,
                calendo_event_id,
                google_event_id,
                conflict_reason as reason,
                resolution,
                resolved,
                calendo_event_data,
                google_event_data,
                created_at,
                resolved_at
            FROM event_conflicts
            WHERE user_id = $1
        `;

    const params: any[] = [userId];

    if (resolvedFilter !== undefined) {
      query += ` AND resolved = $2`;
      params.push(resolvedFilter);
    }

    query += ` ORDER BY created_at DESC`;

    try {
      const result = await this.databaseService.query(query, params);

      return result.rows.map((row) => ({
        calendoEventId: row.calendo_event_id,
        googleEventId: row.google_event_id,
        reason: row.reason as ConflictReason,
        calendoEvent: row.calendo_event_data,
        googleEvent: row.google_event_data,
        resolution: row.resolution,
        resolved: row.resolved,
        createdAt: row.created_at,
        resolvedAt: row.resolved_at,
      }));
    } catch (error) {
      this.logger.error(`Failed to get conflicts for user ${userId}:`, error);
      return [];
    }
  }

  async saveConflict(
    conflict: SyncConflict & { userId: string; resolution?: string },
  ): Promise<void> {
    this.logger.log(`Saving conflict for user ${conflict.userId}`);

    const query = `
            INSERT INTO event_conflicts (
                user_id, 
                calendo_event_id, 
                google_event_id, 
                conflict_reason,
                resolution,
                calendo_event_data,
                google_event_data,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `;

    try {
      await this.databaseService.query(query, [
        conflict.userId,
        conflict.calendoEventId || null,
        conflict.googleEventId || null,
        conflict.reason,
        conflict.resolution || null,
        JSON.stringify(conflict.calendoEvent || {}),
        JSON.stringify(conflict.googleEvent || {}),
      ]);
    } catch (error) {
      this.logger.error(`Failed to save conflict:`, error);
    }
  }

  async resolveConflict(
    userId: string,
    conflictId: string,
    resolution: string,
  ): Promise<void> {
    this.logger.log(
      `Resolving conflict ${conflictId} for user ${userId} with resolution: ${resolution}`,
    );

    const query = `
            UPDATE event_conflicts
            SET resolved = true, 
                resolution = $1,
                resolved_at = NOW()
            WHERE id = $2 AND user_id = $3
        `;

    try {
      await this.databaseService.query(query, [resolution, conflictId, userId]);
      this.logger.log(`Conflict ${conflictId} resolved successfully`);
    } catch (error) {
      this.logger.error(`Failed to resolve conflict ${conflictId}:`, error);
      throw error;
    }
  }
}
