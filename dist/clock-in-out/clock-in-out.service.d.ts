import { Repository, DataSource } from 'typeorm';
import { LoginHistory } from '../entities/login-history.entity';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';
export declare class ClockInOutService {
    private loginHistoryRepository;
    private dataSource;
    private readonly logger;
    private userStatusCache;
    private readonly CACHE_TTL;
    constructor(loginHistoryRepository: Repository<LoginHistory>, dataSource: DataSource);
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
    getCurrentStatus(userId: number, clientTime?: string): Promise<{
        isClockedIn: boolean;
        sessionStart?: string;
        duration?: number;
        sessionId?: number;
    }>;
    getTodaySessions(userId: number, clientTime?: string): Promise<{
        sessions: any[];
    }>;
    getClockHistory(userId: number, startDate?: string, endDate?: string): Promise<{
        sessions: any[];
    }>;
    getClockSessionsWithProcedure(userId: number, startDate?: string, endDate?: string, limit?: number): Promise<{
        sessions: any[];
    }>;
    private getClockSessionsFallback;
    private clearUserCache;
    private formatDateTime;
    private formatDuration;
}
