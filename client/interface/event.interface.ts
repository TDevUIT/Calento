export interface EventAttendee {
  email: string;
  name?: string;
  response_status?: 'accepted' | 'declined' | 'tentative' | 'needsAction';
  is_optional?: boolean;
  is_organizer?: boolean;
  comment?: string;
}

export interface ConferenceData {
  type: 'google_meet' | 'zoom' | 'ms_teams' | 'custom';
  url: string;
  id?: string;
  password?: string;
  phone?: string;
  pin?: string;
  notes?: string;
}

export interface EventReminder {
  method: 'email' | 'popup' | 'sms';
  minutes: number;
}

export interface Event {
  id: string;
  user_id: string;
  calendar_id: string;
  title: string;
  description?: string;
  start_time: Date | string;
  end_time: Date | string;
  location?: string;
  is_all_day: boolean;
  recurrence_rule?: string;
  color?: string;
  
  // Creator information (người tạo event)
  creator?: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
  
  // Organizer information (người tổ chức - có thể khác creator)
  organizer_id?: string;
  organizer_email?: string;
  organizer_name?: string;
  organizer_avatar?: string; // Avatar URL của người tổ chức
  
  // Attendees and conference
  attendees?: EventAttendee[];
  conference_data?: ConferenceData;
  reminders?: EventReminder[];
  
  // Privacy and response
  visibility?: 'default' | 'public' | 'private' | 'confidential';
  response_status?: 'accepted' | 'declined' | 'tentative' | 'needsAction';
  
  // External integration
  google_calendar_url?: string; // Link đến Google Calendar
  source?: string; // Nguồn tạo event (e.g., "Reclaim.ai", "Manual", "Google Calendar")
  source_url?: string; // URL của ứng dụng tạo event
  
  created_at: Date | string;
  updated_at: Date | string;
}

export interface CreateEventRequest {
  calendar_id: string;
  title: string;
  description?: string;
  start_time: string; // ISO 8601 format
  end_time: string;   // ISO 8601 format
  location?: string;
  is_all_day?: boolean;
  recurrence_rule?: string; // RRULE format
  color?: string;
  attendees?: EventAttendee[];
  conference_data?: ConferenceData;
  reminders?: EventReminder[];
  visibility?: 'default' | 'public' | 'private' | 'confidential';
}

// For PUT requests - full replacement (all required fields must be provided)
export interface UpdateEventRequest {
  calendar_id: string; // Required for PUT
  title: string;       // Required for PUT
  description?: string;
  start_time: string;  // Required for PUT
  end_time: string;    // Required for PUT
  location?: string;
  is_all_day?: boolean;
  recurrence_rule?: string;
  color?: string;
  attendees?: EventAttendee[];
  conference_data?: ConferenceData;
  reminders?: EventReminder[];
  visibility?: 'default' | 'public' | 'private' | 'confidential';
  response_status?: 'accepted' | 'declined' | 'tentative' | 'needsAction';
}

// For PATCH requests - partial update (all fields are optional)
export interface PartialUpdateEventRequest {
  calendar_id?: string; // Allow moving event to different calendar
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  is_all_day?: boolean;
  recurrence_rule?: string;
  color?: string;
  attendees?: EventAttendee[];
  conference_data?: ConferenceData;
  reminders?: EventReminder[];
  visibility?: 'default' | 'public' | 'private' | 'confidential';
  response_status?: 'accepted' | 'declined' | 'tentative' | 'needsAction';
}

export interface EventQueryParams {
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
  location?: string;
  is_all_day?: boolean;
}

export interface RecurringEventsQueryParams {
  start_date: string; // ISO 8601 format
  end_date: string;   // ISO 8601 format
  max_occurrences?: number;
  page?: number;
  limit?: number;
}

export interface ExpandedEvent extends Event {
  original_event_id: string;
  occurrence_index: number;
  is_recurring_instance: boolean;
}

export interface EventConflictCheck {
  start_time: string;
  end_time: string;
  exclude_event_id?: string;
}

export interface BulkEventOperation {
  event_ids: string[];
}

export interface PaginatedEventsResponse {
  success: boolean;
  message: string;
  data: {
    items: Event[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  status: number;
  timestamp: string;
}

export interface EventResponse {
  success: boolean;
  message: string;
  data: Event;
  status: number;
  timestamp: string;
}
