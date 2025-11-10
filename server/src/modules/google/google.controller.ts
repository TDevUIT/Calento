import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Body,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import express from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { GoogleAuthService } from './services/google-auth.service';
import { GoogleCalendarService } from './services/google-calendar.service';
import { MessageService } from '../../common/message/message.service';
import { SuccessResponseDto } from '../../common/dto/base-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import {
  GoogleConnectionStatusDto,
  SyncCalendarsResponseDto,
  CreateGoogleMeetDto,
  GoogleMeetResponseDto,
} from './dto/google-auth.dto';
import { CalendarSyncManagerService } from '../event/services/calendar-sync-manager.service';
import { EventSyncService } from '../event/services/event-sync.service';
import { SyncStrategy } from '../event/types/sync.types';
import { WebhookService } from '../webhook/services/webhook.service';

@ApiTags('Google Calendar Integration')
@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly messageService: MessageService,
    private readonly syncManager: CalendarSyncManagerService,
    private readonly eventSyncService: EventSyncService,
    private readonly webhookService: WebhookService,
  ) {}

  @Get('auth/url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('cookie')
  @ApiOperation({
    summary: 'ðŸ”— Get Google OAuth URL',
    description: 'Generate OAuth URL for Google Calendar connection',
  })
  @ApiResponse({
    status: 200,
    description: 'âœ… OAuth URL generated',
    schema: {
      example: {
        status: 200,
        message: 'OAuth URL generated',
        data: {
          auth_url: 'https://accounts.google.com/o/oauth2/v2/auth?...',
        },
      },
    },
  })
  async getAuthUrl(
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const authUrl = this.googleAuthService.getAuthUrl(userId);

    return new SuccessResponseDto(
      this.messageService.get('google.auth_url_generated'),
      { auth_url: authUrl },
    );
  }

  @Get('auth/callback')
  @ApiOperation({
    summary: '🔄 OAuth Callback Handler',
    description: 'Handle OAuth callback from Google and save credentials. Automatically triggers initial sync and webhook setup.',
  })
  @ApiQuery({ name: 'code', description: 'Authorization code from Google' })
  @ApiQuery({
    name: 'state',
    description: 'User ID passed as state',
    required: false,
  })
  @ApiResponse({
    status: 302,
    description: '✅ Redirects to frontend with success/error',
  })
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: express.Response,
  ) {
    if (!code) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/settings/integrations?error=no_code`,
      );
    }

    if (!state) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/settings/integrations?error=no_user`,
      );
    }

    const result = await this.googleAuthService.handleCallback(code, state);

    if (result.success) {
      // 🔥 AUTO INITIAL SYNC - Pull existing events from Google Calendar
      this.performBackgroundSync(state).catch((error) => {
        this.messageService['logger'].error(
          `Background sync failed for user ${state}:`,
          error,
        );
      });

      return res.redirect(
        `${process.env.FRONTEND_URL}/settings/integrations?success=google_connected&sync=initializing`,
      );
    } else {
      return res.redirect(
        `${process.env.FRONTEND_URL}/settings/integrations?error=connection_failed`,
      );
    }
  }

  /**
   * 🔥 Performs background initial sync and webhook setup
   * This runs asynchronously after connection to avoid blocking the OAuth callback
   */
  private async performBackgroundSync(userId: string): Promise<void> {
    try {
      this.messageService['logger'].log(
        `🚀 Starting background sync for user ${userId}...`,
      );

      // Step 1: Perform initial sync with MERGE strategy (keep both if conflict)
      const syncResult = await this.syncManager.performInitialSync(
        userId,
        SyncStrategy.KEEP_BOTH,
      );

      this.messageService['logger'].log(
        `✅ Initial sync completed for user ${userId}: ` +
          `${syncResult.imported} events imported, ` +
          `${syncResult.conflicts.length} conflicts detected`,
      );

      // Step 2: Setup webhook for real-time sync
      try {
        await this.webhookService.watchCalendar(userId, {
          calendar_id: 'primary',
          expiration: 604800000, // 7 days in ms
        });
        this.messageService['logger'].log(
          `✅ Webhook setup completed for user ${userId}`,
        );
      } catch (webhookError) {
        this.messageService['logger'].warn(
          `⚠️ Webhook setup failed for user ${userId}:`,
          webhookError,
        );
      }
    } catch (error) {
      this.messageService['logger'].error(
        `❌ Background sync failed for user ${userId}:`,
        error,
      );
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('cookie')
  @ApiOperation({
    summary: '📊 Get Connection Status',
    description: 'Check if user is connected to Google Calendar',
  })
  @ApiResponse({
    status: 200,
    description: 'âœ… Status retrieved',
    type: SuccessResponseDto,
  })
  async getConnectionStatus(
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const connected = await this.googleAuthService.isConnected(userId);

    const statusData: GoogleConnectionStatusDto = { connected };

    if (connected) {
      const credentials = await this.googleAuthService[
        'credentialsRepo'
      ].findByUserAndProvider(userId, 'google');
      if (credentials) {
        statusData.expires_at = credentials.expires_at;
        statusData.scope = credentials.scope;
      }
    }

    return new SuccessResponseDto(
      this.messageService.get('success.retrieved'),
      statusData,
    );
  }

  @Delete('disconnect')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('cookie')
  @ApiOperation({
    summary: 'ðŸ”Œ Disconnect Google Calendar',
    description: 'Revoke access and delete stored credentials',
  })
  @ApiResponse({
    status: 200,
    description: 'âœ… Disconnected successfully',
    type: SuccessResponseDto,
  })
  async disconnect(
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const disconnected = await this.googleAuthService.disconnect(userId);

    return new SuccessResponseDto(
      disconnected ? 'Google Calendar disconnected' : 'Not connected',
      { disconnected },
    );
  }

  @Post('calendars/sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('cookie')
  @ApiOperation({
    summary: 'ðŸ”„ Sync Calendars from Google',
    description: 'Fetch and sync all calendars from Google Calendar',
  })
  @ApiResponse({
    status: 200,
    description: 'âœ… Calendars synced',
    type: SuccessResponseDto,
  })
  async syncCalendars(
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const result = await this.googleCalendarService.syncCalendars(userId);

    const response: SyncCalendarsResponseDto = {
      success: result.success,
      count: result.count,
    };

    return new SuccessResponseDto(
      result.success
        ? 'Calendars synced successfully'
        : 'Failed to sync calendars',
      response,
      result.success ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  @Get('calendars/list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('cookie')
  @ApiOperation({
    summary: 'ðŸ“… List Google Calendars',
    description: 'Get list of all calendars from Google Calendar',
  })
  @ApiResponse({
    status: 200,
    description: 'âœ… Calendars retrieved',
    type: SuccessResponseDto,
  })
  async listGoogleCalendars(
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const calendars = await this.googleCalendarService.listCalendars(userId);

    return new SuccessResponseDto(
      this.messageService.get('success.retrieved'),
      { calendars, count: calendars.length },
    );
  }

  @Post('token/refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('cookie')
  @ApiOperation({
    summary: 'ðŸ”„ Refresh Access Token',
    description: 'Manually refresh Google OAuth access token',
  })
  @ApiResponse({
    status: 200,
    description: 'âœ… Token refreshed',
    type: SuccessResponseDto,
  })
  async refreshToken(
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const refreshed = await this.googleAuthService.refreshAccessToken(userId);

    return new SuccessResponseDto(
      refreshed ? 'Token refreshed successfully' : 'Failed to refresh token',
      { refreshed },
      refreshed ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  @Post('meet/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('cookie')
  @ApiOperation({
    summary: 'ðŸ“¹ Create Google Meet Link',
    description:
      'Generate a Google Meet conference link for an event. Requires Google Calendar connection.',
  })
  @ApiResponse({
    status: 200,
    description: 'âœ… Google Meet link created',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'âŒ Not connected to Google Calendar',
  })
  async createGoogleMeet(
    @CurrentUserId() userId: string,
    @Body() createMeetDto: CreateGoogleMeetDto,
  ): Promise<SuccessResponseDto> {
    const isConnected = await this.googleAuthService.isConnected(userId);

    if (!isConnected) {
      return new SuccessResponseDto(
        'Not connected to Google Calendar',
        { connected: false },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const meetData = await this.googleCalendarService.createGoogleMeet(
      userId,
      {
        summary: createMeetDto.summary,
        description: createMeetDto.description,
        start_time: createMeetDto.start_time,
        end_time: createMeetDto.end_time,
      },
    );

    if (!meetData) {
      return new SuccessResponseDto(
        'Failed to create Google Meet link',
        { success: false },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const response: GoogleMeetResponseDto = {
      url: meetData.url,
      id: meetData.id,
      entry_points: meetData.entry_points,
    };

    return new SuccessResponseDto('Google Meet link created', response);
  }

  @Post('events/sync/pull')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('cookie')
  @ApiOperation({
    summary: '🔄 Manual Sync - Pull Events from Google',
    description:
      'Manually pull and sync events from Google Calendar to Calento. ' +
      'Use this to refresh events after the initial connection or if you notice missing events.',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Events synced successfully',
    schema: {
      example: {
        status: 200,
        message: 'Successfully synced 150 events from Google Calendar',
        data: {
          synced: 150,
          failed: 0,
          duration: 2500,
          throughput: 60,
        },
      },
    },
  })
  async manualSyncFromGoogle(
    @CurrentUserId() userId: string,
    @Body()
    body?: {
      timeMin?: string;
      timeMax?: string;
      maxResults?: number;
    },
  ): Promise<SuccessResponseDto> {
    const timeMin = body?.timeMin
      ? new Date(body.timeMin)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: 30 days ago
    const timeMax = body?.timeMax
      ? new Date(body.timeMax)
      : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // Default: 90 days ahead

    const result = await this.eventSyncService.pullEventsFromGoogle(userId, {
      timeMin,
      timeMax,
      maxResults: body?.maxResults || 2500,
    });

    return new SuccessResponseDto(
      `Successfully synced ${result.synced} events from Google Calendar`,
      {
        synced: result.synced,
        failed: result.failed,
        duration: result.duration,
        throughput: Math.round((result.synced / result.duration) * 1000),
        errors: result.errors.slice(0, 5), // Only show first 5 errors
      },
    );
  }

  @Post('events/sync/initial')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('cookie')
  @ApiOperation({
    summary: '🔄 Initial Sync with Conflict Resolution',
    description:
      'Perform initial sync with conflict detection and resolution strategy. ' +
      'Use this after first connection or to resolve sync conflicts.',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Initial sync completed',
    schema: {
      example: {
        status: 200,
        message: 'Initial sync completed',
        data: {
          totalGoogleEvents: 200,
          totalCalentoEvents: 50,
          imported: 180,
          conflicts: [],
          errors: [],
        },
      },
    },
  })
  async manualInitialSync(
    @CurrentUserId() userId: string,
    @Body() body?: { strategy?: SyncStrategy },
  ): Promise<SuccessResponseDto> {
    const strategy = body?.strategy || SyncStrategy.KEEP_BOTH;

    const result = await this.syncManager.performInitialSync(userId, strategy);

    return new SuccessResponseDto('Initial sync completed', result);
  }

  @Get('sync/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('cookie')
  @ApiOperation({
    summary: '📊 Get Sync Status',
    description: 'Check the status of Google Calendar synchronization',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Sync status retrieved',
  })
  async getSyncStatus(
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const isConnected = await this.googleAuthService.isConnected(userId);

    if (!isConnected) {
      return new SuccessResponseDto('Not connected to Google Calendar', {
        connected: false,
        synced: false,
      });
    }

    // Get conflicts if any
    const conflicts = await this.syncManager.getConflicts(userId, false);

    return new SuccessResponseDto('Sync status retrieved', {
      connected: true,
      synced: true,
      unresolvedConflicts: conflicts.length,
      conflicts: conflicts.slice(0, 10), // Only show first 10
    });
  }
}
