export interface BaseJobData {
  userId: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface EventSyncJobData extends BaseJobData {
  syncType: 'pull' | 'push' | 'full';
  eventId?: string;
  calendarId?: string;
  options?: {
    timeMin?: Date;
    timeMax?: Date;
    maxResults?: number;
  };
}

export interface BatchEventSyncJobData extends BaseJobData {
  eventIds: string[];
  operation: 'create' | 'update' | 'delete';
  googleCalendarId?: string;
}

export interface EmailJobData extends BaseJobData {
  to: string;
  subject: string;
  template: string;
  context?: Record<string, any>;
}

export interface WebhookJobData extends BaseJobData {
  webhookUrl: string;
  payload: Record<string, any>;
  headers?: Record<string, string>;
}

export interface EventReminderJobData extends BaseJobData {
  eventId: string;
  reminderType: 'email' | 'push' | 'sms';
  scheduledAt: Date;
}

export interface CalendarCleanupJobData extends BaseJobData {
  cleanupType: 'expired_events' | 'orphaned_events' | 'duplicate_events';
  olderThan?: Date;
}

export interface JobResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export interface QueueJobOptions {
  priority?: number; // 1-10 (1 = highest)
  delay?: number; // Delay in milliseconds
  attempts?: number; // Number of retry attempts
  backoff?: {
    type: 'exponential' | 'fixed';
    delay: number;
  };
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
  jobId?: string; // Unique job ID for deduplication
}
