import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum InvitationResponseStatus {
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  TENTATIVE = 'tentative',
  NEEDS_ACTION = 'needsAction',
}

export class RespondToInvitationDto {
  @ApiProperty({
    description: 'Response status',
    enum: InvitationResponseStatus,
    example: InvitationResponseStatus.ACCEPTED,
  })
  @IsEnum(InvitationResponseStatus)
  responseStatus: InvitationResponseStatus;

  @ApiProperty({
    description: 'Add event to Calento calendar (for authenticated users)',
    example: true,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  addToCalento?: boolean;

  @ApiProperty({
    description: 'Guest email (for non-authenticated users)',
    example: 'guest@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  guestEmail?: string;

  @ApiProperty({
    description: 'Guest name (for non-authenticated users)',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  guestName?: string;
}

export class InvitationResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Whether event was added to calendar' })
  eventAddedToCalendar: boolean;

  @ApiProperty({
    description: 'Whether user needs to sign up',
    required: false,
  })
  needsSignup?: boolean;

  @ApiProperty({
    description: 'Calendar file URL for guest users',
    required: false,
  })
  icsFileUrl?: string;
}

export class CreateInvitationDto {
  @ApiProperty({ description: 'Event ID' })
  @IsUUID()
  eventId: string;

  @ApiProperty({ description: 'Attendee email' })
  @IsEmail()
  attendeeEmail: string;

  @ApiProperty({ description: 'Attendee name', required: false })
  @IsOptional()
  attendeeName?: string;
}
