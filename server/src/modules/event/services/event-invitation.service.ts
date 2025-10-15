import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { DatabaseService } from '../../../database/database.service';
import { EmailService } from '../../email/services/email.service';
import { MessageService } from '../../../common/message/message.service';
import { Event } from '../event';
import { EventAttendee } from '../event';

// Ensure DatabaseService is properly injected
interface InvitationResponse {
  eventId: string;
  attendeeEmail: string;
  responseStatus: 'accepted' | 'declined' | 'tentative';
  addedToCalendar?: boolean;
  googleEventId?: string;
}

interface SendInvitationOptions {
  event: Event;
  attendee: EventAttendee;
  organizerName: string;
  organizerEmail: string;
  organizerAvatar?: string;
  showAttendees?: boolean;
  customMessage?: string;
}

@Injectable()
export class EventInvitationService {
  private readonly logger = new Logger(EventInvitationService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly emailService: EmailService,
    private readonly messageService: MessageService,
  ) {
    if (!this.db) {
      this.logger.error('❌ DatabaseService is not injected!');
      throw new Error('DatabaseService dependency injection failed');
    }
    this.logger.log('✅ EventInvitationService initialized with DatabaseService');
  }

  private generateInvitationToken(): string {
    return randomBytes(32).toString('hex');
  }

  async createInvitationToken(
    eventId: string,
    attendeeEmail: string,
  ): Promise<string> {
    try {
      this.logger.log(`Creating invitation token for event: ${eventId}, attendee: ${attendeeEmail}`);
      
      if (!this.db) {
        throw new Error('DatabaseService is undefined');
      }
      if (typeof this.db.query !== 'function') {
        throw new Error('DatabaseService.query is not a function');
      }

      const existing = await this.db.query(
        `SELECT invitation_token FROM event_attendees 
         WHERE event_id = $1 AND email = $2`,
        [eventId, attendeeEmail],
      );

      if (existing.rows.length > 0 && existing.rows[0].invitation_token) {
        this.logger.log(`Using existing invitation token`);
        return existing.rows[0].invitation_token;
      }

      const token = this.generateInvitationToken();
      this.logger.log(`Generated new invitation token`);

      await this.db.query(
        `UPDATE event_attendees 
         SET invitation_token = $1, invitation_sent_at = NOW()
         WHERE event_id = $2 AND email = $3`,
        [token, eventId, attendeeEmail],
      );

      this.logger.log(`Invitation token saved successfully`);
      return token;
    } catch (error) {
      this.logger.error(
        `Failed to create invitation token for event ${eventId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create invitation token: ${error.message}`,
      );
    }
  }

