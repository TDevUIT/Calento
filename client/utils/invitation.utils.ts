import { format, parseISO } from 'date-fns';
import {
  INVITATION_STATUS,
  INVITATION_STATUS_LABELS,
  INVITATION_STATUS_COLORS,
  INVITATION_ACTION_LABELS,
  INVITATION_ACTION_COLORS,
  GOOGLE_CALENDAR_BASE_URL,
} from '../constants/invitation.constants';
import type { 
  GoogleCalendarEvent, 
  InvitationStatus, 
  InvitationAction,
  InvitationDetails 
} from '../interface/invitation.interface';

/**
 * Generate Google Calendar link for an event
 */
export function generateGoogleCalendarLink(event: GoogleCalendarEvent): string {
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

  return `${GOOGLE_CALENDAR_BASE_URL}?${params.toString()}`;
}

/**
 * Get invitation status label
 */
export function getInvitationStatusLabel(status: string): string {
  return INVITATION_STATUS_LABELS[status as keyof typeof INVITATION_STATUS_LABELS] || status;
}

/**
 * Get invitation status color classes
 */
export function getInvitationStatusColor(status: string): string {
  return INVITATION_STATUS_COLORS[status as keyof typeof INVITATION_STATUS_COLORS] || 'bg-gray-100 text-gray-700';
}

/**
 * Get invitation action label
 */
export function getInvitationActionLabel(action: InvitationAction): string {
  return INVITATION_ACTION_LABELS[action];
}

/**
 * Get invitation action color classes
 */
export function getInvitationActionColor(action: InvitationAction): string {
  return INVITATION_ACTION_COLORS[action];
}

/**
 * Format event time range for display
 */
export function formatEventTimeRange(startTime: string, endTime: string): string {
  const start = parseISO(startTime);
  const end = parseISO(endTime);
  
  const startFormatted = format(start, 'h:mm a');
  const endFormatted = format(end, 'h:mm a');
  const dateFormatted = format(start, 'EEEE, MMM d, yyyy');
  
  return `${dateFormatted} • ${startFormatted} - ${endFormatted}`;
}

/**
 * Check if invitation is expired
 */
export function isInvitationExpired(eventStartTime: string): boolean {
  const startTime = parseISO(eventStartTime);
  const now = new Date();
  return startTime < now;
}

/**
 * Check if invitation is upcoming
 */
export function isInvitationUpcoming(eventStartTime: string): boolean {
  const startTime = parseISO(eventStartTime);
  const now = new Date();
  return startTime > now;
}

/**
 * Validate email addresses
 */
export function validateEmailAddresses(emails: string[]): {
  valid: string[];
  invalid: string[];
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid: string[] = [];
  const invalid: string[] = [];
  
  emails.forEach(email => {
    const trimmedEmail = email.trim();
    if (emailRegex.test(trimmedEmail)) {
      valid.push(trimmedEmail);
    } else {
      invalid.push(trimmedEmail);
    }
  });
  
  return { valid, invalid };
}

/**
 * Parse email list from string (comma or newline separated)
 */
export function parseEmailList(emailString: string): string[] {
  return emailString
    .split(/[,\n]/)
    .map(email => email.trim())
    .filter(email => email.length > 0);
}

/**
 * Generate invitation summary text
 */
export function generateInvitationSummary(invitation: InvitationDetails): string {
  const timeRange = formatEventTimeRange(invitation.start_time, invitation.end_time);
  const location = invitation.location ? ` at ${invitation.location}` : '';
  
  return `${invitation.title} - ${timeRange}${location}`;
}

/**
 * Get invitation response icon
 */
export function getInvitationResponseIcon(status: InvitationStatus): string {
  switch (status) {
    case INVITATION_STATUS.ACCEPTED:
      return 'âœ…';
    case INVITATION_STATUS.DECLINED:
      return 'âŒ';
    case INVITATION_STATUS.TENTATIVE:
      return 'â“';
    case INVITATION_STATUS.PENDING:
    default:
      return 'â³';
  }
}

/**
 * Calculate invitation statistics
 */
export function calculateInvitationStats(invitations: { response_status: string }[]) {
  const total = invitations.length;
  const accepted = invitations.filter(inv => inv.response_status === INVITATION_STATUS.ACCEPTED).length;
  const declined = invitations.filter(inv => inv.response_status === INVITATION_STATUS.DECLINED).length;
  const tentative = invitations.filter(inv => inv.response_status === INVITATION_STATUS.TENTATIVE).length;
  const pending = invitations.filter(inv => inv.response_status === INVITATION_STATUS.PENDING).length;
  
  return {
    total,
    accepted,
    declined,
    tentative,
    pending,
    acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : 0,
    responseRate: total > 0 ? Math.round(((accepted + declined + tentative) / total) * 100) : 0,
  };
}

/**
 * Generate ICS file content for calendar import
 */
export function generateICSContent(event: GoogleCalendarEvent & { uid?: string }): string {
  const formatDateForICS = (date: string) => {
    return new Date(date).toISOString().replace(/-|:|\.\d+/g, '');
  };

  const startTime = formatDateForICS(event.start_time);
  const endTime = formatDateForICS(event.end_time);
  const uid = event.uid || `${Date.now()}@tempra.com`;
  const timestamp = formatDateForICS(new Date().toISOString());

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tempra//Event Invitation//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${startTime}`,
    `DTEND:${endTime}`,
    `SUMMARY:${event.title}`,
    event.description ? `DESCRIPTION:${event.description}` : '',
    event.location ? `LOCATION:${event.location}` : '',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(line => line !== '').join('\r\n');
}

/**
 * Create downloadable ICS file blob
 */
export function createICSBlob(event: GoogleCalendarEvent & { uid?: string }): Blob {
  const icsContent = generateICSContent(event);
  return new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
}

/**
 * Download ICS file
 */
export function downloadICSFile(event: GoogleCalendarEvent & { uid?: string }, filename?: string): void {
  const blob = createICSBlob(event);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename || `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
