import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiCookieAuth } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';
import { SuccessResponseDto } from '../../common/dto/base-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

export const ApiRegister = () =>
    applyDecorators(
        ApiOperation({
            summary: '📝 Register new user',
            description: 'Create a new user account with secure authentication',
        }),
        ApiResponse({
            status: 201,
            description: 'User successfully registered',
            schema: {
                example: SwaggerExamples.Auth.Register.response,
            },
        }),
        ApiResponse({ status: 409, description: 'Email already registered' }),
        ApiResponse({ status: 400, description: 'Validation failed' }),
    );

export const ApiLogin = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Log in user',
            description: 'Authenticate user and return JWT tokens',
        }),
        ApiResponse({
            status: 200,
            description: 'User successfully logged in',
            schema: {
                example: SwaggerExamples.Auth.Login.response,
            },
        }),
        ApiResponse({ status: 401, description: 'Invalid credentials' }),
        ApiResponse({ status: 400, description: 'Validation failed' }),
    );

export const ApiLogout = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Log out user',
            description: 'Clear authentication cookies and invalidate session',
        }),
        ApiCookieAuth(),
        ApiResponse({ status: 200, description: 'User successfully logged out' }),
    );

export const ApiRefreshToken = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Refresh access token',
            description: 'Refresh access token using refresh token from cookies',
        }),
        ApiCookieAuth(),
        ApiResponse({
            status: 200,
            description: 'Token refreshed successfully',
            // Using generic schema structure as there might not be a specific example for refresh yet
            // or reusing login response structure if similar
            schema: {
                example: {
                    ...SwaggerExamples.Auth.Login.response,
                    message: 'Token refreshed successfully',
                }
            },
        }),
        ApiResponse({ status: 401, description: 'Invalid or expired refresh token' }),
    );

export const ApiGetCurrentUser = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Get current user profile',
            description: 'Get current authenticated user information',
        }),
        ApiCookieAuth(),
        ApiResponse({
            status: 200,
            description: 'User profile retrieved successfully',
            schema: {
                example: SwaggerExamples.Auth.CurrentUser.response,
            },
        }),
    );

export const ApiVerifyAuth = () =>
    applyDecorators(
        ApiOperation({
            summary: 'Verify authentication status',
            description: 'Check if user is authenticated via cookies (for middleware)',
        }),
        ApiCookieAuth(),
        ApiResponse({
            status: 200,
            description: 'Authentication status verified',
            schema: {
                example: {
                    status: 200,
                    message: 'Authentication verified',
                    data: {
                        authenticated: true,
                        user: {
                            id: 'user-id',
                            email: 'user@example.com',
                            username: 'username',
                        },
                    },
                },
            },
        }),
    );

export const ApiGetGoogleAuthUrl = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔗 Get Google OAuth URL for Login',
            description: 'Generate OAuth URL for Google login (no authentication required)',
        }),
        ApiResponse({
            status: 200,
            description: '✅ OAuth URL generated',
            schema: {
                example: {
                    status: 200,
                    message: 'OAuth URL generated',
                    data: {
                        auth_url: 'https://accounts.google.com/o/oauth2/v2/auth?...',
                    },
                },
            },
        }),
    );

export const ApiGoogleCallback = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔄 Google OAuth Callback for Login',
            description: 'Handle OAuth callback from Google and redirect to frontend',
        }),
        ApiQuery({ name: 'code', description: 'Authorization code from Google' }),
        ApiQuery({ name: 'state', description: 'State parameter', required: false }),
        ApiQuery({
            name: 'error',
            description: 'Error from Google',
            required: false,
        }),
        ApiResponse({
            status: 302,
            description: '✅ Redirects to frontend callback page',
        }),
    );

export const ApiGoogleLogin = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔍 Complete Google Login',
            description: 'Complete Google OAuth login flow and create user session',
        }),
        ApiResponse({
            status: 200,
            description: 'Google login successful',
            schema: {
                example: SwaggerExamples.Auth.Login.response,
            },
        }),
        ApiResponse({ status: 400, description: 'Invalid authorization code' }),
        ApiResponse({ status: 401, description: 'Google authentication failed' }),
    );

export const ApiRequestPasswordReset = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔑 Request password reset',
            description: 'Send password reset email to user',
        }),
        ApiResponse({
            status: 200,
            description: 'Password reset email sent if account exists',
            type: SuccessResponseDto,
        }),
        ApiResponse({ status: 400, description: 'Invalid email format' }),
    );

export const ApiResetPassword = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔐 Reset password',
            description: 'Reset user password with token',
        }),
        ApiResponse({
            status: 200,
            description: 'Password reset successfully',
            type: SuccessResponseDto,
        }),
        ApiResponse({ status: 400, description: 'Invalid or expired token' }),
    );
