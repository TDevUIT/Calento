import { Module } from '@nestjs/common';
import { PriorityController } from './controllers/priority.controller';
import { PriorityService } from './services/priority.service';
import { PriorityRepository } from './repositories/priority.repository';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [PriorityController],
  providers: [PriorityService, PriorityRepository],
  exports: [PriorityService, PriorityRepository],
})
export class PriorityModule {}
