import { Module } from '@nestjs/common';
import { WebhookService } from './services/webhook.service';
import { WebhookSchedulerService } from './services/webhook-scheduler.service';
import { WebhookChannelRepository } from './repositories/webhook-channel.repository';
import { WebHookGoogleController } from './webhook.google';
import { WebhookMonitoringController } from './controllers/webhook-monitoring.controller';
import { GoogleModule } from '../google/google.module';
import { DatabaseModule } from '../../database/database.module';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [GoogleModule, DatabaseModule, CommonModule],
  controllers: [WebHookGoogleController, WebhookMonitoringController],
  providers: [
    WebhookService,
    WebhookSchedulerService,
    WebhookChannelRepository,
  ],
  exports: [WebhookService, WebhookSchedulerService, WebhookChannelRepository],
})
export class WebhookModule {}
