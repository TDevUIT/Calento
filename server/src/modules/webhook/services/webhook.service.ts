import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GoogleAuthService } from '../../google/services/google-auth.service';
import { GoogleCalendarService } from '../../google/services/google-calendar.service';
import { WebhookChannelRepository } from '../repositories/webhook-channel.repository';
import { DatabaseService } from '../../../database/database.service';
import { TIME_CONSTANTS } from '../../../common/constants';
import {
  CreateWebhookChannelDto,
  WebhookChannelResponseDto,
  WebhookNotificationEvent,
} from '../dto/webhook.dto';
import {
  WebhookChannelCreationFailedException,
  WebhookChannelNotFoundException,
  WebhookChannelUnauthorizedException,
  GoogleCalendarNotConnectedException,
} from '../exceptions/webhook.exceptions';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly WEBHOOK_BASE_URL =
    process.env.WEBHOOK_URL || 'https://your-domain.com/api/webhook/google';

  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly webhookChannelRepo: WebhookChannelRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async watchCalendar(
    userId: string,
    dto: CreateWebhookChannelDto,
  ): Promise<WebhookChannelResponseDto> {
    try {
      const calendarId = dto.calendar_id || 'primary';

      const existingChannel =
        await this.webhookChannelRepo.findActiveByUserAndCalendar(
          userId,
          calendarId,
        );

      if (existingChannel) {
        this.logger.warn(
          `Active webhook channel already exists for user ${userId}, calendar ${calendarId}`,
        );
        return this.mapToResponseDto(existingChannel);
      }

      const accessToken =
        await this.googleAuthService.getValidAccessToken(userId);
      if (!accessToken) {
        throw new GoogleCalendarNotConnectedException();
      }

      const oauth2Client = this.googleAuthService.getOAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const { google } = await import('googleapis');
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const channelId = `channel-${userId}-${uuidv4()}`;
      const token = dto.token || `token-${userId}-${Date.now()}`;

      const expirationMs =
        dto.expiration || TIME_CONSTANTS.WEBHOOK.DEFAULT_EXPIRY;
      const maxExpirationMs = TIME_CONSTANTS.WEBHOOK.MAX_EXPIRY;
      const actualExpirationMs = Math.min(expirationMs, maxExpirationMs);
      const expiration = Date.now() + actualExpirationMs;

      const response = await calendar.events.watch({
        calendarId,
        requestBody: {
          id: channelId,
          type: 'web_hook',
          address: this.WEBHOOK_BASE_URL,
          token: token,
          expiration: expiration.toString(),
        },
      });

      if (!response.data.id || !response.data.resourceId) {
        throw new WebhookChannelCreationFailedException(
          'Google API did not return channel information',
        );
      }

      const channel = await this.webhookChannelRepo.create({
        user_id: userId,
        calendar_id: calendarId,
        channel_id: response.data.id,
        resource_id: response.data.resourceId,
        resource_uri: response.data.resourceUri || '',
        token: token,
        expiration: new Date(parseInt(response.data.expiration || '0')),
        is_active: true,
      });

      this.logger.log(
        `Created webhook watch for user ${userId}, calendar ${calendarId}`,
      );

      return this.mapToResponseDto(channel);
    } catch (error) {
      this.logger.error(
        `Failed to create webhook watch: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof GoogleCalendarNotConnectedException ||
        error instanceof WebhookChannelCreationFailedException
      ) {
        throw error;
      }
      throw new WebhookChannelCreationFailedException(
        `Failed to watch calendar: ${error.message}`,
      );
    }
  }

  /**
   * Stop watching a calendar
   */
  async stopWatch(userId: string, channelId: string): Promise<boolean> {
    try {
      const channel = await this.webhookChannelRepo.findByChannelId(channelId);

      if (!channel) {
        this.logger.warn(`Channel ${channelId} not found`);
        throw new WebhookChannelNotFoundException(channelId);
      }

      if (channel.user_id !== userId) {
        throw new WebhookChannelUnauthorizedException(
          'You are not authorized to stop this channel',
        );
      }

      const accessToken =
        await this.googleAuthService.getValidAccessToken(userId);
      if (!accessToken) {
        this.logger.warn(
          `No valid access token for user ${userId}, marking channel as inactive`,
        );
        await this.webhookChannelRepo.deactivate(
          channelId,
          channel.resource_id,
        );
        return true;
      }

      const oauth2Client = this.googleAuthService.getOAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const { google } = await import('googleapis');
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      await calendar.channels.stop({
        requestBody: {
          id: channel.channel_id,
          resourceId: channel.resource_id,
        },
      });

      await this.webhookChannelRepo.deactivate(channelId, channel.resource_id);

      this.logger.log(`Stopped webhook channel ${channelId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to stop webhook: ${error.message}`,
        error.stack,
      );

      const channel = await this.webhookChannelRepo.findByChannelId(channelId);
      if (channel) {
        await this.webhookChannelRepo.deactivate(
          channelId,
          channel.resource_id,
        );
      }

      return false;
    }
  }

  async handleNotification(event: WebhookNotificationEvent): Promise<void> {
    try {
      this.logger.log(
        `ðŸ”” ===== WEBHOOK NOTIFICATION RECEIVED =====`,
      );
      this.logger.log(`ðŸ“¨ Channel ID: ${event.channel_id}`);
      this.logger.log(`ðŸ“¦ Resource ID: ${event.resource_id}`);
      this.logger.log(`========================================`);

      const channel = await this.webhookChannelRepo.findByChannelId(
        event.channel_id,
      );

      if (!channel) {
        this.logger.warn(`Channel ${event.channel_id} not found in database`);
        this.logger.warn(`Searched for channel_id: ${event.channel_id}`);
        return;
      }

      this.logger.log(`Channel found: ${channel.channel_id}`);
      this.logger.log(`User ID: ${channel.user_id}`);
      this.logger.log(`Calendar ID: ${channel.calendar_id}`);

      if (!channel.is_active) {
        this.logger.warn(`Channel ${event.channel_id} is not active`);
        return;
      }

      if (event.resource_state === 'sync') {
        this.logger.log(`Sync notification (initial setup) - ignoring`);
        return;
      }

      if (event.resource_state === 'exists') {
        this.logger.log(
          `Change detected for user ${channel.user_id}, calendar ${channel.calendar_id}`,
        );

        await this.syncCalendarEvents(channel.user_id, channel.calendar_id);
      }
    } catch (error) {
      this.logger.error(
        `Error handling webhook notification: ${error.message}`,
        error.stack,
      );
    }
  }

  private async syncCalendarEvents(
    userId: string,
    calendarId: string,
  ): Promise<void> {
    try {
      this.logger.log(`===== SYNCING CALENDAR EVENTS =====`);
      this.logger.log(`User ID: ${userId}`);
      this.logger.log(`Calendar ID: ${calendarId}`);

      const timeMin = new Date();
      timeMin.setDate(timeMin.getDate() - 30);

      const timeMax = new Date();
      timeMax.setDate(timeMax.getDate() + 90);

      this.logger.log(`Time Range: ${timeMin.toISOString()} to ${timeMax.toISOString()}`);

      const googleEvents = await this.googleCalendarService.listEvents(
        userId,
        calendarId,
        {
          timeMin,
          timeMax,
          maxResults: 250,
        },
      );

      this.logger.log(`Fetched ${googleEvents.length} events from Google Calendar`);

      const tempraCalendarId = await this.getTempraCalendarId(
        userId,
        calendarId,
      );

      if (!tempraCalendarId) {
        this.logger.warn(
          `No Tempra calendar found for user ${userId}, skipping sync`,
        );
        return;
      }

      let created = 0;
      let updated = 0;
      let deleted = 0;

      for (const googleEvent of googleEvents) {
        try {
          if (!this.isValidGoogleEvent(googleEvent)) {
            this.logger.debug(`Skipping invalid event: ${googleEvent.id}`);
            continue;
          }

          const existingEvent = await this.findEventByGoogleId(
            userId,
            googleEvent.id!,
          );

          if (googleEvent.status === 'cancelled') {
            if (existingEvent) {
              await this.deleteEventFromTempra(existingEvent.id, userId);
              deleted++;
            }
            continue;
          }

          const eventData = this.mapGoogleEventToTempra(
            googleEvent,
            tempraCalendarId,
          );

          if (existingEvent) {
            await this.updateEventInTempra(
              existingEvent.id,
              eventData,
              userId,
            );
            updated++;
          } else {
            await this.createEventInTempra(
              eventData,
              userId,
              googleEvent.id!,
            );
            created++;
          }
        } catch (error) {
          this.logger.error(
            `Failed to sync event ${googleEvent.id}: ${error.message}`,
          );
        }
      }

      this.logger.log(`===== SYNC COMPLETED =====`);
      this.logger.log(`Summary for user ${userId}:`);
      this.logger.log(`   Created: ${created}`);
      this.logger.log(`   Updated: ${updated}`);
      this.logger.log(`   Deleted: ${deleted}`);
    } catch (error) {
      this.logger.error(
        `Failed to sync calendar events: ${error.message}`,
        error.stack,
      );
    }
  }

  private isValidGoogleEvent(event: any): boolean {
    return !!(
      event.id &&
      event.summary &&
      event.start?.dateTime &&
      event.end?.dateTime
    );
  }

  private async getTempraCalendarId(
    userId: string,
    googleCalendarId: string,
  ): Promise<string | null> {
    try {
      const result = await this.databaseService.query(
        `SELECT id FROM calendars WHERE user_id = $1 AND google_calendar_id = $2 LIMIT 1`,
        [userId, googleCalendarId],
      );

      if (result.rows.length > 0) {
        return result.rows[0].id;
      }

      const primaryResult = await this.databaseService.query(
        `SELECT id FROM calendars WHERE user_id = $1 ORDER BY created_at ASC LIMIT 1`,
        [userId],
      );

      return primaryResult.rows.length > 0 ? primaryResult.rows[0].id : null;
    } catch (error) {
      this.logger.error(`Failed to get Tempra calendar ID: ${error.message}`);
      return null;
    }
  }

  private async findEventByGoogleId(
    userId: string,
    googleEventId: string,
  ): Promise<any> {
    try {
      const result = await this.databaseService.query(
        `SELECT e.* FROM events e
         INNER JOIN calendars c ON e.calendar_id = c.id
         WHERE c.user_id = $1 AND e.google_event_id = $2`,
        [userId, googleEventId],
      );

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      this.logger.error(
        `Failed to find event by Google ID: ${error.message}`,
      );
      return null;
    }
  }

  private mapGoogleEventToTempra(
    googleEvent: any,
    calendarId: string,
  ): any {
    return {
      calendar_id: calendarId,
      title: googleEvent.summary || 'Untitled Event',
      description: googleEvent.description || undefined,
      location: googleEvent.location || undefined,
      start_time: new Date(googleEvent.start.dateTime),
      end_time: new Date(googleEvent.end.dateTime),
      is_all_day: false,
      timezone: googleEvent.start.timeZone || 'UTC',
      status: googleEvent.status === 'confirmed' ? 'confirmed' : 'tentative',
      color: googleEvent.colorId || undefined,
      recurrence_rule: googleEvent.recurrence?.[0] || undefined,
      conference_data: googleEvent.hangoutLink
        ? {
            type: 'google_meet',
            url: googleEvent.hangoutLink,
          }
        : undefined,
    };
  }

  private async createEventInTempra(
    eventData: any,
    userId: string,
    googleEventId: string,
  ): Promise<void> {
    const { v4: uuidv4 } = await import('uuid');
    const eventId = uuidv4();

    await this.databaseService.query(
      `INSERT INTO events (
        id, calendar_id, google_event_id, title, description, location,
        start_time, end_time, is_all_day, timezone, status, color,
        recurrence_rule, conference_data, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())`,
      [
        eventId,
        eventData.calendar_id,
        googleEventId,
        eventData.title,
        eventData.description,
        eventData.location,
        eventData.start_time,
        eventData.end_time,
        eventData.is_all_day,
        eventData.timezone,
        eventData.status,
        eventData.color,
        eventData.recurrence_rule,
        eventData.conference_data
          ? JSON.stringify(eventData.conference_data)
          : null,
      ],
    );
  }

  private async updateEventInTempra(
    eventId: string,
    eventData: any,
    userId: string,
  ): Promise<void> {
    await this.databaseService.query(
      `UPDATE events SET
        title = $2,
        description = $3,
        location = $4,
        start_time = $5,
        end_time = $6,
        timezone = $7,
        status = $8,
        color = $9,
        recurrence_rule = $10,
        conference_data = $11,
        updated_at = NOW()
      WHERE id = $1`,
      [
        eventId,
        eventData.title,
        eventData.description,
        eventData.location,
        eventData.start_time,
        eventData.end_time,
        eventData.timezone,
        eventData.status,
        eventData.color,
        eventData.recurrence_rule,
        eventData.conference_data
          ? JSON.stringify(eventData.conference_data)
          : null,
      ],
    );
  }

  private async deleteEventFromTempra(
    eventId: string,
    userId: string,
  ): Promise<void> {
    await this.databaseService.query(
      `DELETE FROM events 
       WHERE id = $1 
       AND calendar_id IN (SELECT id FROM calendars WHERE user_id = $2)`,
      [eventId, userId],
    );
  }

  async getUserChannels(userId: string): Promise<WebhookChannelResponseDto[]> {
    const channels = await this.webhookChannelRepo.findActiveByUserId(userId);
    return channels.map((channel) => this.mapToResponseDto(channel));
  }

  async cleanupExpiredChannels(): Promise<number> {
    const expiredChannels = await this.webhookChannelRepo.findExpired();

    for (const channel of expiredChannels) {
      try {
        await this.stopWatch(channel.user_id, channel.channel_id);
      } catch (error) {
        this.logger.error(
          `Failed to stop expired channel ${channel.channel_id}: ${error.message}`,
        );
      }
    }

    return expiredChannels.length;
  }

  private mapToResponseDto(channel: any): WebhookChannelResponseDto {
    return {
      channel_id: channel.channel_id,
      resource_id: channel.resource_id,
      expiration: channel.expiration.toISOString(),
      calendar_id: channel.calendar_id,
      is_active: channel.is_active,
    };
  }
}
