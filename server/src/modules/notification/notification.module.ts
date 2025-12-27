import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { DatabaseModule } from '../../database/database.module';
import { EventModule } from '../event/event.module';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  imports: [DatabaseModule, EventModule, EmailModule],
})
export class NotificationModule {}
