import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MessageService } from '../message/message.service';
import { ErrorResponse } from '../interfaces/api-response.interface';
import env from '../../config/env';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly messageService: MessageService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);

    this.logError(exception, request, errorResponse);

    response.status(errorResponse.status).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = this.messageService.get(
      'error.internal_server_error',
    );
    let error = 'Internal Server Error';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      error = exception.constructor.name.replace('Exception', '');

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || message;
        details = responseObj.details;

        if (responseObj.message && Array.isArray(responseObj.message)) {
          message = responseObj.message;
        }
      }
    } else if (exception instanceof Error) {
      message =
        env.NODE_ENV === 'production'
          ? this.messageService.get('error.internal_server_error')
          : exception.message;
      details = env.NODE_ENV !== 'production' ? exception.stack : undefined;
    }

    const errorResponse: ErrorResponse = {
      status,
      message: Array.isArray(message) ? message.join(', ') : message,
      errors: Array.isArray(message) ? message : [message],
      timestamp: new Date(),
      data: null,
    };

    return errorResponse;
  }

  private logError(
    exception: unknown,
    request: Request,
    errorResponse: ErrorResponse,
  ): void {
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const requestId = headers['x-request-id'] || 'unknown';

    const logMessage = `${method} ${url} - ${errorResponse.status} - ${ip} - ${userAgent} - RequestId: ${requestId}`;

    if (errorResponse.status >= 500) {
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : exception,
      );
    } else if (errorResponse.status >= 400) {
      this.logger.warn(logMessage);
    }
  }
}
