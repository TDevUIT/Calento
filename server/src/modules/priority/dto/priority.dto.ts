import { IsEnum, IsString, IsInt, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemType, PriorityLevel } from '../interfaces/priority.interface';

export class UpdatePriorityDto {
  @ApiProperty({ description: 'ID of the item', example: 'task-123' })
  @IsString()
  item_id: string;

  @ApiProperty({ description: 'Type of item', enum: ItemType })
  @IsEnum(ItemType)
  item_type: ItemType;

  @ApiProperty({ description: 'Priority level', enum: PriorityLevel })
  @IsEnum(PriorityLevel)
  priority: PriorityLevel;

  @ApiPropertyOptional({ description: 'Position within priority column', example: 0 })
  @IsOptional()
  @IsInt()
  position?: number;
}

export class BulkUpdatePriorityDto {
  @ApiProperty({ description: 'Array of priority updates', type: [UpdatePriorityDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePriorityDto)
  updates: UpdatePriorityDto[];
}

export class PriorityResponseDto {
  @ApiProperty({ description: 'Priority ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  user_id: string;

  @ApiProperty({ description: 'Item ID' })
  item_id: string;

  @ApiProperty({ description: 'Item type', enum: ItemType })
  item_type: ItemType;

  @ApiProperty({ description: 'Priority level', enum: PriorityLevel })
  priority: PriorityLevel;

  @ApiProperty({ description: 'Position' })
  position: number;

  @ApiProperty({ description: 'Created at' })
  created_at: Date;

  @ApiProperty({ description: 'Updated at' })
  updated_at: Date;
}
