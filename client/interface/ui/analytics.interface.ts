export interface AnalyticsQueryParams {
  start_date: string;
  end_date: string;
  calendar_id?: string;
}

export interface TimeDistributionQueryParams extends AnalyticsQueryParams {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metric?: 'events' | 'duration' | 'attendees' | 'bookings';
}

export interface CategoryAnalyticsQueryParams extends AnalyticsQueryParams {
  limit?: number;
}

export interface EventAnalytics {
  total_events: number;
  upcoming_events: number;
  past_events: number;
  recurring_events: number;
  events_this_week: number;
  events_this_month: number;
}

export interface TimeUtilization {
  total_hours: number;
  scheduled_hours: number;
  free_hours: number;
  utilization_rate: number;
  busiest_day: string;
  busiest_hour: number;
}

export interface CategoryAnalytics {
  calendar_id: string;
  calendar_name?: string;
  event_count: number;
  total_duration_hours: number;
}

export interface TimeDistribution {
  date: string;
  count: number;
  duration_hours: number;
}

export interface AttendeeAnalytics {
  total_attendees: number;
  unique_attendees: number;
  average_per_event: number;
  top_attendees: {
    email: string;
    name?: string;
    event_count: number;
  }[];
}

export interface BookingAnalytics {
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  booking_rate: number;
  cancellation_rate: number;
  top_booking_links: {
    id: string;
    title: string;
    booking_count: number;
  }[];
}

export interface AnalyticsOverview {
  event_analytics: EventAnalytics;
  time_utilization: TimeUtilization;
  top_categories: CategoryAnalytics[];
  recent_activity: TimeDistribution[];
}

export interface DetailedAnalytics extends AnalyticsOverview {
  attendee_analytics: AttendeeAnalytics;
  booking_analytics: BookingAnalytics;
  daily_distribution: TimeDistribution[];
  weekly_distribution: TimeDistribution[];
  monthly_distribution: TimeDistribution[];
}

export interface AnalyticsResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp: Date;
}
