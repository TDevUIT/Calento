import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';

export const ApiGetEvents = () =>
    applyDecorators(
        ApiOperation({
            summary: '📅 Get user events with pagination and date filtering',
            description:
                'Retrieve paginated list of events with date range filtering, calendar filtering, and search',
        }),
        ApiResponse({
            status: 200,
            description: '✅ Events retrieved successfully with pagination metadata',
            schema: {
                example: SwaggerExamples.Events.List.response,
            },
        }),
        ApiResponse({
            status: 401,
            description: '❌ Unauthorized - Invalid or expired token',
            schema: {
                example: SwaggerExamples.Errors.Unauthorized,
            },
        }),
    );

export const ApiCreateEvent = () =>
    applyDecorators(
        ApiOperation({
            summary: '➕ Create a new event',
            description:
                'Create a new calendar event with validation and RRULE support',
        }),
        ApiResponse({
            status: 201,
            description: '✅ Event created successfully',
            schema: {
                example: SwaggerExamples.Events.Create.response,
            },
        }),
        ApiResponse({
            status: 400,
            description: '❌ Validation failed - Invalid input data',
            schema: {
                example: SwaggerExamples.Errors.ValidationError,
            },
        }),
        ApiResponse({
            status: 401,
            description: '❌ Unauthorized - Invalid or expired token',
            schema: {
                example: SwaggerExamples.Errors.Unauthorized,
            },
        }),
    );

