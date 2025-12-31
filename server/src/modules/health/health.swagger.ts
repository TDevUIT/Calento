import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';

export const ApiHealthCheck = () =>
    applyDecorators(
        ApiOperation({
            summary: '💚 System health check',
            description: 'System health check with database, memory, and uptime info',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: '✅ System health information',
            schema: {
                example: SwaggerExamples.Health.System.response,
            },
        }),
    );

export const ApiDatabaseHealthCheck = () =>
    applyDecorators(
        ApiOperation({
            summary: '🗄️ Database health check',
            description: 'Check database connection status and statistics',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: '✅ Database health information',
            schema: {
                example: SwaggerExamples.Health.Database.response,
            },
        }),
        ApiResponse({
            status: HttpStatus.SERVICE_UNAVAILABLE,
            description: '❌ Database unhealthy',
            schema: {
                example: {
                    status: 'unhealthy',
                    timestamp: '2024-01-15T10:30:00Z',
                },
            },
        }),
    );
