import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { EventSyncService } from './services/event-sync.service';
import { CalendarSyncManagerService } from './services/calendar-sync-manager.service';
import { CalendarSyncController } from './controllers/calendar-sync.controller';
import { EventQueueController } from './controllers/event-queue.controller';
import { EventInvitationService } from './services/event-invitation.service';
import { SyncChecker } from './utils/sync-checker';
import { DatabaseModule } from '../../database/database.module';
import { GoogleModule } from '../google/google.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { RecurringEventsService } from '../../common/services/recurring-events.service';
import { VectorModule } from '../vector/vector.module';

@Module({
  imports: [DatabaseModule, GoogleModule, EmailModule, UsersModule, VectorModule],
  controllers: [EventController, CalendarSyncController, EventQueueController],
  providers: [
    EventService,
    EventRepository,
    EventSyncService,
    CalendarSyncManagerService,
    EventInvitationService,
    SyncChecker,
    RecurringEventsService,
  ],
  exports: [EventService, EventRepository, EventSyncService, CalendarSyncManagerService, EventInvitationService],
})
export class EventModule { }
