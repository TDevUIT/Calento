import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCalendarDto {
  @ApiProperty({
    description: 'Google Calendar ID from external provider',
    example: 'primary',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  google_calendar_id: string;

  @ApiPropertyOptional({
    description: 'Calendar display name',
    example: 'Work Calendar',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Calendar description',
    example: 'My primary work calendar for meetings and tasks',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Calendar timezone (IANA format)',
    example: 'Asia/Ho_Chi_Minh',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  timezone?: string;

  @ApiProperty({
    description: 'Whether this is the primary calendar',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_primary?: boolean = false;
}

export class UpdateCalendarDto {
  @ApiPropertyOptional({
    description: 'Calendar display name',
    example: 'Updated Work Calendar',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Calendar description',
    example: 'Updated calendar description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Calendar timezone (IANA format)',
    example: 'America/New_York',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Whether this is the primary calendar',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;
}

export class CalendarResponseDto {
  @ApiProperty({
    description: 'Calendar unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who owns the calendar',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  user_id: string;

  @ApiProperty({
    description: 'Google Calendar ID from external provider',
    example: 'primary',
  })
  google_calendar_id: string;

  @ApiPropertyOptional({
    description: 'Calendar display name',
    example: 'Work Calendar',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Calendar description',
    example: 'My primary work calendar',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Calendar timezone',
    example: 'Asia/Ho_Chi_Minh',
  })
  timezone?: string;

  @ApiProperty({
    description: 'Whether this is the primary calendar',
    example: true,
  })
  is_primary: boolean;

  @ApiProperty({
    description: 'Calendar creation timestamp',
    example: '2024-01-10T08:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Calendar last update timestamp',
    example: '2024-01-12T14:30:00Z',
  })
  updated_at: Date;
}

export class CalendarQueryDto {
  @ApiPropertyOptional({
    description: 'Search term for calendar name or description',
    example: 'work',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by primary calendar status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by timezone',
    example: 'Asia/Ho_Chi_Minh',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  timezone?: string;
}

export class SyncCalendarsDto {
  @ApiProperty({
    description: 'Force full sync instead of incremental',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  force_full_sync?: boolean = false;
}
