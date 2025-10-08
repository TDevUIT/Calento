import { HttpStatus } from '@nestjs/common';

export interface ApiResponse<T = any> {
  status: HttpStatus;
  message: string;
  data?: T;
  errors?: string[];
  timestamp?: Date;
}

export interface SuccessResponse<T = any> extends ApiResponse<T> {
  status: HttpStatus.OK | HttpStatus.CREATED | HttpStatus.NO_CONTENT;
  data: T;
}

export interface ErrorResponse extends ApiResponse {
  status: HttpStatus;
  errors: string[];
  data?: null;
}

export interface PaginatedApiResponse<T = any> extends ApiResponse {
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
}

export interface FileUploadResponse {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: Date;
}
