import { ProfileService } from './profile.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
export declare class ProfileController {
    private readonly profileService;
    private readonly logger;
    constructor(profileService: ProfileService);
    getProfile(req: any): Promise<{
        salesRep: {
            id: number;
            name: string;
            email: string;
            phoneNumber: string;
            photoUrl: string;
            role: string;
            region: string;
            region_id: number;
            country: string;
            countryId: number;
            status: number;
        };
    }>;
    updatePassword(req: any, updatePasswordDto: UpdatePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updateEmail(req: any, updateEmailDto: UpdateEmailDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updateProfilePhoto(req: any, file: Express.Multer.File): Promise<{
        photoUrl: string;
    }>;
    getSessionHistory(req: any, startDate?: string, endDate?: string, period?: string): Promise<{
        sessions: any[];
    }>;
    getUserStats(req: any, startDate?: string, endDate?: string, month?: string): Promise<{
        stats: any;
    }>;
    deleteAccount(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
