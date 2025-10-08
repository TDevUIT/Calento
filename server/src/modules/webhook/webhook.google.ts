import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Headers,
  HttpStatus,
  UseGuards,
  HttpCode,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { WebhookService } from './services/webhook.service';
import { SuccessResponseDto } from '../../common/dto/base-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import {
  CreateWebhookChannelDto,
  WebhookNotificationEvent,
} from './dto/webhook.dto';

@ApiTags('📡 Webhook - Google Calendar')
@Controller('webhook/google')
export class WebHookGoogleController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '📨 Receive Google Calendar Webhook',
    description:
      'Endpoint for receiving push notifications from Google Calendar API',
  })
  @ApiHeader({ name: 'x-goog-channel-id', description: 'Channel ID' })
  @ApiHeader({ name: 'x-goog-resource-id', description: 'Resource ID' })
  @ApiHeader({ name: 'x-goog-resource-state', description: 'Resource state' })
  @ApiResponse({
    status: 200,
    description: '✅ Webhook received and processed',
  })
  async handleWebhook(@Headers() headers: any): Promise<void> {
    const channelId = headers['x-goog-channel-id'];
    const resourceId = headers['x-goog-resource-id'];
    const resourceState = headers['x-goog-resource-state'];
    const resourceUri = headers['x-goog-resource-uri'];
    const messageNumber = parseInt(headers['x-goog-message-number'] || '0');

    if (!channelId || !resourceId || !resourceState) {
      return;
    }

    const event: WebhookNotificationEvent = {
      channel_id: channelId,
      resource_id: resourceId,
      resource_state: resourceState,
      resource_uri: resourceUri,
      message_number: messageNumber,
      timestamp: new Date(),
    };

    await this.webhookService.handleNotification(event);
  }

  @Post('watch')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('cookie')
  @ApiOperation({
    summary: '👁️ Watch Calendar for Changes',
    description:
      'Create a webhook watch channel to receive notifications when calendar events change',
  })
  @ApiResponse({
    status: 201,
    description: '✅ Webhook watch created',
    schema: {
      example: {
        status: 201,
        message: 'Webhook watch created successfully',
        data: {
          channel_id: 'channel-user123-uuid',
          resource_id: 'resource-xyz',
          expiration: '2024-01-15T10:00:00Z',
          calendar_id: 'primary',
          is_active: true,
        },
      },
    },
  })
  async watchCalendar(
    @CurrentUserId() userId: string,
    @Body() dto: CreateWebhookChannelDto,
  ): Promise<SuccessResponseDto> {
    const channel = await this.webhookService.watchCalendar(userId, dto);

    return new SuccessResponseDto(
      'Webhook watch created successfully',
      channel,
      HttpStatus.CREATED,
    );
  }

  @Get('channels')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('cookie')
  @ApiOperation({
    summary: '📋 List Active Webhook Channels',
    description: 'Get all active webhook watch channels for the current user',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Channels retrieved',
    type: SuccessResponseDto,
  })
  async getUserChannels(
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const channels = await this.webhookService.getUserChannels(userId);

    return new SuccessResponseDto('Active webhook channels retrieved', {
      channels,
      count: channels.length,
    });
  }

  @Delete('watch/:channelId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiCookieAuth('cookie')
  @ApiOperation({
    summary: '🛑 Stop Watching Calendar',
    description:
      'Stop a webhook watch channel and unsubscribe from notifications',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Webhook watch stopped',
    type: SuccessResponseDto,
  })
  async stopWatch(
    @CurrentUserId() userId: string,
    @Param('channelId') channelId: string,
  ): Promise<SuccessResponseDto> {
    const stopped = await this.webhookService.stopWatch(userId, channelId);

    return new SuccessResponseDto(
      stopped
        ? 'Webhook watch stopped successfully'
        : 'Failed to stop webhook watch',
      { stopped },
      stopped ? HttpStatus.OK : HttpStatus.NOT_FOUND,
    );
  }
}
