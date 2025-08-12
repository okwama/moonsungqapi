"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sales_rep_entity_1 = require("../entities/sales-rep.entity");
const users_service_1 = require("../users/users.service");
const roles_service_1 = require("../roles/roles.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(userRepository, usersService, rolesService, jwtService) {
        this.userRepository = userRepository;
        this.usersService = usersService;
        this.rolesService = rolesService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async validateUser(phoneNumber, password) {
        this.logger.log(`🔍 Validating user with phone: ${phoneNumber}`);
        const user = await this.userRepository.findOne({
            where: { phoneNumber },
            relations: ['role']
        });
        if (!user) {
            this.logger.warn(`❌ User not found for phone: ${phoneNumber}`);
            return null;
        }
        this.logger.log(`👤 User found: ${user.name} (ID: ${user.id}, Status: ${user.status})`);
        if (user.status !== 1) {
            this.logger.warn(`❌ User ${user.name} is inactive (status: ${user.status})`);
            throw new common_1.UnauthorizedException('Account is inactive. Please contact admin to activate your account.');
        }
        const isValidPassword = await user.validatePassword(password);
        this.logger.log(`🔐 Password validation for ${user.name}: ${isValidPassword ? '✅ Valid' : '❌ Invalid'}`);
        if (isValidPassword) {
            const { password, ...result } = user;
            this.logger.log(`✅ User ${user.name} validated successfully`);
            return result;
        }
        this.logger.warn(`❌ Invalid password for user: ${user.name}`);
        return null;
    }
    async login(user) {
        this.logger.log(`🎫 Generating JWT token for user: ${user.name}`);
        const payload = {
            phoneNumber: user.phoneNumber,
            sub: user.id,
            role: user.role?.name || 'USER',
            roleId: user.roleId,
            countryId: user.countryId,
            regionId: user.region_id,
            routeId: user.route_id
        };
        this.logger.log(`📦 JWT payload: ${JSON.stringify(payload, null, 2)}`);
        const token = this.jwtService.sign(payload);
        this.logger.log(`🎫 JWT token generated successfully for user: ${user.name}`);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        this.logger.log(`🔄 Refresh token generated for user: ${user.name}`);
        const response = {
            success: true,
            message: 'Login successful',
            accessToken: token,
            refreshToken: refreshToken,
            expiresIn: 32400,
            salesRep: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phoneNumber,
                role: user.role?.name || 'USER',
                roleId: user.roleId,
                countryId: user.countryId,
                regionId: user.region_id,
                routeId: user.route_id,
                status: user.status,
                photoUrl: user.photoUrl
            }
        };
        this.logger.log(`📤 Login response prepared for user: ${user.name}`);
        return response;
    }
    async validateToken(token) {
        this.logger.log('🔍 Validating JWT token');
        try {
            const payload = this.jwtService.verify(token);
            this.logger.log(`✅ JWT token verified for user ID: ${payload.sub}`);
            const user = await this.usersService.findById(payload.sub);
            if (!user || user.status !== 1) {
                this.logger.warn(`❌ User not found or inactive for token user ID: ${payload.sub}`);
                throw new common_1.UnauthorizedException('Invalid token or user inactive');
            }
            this.logger.log(`✅ Token validation successful for user: ${user.name}`);
            return user;
        }
        catch (error) {
            this.logger.error('❌ JWT token validation failed', error.stack);
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sales_rep_entity_1.SalesRep)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        roles_service_1.RolesService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map