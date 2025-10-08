import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from '../../database/database.service';
import { EventSyncQueueService } from '../queue/services/event-sync-queue.service';
import { WebhookQueueService } from '../queue/services/webhook-queue.service';
import { JobPriority } from '../queue/types/queue.types';

export interface SyncError {
  id: string;
  user_id: string;
  error_type:
    | 'event_sync'
    | 'webhook_delivery'
    | 'calendar_connection'
    | 'token_refresh';
  error_message: string;
  retry_count: number;
  max_retries: number;
  next_retry_at: Date;
  metadata: Record<string, any>;
  resolved: boolean;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class SyncErrorRecoveryService {
  private readonly logger = new Logger(SyncErrorRecoveryService.name);
  private readonly MAX_RETRIES = {
    event_sync: 5,
    webhook_delivery: 3,
    calendar_connection: 2,
    token_refresh: 3,
  };

  constructor(
    private readonly db: DatabaseService,
    private readonly eventSyncQueue: EventSyncQueueService,
    private readonly webhookQueue: WebhookQueueService,
  ) {}

  @Cron('*/30 * * * *', {
    name: 'sync-error-retry',
    timeZone: 'UTC',
  })
  async handleSyncErrorRetry(): Promise<void> {
    this.logger.log('Starting sync error retry process...');

    try {
      const errorsToRetry = await this.findErrorsToRetry();
      this.logger.log(`Found ${errorsToRetry.length} errors ready for retry`);

      let retrySuccess = 0;
      let retryFailed = 0;

      for (const error of errorsToRetry) {
        try {
          await this.retryError(error);
          retrySuccess++;
          this.logger.log(
            `Successfully retried error ${error.id} for user ${error.user_id}`,
          );
        } catch (retryError) {
          retryFailed++;
          await this.updateErrorRetry(error.id, retryError.message);
          this.logger.error(
            `Failed to retry error ${error.id}: ${retryError.message}`,
          );
        }

        await this.delay(500);
      }

      this.logger.log(
        `Sync error retry completed: ${retrySuccess} success, ${retryFailed} failed`,
      );
    } catch (error) {
      this.logger.error('Error during sync error retry process:', error.stack);
    }
  }

  @Cron('0 3 * * *', {
    name: 'sync-error-cleanup',
    timeZone: 'UTC',
  })
  async handleSyncErrorCleanup(): Promise<void> {
    this.logger.log('Starting sync error cleanup process...');

    try {
      const archivedCount = await this.archiveOldErrors(30);
      this.logger.log(
        `Sync error cleanup completed: ${archivedCount} errors archived`,
      );
    } catch (error) {
      this.logger.error('Error during sync error cleanup:', error.stack);
    }
  }

  async logSyncError(
    userId: string,
    errorType: SyncError['error_type'],
    errorMessage: string,
    metadata?: Record<string, any>,
  ): Promise<string> {
    try {
      const maxRetries = this.MAX_RETRIES[errorType];
      const nextRetryAt = this.calculateNextRetry(0); // First retry

      const query = `
                INSERT INTO sync_errors (
                    user_id, error_type, error_message, retry_count, 
                    max_retries, next_retry_at, metadata, resolved
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
            `;

      const result = await this.db.query(query, [
        userId,
        errorType,
        errorMessage,
        0,
        maxRetries,
        nextRetryAt,
        JSON.stringify(metadata || {}),
        false,
      ]);

      const errorId = result.rows[0].id;
      this.logger.warn(
        `Logged sync error ${errorId} for user ${userId}: ${errorMessage}`,
      );
      return errorId;
    } catch (error) {
      this.logger.error('Failed to log sync error:', error.stack);
      throw error;
    }
  }

  async markErrorResolved(errorId: string): Promise<void> {
    try {
      const query = `
                UPDATE sync_errors 
                SET resolved = true, updated_at = NOW()
                WHERE id = $1
            `;

      await this.db.query(query, [errorId]);
      this.logger.log(`Marked sync error ${errorId} as resolved`);
    } catch (error) {
      this.logger.error(
        `Failed to mark error ${errorId} as resolved:`,
        error.stack,
      );
      throw error;
    }
  }
  async getErrorStats(): Promise<{
    totalErrors: number;
    unresolvedErrors: number;
    errorsByType: Record<string, number>;
    recentErrors: number;
  }> {
    try {
      const [totalResult, unresolvedResult, byTypeResult, recentResult] =
        await Promise.all([
          this.db.query('SELECT COUNT(*) as count FROM sync_errors'),
          this.db.query(
            'SELECT COUNT(*) as count FROM sync_errors WHERE resolved = false',
          ),
          this.db.query(`
                    SELECT error_type, COUNT(*) as count 
                    FROM sync_errors 
                    WHERE resolved = false 
                    GROUP BY error_type
                `),
          this.db.query(`
                    SELECT COUNT(*) as count FROM sync_errors 
                    WHERE created_at >= NOW() - INTERVAL '24 hours'
                `),
        ]);

      const errorsByType: Record<string, number> = {};
      byTypeResult.rows.forEach((row) => {
        errorsByType[row.error_type] = parseInt(row.count);
      });

      return {
        totalErrors: parseInt(totalResult.rows[0].count),
        unresolvedErrors: parseInt(unresolvedResult.rows[0].count),
        errorsByType,
        recentErrors: parseInt(recentResult.rows[0].count),
      };
    } catch (error) {
      this.logger.error('Failed to get error stats:', error.stack);
      throw error;
    }
  }

  async getUserErrors(
    userId: string,
    limit: number = 10,
  ): Promise<SyncError[]> {
    try {
      const query = `
                SELECT * FROM sync_errors 
                WHERE user_id = $1 
                ORDER BY created_at DESC 
                LIMIT $2
            `;

      const result = await this.db.query(query, [userId, limit]);
      return result.rows.map((row) => ({
        ...row,
        metadata: JSON.parse(row.metadata || '{}'),
      }));
    } catch (error) {
      this.logger.error(
        `Failed to get errors for user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }

  async forceRetryError(errorId: string): Promise<boolean> {
    try {
      const error = await this.findErrorById(errorId);
      if (!error) {
        this.logger.warn(`Error ${errorId} not found`);
        return false;
      }

      if (error.resolved) {
        this.logger.warn(`Error ${errorId} is already resolved`);
        return false;
      }

      await this.retryError(error);
      return true;
    } catch (error) {
      this.logger.error(`Failed to force retry error ${errorId}:`, error.stack);
      return false;
    }
  }

  private async findErrorsToRetry(): Promise<SyncError[]> {
    const query = `
            SELECT * FROM sync_errors 
            WHERE resolved = false 
            AND retry_count < max_retries 
            AND next_retry_at <= NOW()
            ORDER BY created_at ASC
            LIMIT 50
        `;

    const result = await this.db.query(query);
    return result.rows.map((row) => ({
      ...row,
      metadata: JSON.parse(row.metadata || '{}'),
    }));
  }

  private async findErrorById(errorId: string): Promise<SyncError | null> {
    const query = `SELECT * FROM sync_errors WHERE id = $1`;
    const result = await this.db.query(query, [errorId]);

    if (result.rows.length === 0) return null;

    return {
      ...result.rows[0],
      metadata: JSON.parse(result.rows[0].metadata || '{}'),
    };
  }

  private async retryError(error: SyncError): Promise<void> {
    switch (error.error_type) {
      case 'event_sync':
        await this.retryEventSync(error);
        break;
      case 'webhook_delivery':
        await this.retryWebhookDelivery(error);
        break;
      case 'calendar_connection':
        await this.retryCalendarConnection(error);
        break;
      case 'token_refresh':
        await this.retryTokenRefresh(error);
        break;
      default:
        throw new Error(`Unknown error type: ${error.error_type}`);
    }

    await this.markErrorResolved(error.id);
  }

  private async retryEventSync(error: SyncError): Promise<void> {
    const { eventId, operation = 'pull' } = error.metadata;

    switch (operation) {
      case 'pull':
        await this.eventSyncQueue.queueEventPull(error.user_id, {
          priority: JobPriority.HIGH,
        });
        break;
      case 'push':
        if (eventId) {
          await this.eventSyncQueue.queueEventPush(
            error.user_id,
            eventId,
            'primary',
            JobPriority.HIGH,
          );
        }
        break;
      case 'full':
        await this.eventSyncQueue.queueFullSync(
          error.user_id,
          JobPriority.HIGH,
        );
        break;
    }
  }

  private async retryWebhookDelivery(error: SyncError): Promise<void> {
    const { webhookUrl, payload, headers } = error.metadata;

    if (webhookUrl && payload) {
      await this.webhookQueue.queueWebhook(
        error.user_id,
        webhookUrl,
        payload,
        headers,
        JobPriority.HIGH,
      );
    }
  }

  private async retryCalendarConnection(error: SyncError): Promise<void> {
    this.logger.log(`Retrying calendar connection for user ${error.user_id}`);
  }

  private async retryTokenRefresh(error: SyncError): Promise<void> {
    this.logger.log(`Retrying token refresh for user ${error.user_id}`);

    // Could trigger token refresh
    // await this.googleAuthService.refreshToken(error.user_id);
  }

  private async updateErrorRetry(
    errorId: string,
    newErrorMessage?: string,
  ): Promise<void> {
    const nextRetryAt = this.calculateNextRetry(
      (await this.getRetryCount(errorId)) + 1,
    );

    const query = `
            UPDATE sync_errors 
            SET retry_count = retry_count + 1, 
                next_retry_at = $1,
                error_message = COALESCE($2, error_message),
                updated_at = NOW()
            WHERE id = $3
        `;

    await this.db.query(query, [nextRetryAt, newErrorMessage, errorId]);
  }

  private async getRetryCount(errorId: string): Promise<number> {
    const query = `SELECT retry_count FROM sync_errors WHERE id = $1`;
    const result = await this.db.query(query, [errorId]);
    return result.rows[0]?.retry_count || 0;
  }

  private calculateNextRetry(retryCount: number): Date {
    // Exponential backoff: 5min, 15min, 45min, 2h, 6h
    const delays = [5, 15, 45, 120, 360]; // minutes
    const delayMinutes = delays[Math.min(retryCount, delays.length - 1)];

    const nextRetry = new Date();
    nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes);
    return nextRetry;
  }

  private async archiveOldErrors(daysOld: number): Promise<number> {
    const query = `
            DELETE FROM sync_errors 
            WHERE created_at < NOW() - INTERVAL '${daysOld} days'
            AND (resolved = true OR retry_count >= max_retries)
            RETURNING id
        `;

    const result = await this.db.query(query);
    return result.rows.length;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
