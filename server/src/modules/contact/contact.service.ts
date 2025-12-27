import { Injectable, Logger } from '@nestjs/common';
import { ContactRepository } from './contact.repository';
import { CreateContactDto, ContactResponseDto } from './dto/contact.dto';
import { Contact } from './contact.interface';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly contactRepository: ContactRepository) {}

  async createContact(dto: CreateContactDto): Promise<ContactResponseDto> {
    this.logger.log(`Creating new contact: ${dto.email}`);

    const contact = await this.contactRepository.create(dto);

    return this.mapToResponseDto(contact);
  }

  async getAllContacts(
    limit: number = 50,
    offset: number = 0,
  ): Promise<ContactResponseDto[]> {
    const contacts = await this.contactRepository.findAll(limit, offset);
    return contacts.map((contact) => this.mapToResponseDto(contact));
  }

  async getContactById(id: string): Promise<ContactResponseDto | null> {
    const contact = await this.contactRepository.findById(id);
    return contact ? this.mapToResponseDto(contact) : null;
  }

  private mapToResponseDto(contact: Contact): ContactResponseDto {
    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone_number: contact.phone_number,
      country: contact.country,
      inquiry_type: contact.inquiry_type,
      message: contact.message,
      subscribe_offers: contact.subscribe_offers,
      status: contact.status,
      created_at: contact.created_at,
    };
  }
}
