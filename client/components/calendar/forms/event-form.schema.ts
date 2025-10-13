import { z } from 'zod';

// Attendee schema
export const attendeeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  response_status: z.enum(['accepted', 'declined', 'tentative', 'needsAction']).optional(),
  is_optional: z.boolean().optional(),
  is_organizer: z.boolean().optional(),
  comment: z.string().max(500, 'Comment must be at most 500 characters').optional(),
});

// Conference data schema
export const conferenceDataSchema = z.object({
  type: z.enum(['google_meet', 'zoom', 'ms_teams', 'custom']),
  url: z.string().url('Invalid URL'),
  id: z.string().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  pin: z.string().optional(),
  notes: z.string().max(500, 'Notes must be at most 500 characters').optional(),
});

// Reminder schema
export const reminderSchema = z.object({
  method: z.enum(['email', 'popup', 'sms']),
  minutes: z.number().min(0, 'Minutes must be >= 0').max(10080, 'Maximum 7 days (10080 minutes)'),
});

// Main event form schema
export const eventFormSchema = z.object({
  calendar_id: z.string().uuid('Invalid Calendar ID - must be UUID format'),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional(),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  location: z.string().max(255, 'Location must be at most 255 characters').optional(),
  is_all_day: z.boolean().optional().default(false),
  color: z.enum(['blue', 'green', 'pink', 'purple', 'orange', 'red', 'default']).optional().default('blue'),
  recurrence_rule: z.string().max(500, 'Recurrence rule must be at most 500 characters').optional(),
  
  // New fields
  attendees: z.array(attendeeSchema).optional(),
  conference_data: conferenceDataSchema.optional(),
  reminders: z.array(reminderSchema).optional(),
  visibility: z.enum(['default', 'public', 'private', 'confidential']).optional().default('default'),
}).refine(
  (data) => {
    if (!data.start_time || !data.end_time) return true;
    const start = new Date(data.start_time);
    const end = new Date(data.end_time);
    return end > start;
  },
  {
    message: 'End time must be after start time',
    path: ['end_time'],
  }
);

export type EventFormData = z.infer<typeof eventFormSchema>;