export const ApiExpandRecurringEvents = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔄 Expand recurring events',
            description:
                'Expand recurring events into individual occurrences within a specified date range using RRULE',
        }),
        ApiResponse({
            status: 200,
            description:
                '✅ Recurring events expanded successfully with all occurrences in date range',
            schema: {
                example: {
                    success: true,
                    message: 'Recurring events retrieved successfully',
                    data: [
                        {
                            id: 'event-123_occurrence_0',
                            original_event_id: 'event-123',
                            occurrence_index: 0,
                            title: 'Weekly Team Meeting',
                            start_time: '2024-01-08T10:00:00Z',
                            end_time: '2024-01-08T11:00:00Z',
                            is_recurring_instance: true,
                            recurrence_rule: 'FREQ=WEEKLY;BYDAY=MO',
                        },
                        {
                            id: 'event-123_occurrence_1',
                            original_event_id: 'event-123',
                            occurrence_index: 1,
                            title: 'Weekly Team Meeting',
                            start_time: '2024-01-15T10:00:00Z',
                            end_time: '2024-01-15T11:00:00Z',
                            is_recurring_instance: true,
                            recurrence_rule: 'FREQ=WEEKLY;BYDAY=MO',
                        },
                    ],
                    meta: {
                        page: 1,
                        limit: 10,
                        total: 4,
                        totalPages: 1,
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: '❌ Invalid date range or parameters',
            schema: {
                example: SwaggerExamples.Errors.ValidationError,
            },
        }),
        ApiResponse({
            status: 401,
            description: '❌ Unauthorized - Invalid or expired token',
            schema: {
                example: SwaggerExamples.Errors.Unauthorized,
            },
        }),
    );

export const ApiGetEventById = () =>
    applyDecorators(
        ApiOperation({
            summary: '📖 Get event by ID',
            description: 'Retrieve a specific event by its ID',
        }),
        ApiParam({ name: 'id', description: 'Event ID' }),
        ApiResponse({
            status: 200,
            description: '✅ Event retrieved successfully',
            schema: {
                example: {
                    success: true,
                    message: 'Event retrieved successfully',
                    data: {
                        id: '2d2e6a3d-63e6-4d87-b949-c8383d637766',
                        calendar_id: '123e4567-e89b-12d3-a456-426614174000',
                        user_id: '456e7890-e89b-12d3-a456-426614174001',
                        title: 'Team Meeting',
                        description: 'Weekly team sync',
                        start_time: '2024-01-15T10:00:00Z',
                        end_time: '2024-01-15T11:00:00Z',
                        status: 'confirmed',
                        color: 'blue',
                        location: 'Conference Room A',
                        is_all_day: false,
                        created_at: '2024-01-15T10:00:00Z',
                        updated_at: '2024-01-15T10:00:00Z',
                    },
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: '❌ Event not found',
            schema: {
                example: {
                    success: false,
                    message: 'Event not found',
                    timestamp: '2024-01-15T10:00:00Z',
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: '❌ Unauthorized - Invalid or expired token',
            schema: {
                example: SwaggerExamples.Errors.Unauthorized,
            },
        }),
    );

export const ApiReplaceEvent = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔄 Replace event (PUT)',
            description:
                'Replace an existing event with new data. All fields are required except optional ones.',
        }),
        ApiParam({ name: 'id', description: 'Event ID' }),
        ApiResponse({
            status: 200,
            description: '✅ Event replaced successfully',
            schema: {
                example: {
                    success: true,
                    message: 'Event updated successfully',
                    data: {
                        id: '2d2e6a3d-63e6-4d87-b949-c8383d637766',
                        title: 'Updated Team Meeting',
                        description: 'Updated description',
                        start_time: '2024-01-15T10:30:00Z',
                        end_time: '2024-01-15T11:30:00Z',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: '❌ Validation failed - Invalid input data',
            schema: {
                example: SwaggerExamples.Errors.ValidationError,
            },
        }),
        ApiResponse({
            status: 404,
            description: '❌ Event not found',
        }),
        ApiResponse({
            status: 401,
            description: '❌ Unauthorized - Invalid or expired token',
            schema: {
                example: SwaggerExamples.Errors.Unauthorized,
            },
        }),
    );

export const ApiUpdateEvent = () =>
    applyDecorators(
        ApiOperation({
            summary: '✏️ Update event (PATCH)',
            description:
                'Partially update an existing event. Only provided fields will be updated.',
        }),
        ApiParam({ name: 'id', description: 'Event ID' }),
        ApiResponse({
            status: 200,
            description: '✅ Event updated successfully',
            schema: {
                example: {
                    success: true,
                    message: 'Event updated successfully',
                    data: {
                        id: '2d2e6a3d-63e6-4d87-b949-c8383d637766',
                        title: 'Updated Team Meeting',
                        description: 'Updated description',
                        start_time: '2024-01-15T10:30:00Z',
                        end_time: '2024-01-15T11:30:00Z',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: '❌ Validation failed - Invalid input data',
            schema: {
                example: SwaggerExamples.Errors.ValidationError,
            },
        }),
        ApiResponse({
            status: 404,
            description: '❌ Event not found',
        }),
        ApiResponse({
            status: 401,
            description: '❌ Unauthorized - Invalid or expired token',
            schema: {
                example: SwaggerExamples.Errors.Unauthorized,
            },
        }),
    );

export const ApiDeleteEvent = () =>
    applyDecorators(
        ApiOperation({
            summary: '🗑️ Delete event',
            description: 'Delete an event by its ID',
        }),
        ApiParam({ name: 'id', description: 'Event ID' }),
        ApiResponse({
            status: 200,
            description: '✅ Event deleted successfully',
            schema: {
                example: {
                    success: true,
                    message: 'Event deleted successfully',
                    data: { deleted: true },
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: '❌ Event not found',
        }),
        ApiResponse({
            status: 401,
            description: '❌ Unauthorized - Invalid or expired token',
            schema: {
                example: SwaggerExamples.Errors.Unauthorized,
            },
        }),
    );

export const ApiSyncAttendees = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔄 Sync all event attendees to database',
            description:
                'One-time migration to sync attendees from events.attendees JSONB to event_attendees table',
        }),
        ApiResponse({
            status: 200,
            description: '✅ Attendees synced successfully',
        }),
    );

export const ApiSendInvitations = () =>
    applyDecorators(
        ApiOperation({
            summary: '📧 Send invitations to event attendees',
            description:
                'Send email invitations to all or specific attendees of an event',
        }),
        ApiParam({ name: 'id', description: 'Event ID' }),
        ApiResponse({
            status: 200,
            description: '✅ Invitations sent successfully',
            schema: {
                example: {
                    success: true,
                    message: 'Invitations sent successfully',
                    data: {
                        sent: 5,
                        failed: 0,
                        results: [
                            { email: 'guest@example.com', success: true, messageId: 'msg-id' },
                        ],
                    },
                },
            },
        }),
    );

export const ApiSendReminders = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔔 Send reminders to pending attendees',
            description: "Send reminder emails to attendees who haven't responded yet",
        }),
        ApiParam({ name: 'id', description: 'Event ID' }),
        ApiResponse({
            status: 200,
            description: '✅ Reminders sent successfully',
        }),
    );

export const ApiGetInvitationDetails = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔍 Get invitation details by token',
            description:
                'Retrieve event details and invitation info using invitation token',
        }),
        ApiParam({ name: 'token', description: 'Invitation Token' }),
        ApiResponse({
            status: 200,
            description: '✅ Invitation details retrieved',
        }),
    );

export const ApiRespondToInvitation = () =>
    applyDecorators(
        ApiOperation({
            summary: '✅ Respond to event invitation',
            description: 'Accept, decline, or tentatively accept an event invitation',
        }),
        ApiParam({ name: 'token', description: 'Invitation Token' }),
        ApiResponse({
            status: 200,
            description: '✅ Response recorded successfully',
        }),
    );
