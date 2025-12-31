import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CalendarSyncManagerService } from '../services/calendar-sync-manager.service';
import { EventSyncService } from '../services/event-sync.service';
import {
  CalendarValidationService,
  CalendarConnectionStatus,
} from '../../../common/services/calendar-validation.service';
import {
  SyncStrategy,
  InitialSyncResult,
} from '../types/sync.types';
import {
  ApiPerformInitialSync,
  ApiGetSyncStatus,
  ApiSetSyncEnabled,
  ApiDisconnectGoogleCalendar,
  ApiGetConflicts,
  ApiResolveConflict,
  ApiPullEventsFromGoogle,
} from './calendar-sync.swagger';

class InitialSyncDto {
  strategy?: SyncStrategy = SyncStrategy.MERGE_PREFER_CALENTO;
}

class SetSyncEnabledDto {
  enabled: boolean;
}

@ApiTags('Calendar Sync')
@ApiBearerAuth()
@Controller('calendar/sync')
@UseGuards(JwtAuthGuard)
export class CalendarSyncController {
  constructor(
    private readonly syncManager: CalendarSyncManagerService,
    private readonly eventSyncService: EventSyncService,
    private readonly calendarValidation: CalendarValidationService,
  ) { }

  @Post('initial')
  @HttpCode(HttpStatus.OK)
  @ApiPerformInitialSync()
  async performInitialSync(
    @Request() req: any,
    @Body() body: InitialSyncDto,
  ): Promise<InitialSyncResult> {
    const userId = req.user.id;
    const strategy = body.strategy || SyncStrategy.MERGE_PREFER_CALENTO;

    return this.syncManager.performInitialSync(userId, strategy);
  }

  @Get('status')
  @ApiGetSyncStatus()
  async getSyncStatus(@Request() req: any): Promise<CalendarConnectionStatus> {
    const userId = req.user.id;
    return this.calendarValidation.getConnectionStatus(userId);
  }

  @Post('toggle')
  @HttpCode(HttpStatus.OK)
  @ApiSetSyncEnabled()
  async setSyncEnabled(
    @Request() req: any,
    @Body() body: SetSyncEnabledDto,
  ): Promise<{ message: string; syncEnabled: boolean }> {
    const userId = req.user.id;
    await this.calendarValidation.setSyncEnabled(userId, body.enabled);

    return {
      message: `Google Calendar sync ${body.enabled ? 'enabled' : 'disabled'} successfully`,
      syncEnabled: body.enabled,
    };
  }

  @Post('disconnect')
  @HttpCode(HttpStatus.OK)
  @ApiDisconnectGoogleCalendar()
  async disconnectGoogleCalendar(@Request() req: any): Promise<{
    message: string;
    eventsPreserved: boolean;
  }> {
    const userId = req.user.id;
    await this.syncManager.handleDisconnection(userId);

    return {
      message:
        'Google Calendar disconnected successfully. All local events preserved.',
      eventsPreserved: true,
    };
  }

  @Get('conflicts')
  @ApiGetConflicts()
  async getConflicts(
    @Request() req: any,
    @Query('resolved') resolved?: boolean,
  ): Promise<any[]> {
    const userId = req.user.id;
    return this.syncManager.getConflicts(userId, resolved);
  }

  @Post('conflicts/:conflictId/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiResolveConflict()
  async resolveConflict(
    @Request() req: any,
    @Param('conflictId') conflictId: string,
    @Body() body: { resolution: string },
  ): Promise<{ message: string; conflictId: string }> {
    const userId = req.user.id;
    await this.syncManager.resolveConflict(userId, conflictId, body.resolution);

    return {
      message: 'Conflict resolved successfully',
      conflictId,
    };
  }

  @Post('pull')
  @HttpCode(HttpStatus.OK)
  @ApiPullEventsFromGoogle()
  async pullEventsFromGoogle(
    @Request() req: any,
    @Body()
    body: {
      timeMin?: string;
      timeMax?: string;
      maxResults?: number;
    },
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      synced: number;
      failed: number;
      total: number;
      duration: number;
      throughput: number;
      errors: string[];
    };
    meta: {
      batchSize: number;
      concurrencyLimit: number;
      maxRetries: number;
    };
  }> {
    const userId = req.user.id;

    const options = {
      timeMin: body.timeMin ? new Date(body.timeMin) : undefined,
      timeMax: body.timeMax ? new Date(body.timeMax) : undefined,
      maxResults: body.maxResults || 2500,
    };

    const result = await this.eventSyncService.pullEventsFromGoogle(
      userId,
      options,
    );

    const total = result.synced + result.failed;
    const throughput = Math.round((total / result.duration) * 1000);

    return {
      success: true,
      message: `Batch sync completed successfully. Synced ${result.synced}/${total} events in ${result.duration}ms`,
      data: {
        synced: result.synced,
        failed: result.failed,
        total,
        duration: result.duration,
        throughput,
        errors: result.errors,
      },
      meta: {
        batchSize: 50,
        concurrencyLimit: 10,
        maxRetries: 3,
      },
    };
  }
}
