import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MessageModule } from './message/message.module';
import { MessageService } from './message/message.service';
import { HttpExceptionFilter } from './filters/http-filter';
import { ValidationFilter } from './filters/validation.filter';
import { LoggingFilter } from './filters/logging.filter';
import { RateLimitFilter } from './filters/rate-limit.filter';
import { RequestIdInterceptor } from './interceptors/request-id.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { PaginationService } from './services/pagination.service';
import { UserValidationService } from './services/user-validation.service';
import { CalendarValidationService } from './services/calendar-validation.service';
import { EventValidationService } from './services/event-validation.service';
import { PasswordService } from './services/password.service';
import { CurrentUserService } from './services/current-user.service';
import { RecurringEventsService } from './services/recurring-events.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Global()
@Module({
  imports: [MessageModule],
  providers: [
    PaginationService,
    UserValidationService,
    CalendarValidationService,
    EventValidationService,
    PasswordService,
    CurrentUserService,
    RecurringEventsService,
    JwtAuthGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestIdInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (messageService: MessageService) => new ResponseInterceptor(messageService),
      inject: [MessageService],
    },
    {
      provide: APP_FILTER,
      useClass: LoggingFilter,
    },
    {
      provide: APP_FILTER,
      useFactory: (messageService: MessageService) => new HttpExceptionFilter(messageService),
      inject: [MessageService],
    },
    {
      provide: APP_FILTER,
      useFactory: (messageService: MessageService) => new ValidationFilter(messageService),
      inject: [MessageService],
    },
    {
      provide: APP_FILTER,
      useFactory: (messageService: MessageService) => new RateLimitFilter(messageService),
      inject: [MessageService],
    },
  ],
  exports: [MessageModule, PaginationService, UserValidationService, CalendarValidationService, EventValidationService, PasswordService, CurrentUserService, RecurringEventsService, JwtAuthGuard],
})
export class CommonModule {}
