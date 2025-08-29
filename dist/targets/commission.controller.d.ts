import { CommissionService } from './commission.service';
export declare class CommissionController {
    private readonly commissionService;
    constructor(commissionService: CommissionService);
    calculateDailyCommission(salesRepId: string, date?: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    getCommissionHistory(salesRepId: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: any[];
        message: string;
    }>;
    getCommissionSummary(salesRepId: string, period?: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    updateCommissionStatus(commissionId: string, body: {
        status: string;
        notes?: string;
    }): Promise<{
        success: boolean;
        data: import("./entities/daily-commission.entity").DailyCommission;
        message: string;
    }>;
    getTodayCommission(salesRepId: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    getCommissionBreakdown(salesRepId: string, startDate: string, endDate: string): Promise<{
        success: boolean;
        data: {
            dateRange: {
                startDate: string;
                endDate: string;
            };
            summary: {
                totalCommission: any;
                totalSales: any;
                totalDays: number;
                daysWithCommission: number;
                averageDailySales: number;
                averageDailyCommission: number;
                commissionRate: number;
            };
            dailyBreakdown: any[];
        };
        message: string;
    }>;
}
