import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { PaginationService } from '../../../common/services/pagination.service';
import { MessageService } from '../../../common/message/message.service';
import { BaseRepository } from '../../../common/repositories/base.repository';
import {
  PaginatedResult,
  PaginationOptions,
} from '../../../common/interfaces/pagination.interface';
import { BookingLink } from '../interfaces/booking.interface';
import {
  BookingLinkNotFoundException,
  BookingSlugExistsException,
} from '../exceptions/booking.exceptions';

@Injectable()
export class BookingLinkRepository extends BaseRepository<BookingLink> {
  protected readonly logger = new Logger(BookingLinkRepository.name);

  private static readonly columnExistsCache = new Map<string, boolean>();

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

  private async columnExists(columnName: string): Promise<boolean> {
    const cacheKey = `${this.tableName}:${columnName}`;
    const cached = BookingLinkRepository.columnExistsCache.get(cacheKey);
    if (cached !== undefined) return cached;

    try {
      const query = `
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
          AND column_name = $2
        LIMIT 1
      `;
      const result = await this.databaseService.query(query, [
        this.tableName,
        columnName,
      ]);
      const exists = (result.rows?.length || 0) > 0;
      BookingLinkRepository.columnExistsCache.set(cacheKey, exists);
      return exists;
    } catch (error) {
      this.logger.warn(
        `Failed to check column existence for ${this.tableName}.${columnName}: ${error?.message || error}`,
      );
      BookingLinkRepository.columnExistsCache.set(cacheKey, false);
      return false;
    }
  }

  private async filterExistingColumns(columns: string[]): Promise<string[]> {
    const checks = await Promise.all(
      columns.map(async (c) => ({ c, ok: await this.columnExists(c) })),
    );
    return checks.filter((x) => x.ok).map((x) => x.c);
  }

  async findByUserId(userId: string): Promise<BookingLink[]> {
    const query = `
      SELECT 
        bl.*,
        COUNT(b.id) as bookings_count
      FROM ${this.tableName} bl
      LEFT JOIN bookings b ON bl.id = b.booking_link_id AND b.status != 'cancelled'
      WHERE bl.user_id = $1
      AND NOT EXISTS (
        SELECT 1 FROM user_priorities up
        WHERE up.user_id = $1
        AND up.item_id = bl.id::text
        AND up.item_type = 'booking_link'
        AND up.priority = 'disabled'
      )
      GROUP BY bl.id
      ORDER BY bl.created_at DESC
    `;

    const result = await this.databaseService.query(query, [userId]);
    return result.rows.map((row) => ({
      ...row,
      bookings_count: parseInt(row.bookings_count) || 0,
    }));
  }

  async findActiveByUserId(userId: string): Promise<BookingLink[]> {
    const query = `
      SELECT 
        bl.*,
        COUNT(b.id) as bookings_count
      FROM ${this.tableName} bl
      LEFT JOIN bookings b ON bl.id = b.booking_link_id AND b.status != 'cancelled'
      WHERE bl.user_id = $1 AND bl.is_active = true
      AND NOT EXISTS (
        SELECT 1 FROM user_priorities up
        WHERE up.user_id = $1
        AND up.item_id = bl.id::text
        AND up.item_type = 'booking_link'
        AND up.priority = 'disabled'
      )
      GROUP BY bl.id
      ORDER BY bl.created_at DESC
    `;

    const result = await this.databaseService.query(query, [userId]);
    return result.rows.map((row) => ({
      ...row,
      bookings_count: parseInt(row.bookings_count) || 0,
    }));
  }

  async findBySlug(slug: string): Promise<BookingLink | null> {
    const query = `
      SELECT 
        bl.*,
        jsonb_build_object(
          'id', u.id,
          'username', u.username,
          'email', u.email,
          'avatar', u.avatar,
          'full_name', TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')))
        ) as user
      FROM ${this.tableName} bl
      LEFT JOIN users u ON bl.user_id = u.id
      WHERE bl.slug = $1
    `;

    const result = await this.databaseService.query(query, [slug]);
    return result.rows[0] || null;
  }

  async getAllBookingLinksAdmin(
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<BookingLink>> {
    return this.findAll(paginationOptions);
  }

  async searchBookingLinksAdmin(
    searchTerm: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<BookingLink>> {
    const searchPattern = `%${searchTerm}%`;
    const whereCondition = '(title ILIKE $1 OR slug ILIKE $1)';
    const whereParams = [searchPattern];

    return this.search(whereCondition, whereParams, paginationOptions);
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
    const optionalFields = await this.filterExistingColumns([
      'description',
      'location',
      'location_link',
      'max_bookings_per_day',
      'color',
      'is_active',
    ]);

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

    const allowedFields = await this.filterExistingColumns([
      'slug',
      'title',
      'description',
      'location',
      'location_link',
      'duration_minutes',
      'buffer_time_minutes',
      'max_bookings_per_day',
      'advance_notice_hours',
      'booking_window_days',
      'color',
      'timezone',
      'is_active',
    ]);
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
