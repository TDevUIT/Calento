import { Injectable, Logger, LoggerService } from '@nestjs/common';

/**
 * Enhanced Application Logger Service
 * 
 * Provides structured logging with additional context and features:
 * - Component/context-based logging
 * - Structured log data
 * - Performance tracking
 * - User action logging
 */
@Injectable()
export class AppLoggerService implements LoggerService {
  private logger: Logger;

  constructor(context?: string) {
    this.logger = new Logger(context || 'Application');
  }

  /**
   * Set context for logger
   */
  setContext(context: string): void {
    this.logger = new Logger(context);
  }

  /**
   * Log a message
   */
  log(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  /**
   * Log an error
   */
  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  /**
   * Log debug information
   */
  debug(message: string, context?: string): void {
    this.logger.debug(message, context);
  }

  /**
   * Log verbose information
   */
  verbose(message: string, context?: string): void {
    this.logger.verbose(message, context);
  }

  /**
   * Log with structured data
   */
  logWithData(
    message: string,
    data: Record<string, unknown>,
    context?: string,
  ): void {
    this.logger.log(`${message} | Data: ${JSON.stringify(data)}`, context);
  }

  /**
   * Log performance metrics
   */
  logPerformance(
    operation: string,
    duration: number,
    context?: string,
  ): void {
    this.logger.log(`⏱️  ${operation} completed in ${duration}ms`, context);
  }

  /**
   * Log user action
   */
  logUserAction(
    userId: string,
    action: string,
    details?: Record<string, unknown>,
    context?: string,
  ): void {
    const detailsStr = details ? ` | ${JSON.stringify(details)}` : '';
    this.logger.log(
      `👤 User ${userId} performed: ${action}${detailsStr}`,
      context,
    );
  }

  /**
   * Log database query
   */
  logDatabaseQuery(
    query: string,
    duration: number,
    context?: string,
  ): void {
    this.logger.debug(`🗄️  Query: ${query} | ${duration}ms`, context);
  }

  /**
   * Log API call
   */
  logApiCall(
    method: string,
    url: string,
    status: number,
    duration: number,
    context?: string,
  ): void {
    this.logger.log(
      `📡 ${method} ${url} | ${status} | ${duration}ms`,
      context,
    );
  }

  /**
   * Log cache operation
   */
  logCacheOperation(
    operation: 'hit' | 'miss' | 'set' | 'clear',
    key: string,
    context?: string,
  ): void {
    const emoji =
      operation === 'hit'
        ? '✅'
        : operation === 'miss'
        ? '❌'
        : operation === 'set'
        ? '💾'
        : '🗑️';
    this.logger.debug(`${emoji} Cache ${operation}: ${key}`, context);
  }

  /**
   * Log state change
   */
  logStateChange(
    entity: string,
    from: string,
    to: string,
    context?: string,
  ): void {
    this.logger.log(`🔀 ${entity} state: ${from} → ${to}`, context);
  }

  /**
   * Log external service call
   */
  logExternalService(
    service: string,
    operation: string,
    success: boolean,
    duration?: number,
    context?: string,
  ): void {
    const status = success ? '✅' : '❌';
    const durationStr = duration ? ` | ${duration}ms` : '';
    this.logger.log(
      `${status} ${service}: ${operation}${durationStr}`,
      context,
    );
  }

  /**
   * Log security event
   */
  logSecurityEvent(
    event: string,
    userId?: string,
    details?: Record<string, unknown>,
    context?: string,
  ): void {
    const userStr = userId ? ` | User: ${userId}` : '';
    const detailsStr = details ? ` | ${JSON.stringify(details)}` : '';
    this.logger.warn(`🔒 Security: ${event}${userStr}${detailsStr}`, context);
  }

  /**
   * Log business event
   */
  logBusinessEvent(
    event: string,
    data?: Record<string, unknown>,
    context?: string,
  ): void {
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    this.logger.log(`💼 Business Event: ${event}${dataStr}`, context);
  }
}
