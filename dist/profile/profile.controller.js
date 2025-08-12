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
var ProfileController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const profile_service_1 = require("./profile.service");
const update_password_dto_1 = require("./dto/update-password.dto");
const update_email_dto_1 = require("./dto/update-email.dto");
let ProfileController = ProfileController_1 = class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
        this.logger = new common_1.Logger(ProfileController_1.name);
    }
    async getProfile(req) {
        this.logger.log(`👤 Profile request for user: ${req.user?.name || 'Unknown'}`);
        try {
            const user = await this.profileService.findById(req.user.id);
            if (!user) {
                throw new common_1.BadRequestException('User not found');
            }
            return {
                salesRep: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    photoUrl: user.photoUrl,
                    role: user.role?.name || 'SALES_REP',
                    region: user.region,
                    region_id: user.region_id,
                    country: user.country,
                    countryId: user.countryId,
                    status: user.status
                }
            };
        }
        catch (error) {
            this.logger.error(`❌ Error fetching profile for user ${req.user.id}:`, error.stack);
            throw error;
        }
    }
    async updatePassword(req, updatePasswordDto) {
        this.logger.log(`🔐 Password update request for user: ${req.user?.name || 'Unknown'}`);
        try {
            const result = await this.profileService.updatePassword(req.user.id, updatePasswordDto.currentPassword, updatePasswordDto.newPassword, updatePasswordDto.confirmPassword);
            this.logger.log(`✅ Password updated successfully for user: ${req.user?.name}`);
            return result;
        }
        catch (error) {
            this.logger.error(`❌ Password update failed for user ${req.user.id}:`, error.stack);
            throw error;
        }
    }
    async updateEmail(req, updateEmailDto) {
        this.logger.log(`📧 Email update request for user: ${req.user?.name || 'Unknown'}`);
        try {
            const result = await this.profileService.updateEmail(req.user.id, updateEmailDto.email);
            this.logger.log(`✅ Email updated successfully for user: ${req.user?.name}`);
            return result;
        }
        catch (error) {
            this.logger.error(`❌ Email update failed for user ${req.user.id}:`, error.stack);
            throw error;
        }
    }
    async updateProfilePhoto(req, file) {
        this.logger.log(`📸 Photo upload request for user: ${req.user?.name || 'Unknown'}`);
        if (!file) {
            throw new common_1.BadRequestException('No photo file provided');
        }
        try {
            const photoUrl = await this.profileService.updateProfilePhoto(req.user.id, file);
            this.logger.log(`✅ Photo updated successfully for user: ${req.user?.name}`);
            return { photoUrl };
        }
        catch (error) {
            this.logger.error(`❌ Photo update failed for user ${req.user.id}:`, error.stack);
            throw error;
        }
    }
    async getSessionHistory(req, startDate, endDate, period) {
        this.logger.log(`📊 Session history request for user: ${req.user?.name || 'Unknown'}`);
        try {
            const sessions = await this.profileService.getSessionHistory(req.user.id, startDate, endDate, period);
            this.logger.log(`✅ Session history retrieved for user: ${req.user?.name}`);
            return { sessions };
        }
        catch (error) {
            this.logger.error(`❌ Session history failed for user ${req.user.id}:`, error.stack);
            throw error;
        }
    }
    async getUserStats(req, startDate, endDate, month) {
        this.logger.log(`📈 User stats request for user: ${req.user?.name || 'Unknown'}`);
        try {
            const stats = await this.profileService.getUserStats(req.user.id, startDate, endDate, month);
            this.logger.log(`✅ User stats retrieved for user: ${req.user?.name}`);
            return { stats };
        }
        catch (error) {
            this.logger.error(`❌ User stats failed for user ${req.user.id}:`, error.stack);
            throw error;
        }
    }
    async deleteAccount(req) {
        this.logger.log(`🗑️ Account deletion request for user: ${req.user?.name || 'Unknown'}`);
        try {
            const result = await this.profileService.deleteAccount(req.user.id);
            this.logger.log(`✅ Account deleted successfully for user: ${req.user?.name}`);
            return result;
        }
        catch (error) {
            this.logger.error(`❌ Account deletion failed for user ${req.user.id}:`, error.stack);
            throw error;
        }
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_password_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)('email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_email_dto_1.UpdateEmailDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateEmail", null);
__decorate([
    (0, common_1.Post)('photo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateProfilePhoto", null);
__decorate([
    (0, common_1.Get)('session-history'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getSessionHistory", null);
__decorate([
    (0, common_1.Get)('user-stats'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Delete)('account'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "deleteAccount", null);
exports.ProfileController = ProfileController = ProfileController_1 = __decorate([
    (0, common_1.Controller)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map