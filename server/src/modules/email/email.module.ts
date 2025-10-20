import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { EmailController } from './email.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
