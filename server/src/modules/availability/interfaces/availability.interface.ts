import { BaseEntity } from '../../../common/interfaces/base-entity.interface';

export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export interface Availability extends BaseEntity {
  user_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  timezone?: string;
  is_active?: boolean;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface AvailabilityCheck {
  available: boolean;
  conflicts: Array<{
    event_id: string;
    title: string;
    start_time: Date;
    end_time: Date;
  }>;
  suggestions?: Date[];
}

export interface WeeklySchedule {
  [key: string]: {
    day: DayOfWeek;
    slots: Array<{
      start_time: string;
      end_time: string;
    }>;
  };
}
