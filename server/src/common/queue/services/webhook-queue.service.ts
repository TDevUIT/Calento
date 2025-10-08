import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { BaseQueueService } from './base-queue.service';
import {
  WebhookJobData,
  QueueJobOptions,
} from '../interfaces/queue-job.interface';
import { QueueName, JobPriority } from '../types/queue.types';
import { WEBHOOK_QUEUE_CONFIG } from '../config/queue.config';

@Injectable()
export class WebhookQueueService
  extends BaseQueueService<WebhookJobData>
  implements OnModuleInit
{
  protected queueName = QueueName.WEBHOOK;

  constructor(configService: ConfigService) {
    super(configService);
  }

  async onModuleInit() {
    await this.initializeQueue(WEBHOOK_QUEUE_CONFIG);
  }

  async queueWebhook(
    userId: string,
    webhookUrl: string,
    payload: Record<string, any>,
    headers?: Record<string, string>,
    priority = JobPriority.MEDIUM,
  ): Promise<Job<WebhookJobData>> {
    const jobData: WebhookJobData = {
      userId,
      webhookUrl,
      payload,
      headers,
      createdAt: new Date(),
    };

    return await this.addJob('webhook-delivery', jobData, {
      priority,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }

  async queueEventUpdateWebhook(
    userId: string,
    webhookUrl: string,
    event: any,
    action: 'created' | 'updated' | 'deleted',
  ): Promise<Job<WebhookJobData>> {
    return await this.queueWebhook(
      userId,
      webhookUrl,
      {
        event: 'event.updated',
        action,
        data: event,
        timestamp: new Date().toISOString(),
      },
      undefined,
      JobPriority.HIGH,
    );
  }

  async queueSyncCompletedWebhook(
    userId: string,
    webhookUrl: string,
    syncResults: {
      synced: number;
      failed: number;
      duration: number;
    },
  ): Promise<Job<WebhookJobData>> {
    return await this.queueWebhook(
      userId,
      webhookUrl,
      {
        event: 'sync.completed',
        data: syncResults,
        timestamp: new Date().toISOString(),
      },
      undefined,
      JobPriority.LOW,
    );
  }
}
