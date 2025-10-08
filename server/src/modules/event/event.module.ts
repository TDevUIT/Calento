import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { EventSyncService } from './services/event-sync.service';
import { CalendarSyncManagerService } from './services/calendar-sync-manager.service';
import { CalendarSyncController } from './controllers/calendar-sync.controller';
import { EventQueueController } from './controllers/event-queue.controller';
import { SyncChecker } from './utils/sync-checker';
import { DatabaseModule } from '../../database/database.module';
import { GoogleModule } from '../google/google.module';

@Module({
  imports: [DatabaseModule, GoogleModule],
  controllers: [EventController, CalendarSyncController, EventQueueController],
  providers: [
    EventService,
    EventRepository,
    EventSyncService,
    CalendarSyncManagerService,
    SyncChecker,
  ],
  exports: [EventSyncService, CalendarSyncManagerService],
})
export class EventModule {}
