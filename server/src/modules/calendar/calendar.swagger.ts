import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiExtraModels,
    ApiBearerAuth,
    ApiCookieAuth,
} from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';
import {
    CalendarResponseDto,
    CreateCalendarDto,
    UpdateCalendarDto,
} from './dto/calendar.dto';
import {
    SuccessResponseDto,
    PaginatedResponseDto,
} from '../../common/dto/base-response.dto';

export const ApiCalendarDocs = () =>
    applyDecorators(
        ApiExtraModels(
            CalendarResponseDto,
            CreateCalendarDto,
            UpdateCalendarDto,
            SuccessResponseDto,
            PaginatedResponseDto,
        ),
        ApiBearerAuth('bearer'),
        ApiCookieAuth('cookie'),
    );

export const ApiGetCalendars = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get user calendars with pagination',
            description:
                'Retrieve paginated list of calendars with filtering, search, and sorting. ' +
                'Supports filtering by primary status, timezone, and search by name/description.',
        }),
        ApiResponse({
            status: 200,
            description: 'Calendars retrieved successfully',
            type: PaginatedResponseDto,
            schema: {
                example: SwaggerExamples.Calendar.List.response,
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Unauthorized - Invalid or expired token',
        }),
    );

export const ApiGetPrimaryCalendar = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get user primary calendar',
            description: 'Retrieve the primary calendar for the authenticated user',
        }),
        ApiResponse({
            status: 200,
            description: 'Primary calendar retrieved successfully',
            type: SuccessResponseDto,
            schema: {
                example: SwaggerExamples.Calendar.Calendar.response,
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Primary calendar not found',
        }),
    );

export const ApiSearchCalendars = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Search calendars',
            description: 'Search calendars by name or description',
        }),
        ApiResponse({
            status: 200,
            description: 'Search results retrieved successfully',
            type: PaginatedResponseDto,
            schema: {
                example: SwaggerExamples.Calendar.List.response,
            },
        }),
    );

export const ApiGetCalendarById = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get calendar by ID',
            description: 'Retrieve a specific calendar by its ID',
        }),
        ApiParam({
            name: 'id',
            description: 'Calendar UUID',
            example: '123e4567-e89b-12d3-a456-426614174000',
        }),
        ApiResponse({
            status: 200,
            description: 'Calendar retrieved successfully',
            type: SuccessResponseDto,
            schema: {
                example: SwaggerExamples.Calendar.Calendar.response,
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Calendar not found',
        }),
    );

export const ApiCreateCalendar = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Create a new calendar',
            description: 'Create a new calendar with Google Calendar integration',
        }),
        ApiResponse({
            status: 201,
            description: 'Calendar created successfully',
            type: SuccessResponseDto,
            schema: {
                example: SwaggerExamples.Calendar.Calendar.response,
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Validation failed - Invalid input data',
        }),
        ApiResponse({
            status: 409,
            description: 'Duplicate calendar - Google Calendar ID already exists',
        }),
    );

export const ApiUpdateCalendar = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Update calendar',
            description: 'Update an existing calendar',
        }),
        ApiParam({
            name: 'id',
            description: 'Calendar UUID',
            example: '123e4567-e89b-12d3-a456-426614174000',
        }),
        ApiResponse({
            status: 200,
            description: 'Calendar updated successfully',
            type: SuccessResponseDto,
            schema: {
                example: SwaggerExamples.Calendar.Calendar.response,
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Calendar not found',
        }),
    );

export const ApiDeleteCalendar = () =>
    applyDecorators(
        HttpCode(HttpStatus.OK),
        ApiOperation({
            summary: 'Delete calendar',
            description: 'Delete a calendar permanently',
        }),
        ApiParam({
            name: 'id',
            description: 'Calendar UUID',
            example: '123e4567-e89b-12d3-a456-426614174000',
        }),
        ApiResponse({
            status: 200,
            description: 'Calendar deleted successfully',
            type: SuccessResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Calendar not found',
        }),
    );
