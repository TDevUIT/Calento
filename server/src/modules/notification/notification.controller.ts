import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import { NotificationService } from './notification.service';
import {
  ApiScheduleReminders,
  ApiGetPendingNotifications,
} from './notification.swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post('schedule-reminders')
  @ApiScheduleReminders()
  async scheduleReminders(
    @CurrentUserId() userId: string,
    @Query('horizonDays') horizonDays?: string,
  ) {
    const days = horizonDays ? Number(horizonDays) : 30;
    return this.notificationService.scheduleEventReminderNotifications(
      userId,
      days,
    );
  }

  @Get('pending')
  @ApiGetPendingNotifications()
  async getPending(@CurrentUserId() userId: string) {
    return this.notificationService.getPendingEmailNotifications(userId);
  }
}
