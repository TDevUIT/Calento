import { calendar_v3 } from 'googleapis';

export type GoogleCalendar = calendar_v3.Schema$Calendar;
export type GoogleEvent = calendar_v3.Schema$Event;
export type GoogleCalendarList = calendar_v3.Schema$CalendarList;
export type GoogleEventList = calendar_v3.Schema$Events;

export interface GoogleEventInput {
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: string[];
  recurrence?: string[];
  source?: {
    title: string;
    url?: string;
  };
  conferenceData?: {
    createRequest?: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
  };
  hangoutLink?: string;
}

export interface GoogleCalendarSyncResult {
  success: boolean;
  calendars_synced: number;
  events_synced: number;
  errors: string[];
}

export interface GoogleTokenInfo {
  access_token: string;
  refresh_token?: string;
  expires_at: Date;
  scope: string;
}
