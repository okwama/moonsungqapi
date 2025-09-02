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
exports.CommissionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const commission_service_1 = require("./commission.service");
let CommissionController = class CommissionController {
    constructor(commissionService) {
        this.commissionService = commissionService;
    }
    async calculateDailyCommission(salesRepId, date) {
        const targetDate = date ? new Date(date) : new Date();
        const result = await this.commissionService.calculateDailyCommission(+salesRepId, targetDate);
        await this.commissionService.saveDailyCommission(result);
        return {
            success: true,
            data: result,
            message: 'Daily commission calculated successfully',
        };
    }
    async getCommissionHistory(salesRepId, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        const history = await this.commissionService.getCommissionHistory(+salesRepId, start, end);
        return {
            success: true,
            data: history,
            message: 'Commission history retrieved successfully',
        };
    }
    async getCommissionSummary(salesRepId, period = 'current_month') {
        const summary = await this.commissionService.getCommissionSummary(+salesRepId, period);
        return {
            success: true,
            data: summary,
            message: 'Commission summary retrieved successfully',
        };
    }
    async updateCommissionStatus(commissionId, body) {
        const updatedCommission = await this.commissionService.updateCommissionStatus(+commissionId, body.status, body.notes);
        return {
            success: true,
            data: updatedCommission,
            message: 'Commission status updated successfully',
        };
    }
    async getTodayCommission(salesRepId) {
        const today = new Date();
        const result = await this.commissionService.calculateDailyCommission(+salesRepId, today);
        return {
            success: true,
            data: result,
            message: "Today's commission calculated successfully",
        };
    }
    async getCommissionBreakdown(salesRepId, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const history = await this.commissionService.getCommissionHistory(+salesRepId, start, end);
        const totalCommission = history.reduce((sum, commission) => sum + commission.commissionAmount, 0);
        const totalSales = history.reduce((sum, commission) => sum + commission.dailySalesAmount, 0);
        const totalDays = history.length;
        const daysWithCommission = history.filter((commission) => commission.commissionAmount > 0).length;
        const breakdown = {
            dateRange: {
                startDate: startDate,
                endDate: endDate,
            },
            summary: {
                totalCommission,
                totalSales,
                totalDays,
                daysWithCommission,
                averageDailySales: totalDays > 0 ? totalSales / totalDays : 0,
                averageDailyCommission: totalDays > 0 ? totalCommission / totalDays : 0,
                commissionRate: totalSales > 0 ? (totalCommission / totalSales) * 100 : 0,
            },
            dailyBreakdown: history,
        };
        return {
            success: true,
            data: breakdown,
            message: 'Commission breakdown retrieved successfully',
        };
    }
};
exports.CommissionController = CommissionController;
__decorate([
    (0, common_1.Get)('daily/:salesRepId'),
    __param(0, (0, common_1.Param)('salesRepId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "calculateDailyCommission", null);
__decorate([
    (0, common_1.Get)('history/:salesRepId'),
    __param(0, (0, common_1.Param)('salesRepId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "getCommissionHistory", null);
__decorate([
    (0, common_1.Get)('summary/:salesRepId'),
    __param(0, (0, common_1.Param)('salesRepId')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "getCommissionSummary", null);
__decorate([
    (0, common_1.Put)('status/:commissionId'),
    __param(0, (0, common_1.Param)('commissionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "updateCommissionStatus", null);
__decorate([
    (0, common_1.Get)('today/:salesRepId'),
    __param(0, (0, common_1.Param)('salesRepId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "getTodayCommission", null);
__decorate([
    (0, common_1.Get)('breakdown/:salesRepId'),
    __param(0, (0, common_1.Param)('salesRepId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "getCommissionBreakdown", null);
exports.CommissionController = CommissionController = __decorate([
    (0, common_1.Controller)('commission'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [commission_service_1.CommissionService])
], CommissionController);
//# sourceMappingURL=commission.controller.js.map