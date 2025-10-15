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
  
  // Organizer information
  organizer_id?: string;
  organizer_email?: string;
  organizer_name?: string;
  
  // Creator information (user who created the event)
  creator?: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
  
  // Attendees and conference
  attendees?: EventAttendee[];
  conference_data?: ConferenceData;
  reminders?: EventReminder[];
  
  // Privacy and response
  visibility?: 'default' | 'public' | 'private' | 'confidential';
  response_status?: 'accepted' | 'declined' | 'tentative' | 'needsAction';
  
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
