import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';

export const ApiCreateUser = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a new user',
      description: 'Create a new user account - Public endpoint for initial setup',
    }),
    ApiResponse({
      status: 201,
      description: 'User created successfully',
      schema: {
        example: SwaggerExamples.Users.Create.response,
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Validation failed - Invalid input data',
      schema: {
        example: SwaggerExamples.Errors.ValidationError,
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Email or username already exists',
      schema: {
        example: {
          success: false,
          error: 'Conflict',
          message: 'Email already exists',
          statusCode: 409,
        },
      },
    }),
  );

export const ApiGetUsers = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all users with pagination',
      description: 'Retrieve paginated list of users with search and filtering',
    }),
    ApiResponse({
      status: 200,
      description: 'Users retrieved successfully with pagination',
      schema: {
        example: SwaggerExamples.Users.List.response,
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or expired token',
      schema: {
        example: SwaggerExamples.Errors.Unauthorized,
      },
    }),
  );

export const ApiSearchUsers = () =>
  applyDecorators(
    ApiOperation({ summary: 'Search users by email or username' }),
    ApiResponse({ status: 200, description: 'Users found successfully' }),
  );

export const ApiGetUserSettings = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get current user settings' }),
    ApiResponse({
      status: 200,
      description: 'User settings retrieved successfully',
    }),
  );

export const ApiUpdateUserSettings = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update current user settings' }),
    ApiResponse({
      status: 200,
      description: 'User settings updated successfully',
    }),
  );

export const ApiGetUserById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get user by ID' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({
      status: 200,
      description: 'User found successfully',
    }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );

export const ApiUpdateUserById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update user' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({
      status: 200,
      description: 'User updated successfully',
    }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );

export const ApiDeactivateUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Deactivate user (soft delete)' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({ status: 200, description: 'User deactivated successfully' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );

export const ApiDeleteUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete user permanently' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({ status: 200, description: 'User deleted successfully' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );