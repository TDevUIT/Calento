import { Module } from '@nestjs/common';
import { WebHookGoogleController } from './webhook.google';
import { WebhookService } from './services/webhook.service';
import { WebhookChannelRepository } from './repositories/webhook-channel.repository';
import { GoogleModule } from '../google/google.module';

@Module({
    imports: [GoogleModule],
    controllers: [WebHookGoogleController],
    providers: [
        WebhookService,
        WebhookChannelRepository
    ],
    exports: [WebhookService]
})
export class WebhookModule {}
