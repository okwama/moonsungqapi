import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * ✅ Global Exception Filter
 * 
 * Handles all exceptions across the application:
 * - Sanitizes error messages in production
 * - Prevents stack trace leakage
 * - Provides consistent error response format
 * - Logs errors appropriately
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    // Get detailed error for logging
    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    // ✅ Log errors with context
    const errorLog = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      message,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    };

    // Log based on severity
    if (status >= 500) {
      // Server errors - always log
      this.logger.error(
        `💥 Server Error [${status}] ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
    } else if (status >= 400 && process.env.NODE_ENV !== 'production') {
      // Client errors - log in non-production
      this.logger.warn(
        `⚠️ Client Error [${status}] ${request.method} ${request.url}: ${message}`,
      );
    }

    // ✅ Send sanitized response
    response.status(status).json({
      statusCode: status,
      message:
        process.env.NODE_ENV === 'production' && status >= 500
          ? 'Internal server error' // Sanitized for production
          : message,
      error:
        typeof errorResponse === 'object' && errorResponse !== null
          ? (errorResponse as any).error
          : undefined,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

