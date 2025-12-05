/**
 * Unified Logging System for Client
 * 
 * Features:
 * - Environment-based logging (dev/prod)
 * - Multiple log levels
 * - Structured logging with context
 * - Performance tracking
 * - Error tracking with stack traces
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

interface LogConfig {
  enabled: boolean;
  level: LogLevel;
  showTimestamp: boolean;
  showContext: boolean;
}

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

interface PerformanceLog {
  operation: string;
  duration: number;
  context?: LogContext;
}

class Logger {
  private config: LogConfig;
  private performanceMarks: Map<string, number> = new Map();

  constructor() {
    const isDev = process.env.NODE_ENV === 'development';
    const isTest = process.env.NODE_ENV === 'test';
    
    this.config = {
      enabled: isDev && !isTest,
      level: isDev ? LogLevel.DEBUG : LogLevel.WARN,
      showTimestamp: true,
      showContext: true,
    };
  }

  /**
   * Set log level dynamically
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Enable/disable logging
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /**
   * Check if log level should be displayed
   */
  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && level >= this.config.level;
  }

  /**
   * Format timestamp
   */
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Format context for display
   */
  private formatContext(context?: LogContext): string {
    if (!context || !this.config.showContext) return '';
    
    const parts: string[] = [];
    if (context.component) parts.push(`[${context.component}]`);
    if (context.action) parts.push(`{${context.action}}`);
    if (context.userId) parts.push(`<${context.userId}>`);
    
    return parts.length > 0 ? parts.join(' ') + ' ' : '';
  }

  /**
   * Format log message
   */
  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = this.config.showTimestamp ? `[${this.getTimestamp()}]` : '';
    const contextStr = this.formatContext(context);
    return `${timestamp} ${level} ${contextStr}${message}`;
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.log(this.formatMessage('🔍 DEBUG', message, context));
    if (context?.metadata) {
      console.log('  Metadata:', context.metadata);
    }
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    console.log(this.formatMessage('ℹ️  INFO ', message, context));
    if (context?.metadata) {
      console.log('  Metadata:', context.metadata);
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    console.warn(this.formatMessage('⚠️  WARN ', message, context));
    if (context?.metadata) {
      console.warn('  Metadata:', context.metadata);
    }
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    console.error(this.formatMessage('❌ ERROR', message, context));
    
    if (error) {
      if (error instanceof Error) {
        console.error('  Error:', error.message);
        if (error.stack) {
          console.error('  Stack:', error.stack);
        }
      } else {
        console.error('  Error:', error);
      }
    }
    
    if (context?.metadata) {
      console.error('  Metadata:', context.metadata);
    }
  }

  /**
   * HTTP Request logging
   */
  request(method: string, url: string, context?: LogContext): void {
    this.debug(`→ ${method.toUpperCase()} ${url}`, {
      ...context,
      action: 'HTTP_REQUEST',
    });
  }

  /**
   * HTTP Response logging
   */
  response(method: string, url: string, status: number, duration?: number, context?: LogContext): void {
    const durationStr = duration ? ` (${duration}ms)` : '';
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.DEBUG;
    
    if (level === LogLevel.ERROR) {
      this.error(`← ${status} ${method.toUpperCase()} ${url}${durationStr}`, undefined, {
        ...context,
        action: 'HTTP_RESPONSE',
        metadata: { ...context?.metadata, status, duration },
      });
    } else {
      this.debug(`← ${status} ${method.toUpperCase()} ${url}${durationStr}`, {
        ...context,
        action: 'HTTP_RESPONSE',
        metadata: { ...context?.metadata, status, duration },
      });
    }
  }

  /**
   * Performance measurement - Start
   */
  perfStart(operationId: string): void {
    this.performanceMarks.set(operationId, Date.now());
  }

  /**
   * Performance measurement - End
   */
  perfEnd(operationId: string, context?: LogContext): void {
    const startTime = this.performanceMarks.get(operationId);
    if (!startTime) {
      this.warn(`Performance mark not found: ${operationId}`);
      return;
    }

    const duration = Date.now() - startTime;
    this.performanceMarks.delete(operationId);

    const perfLog: PerformanceLog = {
      operation: operationId,
      duration,
      context,
    };

    this.debug(`⏱️  ${operationId} completed in ${duration}ms`, {
      ...context,
      action: 'PERFORMANCE',
      metadata: { ...context?.metadata, ...perfLog },
    });
  }

  /**
   * Log a retry attempt
   */
  retry(type: string, attempt: number, maxRetries: number, delay: number, context?: LogContext): void {
    this.warn(`🔄 Retry ${type} (${attempt}/${maxRetries}) in ${delay}ms`, {
      ...context,
      action: 'RETRY',
      metadata: { ...context?.metadata, type, attempt, maxRetries, delay },
    });
  }

  /**
   * Log state change
   */
  stateChange(from: string, to: string, context?: LogContext): void {
    this.debug(`🔀 State: ${from} → ${to}`, {
      ...context,
      action: 'STATE_CHANGE',
      metadata: { ...context?.metadata, from, to },
    });
  }

  /**
   * Log user action
   */
  userAction(action: string, context?: LogContext): void {
    this.info(`👤 User action: ${action}`, {
      ...context,
      action: 'USER_ACTION',
    });
  }

  /**
   * Log API call
   */
  apiCall(endpoint: string, params?: Record<string, unknown>, context?: LogContext): void {
    this.debug(`📡 API Call: ${endpoint}`, {
      ...context,
      action: 'API_CALL',
      metadata: { ...context?.metadata, endpoint, params },
    });
  }

  /**
   * Log cache operation
   */
  cache(operation: 'hit' | 'miss' | 'set' | 'clear', key: string, context?: LogContext): void {
    const emoji = operation === 'hit' ? '✅' : operation === 'miss' ? '❌' : operation === 'set' ? '💾' : '🗑️';
    this.debug(`${emoji} Cache ${operation}: ${key}`, {
      ...context,
      action: 'CACHE',
      metadata: { ...context?.metadata, operation, key },
    });
  }

  /**
   * Group logs together
   */
  group(label: string): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.group(label);
  }

  /**
   * End log group
   */
  groupEnd(): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.groupEnd();
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for backwards compatibility
export { logger as default };
