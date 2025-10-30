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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const reports_service_1 = require("./reports.service");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async submitReport(reportData) {
        try {
            console.log('📋 Reports Controller: Received report submission');
            console.log('📋 Report data:', reportData);
            const userId = reportData.userId || reportData.salesRepId;
            if (!userId) {
                throw new common_1.BadRequestException('userId or salesRepId is required');
            }
            reportData.userId = userId;
            reportData.salesRepId = userId;
            const result = await this.reportsService.submitReport(reportData);
            const response = {
                success: true,
                report: {
                    id: result.id,
                    type: reportData.type,
                    journeyPlanId: reportData.journeyPlanId,
                    userId: reportData.userId || reportData.salesRepId,
                    clientId: reportData.clientId,
                    createdAt: result.createdAt,
                },
                specificReport: result,
                message: 'Report submitted successfully',
            };
            console.log('✅ Reports Controller: Report submitted successfully');
            console.log('✅ Response:', response);
            return response;
        }
        catch (error) {
            console.error('❌ Reports Controller: Report submission failed:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async getReportsByJourneyPlan(journeyPlanId) {
        try {
            const reports = await this.reportsService.getReportsByJourneyPlan(journeyPlanId);
            return {
                success: true,
                data: reports,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async getAllReports() {
        try {
            const reports = await this.reportsService.findAll();
            return {
                success: true,
                data: reports,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "submitReport", null);
__decorate([
    (0, common_1.Get)('journey-plan/:journeyPlanId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('journeyPlanId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReportsByJourneyPlan", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAllReports", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map