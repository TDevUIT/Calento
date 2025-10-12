export interface Event {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: Date | string;
  end_time: Date | string;
  location?: string;
  is_all_day: boolean;
  recurrence_rule?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  start_time: string; // ISO 8601 format
  end_time: string;   // ISO 8601 format
  location?: string;
  is_all_day?: boolean;
  recurrence_rule?: string; // RRULE format
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  is_all_day?: boolean;
  recurrence_rule?: string;
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
  data: Event[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
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
