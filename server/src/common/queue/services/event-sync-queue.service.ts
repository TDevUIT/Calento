import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { BaseQueueService } from './base-queue.service';
import {
  EventSyncJobData,
  BatchEventSyncJobData,
  QueueJobOptions,
} from '../interfaces/queue-job.interface';
import { QueueName, JobPriority } from '../types/queue.types';
import { EVENT_SYNC_QUEUE_CONFIG } from '../config/queue.config';
import { TIME_CONSTANTS } from '../../constants';

@Injectable()
export class EventSyncQueueService
  extends BaseQueueService<any>
  implements OnModuleInit
{
  protected queueName = QueueName.EVENT_SYNC;

  constructor(configService: ConfigService) {
    super(configService);
  }

  async onModuleInit() {
    await this.initializeQueue(EVENT_SYNC_QUEUE_CONFIG);
  }

  async queueEventPull(
    userId: string,
    options?: {
      timeMin?: Date;
      timeMax?: Date;
      maxResults?: number;
      priority?: JobPriority;
    },
  ): Promise<Job<EventSyncJobData>> {
    const jobData: EventSyncJobData = {
      userId,
      syncType: 'pull',
      createdAt: new Date(),
      options: {
        timeMin: options?.timeMin,
        timeMax: options?.timeMax,
        maxResults: options?.maxResults,
      },
    };

    const jobOptions: QueueJobOptions = {
      priority: options?.priority || JobPriority.MEDIUM,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    };

    return await this.addJob('event-pull', jobData, jobOptions);
  }

  async queueEventPush(
    userId: string,
    eventId: string,
    calendarId = 'primary',
    priority = JobPriority.HIGH,
  ): Promise<Job<EventSyncJobData>> {
    const jobData: EventSyncJobData = {
      userId,
      syncType: 'push',
      eventId,
      calendarId,
      createdAt: new Date(),
    };

    const jobOptions: QueueJobOptions = {
      priority,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    };

    return await this.addJob('event-push', jobData, jobOptions);
  }

  async queueBatchSync(
    userId: string,
    eventIds: string[],
    operation: 'create' | 'update' | 'delete',
    googleCalendarId = 'primary',
    priority = JobPriority.MEDIUM,
  ): Promise<Job<BatchEventSyncJobData>> {
    const jobData: BatchEventSyncJobData = {
      userId,
      eventIds,
      operation,
      googleCalendarId,
      createdAt: new Date(),
    };

    const jobOptions: QueueJobOptions = {
      priority,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    };

    return await this.addJob('batch-sync', jobData, jobOptions);
  }

  async queueFullSync(
    userId: string,
    priority = JobPriority.LOW,
  ): Promise<Job<EventSyncJobData>> {
    const jobData: EventSyncJobData = {
      userId,
      syncType: 'full',
      createdAt: new Date(),
      options: {
        timeMin: new Date(
          Date.now() - TIME_CONSTANTS.EVENT_SYNC.FULL_SYNC_PAST_RANGE,
        ),
        timeMax: new Date(
          Date.now() + TIME_CONSTANTS.EVENT_SYNC.FULL_SYNC_FUTURE_RANGE,
        ),
        maxResults: 2500,
      },
    };

    const jobOptions: QueueJobOptions = {
      priority,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 10000,
      },
      jobId: `full-sync-${userId}`, // Prevent duplicate full syncs
    };

    return await this.addJob('full-sync', jobData, jobOptions);
  }

  async scheduleRecurringSync(
    userId: string,
    intervalMinutes = 30,
  ): Promise<Job<EventSyncJobData>> {
    const jobData: EventSyncJobData = {
      userId,
      syncType: 'pull',
      createdAt: new Date(),
      options: {
        timeMin: new Date(
          Date.now() - TIME_CONSTANTS.EVENT_SYNC.BATCH_SYNC_PAST_RANGE,
        ),
        timeMax: new Date(
          Date.now() + TIME_CONSTANTS.EVENT_SYNC.BATCH_SYNC_FUTURE_RANGE,
        ),
        maxResults: 500,
      },
    };

    const jobOptions: QueueJobOptions = {
      priority: JobPriority.BACKGROUND,
      attempts: 3,
      jobId: `recurring-sync-${userId}`,
    };

    return await this.addJob('recurring-sync', jobData, jobOptions);
  }
}
