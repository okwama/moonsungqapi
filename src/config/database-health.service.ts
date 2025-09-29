import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseHealthService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseHealthService.name);
  private healthCheckInterval: NodeJS.Timeout;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 15; // Increased attempts
  private readonly reconnectDelay = 3000; // Reduced initial delay
  private isReconnecting = false;
  private lastSuccessfulCheck: Date | null = null;

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    // Only start health checks in non-serverless environments
    if (!process.env.VERCEL) {
      this.startHealthCheck();
    }
  }

  private startHealthCheck() {
    // Check database health every 15 seconds for faster detection
    this.healthCheckInterval = setInterval(async () => {
      await this.checkDatabaseHealth();
    }, 15000);
  }

  private async checkDatabaseHealth() {
    try {
      // Skip health check if already reconnecting
      if (this.isReconnecting) {
        return;
      }

      // Simple query to test connection with timeout
      await Promise.race([
        this.dataSource.query('SELECT 1'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Health check timeout')), 5000)
        )
      ]);
      
      this.reconnectAttempts = 0; // Reset counter on successful connection
      this.lastSuccessfulCheck = new Date();
      this.logger.debug('Database connection is healthy');
    } catch (error) {
      this.logger.error('Database health check failed:', error.message);
      await this.handleConnectionError();
    }
  }

  private async handleConnectionError() {
    if (this.isReconnecting) {
      return; // Prevent multiple simultaneous reconnection attempts
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.logger.error('Max reconnection attempts reached. Stopping health checks.');
      clearInterval(this.healthCheckInterval);
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;
    this.logger.warn(`Attempting to reconnect to database (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    try {
      // Close existing connections gracefully
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
        this.logger.log('Database connection destroyed');
      }

      // Wait before reconnecting with exponential backoff
      const backoffDelay = Math.min(
        this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1),
        30000 // Max 30 seconds
      );
      this.logger.log(`Waiting ${backoffDelay}ms before reconnection...`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));

      // Reinitialize connection
      await this.dataSource.initialize();
      this.logger.log('Database reconnection successful');
      this.reconnectAttempts = 0;
      this.lastSuccessfulCheck = new Date();
    } catch (error) {
      this.logger.error(`Reconnection attempt ${this.reconnectAttempts} failed:`, error.message);
    } finally {
      this.isReconnecting = false;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database health check failed:', error.message);
      return false;
    }
  }

  async getConnectionInfo() {
    return {
      isInitialized: this.dataSource.isInitialized,
      isConnected: this.dataSource.isInitialized,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      isReconnecting: this.isReconnecting,
      lastSuccessfulCheck: this.lastSuccessfulCheck,
      timeSinceLastCheck: this.lastSuccessfulCheck 
        ? Date.now() - this.lastSuccessfulCheck.getTime() 
        : null,
    };
  }

  onModuleDestroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
} 