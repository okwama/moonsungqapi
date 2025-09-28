import { Controller, Get } from '@nestjs/common';
import { DatabaseHealthService } from './database-health.service';
import { DatabaseConnectionService } from './database-connection.service';
import { PerformanceMonitorService } from './performance-monitor.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly databaseHealthService: DatabaseHealthService,
    private readonly databaseConnectionService: DatabaseConnectionService,
    private readonly performanceMonitorService: PerformanceMonitorService,
  ) {}

  @Get()
  async getHealth() {
    const dbHealthy = await this.databaseHealthService.isHealthy();
    const connectionInfo = await this.databaseHealthService.getConnectionInfo();
    const connectionStatus = this.databaseConnectionService.getConnectionStatus();
    
    return {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        healthy: dbHealthy,
        ...connectionInfo,
        ...connectionStatus,
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  @Get('database')
  async getDatabaseHealth() {
    const healthy = await this.databaseHealthService.isHealthy();
    const connectionInfo = await this.databaseHealthService.getConnectionInfo();
    const connectionStatus = this.databaseConnectionService.getConnectionStatus();
    
    return {
      healthy,
      ...connectionInfo,
      ...connectionStatus,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('test-connection')
  async testConnection() {
    const isConnected = await this.databaseConnectionService.testConnection();
    
    return {
      connected: isConnected,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('performance')
  async getPerformanceMetrics() {
    const metrics = this.performanceMonitorService.getMetrics();
    const slowest = this.performanceMonitorService.getSlowestOperations(10);
    
    return {
      timestamp: new Date().toISOString(),
      ...metrics,
      slowestOperations: slowest,
    };
  }
}
