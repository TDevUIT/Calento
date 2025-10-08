import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import { EmailJobData, JobResult } from '../interfaces/queue-job.interface';
import { QueueName } from '../types/queue.types';
import { getDefaultWorkerConfig } from '../config/queue.config';
import { EmailService } from '../../../modules/email/services/email.service';

@Injectable()
export class EmailProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailProcessor.name);
  private worker: Worker;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async onModuleInit() {
    const workerConfig = getDefaultWorkerConfig(this.configService);

    this.worker = new Worker(
      QueueName.EMAIL,
      async (job: Job<EmailJobData>) => {
        return await this.processJob(job);
      },
      {
        ...workerConfig,
        concurrency:
          parseInt(this.configService.get('EMAIL_WORKER_CONCURRENCY', '5')) ||
          5,
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Email job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(
        `Email job ${job?.id} failed: ${err.message}`,
        err.stack,
      );
    });

    this.worker.on('progress', (job, progress) => {
      this.logger.debug(`Email job ${job.id} progress: ${progress}%`);
    });

    this.logger.log(
      `Email worker started with concurrency: ${this.configService.get('EMAIL_WORKER_CONCURRENCY', '5')}`,
    );
  }

  private async processJob(job: Job<EmailJobData>): Promise<JobResult> {
    this.logger.log(`Processing email job ${job.id} of type: ${job.name}`);

    try {
      switch (job.name) {
        case 'welcome-email':
          return await this.processWelcomeEmail(job);

        case 'event-reminder-email':
          return await this.processEventReminderEmail(job);

        case 'sync-failure-email':
          return await this.processSyncFailureEmail(job);

        case 'bulk-email':
          return await this.processBulkEmail(job);

        case 'password-reset-email':
          return await this.processPasswordResetEmail(job);

        default:
          throw new Error(`Unknown email job type: ${job.name}`);
      }
    } catch (error) {
      this.logger.error(
        `Error processing email job ${job.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async processWelcomeEmail(
    job: Job<EmailJobData>,
  ): Promise<JobResult> {
    const { userId, to, context } = job.data;

    this.logger.log(`Sending welcome email to ${to}`);
    await job.updateProgress(20);

    try {
      const result = await this.emailService.sendWelcomeEmail(
        userId,
        to,
        (context?.userName as string) || 'User',
      );

      await job.updateProgress(100);

      if (result.success) {
        return {
          success: true,
          message: `Welcome email sent to ${to}`,
          data: { messageId: result.messageId },
        };
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async processEventReminderEmail(
    job: Job<EmailJobData>,
  ): Promise<JobResult> {
    const { userId, to, context } = job.data;

    this.logger.log(`Sending event reminder email to ${to}`);
    await job.updateProgress(20);

    try {
      const result = await this.emailService.sendEventReminderEmail(
        userId,
        to,
        {
          title: (context?.title as string) || 'Event',
          startTime: new Date((context?.startTime as string) || new Date()),
          location: context?.location as string,
          description: context?.description as string,
        },
      );

      await job.updateProgress(100);

      if (result.success) {
        return {
          success: true,
          message: `Event reminder email sent to ${to}`,
          data: { messageId: result.messageId },
        };
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      this.logger.error(
        `Failed to send event reminder email: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async processSyncFailureEmail(
    job: Job<EmailJobData>,
  ): Promise<JobResult> {
    const { userId, to, subject, context } = job.data;

    this.logger.log(`Sending sync failure email to ${to}`);
    await job.updateProgress(20);

    try {
      const result = await this.emailService.sendEmail(
        {
          to,
          subject: subject || 'Calendar Sync Failed',
          template: 'sync-failure',
          context,
        },
        userId,
      );

      await job.updateProgress(100);

      if (result.success) {
        return {
          success: true,
          message: `Sync failure email sent to ${to}`,
          data: { messageId: result.messageId },
        };
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      this.logger.error(
        `Failed to send sync failure email: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async processBulkEmail(job: Job<EmailJobData>): Promise<JobResult> {
    const { userId, to, subject, template, context } = job.data;

    this.logger.log(`Sending bulk email to ${to}`);
    await job.updateProgress(20);

    try {
      const result = await this.emailService.sendEmail(
        {
          to,
          subject,
          template,
          context,
        },
        userId,
      );

      await job.updateProgress(100);

      if (result.success) {
        return {
          success: true,
          message: `Bulk email sent to ${to}`,
          data: { messageId: result.messageId },
        };
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      this.logger.error(
        `Failed to send bulk email: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async processPasswordResetEmail(
    job: Job<EmailJobData>,
  ): Promise<JobResult> {
    const { userId, to, context } = job.data;

    this.logger.log(`Sending password reset email to ${to}`);
    await job.updateProgress(20);

    try {
      const result = await this.emailService.sendPasswordResetEmail(
        userId,
        to,
        (context?.userName as string) || 'User',
        (context?.identifier as string) || '',
        (context?.secret as string) || '',
      );

      await job.updateProgress(100);

      if (result.success) {
        return {
          success: true,
          message: `Password reset email sent to ${to}`,
          data: { messageId: result.messageId },
        };
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
      this.logger.log('Email worker stopped');
    }
  }
}
