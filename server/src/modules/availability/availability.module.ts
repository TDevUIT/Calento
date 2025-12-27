import { Module } from '@nestjs/common';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './services/availability.service';
import { AvailabilityRepository } from './repositories/availability.repository';
import { DatabaseModule } from '../../database/database.module';
import { CommonModule } from '../../common/common.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, CommonModule, UsersModule],
  controllers: [AvailabilityController],
  providers: [AvailabilityService, AvailabilityRepository],
  exports: [AvailabilityService, AvailabilityRepository],
})
export class AvailabilityModule {}
