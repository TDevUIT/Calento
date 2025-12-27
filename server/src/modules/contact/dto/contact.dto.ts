import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { InquiryType } from '../contact.interface';

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  first_name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  last_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsEnum(InquiryType)
  inquiry_type: InquiryType;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  message: string;

  @IsBoolean()
  subscribe_offers: boolean;
}

export class ContactResponseDto {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  country?: string;
  inquiry_type: string;
  message: string;
  subscribe_offers: boolean;
  status: string;
  created_at: Date;
}
