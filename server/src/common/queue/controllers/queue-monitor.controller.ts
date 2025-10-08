import { Controller, Get, Post, Param, Query, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventSyncQueueService } from '../services/event-sync-queue.service';
import { EmailQueueService } from '../services/email-queue.service';
import { WebhookQueueService } from '../services/webhook-queue.service';
import { QueueMonitor } from '../utils/queue-monitor.util';

/**
 * Queue monitoring and management controller
 * Provides endpoints to monitor queue health and manage jobs
 */
@ApiTags('Queue Management')
@Controller('api/queues')
export class QueueMonitorController {
  constructor(
    private readonly eventSyncQueue: EventSyncQueueService,
    private readonly emailQueue: EmailQueueService,
    private readonly webhookQueue: WebhookQueueService,
  ) {}

  /**
   * Get health status of all queues
   */
  @Get('health')
  @ApiOperation({ summary: 'Get health status of all queues' })
  @ApiResponse({ status: 200, description: 'Queue health metrics' })
  async getQueuesHealth() {
    const [eventSyncHealth, emailHealth, webhookHealth] = await Promise.all([
      QueueMonitor.getQueueHealth(this.eventSyncQueue['queue']),
      QueueMonitor.getQueueHealth(this.emailQueue['queue']),
      QueueMonitor.getQueueHealth(this.webhookQueue['queue']),
    ]);

    return {
      success: true,
      data: {
        queues: [eventSyncHealth, emailHealth, webhookHealth],
        overall: this.determineOverallHealth([
          eventSyncHealth.health,
          emailHealth.health,
          webhookHealth.health,
        ]),
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Get metrics for a specific queue
   */
  @Get(':queueName/metrics')
  @ApiOperation({ summary: 'Get metrics for a specific queue' })
  @ApiResponse({ status: 200, description: 'Queue metrics' })
  async getQueueMetrics(@Param('queueName') queueName: string) {
    const queue = this.getQueueByName(queueName);
    const health = await QueueMonitor.getQueueHealth(queue);

    return {
      success: true,
      data: health,
    };
  }

  /**
   * Get failed jobs for a queue
   */
  @Get(':queueName/failed')
  @ApiOperation({ summary: 'Get failed jobs for a queue' })
  @ApiResponse({ status: 200, description: 'List of failed jobs' })
  async getFailedJobs(
    @Param('queueName') queueName: string,
    @Query('limit') limit = 10,
  ) {
    const queue = this.getQueueByName(queueName);
    const failedJobs = await QueueMonitor.getFailedJobs(queue, Number(limit));

    return {
      success: true,
      data: {
        jobs: failedJobs,
        total: failedJobs.length,
      },
    };
  }

  /**
   * Get job details by ID
   */
  @Get(':queueName/jobs/:jobId')
  @ApiOperation({ summary: 'Get job details by ID' })
  @ApiResponse({ status: 200, description: 'Job details' })
  async getJobDetails(
    @Param('queueName') queueName: string,
    @Param('jobId') jobId: string,
  ) {
    const queue = this.getQueueByName(queueName);
    const jobDetails = await QueueMonitor.getJobDetails(queue, jobId);

    if (!jobDetails) {
      return {
        success: false,
        message: `Job ${jobId} not found`,
      };
    }

    return {
      success: true,
      data: jobDetails,
    };
  }

  /**
   * Retry a failed job
   */
  @Post(':queueName/jobs/:jobId/retry')
  @ApiOperation({ summary: 'Retry a failed job' })
  @ApiResponse({ status: 200, description: 'Job retried successfully' })
  async retryJob(
    @Param('queueName') queueName: string,
    @Param('jobId') jobId: string,
  ) {
    const queueService = this.getQueueServiceByName(queueName);
    await queueService.retryJob(jobId);

    return {
      success: true,
      message: `Job ${jobId} has been queued for retry`,
    };
  }

  /**
   * Clean old jobs from a queue
   */
  @Post(':queueName/clean')
  @ApiOperation({ summary: 'Clean old jobs from a queue' })
  @ApiResponse({ status: 200, description: 'Jobs cleaned successfully' })
  async cleanQueue(
    @Param('queueName') queueName: string,
    @Query('completedAge') completedAge = 24,
    @Query('failedAge') failedAge = 168,
  ) {
    const queue = this.getQueueByName(queueName);
    const result = await QueueMonitor.cleanOldJobs(queue, {
      completedAge: Number(completedAge),
      failedAge: Number(failedAge),
    });

    return {
      success: true,
      data: result,
      message: `Cleaned ${result.completed} completed and ${result.failed} failed jobs`,
    };
  }

  /**
   * Pause a queue
   */
  @Post(':queueName/pause')
  @ApiOperation({ summary: 'Pause a queue' })
  @ApiResponse({ status: 200, description: 'Queue paused successfully' })
  async pauseQueue(@Param('queueName') queueName: string) {
    const queueService = this.getQueueServiceByName(queueName);
    await queueService.pause();

    return {
      success: true,
      message: `Queue ${queueName} has been paused`,
    };
  }

  /**
   * Resume a queue
   */
  @Post(':queueName/resume')
  @ApiOperation({ summary: 'Resume a paused queue' })
  @ApiResponse({ status: 200, description: 'Queue resumed successfully' })
  async resumeQueue(@Param('queueName') queueName: string) {
    const queueService = this.getQueueServiceByName(queueName);
    await queueService.resume();

    return {
      success: true,
      message: `Queue ${queueName} has been resumed`,
    };
  }

  /**
   * Remove a specific job
   */
  @Delete(':queueName/jobs/:jobId')
  @ApiOperation({ summary: 'Remove a specific job' })
  @ApiResponse({ status: 200, description: 'Job removed successfully' })
  async removeJob(
    @Param('queueName') queueName: string,
    @Param('jobId') jobId: string,
  ) {
    const queueService = this.getQueueServiceByName(queueName);
    await queueService.removeJob(jobId);

    return {
      success: true,
      message: `Job ${jobId} has been removed`,
    };
  }

  // Helper methods
  private getQueueByName(queueName: string): any {
    switch (queueName) {
      case 'event-sync':
        return this.eventSyncQueue['queue'];
      case 'email':
        return this.emailQueue['queue'];
      case 'webhook':
        return this.webhookQueue['queue'];
      default:
        throw new Error(`Queue ${queueName} not found`);
    }
  }

  private getQueueServiceByName(queueName: string): any {
    switch (queueName) {
      case 'event-sync':
        return this.eventSyncQueue;
      case 'email':
        return this.emailQueue;
      case 'webhook':
        return this.webhookQueue;
      default:
        throw new Error(`Queue ${queueName} not found`);
    }
  }

  private determineOverallHealth(
    healths: Array<'healthy' | 'warning' | 'critical'>,
  ): 'healthy' | 'warning' | 'critical' {
    if (healths.some((h) => h === 'critical')) return 'critical';
    if (healths.some((h) => h === 'warning')) return 'warning';
    return 'healthy';
  }
}
