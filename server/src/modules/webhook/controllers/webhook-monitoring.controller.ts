import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserId,
} from '../../../common/decorators/current-user.decorator';
import { WebhookSchedulerService } from '../services/webhook-scheduler.service';
import { SyncErrorRecoveryService } from '../../../common/services/sync-error-recovery.service';
import { SuccessResponseDto } from '../../../common/dto/base-response.dto';
import {
  ApiGetWebhookStats,
  ApiRenewUserWebhook,
  ApiGetErrorStats,
  ApiGetUserErrors,
  ApiRetryError,
  ApiGetHealthStatus,
} from './webhook-monitoring.swagger';

@ApiTags('Webhook Monitoring')
@Controller('api/webhook/monitoring')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WebhookMonitoringController {
  private readonly logger = new Logger(WebhookMonitoringController.name);

  constructor(
    private readonly webhookScheduler: WebhookSchedulerService,
    private readonly syncErrorRecovery: SyncErrorRecoveryService,
  ) { }

  @Get('webhook/stats')
  @ApiGetWebhookStats()
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
  @ApiRenewUserWebhook()
  async renewUserWebhook(
    @CurrentUserId() userId: string,
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
  @ApiGetErrorStats()
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
  @ApiGetUserErrors()
  async getUserErrors(
    @CurrentUserId() userId: string,
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
  @ApiRetryError()
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
  @ApiGetHealthStatus()
  async getHealthStatus(): Promise<SuccessResponseDto<any>> {
    try {
      const [webhookStats, errorStats] = await Promise.all([
        this.webhookScheduler.getRenewalStats(),
        this.syncErrorRecovery.getErrorStats(),
      ]);

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
