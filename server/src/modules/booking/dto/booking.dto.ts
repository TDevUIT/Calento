import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsUrl,
  IsEmail,
  IsDateString,
  IsEnum,
  Min,
  Max,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';
import { BookingStatus } from '../interfaces/booking.interface';

export class CreateBookingLinkDto {
  @ApiProperty({
    description: 'URL slug for the booking link',
    example: 'quick-meeting',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiProperty({
    description: 'Title of the booking link',
    example: '30-Minute Consultation',
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'Description of what this booking is for',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Location name for the booking link',
    example: 'Google Meet',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({
    description: 'Location URL for the booking link',
    example: 'https://meet.google.com/abc-defg-hij',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null) return undefined;
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (!trimmed.includes('://')) return `https://${trimmed}`;
    return trimmed;
  })
  @IsUrl(
    { require_protocol: true },
    { message: 'location_link must be a valid URL' },
  )
  location_link?: string;

  @ApiProperty({
    description: 'Duration of the booking in minutes',
    example: 30,
  })
  @Type(() => Number)
  @IsInt()
  @Min(15)
  @Max(480)
  duration_minutes: number;

  @ApiPropertyOptional({
    description: 'Buffer time between bookings in minutes',
    example: 10,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(120)
  buffer_time_minutes?: number;

  @ApiPropertyOptional({
    description: 'Maximum bookings allowed per day',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  max_bookings_per_day?: number;

  @ApiPropertyOptional({
    description: 'Minimum advance notice required in hours',
    example: 24,
    default: 24,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(720)
  advance_notice_hours?: number;

  @ApiPropertyOptional({
    description: 'How many days in advance can people book',
    example: 60,
    default: 60,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  booking_window_days?: number;

  @ApiPropertyOptional({
    description: 'Color for the booking link',
    example: '#4F46E5',
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-F]{6}$/i, {
    message: 'color must be a valid hex color code',
  })
  color?: string;

  @ApiPropertyOptional({
    description: 'Timezone for the booking link',
    example: 'Asia/Ho_Chi_Minh',
    default: 'UTC',
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Whether the booking link is active',
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true';
    return value;
  })
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateBookingLinkDto {
  @ApiPropertyOptional({
    description: 'Title of the booking link',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Location name',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({
    description: 'Location URL',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null) return undefined;
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (!trimmed.includes('://')) return `https://${trimmed}`;
    return trimmed;
  })
  @IsUrl(
    { require_protocol: true },
    { message: 'location_link must be a valid URL' },
  )
  location_link?: string;

  @ApiPropertyOptional({
    description: 'Duration in minutes',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(15)
  @Max(480)
  duration_minutes?: number;

  @ApiPropertyOptional({
    description: 'Buffer time in minutes',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(120)
  buffer_time_minutes?: number;

  @ApiPropertyOptional({
    description: 'Max bookings per day',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  max_bookings_per_day?: number;

  @ApiPropertyOptional({
    description: 'Advance notice in hours',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(720)
  advance_notice_hours?: number;

  @ApiPropertyOptional({
    description: 'Booking window in days',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  booking_window_days?: number;

  @ApiPropertyOptional({
    description: 'Color',
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-F]{6}$/i)
  color?: string;

  @ApiPropertyOptional({
    description: 'Timezone',
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Is active',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class CreateBookingDto {
  @ApiProperty({
    description: 'Booker full name',
    example: 'John Doe',
  })
  @IsString()
  @MaxLength(255)
  booker_name: string;

  @ApiProperty({
    description: 'Booker email address',
    example: 'john@example.com',
  })
  @IsEmail()
  booker_email: string;

  @ApiPropertyOptional({
    description: 'Booker phone number',
    example: '+84901234567',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  booker_phone?: string;

  @ApiPropertyOptional({
    description: 'Notes from the booker',
  })
  @IsOptional()
  @IsString()
  booker_notes?: string;

  @ApiProperty({
    description: 'Start time of the booking',
    example: '2025-10-05T14:00:00Z',
  })
  @IsDateString()
  start_time: string;

  @ApiProperty({
    description: 'Timezone of the booker',
    example: 'Asia/Ho_Chi_Minh',
  })
  @IsOptional()
  @IsString()
  timezone?: string;
}

export class CancelBookingDto {
  @ApiPropertyOptional({
    description: 'Reason for cancellation',
  })
  @IsOptional()
  @IsString()
  cancellation_reason?: string;
}

export class RescheduleBookingDto {
  @ApiProperty({
    description: 'New start time',
    example: '2025-10-06T15:00:00Z',
  })
  @IsDateString()
  start_time: string;

  @ApiPropertyOptional({
    description: 'Reason for rescheduling',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class GetBookingAvailableSlotsDto {
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
    description: 'Timezone for the slots',
    example: 'Asia/Ho_Chi_Minh',
  })
  @IsOptional()
  @IsString()
  timezone?: string;
}

export class BookingLinkResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  location_link?: string;

  @ApiProperty()
  duration_minutes: number;

  @ApiProperty()
  buffer_time_minutes: number;

  @ApiPropertyOptional()
  max_bookings_per_day?: number;

  @ApiProperty()
  advance_notice_hours: number;

  @ApiProperty()
  booking_window_days: number;

  @ApiProperty()
  is_active: boolean;

  @ApiPropertyOptional()
  color?: string;

  @ApiProperty()
  timezone: string;

  @ApiPropertyOptional({
    description: 'Count of non-cancelled bookings for this link',
    example: 5,
  })
  bookings_count?: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class BookingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  booking_link_id: string;

  @ApiProperty()
  user_id: string;

  @ApiPropertyOptional()
  event_id?: string;

  @ApiProperty()
  booker_name: string;

  @ApiProperty()
  booker_email: string;

  @ApiPropertyOptional()
  booker_phone?: string;

  @ApiPropertyOptional()
  booker_notes?: string;

  @ApiProperty()
  start_time: Date;

  @ApiProperty()
  end_time: Date;

  @ApiProperty()
  timezone: string;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiPropertyOptional()
  cancellation_reason?: string;

  @ApiPropertyOptional()
  cancelled_at?: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class BookingTimeSlotResponseDto {
  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  available: boolean;

  @ApiPropertyOptional()
  reason?: string;
}
