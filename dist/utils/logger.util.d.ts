import { Logger } from '@nestjs/common';
export declare class AppLogger extends Logger {
    debug(message: string, context?: any): void;
    log(message: string, context?: any): void;
    verbose(message: string, context?: any): void;
    warn(message: string, context?: any): void;
    error(message: string, trace?: string, context?: any): void;
}
export declare const devLog: (message: string, ...args: any[]) => void;
export declare const logApiRequest: (method: string, url: string, statusCode?: number, duration?: number) => void;
export declare const logError: (context: string, error: Error | string, metadata?: any) => void;
