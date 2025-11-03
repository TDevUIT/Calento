import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';

export class UploadAvatarDto {
  @ApiProperty({
    description: 'Image file to upload',
    type: 'string',
    format: 'binary',
  })
  file: any;
}

export class CloudinaryUploadResponseDto {
  @ApiProperty({
    description: 'Public ID of the uploaded image',
    example: 'avatars/user_123_abc123',
  })
  public_id: string;

  @ApiProperty({
    description: 'Secure URL of the uploaded image',
    example: 'https://res.cloudinary.com/demo/image/upload/v1234567890/avatars/user_123.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Secure HTTPS URL',
    example: 'https://res.cloudinary.com/demo/image/upload/v1234567890/avatars/user_123.jpg',
  })
  secure_url: string;

  @ApiProperty({
    description: 'Image width in pixels',
    example: 500,
  })
  width: number;

  @ApiProperty({
    description: 'Image height in pixels',
    example: 500,
  })
  height: number;

  @ApiProperty({
    description: 'Image format',
    example: 'jpg',
  })
  format: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 102400,
  })
  bytes: number;
}

export class UpdateAvatarDto {
  @ApiProperty({
    description: 'Cloudinary secure URL of the avatar',
    example: 'https://res.cloudinary.com/demo/image/upload/v1234567890/avatars/user_123.jpg',
  })
  @IsString()
  avatar_url: string;
}

export class TransformImageDto {
  @ApiPropertyOptional({
    description: 'Target width',
    example: 500,
  })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(2000)
  width?: number;

  @ApiPropertyOptional({
    description: 'Target height',
    example: 500,
  })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(2000)
  height?: number;

  @ApiPropertyOptional({
    description: 'Crop mode',
    example: 'fill',
    enum: ['fill', 'scale', 'fit', 'limit', 'pad', 'crop'],
  })
  @IsOptional()
  @IsEnum(['fill', 'scale', 'fit', 'limit', 'pad', 'crop'])
  crop?: 'fill' | 'scale' | 'fit' | 'limit' | 'pad' | 'crop';

  @ApiPropertyOptional({
    description: 'Image quality',
    example: 'auto',
  })
  @IsOptional()
  quality?: 'auto' | number;

  @ApiPropertyOptional({
    description: 'Gravity for cropping',
    example: 'face',
    enum: ['face', 'faces', 'center', 'auto'],
  })
  @IsOptional()
  @IsEnum(['face', 'faces', 'center', 'auto'])
  gravity?: 'face' | 'faces' | 'center' | 'auto';
}
