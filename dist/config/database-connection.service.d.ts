import { DataSource, QueryRunner } from 'typeorm';
export declare class DatabaseConnectionService {
    private dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    executeQuery<T = any>(query: string, parameters?: any[], maxRetries?: number): Promise<T>;
    executeTransaction<T>(operation: (queryRunner: QueryRunner) => Promise<T>, maxRetries?: number): Promise<T>;
    private isConnectionError;
    testConnection(): Promise<boolean>;
    getConnectionStatus(): {
        isInitialized: boolean;
        isConnected: boolean;
    };
}
