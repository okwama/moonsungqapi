import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private authService;
    private readonly logger;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        message: string;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        salesRep: {
            id: any;
            name: any;
            email: any;
            phone: any;
            role: any;
            roleId: any;
            countryId: any;
            regionId: any;
            routeId: any;
            status: any;
            photoUrl: any;
        };
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        success: boolean;
        accessToken: string;
        expiresIn: number;
        user: {
            id: number;
            name: string;
            email: string;
            phone: string;
            role: string;
            roleId: number;
            countryId: number;
            regionId: number;
            routeId: number;
            status: number;
            photoUrl: string;
        };
    }>;
    getProfile(req: any): any;
    logout(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
