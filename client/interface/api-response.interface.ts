export interface ServerSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: {
    status: number;
    message: string;
    data: T;
    timestamp: string;
  };
  timestamp: string;
  requestId: string;
  path: string;
}

export interface ServerErrorResponse {
  status: number;
  message: string;
  errors: string[];
  timestamp: string;
  data: null;
}

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
