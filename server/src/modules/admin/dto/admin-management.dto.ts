import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../../booking/interfaces/booking.interface';

export class AdminUpdateBookingStatusDto {
  @ApiPropertyOptional({
    enum: BookingStatus,
    description: 'Booking status',
    example: BookingStatus.CANCELLED,
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiPropertyOptional({
    description: 'Cancellation reason (if status is cancelled)',
  })
  @IsString()
  @IsOptional()
  cancellation_reason?: string;
}

export class AdminSetActiveDto {
  @ApiPropertyOptional({
    description: 'Active status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
