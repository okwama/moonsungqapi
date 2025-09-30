import { PerformanceService } from './performance.service';
export declare class PerformanceController {
    private readonly performanceService;
    constructor(performanceService: PerformanceService);
    getPerformanceStats(): Promise<{
        success: boolean;
        data: {
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
    }>;
    getDatabaseStats(): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    getHealthCheck(): Promise<{
        success: boolean;
        status: string;
        data: {
            database: {
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
            };
            performance: {
                totalEndpoints: number;
                totalCalls: number;
                averageDuration: number;
                slowCalls: number;
                slowCallRate: number;
            };
            timestamp: string;
        };
    }>;
    getAllMetrics(): Promise<{
        success: boolean;
        data: {
            system: {
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
            database: {
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
            };
            timestamp: string;
        };
    }>;
}
