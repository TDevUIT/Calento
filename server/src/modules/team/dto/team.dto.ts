import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsEnum,
  IsArray,
  IsDateString,
  Min,
  Max,
  MaxLength,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TEAM_CONSTANTS } from '../constants/team.constants';

export class TeamSettingsDto {
  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  auto_buffer_enabled?: boolean;

  @ApiPropertyOptional({ default: 5 })
  @IsInt()
  @Min(0)
  @Max(TEAM_CONSTANTS.BUFFER.MAX_BUFFER)
  @IsOptional()
  buffer_before_minutes?: number;

  @ApiPropertyOptional({ default: 5 })
  @IsInt()
  @Min(0)
  @Max(TEAM_CONSTANTS.BUFFER.MAX_BUFFER)
  @IsOptional()
  buffer_after_minutes?: number;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  allow_member_invites?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  require_approval?: boolean;
}

export class CreateTeamDto {
  @ApiProperty({ example: 'Engineering Team' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(TEAM_CONSTANTS.LIMITS.MAX_NAME_LENGTH)
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(TEAM_CONSTANTS.LIMITS.MAX_DESCRIPTION_LENGTH)
  description?: string;

  @ApiPropertyOptional({ example: 'UTC' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  settings?: TeamSettingsDto;
}

export class UpdateTeamDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(TEAM_CONSTANTS.LIMITS.MAX_NAME_LENGTH)
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(TEAM_CONSTANTS.LIMITS.MAX_DESCRIPTION_LENGTH)
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  settings?: TeamSettingsDto;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class InviteMemberDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ enum: ['admin', 'member'], default: 'member' })
  @IsEnum(['admin', 'member'])
  @IsOptional()
  role?: 'admin' | 'member';
}

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: ['admin', 'member'] })
  @IsEnum(['admin', 'member'])
  role: 'admin' | 'member';
}

export class CreateRitualDto {
  @ApiProperty({ example: 'Daily Standup' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(TEAM_CONSTANTS.LIMITS.MAX_NAME_LENGTH)
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR' })
  @IsString()
  @IsNotEmpty()
  recurrence_rule: string;

  @ApiPropertyOptional({ default: 30 })
  @IsInt()
  @Min(5)
  @Max(480)
  @IsOptional()
  duration_minutes?: number;

  @ApiPropertyOptional({ default: 5 })
  @IsInt()
  @Min(0)
  @Max(TEAM_CONSTANTS.BUFFER.MAX_BUFFER)
  @IsOptional()
  buffer_before?: number;

  @ApiPropertyOptional({ default: 5 })
  @IsInt()
  @Min(0)
  @Max(TEAM_CONSTANTS.BUFFER.MAX_BUFFER)
  @IsOptional()
  buffer_after?: number;

  @ApiPropertyOptional({
    enum: Object.values(TEAM_CONSTANTS.ROTATION_TYPES),
    default: 'none',
  })
  @IsEnum(Object.values(TEAM_CONSTANTS.ROTATION_TYPES))
  @IsOptional()
  rotation_type?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  rotation_order?: string[];
}

export class UpdateRitualDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(TEAM_CONSTANTS.LIMITS.MAX_NAME_LENGTH)
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  recurrence_rule?: string;

  @ApiPropertyOptional()
  @IsInt()
  @Min(5)
  @Max(480)
  @IsOptional()
  duration_minutes?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  @Max(TEAM_CONSTANTS.BUFFER.MAX_BUFFER)
  @IsOptional()
  buffer_before?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  @Max(TEAM_CONSTANTS.BUFFER.MAX_BUFFER)
  @IsOptional()
  buffer_after?: number;

  @ApiPropertyOptional()
  @IsEnum(Object.values(TEAM_CONSTANTS.ROTATION_TYPES))
  @IsOptional()
  rotation_type?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  rotation_order?: string[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class GetAvailabilityHeatmapDto {
  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ example: '2024-01-07' })
  @IsDateString()
  end_date: string;

  @ApiPropertyOptional({ default: 'UTC' })
  @IsString()
  @IsOptional()
  timezone?: string;
}

export class FindOptimalTimeDto {
  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ example: '2024-01-07' })
  @IsDateString()
  end_date: string;

  @ApiProperty({ default: 60 })
  @IsInt()
  @Min(15)
  @Max(480)
  duration_minutes: number;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  required_members?: string[];

  @ApiPropertyOptional({ default: 'UTC' })
  @IsString()
  @IsOptional()
  timezone?: string;
}
