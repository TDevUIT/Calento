import { QueueOptions, WorkerOptions } from 'bullmq';
import { ConfigService } from '@nestjs/config';

/**
 * Default queue configuration
 */
export const getDefaultQueueConfig = (configService: ConfigService): QueueOptions => ({
    connection: {
        host: configService.get('REDIS_HOST', 'localhost'),
        port: parseInt(configService.get('REDIS_PORT', '6379')) || 6379,
        password: configService.get('REDIS_PASSWORD') || undefined,
        db: parseInt(configService.get('REDIS_DB', '0')) || 0,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000, // 1s initial delay
        },
        removeOnComplete: {
            count: 100, // Keep last 100 completed jobs
            age: 24 * 3600, // Remove after 24 hours
        },
        removeOnFail: {
            count: 500, // Keep last 500 failed jobs for debugging
            age: 7 * 24 * 3600, // Remove after 7 days
        },
    },
});

/**
 * Default worker configuration
 */
export const getDefaultWorkerConfig = (configService: ConfigService): WorkerOptions => ({
    connection: {
        host: configService.get('REDIS_HOST', 'localhost'),
        port: parseInt(configService.get('REDIS_PORT', '6379')) || 6379,
        password: configService.get('REDIS_PASSWORD') || undefined,
        db: parseInt(configService.get('REDIS_DB', '0')) || 0,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    },
    concurrency: parseInt(configService.get('QUEUE_CONCURRENCY', '10')) || 10,
    limiter: {
        max: parseInt(configService.get('QUEUE_RATE_LIMIT_MAX', '100')) || 100,
        duration: parseInt(configService.get('QUEUE_RATE_LIMIT_DURATION', '1000')) || 1000,
    },
});

/**
 * Event sync queue specific configuration
 */
export const EVENT_SYNC_QUEUE_CONFIG: Partial<QueueOptions> = {
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: 50,
        removeOnFail: 200,
    },
};

/**
 * Batch sync queue specific configuration
 */
export const BATCH_SYNC_QUEUE_CONFIG: Partial<QueueOptions> = {
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: 20,
        removeOnFail: 100,
    },
};

/**
 * Email queue specific configuration
 */
export const EMAIL_QUEUE_CONFIG: Partial<QueueOptions> = {
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 3000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
    },
};

/**
 * Webhook queue specific configuration
 */
export const WEBHOOK_QUEUE_CONFIG: Partial<QueueOptions> = {
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: 50,
        removeOnFail: 200,
    },
};

/**
 * Cleanup queue specific configuration
 */
export const CLEANUP_QUEUE_CONFIG: Partial<QueueOptions> = {
    defaultJobOptions: {
        attempts: 2,
        backoff: {
            type: 'fixed',
            delay: 5000,
        },
        removeOnComplete: 10,
        removeOnFail: 50,
    },
};
