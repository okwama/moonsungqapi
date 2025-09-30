import { Controller, Get, UseGuards } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('monitoring')
@UseGuards(JwtAuthGuard)
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get('performance')
  async getPerformanceStats() {
    return {
      success: true,
      data: this.performanceService.getSystemPerformance(),
    };
  }

  @Get('database')
  async getDatabaseStats() {
    const stats = await this.performanceService.getDatabaseStats();
    return {
      success: true,
      data: stats,
    };
  }

  @Get('health')
  async getHealthCheck() {
    const dbStats = await this.performanceService.getDatabaseStats();
    const performance = this.performanceService.getSystemPerformance();
    
    const isHealthy = dbStats.status === 'healthy' && 
                     performance.summary.slowCallRate < 10; // Less than 10% slow calls
    
    return {
      success: true,
      status: isHealthy ? 'healthy' : 'degraded',
      data: {
        database: dbStats,
        performance: performance.summary,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get('metrics')
  async getAllMetrics() {
    return {
      success: true,
      data: {
        system: this.performanceService.getSystemPerformance(),
        database: await this.performanceService.getDatabaseStats(),
        timestamp: new Date().toISOString(),
      },
    };
  }
}
