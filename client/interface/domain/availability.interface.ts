export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export interface Availability {
  id: string;
  user_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  timezone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface AvailabilityCheck {
  is_available: boolean;
  conflicts?: Array<{
    event_id: string;
    title: string;
    start: string;
    end: string;
  }>;
}

export interface AvailableSlots {
  date: string;
  slots: TimeSlot[];
  total_slots: number;
}

export interface WeeklySchedule {
  [key: number]: Availability[];
}

export interface CreateAvailabilityDto {
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  timezone?: string;
  is_active?: boolean;
}

export interface UpdateAvailabilityDto {
  day_of_week?: DayOfWeek;
  start_time?: string;
  end_time?: string;
  timezone?: string;
  is_active?: boolean;
}

export interface BulkCreateAvailabilityDto {
  availabilities: CreateAvailabilityDto[];
}

export interface CheckAvailabilityDto {
  date_time: string;
  timezone?: string;
}

export interface GetAvailableSlotsDto {
  start_date: string;
  end_date: string;
  duration_minutes: number;
  timezone?: string;
}

export const DAY_NAMES = {
  [DayOfWeek.SUNDAY]: 'Sunday',
  [DayOfWeek.MONDAY]: 'Monday',
  [DayOfWeek.TUESDAY]: 'Tuesday',
  [DayOfWeek.WEDNESDAY]: 'Wednesday',
  [DayOfWeek.THURSDAY]: 'Thursday',
  [DayOfWeek.FRIDAY]: 'Friday',
  [DayOfWeek.SATURDAY]: 'Saturday',
};

export const DAY_NAMES_SHORT = {
  [DayOfWeek.SUNDAY]: 'Sun',
  [DayOfWeek.MONDAY]: 'Mon',
  [DayOfWeek.TUESDAY]: 'Tue',
  [DayOfWeek.WEDNESDAY]: 'Wed',
  [DayOfWeek.THURSDAY]: 'Thu',
  [DayOfWeek.FRIDAY]: 'Fri',
  [DayOfWeek.SATURDAY]: 'Sat',
};
