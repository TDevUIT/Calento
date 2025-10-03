export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

export interface SuccessResponse<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse extends ApiResponse<null> {
  success: false;
  data: null;
  error?: {
    code: string;
    details?: Record<string, unknown>;
  };
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp?: string;
  path?: string;
}

export interface ValidationError extends ApiError {
  code: 'VALIDATION_ERROR';
  fields: Record<string, string[]>;
}

export interface NetworkError extends ApiError {
  code: 'NETWORK_ERROR';
  isTimeout: boolean;
  isRetryable: boolean;
}

export interface ServerError extends ApiError {
  code: 'SERVER_ERROR';
  statusCode: number;
  isRetryable: boolean;
}
