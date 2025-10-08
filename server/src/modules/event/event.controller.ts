import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
  CreateEventDto,
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
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';

@ApiTags('Events')
@ApiExtraModels(
  EventResponseDto,
  CreateEventDto,
  SuccessResponseDto,
  PaginatedResponseDto,
)
@Controller('calendar')
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
    summary: '📅 Get user events with pagination',
    description: 'Retrieve paginated list of events with filtering and search',
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
    @Query() query: PaginationQueryDto,
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
    @Query() recurringQuery: RecurringEventsQueryDto,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto> {
    const { start_date, end_date, max_occurrences = 100 } = recurringQuery;
    const result = await this.eventService.expandRecurringEvents(
      userId,
      new Date(start_date),
      new Date(end_date),
      max_occurrences,
      paginationQuery,
    );

    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      result.data,
      result.meta,
    );
  }
}
