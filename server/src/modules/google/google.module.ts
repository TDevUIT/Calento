import { Module, forwardRef } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleAuthService } from './services/google-auth.service';
import { GoogleCalendarService } from './services/google-calendar.service';
import { UserCredentialsRepository } from './repositories/user-credentials.repository';
import { EventModule } from '../event/event.module';
import { WebhookModule } from '../webhook/webhook.module';

@Module({
  imports: [forwardRef(() => EventModule), forwardRef(() => WebhookModule)],
  controllers: [GoogleController],
  providers: [
    GoogleAuthService,
    GoogleCalendarService,
    UserCredentialsRepository,
  ],
  exports: [
    GoogleAuthService,
    GoogleCalendarService,
    UserCredentialsRepository,
  ],
})
export class GoogleModule {}
