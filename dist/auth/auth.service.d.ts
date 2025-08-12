import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { SalesRep } from '../entities/sales-rep.entity';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
export declare class AuthService {
    private userRepository;
    private usersService;
    private rolesService;
    private jwtService;
    private readonly logger;
    constructor(userRepository: Repository<SalesRep>, usersService: UsersService, rolesService: RolesService, jwtService: JwtService);
    validateUser(phoneNumber: string, password: string): Promise<any>;
    login(user: any): Promise<{
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
    validateToken(token: string): Promise<any>;
}
