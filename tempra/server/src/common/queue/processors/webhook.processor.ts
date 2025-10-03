import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import { WebhookJobData, JobResult } from '../interfaces/queue-job.interface';
import { QueueName } from '../types/queue.types';
import { getDefaultWorkerConfig } from '../config/queue.config';

/**
 * Webhook job processor
 * This worker processes webhook delivery jobs from the queue
 */
@Injectable()
export class WebhookProcessor implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(WebhookProcessor.name);
    private worker: Worker;

    constructor(
        private readonly configService: ConfigService,
        // Inject HTTP service for webhook delivery
        // private readonly httpService: HttpService,
    ) {}

    async onModuleInit() {
        const workerConfig = getDefaultWorkerConfig(this.configService);

        this.worker = new Worker(
            QueueName.WEBHOOK,
            async (job: Job<WebhookJobData>) => {
                return await this.processJob(job);
            },
            {
                ...workerConfig,
                concurrency: parseInt(this.configService.get('WEBHOOK_WORKER_CONCURRENCY', '10')) || 10,
            }
        );

        // Event listeners
        this.worker.on('completed', (job) => {
            this.logger.log(`Webhook job ${job.id} delivered to ${job.data.webhookUrl}`);
        });

        this.worker.on('failed', (job, err) => {
            this.logger.error(
                `Webhook job ${job?.id} failed for ${job?.data.webhookUrl}: ${err.message}`,
                err.stack
            );
        });

        this.logger.log(`Webhook worker started with concurrency: ${workerConfig.concurrency}`);
    }

    /**
     * Process webhook job
     */
    private async processJob(job: Job<WebhookJobData>): Promise<JobResult> {
        const { webhookUrl, payload, headers, userId } = job.data;

        this.logger.log(
            `Delivering webhook to ${webhookUrl} (user: ${userId})`
        );

        try {
            await job.updateProgress(20);

            // TODO: Use HTTP service to deliver webhook
            // const response = await this.httpService.post(webhookUrl, payload, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'User-Agent': 'Tempra-Webhook/1.0',
            //         ...headers,
            //     },
            //     timeout: 10000, // 10 seconds
            // });

            // Placeholder - simulate webhook delivery
            await this.simulateWebhookDelivery(webhookUrl, payload);
            
            await job.updateProgress(100);

            return {
                success: true,
                message: `Webhook delivered successfully to ${webhookUrl}`,
                data: {
                    // statusCode: response.status,
                    statusCode: 200,
                },
            };
        } catch (error) {
            this.logger.error(
                `Failed to deliver webhook to ${webhookUrl}: ${error.message}`,
                error.stack
            );
            
            // Check if we should retry
            if (this.shouldRetry(error)) {
                throw error; // Let BullMQ handle retry
            }
            
            // Don't retry for 4xx errors (client errors)
            return {
                success: false,
                error: `Webhook delivery failed: ${error.message}`,
            };
        }
    }

    /**
     * Simulate webhook delivery (for development)
     */
    private async simulateWebhookDelivery(
        url: string,
        payload: Record<string, any>
    ): Promise<void> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        this.logger.debug(`[SIMULATED] Webhook POST to ${url}:`, JSON.stringify(payload));
        
        // Simulate occasional failures for testing retry logic
        if (Math.random() < 0.1) { // 10% failure rate
            throw new Error('Simulated webhook delivery error');
        }
    }

    /**
     * Determine if error is retryable
     */
    private shouldRetry(error: any): boolean {
        // Retry on network errors, 5xx errors
        // Don't retry on 4xx errors (client errors)
        const statusCode = error.response?.status;
        
        if (!statusCode) {
            return true; // Network error, retry
        }
        
        return statusCode >= 500 && statusCode < 600; // Only retry server errors
    }

    async onModuleDestroy() {
        if (this.worker) {
            await this.worker.close();
            this.logger.log('Webhook worker stopped');
        }
    }
}
