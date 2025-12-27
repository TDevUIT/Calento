import { Controller, Get, Query, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
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

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService,
    private messageService: MessageService,
  ) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get analytics overview' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analytics overview retrieved successfully',
    type: AnalyticsOverviewResponseDto,
  })
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
      HttpStatus.OK,
    );
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Get detailed analytics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detailed analytics retrieved successfully',
  })
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
      HttpStatus.OK,
    );
  }

  @Get('events')
  @ApiOperation({ summary: 'Get event analytics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event analytics retrieved successfully',
    type: EventAnalyticsResponseDto,
  })
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
      HttpStatus.OK,
    );
  }

  @Get('time-utilization')
  @ApiOperation({ summary: 'Get time utilization analytics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Time utilization retrieved successfully',
    type: TimeUtilizationResponseDto,
  })
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
      HttpStatus.OK,
    );
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get category analytics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category analytics retrieved successfully',
    type: [CategoryAnalyticsItemDto],
  })
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
      HttpStatus.OK,
    );
  }

  @Get('time-distribution')
  @ApiOperation({ summary: 'Get time distribution analytics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Time distribution retrieved successfully',
    type: [TimeDistributionItemDto],
  })
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
      HttpStatus.OK,
    );
  }

  @Get('attendees')
  @ApiOperation({ summary: 'Get attendee analytics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attendee analytics retrieved successfully',
    type: AttendeeAnalyticsResponseDto,
  })
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
      HttpStatus.OK,
    );
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get booking analytics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Booking analytics retrieved successfully',
    type: BookingAnalyticsResponseDto,
  })
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
      HttpStatus.OK,
    );
  }
}
