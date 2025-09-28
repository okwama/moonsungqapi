import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';
export declare class DatabaseHealthService implements OnModuleInit, OnModuleDestroy {
    private dataSource;
    private readonly logger;
    private healthCheckInterval;
    private reconnectAttempts;
    private readonly maxReconnectAttempts;
    private readonly reconnectDelay;
    private isReconnecting;
    private lastSuccessfulCheck;
    constructor(dataSource: DataSource);
    onModuleInit(): Promise<void>;
    private startHealthCheck;
    private checkDatabaseHealth;
    private handleConnectionError;
    isHealthy(): Promise<boolean>;
    getConnectionInfo(): Promise<{
        isInitialized: boolean;
        isConnected: boolean;
        reconnectAttempts: number;
        maxReconnectAttempts: number;
        isReconnecting: boolean;
        lastSuccessfulCheck: Date;
        timeSinceLastCheck: number;
    }>;
    onModuleDestroy(): void;
}
