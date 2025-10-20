import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Contact, ContactStatus } from './contact.interface';
import { CreateContactDto } from './dto/contact.dto';

@Injectable()
export class ContactRepository {
  private readonly logger = new Logger(ContactRepository.name);

  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateContactDto): Promise<Contact> {
    const query = `
      INSERT INTO contacts (
        first_name, last_name, email, phone_number, 
        country, inquiry_type, message, subscribe_offers, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      dto.first_name,
      dto.last_name,
      dto.email,
      dto.phone_number || null,
      dto.country || null,
      dto.inquiry_type,
      dto.message,
      dto.subscribe_offers,
      ContactStatus.NEW
    ];

    try {
      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      this.logger.error('Failed to create contact', error);
      throw error;
    }
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<Contact[]> {
    const query = `
      SELECT * FROM contacts
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await this.db.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      this.logger.error('Failed to fetch contacts', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Contact | null> {
    const query = 'SELECT * FROM contacts WHERE id = $1';
    
    try {
      const result = await this.db.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      this.logger.error(`Failed to find contact ${id}`, error);
      throw error;
    }
  }

  async updateStatus(id: string, status: ContactStatus): Promise<Contact> {
    const query = `
      UPDATE contacts 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    try {
      const result = await this.db.query(query, [status, id]);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Failed to update contact status ${id}`, error);
      throw error;
    }
  }
}
