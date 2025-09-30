import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PerformanceService {
  private readonly logger = new Logger(PerformanceService.name);
  private performanceMetrics = new Map<string, any[]>();

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * Track API performance metrics
   */
  trackApiCall(endpoint: string, duration: number, success: boolean = true) {
    const metric = {
      endpoint,
      duration,
      success,
      timestamp: new Date().toISOString(),
    };

    if (!this.performanceMetrics.has(endpoint)) {
      this.performanceMetrics.set(endpoint, []);
    }

    const metrics = this.performanceMetrics.get(endpoint);
    metrics.push(metric);

    // Keep only last 100 metrics per endpoint
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }

    // Log slow requests
    if (duration > 1000) {
      this.logger.warn(`🐌 Slow API call: ${endpoint} took ${duration}ms`);
    }
  }

  /**
   * Get performance statistics for an endpoint
   */
  getEndpointStats(endpoint: string) {
    const metrics = this.performanceMetrics.get(endpoint) || [];
    
    if (metrics.length === 0) {
      return null;
    }

    const durations = metrics.map(m => m.duration);
    const successCount = metrics.filter(m => m.success).length;
    
    return {
      endpoint,
      totalCalls: metrics.length,
      successRate: (successCount / metrics.length) * 100,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      slowCalls: metrics.filter(m => m.duration > 1000).length,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Get database performance metrics
   */
  async getDatabaseStats() {
    try {
      const startTime = Date.now();
      
      // Get database status
      const [dbStatus] = await this.dataSource.query('SHOW STATUS LIKE "Threads_connected"');
      const [uptime] = await this.dataSource.query('SHOW STATUS LIKE "Uptime"');
      const [queries] = await this.dataSource.query('SHOW STATUS LIKE "Questions"');
      const [slowQueries] = await this.dataSource.query('SHOW STATUS LIKE "Slow_queries"');
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        responseTime: `${responseTime}ms`,
        connections: parseInt(dbStatus.Value),
        uptime: parseInt(uptime.Value),
        totalQueries: parseInt(queries.Value),
        slowQueries: parseInt(slowQueries.Value),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Failed to get database stats:', error);
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get overall system performance summary
   */
  getSystemPerformance() {
    const allEndpoints = Array.from(this.performanceMetrics.keys());
    const endpointStats = allEndpoints.map(endpoint => this.getEndpointStats(endpoint));
    
    const totalCalls = endpointStats.reduce((sum, stats) => sum + (stats?.totalCalls || 0), 0);
    const avgDuration = endpointStats.reduce((sum, stats) => sum + (stats?.averageDuration || 0), 0) / endpointStats.length;
    const slowCalls = endpointStats.reduce((sum, stats) => sum + (stats?.slowCalls || 0), 0);

    return {
      summary: {
        totalEndpoints: allEndpoints.length,
        totalCalls,
        averageDuration: avgDuration || 0,
        slowCalls,
        slowCallRate: totalCalls > 0 ? (slowCalls / totalCalls) * 100 : 0,
      },
      endpoints: endpointStats.filter(stats => stats !== null),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Clear old metrics (call this periodically)
   */
  clearOldMetrics() {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    for (const [endpoint, metrics] of this.performanceMetrics.entries()) {
      const filteredMetrics = metrics.filter(metric => 
        new Date(metric.timestamp) > cutoffTime
      );
      
      if (filteredMetrics.length === 0) {
        this.performanceMetrics.delete(endpoint);
      } else {
        this.performanceMetrics.set(endpoint, filteredMetrics);
      }
    }
    
    this.logger.log(`🧹 Cleared old performance metrics. Active endpoints: ${this.performanceMetrics.size}`);
  }
}
