import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { BaseQueueService } from './base-queue.service';
import {
  EmailJobData,
  QueueJobOptions,
} from '../interfaces/queue-job.interface';
import { QueueName, JobPriority } from '../types/queue.types';
import { EMAIL_QUEUE_CONFIG } from '../config/queue.config';

@Injectable()
export class EmailQueueService
  extends BaseQueueService<EmailJobData>
  implements OnModuleInit
{
  protected queueName = QueueName.EMAIL;

  constructor(configService: ConfigService) {
    super(configService);
  }

  async onModuleInit() {
    await this.initializeQueue(EMAIL_QUEUE_CONFIG);
  }

  async queueWelcomeEmail(
    userId: string,
    email: string,
    userName: string,
  ): Promise<Job<EmailJobData>> {
    const jobData: EmailJobData = {
      userId,
      to: email,
      subject: 'Welcome to Calento!',
      template: 'welcome',
      context: {
        userName,
      },
      createdAt: new Date(),
    };

    return await this.addJob('welcome-email', jobData, {
      priority: JobPriority.HIGH,
      attempts: 5,
    });
  }

  async queueEventReminderEmail(
    userId: string,
    email: string,
    eventDetails: {
      title: string;
      startTime: Date;
      location?: string;
    },
    delayMinutes = 0,
  ): Promise<Job<EmailJobData>> {
    const jobData: EmailJobData = {
      userId,
      to: email,
      subject: `Reminder: ${eventDetails.title}`,
      template: 'event-reminder',
      context: eventDetails,
      createdAt: new Date(),
    };

    return await this.addJob('event-reminder-email', jobData, {
      priority: JobPriority.HIGH,
      delay: delayMinutes * 60 * 1000,
      attempts: 3,
    });
  }

  async queueSyncFailureEmail(
    userId: string,
    email: string,
    errorDetails: {
      syncType: string;
      failedEvents: number;
      errorMessage: string;
    },
  ): Promise<Job<EmailJobData>> {
    const jobData: EmailJobData = {
      userId,
      to: email,
      subject: 'Calendar Sync Failed',
      template: 'sync-failure',
      context: errorDetails,
      createdAt: new Date(),
    };

    return await this.addJob('sync-failure-email', jobData, {
      priority: JobPriority.MEDIUM,
      attempts: 3,
    });
  }

  async queueBulkEmails(
    emails: Array<{
      userId: string;
      to: string;
      subject: string;
      template: string;
      context?: Record<string, any>;
    }>,
    priority = JobPriority.LOW,
  ): Promise<Job<EmailJobData>[]> {
    const jobs = emails.map((email) => ({
      name: 'bulk-email',
      data: {
        ...email,
        createdAt: new Date(),
      } as EmailJobData,
      opts: {
        priority,
        attempts: 3,
      } as QueueJobOptions,
    }));

    return await this.addBulkJobs(jobs);
  }
}
