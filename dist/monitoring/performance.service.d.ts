import { DataSource } from 'typeorm';
export declare class PerformanceService {
    private dataSource;
    private readonly logger;
    private performanceMetrics;
    constructor(dataSource: DataSource);
    trackApiCall(endpoint: string, duration: number, success?: boolean): void;
    getEndpointStats(endpoint: string): {
        endpoint: string;
        totalCalls: number;
        successRate: number;
        averageDuration: number;
        minDuration: number;
        maxDuration: number;
        slowCalls: number;
        lastUpdated: string;
    };
    getDatabaseStats(): Promise<{
        status: string;
        responseTime: string;
        connections: number;
        uptime: number;
        totalQueries: number;
        slowQueries: number;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        error: any;
        timestamp: string;
        responseTime?: undefined;
        connections?: undefined;
        uptime?: undefined;
        totalQueries?: undefined;
        slowQueries?: undefined;
    }>;
    getSystemPerformance(): {
        summary: {
            totalEndpoints: number;
            totalCalls: number;
            averageDuration: number;
            slowCalls: number;
            slowCallRate: number;
        };
        endpoints: {
            endpoint: string;
            totalCalls: number;
            successRate: number;
            averageDuration: number;
            minDuration: number;
            maxDuration: number;
            slowCalls: number;
            lastUpdated: string;
        }[];
        timestamp: string;
    };
    clearOldMetrics(): void;
}
