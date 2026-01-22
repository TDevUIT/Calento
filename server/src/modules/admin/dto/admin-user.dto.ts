import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { UpdateUserDto, UserResponseDto } from '../../users/dto/user.dto';

export class AdminUpdateUserDto extends UpdateUserDto {
  @ApiPropertyOptional({
    description: 'System admin flag',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  is_admin?: boolean;
}

export class AdminUserResponseDto extends UserResponseDto {
  @ApiPropertyOptional({
    description: 'System admin flag',
    example: false,
  })
  is_admin?: boolean;
}

export class SetUserActiveDto {
  @ApiPropertyOptional({
    description: 'Active status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class SetUserAdminDto {
  @ApiPropertyOptional({
    description: 'System admin flag',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_admin?: boolean;
}
