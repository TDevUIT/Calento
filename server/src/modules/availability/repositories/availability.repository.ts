import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { PaginationService } from '../../../common/services/pagination.service';
import { MessageService } from '../../../common/message/message.service';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Availability, DayOfWeek } from '../interfaces/availability.interface';
import {
  AvailabilityNotFoundException,
  AvailabilityCreationFailedException,
} from '../exceptions/availability.exceptions';

@Injectable()
export class AvailabilityRepository extends BaseRepository<Availability> {
  protected readonly logger = new Logger(AvailabilityRepository.name);

  constructor(
    protected readonly databaseService: DatabaseService,
    protected readonly paginationService: PaginationService,
    protected readonly messageService: MessageService,
  ) {
    super(databaseService, paginationService, messageService, 'availabilities');
  }

  protected getAllowedSortFields(): string[] {
    return [
      'day_of_week',
      'start_time',
      'end_time',
      'created_at',
      'updated_at',
    ];
  }

  async findByUserId(userId: string): Promise<Availability[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1
      ORDER BY day_of_week ASC, start_time ASC
    `;

    const result = await this.databaseService.query(query, [userId]);
    return result.rows;
  }

  async findActiveByUserId(userId: string): Promise<Availability[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1 
        AND (is_active IS NULL OR is_active = true)
      ORDER BY day_of_week ASC, start_time ASC
    `;

    const result = await this.databaseService.query(query, [userId]);
    return result.rows;
  }

  async findByUserIdAndDay(
    userId: string,
    dayOfWeek: DayOfWeek,
  ): Promise<Availability[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1 AND day_of_week = $2
        AND (is_active IS NULL OR is_active = true)
      ORDER BY start_time ASC
    `;

    const result = await this.databaseService.query(query, [userId, dayOfWeek]);
    return result.rows;
  }

  async create(data: Partial<Availability>): Promise<Availability> {
    const fields = ['user_id', 'day_of_week', 'start_time', 'end_time'];
    const optionalFields = ['timezone', 'is_active'];

    const columns: string[] = [...fields];
    const values: any[] = [
      data.user_id,
      data.day_of_week,
      data.start_time,
      data.end_time,
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

    try {
      const result = await this.databaseService.query(query, values);

      if (result.rows.length === 0) {
        throw new AvailabilityCreationFailedException(
          'No rows returned after insert',
        );
      }

      this.logger.log(`Created availability rule for user ${data.user_id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(
        `Failed to create availability: ${error.message}`,
        error.stack,
      );
      throw new AvailabilityCreationFailedException(error.message);
    }
  }

  async update(id: string, data: Partial<Availability>): Promise<Availability> {
    const allowedFields = [
      'day_of_week',
      'start_time',
      'end_time',
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
        throw new AvailabilityNotFoundException(id);
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
      throw new AvailabilityNotFoundException(id);
    }

    this.logger.log(`Updated availability rule ${id}`);
    return result.rows[0];
  }

  async deleteByUserId(userId: string): Promise<number> {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE user_id = $1
    `;

    const result = await this.databaseService.query(query, [userId]);
    this.logger.log(
      `Deleted ${result.rowCount} availability rules for user ${userId}`,
    );
    return result.rowCount || 0;
  }

  async checkOverlap(
    userId: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    excludeId?: string,
  ): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM ${this.tableName}
      WHERE user_id = $1 
        AND day_of_week = $2
        AND (is_active IS NULL OR is_active = true)
        AND (
          (start_time < $4 AND end_time > $3)
        )
        ${excludeId ? 'AND id != $5' : ''}
    `;

    const params = excludeId
      ? [userId, dayOfWeek, startTime, endTime, excludeId]
      : [userId, dayOfWeek, startTime, endTime];

    const result = await this.databaseService.query(query, params);
    return parseInt(result.rows[0].count) > 0;
  }

  async bulkCreate(
    availabilities: Partial<Availability>[],
  ): Promise<Availability[]> {
    if (availabilities.length === 0) {
      return [];
    }

    const values: any[] = [];
    const valuesClauses: string[] = [];

    availabilities.forEach((availability, index) => {
      const baseIndex = index * 6;
      valuesClauses.push(
        `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6})`,
      );
      values.push(
        availability.user_id,
        availability.day_of_week,
        availability.start_time,
        availability.end_time,
        availability.timezone || null,
        availability.is_active !== undefined ? availability.is_active : true,
      );
    });

    const query = `
      INSERT INTO ${this.tableName} 
        (user_id, day_of_week, start_time, end_time, timezone, is_active)
      VALUES ${valuesClauses.join(', ')}
      RETURNING *
    `;

    try {
      const result = await this.databaseService.query(query, values);
      this.logger.log(`Bulk created ${result.rows.length} availability rules`);
      return result.rows;
    } catch (error) {
      this.logger.error(
        `Failed to bulk create availabilities: ${error.message}`,
        error.stack,
      );
      throw new AvailabilityCreationFailedException(error.message);
    }
  }

  async countByUserId(userId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM ${this.tableName}
      WHERE user_id = $1
        AND (is_active IS NULL OR is_active = true)
    `;

    const result = await this.databaseService.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }
}
