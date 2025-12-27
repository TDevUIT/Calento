import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusEntityDto } from '../../../common/dto/base-entity.dto';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({
    description: 'Password hash',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password_hash: string;

  @ApiPropertyOptional({
    description: 'First name',
    example: 'John',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  first_name?: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Doe',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  last_name?: string;
}

export class UpdateUserDto extends StatusEntityDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Username',
    example: 'johndoe',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @ApiPropertyOptional({
    description: 'First name',
    example: 'John',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  first_name?: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Doe',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  last_name?: string;

  @ApiPropertyOptional({
    description: 'Avatar URL',
    example:
      'https://res.cloudinary.com/demo/image/upload/v1234567890/avatars/user_123.jpg',
  })
  @IsString()
  @IsOptional()
  avatar?: string | null;

  @ApiPropertyOptional({
    description: 'Email verification status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;
}

export class UserResponseDto extends StatusEntityDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  username: string;

  @ApiPropertyOptional({
    description: 'First name',
    example: 'John',
  })
  first_name?: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Doe',
  })
  last_name?: string;

  @ApiPropertyOptional({
    description: 'Avatar URL',
    example:
      'https://res.cloudinary.com/demo/image/upload/v1234567890/avatars/user_123.jpg',
  })
  avatar?: string;

  @ApiProperty({
    description: 'Email verification status',
    example: true,
  })
  is_verified: boolean;
}
