import { Repository } from 'typeorm';
import { LoginHistory } from '../entities/login-history.entity';
export declare class AutoClockoutService {
    private loginHistoryRepository;
    private readonly logger;
    constructor(loginHistoryRepository: Repository<LoginHistory>);
    autoClockoutAllUsers(): Promise<void>;
    manualAutoClockout(): Promise<void>;
    getAutoClockoutStats(): Promise<{
        activeSessions: number;
        nextAutoClockout: string;
        recordedTime: string;
        timezone: string;
    }>;
}
