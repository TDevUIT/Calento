import { IsOptional, IsPositive, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'created_at',
  })
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    example: 'DESC',
  })
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class SearchPaginationQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Search term',
    example: 'john@example.com',
  })
  @IsOptional()
  search?: string;
}

export class EventQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Start date for filtering events (ISO 8601 format)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering events (ISO 8601 format)',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Filter by calendar ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  calendar_id?: string;
}
