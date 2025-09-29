import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class DatabaseConnectionService {
  private readonly logger = new Logger(DatabaseConnectionService.name);

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * Execute a query with automatic retry logic
   */
  async executeQuery<T = any>(
    query: string,
    parameters?: any[],
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.debug(`Executing query (attempt ${attempt}/${maxRetries}): ${query.substring(0, 100)}...`);
        
        // Check if connection is established, especially for serverless
        if (!this.dataSource.isInitialized) {
          this.logger.warn('Database not initialized, attempting to initialize...');
          await this.dataSource.initialize();
        }
        
        const result = await this.dataSource.query(query, parameters);
        return result;
      } catch (error) {
        lastError = error;
        this.logger.warn(`Query attempt ${attempt} failed:`, error.message);
        
        // Check if it's a connection-related error
        if (this.isConnectionError(error)) {
          if (attempt < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            this.logger.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        } else {
          // Non-connection error, don't retry
          throw error;
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Execute a transaction with automatic retry logic
   */
  async executeTransaction<T>(
    operation: (queryRunner: QueryRunner) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const queryRunner = this.dataSource.createQueryRunner();
      
      try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        this.logger.debug(`Starting transaction (attempt ${attempt}/${maxRetries})`);
        
        const result = await operation(queryRunner);
        
        await queryRunner.commitTransaction();
        this.logger.debug('Transaction committed successfully');
        
        return result;
      } catch (error) {
        lastError = error;
        this.logger.warn(`Transaction attempt ${attempt} failed:`, error.message);
        
        try {
          await queryRunner.rollbackTransaction();
          this.logger.debug('Transaction rolled back');
        } catch (rollbackError) {
          this.logger.error('Failed to rollback transaction:', rollbackError.message);
        }
        
        // Check if it's a connection-related error
        if (this.isConnectionError(error)) {
          if (attempt < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            this.logger.log(`Retrying transaction in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        } else {
          // Non-connection error, don't retry
          throw error;
        }
      } finally {
        await queryRunner.release();
      }
    }
    
    throw lastError;
  }

  /**
   * Check if the error is related to database connection
   */
  private isConnectionError(error: any): boolean {
    const connectionErrorMessages = [
      'Pool is closed',
      'Connection lost',
      'Connection terminated',
      'ECONNRESET',
      'ENOTFOUND',
      'ETIMEDOUT',
      'Connection refused',
      'Can\'t add new command when connection is in closed state',
      'Connection is closed',
      'MySQL server has gone away',
    ];
    
    const errorMessage = error.message?.toLowerCase() || '';
    return connectionErrorMessages.some(msg => 
      errorMessage.includes(msg.toLowerCase())
    );
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.executeQuery('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database connection test failed:', error.message);
      return false;
    }
  }

  /**
   * Get connection pool status
   */
  getConnectionStatus() {
    return {
      isInitialized: this.dataSource.isInitialized,
      isConnected: this.dataSource.isInitialized,
      // Note: TypeORM doesn't expose pool statistics directly
      // You might need to access the underlying driver for more details
    };
  }
}
