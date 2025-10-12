import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsUUID,
  IsNotEmpty,
  MaxLength,
  IsISO8601,
  ValidateIf,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export function IsAfterStartTime(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterStartTime',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (!value || !relatedValue) return true;
          return new Date(value) > new Date(relatedValue);
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be after ${relatedPropertyName}`;
        },
      },
    });
  };
}

export class CreateEventDto {
  @ApiProperty({
    description: 'Calendar ID where the event will be created',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  calendar_id: string;

  @ApiProperty({
    description: 'Event title',
    example: 'Team Meeting',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Weekly team sync meeting to discuss project progress',
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Event start time in ISO 8601 format',
    example: '2024-01-15T10:00:00Z',
  })
  @IsISO8601()
  start_time: string;

  @ApiProperty({
    description: 'Event end time in ISO 8601 format',
    example: '2024-01-15T11:00:00Z',
  })
  @IsISO8601()
  @IsAfterStartTime('start_time', {
    message: 'End time must be after start time',
  })
  end_time: string;

  @ApiPropertyOptional({
    description: 'Event location',
    example: 'Conference Room A',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @ApiProperty({
    description: 'Whether the event is an all-day event',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_all_day?: boolean = false;

  @ApiPropertyOptional({
    description: 'Event color for UI display',
    example: 'blue',
    enum: ['blue', 'green', 'pink', 'purple', 'orange', 'red', 'default'],
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({
    description: 'Recurrence rule (RRULE format)',
    example: 'FREQ=WEEKLY;BYDAY=MO',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  recurrence_rule?: string;
}

export class UpdateEventDto {
  @ApiPropertyOptional({
    description: 'Event title',
    example: 'Updated Team Meeting',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Updated weekly team sync meeting',
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Event start time in ISO 8601 format',
    example: '2024-01-15T10:30:00Z',
  })
  @IsISO8601()
  @IsOptional()
  start_time?: string;

  @ApiPropertyOptional({
    description: 'Event end time in ISO 8601 format',
    example: '2024-01-15T11:30:00Z',
  })
  @IsISO8601()
  @IsOptional()
  end_time?: string;

  @ApiPropertyOptional({
    description: 'Event location',
    example: 'Conference Room B',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({
    description: 'Whether the event is an all-day event',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_all_day?: boolean;

  @ApiPropertyOptional({
    description: 'Event color for UI display',
    example: 'green',
    enum: ['blue', 'green', 'pink', 'purple', 'orange', 'red', 'default'],
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({
    description: 'Recurrence rule (RRULE format)',
    example: 'FREQ=DAILY;COUNT=5',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  recurrence_rule?: string;
}

export class EventResponseDto {
  @ApiProperty({
    description: 'Event unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Calendar ID where the event belongs',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  calendar_id: string;

  @ApiProperty({
    description: 'User ID who owns the event',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  user_id: string;

  @ApiProperty({
    description: 'Event title',
    example: 'Team Meeting',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Weekly team sync meeting to discuss project progress',
  })
  description?: string;

  @ApiProperty({
    description: 'Event start time',
    example: '2024-01-15T10:00:00Z',
  })
  start_time: Date;

  @ApiProperty({
    description: 'Event end time',
    example: '2024-01-15T11:00:00Z',
  })
  end_time: Date;

  @ApiProperty({
    description: 'Event status',
    example: 'confirmed',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Event color',
    example: 'blue',
  })
  color?: string;

  @ApiProperty({
    description: 'Event attendees',
    example: [],
  })
  attendees: any[];

  @ApiProperty({
    description: 'Event reminders',
    example: [],
  })
  reminders: any[];

  @ApiPropertyOptional({
    description: 'Event location',
    example: 'Conference Room A',
  })
  location?: string;

  @ApiProperty({
    description: 'Whether the event is an all-day event',
    example: false,
  })
  is_all_day: boolean;

  @ApiPropertyOptional({
    description: 'Recurrence rule (RRULE format)',
    example: 'FREQ=WEEKLY;BYDAY=MO',
  })
  recurrence_rule?: string;

  @ApiProperty({
    description: 'Created timestamp',
    example: '2024-01-15T10:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Updated timestamp',
    example: '2024-01-15T10:00:00Z',
  })
  updated_at: Date;
}

export class EventQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by calendar ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  calendar_id?: string;

  @ApiPropertyOptional({
    description: 'Start date filter (ISO 8601 format)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsISO8601()
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'End date filter (ISO 8601 format)',
    example: '2024-01-31T23:59:59Z',
  })
  @IsISO8601()
  @IsOptional()
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Search term for title or description',
    example: 'meeting',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by location',
    example: 'Conference Room',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({
    description: 'Filter by all-day events',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  is_all_day?: boolean;
}

export class BulkEventOperationDto {
  @ApiProperty({
    description: 'Array of event IDs to operate on',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '456e7890-e89b-12d3-a456-426614174001',
    ],
  })
  @IsUUID(4, { each: true })
  @IsNotEmpty()
  event_ids: string[];
}

export class EventConflictCheckDto {
  @ApiProperty({
    description: 'Event start time in ISO 8601 format',
    example: '2024-01-15T10:00:00Z',
  })
  @IsISO8601()
  start_time: string;

  @ApiProperty({
    description: 'Event end time in ISO 8601 format',
    example: '2024-01-15T11:00:00Z',
  })
  @IsISO8601()
  end_time: string;

  @ApiPropertyOptional({
    description: 'Event ID to exclude from conflict check (for updates)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4)
  @IsOptional()
  exclude_event_id?: string;
}

export class RecurringEventsQueryDto {
  @ApiProperty({
    description: 'Start date for recurring event expansion in ISO 8601 format',
    example: '2024-01-01T00:00:00Z',
  })
  @IsISO8601()
  start_date: string;

  @ApiProperty({
    description: 'End date for recurring event expansion in ISO 8601 format',
    example: '2024-01-31T23:59:59Z',
  })
  @IsISO8601()
  @IsAfterStartTime('start_date', {
    message: 'End date must be after start date',
  })
  end_date: string;

  @ApiPropertyOptional({
    description: 'Maximum number of occurrences to return per recurring event',
    example: 100,
    default: 100,
  })
  @IsOptional()
  max_occurrences?: number = 100;
}
