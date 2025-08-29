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
const token_entity_1 = require("../entities/token.entity");
const users_service_1 = require("../users/users.service");
const roles_service_1 = require("../roles/roles.service");
const typeorm_3 = require("typeorm");
let AuthService = AuthService_1 = class AuthService {
    constructor(userRepository, tokenRepository, usersService, rolesService, jwtService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
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
        await this.storeTokens(user.id, token, refreshToken);
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
    async refreshToken(refreshToken) {
        this.logger.log('🔄 Processing token refresh request');
        try {
            const payload = this.jwtService.verify(refreshToken);
            this.logger.log(`✅ Refresh token verified for user ID: ${payload.sub}`);
            const tokenRecord = await this.tokenRepository.findOne({
                where: {
                    token: refreshToken,
                    tokenType: 'refresh',
                    blacklisted: false
                }
            });
            if (!tokenRecord) {
                this.logger.warn('❌ Refresh token not found in database or blacklisted');
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            if (new Date() > tokenRecord.expiresAt) {
                this.logger.warn('❌ Refresh token has expired');
                throw new common_1.UnauthorizedException('Refresh token expired');
            }
            const user = await this.usersService.findById(payload.sub);
            if (!user || user.status !== 1) {
                this.logger.warn(`❌ User not found or inactive for token user ID: ${payload.sub}`);
                throw new common_1.UnauthorizedException('User not found or inactive');
            }
            const newPayload = {
                phoneNumber: user.phoneNumber,
                sub: user.id,
                role: user.role?.name || 'USER',
                roleId: user.roleId,
                countryId: user.countryId,
                regionId: user.region_id,
                routeId: user.route_id
            };
            const newAccessToken = this.jwtService.sign(newPayload);
            this.logger.log(`🎫 New access token generated for user: ${user.name}`);
            await this.storeAccessToken(user.id, newAccessToken);
            await this.tokenRepository.update({ id: tokenRecord.id }, { lastUsedAt: new Date() });
            const response = {
                success: true,
                accessToken: newAccessToken,
                refreshToken: refreshToken,
                expiresIn: 32400,
                user: {
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
            this.logger.log(`✅ Token refresh successful for user: ${user.name}`);
            return response;
        }
        catch (error) {
            this.logger.error('❌ Token refresh failed', error.stack);
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        this.logger.log(`🚪 Processing logout for user ID: ${userId}`);
        try {
            await this.tokenRepository.update({ salesRepId: userId }, { blacklisted: true });
            this.logger.log(`✅ All tokens blacklisted for user ID: ${userId}`);
            return { success: true, message: 'Logged out successfully' };
        }
        catch (error) {
            this.logger.error(`❌ Logout failed for user ID: ${userId}`, error.stack);
            throw error;
        }
    }
    async storeTokens(userId, accessToken, refreshToken) {
        this.logger.log(`💾 Storing tokens for user ID: ${userId}`);
        try {
            const accessTokenRecord = new token_entity_1.Token();
            accessTokenRecord.token = accessToken;
            accessTokenRecord.salesRepId = userId;
            accessTokenRecord.tokenType = 'access';
            accessTokenRecord.expiresAt = new Date(Date.now() + 9 * 60 * 60 * 1000);
            accessTokenRecord.blacklisted = false;
            await this.tokenRepository.save(accessTokenRecord);
            const refreshTokenRecord = new token_entity_1.Token();
            refreshTokenRecord.token = refreshToken;
            refreshTokenRecord.salesRepId = userId;
            refreshTokenRecord.tokenType = 'refresh';
            refreshTokenRecord.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            refreshTokenRecord.blacklisted = false;
            await this.tokenRepository.save(refreshTokenRecord);
            this.logger.log(`✅ Tokens stored successfully for user ID: ${userId}`);
        }
        catch (error) {
            this.logger.error(`❌ Failed to store tokens for user ID: ${userId}`, error.stack);
            throw error;
        }
    }
    async storeAccessToken(userId, accessToken) {
        this.logger.log(`💾 Storing new access token for user ID: ${userId}`);
        try {
            const accessTokenRecord = new token_entity_1.Token();
            accessTokenRecord.token = accessToken;
            accessTokenRecord.salesRepId = userId;
            accessTokenRecord.tokenType = 'access';
            accessTokenRecord.expiresAt = new Date(Date.now() + 9 * 60 * 60 * 1000);
            accessTokenRecord.blacklisted = false;
            await this.tokenRepository.save(accessTokenRecord);
            this.logger.log(`✅ New access token stored successfully for user ID: ${userId}`);
        }
        catch (error) {
            this.logger.error(`❌ Failed to store new access token for user ID: ${userId}`, error.stack);
            throw error;
        }
    }
    async validateToken(token) {
        this.logger.log('🔍 Validating JWT token');
        try {
            const payload = this.jwtService.verify(token);
            this.logger.log(`✅ JWT token verified for user ID: ${payload.sub}`);
            const tokenRecord = await this.tokenRepository.findOne({
                where: {
                    token: token,
                    tokenType: 'access',
                    blacklisted: false
                }
            });
            if (!tokenRecord) {
                this.logger.warn('❌ Token not found in database or blacklisted');
                throw new common_1.UnauthorizedException('Invalid token');
            }
            if (new Date() > tokenRecord.expiresAt) {
                this.logger.warn('❌ Token has expired');
                throw new common_1.UnauthorizedException('Token expired');
            }
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
    async getValidTokens(userId) {
        this.logger.log(`🔍 Getting valid tokens for user ID: ${userId}`);
        try {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const validTokens = await this.tokenRepository.find({
                where: {
                    salesRepId: userId,
                    blacklisted: false,
                    createdAt: (0, typeorm_3.MoreThanOrEqual)(today),
                    expiresAt: (0, typeorm_3.MoreThan)(now)
                },
                order: {
                    createdAt: 'DESC'
                }
            });
            this.logger.log(`📋 Found ${validTokens.length} valid tokens for user ID: ${userId}`);
            if (validTokens.length === 0) {
                this.logger.log(`🔄 No valid tokens found, generating new tokens for user ID: ${userId}`);
                const user = await this.usersService.findById(userId);
                if (!user || user.status !== 1) {
                    this.logger.warn(`❌ User not found or inactive for user ID: ${userId}`);
                    throw new common_1.UnauthorizedException('User not found or inactive');
                }
                const newAccessToken = this.jwtService.sign({
                    phoneNumber: user.phoneNumber,
                    sub: user.id,
                    role: user.role?.name || 'USER',
                    roleId: user.roleId,
                    countryId: user.countryId,
                    regionId: user.region_id,
                    routeId: user.route_id
                });
                const newRefreshToken = this.jwtService.sign({
                    sub: user.id,
                    type: 'refresh'
                }, { expiresIn: '7d' });
                await this.storeTokens(user.id, newAccessToken, newRefreshToken);
                this.logger.log(`✅ New tokens generated and stored for user ID: ${userId}`);
                const response = {
                    success: true,
                    accessTokens: [{
                            token: newAccessToken,
                            expiresAt: new Date(Date.now() + 9 * 60 * 60 * 1000),
                            createdAt: new Date()
                        }],
                    refreshTokens: [{
                            token: newRefreshToken,
                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                            createdAt: new Date()
                        }],
                    totalTokens: 2,
                    validAccessTokens: 1,
                    validRefreshTokens: 1,
                    tokensGenerated: true
                };
                this.logger.log(`✅ New tokens response prepared for user ID: ${userId}`);
                return response;
            }
            const accessTokens = validTokens.filter(token => token.tokenType === 'access');
            const refreshTokens = validTokens.filter(token => token.tokenType === 'refresh');
            const response = {
                success: true,
                accessTokens: accessTokens.map(token => ({
                    token: token.token,
                    expiresAt: token.expiresAt,
                    createdAt: token.createdAt
                })),
                refreshTokens: refreshTokens.map(token => ({
                    token: token.token,
                    expiresAt: token.expiresAt,
                    createdAt: token.createdAt
                })),
                totalTokens: validTokens.length,
                validAccessTokens: accessTokens.length,
                validRefreshTokens: refreshTokens.length,
                tokensGenerated: false
            };
            this.logger.log(`✅ Valid tokens response prepared for user ID: ${userId}`);
            return response;
        }
        catch (error) {
            this.logger.error(`❌ Failed to get valid tokens for user ID: ${userId}`, error.stack);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sales_rep_entity_1.SalesRep)),
    __param(1, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        roles_service_1.RolesService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map