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
        const user = await this.userRepository.findOne({
            where: { phoneNumber, status: 1 },
            relations: ['role'],
            select: ['id', 'name', 'phoneNumber', 'email', 'password', 'status', 'roleId', 'countryId', 'region_id', 'route_id', 'photoUrl']
        });
        if (!user) {
            return null;
        }
        const isValidPassword = await user.validatePassword(password);
        if (isValidPassword) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = {
            phoneNumber: user.phoneNumber,
            sub: user.id,
            role: user.role?.name || 'USER',
            roleId: user.roleId,
            countryId: user.countryId,
            regionId: user.region_id,
            routeId: user.route_id
        };
        const token = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return {
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
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const newAccessToken = this.jwtService.sign({
                phoneNumber: payload.phoneNumber,
                sub: payload.sub,
                role: payload.role,
                roleId: payload.roleId,
                countryId: payload.countryId,
                regionId: payload.regionId,
                routeId: payload.routeId
            });
            return {
                success: true,
                accessToken: newAccessToken,
                expiresIn: 32400
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        return { success: true, message: 'Logged out successfully' };
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
//# sourceMappingURL=auth.service.optimized.js.map