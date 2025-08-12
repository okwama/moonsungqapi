import { Repository } from 'typeorm';
import { SalesRep } from '../entities/sales-rep.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ClockInOutService } from '../clock-in-out/clock-in-out.service';
export declare class ProfileService {
    private userRepository;
    private cloudinaryService;
    private clockInOutService;
    private readonly logger;
    constructor(userRepository: Repository<SalesRep>, cloudinaryService: CloudinaryService, clockInOutService: ClockInOutService);
    findById(id: number): Promise<SalesRep | null>;
    updatePassword(userId: number, currentPassword: string, newPassword: string, confirmPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateEmail(userId: number, email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateProfilePhoto(userId: number, file: Express.Multer.File): Promise<string>;
    getSessionHistory(userId: number, startDate?: string, endDate?: string, period?: string): Promise<any[]>;
    getUserStats(userId: number, startDate?: string, endDate?: string, month?: string): Promise<any>;
    deleteAccount(userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    private getLoginHoursData;
    private getJourneyPlanData;
    private getTargetsData;
}
