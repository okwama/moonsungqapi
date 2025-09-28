import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PerformanceMonitorService {
  private readonly logger = new Logger(PerformanceMonitorService.name);
  private metrics = new Map<string, { count: number; totalTime: number; avgTime: number }>();

  /**
   * Start timing an operation
   */
  startTimer(operation: string): () => void {
    const startTime = Date.now();
    
    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      this.recordMetric(operation, duration);
    };
  }

  /**
   * Record a metric
   */
  recordMetric(operation: string, duration: number): void {
    const existing = this.metrics.get(operation) || { count: 0, totalTime: 0, avgTime: 0 };
    
    existing.count++;
    existing.totalTime += duration;
    existing.avgTime = existing.totalTime / existing.count;
    
    this.metrics.set(operation, existing);
    
    // Log slow operations
    if (duration > 1000) {
      this.logger.warn(`🐌 Slow operation detected: ${operation} took ${duration}ms`);
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const result = Array.from(this.metrics.entries()).map(([operation, data]) => ({
      operation,
      ...data,
      totalTimeFormatted: `${data.totalTime}ms`,
      avgTimeFormatted: `${Math.round(data.avgTime)}ms`
    }));

    return {
      totalOperations: this.metrics.size,
      metrics: result.sort((a, b) => b.avgTime - a.avgTime) // Sort by slowest first
    };
  }

  /**
   * Get slowest operations
   */
  getSlowestOperations(limit: number = 10) {
    return this.getMetrics().metrics.slice(0, limit);
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
    this.logger.log('Performance metrics cleared');
  }

  /**
   * Log performance summary
   */
  logPerformanceSummary(): void {
    const metrics = this.getMetrics();
    
    this.logger.log('📊 Performance Summary:');
    this.logger.log(`Total operations tracked: ${metrics.totalOperations}`);
    
    const slowest = this.getSlowestOperations(5);
    if (slowest.length > 0) {
      this.logger.log('🐌 Slowest operations:');
      slowest.forEach(metric => {
        this.logger.log(`  ${metric.operation}: ${metric.avgTimeFormatted} avg (${metric.count} calls)`);
      });
    }
  }
}
