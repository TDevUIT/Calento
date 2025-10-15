import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  HttpStatus,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
  CreateEventDto,
  UpdateEventDto,
  PartialUpdateEventDto,
  EventResponseDto,
  RecurringEventsQueryDto,
} from './dto/events.dto';
import { MessageService } from '../../common/message/message.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  SuccessResponseDto,
  PaginatedResponseDto,
} from '../../common/dto/base-response.dto';
import { EventQueryDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';

@ApiTags('Events')
@ApiExtraModels(
  EventResponseDto,
  CreateEventDto,
  UpdateEventDto,
  PartialUpdateEventDto,
  SuccessResponseDto,
  PaginatedResponseDto,
)
@Controller('events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
@ApiCookieAuth('cookie')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly messageService: MessageService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '📅 Get user events with pagination and date filtering',
    description: 'Retrieve paginated list of events with date range filtering, calendar filtering, and search',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Events retrieved successfully with pagination metadata',
    schema: {
      example: SwaggerExamples.Events.List.response,
    },
  })
  @ApiResponse({
    status: 401,
    description: '❌ Unauthorized - Invalid or expired token',
    schema: {
      example: SwaggerExamples.Errors.Unauthorized,
    },
  })
  async getEvents(
    @CurrentUserId() userId: string,
    @Query() query: EventQueryDto,
  ): Promise<PaginatedResponseDto> {
    const result = await this.eventService.getEvents(userId, query);

    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      result.data,
      result.meta,
    );
  }

  @Post()
  @ApiOperation({
    summary: '➕ Create a new event',
    description:
      'Create a new calendar event with validation and RRULE support',
  })
  @ApiResponse({
    status: 201,
    description: '✅ Event created successfully',
    schema: {
      example: SwaggerExamples.Events.Create.response,
    },
  })
  @ApiResponse({
    status: 400,
    description: '❌ Validation failed - Invalid input data',
    schema: {
      example: SwaggerExamples.Errors.ValidationError,
    },
  })
  @ApiResponse({
    status: 401,
    description: '❌ Unauthorized - Invalid or expired token',
    schema: {
      example: SwaggerExamples.Errors.Unauthorized,
    },
  })
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const event = await this.eventService.createEvent(createEventDto, userId);

    return new SuccessResponseDto(
      this.messageService.get('calendar.event_created'),
      event,
      HttpStatus.CREATED,
    );
  }

  @Get('recurring/expand')
  @ApiOperation({
    summary: '🔄 Expand recurring events',
    description:
      'Expand recurring events into individual occurrences within a specified date range using RRULE',
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: '❌ Invalid date range or parameters',
    schema: {
      example: SwaggerExamples.Errors.ValidationError,
    },
  })
  @ApiResponse({
    status: 401,
    description: '❌ Unauthorized - Invalid or expired token',
    schema: {
      example: SwaggerExamples.Errors.Unauthorized,
    },
  })
  async expandRecurringEvents(
    @CurrentUserId() userId: string,
    @Query() query: RecurringEventsQueryDto,
  ): Promise<PaginatedResponseDto> {
    const { start_date, end_date, max_occurrences = 100, ...paginationOptions } = query;
    const result = await this.eventService.expandRecurringEvents(
      userId,
      new Date(start_date),
      new Date(end_date),
      max_occurrences,
      paginationOptions,
    );

    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      result.data,
      result.meta,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: '📖 Get event by ID',
    description: 'Retrieve a specific event by its ID',
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 404,
    description: '❌ Event not found',
    schema: {
      example: {
        success: false,
        message: 'Event not found',
        timestamp: '2024-01-15T10:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '❌ Unauthorized - Invalid or expired token',
    schema: {
      example: SwaggerExamples.Errors.Unauthorized,
    },
  })
  async getEventById(
    @Param('id') eventId: string,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const event = await this.eventService.getEventById(eventId, userId);

    if (!event) {
      throw new NotFoundException(
        this.messageService.get('calendar.event_not_found'),
      );
    }

    return new SuccessResponseDto(
      this.messageService.get('success.retrieved'),
      event,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: '🔄 Replace event (PUT)',
    description: 'Replace an existing event with new data. All fields are required except optional ones.',
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: '❌ Validation failed - Invalid input data',
    schema: {
      example: SwaggerExamples.Errors.ValidationError,
    },
  })
  @ApiResponse({
    status: 404,
    description: '❌ Event not found',
  })
  @ApiResponse({
    status: 401,
    description: '❌ Unauthorized - Invalid or expired token',
    schema: {
      example: SwaggerExamples.Errors.Unauthorized,
    },
  })
  async replaceEvent(
    @Param('id') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const existingEvent = await this.eventService.getEventById(eventId, userId);
    const googleEventId = existingEvent?.google_event_id;

    const event = await this.eventService.replaceEvent(
      eventId,
      updateEventDto,
      userId,
      googleEventId,
    );

    return new SuccessResponseDto(
      this.messageService.get('calendar.event_updated'),
      event,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: '✏️ Update event (PATCH)',
    description: 'Partially update an existing event. Only provided fields will be updated.',
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: '❌ Validation failed - Invalid input data',
    schema: {
      example: SwaggerExamples.Errors.ValidationError,
    },
  })
  @ApiResponse({
    status: 404,
    description: '❌ Event not found',
  })
  @ApiResponse({
    status: 401,
    description: '❌ Unauthorized - Invalid or expired token',
    schema: {
      example: SwaggerExamples.Errors.Unauthorized,
    },
  })
  async updateEvent(
    @Param('id') eventId: string,
    @Body() partialUpdateEventDto: PartialUpdateEventDto,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const existingEvent = await this.eventService.getEventById(eventId, userId);
    const googleEventId = existingEvent?.google_event_id;

    const event = await this.eventService.updateEvent(
      eventId,
      partialUpdateEventDto,
      userId,
      googleEventId,
    );

    return new SuccessResponseDto(
      this.messageService.get('calendar.event_updated'),
      event,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: '🗑️ Delete event',
    description: 'Delete an event by its ID',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Event deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'Event deleted successfully',
        data: { deleted: true },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '❌ Event not found',
  })
  @ApiResponse({
    status: 401,
    description: '❌ Unauthorized - Invalid or expired token',
    schema: {
      example: SwaggerExamples.Errors.Unauthorized,
    },
  })
  async deleteEvent(
    @Param('id') eventId: string,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const existingEvent = await this.eventService.getEventById(eventId, userId);
    const googleEventId = existingEvent?.google_event_id;

    const deleted = await this.eventService.deleteEvent(
      eventId,
      userId,
      googleEventId,
    );

    if (!deleted) {
      throw new NotFoundException(
        this.messageService.get('calendar.event_not_found'),
      );
    }

    return new SuccessResponseDto(
      this.messageService.get('calendar.event_deleted'),
      { deleted: true },
    );
  }


  @Post('sync-attendees')
  @ApiOperation({
    summary: '🔄 Sync all event attendees to database',
    description: 'One-time migration to sync attendees from events.attendees JSONB to event_attendees table',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Attendees synced successfully',
  })
  async syncAllEventAttendees(
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const result = await this.eventService.syncAllEventAttendeesToDatabase(userId);
    return new SuccessResponseDto(
      'Attendees synced successfully',
      result,
    );
  }

  @Post(':id/invitations/send')
  @ApiOperation({
    summary: '📧 Send invitations to event attendees',
    description: 'Send email invitations to all or specific attendees of an event',
  })
  @ApiResponse({
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
  })
  async sendInvitations(
    @Param('id') eventId: string,
    @CurrentUserId() userId: string,
    @Body() body?: { emails?: string[]; showAttendees?: boolean },
  ): Promise<SuccessResponseDto> {
    const result = await this.eventService.sendEventInvitations(
      eventId,
      userId,
      body?.emails,
      body?.showAttendees ?? true,
    );
    return new SuccessResponseDto(
      this.messageService.get('invitation.sent_successfully') || 'Invitations sent successfully',
      result,
    );
  }

  @Post(':id/invitations/remind')
  @ApiOperation({
    summary: '🔔 Send reminders to pending attendees',
    description: 'Send reminder emails to attendees who haven\'t responded yet',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Reminders sent successfully',
  })
  async sendReminders(
    @Param('id') eventId: string,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const result = await this.eventService.sendInvitationReminders(eventId, userId);
    return new SuccessResponseDto(
      this.messageService.get('invitation.reminders_sent') || 'Reminders sent successfully',
      result,
    );
  }

  @Get('invitation/:token')
  @ApiOperation({
    summary: '🔍 Get invitation details by token',
    description: 'Retrieve event details and invitation info using invitation token',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Invitation details retrieved',
  })
  async getInvitationDetails(
    @Param('token') token: string,
  ): Promise<SuccessResponseDto> {
    const invitation = await this.eventService.getInvitationDetails(token);
    return new SuccessResponseDto(
      this.messageService.get('invitation.details_retrieved') || 'Invitation details retrieved',
      invitation,
    );
  }

  @Post('invitation/:token/respond')
  @ApiOperation({
    summary: '✅ Respond to event invitation',
    description: 'Accept, decline, or tentatively accept an event invitation',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Response recorded successfully',
  })
  async respondToInvitation(
    @Param('token') token: string,
    @Body() body: { action: 'accept' | 'decline' | 'tentative'; comment?: string },
  ): Promise<SuccessResponseDto> {
    const result = await this.eventService.respondToInvitation(
      token,
      body.action,
      body.comment,
    );
    return new SuccessResponseDto(
      this.messageService.get('invitation.response_recorded') || 'Response recorded successfully',
      result,
    );
  }
}
