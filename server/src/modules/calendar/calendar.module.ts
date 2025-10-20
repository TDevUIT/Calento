import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarRepository } from './calendar.repository';

/**
 * Calendar Module - Manages user calendars and Google Calendar integration
 *
 * Features:
 * - CRUD operations for calendars
 * - Google Calendar synchronization
 * - Primary calendar management
 * - Timezone support
 * - Search and filtering
 */
@Module({
  imports: [],
  controllers: [CalendarController],
  providers: [CalendarService, CalendarRepository],
  exports: [CalendarService, CalendarRepository],
})
export class CalendarModule {}
