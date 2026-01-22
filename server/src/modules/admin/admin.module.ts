import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { BookingModule } from '../booking/booking.module';
import { EventModule } from '../event/event.module';
import { TeamModule } from '../team/team.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [UsersModule, BookingModule, EventModule, TeamModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
