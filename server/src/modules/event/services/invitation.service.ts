import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventRepository } from '../event.repository';
import { 
  InvitationResponseStatus, 
  RespondToInvitationDto, 
  InvitationResponseDto 
} from '../dto/invitation.dto';
import * as ics from 'ics';
import { EventAttributes, EventStatus } from 'ics';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class InvitationService {
  private readonly logger = new Logger(InvitationService.name);

  constructor(
    private readonly eventRepository: EventRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async respondToInvitation(
    eventId: string,
    invitationToken: string,
    dto: RespondToInvitationDto,
    userId?: string,
  ): Promise<InvitationResponseDto> {
    this.logger.log(`Processing invitation response for event ${eventId}`);

    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const isAuthenticatedUser = !!userId;
    if (isAuthenticatedUser) {
      return await this.handleAuthenticatedUserResponse(
        eventId,
        userId,
        dto.responseStatus,
        event,
        dto.addToCalento ?? false,
      );
    } else {
      if (!dto.guestEmail) {
        throw new Error('Guest email is required for non-authenticated users');
      }

      const guestEmail: string = dto.guestEmail;
      const guestName: string = dto.guestName || guestEmail.split('@')[0];

      return await this.handleGuestUserResponse(
        eventId,
        guestEmail,
        guestName,
        dto.responseStatus,
        event,
      );
    }
  }

  private async handleAuthenticatedUserResponse(
    eventId: string,
    userId: string,
    responseStatus: InvitationResponseStatus,
    originalEvent: any,
    addToCalento: boolean = false,
  ): Promise<InvitationResponseDto> {
    this.logger.log(`Authenticated user ${userId} responding to event ${eventId}`);

    await this.updateAttendeeStatus(eventId, userId, responseStatus);

    let eventAddedToCalendar = false;

    if (responseStatus === InvitationResponseStatus.ACCEPTED && addToCalento) {
      try {
        await this.createEventInUserCalendar(userId, originalEvent);
        eventAddedToCalendar = true;
        this.logger.log(`✨ Event added to Calento calendar for user ${userId}`);
      } catch (error) {
        this.logger.error(`Failed to add event to Calento calendar: ${error.message}`);
      }
    }

    if (originalEvent.organizer_id) {
      await this.notifyOrganizer(originalEvent.organizer_id, userId, responseStatus);
    }

    return {
      success: true,
      message: this.getResponseMessage(responseStatus, true),
      eventAddedToCalendar,
      needsSignup: false,
    };
  }

  private async handleGuestUserResponse(
    eventId: string,
    guestEmail: string,
    guestName: string,
    responseStatus: InvitationResponseStatus,
    originalEvent: any,
  ): Promise<InvitationResponseDto> {
    this.logger.log(`Guest user ${guestEmail} responding to event ${eventId}`);

    await this.recordGuestResponse(
      eventId,
      guestEmail,
      guestName,
      responseStatus,
    );

    let icsFileUrl: string | undefined;
    if (responseStatus === InvitationResponseStatus.ACCEPTED) {
      icsFileUrl = await this.generateICSFile(originalEvent, guestEmail);
    }

    if (originalEvent.organizer_id) {
      await this.notifyOrganizerGuest(
        originalEvent.organizer_id,
        guestEmail,
        guestName,
        responseStatus,
      );
    }

    if (responseStatus === InvitationResponseStatus.ACCEPTED && icsFileUrl) {
      await this.sendGuestWelcomeEmail(guestEmail, guestName, icsFileUrl);
    }

    return {
      success: true,
      message: this.getResponseMessage(responseStatus, false),
      eventAddedToCalendar: false,
      needsSignup: true,
      icsFileUrl,
    };
  }

  private async createEventInUserCalendar(
    userId: string,
    originalEvent: any,
  ): Promise<void> {
    const eventData = {
      user_id: userId,
      title: originalEvent.title,
      description: originalEvent.description,
      start_time: originalEvent.start_time,
      end_time: originalEvent.end_time,
      location: originalEvent.location,
      is_all_day: originalEvent.is_all_day,
      time_zone: originalEvent.time_zone,
      recurrence_rule: originalEvent.recurrence_rule,
      conference_data: originalEvent.conference_data,
      created_from_invitation: true,
      original_event_id: originalEvent.id,
      organizer_name: originalEvent.creator?.name,
      organizer_email: originalEvent.creator?.email,
    };

    await this.eventRepository.create(eventData);
    this.logger.log(`Event added to user ${userId}'s calendar`);
  }

  private async updateAttendeeStatus(
    eventId: string,
    userId: string,
    status: InvitationResponseStatus,
  ): Promise<void> {
    const query = `
      UPDATE event_attendees 
      SET response_status = $1, updated_at = NOW()
      WHERE event_id = $2 AND user_id = $3
    `;
    
    await this.databaseService.query(query, [status, eventId, userId]);
  }

  private async recordGuestResponse(
    eventId: string,
    guestEmail: string,
    guestName: string,
    status: InvitationResponseStatus,
  ): Promise<void> {
    const query = `
      INSERT INTO event_attendees (event_id, email, display_name, response_status, is_guest)
      VALUES ($1, $2, $3, $4, true)
      ON CONFLICT (event_id, email) 
      DO UPDATE SET response_status = $4, updated_at = NOW()
    `;
    
    await this.databaseService.query(query, [
      eventId,
      guestEmail,
      guestName,
      status,
    ]);
  }

  private async generateICSFile(
    event: any,
    guestEmail: string,
  ): Promise<string> {
    const icsEvent: EventAttributes = {
      start: this.parseDateTime(event.start_time),
      end: this.parseDateTime(event.end_time),
      title: event.title,
      description: event.description,
      location: event.location,
      url: event.conference_data?.entryPoints?.[0]?.uri,
      status: 'CONFIRMED' as EventStatus,
      organizer: {
        name: event.creator?.name,
        email: event.creator?.email,
      },
      attendees: [
        {
          name: guestEmail,
          email: guestEmail,
          rsvp: true,
        },
      ],
    };

    const { error, value } = ics.createEvent(icsEvent);
    
    if (error || !value) {
      this.logger.error('Error generating ICS file', error);
      throw new Error('Failed to generate calendar file');
    }

    const base64 = Buffer.from(value).toString('base64');
    return `data:text/calendar;base64,${base64}`;
  }

  private parseDateTime(dateString: string): [number, number, number, number, number] {
    const date = new Date(dateString);
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ];
  }

  private async notifyOrganizer(
    organizerId: string,
    attendeeId: string,
    status: InvitationResponseStatus,
  ): Promise<void> {
    this.logger.log(
      `Notifying organizer ${organizerId}: User ${attendeeId} ${status}`,
    );
  }

  private async notifyOrganizerGuest(
    organizerId: string,
    guestEmail: string,
    guestName: string,
    status: InvitationResponseStatus,
  ): Promise<void> {
    this.logger.log(
      `Notifying organizer ${organizerId}: Guest ${guestEmail} ${status}`,
    );
  }

  private async sendGuestWelcomeEmail(
    guestEmail: string,
    guestName: string,
    icsFileUrl: string,
  ): Promise<void> {
    this.logger.log(`Sending welcome email to guest ${guestEmail}`);
  }

  private getResponseMessage(
    status: InvitationResponseStatus,
    isAuthenticated: boolean,
  ): string {
    const messages = {
      [InvitationResponseStatus.ACCEPTED]: isAuthenticated
        ? 'Event added to your calendar! You will receive reminders.'
        : 'Response recorded! Check your email for calendar invite (.ics file).',
      [InvitationResponseStatus.DECLINED]: 'Response recorded. You will not attend this event.',
      [InvitationResponseStatus.TENTATIVE]: isAuthenticated
        ? 'Response recorded. Event marked as tentative in your calendar.'
        : 'Response recorded as tentative.',
    };

    return messages[status] || 'Response recorded.';
  }
}
