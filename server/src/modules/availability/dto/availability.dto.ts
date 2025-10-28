import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
  Max,
  Matches,
  IsEnum,
} from 'class-validator';
import { DayOfWeek } from '../interfaces/availability.interface';

export class CreateAvailabilityDto {
  @ApiProperty({
    description: 'Day of week (0=Sunday, 6=Saturday)',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  @IsEnum(DayOfWeek)
  day_of_week: DayOfWeek;

  @ApiProperty({
    description: 'Start time in HH:MM:SS format',
    example: '09:00:00',
  })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/, {
    message: 'start_time must be in HH:MM:SS format',
  })
  start_time: string;

  @ApiProperty({
    description: 'End time in HH:MM:SS format',
    example: '17:00:00',
  })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/, {
    message: 'end_time must be in HH:MM:SS format',
  })
  end_time: string;

  @ApiPropertyOptional({
    description: 'Timezone (IANA timezone name)',
    example: 'Asia/Ho_Chi_Minh',
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Whether this availability rule is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateAvailabilityDto {
  @ApiPropertyOptional({
    description: 'Day of week (0=Sunday, 6=Saturday)',
    enum: DayOfWeek,
  })
  @IsOptional()
  @IsEnum(DayOfWeek)
  day_of_week?: DayOfWeek;

  @ApiPropertyOptional({
    description: 'Start time in HH:MM:SS format',
    example: '09:00:00',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/, {
    message: 'start_time must be in HH:MM:SS format',
  })
  start_time?: string;

  @ApiPropertyOptional({
    description: 'End time in HH:MM:SS format',
    example: '17:00:00',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/, {
    message: 'end_time must be in HH:MM:SS format',
  })
  end_time?: string;

  @ApiPropertyOptional({
    description: 'Timezone (IANA timezone name)',
    example: 'Asia/Ho_Chi_Minh',
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Whether this availability rule is active',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class CheckAvailabilityDto {
  @ApiProperty({
    description: 'Start datetime to check',
    example: '2025-10-05T14:00:00Z',
  })
  @IsDateString()
  start_datetime: string;

  @ApiProperty({
    description: 'End datetime to check',
    example: '2025-10-05T15:00:00Z',
  })
  @IsDateString()
  end_datetime: string;

  @ApiPropertyOptional({
    description: 'User ID to check (defaults to current user)',
  })
  @IsOptional()
  @IsString()
  user_id?: string;
}

export class GetAvailableSlotsDto {
  @ApiProperty({
    description: 'Start date for slot search',
    example: '2025-10-05',
  })
  @IsDateString()
  start_date: string;

  @ApiProperty({
    description: 'End date for slot search',
    example: '2025-10-12',
  })
  @IsDateString()
  end_date: string;

  @ApiPropertyOptional({
    description: 'Duration of each slot in minutes',
    example: 30,
    default: 30,
  })
  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(480)
  duration_minutes?: number;

  @ApiPropertyOptional({
    description: 'Timezone (IANA timezone name) for slot generation',
    example: 'Asia/Bangkok',
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'User ID to get slots for (defaults to current user)',
  })
  @IsOptional()
  @IsString()
  user_id?: string;
}

export class BulkCreateAvailabilityDto {
  @ApiProperty({
    description: 'Array of availability rules to create',
    type: [CreateAvailabilityDto],
  })
  availabilities: CreateAvailabilityDto[];
}

export class AvailabilityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty({ enum: DayOfWeek })
  day_of_week: DayOfWeek;

  @ApiProperty()
  start_time: string;

  @ApiProperty()
  end_time: string;

  @ApiPropertyOptional()
  timezone?: string;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class TimeSlotResponseDto {
  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  available: boolean;
}

export class CheckAvailabilityResponseDto {
  @ApiProperty()
  available: boolean;

  @ApiProperty({ type: [Object] })
  conflicts: Array<{
    event_id: string;
    title: string;
    start_time: Date;
    end_time: Date;
  }>;

  @ApiPropertyOptional({ type: [Date] })
  suggestions?: Date[];
}
