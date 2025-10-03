import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  description?: string,
) => {
  return applyDecorators(
    ApiOkResponse({
      description: description || `Paginated list of ${model.name}`,
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          meta: {
            type: 'object',
            properties: {
              page: {
                type: 'number',
                example: 1,
                description: 'Current page number',
              },
              limit: {
                type: 'number',
                example: 10,
                description: 'Number of items per page',
              },
              total: {
                type: 'number',
                example: 100,
                description: 'Total number of items',
              },
              totalPages: {
                type: 'number',
                example: 10,
                description: 'Total number of pages',
              },
              hasNextPage: {
                type: 'boolean',
                example: true,
                description: 'Whether there is a next page',
              },
              hasPreviousPage: {
                type: 'boolean',
                example: false,
                description: 'Whether there is a previous page',
              },
            },
          },
        },
      },
    }),
  );
};

export const ApiPaginationQuery = () => {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (1-based)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items per page (max 100)',
      example: 10,
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: 'Field to sort by',
      example: 'created_at',
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: ['ASC', 'DESC'],
      description: 'Sort order',
      example: 'DESC',
    }),
  );
};

export const ApiSearchPaginationQuery = () => {
  return applyDecorators(
    ApiPaginationQuery(),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Search term',
      example: 'john@example.com',
    }),
  );
};
