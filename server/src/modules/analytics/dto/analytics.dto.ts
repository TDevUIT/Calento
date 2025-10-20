import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsDateString, IsOptional, IsString } from 'class-validator';
import { AnalyticsPeriod, AnalyticsMetric } from '../interfaces/analytics.interface';

export class AnalyticsQueryDto {
  @ApiProperty({
    description: 'Start date for analytics period',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  start_date: string;

  @ApiProperty({
    description: 'End date for analytics period',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  end_date: string;

  @ApiPropertyOptional({
    description: 'Calendar ID to filter analytics',
    example: 'uuid-here',
  })
  @IsOptional()
  @IsString()
  calendar_id?: string;
}

export class TimeDistributionQueryDto extends AnalyticsQueryDto {
  @ApiProperty({
    description: 'Period for time distribution grouping',
    enum: AnalyticsPeriod,
    example: AnalyticsPeriod.DAY,
  })
  @IsEnum(AnalyticsPeriod)
  period: AnalyticsPeriod;

  @ApiPropertyOptional({
    description: 'Metric to analyze',
    enum: AnalyticsMetric,
    example: AnalyticsMetric.EVENTS,
  })
  @IsOptional()
  @IsEnum(AnalyticsMetric)
  metric?: AnalyticsMetric;
}

export class CategoryAnalyticsQueryDto extends AnalyticsQueryDto {
  @ApiPropertyOptional({
    description: 'Limit number of categories returned',
    example: 10,
  })
  @IsOptional()
  limit?: number;
}

export class EventAnalyticsResponseDto {
  @ApiProperty({ example: 150 })
  total_events: number;

  @ApiProperty({ example: 45 })
  upcoming_events: number;

  @ApiProperty({ example: 105 })
  past_events: number;

  @ApiProperty({ example: 12 })
  recurring_events: number;

  @ApiProperty({ example: 8 })
  events_this_week: number;

  @ApiProperty({ example: 32 })
  events_this_month: number;
}

export class TimeUtilizationResponseDto {
  @ApiProperty({ example: 168 })
  total_hours: number;

  @ApiProperty({ example: 45.5 })
  scheduled_hours: number;

  @ApiProperty({ example: 122.5 })
  free_hours: number;

  @ApiProperty({ example: 27.08 })
  utilization_rate: number;

  @ApiProperty({ example: 'Monday' })
  busiest_day: string;

  @ApiProperty({ example: 14 })
  busiest_hour: number;
}

export class CategoryAnalyticsItemDto {
  @ApiProperty()
  calendar_id: string;

  @ApiPropertyOptional()
  calendar_name?: string;

  @ApiProperty()
  event_count: number;

  @ApiProperty()
  total_duration_hours: number;
}

export class TimeDistributionItemDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  duration_hours: number;
}

export class BookingAnalyticsResponseDto {
  @ApiProperty({ example: 100 })
  total_bookings: number;

  @ApiProperty({ example: 75 })
  confirmed_bookings: number;

  @ApiProperty({ example: 10 })
  cancelled_bookings: number;

  @ApiProperty({ example: 5 })
  pending_bookings: number;

  @ApiProperty({ example: 10 })
  completed_bookings: number;

  @ApiProperty({ example: 75.0 })
  booking_rate: number;

  @ApiProperty({ example: 10.0 })
  cancellation_rate: number;

  @ApiProperty({ type: [Object] })
  top_booking_links: {
    id: string;
    title: string;
    booking_count: number;
  }[];
}

export class AttendeeAnalyticsResponseDto {
  @ApiProperty({ example: 250 })
  total_attendees: number;

  @ApiProperty({ example: 85 })
  unique_attendees: number;

  @ApiProperty({ example: 2.94 })
  average_per_event: number;

  @ApiProperty({ type: [Object] })
  top_attendees: {
    email: string;
    name?: string;
    event_count: number;
  }[];
}

export class AnalyticsOverviewResponseDto {
  @ApiProperty({ type: EventAnalyticsResponseDto })
  event_analytics: EventAnalyticsResponseDto;

  @ApiProperty({ type: TimeUtilizationResponseDto })
  time_utilization: TimeUtilizationResponseDto;

  @ApiProperty({ type: [CategoryAnalyticsItemDto] })
  top_categories: CategoryAnalyticsItemDto[];

  @ApiProperty({ type: [TimeDistributionItemDto] })
  recent_activity: TimeDistributionItemDto[];
}
