import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import { SuccessResponseDto } from '../../common/dto/base-response.dto';
import { MessageService } from '../../common/message/message.service';
import {
  AnalyticsQueryDto,
  TimeDistributionQueryDto,
  CategoryAnalyticsQueryDto,
  AnalyticsOverviewResponseDto,
  EventAnalyticsResponseDto,
  TimeUtilizationResponseDto,
  CategoryAnalyticsItemDto,
  TimeDistributionItemDto,
  BookingAnalyticsResponseDto,
  AttendeeAnalyticsResponseDto,
} from './dto/analytics.dto';
import {
  ApiGetOverview,
  ApiGetDetailedAnalytics,
  ApiGetEventAnalytics,
  ApiGetTimeUtilization,
  ApiGetCategoryAnalytics,
  ApiGetTimeDistribution,
  ApiGetAttendeeAnalytics,
  ApiGetBookingAnalytics,
} from './analytics.swagger';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService,
    private messageService: MessageService,
  ) { }

  @Get('overview')
  @ApiGetOverview()
  async getOverview(
    @CurrentUserId() userId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<SuccessResponseDto<AnalyticsOverviewResponseDto>> {
    const result = await this.analyticsService.getOverview(
      userId,
      new Date(query.start_date),
      new Date(query.end_date),
      query.calendar_id,
    );

    return new SuccessResponseDto(
      this.messageService.get('analytics.overview_retrieved'),
      result,
    );
  }

  @Get('detailed')
  @ApiGetDetailedAnalytics()
  async getDetailedAnalytics(
    @CurrentUserId() userId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<SuccessResponseDto> {
    const result = await this.analyticsService.getDetailedAnalytics(
      userId,
      new Date(query.start_date),
      new Date(query.end_date),
      query.calendar_id,
    );

    return new SuccessResponseDto(
      this.messageService.get('analytics.detailed_retrieved'),
      result,
    );
  }

  @Get('events')
  @ApiGetEventAnalytics()
  async getEventAnalytics(
    @CurrentUserId() userId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<SuccessResponseDto<EventAnalyticsResponseDto>> {
    const result = await this.analyticsService.getEventAnalytics(
      userId,
      new Date(query.start_date),
      new Date(query.end_date),
      query.calendar_id,
    );

    return new SuccessResponseDto(
      this.messageService.get('analytics.events_retrieved'),
      result,
    );
  }

  @Get('time-utilization')
  @ApiGetTimeUtilization()
  async getTimeUtilization(
    @CurrentUserId() userId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<SuccessResponseDto<TimeUtilizationResponseDto>> {
    const result = await this.analyticsService.getTimeUtilization(
      userId,
      new Date(query.start_date),
      new Date(query.end_date),
      query.calendar_id,
    );

    return new SuccessResponseDto(
      this.messageService.get('analytics.time_utilization_retrieved'),
      result,
    );
  }

  @Get('categories')
  @ApiGetCategoryAnalytics()
  async getCategoryAnalytics(
    @CurrentUserId() userId: string,
    @Query() query: CategoryAnalyticsQueryDto,
  ): Promise<SuccessResponseDto<CategoryAnalyticsItemDto[]>> {
    const result = await this.analyticsService.getCategoryAnalytics(
      userId,
      new Date(query.start_date),
      new Date(query.end_date),
      query.limit,
    );

    return new SuccessResponseDto(
      this.messageService.get('analytics.categories_retrieved'),
      result,
    );
  }

  @Get('time-distribution')
  @ApiGetTimeDistribution()
  async getTimeDistribution(
    @CurrentUserId() userId: string,
    @Query() query: TimeDistributionQueryDto,
  ): Promise<SuccessResponseDto<TimeDistributionItemDto[]>> {
    const result = await this.analyticsService.getTimeDistribution(
      userId,
      new Date(query.start_date),
      new Date(query.end_date),
      query.period,
      query.calendar_id,
    );

    return new SuccessResponseDto(
      this.messageService.get('analytics.time_distribution_retrieved'),
      result,
    );
  }

  @Get('attendees')
  @ApiGetAttendeeAnalytics()
  async getAttendeeAnalytics(
    @CurrentUserId() userId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<SuccessResponseDto<AttendeeAnalyticsResponseDto>> {
    const result = await this.analyticsService.getAttendeeAnalytics(
      userId,
      new Date(query.start_date),
      new Date(query.end_date),
      query.calendar_id,
    );

    return new SuccessResponseDto(
      this.messageService.get('analytics.attendees_retrieved'),
      result,
    );
  }

  @Get('bookings')
  @ApiGetBookingAnalytics()
  async getBookingAnalytics(
    @CurrentUserId() userId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<SuccessResponseDto<BookingAnalyticsResponseDto>> {
    const result = await this.analyticsService.getBookingAnalytics(
      userId,
      new Date(query.start_date),
      new Date(query.end_date),
    );

    return new SuccessResponseDto(
      this.messageService.get('analytics.bookings_retrieved'),
      result,
    );
  }
}
