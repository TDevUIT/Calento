export interface Calendar {
  id: string;
  user_id: string;
  google_calendar_id: string;
  name?: string;
  description?: string;
  timezone?: string;
  is_primary: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface CreateCalendarRequest {
  google_calendar_id: string;
  name?: string;
  description?: string;
  timezone?: string;
  is_primary?: boolean;
}

export interface UpdateCalendarRequest {
  name?: string;
  description?: string;
  timezone?: string;
  is_primary?: boolean;
}

export interface CalendarQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  is_primary?: boolean;
  timezone?: string;
}

export interface SyncCalendarsRequest {
  force_full_sync?: boolean;
}

export interface PaginatedCalendarsResponse {
  success: boolean;
  message: string;
  data: {
    items: Calendar[];
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

export interface CalendarResponse {
  success: boolean;
  message: string;
  data: Calendar;
  status: number;
  timestamp: string;
}
