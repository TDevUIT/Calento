import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Queue, Job, JobsOptions } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { QueueJobOptions } from '../interfaces/queue-job.interface';
import { QueueName, JobStatus } from '../types/queue.types';

@Injectable()
export abstract class BaseQueueService<T = any> implements OnModuleDestroy {
    protected readonly logger: Logger;
    protected queue: Queue<T>;
    protected abstract queueName: QueueName;

    constructor(protected readonly configService: ConfigService) {
        this.logger = new Logger(this.constructor.name);
    }

    protected async initializeQueue(queueConfig?: any): Promise<void> {
        const connection = {
            host: this.configService.get('REDIS_HOST', 'localhost'),
            port: parseInt(this.configService.get('REDIS_PORT', '6379')) || 6379,
            password: this.configService.get('REDIS_PASSWORD') || undefined,
            db: parseInt(this.configService.get('REDIS_DB', '0')) || 0,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        };
        this.queue = new Queue<T>(this.queueName, {
            connection,
            ...queueConfig,
        });

        this.logger.log(`Queue "${this.queueName}" initialized`);
    }

    async addJob(
        jobName: string,
        data: T,
        options?: QueueJobOptions
    ): Promise<Job<T, any, string>> {
        const jobOptions: JobsOptions = {
            priority: options?.priority,
            delay: options?.delay,
            attempts: options?.attempts || 3,
            backoff: options?.backoff || {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: options?.removeOnComplete !== undefined 
                ? options.removeOnComplete 
                : 100,
            removeOnFail: options?.removeOnFail !== undefined 
                ? options.removeOnFail 
                : 500,
            jobId: options?.jobId,
        };

        // @ts-ignore - BullMQ type compatibility issue with generic T
        const job = await this.queue.add(jobName, data, jobOptions);
        
        this.logger.log(
            `Job "${jobName}" added to queue "${this.queueName}" with ID: ${job.id}`
        );

        return job as Job<T, any, string>;
    }


    async addBulkJobs(
        jobs: Array<{ name: string; data: T; opts?: QueueJobOptions }>
    ): Promise<Job<T, any, string>[]> {
        const bulkJobs = jobs.map(job => ({
            name: job.name,
            data: job.data,
            opts: {
                priority: job.opts?.priority,
                delay: job.opts?.delay,
                attempts: job.opts?.attempts || 3,
                backoff: job.opts?.backoff || {
                    type: 'exponential',
                    delay: 1000,
                },
                removeOnComplete: job.opts?.removeOnComplete !== undefined 
                    ? job.opts.removeOnComplete 
                    : 100,
                removeOnFail: job.opts?.removeOnFail !== undefined 
                    ? job.opts.removeOnFail 
                    : 500,
                jobId: job.opts?.jobId,
            },
        }));

        const addedJobs = await this.queue.addBulk(bulkJobs as any);
        
        this.logger.log(
            `${addedJobs.length} jobs added to queue "${this.queueName}"`
        );

        return addedJobs as Job<T, any, string>[];
    }


    async getJob(jobId: string): Promise<Job<T> | undefined> {
        return await this.queue.getJob(jobId);
    }


    async getJobCounts(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
        delayed: number;
        paused: number;
    }> {
        const counts = await this.queue.getJobCounts(
            'waiting',
            'active',
            'completed',
            'failed',
            'delayed',
            'paused'
        );
        
        return {
            waiting: counts.waiting || 0,
            active: counts.active || 0,
            completed: counts.completed || 0,
            failed: counts.failed || 0,
            delayed: counts.delayed || 0,
            paused: counts.paused || 0,
        };
    }

    async getJobs(
        status: JobStatus,
        start = 0,
        end = 10
    ): Promise<Job<T>[]> {
        return await this.queue.getJobs(status, start, end);
    }

    async removeJob(jobId: string): Promise<void> {
        const job = await this.getJob(jobId);
        if (job) {
            await job.remove();
            this.logger.log(`Job ${jobId} removed from queue "${this.queueName}"`);
        }
    }

    async retryJob(jobId: string): Promise<void> {
        const job = await this.getJob(jobId);
        if (job) {
            await job.retry();
            this.logger.log(`Job ${jobId} retried in queue "${this.queueName}"`);
        }
    }

    async clean(
        grace: number = 24 * 3600 * 1000, // 24 hours
        limit = 1000,
        status: 'completed' | 'failed' = 'completed'
    ): Promise<string[]> {
        const jobs = await this.queue.clean(grace, limit, status);
        this.logger.log(
            `Cleaned ${jobs.length} ${status} jobs from queue "${this.queueName}"`
        );
        return jobs;
    }


    async pause(): Promise<void> {
        await this.queue.pause();
        this.logger.log(`Queue "${this.queueName}" paused`);
    }


    async resume(): Promise<void> {
        await this.queue.resume();
        this.logger.log(`Queue "${this.queueName}" resumed`);
    }


    async getMetrics(): Promise<{
        queueName: string;
        counts: any;
        isPaused: boolean;
    }> {
        const counts = await this.getJobCounts();
        const isPaused = await this.queue.isPaused();

        return {
            queueName: this.queueName,
            counts,
            isPaused,
        };
    }


    async onModuleDestroy() {
        if (this.queue) {
            await this.queue.close();
            this.logger.log(`Queue "${this.queueName}" closed`);
        }
    }
}
