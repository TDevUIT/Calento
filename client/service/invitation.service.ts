import { api, getErrorMessage } from '../config/axios';
import { API_ROUTES } from '../constants/routes';
import {
  InvitationResponse,
  InvitationDetails,
  SendInvitationsRequest,
  SendInvitationsResponse,
  SendRemindersResponse,
  RespondToInvitationRequest,
  InvitationDetailsResponse,
  SendInvitationsApiResponse,
  SendRemindersApiResponse,
  RespondToInvitationApiResponse,
} from '../interface/invitation.interface';

// Re-export types for convenience
export type {
  InvitationResponse,
  InvitationDetails,
  SendInvitationsRequest,
  SendInvitationsResponse,
  SendRemindersResponse,
  RespondToInvitationRequest,
  GoogleCalendarEvent,
  InvitationAction,
} from '../interface/invitation.interface';

/**
 * Send invitations for an event
 */
export const sendInvitations = async (
  eventId: string,
  data?: SendInvitationsRequest
): Promise<SendInvitationsResponse> => {
  try {
    const response = await api.post<SendInvitationsApiResponse>(
      API_ROUTES.SEND_INVITATIONS(eventId),
      data,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Send reminders for an event
 */
export const sendReminders = async (
  eventId: string
): Promise<SendRemindersResponse> => {
  try {
    const response = await api.post<SendRemindersApiResponse>(
      API_ROUTES.SEND_REMINDERS(eventId),
      {},
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get invitation details by token
 */
export const getInvitationDetails = async (
  token: string
): Promise<InvitationDetails> => {
  try {
    const response = await api.get<InvitationDetailsResponse>(
      API_ROUTES.INVITATION_DETAILS(token)
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Respond to an invitation
 */
export const respondToInvitation = async (
  token: string,
  data: RespondToInvitationRequest
): Promise<InvitationResponse> => {
  try {
    const response = await api.post<RespondToInvitationApiResponse>(
      API_ROUTES.RESPOND_TO_INVITATION(token),
      data
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Export the utility function (moved to utils)
export { generateGoogleCalendarLink } from '../utils/invitation.utils';
