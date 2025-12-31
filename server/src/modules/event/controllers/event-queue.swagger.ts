import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerExamples } from '../../../common/swagger/swagger-examples';

export const ApiQueueEventPull = () =>
    applyDecorators(
        ApiOperation({ summary: 'Queue event pull from Google Calendar' }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Job queued successfully',
            schema: {
                example: SwaggerExamples.EventQueue.Job.response,
            },
        }),
    );

export const ApiQueueEventPush = () =>
    applyDecorators(
        ApiOperation({ summary: 'Queue event push to Google Calendar' }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Job queued successfully',
            schema: {
                example: SwaggerExamples.EventQueue.Job.response,
            },
        }),
    );

export const ApiQueueBatchSync = () =>
    applyDecorators(
        ApiOperation({ summary: 'Queue batch event synchronization' }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Batch job queued successfully',
            schema: {
                example: SwaggerExamples.EventQueue.Job.response,
            },
        }),
    );

export const ApiQueueFullSync = () =>
    applyDecorators(
        ApiOperation({ summary: 'Queue full calendar synchronization' }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Full sync job queued successfully',
            schema: {
                example: SwaggerExamples.EventQueue.Job.response,
            },
        }),
    );

export const ApiGetJobStatus = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get job status by ID' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Job status retrieved',
            schema: {
                example: SwaggerExamples.EventQueue.Status.response,
            },
        }),
    );