  async sendInvitation(
    options: SendInvitationOptions,
    userId: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const { event, attendee, organizerName, organizerEmail, organizerAvatar, showAttendees } = options;

    try {
      const token = await this.createInvitationToken(event.id, attendee.email);

      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const acceptUrl = `${baseUrl}/invitation/respond?token=${token}&action=accept`;
      const declineUrl = `${baseUrl}/invitation/respond?token=${token}&action=decline`;
      const tentativeUrl = `${baseUrl}/invitation/respond?token=${token}&action=tentative`;
      const viewEventUrl = `${baseUrl}/dashboard/calendar?event=${event.id}`;
      
      const addToCalendarUrl = this.generateGoogleCalendarLink(event);

      let attendeesList: any[] = [];
      if (showAttendees && event.attendees) {
        attendeesList = event.attendees
          .filter(a => a.email !== attendee.email)
          .map(a => ({
            email: a.email,
            name: a.name,
            responseStatus: a.response_status,
          }));
      }

      const startTime = new Date(event.start_time);
      const endTime = new Date(event.end_time);
      const eventStartTime = this.formatDateTime(startTime);
      const eventEndTime = this.formatDateTime(endTime);

      const organizerInitials = organizerName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const result = await this.emailService.sendEmail(
        {
          to: attendee.email,
          subject: `📅 Lời mời: ${event.title}`,
          template: 'event-invitation',
          context: {
            guestName: attendee.name || attendee.email.split('@')[0],
            organizerName,
            organizerEmail,
            organizerAvatar,
            organizerInitials,
            eventTitle: event.title,
            eventDescription: event.description,
            eventLocation: event.location,
            eventStartTime,
            eventEndTime,
            conferenceUrl: event.conference_data?.url,
            acceptUrl,
            declineUrl,
            tentativeUrl,
            viewEventUrl,
            addToCalendarUrl,
            showAttendees,
            attendees: attendeesList,
            attendeeCount: (event.attendees?.length || 0),
            appUrl: baseUrl,
          },
        },
        userId,
      );

      if (result.success) {
        await this.db.query(
          `UPDATE event_attendees 
           SET invitation_remind_count = invitation_remind_count + 1,
               invitation_sent_at = NOW()
           WHERE event_id = $1 AND email = $2`,
          [event.id, attendee.email],
        );

        this.logger.log(
          `Invitation sent successfully to ${attendee.email} for event ${event.id}`,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send invitation to ${attendee.email}: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendBulkInvitations(
    event: Event,
    attendees: EventAttendee[],
    userId: string,
    organizerName: string,
    organizerEmail: string,
    organizerAvatar?: string,
    showAttendees = true,
  ): Promise<{ sent: number; failed: number; results: any[] }> {
    const results: Array<{
      email: string;
      success: boolean;
      messageId?: string;
      error?: string;
    }> = [];
    let sent = 0;
    let failed = 0;

    this.logger.log(`📧 sendBulkInvitations - Processing ${attendees.length} attendees for event ${event.id}`);

    for (const attendee of attendees) {
      this.logger.debug(`📧 Processing attendee:`, {
        email: attendee.email,
        name: attendee.name,
        is_organizer: attendee.is_organizer,
        organizerEmail,
      });

      if (attendee.email.toLowerCase() === organizerEmail.toLowerCase()) {
        this.logger.debug(`⏭️ Skipping organizer (email match): ${attendee.email}`);
        continue;
      }

      const result = await this.sendInvitation(
        {
          event,
          attendee,
          organizerName,
          organizerEmail,
          organizerAvatar,
          showAttendees,
        },
        userId,
      );

      results.push({
        email: attendee.email,
        success: result.success,
        messageId: result.messageId,
        error: result.error,
      });

      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    this.logger.log(
      `✅ Bulk invitation complete for event ${event.id}: ${sent} sent, ${failed} failed out of ${attendees.length} attendees`,
    );

    if (sent === 0 && attendees.length > 0) {
      this.logger.warn(`⚠️ No invitations sent! All ${attendees.length} attendees may be marked as organizers`);
    }

    return { sent, failed, results };
  }

  async respondToInvitation(
    token: string,
    action: 'accept' | 'decline' | 'tentative',
    comment?: string,
  ): Promise<InvitationResponse> {
    try {
      const result = await this.db.query(
        `SELECT ea.*, e.* 
         FROM event_attendees ea
         JOIN events e ON e.id = ea.event_id
         WHERE ea.invitation_token = $1`,
        [token],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException('Invalid or expired invitation token');
      }

      const attendee = result.rows[0];
      const eventId = attendee.event_id;
      const attendeeEmail = attendee.email;

      const eventEndTime = new Date(attendee.end_time);
      if (eventEndTime < new Date()) {
        throw new BadRequestException('This event has already ended');
      }

      const statusMap = {
        accept: 'accepted',
        decline: 'declined',
        tentative: 'tentative',
      };
      const responseStatus = statusMap[action];

      await this.db.query(
        `UPDATE event_attendees 
         SET response_status = $1,
             comment = $2,
             invitation_responded_at = NOW()
         WHERE event_id = $3 AND email = $4`,
        [responseStatus, comment, eventId, attendeeEmail],
      );

      this.logger.log(
        `Invitation response: ${attendeeEmail} ${action}ed event ${eventId}`,
      );

      return {
        eventId,
        attendeeEmail,
        responseStatus: responseStatus as any,
      };
    } catch (error) {
      this.logger.error(
        `Failed to respond to invitation: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getInvitationByToken(token: string): Promise<any> {
    try {
      const result = await this.db.query(
        `SELECT 
          e.*,
          ea.email as attendee_email,
          ea.name as attendee_name,
          ea.response_status,
          ea.is_optional,
          ea.comment,
          u.first_name || ' ' || u.last_name as organizer_name,
          u.email as organizer_email,
          u.avatar as organizer_avatar
         FROM event_attendees ea
         JOIN events e ON e.id = ea.event_id
         LEFT JOIN users u ON u.id = e.organizer_id
         WHERE ea.invitation_token = $1`,
        [token],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException('Invalid or expired invitation token');
      }

      return result.rows[0];
    } catch (error) {
      this.logger.error(
        `Failed to get invitation: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private generateGoogleCalendarLink(event: Event): string {
    const formatDateForGoogle = (date: Date | string) => {
      const d = new Date(date);
      return d.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const startTime = formatDateForGoogle(event.start_time);
    const endTime = formatDateForGoogle(event.end_time);

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${startTime}/${endTime}`,
      details: event.description || '',
      location: event.location || '',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  private formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(date);
  }

  async sendReminders(
    eventId: string,
    userId: string,
  ): Promise<{ sent: number; failed: number }> {
    try {
      const eventResult = await this.db.query(
        `SELECT e.*, 
          u.first_name || ' ' || u.last_name as organizer_name,
          u.email as organizer_email,
          u.avatar as organizer_avatar
         FROM events e
         LEFT JOIN users u ON u.id = e.organizer_id
         WHERE e.id = $1 AND e.organizer_id = $2`,
        [eventId, userId],
      );

      if (eventResult.rows.length === 0) {
        throw new NotFoundException('Event not found');
      }

      const event = eventResult.rows[0];

      // Get pending attendees
      const attendeesResult = await this.db.query(
        `SELECT * FROM event_attendees 
         WHERE event_id = $1 
         AND response_status = 'needsAction'
         AND is_organizer = false`,
        [eventId],
      );

      const attendees = attendeesResult.rows;

      if (attendees.length === 0) {
        return { sent: 0, failed: 0 };
      }

      const result = await this.sendBulkInvitations(
        event as Event,
        attendees,
        userId,
        event.organizer_name,
        event.organizer_email,
        event.organizer_avatar,
      );

      return { sent: result.sent, failed: result.failed };
    } catch (error) {
      this.logger.error(
        `Failed to send reminders: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
