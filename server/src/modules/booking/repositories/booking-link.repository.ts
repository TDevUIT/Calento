import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { PaginationService } from '../../../common/services/pagination.service';
import { MessageService } from '../../../common/message/message.service';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { BookingLink } from '../interfaces/booking.interface';
import {
  BookingLinkNotFoundException,
  BookingSlugExistsException,
} from '../exceptions/booking.exceptions';

@Injectable()
export class BookingLinkRepository extends BaseRepository<BookingLink> {
  protected readonly logger = new Logger(BookingLinkRepository.name);

  constructor(
    protected readonly databaseService: DatabaseService,
    protected readonly paginationService: PaginationService,
    protected readonly messageService: MessageService,
  ) {
    super(databaseService, paginationService, messageService, 'booking_links');
  }

  protected getAllowedSortFields(): string[] {
    return ['title', 'slug', 'created_at', 'updated_at', 'is_active'];
  }

  async findByUserId(userId: string): Promise<BookingLink[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await this.databaseService.query(query, [userId]);
    return result.rows;
  }

  async findActiveByUserId(userId: string): Promise<BookingLink[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1 AND is_active = true
      ORDER BY created_at DESC
    `;

    const result = await this.databaseService.query(query, [userId]);
    return result.rows;
  }

  async findBySlug(slug: string): Promise<BookingLink | null> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE slug = $1
    `;

    const result = await this.databaseService.query(query, [slug]);
    return result.rows[0] || null;
  }

  async checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
    const query = excludeId
      ? `SELECT COUNT(*) as count FROM ${this.tableName} WHERE slug = $1 AND id != $2`
      : `SELECT COUNT(*) as count FROM ${this.tableName} WHERE slug = $1`;

    const params = excludeId ? [slug, excludeId] : [slug];
    const result = await this.databaseService.query(query, params);
    return parseInt(result.rows[0].count) > 0;
  }

  async create(data: Partial<BookingLink>): Promise<BookingLink> {
    const slugExists = await this.checkSlugExists(data.slug!);
    if (slugExists) {
      const message = this.messageService.get(
        'booking.slug_exists',
        undefined,
        {
          slug: data.slug,
        },
      );
      throw new BookingSlugExistsException(message);
    }

    const fields = [
      'user_id',
      'slug',
      'title',
      'duration_minutes',
      'buffer_time_minutes',
      'advance_notice_hours',
      'booking_window_days',
      'timezone',
    ];
    const optionalFields = [
      'description',
      'max_bookings_per_day',
      'color',
      'is_active',
    ];

    const columns: string[] = [...fields];
    const values: any[] = [
      data.user_id,
      data.slug,
      data.title,
      data.duration_minutes,
      data.buffer_time_minutes ?? 0,
      data.advance_notice_hours ?? 24,
      data.booking_window_days ?? 60,
      data.timezone ?? 'UTC',
    ];

    optionalFields.forEach((field) => {
      if (data[field] !== undefined) {
        columns.push(field);
        values.push(data[field]);
      }
    });

    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      INSERT INTO ${this.tableName} (${columns.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.databaseService.query(query, values);
    this.logger.log(`Created booking link: ${data.slug}`);
    return result.rows[0];
  }

  async update(id: string, data: Partial<BookingLink>): Promise<BookingLink> {
    if (data.slug) {
      const slugExists = await this.checkSlugExists(data.slug, id);
      if (slugExists) {
        const message = this.messageService.get(
          'booking.slug_exists',
          undefined,
          {
            slug: data.slug,
          },
        );
        throw new BookingSlugExistsException(message);
      }
    }

    const allowedFields = [
      'slug',
      'title',
      'description',
      'duration_minutes',
      'buffer_time_minutes',
      'max_bookings_per_day',
      'advance_notice_hours',
      'booking_window_days',
      'color',
      'timezone',
      'is_active',
    ];
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);
        values.push(data[field]);
        paramIndex++;
      }
    });

    if (updates.length === 0) {
      const existing = await this.findById(id);
      if (!existing) {
        const message = this.messageService.get(
          'booking.link_not_found',
          undefined,
          { id },
        );
        throw new BookingLinkNotFoundException(message);
      }
      return existing;
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE ${this.tableName}
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await this.databaseService.query(query, values);

    if (result.rows.length === 0) {
      const message = this.messageService.get(
        'booking.link_not_found',
        undefined,
        { id },
      );
      throw new BookingLinkNotFoundException(message);
    }

    this.logger.log(`Updated booking link: ${id}`);
    return result.rows[0];
  }

  async deleteByUserId(userId: string): Promise<number> {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE user_id = $1
    `;

    const result = await this.databaseService.query(query, [userId]);
    this.logger.log(
      `Deleted ${result.rowCount} booking links for user ${userId}`,
    );
    return result.rowCount || 0;
  }

  async countByUserId(userId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM ${this.tableName}
      WHERE user_id = $1
    `;

    const result = await this.databaseService.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }
}
