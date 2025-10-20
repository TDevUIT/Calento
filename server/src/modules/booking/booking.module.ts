import { Module } from '@nestjs/common';
import { BookingLinkController, BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingLinkRepository } from './repositories/booking-link.repository';
import { BookingRepository } from './repositories/booking.repository';
import { DatabaseModule } from '../../database/database.module';
import { CommonModule } from '../../common/common.module';
import { AvailabilityModule } from '../availability/availability.module';

@Module({
  imports: [DatabaseModule, CommonModule, AvailabilityModule],
  controllers: [BookingLinkController, BookingController],
  providers: [BookingService, BookingLinkRepository, BookingRepository],
  exports: [BookingService, BookingLinkRepository, BookingRepository],
})
export class BookingModule {}
