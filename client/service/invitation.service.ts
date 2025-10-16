import api from '@/config/axios';
import type { ApiResponse } from '@/interface/api-response.interface';

export interface InvitationResponse {
  success: boolean;
  message: string;
  eventAddedToCalendar: boolean;
  needsSignup?: boolean;
  icsFileUrl?: string;
}

export interface InvitationDetails {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  attendee_email: string;
  attendee_name?: string;
  response_status: string;
  is_optional: boolean;
  comment?: string;
  organizer_name: string;
  organizer_email: string;
  organizer_avatar?: string;
}

export interface SendInvitationsRequest {
  emails?: string[];
  showAttendees?: boolean;
}

export interface SendInvitationsResponse {
  sent: number;
  failed: number;
  results: {
    email: string;
    success: boolean;
    messageId?: string;
    error?: string;
  }[];
}

export class InvitationService {
  static async sendInvitations(
    eventId: string,
    data?: SendInvitationsRequest,
  ): Promise<ApiResponse<SendInvitationsResponse>> {
    const response = await api.post(
      `/events/${eventId}/invitations/send`,
      data,
    );
    return response.data;
  }

  static async sendReminders(
    eventId: string,
  ): Promise<ApiResponse<{ sent: number; failed: number }>> {
    const response = await api.post(
      `/events/${eventId}/invitations/remind`,
    );
    return response.data;
  }

  static async getInvitationDetails(
    token: string,
  ): Promise<ApiResponse<InvitationDetails>> {
    const response = await api.get(`/events/invitation/${token}`);
    return response.data;
  }

  static async respondToInvitation(
    token: string,
    action: 'accept' | 'decline' | 'tentative',
    comment?: string,
    addToCalento?: boolean,
  ): Promise<ApiResponse<InvitationResponse>> {
    const response = await api.post(
      `/events/invitation/${token}/respond`,
      { action, comment, addToCalento },
    );
    return response.data;
  }

  static generateGoogleCalendarLink(event: {
    title: string;
    description?: string;
    location?: string;
    start_time: string;
    end_time: string;
  }): string {
    const formatDateForGoogle = (date: string) => {
      return new Date(date)
        .toISOString()
        .replace(/-|:|\.\d+/g, '');
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
}
