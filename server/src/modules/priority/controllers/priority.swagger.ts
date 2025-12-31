import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { SwaggerExamples } from '../../../common/swagger/swagger-examples';
import { PriorityResponseDto } from '../dto/priority.dto';

export const ApiGetUserPriorities = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get all priorities for the current user' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Returns all user priorities',
            type: [PriorityResponseDto],
            schema: {
                example: SwaggerExamples.Priority.List.response,
            },
        }),
    );

export const ApiGetItemPriority = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get priority for a specific item' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Returns priority for the specified item',
            type: PriorityResponseDto,
            schema: {
                example: SwaggerExamples.Priority.Item.response,
            },
        }),
        ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Priority not found' }),
    );

export const ApiGetPrioritiesByLevel = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get all items with a specific priority level' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Returns all items with the specified priority',
            type: [PriorityResponseDto],
            schema: {
                example: SwaggerExamples.Priority.List.response,
            },
        }),
    );

export const ApiGetPrioritiesByType = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get all priorities for a specific item type' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Returns all priorities for the specified item type',
            type: [PriorityResponseDto],
            schema: {
                example: SwaggerExamples.Priority.List.response,
            },
        }),
    );

export const ApiUpdatePriority = () =>
    applyDecorators(
        HttpCode(HttpStatus.OK),
        ApiOperation({ summary: 'Update priority for a single item' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Priority updated successfully',
            type: PriorityResponseDto,
            schema: {
                example: SwaggerExamples.Priority.Item.response,
            },
        }),
    );

export const ApiBulkUpdatePriorities = () =>
    applyDecorators(
        HttpCode(HttpStatus.OK),
        ApiOperation({ summary: 'Bulk update priorities for multiple items' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Priorities updated successfully',
            type: [PriorityResponseDto],
            schema: {
                example: SwaggerExamples.Priority.List.response,
            },
        }),
    );

export const ApiDeletePriority = () =>
    applyDecorators(
        HttpCode(HttpStatus.OK),
        ApiOperation({ summary: 'Delete priority for a specific item' }),
        ApiResponse({ status: HttpStatus.OK, description: 'Priority deleted successfully' }),
        ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Priority not found' }),
    );

export const ApiResetPriorities = () =>
    applyDecorators(
        HttpCode(HttpStatus.OK),
        ApiOperation({ summary: 'Reset all priorities for the current user' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'All priorities reset successfully',
        }),
    );
