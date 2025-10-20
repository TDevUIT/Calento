import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { PaginationService } from '../../../common/services/pagination.service';
import { MessageService } from '../../../common/message/message.service';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Booking, BookingStatus } from '../interfaces/booking.interface';
import { BookingNotFoundException } from '../exceptions/booking.exceptions';

@Injectable()
export class BookingRepository extends BaseRepository<Booking> {
  protected readonly logger = new Logger(BookingRepository.name);

  constructor(
    protected readonly databaseService: DatabaseService,
    protected readonly paginationService: PaginationService,
    protected readonly messageService: MessageService,
  ) {
    super(databaseService, paginationService, messageService, 'bookings');
  }

  protected getAllowedSortFields(): string[] {
    return ['start_time', 'end_time', 'created_at', 'updated_at', 'status'];
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1
      ORDER BY start_time DESC
    `;

    const result = await this.databaseService.query(query, [userId]);
    return result.rows;
  }

  async findByBookingLinkId(bookingLinkId: string): Promise<Booking[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE booking_link_id = $1
      ORDER BY start_time DESC
    `;

    const result = await this.databaseService.query(query, [bookingLinkId]);
    return result.rows;
  }

  async findUpcomingByUserId(userId: string): Promise<Booking[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1 
        AND start_time > NOW()
        AND status = $2
      ORDER BY start_time ASC
    `;

    const result = await this.databaseService.query(query, [
      userId,
      BookingStatus.CONFIRMED,
    ]);
    return result.rows;
  }

  async findByDateRange(
    bookingLinkId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Booking[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE booking_link_id = $1
        AND start_time >= $2
        AND end_time <= $3
        AND status != $4
      ORDER BY start_time ASC
    `;

    const result = await this.databaseService.query(query, [
      bookingLinkId,
      startDate.toISOString(),
      endDate.toISOString(),
      BookingStatus.CANCELLED,
    ]);
    return result.rows;
  }

  async findByConfirmationToken(token: string): Promise<Booking | null> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE confirmation_token = $1
    `;

    const result = await this.databaseService.query(query, [token]);
    return result.rows[0] || null;
  }

  async countByDate(bookingLinkId: string, date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const query = `
      SELECT COUNT(*) as count
      FROM ${this.tableName}
      WHERE booking_link_id = $1
        AND start_time >= $2
        AND start_time <= $3
        AND status != $4
    `;

    const result = await this.databaseService.query(query, [
      bookingLinkId,
      startOfDay.toISOString(),
      endOfDay.toISOString(),
      BookingStatus.CANCELLED,
    ]);
    return parseInt(result.rows[0].count);
  }

  async create(data: Partial<Booking>): Promise<Booking> {
    const fields = [
      'booking_link_id',
      'user_id',
      'booker_name',
      'booker_email',
      'start_time',
      'end_time',
      'timezone',
      'status',
    ];
    const optionalFields = [
      'event_id',
      'booker_phone',
      'booker_notes',
      'confirmation_token',
    ];

    const columns: string[] = [...fields];
    const values: any[] = [
      data.booking_link_id,
      data.user_id,
      data.booker_name,
      data.booker_email,
      data.start_time,
      data.end_time,
      data.timezone,
      data.status ?? BookingStatus.CONFIRMED,
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
    this.logger.log(`Created booking for ${data.booker_email}`);
    return result.rows[0];
  }

  async updateStatus(
    id: string,
    status: BookingStatus,
    cancellationReason?: string,
  ): Promise<Booking> {
    const updates = ['status = $1', 'updated_at = NOW()'];
    const values: any[] = [status];
    let paramIndex = 2;

    if (status === BookingStatus.CANCELLED) {
      updates.push(`cancelled_at = NOW()`);
      if (cancellationReason) {
        updates.push(`cancellation_reason = $${paramIndex}`);
        values.push(cancellationReason);
        paramIndex++;
      }
    }

    values.push(id);

    const query = `
      UPDATE ${this.tableName}
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await this.databaseService.query(query, values);

    if (result.rows.length === 0) {
      const message = this.messageService.get('booking.not_found', undefined, {
        id,
      });
      throw new BookingNotFoundException(message);
    }

    this.logger.log(`Updated booking ${id} status to ${status}`);
    return result.rows[0];
  }

  async reschedule(
    id: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Booking> {
    const query = `
      UPDATE ${this.tableName}
      SET start_time = $1,
          end_time = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await this.databaseService.query(query, [
      startTime.toISOString(),
      endTime.toISOString(),
      id,
    ]);

    if (result.rows.length === 0) {
      const message = this.messageService.get('booking.not_found', undefined, {
        id,
      });
      throw new BookingNotFoundException(message);
    }

    this.logger.log(`Rescheduled booking ${id}`);
    return result.rows[0];
  }

  async deleteByUserId(userId: string): Promise<number> {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE user_id = $1
    `;

    const result = await this.databaseService.query(query, [userId]);
    this.logger.log(`Deleted ${result.rowCount} bookings for user ${userId}`);
    return result.rowCount || 0;
  }

  async countByUserId(userId: string, status?: BookingStatus): Promise<number> {
    const query = status
      ? `SELECT COUNT(*) as count FROM ${this.tableName} WHERE user_id = $1 AND status = $2`
      : `SELECT COUNT(*) as count FROM ${this.tableName} WHERE user_id = $1`;

    const params = status ? [userId, status] : [userId];
    const result = await this.databaseService.query(query, params);
    return parseInt(result.rows[0].count);
  }

  async getBookingStats(userId: string): Promise<{
    total_bookings: number;
    confirmed_bookings: number;
    cancelled_bookings: number;
    completed_bookings: number;
    this_week_bookings: number;
    this_month_bookings: number;
    upcoming_bookings: number;
  }> {
    const query = `
      SELECT
        COUNT(*) FILTER (WHERE TRUE) as total_bookings,
        COUNT(*) FILTER (WHERE status = $2) as confirmed_bookings,
        COUNT(*) FILTER (WHERE status = $3) as cancelled_bookings,
        COUNT(*) FILTER (WHERE status = $4) as completed_bookings,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as this_week_bookings,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as this_month_bookings,
        COUNT(*) FILTER (WHERE start_time > NOW() AND status = $2) as upcoming_bookings
      FROM ${this.tableName}
      WHERE user_id = $1
    `;

    const result = await this.databaseService.query(query, [
      userId,
      BookingStatus.CONFIRMED,
      BookingStatus.CANCELLED,
      BookingStatus.COMPLETED,
    ]);

    const row = result.rows[0];
    return {
      total_bookings: parseInt(row.total_bookings) || 0,
      confirmed_bookings: parseInt(row.confirmed_bookings) || 0,
      cancelled_bookings: parseInt(row.cancelled_bookings) || 0,
      completed_bookings: parseInt(row.completed_bookings) || 0,
      this_week_bookings: parseInt(row.this_week_bookings) || 0,
      this_month_bookings: parseInt(row.this_month_bookings) || 0,
      upcoming_bookings: parseInt(row.upcoming_bookings) || 0,
    };
  }
}
