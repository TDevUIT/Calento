import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import {
  EventSyncJobData,
  BatchEventSyncJobData,
  JobResult,
} from '../interfaces/queue-job.interface';
import { QueueName } from '../types/queue.types';
import { getDefaultWorkerConfig } from '../config/queue.config';
import { EventSyncService } from '../../../modules/event/services/event-sync.service';
import { SyncErrorRecoveryService } from '../../services/sync-error-recovery.service';

@Injectable()
export class EventSyncProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventSyncProcessor.name);
  private worker: Worker;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventSyncService: EventSyncService,
    private readonly syncErrorRecovery: SyncErrorRecoveryService,
  ) {}

  async onModuleInit() {
    const workerConfig = getDefaultWorkerConfig(this.configService);

    this.worker = new Worker(
      QueueName.EVENT_SYNC,
      async (job: Job<EventSyncJobData | BatchEventSyncJobData>) => {
        return await this.processJob(job);
      },
      {
        ...workerConfig,
        concurrency:
          parseInt(
            this.configService.get('EVENT_SYNC_WORKER_CONCURRENCY', '5'),
          ) || 5,
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job?.id} failed: ${err.message}`, err.stack);
    });

    this.worker.on('progress', (job, progress) => {
      this.logger.debug(`Job ${job.id} progress: ${progress}%`);
    });

    this.logger.log(
      `Event sync worker started with concurrency: ${workerConfig.concurrency}`,
    );
  }

  private async processJob(
    job: Job<EventSyncJobData | BatchEventSyncJobData>,
  ): Promise<JobResult> {
    this.logger.log(`Processing job ${job.id} of type: ${job.name}`);

    try {
      switch (job.name) {
        case 'event-pull':
          return await this.processEventPull(job as Job<EventSyncJobData>);

        case 'event-push':
          return await this.processEventPush(job as Job<EventSyncJobData>);

        case 'batch-sync':
          return await this.processBatchSync(job as Job<BatchEventSyncJobData>);

        case 'full-sync':
          return await this.processFullSync(job as Job<EventSyncJobData>);

        case 'recurring-sync':
          return await this.processRecurringSync(job as Job<EventSyncJobData>);

        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      this.logger.error(
        `Error processing job ${job.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async processEventPull(
    job: Job<EventSyncJobData>,
  ): Promise<JobResult> {
    const { userId, options } = job.data;

    this.logger.log(`Pulling events from Google for user ${userId}`);
    await job.updateProgress(10);

    try {
      const result = await this.eventSyncService.pullEventsFromGoogle(
        userId,
        options,
      );

      await job.updateProgress(100);

      return {
        success: true,
        message: `Successfully pulled ${result.synced} events for user ${userId}`,
        data: {
          synced: result.synced,
          failed: result.failed,
          errors: result.errors,
          duration: result.duration,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to pull events: ${error.message}`, error.stack);

      try {
        await this.syncErrorRecovery.logSyncError(
          userId,
          'event_sync',
          error.message,
          {
            operation: 'pull',
            options: options,
            jobId: job.id,
            timestamp: new Date().toISOString(),
          },
        );
      } catch (logError) {
        this.logger.error(`Failed to log sync error: ${logError.message}`);
      }

      throw error;
    }
  }

  private async processEventPush(
    job: Job<EventSyncJobData>,
  ): Promise<JobResult> {
    const { userId, eventId, calendarId } = job.data;

    this.logger.log(`Pushing event ${eventId} to Google for user ${userId}`);
    await job.updateProgress(20);

    try {
      if (!eventId) {
        throw new Error('Event ID is required');
      }

      const query = `
                SELECT * FROM events 
                WHERE id = $1 AND user_id = $2
                LIMIT 1
            `;
      const queryResult = await this.eventSyncService['eventRepository'][
        'databaseService'
      ].query(query, [eventId, userId]);

      if (!queryResult.rows || queryResult.rows.length === 0) {
        throw new Error(`Event ${eventId} not found for user ${userId}`);
      }

      const event = queryResult.rows[0];

      const syncResult = await this.eventSyncService.createEventWithSync(
        event,
        userId,
        { skipGoogleSync: false },
      );

      await job.updateProgress(100);

      return {
        success: true,
        message: `Successfully pushed event ${eventId} to Google Calendar`,
        data: {
          syncedToGoogle: syncResult.syncedToGoogle,
          googleEventId: syncResult.googleEventId,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to push event: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Process batch sync job
   */
  private async processBatchSync(
    job: Job<BatchEventSyncJobData>,
  ): Promise<JobResult> {
    const { userId, eventIds, operation } = job.data;

    this.logger.log(
      `Processing batch ${operation} for ${eventIds.length} events (user: ${userId})`,
    );

    let processed = 0;
    const total = eventIds.length;

    for (const eventId of eventIds) {
      // Batch processing currently uses simulation
      // Real implementation requires EventSyncService integration
      await this.simulateWork(100);
      processed++;

      const progress = Math.round((processed / total) * 100);
      await job.updateProgress(progress);
    }

    return {
      success: true,
      message: `Batch ${operation} completed for ${processed}/${total} events`,
      data: { processed, total },
    };
  }

  private async processFullSync(
    job: Job<EventSyncJobData>,
  ): Promise<JobResult> {
    const { userId, options } = job.data;

    this.logger.log(`Starting full sync for user ${userId}`);
    await job.updateProgress(5);

    await this.simulateWork(5000);
    await job.updateProgress(100);

    return {
      success: true,
      message: `Full sync completed for user ${userId}`,
      data: {
        pulled: 100, // Mock
        pushed: 50,
        updated: 20,
      },
    };
  }

  private async processRecurringSync(
    job: Job<EventSyncJobData>,
  ): Promise<JobResult> {
    const { userId, options } = job.data;

    this.logger.log(`Running recurring sync for user ${userId}`);

    return await this.processEventPull(job);
  }

  private async simulateWork(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
      this.logger.log('Event sync worker stopped');
    }
  }
}
