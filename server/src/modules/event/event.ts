export interface Event {
  id: string;
  calendar_id: string;
  google_event_id?: string;
  title: string;
  description?: string;
  location?: string;
  timezone?: string;
  start_time: Date;
  end_time: Date;
  is_all_day: boolean;
  is_recurring: boolean;
  recurrence_rule?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
  color?: string;
  attendees?: any;
  reminders?: any;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
