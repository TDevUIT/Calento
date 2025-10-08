import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class BaseResponseDto<T = any> {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  status: HttpStatus;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Response data',
  })
  data?: T;

  @ApiPropertyOptional({
    description: 'Error messages',
    type: [String],
  })
  errors?: string[];

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-15T10:00:00Z',
  })
  timestamp: Date;

  constructor(
    status: HttpStatus,
    message: string,
    data?: T,
    errors?: string[],
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date();
  }
}

export class SuccessResponseDto<T = any> extends BaseResponseDto<T> {
  constructor(message: string, data: T, status: HttpStatus = HttpStatus.OK) {
    super(status, message, data);
  }
}

export class ErrorResponseDto extends BaseResponseDto {
  constructor(
    message: string,
    errors: string[],
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(status, message, null, errors);
  }
}

export class PaginatedResponseDto<T = any> extends BaseResponseDto {
  @ApiProperty({
    description: 'Paginated data with metadata',
  })
  data: {
    items: T[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };

  constructor(message: string, items: T[], meta: any) {
    super(HttpStatus.OK, message);
    this.data = { items, meta };
  }
}
