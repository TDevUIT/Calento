import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';
import { SuccessResponseDto } from '../../common/dto/base-response.dto';

export const ApiGetAuthUrl = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔗 Get Google OAuth URL',
            description: 'Generate OAuth URL for Google Calendar connection',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: '✅ OAuth URL generated',
            schema: {
                example: SwaggerExamples.Google.AuthUrl.response,
            },
        }),
    );

export const ApiHandleCallback = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔄 OAuth Callback Handler',
            description:
                'Handle OAuth callback from Google and save credentials. Automatically triggers initial sync and webhook setup.',
        }),
        ApiQuery({ name: 'code', description: 'Authorization code from Google' }),
        ApiQuery({
            name: 'state',
            description: 'User ID passed as state',
            required: false,
        }),
        ApiResponse({
            status: HttpStatus.FOUND,
            description: '✅ Redirects to frontend with success/error',
        }),
    );

export const ApiGetConnectionStatus = () =>
    applyDecorators(
        ApiOperation({
            summary: '📊 Get Connection Status',
            description: 'Check if user is connected to Google Calendar',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: '✅ Status retrieved',
            type: SuccessResponseDto,
            schema: {
                example: SwaggerExamples.Google.Status.response,
            },
        }),
    );

export const ApiDisconnect = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔌 Disconnect Google Calendar',
            description: 'Revoke access and delete stored credentials',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: '✅ Disconnected successfully',
            type: SuccessResponseDto,
        }),
    );

export const ApiSyncCalendars = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔄 Sync Calendars from Google',
            description: 'Fetch and sync all calendars from Google Calendar',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: '✅ Calendars synced',
            type: SuccessResponseDto,
            schema: {
                example: SwaggerExamples.Google.Calendars.response,
            },
        }),
    );

export const ApiListGoogleCalendars = () =>
    applyDecorators(
        ApiOperation({
            summary: '📅 List Google Calendars',
            description: 'Get list of all calendars from Google Calendar',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: '✅ Calendars retrieved',
            type: SuccessResponseDto,
            schema: {
                example: SwaggerExamples.Google.Calendars.response,
            },
        }),
    );

export const ApiRefreshToken = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔄 Refresh Access Token',
            description: 'Manually refresh Google OAuth access token',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: '✅ Token refreshed',
            type: SuccessResponseDto,
        }),
    );

export const ApiCreateGoogleMeet = () =>
    applyDecorators(
        ApiOperation({
            summary: '📹 Create Google Meet Link',
            description:
                'Generate a Google Meet conference link for an event. Requires Google Calendar connection.',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: '✅ Google Meet link created',
            type: SuccessResponseDto,
            schema: {
                example: SwaggerExamples.Google.Meet.response,
            },
        }),
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: '❌ Not connected to Google Calendar',
        }),
    );

export const ApiManualSyncFromGoogle = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔄 Manual Sync - Pull Events from Google',
            description:
                'Manually pull and sync events from Google Calendar to Calento. ' +
                'Use this to refresh events after the initial connection or if you notice missing events.',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: '✅ Events synced successfully',
        }),
    );

export const ApiManualInitialSync = () =>
    applyDecorators(
        ApiOperation({
            summary: '🔄 Initial Sync with Conflict Resolution',
            description:
                'Perform initial sync with conflict detection and resolution strategy. ' +
                'Use this after first connection or to resolve sync conflicts.',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: '✅ Initial sync completed',
        }),
    );

export const ApiGetSyncStatus = () =>
    applyDecorators(
        ApiOperation({
            summary: '📊 Get Sync Status',
            description: 'Check the status of Google Calendar synchronization',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: '✅ Sync status retrieved',
        }),
    );
