import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WebhookService } from './webhook.service';
import { WebhookChannelRepository } from '../repositories/webhook-channel.repository';
import { GoogleAuthService } from '../../google/services/google-auth.service';
import { TIME_CONSTANTS } from '../../../common/constants';

@Injectable()
export class WebhookSchedulerService {
  private readonly logger = new Logger(WebhookSchedulerService.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly webhookChannelRepo: WebhookChannelRepository,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  /**
   * Auto-renew webhooks that will expire within 24 hours
   * Runs every 6 hours
   */
  @Cron('0 */6 * * *', {
    name: 'webhook-auto-renewal',
    timeZone: 'UTC',
  })
  async handleWebhookAutoRenewal(): Promise<void> {
    this.logger.log('Starting webhook auto-renewal process...');

    try {
      const expiringChannels =
        await this.webhookChannelRepo.findExpiringWithin(24);

      this.logger.log(
        `Found ${expiringChannels.length} webhooks expiring within 24 hours`,
      );

      let renewedCount = 0;
      let failedCount = 0;

      for (const channel of expiringChannels) {
        try {
          await this.renewWebhookChannel(channel);
          renewedCount++;
          this.logger.log(
            `Successfully renewed webhook ${channel.channel_id} for user ${channel.user_id}`,
          );
        } catch (error) {
          failedCount++;
          this.logger.error(
            `Failed to renew webhook ${channel.channel_id} for user ${channel.user_id}: ${error.message}`,
            error.stack,
          );
        }

        // Add small delay to avoid rate limiting
        await this.delay(1000);
      }

      this.logger.log(
        `Webhook auto-renewal completed: ${renewedCount} renewed, ${failedCount} failed`,
      );
    } catch (error) {
      this.logger.error(
        'Error during webhook auto-renewal process:',
        error.stack,
      );
    }
  }

  /**
   * Cleanup expired webhooks that couldn't be renewed
   * Runs daily at 2 AM UTC
   */
  @Cron('0 2 * * *', {
    name: 'webhook-cleanup',
    timeZone: 'UTC',
  })
  async handleWebhookCleanup(): Promise<void> {
    this.logger.log('Starting webhook cleanup process...');

    try {
      const cleanedCount = await this.webhookService.cleanupExpiredChannels();
      this.logger.log(
        `Webhook cleanup completed: ${cleanedCount} expired channels cleaned`,
      );
    } catch (error) {
      this.logger.error('Error during webhook cleanup:', error.stack);
    }
  }

  /**
   * Health check for active webhooks
   * Runs every 12 hours
   */
  @Cron('0 */12 * * *', {
    name: 'webhook-health-check',
    timeZone: 'UTC',
  })
  async handleWebhookHealthCheck(): Promise<void> {
    this.logger.log('Starting webhook health check...');

    try {
      const activeChannels = await this.webhookChannelRepo.findAllActive();
      const issues: string[] = [];

      for (const channel of activeChannels) {
        // Check if user still has valid Google credentials
        const hasValidToken = await this.googleAuthService.getValidAccessToken(
          channel.user_id,
        );

        if (!hasValidToken) {
          issues.push(
            `User ${channel.user_id} has invalid/expired Google credentials`,
          );
          // Optionally deactivate the channel
          await this.webhookChannelRepo.deactivate(
            channel.channel_id,
            channel.resource_id,
          );
        }
      }

      if (issues.length > 0) {
        this.logger.warn(`Webhook health check found ${issues.length} issues:`);
        issues.forEach((issue) => this.logger.warn(issue));
      } else {
        this.logger.log(
          `Webhook health check completed: ${activeChannels.length} channels healthy`,
        );
      }
    } catch (error) {
      this.logger.error('Error during webhook health check:', error.stack);
    }
  }

  /**
   * Renew a specific webhook channel
   */
  private async renewWebhookChannel(channel: any): Promise<void> {
    try {
      // First, stop the existing webhook
      await this.webhookService.stopWatch(channel.user_id, channel.channel_id);

      await this.webhookService.watchCalendar(channel.user_id, {
        calendar_id: channel.calendar_id,
        expiration: TIME_CONSTANTS.WEBHOOK.DEFAULT_EXPIRY,
        token: `renewed-${channel.user_id}-${Date.now()}`,
      });

      this.logger.log(
        `Successfully renewed webhook for user ${channel.user_id}, calendar ${channel.calendar_id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to renew webhook channel ${channel.channel_id}:`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Manual renewal trigger (can be called via API)
   */
  async renewWebhookForUser(
    userId: string,
    calendarId: string = 'primary',
  ): Promise<boolean> {
    try {
      const existingChannel =
        await this.webhookChannelRepo.findActiveByUserAndCalendar(
          userId,
          calendarId,
        );

      if (!existingChannel) {
        this.logger.warn(
          `No active webhook found for user ${userId}, calendar ${calendarId}`,
        );
        return false;
      }

      await this.renewWebhookChannel(existingChannel);
      return true;
    } catch (error) {
      this.logger.error(
        `Manual renewal failed for user ${userId}:`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Get renewal statistics
   */
  async getRenewalStats(): Promise<{
    totalActive: number;
    expiringWithin24h: number;
    expiringWithin7d: number;
    expired: number;
  }> {
    try {
      const [totalActive, expiringWithin24h, expiringWithin7d, expired] =
        await Promise.all([
          this.webhookChannelRepo.countActive(),
          this.webhookChannelRepo.countExpiringWithin(24),
          this.webhookChannelRepo.countExpiringWithin(7 * 24),
          this.webhookChannelRepo.countExpired(),
        ]);

      return {
        totalActive,
        expiringWithin24h,
        expiringWithin7d,
        expired,
      };
    } catch (error) {
      this.logger.error('Error getting renewal stats:', error.stack);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
