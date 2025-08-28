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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoClockoutController = void 0;
const common_1 = require("@nestjs/common");
const auto_clockout_service_1 = require("./auto-clockout.service");
let AutoClockoutController = class AutoClockoutController {
    constructor(autoClockoutService) {
        this.autoClockoutService = autoClockoutService;
    }
    async triggerAutoClockout() {
        try {
            await this.autoClockoutService.manualAutoClockout();
            return {
                success: true,
                message: 'Auto clockout process triggered successfully',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to trigger auto clockout',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getAutoClockoutStats() {
        try {
            const stats = await this.autoClockoutService.getAutoClockoutStats();
            return {
                success: true,
                data: stats,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to get auto clockout stats',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getAutoClockoutConfig() {
        return {
            success: true,
            config: {
                cronSchedule: '0 22 * * *',
                timezone: 'Africa/Nairobi',
                recordedTime: '20:00 (8 PM)',
                description: 'Auto clockout runs at 10 PM but records 8 PM as clock-out time',
                nextRun: '22:00 (10 PM) daily',
            },
            timestamp: new Date().toISOString(),
        };
    }
};
exports.AutoClockoutController = AutoClockoutController;
__decorate([
    (0, common_1.Post)('trigger'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutoClockoutController.prototype, "triggerAutoClockout", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutoClockoutController.prototype, "getAutoClockoutStats", null);
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutoClockoutController.prototype, "getAutoClockoutConfig", null);
exports.AutoClockoutController = AutoClockoutController = __decorate([
    (0, common_1.Controller)('auto-clockout'),
    __metadata("design:paramtypes", [auto_clockout_service_1.AutoClockoutService])
], AutoClockoutController);
//# sourceMappingURL=auto-clockout.controller.js.map