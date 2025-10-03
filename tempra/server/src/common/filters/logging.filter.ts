import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class LoggingFilter implements ExceptionFilter {
  private readonly logger = new Logger(LoggingFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const { method, url, ip, headers, body, query, params } = request;
    const userAgent = headers['user-agent'] || '';
    const requestId = headers['x-request-id'] || 'unknown';

    const requestLog = {
      requestId,
      method,
      url,
      ip,
      userAgent,
      headers: this.sanitizeHeaders(headers),
      body: this.sanitizeBody(body),
      query,
      params,
      timestamp: new Date().toISOString(),
    };

    this.logger.error('Request that caused exception:', JSON.stringify(requestLog, null, 2));
    this.logger.error('Exception details:', exception);

    throw exception;
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
    
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
