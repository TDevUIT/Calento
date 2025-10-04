import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EventSyncQueueService } from './services/event-sync-queue.service';
import { EmailQueueService } from './services/email-queue.service';
import { WebhookQueueService } from './services/webhook-queue.service';

import { EventSyncProcessor } from './processors/event-sync.processor';
import { WebhookProcessor } from './processors/webhook.processor';

import { QueueMonitorController } from './controllers/queue-monitor.controller';

import { EventModule } from '../../modules/event/event.module';
import { EmailModule } from '../../modules/email/email.module';
import { EmailProcessor } from './processors/email.processor';

@Global()
@Module({
    imports: [ConfigModule, EventModule, EmailModule],
    providers: [
        EventSyncQueueService,
        EmailQueueService,
        WebhookQueueService,
        EventSyncProcessor,
        EmailProcessor,
        WebhookProcessor,
    ],
    controllers: [QueueMonitorController],
    exports: [
        EventSyncQueueService,
        EmailQueueService,
        WebhookQueueService,
    ],
})
export class QueueModule {}
