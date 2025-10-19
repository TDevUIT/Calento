import { Injectable, Logger } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';
import { UserValidationService } from '../../common/services/user-validation.service';
import { MessageService } from '../../common/message/message.service';
import {
  AnalyticsOverview,
  DetailedAnalytics,
  EventAnalytics,
  TimeUtilization,
  CategoryAnalytics,
  TimeDistribution,
  AttendeeAnalytics,
  BookingAnalytics,
  AnalyticsPeriod,
} from './interfaces/analytics.interface';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private analyticsRepository: AnalyticsRepository,
    private userValidationService: UserValidationService,
    private messageService: MessageService,
  ) {}

  async getOverview(
    userId: string,
    startDate: Date,
    endDate: Date,
    calendarId?: string,
  ): Promise<AnalyticsOverview> {
    await this.userValidationService.validateUserExists(userId);

    try {
      const [eventAnalytics, timeUtilization, topCategories, recentActivity] =
        await Promise.all([
          this.analyticsRepository.getEventAnalytics(
            userId,
            startDate,
            endDate,
            calendarId,
          ),
          this.analyticsRepository.getTimeUtilization(
            userId,
            startDate,
            endDate,
            calendarId,
          ),
          this.analyticsRepository.getCategoryAnalytics(
            userId,
            startDate,
            endDate,
            5,
          ),
          this.analyticsRepository.getTimeDistribution(
            userId,
            startDate,
            endDate,
            AnalyticsPeriod.DAY,
            calendarId,
          ),
        ]);

      return {
        event_analytics: eventAnalytics,
        time_utilization: timeUtilization,
        top_categories: topCategories,
        recent_activity: recentActivity.slice(-7),
      };
    } catch (error) {
      this.logger.error('Failed to get analytics overview:', error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  async getDetailedAnalytics(
    userId: string,
    startDate: Date,
    endDate: Date,
    calendarId?: string,
  ): Promise<DetailedAnalytics> {
    await this.userValidationService.validateUserExists(userId);

    try {
      const [
        eventAnalytics,
        timeUtilization,
        topCategories,
        recentActivity,
        attendeeAnalytics,
        bookingAnalytics,
        dailyDistribution,
        weeklyDistribution,
        monthlyDistribution,
      ] = await Promise.all([
        this.analyticsRepository.getEventAnalytics(
          userId,
          startDate,
          endDate,
          calendarId,
        ),
        this.analyticsRepository.getTimeUtilization(
          userId,
          startDate,
          endDate,
          calendarId,
        ),
        this.analyticsRepository.getCategoryAnalytics(
          userId,
          startDate,
          endDate,
          10,
        ),
        this.analyticsRepository.getTimeDistribution(
          userId,
          startDate,
          endDate,
          AnalyticsPeriod.DAY,
          calendarId,
        ),
        this.analyticsRepository.getAttendeeAnalytics(
          userId,
          startDate,
          endDate,
          calendarId,
        ),
        this.analyticsRepository.getBookingAnalytics(
          userId,
          startDate,
          endDate,
        ),
        this.analyticsRepository.getTimeDistribution(
          userId,
          startDate,
          endDate,
          AnalyticsPeriod.DAY,
          calendarId,
        ),
        this.analyticsRepository.getTimeDistribution(
          userId,
          startDate,
          endDate,
          AnalyticsPeriod.WEEK,
          calendarId,
        ),
        this.analyticsRepository.getTimeDistribution(
          userId,
          startDate,
          endDate,
          AnalyticsPeriod.MONTH,
          calendarId,
        ),
      ]);

      return {
        event_analytics: eventAnalytics,
        time_utilization: timeUtilization,
        top_categories: topCategories,
        recent_activity: recentActivity.slice(-7),
        attendee_analytics: attendeeAnalytics,
        booking_analytics: bookingAnalytics,
        daily_distribution: dailyDistribution,
        weekly_distribution: weeklyDistribution,
        monthly_distribution: monthlyDistribution,
      };
    } catch (error) {
      this.logger.error('Failed to get detailed analytics:', error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  async getEventAnalytics(
    userId: string,
    startDate: Date,
    endDate: Date,
    calendarId?: string,
  ): Promise<EventAnalytics> {
    await this.userValidationService.validateUserExists(userId);
    return this.analyticsRepository.getEventAnalytics(
      userId,
      startDate,
      endDate,
      calendarId,
    );
  }

  async getTimeUtilization(
    userId: string,
    startDate: Date,
    endDate: Date,
    calendarId?: string,
  ): Promise<TimeUtilization> {
    await this.userValidationService.validateUserExists(userId);
    return this.analyticsRepository.getTimeUtilization(
      userId,
      startDate,
      endDate,
      calendarId,
    );
  }

  async getCategoryAnalytics(
    userId: string,
    startDate: Date,
    endDate: Date,
    limit?: number,
  ): Promise<CategoryAnalytics[]> {
    await this.userValidationService.validateUserExists(userId);
    return this.analyticsRepository.getCategoryAnalytics(
      userId,
      startDate,
      endDate,
      limit,
    );
  }

  async getTimeDistribution(
    userId: string,
    startDate: Date,
    endDate: Date,
    period: AnalyticsPeriod,
    calendarId?: string,
  ): Promise<TimeDistribution[]> {
    await this.userValidationService.validateUserExists(userId);
    return this.analyticsRepository.getTimeDistribution(
      userId,
      startDate,
      endDate,
      period,
      calendarId,
    );
  }

  async getAttendeeAnalytics(
    userId: string,
    startDate: Date,
    endDate: Date,
    calendarId?: string,
  ): Promise<AttendeeAnalytics> {
    await this.userValidationService.validateUserExists(userId);
    return this.analyticsRepository.getAttendeeAnalytics(
      userId,
      startDate,
      endDate,
      calendarId,
    );
  }

  async getBookingAnalytics(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<BookingAnalytics> {
    await this.userValidationService.validateUserExists(userId);
    return this.analyticsRepository.getBookingAnalytics(
      userId,
      startDate,
      endDate,
    );
  }
}
