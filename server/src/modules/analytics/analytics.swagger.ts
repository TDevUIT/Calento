import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';
import {
    AnalyticsOverviewResponseDto,
    EventAnalyticsResponseDto,
    TimeUtilizationResponseDto,
    CategoryAnalyticsItemDto,
    TimeDistributionItemDto,
    BookingAnalyticsResponseDto,
    AttendeeAnalyticsResponseDto,
} from './dto/analytics.dto';

export const ApiGetOverview = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get analytics overview' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Analytics overview retrieved successfully',
            type: AnalyticsOverviewResponseDto,
            schema: {
                example: SwaggerExamples.Analytics.Overview.response,
            },
        }),
    );

export const ApiGetDetailedAnalytics = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get detailed analytics' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Detailed analytics retrieved successfully',
            schema: {
                example: SwaggerExamples.Analytics.Detailed.response,
            },
        }),
    );

export const ApiGetEventAnalytics = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get event analytics' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Event analytics retrieved successfully',
            type: EventAnalyticsResponseDto,
            schema: {
                example: SwaggerExamples.Analytics.Events.response,
            },
        }),
    );

export const ApiGetTimeUtilization = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get time utilization analytics' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Time utilization retrieved successfully',
            type: TimeUtilizationResponseDto,
            schema: {
                example: SwaggerExamples.Analytics.TimeUtilization.response,
            },
        }),
    );

export const ApiGetCategoryAnalytics = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get category analytics' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Category analytics retrieved successfully',
            type: [CategoryAnalyticsItemDto],
            schema: {
                example: SwaggerExamples.Analytics.Categories.response,
            },
        }),
    );

export const ApiGetTimeDistribution = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get time distribution analytics' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Time distribution retrieved successfully',
            type: [TimeDistributionItemDto],
            schema: {
                example: SwaggerExamples.Analytics.TimeDistribution.response,
            },
        }),
    );

export const ApiGetAttendeeAnalytics = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get attendee analytics' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Attendee analytics retrieved successfully',
            type: AttendeeAnalyticsResponseDto,
            schema: {
                example: SwaggerExamples.Analytics.Attendees.response,
            },
        }),
    );

export const ApiGetBookingAnalytics = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get booking analytics' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Booking analytics retrieved successfully',
            type: BookingAnalyticsResponseDto,
            schema: {
                example: SwaggerExamples.Analytics.Bookings.response,
            },
        }),
    );
