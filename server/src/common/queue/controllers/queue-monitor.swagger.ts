import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SwaggerExamples } from '../../swagger/swagger-examples';

export const ApiGetQueuesHealth = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get health status of all queues' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Queue health metrics',
            schema: {
                example: SwaggerExamples.QueueManagement.Health.response,
            },
        }),
    );

export const ApiGetQueueMetrics = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get metrics for a specific queue' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Queue metrics',
            schema: {
                example: SwaggerExamples.QueueManagement.Metrics.response,
            },
        }),
    );

export const ApiGetFailedJobs = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get failed jobs for a queue' }),
        ApiQuery({ name: 'limit', required: false, type: Number, example: 10 }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'List of failed jobs',
            schema: {
                example: SwaggerExamples.QueueManagement.Jobs.Failed.response,
            },
        }),
    );

export const ApiGetJobDetails = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get job details by ID' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Job details',
            schema: {
                example: SwaggerExamples.QueueManagement.Jobs.Details.response,
            },
        }),
        ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Job not found' }),
    );

export const ApiRetryJob = () =>
    applyDecorators(
        ApiOperation({ summary: 'Retry a failed job' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Job retried successfully',
            schema: {
                example: SwaggerExamples.QueueManagement.Action.response,
            },
        }),
    );

export const ApiCleanQueue = () =>
    applyDecorators(
        ApiOperation({ summary: 'Clean old jobs from a queue' }),
        ApiQuery({
            name: 'completedAge',
            required: false,
            type: Number,
            description: 'Age in hours for completed jobs (default: 24)',
        }),
        ApiQuery({
            name: 'failedAge',
            required: false,
            type: Number,
            description: 'Age in hours for failed jobs (default: 168)',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Jobs cleaned successfully',
            schema: {
                example: {
                    success: true,
                    data: { completed: 10, failed: 2 },
                    message: 'Cleaned 10 completed and 2 failed jobs',
                },
            },
        }),
    );

export const ApiPauseQueue = () =>
    applyDecorators(
        ApiOperation({ summary: 'Pause a queue' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Queue paused successfully',
            schema: {
                example: SwaggerExamples.QueueManagement.Action.response,
            },
        }),
    );

export const ApiResumeQueue = () =>
    applyDecorators(
        ApiOperation({ summary: 'Resume a paused queue' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Queue resumed successfully',
            schema: {
                example: SwaggerExamples.QueueManagement.Action.response,
            },
        }),
    );

export const ApiRemoveJob = () =>
    applyDecorators(
        ApiOperation({ summary: 'Remove a specific job' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Job removed successfully',
            schema: {
                example: SwaggerExamples.QueueManagement.Action.response,
            },
        }),
    );
