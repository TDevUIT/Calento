import { IsOptional, IsUUID, IsDateString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export abstract class BaseEntityDto {
    @ApiPropertyOptional({
        description: 'Entity ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsOptional()
    @IsUUID(4)
    id?: string;

    @ApiPropertyOptional({
        description: 'Creation timestamp',
        example: '2024-01-15T10:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    created_at?: Date;

    @ApiPropertyOptional({
        description: 'Last update timestamp',
        example: '2024-01-15T10:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    updated_at?: Date;
}


export abstract class UserOwnedEntityDto extends BaseEntityDto {
    @ApiPropertyOptional({
        description: 'Owner user ID',
        example: '456e7890-e89b-12d3-a456-426614174001'
    })
    @IsOptional()
    @IsUUID(4)
    user_id?: string;
}


export abstract class SoftDeletableEntityDto extends BaseEntityDto {
    @ApiPropertyOptional({
        description: 'Deletion timestamp',
        example: '2024-01-15T10:00:00Z'
    })
    @IsOptional()
    @IsDateString()
    deleted_at?: Date;

    @ApiPropertyOptional({
        description: 'Soft deletion flag',
        example: false
    })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    is_deleted?: boolean;
}


export abstract class StatusEntityDto extends BaseEntityDto {
    @ApiPropertyOptional({
        description: 'Active status',
        example: true
    })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    is_active?: boolean;
}
