import { Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

export class QueueMonitor {
  private static readonly logger = new Logger(QueueMonitor.name);

  static async getQueueHealth(queue: Queue): Promise<{
    name: string;
    isPaused: boolean;
    counts: any;
    metrics: {
      throughput: number;
      avgWaitTime: number;
      errorRate: number;
    };
    health: 'healthy' | 'warning' | 'critical';
  }> {
    const [isPaused, counts] = await Promise.all([
      queue.isPaused(),
      queue.getJobCounts(),
    ]);

    const total =
      counts.waiting + counts.active + counts.completed + counts.failed;
    const errorRate = total > 0 ? (counts.failed / total) * 100 : 0;

    let health: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (counts.failed > 100 || errorRate > 10) {
      health = 'critical';
    } else if (counts.waiting > 500 || errorRate > 5) {
      health = 'warning';
    }

    return {
      name: queue.name,
      isPaused,
      counts,
      metrics: {
        throughput: 0, // Would need time-series data
        avgWaitTime: 0, // Would need job timestamps
        errorRate: Math.round(errorRate * 100) / 100,
      },
      health,
    };
  }

  static async getJobDetails(queue: Queue, jobId: string): Promise<any> {
    const job = await queue.getJob(jobId);

    if (!job) {
      return null;
    }

    return {
      id: job.id,
      name: job.name,
      data: job.data,
      progress: job.progress,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
      stacktrace: job.stacktrace,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      returnvalue: job.returnvalue,
    };
  }

  static async logQueueStats(queue: Queue): Promise<void> {
    const health = await this.getQueueHealth(queue);

    this.logger.log(
      `[${health.name}] Status: ${health.health.toUpperCase()} | ` +
        `Waiting: ${health.counts.waiting} | ` +
        `Active: ${health.counts.active} | ` +
        `Completed: ${health.counts.completed} | ` +
        `Failed: ${health.counts.failed} | ` +
        `Error Rate: ${health.metrics.errorRate}%`,
    );

    if (health.health === 'critical') {
      this.logger.error(
        `Queue "${health.name}" is in CRITICAL state! ` +
          `Failed jobs: ${health.counts.failed}, Error rate: ${health.metrics.errorRate}%`,
      );
    } else if (health.health === 'warning') {
      this.logger.warn(
        `Queue "${health.name}" needs attention. ` +
          `Waiting jobs: ${health.counts.waiting}, Error rate: ${health.metrics.errorRate}%`,
      );
    }
  }

  static async getFailedJobs(
    queue: Queue,
    limit = 10,
  ): Promise<
    Array<{
      id: string;
      name: string;
      failedReason: string;
      attemptsMade: number;
      data: any;
    }>
  > {
    const failedJobs = await queue.getFailed(0, limit - 1);

    return failedJobs.map((job) => ({
      id: job.id!,
      name: job.name,
      failedReason: job.failedReason || 'Unknown',
      attemptsMade: job.attemptsMade,
      data: job.data,
    }));
  }

  static async cleanOldJobs(
    queue: Queue,
    options: {
      completedAge?: number; // hours
      failedAge?: number; // hours
      limit?: number;
    } = {},
  ): Promise<{ completed: number; failed: number }> {
    const { completedAge = 24, failedAge = 168, limit = 1000 } = options;

    const [completedJobs, failedJobs] = await Promise.all([
      queue.clean(completedAge * 3600 * 1000, limit, 'completed'),
      queue.clean(failedAge * 3600 * 1000, limit, 'failed'),
    ]);

    this.logger.log(
      `Cleaned ${completedJobs.length} completed and ${failedJobs.length} failed jobs from queue "${queue.name}"`,
    );

    return {
      completed: completedJobs.length,
      failed: failedJobs.length,
    };
  }
}
