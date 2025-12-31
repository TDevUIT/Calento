import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';
import { TaskResponseDto } from './dto/task.dto';
import {
    SuccessResponseDto,
    PaginatedResponseDto,
} from '../../common/dto/base-response.dto';

export const ApiCreateTask = () =>
    applyDecorators(
        ApiOperation({ summary: 'Create a new task' }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Task created successfully',
            type: TaskResponseDto,
            schema: {
                example: SwaggerExamples.Task.Task.response,
            },
        }),
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Invalid task data',
        }),
    );

export const ApiGetUserTasks = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get all tasks for the current user' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Tasks retrieved successfully',
            type: PaginatedResponseDto,
            schema: {
                example: SwaggerExamples.Task.List.response,
            },
        }),
    );

export const ApiGetOverdueTasks = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get overdue tasks' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Overdue tasks retrieved successfully',
            type: PaginatedResponseDto,
            schema: {
                example: SwaggerExamples.Task.List.response,
            },
        }),
    );

export const ApiGetTaskStatistics = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get task statistics' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Task statistics retrieved successfully',
        }),
    );

export const ApiGetTaskById = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get task by ID' }),
        ApiParam({
            name: 'id',
            description: 'Task ID',
            type: String,
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Task retrieved successfully',
            type: TaskResponseDto,
            schema: {
                example: SwaggerExamples.Task.Task.response,
            },
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Task not found',
        }),
    );

export const ApiUpdateTask = () =>
    applyDecorators(
        ApiOperation({ summary: 'Update task (full replacement)' }),
        ApiParam({
            name: 'id',
            description: 'Task ID',
            type: String,
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Task updated successfully',
            type: TaskResponseDto,
            schema: {
                example: SwaggerExamples.Task.Task.response,
            },
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Task not found',
        }),
    );

export const ApiPartialUpdateTask = () =>
    applyDecorators(
        ApiOperation({ summary: 'Update task (partial update)' }),
        ApiParam({
            name: 'id',
            description: 'Task ID',
            type: String,
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Task updated successfully',
            type: TaskResponseDto,
            schema: {
                example: SwaggerExamples.Task.Task.response,
            },
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Task not found',
        }),
    );

export const ApiUpdateTaskStatus = () =>
    applyDecorators(
        ApiOperation({ summary: 'Update task status' }),
        ApiParam({
            name: 'id',
            description: 'Task ID',
            type: String,
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Task status updated successfully',
            type: TaskResponseDto,
            schema: {
                example: SwaggerExamples.Task.Task.response,
            },
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Task not found',
        }),
    );

export const ApiDeleteTask = () =>
    applyDecorators(
        HttpCode(HttpStatus.OK),
        ApiOperation({ summary: 'Delete task (soft delete)' }),
        ApiParam({
            name: 'id',
            description: 'Task ID',
            type: String,
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Task deleted successfully',
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Task not found',
        }),
    );

export const ApiRestoreTask = () =>
    applyDecorators(
        ApiOperation({ summary: 'Restore a soft-deleted task' }),
        ApiParam({
            name: 'id',
            description: 'Task ID',
            type: String,
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Task restored successfully',
            type: TaskResponseDto,
            schema: {
                example: SwaggerExamples.Task.Task.response,
            },
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Task not found',
        }),
    );
