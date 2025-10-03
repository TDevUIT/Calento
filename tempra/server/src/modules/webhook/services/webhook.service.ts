import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GoogleAuthService } from '../../google/services/google-auth.service';
import { GoogleCalendarService } from '../../google/services/google-calendar.service';
import { WebhookChannelRepository } from '../repositories/webhook-channel.repository';
import { 
    CreateWebhookChannelDto, 
    WebhookChannelResponseDto, 
    WebhookNotificationEvent 
} from '../dto/webhook.dto';
import {
    WebhookChannelCreationFailedException,
    WebhookChannelNotFoundException,
    WebhookChannelUnauthorizedException,
    GoogleCalendarNotConnectedException
} from '../exceptions/webhook.exceptions';

@Injectable()
export class WebhookService {
    private readonly logger = new Logger(WebhookService.name);
    private readonly WEBHOOK_BASE_URL = process.env.WEBHOOK_URL || 'https://your-domain.com/api/webhook/google';

    constructor(
        private readonly googleAuthService: GoogleAuthService,
        private readonly googleCalendarService: GoogleCalendarService,
        private readonly webhookChannelRepo: WebhookChannelRepository
    ) {}

    async watchCalendar(
        userId: string, 
        dto: CreateWebhookChannelDto
    ): Promise<WebhookChannelResponseDto> {
        try {
            const calendarId = dto.calendar_id || 'primary';

            const existingChannel = await this.webhookChannelRepo.findActiveByUserAndCalendar(
                userId, 
                calendarId
            );

            if (existingChannel) {
                this.logger.warn(`Active webhook channel already exists for user ${userId}, calendar ${calendarId}`);
                return this.mapToResponseDto(existingChannel);
            }

            const accessToken = await this.googleAuthService.getValidAccessToken(userId);
            if (!accessToken) {
                throw new GoogleCalendarNotConnectedException();
            }

            const oauth2Client = this.googleAuthService.getOAuth2Client();
            oauth2Client.setCredentials({ access_token: accessToken });

            const { google } = await import('googleapis');
            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

            const channelId = `channel-${userId}-${uuidv4()}`;
            const token = dto.token || `token-${userId}-${Date.now()}`;

            const expirationMs = dto.expiration || 7 * 24 * 60 * 60 * 1000; // 7 days
            const maxExpirationMs = 7 * 24 * 60 * 60 * 1000;
            const actualExpirationMs = Math.min(expirationMs, maxExpirationMs);
            const expiration = Date.now() + actualExpirationMs;

            const response = await calendar.events.watch({
                calendarId,
                requestBody: {
                    id: channelId,
                    type: 'web_hook',
                    address: this.WEBHOOK_BASE_URL,
                    token: token,
                    expiration: expiration.toString()
                }
            });

            if (!response.data.id || !response.data.resourceId) {
                throw new WebhookChannelCreationFailedException('Google API did not return channel information');
            }

            const channel = await this.webhookChannelRepo.create({
                user_id: userId,
                calendar_id: calendarId,
                channel_id: response.data.id,
                resource_id: response.data.resourceId,
                resource_uri: response.data.resourceUri || '',
                token: token,
                expiration: new Date(parseInt(response.data.expiration || '0')),
                is_active: true
            });

            this.logger.log(`Created webhook watch for user ${userId}, calendar ${calendarId}`);

            return this.mapToResponseDto(channel);

        } catch (error) {
            this.logger.error(`Failed to create webhook watch: ${error.message}`, error.stack);
            if (error instanceof GoogleCalendarNotConnectedException || 
                error instanceof WebhookChannelCreationFailedException) {
                throw error;
            }
            throw new WebhookChannelCreationFailedException(`Failed to watch calendar: ${error.message}`);
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
                throw new WebhookChannelUnauthorizedException('You are not authorized to stop this channel');
            }

            const accessToken = await this.googleAuthService.getValidAccessToken(userId);
            if (!accessToken) {
                this.logger.warn(`No valid access token for user ${userId}, marking channel as inactive`);
                await this.webhookChannelRepo.deactivate(channelId, channel.resource_id);
                return true;
            }

            const oauth2Client = this.googleAuthService.getOAuth2Client();
            oauth2Client.setCredentials({ access_token: accessToken });

            const { google } = await import('googleapis');
            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

            await calendar.channels.stop({
                requestBody: {
                    id: channel.channel_id,
                    resourceId: channel.resource_id
                }
            });

            await this.webhookChannelRepo.deactivate(channelId, channel.resource_id);

            this.logger.log(`Stopped webhook channel ${channelId}`);
            return true;

        } catch (error) {
            this.logger.error(`Failed to stop webhook: ${error.message}`, error.stack);
            
            const channel = await this.webhookChannelRepo.findByChannelId(channelId);
            if (channel) {
                await this.webhookChannelRepo.deactivate(channelId, channel.resource_id);
            }
            
            return false;
        }
    }

    async handleNotification(event: WebhookNotificationEvent): Promise<void> {
        try {
            this.logger.log(`Received webhook notification for channel ${event.channel_id}`);

            const channel = await this.webhookChannelRepo.findByChannelId(event.channel_id);
            
            if (!channel) {
                this.logger.warn(`Channel ${event.channel_id} not found in database`);
                return;
            }

            if (!channel.is_active) {
                this.logger.warn(`Channel ${event.channel_id} is not active`);
                return;
            }

            if (event.resource_state === 'sync') {
                this.logger.log(`Sync notification received for channel ${event.channel_id}`);
                return;
            }

            if (event.resource_state === 'exists') {
                this.logger.log(`Change detected for user ${channel.user_id}, calendar ${channel.calendar_id}`);
                
                await this.syncCalendarEvents(channel.user_id, channel.calendar_id);
            }

        } catch (error) {
            this.logger.error(`Error handling webhook notification: ${error.message}`, error.stack);
        }
    }

    private async syncCalendarEvents(userId: string, calendarId: string): Promise<void> {
        try {
            this.logger.log(`Syncing calendar events for user ${userId}, calendar ${calendarId}`);

            const timeMin = new Date();
            timeMin.setDate(timeMin.getDate() - 30);
            
            const timeMax = new Date();
            timeMax.setDate(timeMax.getDate() + 90);

            const events = await this.googleCalendarService.listEvents(userId, calendarId, {
                timeMin,
                timeMax,
                maxResults: 250
            });

            this.logger.log(`Synced ${events.length} events for user ${userId}`);

        } catch (error) {
            this.logger.error(`Failed to sync calendar events: ${error.message}`, error.stack);
        }
    }

    async getUserChannels(userId: string): Promise<WebhookChannelResponseDto[]> {
        const channels = await this.webhookChannelRepo.findActiveByUserId(userId);
        return channels.map(channel => this.mapToResponseDto(channel));
    }

    async cleanupExpiredChannels(): Promise<number> {
        const expiredChannels = await this.webhookChannelRepo.findExpired();
        
        for (const channel of expiredChannels) {
            try {
                await this.stopWatch(channel.user_id, channel.channel_id);
            } catch (error) {
                this.logger.error(`Failed to stop expired channel ${channel.channel_id}: ${error.message}`);
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
            is_active: channel.is_active
        };
    }
}
