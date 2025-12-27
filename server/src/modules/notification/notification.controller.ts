import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('schedule-reminders')
  @ApiOperation({
    summary: 'Schedule event reminder notifications for current user',
    description:
      'Creates notification rows for upcoming events based on their reminders settings',
  })
  @ApiQuery({ name: 'horizonDays', required: false, type: Number, example: 30 })
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
  @ApiOperation({
    summary: 'List pending notifications for current user (email channel)',
    description:
      'Lists not-yet-sent email reminders for events owned by current user',
  })
  async getPending(@CurrentUserId() userId: string) {
    return this.notificationService.getPendingEmailNotifications(userId);
  }
}
