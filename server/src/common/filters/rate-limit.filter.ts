import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MessageService } from '../message/message.service';

export class RateLimitException extends Error {
  constructor(
    public readonly limit: number,
    public readonly windowMs: number,
    public readonly retryAfter: number,
  ) {
    super('Rate limit exceeded');
  }
}

@Catch(RateLimitException)
export class RateLimitFilter implements ExceptionFilter {
  constructor(private readonly messageService: MessageService) {}

  catch(exception: RateLimitException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = {
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      message: this.messageService.get('error.rate_limit_exceeded'),
      error: 'Too Many Requests',
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.headers['x-request-id'] as string,
      rateLimit: {
        limit: exception.limit,
        windowMs: exception.windowMs,
        retryAfter: exception.retryAfter,
      },
    };

    response.setHeader('X-RateLimit-Limit', exception.limit);
    response.setHeader('X-RateLimit-Remaining', 0);
    response.setHeader(
      'X-RateLimit-Reset',
      new Date(Date.now() + exception.retryAfter * 1000).toISOString(),
    );
    response.setHeader('Retry-After', exception.retryAfter);

    response.status(HttpStatus.TOO_MANY_REQUESTS).json(errorResponse);
  }
}
