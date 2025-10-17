import { BaseEntity } from '../../../common/interfaces/base-entity.interface';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface BookingLink extends BaseEntity {
  user_id: string;
  slug: string;
  title: string;
  description?: string;
  duration_minutes: number;
  buffer_time_minutes: number;
  max_bookings_per_day?: number;
  advance_notice_hours: number;
  booking_window_days: number;
  is_active: boolean;
  color?: string;
  timezone: string;
  bookings_count?: number; // Count of non-cancelled bookings
}

export interface Booking extends BaseEntity {
  booking_link_id: string;
  user_id: string;
  event_id?: string;
  booker_name: string;
  booker_email: string;
  booker_phone?: string;
  booker_notes?: string;
  start_time: Date;
  end_time: Date;
  timezone: string;
  status: BookingStatus;
  cancellation_reason?: string;
  cancelled_at?: Date;
  cancelled_by?: string;
  confirmation_token?: string;
}

export interface BookingTimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  reason?: string;
}

export interface BookingLinkWithStats extends BookingLink {
  total_bookings: number;
  upcoming_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
}

export interface PublicBookingLink {
  slug: string;
  title: string;
  description?: string;
  duration_minutes: number;
  timezone: string;
  user_name?: string;
  user_avatar?: string;
}
