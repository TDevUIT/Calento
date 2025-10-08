import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { WebhookSchedulerService } from '../services/webhook-scheduler.service';
import { SyncErrorRecoveryService } from '../../../common/services/sync-error-recovery.service';
import { SuccessResponseDto } from '../../../common/dto/base-response.dto';

@ApiTags('Webhook Monitoring')
@Controller('api/webhook/monitoring')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WebhookMonitoringController {
  private readonly logger = new Logger(WebhookMonitoringController.name);

  constructor(
    private readonly webhookScheduler: WebhookSchedulerService,
    private readonly syncErrorRecovery: SyncErrorRecoveryService,
  ) {}

  @Get('webhook/stats')
  @ApiOperation({
    summary: 'Get webhook renewal statistics',
    description:
      'Get statistics about active webhooks and their renewal status',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook statistics retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Webhook statistics retrieved',
        data: {
          totalActive: 15,
          expiringWithin24h: 2,
          expiringWithin7d: 5,
          expired: 1,
        },
      },
    },
  })
  async getWebhookStats(): Promise<SuccessResponseDto<any>> {
    try {
      const stats = await this.webhookScheduler.getRenewalStats();

      return new SuccessResponseDto(
        'Webhook statistics retrieved successfully',
        stats,
      );
    } catch (error) {
      this.logger.error('Failed to get webhook stats:', error.stack);
      throw error;
    }
  }

  @Post('webhook/renew/:calendarId')
  @ApiOperation({
    summary: 'Manually renew webhook for user calendar',
    description: 'Force renewal of webhook for a specific user calendar',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook renewal triggered successfully',
  })
  async renewUserWebhook(
    @CurrentUser('id') userId: string,
    @Param('calendarId') calendarId: string,
  ): Promise<SuccessResponseDto<{ renewed: boolean }>> {
    try {
      const renewed = await this.webhookScheduler.renewWebhookForUser(
        userId,
        calendarId,
      );

      const message = renewed
        ? 'Webhook renewed successfully'
        : 'No active webhook found to renew';
      return new SuccessResponseDto(message, { renewed });
    } catch (error) {
      this.logger.error(
        `Failed to renew webhook for user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }

  @Get('errors/stats')
  @ApiOperation({
    summary: 'Get sync error statistics',
    description: 'Get overall statistics about sync errors in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Error statistics retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Error statistics retrieved',
        data: {
          totalErrors: 45,
          unresolvedErrors: 8,
          errorsByType: {
            event_sync: 5,
            webhook_delivery: 2,
            token_refresh: 1,
          },
          recentErrors: 3,
        },
      },
    },
  })
  async getErrorStats(): Promise<SuccessResponseDto<any>> {
    try {
      const stats = await this.syncErrorRecovery.getErrorStats();

      return new SuccessResponseDto(
        'Error statistics retrieved successfully',
        stats,
      );
    } catch (error) {
      this.logger.error('Failed to get error stats:', error.stack);
      throw error;
    }
  }

  @Get('errors/user')
  @ApiOperation({
    summary: 'Get sync errors for current user',
    description: 'Get recent sync errors for the authenticated user',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of errors to return (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'User errors retrieved successfully',
  })
  async getUserErrors(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string,
  ): Promise<SuccessResponseDto<any[]>> {
    try {
      const limitNum = limit ? parseInt(limit) : 10;
      const errors = await this.syncErrorRecovery.getUserErrors(
        userId,
        limitNum,
      );

      return new SuccessResponseDto(
        `Retrieved ${errors.length} errors for user`,
        errors,
      );
    } catch (error) {
      this.logger.error(
        `Failed to get errors for user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }

  @Post('errors/:errorId/retry')
  @ApiOperation({
    summary: 'Force retry a specific error',
    description: 'Manually trigger retry for a specific sync error',
  })
  @ApiResponse({
    status: 200,
    description: 'Error retry triggered successfully',
  })
  async retryError(
    @Param('errorId') errorId: string,
  ): Promise<SuccessResponseDto<{ retried: boolean }>> {
    try {
      const retried = await this.syncErrorRecovery.forceRetryError(errorId);

      const message = retried
        ? 'Error retry triggered successfully'
        : 'Error not found or already resolved';
      return new SuccessResponseDto(message, { retried });
    } catch (error) {
      this.logger.error(`Failed to retry error ${errorId}:`, error.stack);
      throw error;
    }
  }

  @Get('health')
  @ApiOperation({
    summary: 'Get overall sync health status',
    description: 'Get combined health status of webhooks and sync operations',
  })
  @ApiResponse({
    status: 200,
    description: 'Health status retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Health status retrieved',
        data: {
          webhooks: {
            totalActive: 15,
            expiringWithin24h: 2,
            health: 'good',
          },
          syncErrors: {
            unresolvedErrors: 8,
            recentErrors: 3,
            health: 'warning',
          },
          overallHealth: 'warning',
        },
      },
    },
  })
  async getHealthStatus(): Promise<SuccessResponseDto<any>> {
    try {
      const [webhookStats, errorStats] = await Promise.all([
        this.webhookScheduler.getRenewalStats(),
        this.syncErrorRecovery.getErrorStats(),
      ]);

      // Determine health status
      const webhookHealth = this.determineWebhookHealth(webhookStats);
      const errorHealth = this.determineErrorHealth(errorStats);
      const overallHealth = this.determineOverallHealth(
        webhookHealth,
        errorHealth,
      );

      const healthData = {
        webhooks: {
          ...webhookStats,
          health: webhookHealth,
        },
        syncErrors: {
          unresolvedErrors: errorStats.unresolvedErrors,
          recentErrors: errorStats.recentErrors,
          health: errorHealth,
        },
        overallHealth,
      };

      return new SuccessResponseDto(
        'Health status retrieved successfully',
        healthData,
      );
    } catch (error) {
      this.logger.error('Failed to get health status:', error.stack);
      throw error;
    }
  }

  // Private helper methods

  private determineWebhookHealth(stats: any): 'good' | 'warning' | 'critical' {
    const { totalActive, expiringWithin24h, expired } = stats;

    if (expired > 0 || expiringWithin24h > totalActive * 0.3) {
      return 'critical';
    }

    if (expiringWithin24h > 0) {
      return 'warning';
    }

    return 'good';
  }

  private determineErrorHealth(stats: any): 'good' | 'warning' | 'critical' {
    const { unresolvedErrors, recentErrors } = stats;

    if (unresolvedErrors > 20 || recentErrors > 10) {
      return 'critical';
    }

    if (unresolvedErrors > 5 || recentErrors > 3) {
      return 'warning';
    }

    return 'good';
  }

  private determineOverallHealth(
    webhookHealth: string,
    errorHealth: string,
  ): 'good' | 'warning' | 'critical' {
    if (webhookHealth === 'critical' || errorHealth === 'critical') {
      return 'critical';
    }

    if (webhookHealth === 'warning' || errorHealth === 'warning') {
      return 'warning';
    }

    return 'good';
  }
}
