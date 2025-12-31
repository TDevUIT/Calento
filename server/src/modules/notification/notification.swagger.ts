import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';

export const ApiScheduleReminders = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Schedule event reminder notifications for current user',
            description:
                'Creates notification rows for upcoming events based on their reminders settings',
        }),
        ApiQuery({ name: 'horizonDays', required: false, type: Number, example: 30 }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Reminders scheduled successfully',
            schema: {
                example: SwaggerExamples.Notification.ScheduleReminders.response,
            },
        }),
    );

export const ApiGetPendingNotifications = () =>
    applyDecorators(
        ApiOperation({
            summary: 'List pending notifications for current user (email channel)',
            description:
                'Lists not-yet-sent email reminders for events owned by current user',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Pending notifications retrieved successfully',
            schema: {
                example: SwaggerExamples.Notification.Pending.response,
            },
        }),
    );
