import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export interface ApiResponseDecoratorOptions {
  status?: number;
  description?: string;
  type?: Type<any> | Function | [Function] | string;
  isArray?: boolean;
}

export function ApiSuccessResponse(options: ApiResponseDecoratorOptions = {}) {
  const { status = 200, description = 'Success', type, isArray = false } = options;

  const responseOptions: ApiResponseOptions = {
    status,
    description,
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        message: {
          type: 'string',
          example: 'Operation completed successfully',
        },
        data: type ? {
          ...(isArray ? { 
            type: 'array', 
            items: { $ref: `#/components/schemas/${typeof type === 'string' ? type : (type as any).name}` } 
          } : { 
            $ref: `#/components/schemas/${typeof type === 'string' ? type : (type as any).name}` 
          }),
        } : {
          type: 'object',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2023-12-01T10:00:00.000Z',
        },
        requestId: {
          type: 'string',
          example: 'uuid-string',
        },
        path: {
          type: 'string',
          example: '/api/users',
        },
      },
    },
  };

  return applyDecorators(ApiResponse(responseOptions));
}

export function ApiErrorResponse(status: number, description: string) {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: status,
          },
          message: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
            ],
            example: 'Error message',
          },
          error: {
            type: 'string',
            example: 'Bad Request',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2023-12-01T10:00:00.000Z',
          },
          path: {
            type: 'string',
            example: '/api/users',
          },
          requestId: {
            type: 'string',
            example: 'uuid-string',
          },
        },
      },
    }),
  );
}
