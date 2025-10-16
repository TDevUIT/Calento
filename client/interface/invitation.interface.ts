// Invitation Response Interfaces
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

// Request DTOs
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

export interface SendRemindersResponse {
  sent: number;
  failed: number;
}

export interface RespondToInvitationRequest {
  action: 'accept' | 'decline' | 'tentative';
  comment?: string;
  addToCalento?: boolean;
}

// Google Calendar Event Interface
export interface GoogleCalendarEvent {
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
}

// API Response Types
export interface InvitationDetailsResponse {
  success: boolean;
  data: InvitationDetails;
  message?: string;
}

export interface SendInvitationsApiResponse {
  success: boolean;
  data: SendInvitationsResponse;
  message?: string;
}

export interface SendRemindersApiResponse {
  success: boolean;
  data: SendRemindersResponse;
  message?: string;
}

export interface RespondToInvitationApiResponse {
  success: boolean;
  data: InvitationResponse;
  message?: string;
}

// Invitation Status Types
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'tentative';

export type InvitationAction = 'accept' | 'decline' | 'tentative';
