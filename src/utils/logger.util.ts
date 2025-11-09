import { Logger } from '@nestjs/common';

/**
 * ✅ Production-Safe Logger Utility
 * 
 * Provides conditional logging that:
 * - Only logs debug/info in non-production
 * - Always logs warnings and errors
 * - Uses NestJS Logger for structured logging
 * - Prevents information disclosure in production
 * 
 * Usage:
 * ```typescript
 * import { AppLogger } from './utils/logger.util';
 * 
 * export class MyService {
 *   private readonly logger = new AppLogger(MyService.name);
 *   
 *   someMethod() {
 *     this.logger.debug('Debug info', { data });
 *     this.logger.error('Error occurred', error);
 *   }
 * }
 * ```
 */
export class AppLogger extends Logger {
  /**
   * Log debug information (only in non-production)
   */
  debug(message: string, context?: any): void {
    if (process.env.NODE_ENV !== 'production') {
      super.debug(message, context);
    }
  }

  /**
   * Log informational messages (only in non-production)
   */
  log(message: string, context?: any): void {
    if (process.env.NODE_ENV !== 'production') {
      super.log(message, context);
    }
  }

  /**
   * Log verbose messages (only in non-production)
   */
  verbose(message: string, context?: any): void {
    if (process.env.NODE_ENV !== 'production') {
      super.verbose(message, context);
    }
  }

  /**
   * Log warnings (ALWAYS logged)
   */
  warn(message: string, context?: any): void {
    super.warn(message, context);
  }

  /**
   * Log errors (ALWAYS logged)
   */
  error(message: string, trace?: string, context?: any): void {
    super.error(message, trace, context);
  }
}

/**
 * Helper function for conditional console logging
 */
export const devLog = (message: string, ...args: any[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, ...args);
  }
};

/**
 * Helper function for API request logging
 */
export const logApiRequest = (
  method: string,
  url: string,
  statusCode?: number,
  duration?: number,
): void => {
  if (process.env.NODE_ENV !== 'production') {
    const status = statusCode ? `[${statusCode}]` : '';
    const time = duration ? ` (${duration}ms)` : '';
    console.log(`🌐 ${method} ${url} ${status}${time}`);
  }
};

/**
 * Helper function for error logging (always logs)
 */
export const logError = (
  context: string,
  error: Error | string,
  metadata?: any,
): void => {
  const logger = new Logger(context);
  logger.error(
    typeof error === 'string' ? error : error.message,
    error instanceof Error ? error.stack : undefined,
    metadata,
  );
};













