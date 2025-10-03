import { ArgumentsHost, Catch, ExceptionFilter, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { MessageService } from '../message/message.service';

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  constructor(private readonly messageService: MessageService) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    let message = this.messageService.get('error.validation_failed');
    let errors: any = undefined;

    if (typeof exceptionResponse === 'object') {
      message = exceptionResponse.message || message;
      errors = exceptionResponse.errors || exceptionResponse.message;
    }

    const errorResponse = {
      statusCode: status,
      message: this.messageService.get('error.validation_failed'),
      errors: Array.isArray(errors) ? errors : [errors],
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.headers['x-request-id'] as string,
    };

    response.status(status).json(errorResponse);
  }
}
