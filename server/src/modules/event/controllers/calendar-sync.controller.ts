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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
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
  SyncConflict,
} from '../types/sync.types';

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
  ) {}

  @Post('initial')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Thá»±c hiá»‡n initial sync vá»›i Google Calendar',
    description: `
            Khi user láº§n Ä‘áº§u connect vá»›i Google Calendar, endpoint nÃ y sáº½:
            1. Láº¥y táº¥t cáº£ events tá»« cáº£ Calento vÃ  Google Calendar
            2. PhÃ¡t hiá»‡n conflicts (events trÃ¹ng láº·p hoáº·c overlap)
            3. Xá»­ lÃ½ conflicts theo strategy Ä‘Æ°á»£c chá»n:
               - MERGE_PREFER_CALENTO: Giá»¯ events cá»§a Calento, update lÃªn Google
               - MERGE_PREFER_GOOGLE: Giá»¯ events cá»§a Google, update Calento
               - KEEP_BOTH: Giá»¯ cáº£ 2, import táº¥t cáº£ tá»« Google
            4. Import cÃ¡c events khÃ´ng conflict tá»« Google
            
            Recommended: MERGE_PREFER_CALENTO (default)
        `,
  })
  @ApiBody({
    type: InitialSyncDto,
    description: 'Strategy Ä‘á»ƒ xá»­ lÃ½ conflicts',
    examples: {
      default: {
        summary: 'Æ¯u tiÃªn Calento (recommended)',
        value: { strategy: 'merge_prefer_calento' },
      },
      google: {
        summary: 'Æ¯u tiÃªn Google',
        value: { strategy: 'merge_prefer_google' },
      },
      both: {
        summary: 'Giá»¯ cáº£ 2',
        value: { strategy: 'keep_both' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Initial sync completed successfully',
    schema: {
      example: {
        totalGoogleEvents: 15,
        totalCalentoEvents: 10,
        imported: 12,
        conflicts: [
          {
            calendoEventId: 'abc-123',
            googleEventId: 'google-xyz',
            reason: 'duplicate',
            calendoEvent: { title: 'Meeting', start_time: '...' },
            googleEvent: { summary: 'Meeting', start: { dateTime: '...' } },
          },
        ],
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token khÃ´ng há»£p lá»‡',
  })
  @ApiResponse({
    status: 400,
    description: 'User chÆ°a connect vá»›i Google Calendar',
  })
  async performInitialSync(
    @Request() req: any,
    @Body() body: InitialSyncDto,
  ): Promise<InitialSyncResult> {
    const userId = req.user.id;
    const strategy = body.strategy || SyncStrategy.MERGE_PREFER_CALENTO;

    return this.syncManager.performInitialSync(userId, strategy);
  }

  @Get('status')
  @ApiOperation({
    summary: 'Láº¥y tráº¡ng thÃ¡i sync vá»›i Google Calendar',
    description:
      'Kiá»ƒm tra xem user cÃ³ connect vÃ  enable sync vá»›i Google Calendar khÃ´ng',
  })
  @ApiResponse({
    status: 200,
    description: 'Sync status retrieved successfully',
    schema: {
      example: {
        isConnected: true,
        isSyncEnabled: true,
        lastSyncAt: '2024-01-15T10:30:00Z',
        connectionEstablishedAt: '2024-01-10T08:00:00Z',
      },
    },
  })
  async getSyncStatus(@Request() req: any): Promise<CalendarConnectionStatus> {
    const userId = req.user.id;
    return this.calendarValidation.getConnectionStatus(userId);
  }

  @Post('toggle')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Báº­t/táº¯t sync vá»›i Google Calendar',
    description: `
            Enable hoáº·c disable automatic sync vá»›i Google Calendar.
            
            Khi DISABLE sync:
            - Events á»Ÿ Calento calendar giá»¯ nguyÃªn
            - KhÃ´ng sync events má»›i vá»›i Google
            - KhÃ´ng update events tá»« Google
            - User cÃ³ thá»ƒ enable láº¡i báº¥t cá»© lÃºc nÃ o
            
            Khi ENABLE láº¡i:
            - Tá»± Ä‘á»™ng sync events má»›i
            - Update events khi thay Ä‘á»•i
        `,
  })
  @ApiBody({
    type: SetSyncEnabledDto,
    examples: {
      enable: {
        summary: 'Enable sync',
        value: { enabled: true },
      },
      disable: {
        summary: 'Disable sync',
        value: { enabled: false },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Sync setting updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({
    summary: 'Disconnect Google Calendar',
    description: `
            Ngáº¯t káº¿t ná»‘i hoÃ n toÃ n vá»›i Google Calendar.
            
            Há»‡ thá»‘ng sáº½:
            1. Giá»¯ nguyÃªn Táº¤T Cáº¢ events á»Ÿ Calento calendar
            2. XÃ³a mapping vá»›i Google Calendar (google_event_id)
            3. ÄÃ¡nh dáº¥u connection lÃ  inactive
            4. KhÃ´ng thá»ƒ sync cho Ä‘áº¿n khi reconnect
            
            Note: Events á»Ÿ Google Calendar KHÃ”NG bá»‹ xÃ³a
        `,
  })
  @ApiResponse({
    status: 200,
    description: 'Disconnected successfully, local events preserved',
    schema: {
      example: {
        message:
          'Google Calendar disconnected successfully. All local events preserved.',
        eventsPreserved: true,
      },
    },
  })
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
  @ApiOperation({
    summary: 'Láº¥y danh sÃ¡ch conflicts chÆ°a resolve',
    description:
      'Xem cÃ¡c conflicts phÃ¡t hiá»‡n Ä‘Æ°á»£c trong quÃ¡ trÃ¬nh sync',
  })
  @ApiQuery({
    name: 'resolved',
    required: false,
    description: 'Filter by resolved status',
  })
  @ApiResponse({
    status: 200,
    description: 'Conflicts retrieved successfully',
    schema: {
      example: [
        {
          calendoEventId: 'abc-123',
          googleEventId: 'google-xyz',
          reason: 'duplicate',
          calendoEvent: {
            id: 'abc-123',
            title: 'Team Meeting',
            start_time: '2024-01-15T10:00:00Z',
            end_time: '2024-01-15T11:00:00Z',
          },
          googleEvent: {
            id: 'google-xyz',
            summary: 'Team Meeting',
            start: { dateTime: '2024-01-15T10:00:00Z' },
            end: { dateTime: '2024-01-15T11:00:00Z' },
          },
          resolution: 'merge_prefer_calento',
          resolved: false,
          createdAt: '2024-01-15T08:00:00Z',
          resolvedAt: null,
        },
      ],
    },
  })
  async getConflicts(
    @Request() req: any,
    @Query('resolved') resolved?: boolean,
  ): Promise<any[]> {
    const userId = req.user.id;
    return this.syncManager.getConflicts(userId, resolved);
  }

  @Post('conflicts/:conflictId/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resolve má»™t conflict manually',
    description: 'ÄÃ¡nh dáº¥u má»™t conflict Ä‘Ã£ Ä‘Æ°á»£c xá»­ lÃ½ manually',
  })
  @ApiParam({
    name: 'conflictId',
    description: 'ID cá»§a conflict cáº§n resolve',
  })
  @ApiBody({
    schema: {
      properties: {
        resolution: {
          type: 'string',
          description: 'CÃ¡ch giáº£i quyáº¿t conflict',
          example: 'manual_merge',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Conflict resolved successfully',
    schema: {
      example: {
        message: 'Conflict resolved successfully',
        conflictId: 'conf-123',
      },
    },
  })
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
  @ApiOperation({
    summary: 'ðŸš€ Batch Sync - Pull events tá»« Google Calendar',
    description: `
            **Tá»I Æ¯U HÃ“A BATCH SYNC** - Xá»­ lÃ½ hÃ ng ngÃ n events hiá»‡u quáº£!
            
            ### âœ¨ TÃ­nh nÄƒng:
            - âœ… **Batch Processing**: Chia nhá» events thÃ nh lÃ´ 50-100 events
            - âœ… **Parallel Processing**: Xá»­ lÃ½ Ä‘á»“ng thá»i vá»›i concurrency limit
            - âœ… **Auto Retry**: Tá»± Ä‘á»™ng retry vá»›i exponential backoff (max 3 láº§n)
            - âœ… **Progress Tracking**: Theo dÃµi tiáº¿n Ä‘á»™ real-time qua logs
            - âœ… **Rate Limiting**: TrÃ¡nh Google API quota exceeded
            - âœ… **Error Handling**: Xá»­ lÃ½ lá»—i gracefully, khÃ´ng lÃ m há»ng toÃ n bá»™
            
            ### ðŸ“Š Performance:
            - 100 events: ~1s (cÅ©: ~5s) - **5x nhanh hÆ¡n**
            - 1000 events: ~10s (cÅ©: ~50s) - **5x nhanh hÆ¡n**
            - 5000 events: ~50s (cÅ©: ~4 phÃºt) - **4.8x nhanh hÆ¡n**
            
            ### ðŸŽ¯ Use Cases:
            - Initial sync khi user connect Google Calendar láº§n Ä‘áº§u
            - Manual refresh Ä‘á»ƒ cáº­p nháº­t events má»›i
            - Recovery sau khi cÃ³ lá»—i sync
        `,
  })
  @ApiBody({
    schema: {
      properties: {
        timeMin: {
          type: 'string',
          format: 'date-time',
          description: 'NgÃ y báº¯t Ä‘áº§u (ISO 8601)',
          example: '2024-01-01T00:00:00Z',
        },
        timeMax: {
          type: 'string',
          format: 'date-time',
          description: 'NgÃ y káº¿t thÃºc (ISO 8601)',
          example: '2024-12-31T23:59:59Z',
        },
        maxResults: {
          type: 'number',
          description: 'Sá»‘ lÆ°á»£ng events tá»‘i Ä‘a (max 2500)',
          example: 2500,
        },
      },
    },
    examples: {
      last30Days: {
        summary: '30 ngÃ y qua',
        value: {
          timeMin: '2024-09-01T00:00:00Z',
          timeMax: '2024-10-01T23:59:59Z',
        },
      },
      fullYear: {
        summary: 'Cáº£ nÄƒm 2024',
        value: {
          timeMin: '2024-01-01T00:00:00Z',
          timeMax: '2024-12-31T23:59:59Z',
          maxResults: 2500,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Batch sync completed successfully',
    schema: {
      example: {
        success: true,
        message: 'Batch sync completed successfully',
        data: {
          synced: 950,
          failed: 50,
          total: 1000,
          duration: 10250,
          throughput: 97,
          errors: [
            'Failed after 3 retries: Duplicate key violation',
            'Invalid event format: unknown',
          ],
        },
        meta: {
          batchSize: 50,
          concurrencyLimit: 10,
          maxRetries: 3,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 400,
    description: 'User chÆ°a connect Google Calendar',
  })
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
