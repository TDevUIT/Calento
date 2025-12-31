import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';
import {
    AvailabilityResponseDto,
    CheckAvailabilityResponseDto,
    TimeSlotResponseDto,
} from './dto/availability.dto';

export const ApiCreateAvailability = () =>
    applyDecorators(
        HttpCode(HttpStatus.CREATED),
        ApiOperation({
            summary: 'Create availability rule',
            description: 'Create a new availability rule for the current user',
        }),
        ApiResponse({
            status: 201,
            description: 'Availability rule created successfully',
            type: AvailabilityResponseDto,
            schema: {
                example: SwaggerExamples.Availability.Rule.response,
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Invalid input or overlapping time',
        }),
        ApiResponse({ status: 409, description: 'Overlapping availability rule' }),
    );

export const ApiBulkCreateAvailability = () =>
    applyDecorators(
        HttpCode(HttpStatus.CREATED),
        ApiOperation({
            summary: 'Bulk create availability rules',
            description: 'Create multiple availability rules at once',
        }),
        ApiResponse({
            status: 201,
            description: 'Availability rules created successfully',
            type: [AvailabilityResponseDto],
            schema: {
                example: SwaggerExamples.Availability.List.response,
            },
        }),
    );

export const ApiGetAvailabilities = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get all availability rules',
            description: 'Retrieve all availability rules for the current user',
        }),
        ApiResponse({
            status: 200,
            description: 'Availability rules retrieved successfully',
            type: [AvailabilityResponseDto],
            schema: {
                example: SwaggerExamples.Availability.List.response,
            },
        }),
    );

export const ApiGetActiveAvailabilities = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get active availability rules',
            description: 'Retrieve only active availability rules',
        }),
        ApiResponse({
            status: 200,
            description: 'Active availability rules retrieved successfully',
            type: [AvailabilityResponseDto],
            schema: {
                example: SwaggerExamples.Availability.List.response,
            },
        }),
    );

export const ApiGetWeeklySchedule = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get weekly schedule',
            description: 'Get availability rules organized by day of week',
        }),
        ApiResponse({
            status: 200,
            description: 'Weekly schedule retrieved successfully',
            schema: {
                example: SwaggerExamples.Availability.Schedule.response,
            },
        }),
    );

export const ApiGetAvailabilityById = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get availability rule by ID',
            description: 'Retrieve a specific availability rule',
        }),
        ApiResponse({
            status: 200,
            description: 'Availability rule retrieved successfully',
            type: AvailabilityResponseDto,
            schema: {
                example: SwaggerExamples.Availability.Rule.response,
            },
        }),
        ApiResponse({ status: 404, description: 'Availability rule not found' }),
    );

export const ApiUpdateAvailability = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Update availability rule',
            description: 'Update an existing availability rule',
        }),
        ApiResponse({
            status: 200,
            description: 'Availability rule updated successfully',
            type: AvailabilityResponseDto,
            schema: {
                example: SwaggerExamples.Availability.Rule.response,
            },
        }),
        ApiResponse({ status: 404, description: 'Availability rule not found' }),
        ApiResponse({ status: 409, description: 'Overlapping availability rule' }),
    );

export const ApiDeleteAvailability = () =>
    applyDecorators(
        HttpCode(HttpStatus.NO_CONTENT),
        ApiOperation({
            summary: 'Delete availability rule',
            description: 'Delete a specific availability rule',
        }),
        ApiResponse({
            status: 204,
            description: 'Availability rule deleted successfully',
        }),
        ApiResponse({ status: 404, description: 'Availability rule not found' }),
    );

export const ApiDeleteAllAvailabilities = () =>
    applyDecorators(
        HttpCode(HttpStatus.OK),
        ApiOperation({
            summary: 'Delete all availability rules',
            description: 'Delete all availability rules for the current user',
        }),
        ApiResponse({
            status: 200,
            description: 'All availability rules deleted successfully',
        }),
    );

export const ApiCheckAvailability = () =>
    applyDecorators(
        HttpCode(HttpStatus.OK),
        ApiOperation({
            summary: 'Check availability',
            description: 'Check if a user is available at a specific time',
        }),
        ApiResponse({
            status: 200,
            description: 'Availability check completed',
            type: CheckAvailabilityResponseDto,
        }),
        ApiResponse({ status: 400, description: 'Invalid date range' }),
    );

export const ApiInitializeDefaultRules = () =>
    applyDecorators(
        HttpCode(HttpStatus.CREATED),
        ApiOperation({
            summary: 'Initialize default availability rules',
            description:
                'Create default availability rules (Mon-Fri, 9 AM - 5 PM) for the current user',
        }),
        ApiResponse({
            status: 201,
            description: 'Default availability rules created successfully',
        }),
        ApiResponse({
            status: 409,
            description: 'User already has availability rules',
        }),
    );

export const ApiGetAvailableSlots = () =>
    applyDecorators(
        HttpCode(HttpStatus.OK),
        ApiOperation({
            summary: 'Get available time slots',
            description: 'Get all available time slots in a date range',
        }),
        ApiResponse({
            status: 200,
            description: 'Available slots retrieved successfully',
            type: [TimeSlotResponseDto],
            schema: {
                example: SwaggerExamples.Availability.Slots.response,
            },
        }),
        ApiResponse({ status: 400, description: 'Invalid date range' }),
        ApiResponse({ status: 404, description: 'No availability rules found' }),
    );
