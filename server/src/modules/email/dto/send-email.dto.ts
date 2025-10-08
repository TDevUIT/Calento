import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'user@example.com',
  })
  @IsEmail()
  to: string;

  @ApiProperty({
    description: 'Email subject',
    example: 'Welcome to Tempra',
  })
  @IsString()
  subject: string;

  @ApiPropertyOptional({
    description: 'Email HTML content (if not using template)',
    example: '<h1>Welcome</h1>',
  })
  @IsOptional()
  @IsString()
  html?: string;

  @ApiPropertyOptional({
    description: 'Email text content',
    example: 'Welcome to Tempra',
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({
    description: 'Email template name',
    example: 'welcome',
  })
  @IsOptional()
  @IsString()
  template?: string;

  @ApiPropertyOptional({
    description: 'Template context data',
    example: { userName: 'John Doe' },
  })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'CC email addresses',
    example: ['cc@example.com'],
  })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  cc?: string[];

  @ApiPropertyOptional({
    description: 'BCC email addresses',
    example: ['bcc@example.com'],
  })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  bcc?: string[];
}

export class EmailLogResponseDto {
  @ApiProperty({ description: 'Email log ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  user_id: string;

  @ApiProperty({ description: 'Recipient email' })
  to: string;

  @ApiProperty({ description: 'Email subject' })
  subject: string;

  @ApiProperty({ description: 'Template name' })
  template?: string;

  @ApiProperty({
    description: 'Email status',
    enum: ['pending', 'sent', 'failed', 'queued'],
  })
  status: string;

  @ApiProperty({ description: 'Error message if failed' })
  error_message?: string;

  @ApiProperty({ description: 'Sent timestamp' })
  sent_at?: Date;

  @ApiProperty({ description: 'Created timestamp' })
  created_at: Date;
}
