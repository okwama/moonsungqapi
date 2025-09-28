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
var AutoClockoutService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoClockoutService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const login_history_entity_1 = require("../entities/login-history.entity");
let AutoClockoutService = AutoClockoutService_1 = class AutoClockoutService {
    constructor(loginHistoryRepository) {
        this.loginHistoryRepository = loginHistoryRepository;
        this.logger = new common_1.Logger(AutoClockoutService_1.name);
    }
    async autoClockoutAllUsers() {
        try {
            this.logger.log('🕙 Starting auto clockout process at 10 PM...');
            const now = new Date();
            const nairobiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
            const eightPMToday = new Date(nairobiTime);
            eightPMToday.setHours(20, 0, 0, 0);
            const eightPMTimeString = eightPMToday.getFullYear() + '-' +
                String(eightPMToday.getMonth() + 1).padStart(2, '0') + '-' +
                String(eightPMToday.getDate()).padStart(2, '0') + ' ' +
                String(eightPMToday.getHours()).padStart(2, '0') + ':' +
                String(eightPMToday.getMinutes()).padStart(2, '0') + ':' +
                String(eightPMToday.getSeconds()).padStart(2, '0') + '.000';
            const startOfDay = new Date(nairobiTime);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(nairobiTime);
            endOfDay.setHours(23, 59, 59, 999);
            const startOfDayStr = startOfDay.toISOString().slice(0, 19).replace('T', ' ');
            const endOfDayStr = endOfDay.toISOString().slice(0, 19).replace('T', ' ');
            const activeSessions = await this.loginHistoryRepository
                .createQueryBuilder('session')
                .where('session.sessionStart >= :startOfDay', { startOfDay: startOfDayStr })
                .andWhere('session.sessionStart <= :endOfDay', { endOfDay: endOfDayStr })
                .andWhere('session.status = :status', { status: 1 })
                .getMany();
            this.logger.log(`📊 Found ${activeSessions.length} active sessions to auto clockout`);
            let clockedOutCount = 0;
            let errorCount = 0;
            if (activeSessions.length > 0) {
                try {
                    const sessionUpdates = activeSessions.map(session => {
                        const startTime = new Date(session.sessionStart);
                        const endTime = new Date(eightPMTimeString);
                        const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
                        return {
                            id: session.id,
                            userId: session.userId,
                            duration: durationMinutes
                        };
                    });
                    const sessionIds = sessionUpdates.map(s => s.id);
                    await this.loginHistoryRepository
                        .createQueryBuilder()
                        .update(login_history_entity_1.LoginHistory)
                        .set({
                        status: 2,
                        sessionEnd: eightPMTimeString,
                    })
                        .where('id IN (:...ids)', { ids: sessionIds })
                        .execute();
                    for (const update of sessionUpdates) {
                        await this.loginHistoryRepository.update(update.id, {
                            duration: update.duration,
                        });
                        this.logger.log(`✅ Auto clocked out user ${update.userId} at 8 PM (duration: ${update.duration} minutes)`);
                        clockedOutCount++;
                    }
                }
                catch (error) {
                    this.logger.error(`❌ Failed to batch auto clockout: ${error.message}`);
                    errorCount = activeSessions.length;
                }
            }
            this.logger.log(`🎯 Auto clockout completed: ${clockedOutCount} users clocked out, ${errorCount} errors`);
        }
        catch (error) {
            this.logger.error(`💥 Auto clockout process failed: ${error.message}`);
        }
    }
    async manualAutoClockout() {
        this.logger.log('🔧 Manual auto clockout triggered');
        await this.autoClockoutAllUsers();
    }
    async getAutoClockoutStats() {
        try {
            const today = new Date();
            const startOfDay = new Date(today);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(today);
            endOfDay.setHours(23, 59, 59, 999);
            const startOfDayStr = startOfDay.toISOString().slice(0, 19).replace('T', ' ');
            const endOfDayStr = endOfDay.toISOString().slice(0, 19).replace('T', ' ');
            const activeSessions = await this.loginHistoryRepository
                .createQueryBuilder('session')
                .where('session.sessionStart >= :startOfDay', { startOfDay: startOfDayStr })
                .andWhere('session.sessionStart <= :endOfDay', { endOfDay: endOfDayStr })
                .andWhere('session.status = :status', { status: 1 })
                .getCount();
            return {
                activeSessions,
                nextAutoClockout: '22:00 (10 PM) daily',
                recordedTime: '20:00 (8 PM)',
                timezone: 'Africa/Nairobi',
            };
        }
        catch (error) {
            this.logger.error(`Error getting auto clockout stats: ${error.message}`);
            return null;
        }
    }
};
exports.AutoClockoutService = AutoClockoutService;
__decorate([
    (0, schedule_1.Cron)('0 22 * * *', {
        name: 'auto-clockout',
        timeZone: 'Africa/Nairobi',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutoClockoutService.prototype, "autoClockoutAllUsers", null);
exports.AutoClockoutService = AutoClockoutService = AutoClockoutService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(login_history_entity_1.LoginHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AutoClockoutService);
//# sourceMappingURL=auto-clockout.service.js.map