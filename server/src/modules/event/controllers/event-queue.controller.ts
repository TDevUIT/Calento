import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventSyncQueueService } from '../../../common/queue/services/event-sync-queue.service';
import { JobPriority } from '../../../common/queue/types/queue.types';

@ApiTags('Event Queue')
@Controller('api/events/queue')
export class EventQueueController {
  constructor(private readonly eventSyncQueue: EventSyncQueueService) {}

  @Post('pull')
  @ApiOperation({ summary: 'Queue event pull from Google Calendar' })
  @ApiResponse({ status: 201, description: 'Job queued successfully' })
  async queueEventPull(
    @Body()
    body: {
      userId: string;
      timeMin?: string;
      timeMax?: string;
      maxResults?: number;
      priority?: 'critical' | 'high' | 'medium' | 'low';
    },
  ) {
    const priority = this.mapPriority(body.priority);

    const job = await this.eventSyncQueue.queueEventPull(body.userId, {
      timeMin: body.timeMin ? new Date(body.timeMin) : undefined,
      timeMax: body.timeMax ? new Date(body.timeMax) : undefined,
      maxResults: body.maxResults,
      priority,
    });

    return {
      success: true,
      message: 'Event pull job queued successfully',
      data: {
        jobId: job.id,
        queueName: job.queueName,
        priority: body.priority || 'medium',
      },
    };
  }

  @Post('push')
  @ApiOperation({ summary: 'Queue event push to Google Calendar' })
  @ApiResponse({ status: 201, description: 'Job queued successfully' })
  async queueEventPush(
    @Body()
    body: {
      userId: string;
      eventId: string;
      calendarId?: string;
      priority?: 'critical' | 'high' | 'medium' | 'low';
    },
  ) {
    const priority = this.mapPriority(body.priority);

    const job = await this.eventSyncQueue.queueEventPush(
      body.userId,
      body.eventId,
      body.calendarId || 'primary',
      priority,
    );

    return {
      success: true,
      message: 'Event push job queued successfully',
      data: {
        jobId: job.id,
        queueName: job.queueName,
        eventId: body.eventId,
      },
    };
  }

  @Post('batch')
  @ApiOperation({ summary: 'Queue batch event synchronization' })
  @ApiResponse({ status: 201, description: 'Batch job queued successfully' })
  async queueBatchSync(
    @Body()
    body: {
      userId: string;
      eventIds: string[];
      operation: 'create' | 'update' | 'delete';
      calendarId?: string;
      priority?: 'critical' | 'high' | 'medium' | 'low';
    },
  ) {
    const priority = this.mapPriority(body.priority);

    const job = await this.eventSyncQueue.queueBatchSync(
      body.userId,
      body.eventIds,
      body.operation,
      body.calendarId || 'primary',
      priority,
    );

    return {
      success: true,
      message: `Batch ${body.operation} job queued successfully`,
      data: {
        jobId: job.id,
        queueName: job.queueName,
        eventCount: body.eventIds.length,
        operation: body.operation,
      },
    };
  }

  @Post('full-sync')
  @ApiOperation({ summary: 'Queue full calendar synchronization' })
  @ApiResponse({
    status: 201,
    description: 'Full sync job queued successfully',
  })
  async queueFullSync(
    @Body()
    body: {
      userId: string;
      priority?: 'critical' | 'high' | 'medium' | 'low';
    },
  ) {
    const priority = this.mapPriority(body.priority || 'low');

    const job = await this.eventSyncQueue.queueFullSync(body.userId, priority);

    return {
      success: true,
      message: 'Full sync job queued successfully',
      data: {
        jobId: job.id,
        queueName: job.queueName,
      },
    };
  }

  @Get('jobs/:jobId')
  @ApiOperation({ summary: 'Get job status by ID' })
  @ApiResponse({ status: 200, description: 'Job status retrieved' })
  async getJobStatus(@Param('jobId') jobId: string) {
    const job = await this.eventSyncQueue.getJob(jobId);

    if (!job) {
      return {
        success: false,
        message: `Job ${jobId} not found`,
      };
    }

    const state = await job.getState();

    return {
      success: true,
      data: {
        id: job.id,
        name: job.name,
        state,
        progress: job.progress,
        attemptsMade: job.attemptsMade,
        data: job.data,
        returnvalue: job.returnvalue,
        failedReason: job.failedReason,
        timestamp: job.timestamp,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
      },
    };
  }

  private mapPriority(priority?: string): JobPriority {
    switch (priority) {
      case 'critical':
        return JobPriority.CRITICAL;
      case 'high':
        return JobPriority.HIGH;
      case 'medium':
        return JobPriority.MEDIUM;
      case 'low':
        return JobPriority.LOW;
      default:
        return JobPriority.MEDIUM;
    }
  }
}
