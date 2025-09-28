import { DatabaseHealthService } from './database-health.service';
import { DatabaseConnectionService } from './database-connection.service';
import { PerformanceMonitorService } from './performance-monitor.service';
export declare class HealthController {
    private readonly databaseHealthService;
    private readonly databaseConnectionService;
    private readonly performanceMonitorService;
    constructor(databaseHealthService: DatabaseHealthService, databaseConnectionService: DatabaseConnectionService, performanceMonitorService: PerformanceMonitorService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        database: {
            isInitialized: boolean;
            isConnected: boolean;
            reconnectAttempts: number;
            maxReconnectAttempts: number;
            isReconnecting: boolean;
            lastSuccessfulCheck: Date;
            timeSinceLastCheck: number;
            healthy: boolean;
        };
        uptime: number;
        memory: NodeJS.MemoryUsage;
    }>;
    getDatabaseHealth(): Promise<{
        timestamp: string;
        isInitialized: boolean;
        isConnected: boolean;
        reconnectAttempts: number;
        maxReconnectAttempts: number;
        isReconnecting: boolean;
        lastSuccessfulCheck: Date;
        timeSinceLastCheck: number;
        healthy: boolean;
    }>;
    testConnection(): Promise<{
        connected: boolean;
        timestamp: string;
    }>;
    getPerformanceMetrics(): Promise<{
        slowestOperations: {
            totalTimeFormatted: string;
            avgTimeFormatted: string;
            count: number;
            totalTime: number;
            avgTime: number;
            operation: string;
        }[];
        totalOperations: number;
        metrics: {
            totalTimeFormatted: string;
            avgTimeFormatted: string;
            count: number;
            totalTime: number;
            avgTime: number;
            operation: string;
        }[];
        timestamp: string;
    }>;
}
