import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { MessageService } from '../message/message.service';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
  requestId: string;
  path: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private readonly messageService: MessageService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const requestId = request.headers['x-request-id'] as string;

        // Check if controller already returned a standard response format
        const isStandardResponse =
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'message' in data &&
          'data' in data;

        if (isStandardResponse) {
          // Controller already formatted response, just add metadata
          return {
            success: data.success,
            message: data.message,
            data: data.data, // Use only the data field, not the whole object
            timestamp: new Date().toISOString(),
            requestId,
            path: request.url,
          };
        }

        // Legacy check for old response format
        const isResponseDto =
          data &&
          typeof data === 'object' &&
          'status' in data &&
          'message' in data;

        if (isResponseDto) {
          return {
            success: true,
            message: data.message,
            data: data.data,
            timestamp: data.timestamp || new Date().toISOString(),
            requestId,
            path: request.url,
          };
        }

        // Default wrapping for raw data
        let message = this.messageService.get('success.retrieved');

        switch (request.method) {
          case 'POST':
            message = this.messageService.get('success.created');
            break;
          case 'PUT':
          case 'PATCH':
            message = this.messageService.get('success.updated');
            break;
          case 'DELETE':
            message = this.messageService.get('success.deleted');
            break;
          default:
            message = this.messageService.get('success.retrieved');
        }

        return {
          success: true,
          message,
          data,
          timestamp: new Date().toISOString(),
          requestId,
          path: request.url,
        };
      }),
    );
  }
}
