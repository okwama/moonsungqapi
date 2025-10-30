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
exports.ClockInOutController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const clock_in_out_service_1 = require("./clock-in-out.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ClockInOutController = class ClockInOutController {
    constructor(clockInOutService) {
        this.clockInOutService = clockInOutService;
    }
    async clockIn(clockInDto) {
        return await this.clockInOutService.clockIn(clockInDto);
    }
    async clockOut(clockOutDto) {
        return await this.clockInOutService.clockOut(clockOutDto);
    }
    async getCurrentStatus(req, clientTime) {
        const userId = req.user?.id;
        return await this.clockInOutService.getCurrentStatus(userId, clientTime);
    }
    async getTodaySessions(req, clientTime) {
        const userId = req.user?.id;
        return await this.clockInOutService.getTodaySessions(userId, clientTime);
    }
    async getClockHistory(req, startDate, endDate) {
        const userId = req.user?.id;
        return await this.clockInOutService.getClockSessionsWithProcedure(userId, startDate, endDate);
    }
    async cleanupStaleSessions() {
        return await this.clockInOutService.cleanupStaleSessions();
    }
};
exports.ClockInOutController = ClockInOutController;
__decorate([
    (0, common_1.Post)('clock-in'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ClockInDto]),
    __metadata("design:returntype", Promise)
], ClockInOutController.prototype, "clockIn", null);
__decorate([
    (0, common_1.Post)('clock-out'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ClockOutDto]),
    __metadata("design:returntype", Promise)
], ClockInOutController.prototype, "clockOut", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, throttler_1.SkipThrottle)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('clientTime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClockInOutController.prototype, "getCurrentStatus", null);
__decorate([
    (0, common_1.Get)('today'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('clientTime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClockInOutController.prototype, "getTodaySessions", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ClockInOutController.prototype, "getClockHistory", null);
__decorate([
    (0, common_1.Post)('cleanup-stale-sessions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClockInOutController.prototype, "cleanupStaleSessions", null);
exports.ClockInOutController = ClockInOutController = __decorate([
    (0, common_1.Controller)('clock-in-out'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [clock_in_out_service_1.ClockInOutService])
], ClockInOutController);
//# sourceMappingURL=clock-in-out.controller.js.map