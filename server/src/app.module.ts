import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { CommonModule } from './common/common.module';
import { QueueModule } from './common/queue/queue.module';
import { HealthModule } from './modules/health/health.module';
import { EventModule } from './modules/event/event.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { GoogleModule } from './modules/google/google.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { BookingModule } from './modules/booking/booking.module';
import { BlogModule } from './modules/blog/blog.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { DebugController } from './debug-cors.controller';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ConfigModule,
    DatabaseModule,
    AuthModule,
    CommonModule,
    QueueModule,
    HealthModule,
    UsersModule,
    EventModule,
    CalendarModule,
    GoogleModule,
    WebhookModule,
    EmailModule,
    AvailabilityModule,
    BookingModule,
    BlogModule,
    EmailModule,
  ],
  controllers: [DebugController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
