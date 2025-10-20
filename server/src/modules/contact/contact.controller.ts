import { Controller, Post, Get, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto, ContactResponseDto } from './dto/contact.dto';
import { SuccessResponseDto } from '../../common/dto/base-response.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Submit contact form' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Contact form submitted successfully' })
  async createContact(@Body() dto: CreateContactDto): Promise<SuccessResponseDto<ContactResponseDto>> {
    const contact = await this.contactService.createContact(dto);
    
    return new SuccessResponseDto(
      'Contact form submitted successfully. We will get back to you within 24 hours.',
      contact,
      HttpStatus.CREATED
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contacts retrieved successfully' })
  async getAllContacts(): Promise<SuccessResponseDto<ContactResponseDto[]>> {
    const contacts = await this.contactService.getAllContacts();
    
    return new SuccessResponseDto(
      'Contacts retrieved successfully',
      contacts
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contact retrieved successfully' })
  async getContactById(@Param('id') id: string): Promise<SuccessResponseDto<ContactResponseDto | null>> {
    const contact = await this.contactService.getContactById(id);
    
    return new SuccessResponseDto(
      'Contact retrieved successfully',
      contact
    );
  }
}
