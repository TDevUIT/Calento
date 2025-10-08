import { IsString, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GoogleAuthCallbackDto {
  @ApiProperty({
    description: 'OAuth authorization code from Google',
    example: '4/0AX4XfWh...',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({
    description: 'State parameter for security',
    example: 'user_123',
  })
  @IsString()
  @IsOptional()
  state?: string;
}

export class GoogleConnectionStatusDto {
  @ApiProperty({
    description: 'Whether user is connected to Google Calendar',
    example: true,
  })
  connected: boolean;

  @ApiPropertyOptional({
    description: 'Token expiration date',
    example: '2024-12-31T23:59:59Z',
  })
  expires_at?: Date;

  @ApiPropertyOptional({
    description: 'Connected scopes',
    example: 'https://www.googleapis.com/auth/calendar',
  })
  scope?: string;
}

export class SyncCalendarsResponseDto {
  @ApiProperty({
    description: 'Whether sync was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Number of calendars synced',
    example: 5,
  })
  count: number;

  @ApiPropertyOptional({
    description: 'List of synced calendar IDs',
  })
  calendar_ids?: string[];
}
