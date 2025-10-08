export enum QueueName {
  EVENT_SYNC = 'event-sync',
  BATCH_SYNC = 'batch-sync',
  EMAIL = 'email',
  WEBHOOK = 'webhook',
  EVENT_REMINDER = 'event-reminder',
  CLEANUP = 'cleanup',
}

export enum JobPriority {
  CRITICAL = 1,
  HIGH = 3,
  MEDIUM = 5,
  LOW = 7,
  BACKGROUND = 10,
}

export enum JobStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DELAYED = 'delayed',
  PAUSED = 'paused',
}

export enum RetryStrategy {
  EXPONENTIAL = 'exponential',
  FIXED = 'fixed',
  LINEAR = 'linear',
}

export enum QueueEvent {
  JOB_ADDED = 'added',
  JOB_ACTIVE = 'active',
  JOB_COMPLETED = 'completed',
  JOB_FAILED = 'failed',
  JOB_STALLED = 'stalled',
  JOB_PROGRESS = 'progress',
}
