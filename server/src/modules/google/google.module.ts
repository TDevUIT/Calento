import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleAuthService } from './services/google-auth.service';
import { GoogleCalendarService } from './services/google-calendar.service';
import { UserCredentialsRepository } from './repositories/user-credentials.repository';

@Module({
  imports: [],
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
