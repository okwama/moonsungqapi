export declare class PerformanceMonitorService {
    private readonly logger;
    private metrics;
    startTimer(operation: string): () => void;
    recordMetric(operation: string, duration: number): void;
    getMetrics(): {
        totalOperations: number;
        metrics: {
            totalTimeFormatted: string;
            avgTimeFormatted: string;
            count: number;
            totalTime: number;
            avgTime: number;
            operation: string;
        }[];
    };
    getSlowestOperations(limit?: number): {
        totalTimeFormatted: string;
        avgTimeFormatted: string;
        count: number;
        totalTime: number;
        avgTime: number;
        operation: string;
    }[];
    clearMetrics(): void;
    logPerformanceSummary(): void;
}
