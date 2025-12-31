import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';
import {
    BookingLinkResponseDto,
    BookingResponseDto,
    BookingTimeSlotResponseDto,
} from './dto/booking.dto';

// Booking Link Decorators

export const ApiCreateBookingLink = () =>
    applyDecorators(
        HttpCode(HttpStatus.CREATED),
        ApiOperation({
            summary: 'Create booking link',
            description: 'Create a new public booking link',
        }),
        ApiResponse({
            status: 201,
            description: 'Booking link created successfully',
            type: BookingLinkResponseDto,
            schema: {
                example: SwaggerExamples.Booking.Link.response,
            },
        }),
        ApiResponse({ status: 409, description: 'Slug already exists' }),
    );

export const ApiGetBookingLinks = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get all booking links',
            description: 'Retrieve all booking links for the current user',
        }),
        ApiResponse({
            status: 200,
            description: 'Booking links retrieved successfully',
            type: [BookingLinkResponseDto],
            schema: {
                example: [SwaggerExamples.Booking.Link.response],
            },
        }),
    );

export const ApiGetActiveBookingLinks = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get active booking links',
            description: 'Retrieve only active booking links',
        }),
        ApiResponse({
            status: 200,
            description: 'Active booking links retrieved successfully',
            type: [BookingLinkResponseDto],
            schema: {
                example: [SwaggerExamples.Booking.Link.response],
            },
        }),
    );

export const ApiGetBookingLinkById = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get booking link by ID',
            description: 'Retrieve a specific booking link',
        }),
        ApiResponse({
            status: 200,
            description: 'Booking link retrieved successfully',
            type: BookingLinkResponseDto,
            schema: {
                example: SwaggerExamples.Booking.Link.response,
            },
        }),
        ApiResponse({ status: 404, description: 'Booking link not found' }),
    );

export const ApiUpdateBookingLink = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Update booking link',
            description: 'Update an existing booking link',
        }),
        ApiResponse({
            status: 200,
            description: 'Booking link updated successfully',
            type: BookingLinkResponseDto,
            schema: {
                example: SwaggerExamples.Booking.Link.response,
            },
        }),
        ApiResponse({ status: 404, description: 'Booking link not found' }),
    );

export const ApiDeleteBookingLink = () =>
    applyDecorators(
        HttpCode(HttpStatus.NO_CONTENT),
        ApiOperation({
            summary: 'Delete booking link',
            description: 'Delete a booking link',
        }),
        ApiResponse({
            status: 204,
            description: 'Booking link deleted successfully',
        }),
        ApiResponse({ status: 404, description: 'Booking link not found' }),
    );

export const ApiGetBookingsByLink = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get bookings for link',
            description: 'Retrieve all bookings for a specific booking link',
        }),
        ApiResponse({
            status: 200,
            description: 'Bookings retrieved successfully',
            type: [BookingResponseDto],
            schema: {
                example: [SwaggerExamples.Booking.Booking.response],
            },
        }),
    );

// Booking Decorators

export const ApiGetPublicBookingLink = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get public booking link',
            description: 'Get booking link details by slug (Public)',
        }),
        ApiParam({ name: 'slug', description: 'Booking link slug' }),
        ApiResponse({
            status: 200,
            description: 'Booking link retrieved successfully',
            type: BookingLinkResponseDto,
            schema: {
                example: SwaggerExamples.Booking.Link.response,
            },
        }),
        ApiResponse({ status: 404, description: 'Booking link not found' }),
    );

export const ApiCreateBooking = () =>
    applyDecorators(
        HttpCode(HttpStatus.CREATED),
        ApiOperation({
            summary: 'Create booking (Public)',
            description: 'Create a new booking for a public booking link',
        }),
        ApiParam({ name: 'slug', description: 'Booking link slug' }),
        ApiResponse({
            status: 201,
            description: 'Booking created successfully',
            type: BookingResponseDto,
            schema: {
                example: SwaggerExamples.Booking.Booking.response,
            },
        }),
        ApiResponse({ status: 400, description: 'Invalid booking time' }),
        ApiResponse({ status: 404, description: 'Booking link not found' }),
    );

export const ApiGetAvailableSlotsPublic = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get available slots (Public)',
            description: 'Get available time slots for a booking link',
        }),
        ApiParam({ name: 'slug', description: 'Booking link slug' }),
        ApiResponse({
            status: 200,
            description: 'Available slots retrieved successfully',
            type: [BookingTimeSlotResponseDto],
            schema: {
                example: SwaggerExamples.Availability.Slots.response, // Reuse slots example
            },
        }),
    );

export const ApiGetBookingStats = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Get booking statistics',
            description: 'Retrieve booking statistics for the current user',
        }),
        ApiResponse({
            status: 200,
            description: 'Booking stats retrieved successfully',
        }),
    );

export const ApiGetMyBookings = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Get my bookings',
            description: 'Retrieve all bookings for the current user',
        }),
        ApiResponse({
            status: 200,
            description: 'Bookings retrieved successfully',
            type: [BookingResponseDto],
            schema: {
                example: [SwaggerExamples.Booking.Booking.response],
            },
        }),
    );

export const ApiGetUpcomingBookings = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Get upcoming bookings',
            description: 'Retrieve upcoming bookings for the current user',
        }),
        ApiResponse({
            status: 200,
            description: 'Upcoming bookings retrieved successfully',
            type: [BookingResponseDto],
            schema: {
                example: [SwaggerExamples.Booking.Booking.response],
            },
        }),
    );

export const ApiGetBookingById = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Get booking by ID',
            description: 'Retrieve a specific booking',
        }),
        ApiResponse({
            status: 200,
            description: 'Booking retrieved successfully',
            type: BookingResponseDto,
            schema: {
                example: SwaggerExamples.Booking.Booking.response,
            },
        }),
        ApiResponse({ status: 404, description: 'Booking not found' }),
    );

export const ApiCancelBooking = () =>
    applyDecorators(
        ApiBearerAuth(),
        HttpCode(HttpStatus.OK),
        ApiOperation({
            summary: 'Cancel booking',
            description: 'Cancel an existing booking',
        }),
        ApiResponse({
            status: 200,
            description: 'Booking cancelled successfully',
            type: BookingResponseDto,
            schema: {
                example: { ...SwaggerExamples.Booking.Booking.response, status: 'cancelled' },
            },
        }),
        ApiResponse({ status: 404, description: 'Booking not found' }),
    );

export const ApiRescheduleBooking = () =>
    applyDecorators(
        ApiBearerAuth(),
        HttpCode(HttpStatus.OK),
        ApiOperation({
            summary: 'Reschedule booking',
            description: 'Reschedule an existing booking to a new time',
        }),
        ApiResponse({
            status: 200,
            description: 'Booking rescheduled successfully',
            type: BookingResponseDto,
            schema: {
                example: SwaggerExamples.Booking.Booking.response,
            },
        }),
        ApiResponse({ status: 404, description: 'Booking not found' }),
    );
