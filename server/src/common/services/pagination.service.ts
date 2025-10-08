import { Injectable } from '@nestjs/common';
import {
  PaginationOptions,
  PaginationMeta,
  PaginatedResult,
} from '../interfaces/pagination.interface';

@Injectable()
export class PaginationService {
  createPaginationMeta(
    page: number,
    limit: number,
    total: number,
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  createPaginatedResult<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
  ): PaginatedResult<T> {
    return {
      data,
      meta: this.createPaginationMeta(page, limit, total),
    };
  }

  calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  buildOrderByClause(
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    allowedSortFields: string[] = ['created_at', 'updated_at', 'id'],
  ): string {
    // Validate sort field to prevent SQL injection
    const safeSortBy =
      sortBy && allowedSortFields.includes(sortBy) ? sortBy : 'created_at';

    return `ORDER BY ${safeSortBy} ${sortOrder}`;
  }

  buildLimitOffsetClause(
    page: number,
    limit: number,
  ): {
    clause: string;
    values: number[];
  } {
    const offset = this.calculateOffset(page, limit);
    return {
      clause: 'LIMIT $1 OFFSET $2',
      values: [limit, offset],
    };
  }

  buildSearchWhereClause(
    search?: string,
    searchFields: string[] = ['name', 'email'],
    paramStartIndex: number = 1,
  ): {
    clause: string;
    values: string[];
    nextParamIndex: number;
  } {
    if (!search || !searchFields.length) {
      return {
        clause: '',
        values: [],
        nextParamIndex: paramStartIndex,
      };
    }

    const searchPattern = `%${search}%`;
    const conditions = searchFields.map(
      (field, index) => `${field} ILIKE $${paramStartIndex + index}`,
    );

    return {
      clause: `(${conditions.join(' OR ')})`,
      values: searchFields.map(() => searchPattern),
      nextParamIndex: paramStartIndex + searchFields.length,
    };
  }

  validatePaginationOptions(
    options: Partial<PaginationOptions>,
  ): PaginationOptions {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 10));

    return {
      page,
      limit,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder || 'DESC',
    };
  }

  buildPaginatedQuery(
    baseQuery: string,
    options: PaginationOptions,
    allowedSortFields?: string[],
    additionalWhereConditions?: string,
    additionalParams?: any[],
  ): {
    countQuery: string;
    dataQuery: string;
    countParams: any[];
    dataParams: any[];
  } {
    const { page, limit, sortBy, sortOrder } =
      this.validatePaginationOptions(options);

    // Build WHERE clause
    const whereClause = additionalWhereConditions
      ? `WHERE ${additionalWhereConditions}`
      : '';

    // Build ORDER BY clause
    const orderByClause = this.buildOrderByClause(
      sortBy,
      sortOrder,
      allowedSortFields,
    );

    // Build LIMIT OFFSET clause
    const { clause: limitOffsetClause, values: limitOffsetValues } =
      this.buildLimitOffsetClause(page, limit);

    // Count query
    const countQuery = `SELECT COUNT(*) FROM (${baseQuery}) as base_query ${whereClause}`;

    // Data query
    const dataQuery = `
        ${baseQuery} 
        ${whereClause} 
        ${orderByClause} 
        ${limitOffsetClause}
        `.trim();

    const baseParams = additionalParams || [];

    return {
      countQuery,
      dataQuery,
      countParams: baseParams,
      dataParams: [...baseParams, ...limitOffsetValues],
    };
  }
}
