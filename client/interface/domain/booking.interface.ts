export interface BookingLink {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  description?: string;
  location?: string;
  location_link?: string;
  duration_minutes: number;
  buffer_time_minutes: number;
  max_bookings_per_day?: number;
  advance_notice_hours: number;
  booking_window_days: number;
  is_active: boolean;
  color?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
  bookings_count?: number;
  user?: {
    id: string;
    username?: string;
    email: string;
    avatar?: string;
    full_name?: string;
  };
}

export interface CreateBookingLinkDto {
  slug: string;
  title: string;
  description?: string;
  location?: string;
  location_link?: string;
  duration_minutes: number;
  buffer_time_minutes?: number;
  max_bookings_per_day?: number;
  advance_notice_hours?: number;
  booking_window_days?: number;
  is_active?: boolean;
  color?: string;
  timezone?: string;
}

export interface UpdateBookingLinkDto extends Partial<CreateBookingLinkDto> {}

export interface Booking {
  id: string;
  booking_link_id: string;
  user_id: string;
  event_id?: string;
  booker_name: string;
  booker_email: string;
  booker_phone?: string;
  booker_notes?: string;
  start_time: string;
  end_time: string;
  timezone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cancellation_reason?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  confirmation_token?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingDto {
  booker_name: string;
  booker_email: string;
  booker_phone?: string;
  booker_notes?: string;
  start_time: string;
  timezone: string;
}

export interface BookingTimeSlot {
  start: string;
  end: string;
  available: boolean;
  reason?: string;
}

export interface BookingAvailabilityQuery {
  start_date: string;
  end_date: string;
  timezone?: string;
}

export interface BookingLinkStats {
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  this_week_bookings: number;
  this_month_bookings: number;
}

export interface BookingStats {
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  completed_bookings: number;
  this_week_bookings: number;
  this_month_bookings: number;
  upcoming_bookings: number;
}

export interface BookingLinkResponse {
  success: boolean;
  data: BookingLink;
  message?: string;
}

export interface BookingLinksResponse {
  success: boolean;
  data: BookingLink[];
  message?: string;
}

export interface BookingResponse {
  success: boolean;
  data: Booking;
  message?: string;
}

export interface PaginatedBookingsResponse {
  success: boolean;
  data: Booking[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface BookingTimeSlotsResponse {
  success: boolean;
  data: BookingTimeSlot[];
  message?: string;
}

export interface BookingLinkStatsResponse {
  success: boolean;
  data: BookingLinkStats;
  message?: string;
}

export interface BookingStatsResponse {
  success: boolean;
  data: BookingStats;
  message?: string;
}
