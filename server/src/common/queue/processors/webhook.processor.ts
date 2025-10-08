import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import { WebhookJobData, JobResult } from '../interfaces/queue-job.interface';
import { QueueName } from '../types/queue.types';
import { getDefaultWorkerConfig } from '../config/queue.config';

@Injectable()
export class WebhookProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WebhookProcessor.name);
  private worker: Worker;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const workerConfig = getDefaultWorkerConfig(this.configService);

    this.worker = new Worker(
      QueueName.WEBHOOK,
      async (job: Job<WebhookJobData>) => {
        return await this.processJob(job);
      },
      {
        ...workerConfig,
        concurrency:
          parseInt(
            this.configService.get('WEBHOOK_WORKER_CONCURRENCY', '10'),
          ) || 10,
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(
        `Webhook job ${job.id} delivered to ${job.data.webhookUrl}`,
      );
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(
        `Webhook job ${job?.id} failed for ${job?.data.webhookUrl}: ${err.message}`,
        err.stack,
      );
    });

    this.logger.log(
      `Webhook worker started with concurrency: ${workerConfig.concurrency}`,
    );
  }

  private async processJob(job: Job<WebhookJobData>): Promise<JobResult> {
    const { webhookUrl, payload, headers, userId } = job.data;

    this.logger.log(`Delivering webhook to ${webhookUrl} (user: ${userId})`);

    try {
      await job.updateProgress(20);

      await this.simulateWebhookDelivery(webhookUrl, payload);

      await job.updateProgress(100);

      return {
        success: true,
        message: `Webhook delivered successfully to ${webhookUrl}`,
        data: {
          statusCode: 200,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to deliver webhook to ${webhookUrl}: ${error.message}`,
        error.stack,
      );

      if (this.shouldRetry(error)) {
        throw error;
      }

      return {
        success: false,
        error: `Webhook delivery failed: ${error.message}`,
      };
    }
  }

  private async simulateWebhookDelivery(
    url: string,
    payload: Record<string, any>,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    this.logger.debug(
      `[SIMULATED] Webhook POST to ${url}:`,
      JSON.stringify(payload),
    );

    if (Math.random() < 0.1) {
      throw new Error('Simulated webhook delivery error');
    }
  }

  private shouldRetry(error: any): boolean {
    const statusCode = error.response?.status;

    if (!statusCode) {
      return true;
    }

    return statusCode >= 500 && statusCode < 600;
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
      this.logger.log('Webhook worker stopped');
    }
  }
}
