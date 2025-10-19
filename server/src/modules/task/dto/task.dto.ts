import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  IsISO8601,
  IsArray,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserOwnedEntityDto, SoftDeletableEntityDto } from '../../../common/dto/base-entity.dto';
import { PaginationQueryDto, SearchPaginationQueryDto } from '../../../common/dto/pagination.dto';
import { TaskStatus, TaskPriority } from '../task.interface';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Write comprehensive documentation for the API',
    maxLength: 2000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TODO;

  @ApiProperty({
    description: 'Task priority',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @ApiPropertyOptional({
    description: 'Task due date',
    example: '2024-12-31T23:59:59Z',
  })
  @IsISO8601()
  @IsOptional()
  due_date?: string;

  @ApiPropertyOptional({
    description: 'Task tags',
    example: ['urgent', 'development'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Parent task ID for subtasks',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsOptional()
  parent_task_id?: string;

  @ApiPropertyOptional({
    description: 'Estimated duration in minutes',
    example: 120,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  estimated_duration?: number;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    description: 'Task completion timestamp',
    example: '2024-01-15T10:00:00Z',
  })
  @IsISO8601()
  @IsOptional()
  completed_at?: string;

  @ApiPropertyOptional({
    description: 'Actual duration in minutes',
    example: 135,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  actual_duration?: number;
}

export class TaskResponseDto extends UserOwnedEntityDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Write comprehensive documentation for the API',
  })
  description?: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Task priority',
    enum: TaskPriority,
  })
  priority: TaskPriority;

  @ApiPropertyOptional({
    description: 'Task due date',
    example: '2024-12-31T23:59:59Z',
  })
  due_date?: Date;

  @ApiPropertyOptional({
    description: 'Task completion timestamp',
    example: '2024-01-15T10:00:00Z',
  })
  completed_at?: Date;

  @ApiPropertyOptional({
    description: 'Task tags',
    example: ['urgent', 'development'],
    type: [String],
  })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Parent task ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  parent_task_id?: string;

  @ApiPropertyOptional({
    description: 'Soft deletion flag',
    example: false,
  })
  is_deleted?: boolean;

  @ApiPropertyOptional({
    description: 'Deletion timestamp',
    example: '2024-01-15T10:00:00Z',
  })
  deleted_at?: Date;

  @ApiPropertyOptional({
    description: 'Estimated duration in minutes',
    example: 120,
  })
  estimated_duration?: number;

  @ApiPropertyOptional({
    description: 'Actual duration in minutes',
    example: 135,
  })
  actual_duration?: number;
}

export class TaskQueryDto extends SearchPaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by task status',
    enum: TaskStatus,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Filter by task priority',
    enum: TaskPriority,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Filter by project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Filter tasks due before this date',
    example: '2024-12-31T23:59:59Z',
  })
  @IsISO8601()
  @IsOptional()
  due_before?: string;

  @ApiPropertyOptional({
    description: 'Filter tasks due after this date',
    example: '2024-01-01T00:00:00Z',
  })
  @IsISO8601()
  @IsOptional()
  due_after?: string;

  @ApiPropertyOptional({
    description: 'Filter by tags',
    example: 'urgent,development',
  })
  @IsString()
  @IsOptional()
  tags?: string;
}
