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
  ApiBearerAuth,
  ApiCookieAuth,
  ApiExtraModels,
}
  from '@nestjs/swagger';
import {
  SuccessResponseDto,
  PaginatedResponseDto,
} from '../../common/dto/base-response.dto';
import { EventQueryDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import {
  ApiGetEvents,
  ApiCreateEvent,
  ApiExpandRecurringEvents,
  ApiGetEventById,
  ApiReplaceEvent,
  ApiUpdateEvent,
  ApiDeleteEvent,
  ApiSyncAttendees,
  ApiSendInvitations,
  ApiSendReminders,
  ApiGetInvitationDetails,
  ApiRespondToInvitation,
} from './event.swagger';

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
  ) { }

  @Get()
  @ApiGetEvents()
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
  @ApiCreateEvent()
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
  @ApiExpandRecurringEvents()
  async expandRecurringEvents(
    @CurrentUserId() userId: string,
    @Query() query: RecurringEventsQueryDto,
  ): Promise<PaginatedResponseDto> {
    const {
      start_date,
      end_date,
      max_occurrences = 100,
      ...paginationOptions
    } = query;
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
  @ApiGetEventById()
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
  @ApiReplaceEvent()
  async replaceEvent(
    @Param('id') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const existingEvent = await this.eventService.getEventById(eventId, userId);

    if (!existingEvent) {
      throw new NotFoundException(
        this.messageService.get('calendar.event_not_found'),
      );
    }

    const googleEventId = existingEvent.google_event_id;

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
  @ApiUpdateEvent()
  async updateEvent(
    @Param('id') eventId: string,
    @Body() partialUpdateEventDto: PartialUpdateEventDto,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const existingEvent = await this.eventService.getEventById(eventId, userId);

    if (!existingEvent) {
      throw new NotFoundException(
        this.messageService.get('calendar.event_not_found'),
      );
    }

    const googleEventId = existingEvent.google_event_id;

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
  @ApiDeleteEvent()
  async deleteEvent(
    @Param('id') eventId: string,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const existingEvent = await this.eventService.getEventById(eventId, userId);

    if (!existingEvent) {
      throw new NotFoundException(
        this.messageService.get('calendar.event_not_found'),
      );
    }

    const googleEventId = existingEvent.google_event_id;

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
  @ApiSyncAttendees()
  async syncAllEventAttendees(
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const result =
      await this.eventService.syncAllEventAttendeesToDatabase(userId);
    return new SuccessResponseDto('Attendees synced successfully', result);
  }

  @Post(':id/invitations/send')
  @ApiSendInvitations()
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
      this.messageService.get('invitation.sent_successfully') ||
      'Invitations sent successfully',
      result,
    );
  }

  @Post(':id/invitations/remind')
  @ApiSendReminders()
  async sendReminders(
    @Param('id') eventId: string,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const result = await this.eventService.sendInvitationReminders(
      eventId,
      userId,
    );
    return new SuccessResponseDto(
      this.messageService.get('invitation.reminders_sent') ||
      'Reminders sent successfully',
      result,
    );
  }

  @Get('invitation/:token')
  @ApiGetInvitationDetails()
  async getInvitationDetails(
    @Param('token') token: string,
  ): Promise<SuccessResponseDto> {
    const invitation = await this.eventService.getInvitationDetails(token);
    return new SuccessResponseDto(
      this.messageService.get('invitation.details_retrieved') ||
      'Invitation details retrieved',
      invitation,
    );
  }

  @Post('invitation/:token/respond')
  @ApiRespondToInvitation()
  async respondToInvitation(
    @Param('token') token: string,
    @Body()
    body: { action: 'accept' | 'decline' | 'tentative'; comment?: string },
  ): Promise<SuccessResponseDto> {
    const result = await this.eventService.respondToInvitation(
      token,
      body.action,
      body.comment,
    );
    return new SuccessResponseDto(
      this.messageService.get('invitation.response_recorded') ||
      'Response recorded successfully',
      result,
    );
  }
}
