import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class UpdateUserSettingsDto {
  @ApiProperty({
    description: 'Partial user settings to update',
    example: { timezone: 'Asia/Ho_Chi_Minh', theme: 'dark' },
  })
  @IsObject()
  settings: Record<string, any>;
}
