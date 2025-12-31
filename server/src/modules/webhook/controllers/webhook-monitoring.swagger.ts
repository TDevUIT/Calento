import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SwaggerExamples } from '../../../common/swagger/swagger-examples';

export const ApiGetWebhookStats = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get webhook renewal statistics',
            description:
                'Get statistics about active webhooks and their renewal status',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Webhook statistics retrieved successfully',
            schema: {
                example: SwaggerExamples.Webhook.Stats.response,
            },
        }),
    );

export const ApiRenewUserWebhook = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Manually renew webhook for user calendar',
            description: 'Force renewal of webhook for a specific user calendar',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Webhook renewal triggered successfully',
            schema: {
                example: SwaggerExamples.Webhook.Renew.response,
            },
        }),
    );

export const ApiGetErrorStats = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get sync error statistics',
            description: 'Get overall statistics about sync errors in the system',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Error statistics retrieved successfully',
            schema: {
                example: SwaggerExamples.Webhook.Errors.response,
            },
        }),
    );

export const ApiGetUserErrors = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get sync errors for current user',
            description: 'Get recent sync errors for the authenticated user',
        }),
        ApiQuery({
            name: 'limit',
            required: false,
            type: Number,
            description: 'Maximum number of errors to return (default: 10)',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'User errors retrieved successfully',
        }),
    );

export const ApiRetryError = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Force retry a specific error',
            description: 'Manually trigger retry for a specific sync error',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Error retry triggered successfully',
        }),
    );

export const ApiGetHealthStatus = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get overall sync health status',
            description: 'Get combined health status of webhooks and sync operations',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Health status retrieved successfully',
            schema: {
                example: SwaggerExamples.Webhook.Health.response,
            },
        }),
    );
