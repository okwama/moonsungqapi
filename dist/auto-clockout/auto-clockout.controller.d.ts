import { AutoClockoutService } from './auto-clockout.service';
export declare class AutoClockoutController {
    private readonly autoClockoutService;
    constructor(autoClockoutService: AutoClockoutService);
    triggerAutoClockout(): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        timestamp: string;
    }>;
    getAutoClockoutStats(): Promise<{
        success: boolean;
        data: {
            activeSessions: number;
            nextAutoClockout: string;
            recordedTime: string;
            timezone: string;
        };
        timestamp: string;
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        timestamp: string;
        data?: undefined;
    }>;
    getAutoClockoutConfig(): Promise<{
        success: boolean;
        config: {
            cronSchedule: string;
            timezone: string;
            recordedTime: string;
            description: string;
            nextRun: string;
        };
        timestamp: string;
    }>;
}
