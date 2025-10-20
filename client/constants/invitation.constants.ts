export const INVITATION_API_ROUTES = {
  SEND_INVITATIONS: (eventId: string) => `/api/events/${eventId}/invitations/send`,
  
  SEND_REMINDERS: (eventId: string) => `/api/events/${eventId}/invitations/remind`,
  
  INVITATION_DETAILS: (token: string) => `/api/events/invitation/${token}`,
  
  RESPOND_TO_INVITATION: (token: string) => `/api/events/invitation/${token}/respond`,
} as const;

export const INVITATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  TENTATIVE: 'tentative',
} as const;

export const INVITATION_STATUS_LABELS = {
  [INVITATION_STATUS.PENDING]: 'Pending',
  [INVITATION_STATUS.ACCEPTED]: 'Accepted',
  [INVITATION_STATUS.DECLINED]: 'Declined',
  [INVITATION_STATUS.TENTATIVE]: 'Tentative',
} as const;

export const INVITATION_STATUS_COLORS = {
  [INVITATION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  [INVITATION_STATUS.ACCEPTED]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [INVITATION_STATUS.DECLINED]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  [INVITATION_STATUS.TENTATIVE]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
} as const;

export const INVITATION_ACTIONS = {
  ACCEPT: 'accept',
  DECLINE: 'decline',
  TENTATIVE: 'tentative',
} as const;

export const INVITATION_ACTION_LABELS = {
  [INVITATION_ACTIONS.ACCEPT]: 'Accept',
  [INVITATION_ACTIONS.DECLINE]: 'Decline',
  [INVITATION_ACTIONS.TENTATIVE]: 'Maybe',
} as const;

export const INVITATION_ACTION_COLORS = {
  [INVITATION_ACTIONS.ACCEPT]: 'bg-green-600 hover:bg-green-700 text-white',
  [INVITATION_ACTIONS.DECLINE]: 'bg-red-600 hover:bg-red-700 text-white',
  [INVITATION_ACTIONS.TENTATIVE]: 'bg-blue-600 hover:bg-blue-700 text-white',
} as const;

export const GOOGLE_CALENDAR_BASE_URL = 'https://calendar.google.com/calendar/render';

export const INVITATION_DEFAULTS = {
  SHOW_ATTENDEES: true,
  ADD_TO_CALENDAR: false,
} as const;

export const INVITATION_LIMITS = {
  MAX_EMAILS_PER_BATCH: 50,
  MAX_COMMENT_LENGTH: 500,
  MAX_TITLE_LENGTH: 255,
} as const;
