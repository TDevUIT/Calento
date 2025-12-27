import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { PaginationService } from '../services/pagination.service';
import { MessageService } from '../message/message.service';
import {
  BaseEntity,
  UserOwnedEntity,
} from '../interfaces/base-entity.interface';
import {
  PaginatedResult,
  PaginationOptions,
  SearchOptions,
} from '../interfaces/pagination.interface';
import { RepositoryOptions } from '../interfaces/database.interface';

@Injectable()
export abstract class BaseRepository<T extends BaseEntity> {
  protected readonly logger: Logger;

  constructor(
    protected readonly databaseService: DatabaseService,
    protected readonly paginationService: PaginationService,
    protected readonly messageService: MessageService,
    protected readonly tableName: string,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  protected abstract getAllowedSortFields(): string[];

  protected buildSelectQuery(includeDeleted = false): string {
    let query = `SELECT * FROM ${this.tableName}`;
    if (!includeDeleted && this.isSoftDeletable()) {
      query += ` WHERE deleted_at IS NULL`;
    }
    return query;
  }

  protected isSoftDeletable(): boolean {
    return false;
  }

  async findById(id: string, options?: RepositoryOptions): Promise<T | null> {
    const baseQuery = this.buildSelectQuery(options?.includeDeleted);
    const hasWhereClause = baseQuery.toUpperCase().includes('WHERE');
    const connector = hasWhereClause ? 'AND' : 'WHERE';
    const query = `${baseQuery} ${connector} id = $1`;

    try {
      const result = await this.databaseService.query<T>(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      this.logger.error(`Failed to find ${this.tableName} by ID ${id}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  async findAll(
    paginationOptions: Partial<PaginationOptions>,
    options?: RepositoryOptions,
  ): Promise<PaginatedResult<T>> {
    const validatedOptions =
      this.paginationService.validatePaginationOptions(paginationOptions);
    const { page, limit } = validatedOptions;

    const baseQuery = this.buildSelectQuery(options?.includeDeleted);
    const allowedSortFields = this.getAllowedSortFields();

    const { countQuery, dataQuery, countParams, dataParams } =
      this.paginationService.buildPaginatedQuery(
        baseQuery,
        validatedOptions,
        allowedSortFields,
      );

    try {
      const [countResult, dataResult] = await Promise.all([
        this.databaseService.query(countQuery, countParams),
        this.databaseService.query<T>(dataQuery, dataParams),
      ]);

      const total = parseInt(countResult.rows[0].count);
      const items = dataResult.rows;

      return this.paginationService.createPaginatedResult(
        items,
        page,
        limit,
        total,
      );
    } catch (error) {
      this.logger.error(`Failed to find all ${this.tableName}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  async create(data: Partial<T>, options?: RepositoryOptions): Promise<T> {
    const fields = Object.keys(data).filter((key) => data[key] !== undefined);
    const values = fields.map((field) => data[field]);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
            INSERT INTO ${this.tableName} (${fields.join(', ')}) 
            VALUES (${placeholders}) 
            RETURNING *
        `;

    try {
      const result = await this.databaseService.query<T>(query, values);
      this.logger.log(
        `Created new ${this.tableName} with ID: ${result.rows[0].id}`,
      );
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Failed to create ${this.tableName}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  async update(
    id: string,
    data: Partial<T>,
    options?: RepositoryOptions,
  ): Promise<T | null> {
    const fields = Object.keys(data).filter(
      (key) => data[key] !== undefined && key !== 'id',
    );
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const values = fields.map((field) => data[field]);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');

    let query = `UPDATE ${this.tableName} SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1}`;

    if (this.isSoftDeletable() && !options?.includeDeleted) {
      query += ' AND deleted_at IS NULL';
    }

    query += ' RETURNING *';

    try {
      const result = await this.databaseService.query<T>(query, [
        ...values,
        id,
      ]);
      if (result.rows.length === 0) {
        return null;
      }
      this.logger.log(`Updated ${this.tableName} with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(
        `Failed to update ${this.tableName} with ID ${id}:`,
        error,
      );
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  async delete(id: string, options?: RepositoryOptions): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;

    try {
      const result = await this.databaseService.query(query, [id]);
      const deleted = (result.rowCount ?? 0) > 0;
      if (deleted) {
        this.logger.log(`Deleted ${this.tableName} with ID: ${id}`);
      }
      return deleted;
    } catch (error) {
      this.logger.error(
        `Failed to delete ${this.tableName} with ID ${id}:`,
        error,
      );
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  async softDelete(id: string, options?: RepositoryOptions): Promise<boolean> {
    if (!this.isSoftDeletable()) {
      throw new Error(`Soft delete not supported for ${this.tableName}`);
    }

    const query = `
            UPDATE ${this.tableName} 
            SET deleted_at = NOW(), is_deleted = true, updated_at = NOW() 
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING id
        `;

    try {
      const result = await this.databaseService.query(query, [id]);
      const deleted = (result.rowCount ?? 0) > 0;
      if (deleted) {
        this.logger.log(`Soft deleted ${this.tableName} with ID: ${id}`);
      }
      return deleted;
    } catch (error) {
      this.logger.error(
        `Failed to soft delete ${this.tableName} with ID ${id}:`,
        error,
      );
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  async restore(id: string, options?: RepositoryOptions): Promise<boolean> {
    if (!this.isSoftDeletable()) {
      throw new Error(`Restore not supported for ${this.tableName}`);
    }

    const query = `
            UPDATE ${this.tableName} 
            SET deleted_at = NULL, is_deleted = false, updated_at = NOW() 
            WHERE id = $1 AND deleted_at IS NOT NULL
            RETURNING id
        `;

    try {
      const result = await this.databaseService.query(query, [id]);
      const restored = (result.rowCount ?? 0) > 0;
      if (restored) {
        this.logger.log(`Restored ${this.tableName} with ID: ${id}`);
      }
      return restored;
    } catch (error) {
      this.logger.error(
        `Failed to restore ${this.tableName} with ID ${id}:`,
        error,
      );
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  async exists(id: string, options?: RepositoryOptions): Promise<boolean> {
    let query = `SELECT 1 FROM ${this.tableName} WHERE id = $1`;

    if (this.isSoftDeletable() && !options?.includeDeleted) {
      query += ' AND deleted_at IS NULL';
    }

    query += ' LIMIT 1';

    try {
      const result = await this.databaseService.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      this.logger.error(
        `Failed to check existence of ${this.tableName} with ID ${id}:`,
        error,
      );
      return false;
    }
  }

  async count(options?: RepositoryOptions): Promise<number> {
    let query = `SELECT COUNT(*) as count FROM ${this.tableName}`;

    if (this.isSoftDeletable() && !options?.includeDeleted) {
      query += ' WHERE deleted_at IS NULL';
    }

    try {
      const result = await this.databaseService.query(query);
      return parseInt(result.rows[0].count);
    } catch (error) {
      this.logger.error(`Failed to count ${this.tableName}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  async search(
    whereCondition: string,
    whereParams: any[],
    paginationOptions: Partial<PaginationOptions>,
    options?: RepositoryOptions,
  ): Promise<PaginatedResult<T>> {
    const validatedOptions =
      this.paginationService.validatePaginationOptions(paginationOptions);
    const { page, limit } = validatedOptions;

    const baseQuery = this.buildSelectQuery(options?.includeDeleted);
    const allowedSortFields = this.getAllowedSortFields();

    const { countQuery, dataQuery, countParams, dataParams } =
      this.paginationService.buildPaginatedQuery(
        baseQuery,
        validatedOptions,
        allowedSortFields,
        whereCondition,
        whereParams,
      );

    try {
      const [countResult, dataResult] = await Promise.all([
        this.databaseService.query(countQuery, countParams),
        this.databaseService.query<T>(dataQuery, dataParams),
      ]);

      const total = parseInt(countResult.rows[0].count);
      const items = dataResult.rows;

      return this.paginationService.createPaginatedResult(
        items,
        page,
        limit,
        total,
      );
    } catch (error) {
      this.logger.error(`Failed to search ${this.tableName}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }
}

@Injectable()
export abstract class UserOwnedRepository<
  T extends UserOwnedEntity,
> extends BaseRepository<T> {
  async findByUserId(
    userId: string,
    paginationOptions: Partial<PaginationOptions> | Partial<SearchOptions>,
    options?: RepositoryOptions,
  ): Promise<PaginatedResult<T>> {
    const validatedOptions =
      this.paginationService.validatePaginationOptions(paginationOptions);
    const { page, limit } = validatedOptions;

    const baseQuery = this.buildSelectQuery(options?.includeDeleted);
    let whereCondition = 'user_id = $1';
    const whereParams: any[] = [userId];

    // Handle search if provided
    const searchOptions = paginationOptions as Partial<SearchOptions>;
    if (
      searchOptions.search &&
      searchOptions.searchFields &&
      searchOptions.searchFields.length > 0
    ) {
      const searchConditions = searchOptions.searchFields.map(
        (field, index) => `${field} ILIKE $${index + 2}`,
      );
      whereCondition += ` AND (${searchConditions.join(' OR ')})`;

      // Add search parameter for each field
      searchOptions.searchFields.forEach(() => {
        whereParams.push(`%${searchOptions.search}%`);
      });
    }

    const allowedSortFields = this.getAllowedSortFields();

    const { countQuery, dataQuery, countParams, dataParams } =
      this.paginationService.buildPaginatedQuery(
        baseQuery,
        validatedOptions,
        allowedSortFields,
        whereCondition,
        whereParams,
      );

    try {
      const [countResult, dataResult] = await Promise.all([
        this.databaseService.query(countQuery, countParams),
        this.databaseService.query<T>(dataQuery, dataParams),
      ]);

      const total = parseInt(countResult.rows[0].count);
      const items = dataResult.rows;

      return this.paginationService.createPaginatedResult(
        items,
        page,
        limit,
        total,
      );
    } catch (error) {
      this.logger.error(
        `Failed to find ${this.tableName} by user ID ${userId}:`,
        error,
      );
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  async deleteByUserId(
    userId: string,
    options?: RepositoryOptions,
  ): Promise<number> {
    const query = `DELETE FROM ${this.tableName} WHERE user_id = $1`;

    try {
      const result = await this.databaseService.query(query, [userId]);
      const deletedCount = result.rowCount ?? 0;
      this.logger.log(
        `Deleted ${deletedCount} ${this.tableName} records for user ${userId}`,
      );
      return deletedCount;
    } catch (error) {
      this.logger.error(
        `Failed to delete ${this.tableName} for user ${userId}:`,
        error,
      );
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }
}
