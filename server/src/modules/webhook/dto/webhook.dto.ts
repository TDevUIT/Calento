import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

/**
 * Google Calendar Webhook Notification Headers
 * Sent by Google when calendar changes occur
 */
export class GoogleWebhookHeadersDto {
  @ApiProperty({
    description: 'Channel ID that was created when watching the calendar',
    example: 'channel-uuid-12345',
  })
  @IsString()
  'x-goog-channel-id': string;

  @ApiProperty({
    description: 'Channel token for verification',
    example: 'user-token-abc123',
    required: false,
  })
  @IsString()
  @IsOptional()
  'x-goog-channel-token'?: string;

  @ApiProperty({
    description: 'Channel expiration time in Unix milliseconds',
    example: 1609459200000,
  })
  @IsNumber()
  'x-goog-channel-expiration': number;

  @ApiProperty({
    description: 'Resource ID that identifies the watched resource',
    example: 'resource-id-xyz',
  })
  @IsString()
  'x-goog-resource-id': string;

  @ApiProperty({
    description: 'Resource URI being watched',
    example: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
  })
  @IsString()
  'x-goog-resource-uri': string;

  @ApiProperty({
    description: 'Resource state (sync or exists)',
    example: 'exists',
    enum: ['sync', 'exists'],
  })
  @IsString()
  'x-goog-resource-state': 'sync' | 'exists';

  @ApiProperty({
    description: 'Message number for this channel',
    example: 1,
  })
  @IsNumber()
  'x-goog-message-number': number;
}

/**
 * DTO for creating a new webhook watch channel
 */
export class CreateWebhookChannelDto {
  @ApiProperty({
    description: 'Calendar ID to watch',
    example: 'primary',
    default: 'primary',
  })
  @IsString()
  @IsOptional()
  calendar_id?: string;

  @ApiProperty({
    description: 'Custom token for verification (optional)',
    example: 'my-secure-token',
    required: false,
  })
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty({
    description: 'Expiration time in milliseconds (max 604800000 = 7 days)',
    example: 604800000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  expiration?: number;
}

/**
 * Response DTO for webhook channel creation
 */
export class WebhookChannelResponseDto {
  @ApiProperty({
    description: 'Channel ID',
    example: 'channel-uuid-12345',
  })
  channel_id: string;

  @ApiProperty({
    description: 'Resource ID from Google',
    example: 'resource-id-xyz',
  })
  resource_id: string;

  @ApiProperty({
    description: 'Expiration timestamp',
    example: '2024-01-15T10:00:00Z',
  })
  expiration: string;

  @ApiProperty({
    description: 'Calendar ID being watched',
    example: 'primary',
  })
  calendar_id: string;

  @ApiProperty({
    description: 'Whether the channel is active',
    example: true,
  })
  is_active: boolean;
}

/**
 * DTO for stopping a webhook channel
 */
export class StopWebhookChannelDto {
  @ApiProperty({
    description: 'Channel ID to stop',
    example: 'channel-uuid-12345',
  })
  @IsString()
  channel_id: string;

  @ApiProperty({
    description: 'Resource ID from Google',
    example: 'resource-id-xyz',
  })
  @IsString()
  resource_id: string;
}

/**
 * Webhook notification event
 */
export interface WebhookNotificationEvent {
  channel_id: string;
  resource_id: string;
  resource_state: 'sync' | 'exists';
  resource_uri: string;
  user_id?: string;
  calendar_id?: string;
  message_number: number;
  timestamp: Date;
}
