import { Injectable } from '@nestjs/common';
import {
  PaginationOptions,
  PaginationMeta,
  PaginatedResult,
} from '../interfaces/pagination.interface';

@Injectable()
export class PaginationService {
  private detectPrimaryTableAlias(baseQuery: string): string | null {
    const match = baseQuery.match(
      /\bFROM\s+[^\s]+\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/i,
    );
    const candidate = match?.[1] ?? null;
    if (!candidate) return null;

    const keyword = candidate.toUpperCase();
    const reserved = new Set([
      'WHERE',
      'JOIN',
      'INNER',
      'LEFT',
      'RIGHT',
      'FULL',
      'CROSS',
      'OUTER',
      'ON',
      'GROUP',
      'ORDER',
      'LIMIT',
      'OFFSET',
      'HAVING',
      'UNION',
    ]);

    return reserved.has(keyword) ? null : candidate;
  }

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
    tableAlias?: string,
  ): string {
    const safeSortBy =
      sortBy && allowedSortFields.includes(sortBy) ? sortBy : 'created_at';

    const qualifiedSortBy =
      tableAlias && !safeSortBy.includes('.')
        ? `${tableAlias}.${safeSortBy}`
        : safeSortBy;

    return `ORDER BY ${qualifiedSortBy} ${sortOrder}`;
  }

  buildLimitOffsetClause(
    page: number,
    limit: number,
    paramStartIndex: number = 1,
  ): {
    clause: string;
    values: number[];
  } {
    const offset = this.calculateOffset(page, limit);
    return {
      clause: `LIMIT $${paramStartIndex} OFFSET $${paramStartIndex + 1}`,
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

    let whereClause = '';
    if (additionalWhereConditions) {
      const hasWhereClause = baseQuery.toUpperCase().includes('WHERE');
      whereClause = hasWhereClause
        ? `AND ${additionalWhereConditions}`
        : `WHERE ${additionalWhereConditions}`;
    }

    const primaryAlias = this.detectPrimaryTableAlias(baseQuery);
    const orderByClause = this.buildOrderByClause(
      sortBy,
      sortOrder,
      allowedSortFields,
      primaryAlias ?? undefined,
    );

    const baseParams = additionalParams || [];
    const paramStartIndex = baseParams.length + 1;

    const { clause: limitOffsetClause, values: limitOffsetValues } =
      this.buildLimitOffsetClause(page, limit, paramStartIndex);

    const countQuery = `SELECT COUNT(*) FROM (${baseQuery} ${whereClause}) as base_query`;

    const dataQuery = `
        ${baseQuery} 
        ${whereClause} 
        ${orderByClause} 
        ${limitOffsetClause}
        `.trim();

    return {
      countQuery,
      dataQuery,
      countParams: baseParams,
      dataParams: [...baseParams, ...limitOffsetValues],
    };
  }
}
