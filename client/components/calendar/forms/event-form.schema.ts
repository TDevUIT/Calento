import { z } from 'zod';

export const attendeeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  response_status: z.enum(['accepted', 'declined', 'tentative', 'needsAction']).optional(),
  is_optional: z.boolean().optional(),
  is_organizer: z.boolean().optional(),
  comment: z.string().max(500, 'Comment must be at most 500 characters').optional(),
});

export const conferenceDataSchema = z.object({
  type: z.enum(['google_meet', 'zoom', 'ms_teams', 'custom']).optional(),
  url: z.string().url('Invalid URL'),
  id: z.string().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  pin: z.string().optional(),
  notes: z.string().max(500, 'Notes must be at most 500 characters').optional(),
}).optional();

export const reminderSchema = z.object({
  method: z.enum(['email', 'popup', 'sms']),
  minutes: z.number().min(0, 'Minutes must be >= 0').max(10080, 'Maximum 7 days (10080 minutes)'),
});

export const eventFormSchema = z.object({
  calendar_id: z.string()
    .min(1, 'Please select a calendar'),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional(),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  location: z.string().max(255, 'Location must be at most 255 characters').optional(),
  is_all_day: z.boolean().default(false),
  color: z.string().regex(/^(#[0-9A-Fa-f]{6}|blue|green|pink|purple|orange|red|yellow|cyan|indigo|teal|default)$/, 'Color must be a valid hex code or preset name').default('#3b82f6'),
  recurrence_rule: z.string().max(500, 'Recurrence rule must be at most 500 characters').optional(),
  
  attendees: z.array(attendeeSchema).optional(),
  conference_data: z.union([
    conferenceDataSchema,
    z.undefined(),
    z.null(),
  ]).optional(),
  reminders: z.array(reminderSchema).optional(),
  visibility: z.enum(['default', 'public', 'private', 'confidential']).default('default'),
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
).refine(
  (data) => {
    if (!data.start_time || !data.end_time) return true;
    const start = new Date(data.start_time);
    const end = new Date(data.end_time);
    const durationMs = end.getTime() - start.getTime();
    const maxDurationMs = 24 * 60 * 60 * 1000;
    return durationMs <= maxDurationMs;
  },
  {
    message: 'Event duration cannot exceed 24 hours. Use recurring events for longer periods.',
    path: ['end_time'],
  }
).refine(
  (data) => {
    if (!data.recurrence_rule || data.recurrence_rule.trim() === '') return true;
    const rule = data.recurrence_rule.trim();
    return rule.includes('FREQ=');
  },
  {
    message: 'Invalid recurrence rule format. Must contain FREQ= (e.g., FREQ=DAILY or RRULE:FREQ=WEEKLY;BYDAY=MO)',
    path: ['recurrence_rule'],
  }
);

export type EventFormData = z.infer<typeof eventFormSchema>;
