import { ClockInOutService } from './clock-in-out.service';
import { ClockInDto, ClockOutDto } from './dto';
export declare class ClockInOutController {
    private readonly clockInOutService;
    constructor(clockInOutService: ClockInOutService);
    clockIn(clockInDto: ClockInDto): Promise<{
        success: boolean;
        message: string;
        sessionId?: number;
    }>;
    clockOut(clockOutDto: ClockOutDto): Promise<{
        success: boolean;
        message: string;
        duration?: number;
    }>;
    getCurrentStatus(userId: string, clientTime?: string): Promise<{
        isClockedIn: boolean;
        sessionStart?: string;
        duration?: number;
        sessionId?: number;
    }>;
    getTodaySessions(userId: string, clientTime?: string): Promise<{
        sessions: any[];
    }>;
    getClockHistory(userId: string, startDate?: string, endDate?: string): Promise<{
        sessions: any[];
    }>;
}
