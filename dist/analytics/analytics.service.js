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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const login_history_entity_1 = require("../entities/login-history.entity");
const journey_plan_entity_1 = require("../journey-plans/entities/journey-plan.entity");
const uplift_sale_entity_1 = require("../entities/uplift-sale.entity");
const product_report_entity_1 = require("../entities/product-report.entity");
const feedback_report_entity_1 = require("../entities/feedback-report.entity");
const visibility_report_entity_1 = require("../entities/visibility-report.entity");
let AnalyticsService = class AnalyticsService {
    constructor(loginHistoryRepository, journeyPlanRepository, upliftSaleRepository, productReportRepository, feedbackReportRepository, visibilityReportRepository) {
        this.loginHistoryRepository = loginHistoryRepository;
        this.journeyPlanRepository = journeyPlanRepository;
        this.upliftSaleRepository = upliftSaleRepository;
        this.productReportRepository = productReportRepository;
        this.feedbackReportRepository = feedbackReportRepository;
        this.visibilityReportRepository = visibilityReportRepository;
    }
    async findAll(query) {
        try {
            const userId = query.userId ? parseInt(query.userId, 10) : null;
            const startDate = query.startDate ? new Date(query.startDate) : null;
            const endDate = query.endDate ? new Date(query.endDate) : null;
            const analytics = {
                loginStats: await this._getLoginStats(userId, startDate, endDate),
                journeyStats: await this._getJourneyStats(userId, startDate, endDate),
                salesStats: await this._getSalesStats(userId, startDate, endDate),
                reportStats: await this._getReportStats(userId, startDate, endDate),
            };
            return analytics;
        }
        catch (error) {
            console.error('Error fetching analytics data:', error);
            throw new Error('Failed to fetch analytics data');
        }
    }
    async findOne(id) {
        try {
            const userId = id;
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
            const endDate = new Date();
            return {
                loginStats: await this._getLoginStats(userId, startDate, endDate),
                journeyStats: await this._getJourneyStats(userId, startDate, endDate),
                salesStats: await this._getSalesStats(userId, startDate, endDate),
                reportStats: await this._getReportStats(userId, startDate, endDate),
            };
        }
        catch (error) {
            console.error('Error fetching analytics by ID:', error);
            throw new Error('Failed to fetch analytics data');
        }
    }
    async create(createAnalyticsDto) {
        try {
            return { message: 'Analytics data is automatically generated from user activities' };
        }
        catch (error) {
            console.error('Error creating analytics data:', error);
            throw new Error('Failed to create analytics data');
        }
    }
    async update(id, updateAnalyticsDto) {
        try {
            return { message: 'Analytics data is automatically updated from user activities' };
        }
        catch (error) {
            console.error('Error updating analytics data:', error);
            throw new Error('Failed to update analytics data');
        }
    }
    async remove(id) {
        try {
            return { message: 'Analytics data is automatically managed from user activities' };
        }
        catch (error) {
            console.error('Error deleting analytics data:', error);
            throw new Error('Failed to delete analytics data');
        }
    }
    async getDailyLoginHours(userId, query) {
        try {
            const startDate = query.startDate ? new Date(query.startDate) : new Date();
            const endDate = query.endDate ? new Date(query.endDate) : new Date();
            const queryBuilder = this.loginHistoryRepository.createQueryBuilder('login');
            queryBuilder
                .where('login.userId = :userId', { userId })
                .andWhere('login.sessionStart >= :startDate', { startDate })
                .andWhere('login.sessionStart <= :endDate', { endDate });
            const logins = await queryBuilder.getMany();
            const dailyHours = {};
            logins.forEach(login => {
                const date = login.sessionStart ? new Date(login.sessionStart).toISOString().split('T')[0] : null;
                if (date) {
                    dailyHours[date] = (dailyHours[date] || 0) + (login.duration || 0);
                }
            });
            return dailyHours;
        }
        catch (error) {
            console.error('Error fetching daily login hours:', error);
            throw new Error('Failed to fetch daily login hours');
        }
    }
    async getDailyJourneyVisits(userId, query) {
        try {
            const startDate = query.startDate ? new Date(query.startDate) : new Date();
            const endDate = query.endDate ? new Date(query.endDate) : new Date();
            const queryBuilder = this.journeyPlanRepository.createQueryBuilder('journey');
            queryBuilder
                .where('journey.userId = :userId', { userId })
                .andWhere('journey.date >= :startDate', { startDate })
                .andWhere('journey.date <= :endDate', { endDate });
            const journeys = await queryBuilder.getMany();
            const dailyVisits = {};
            journeys.forEach(journey => {
                const date = journey.date ? new Date(journey.date).toISOString().split('T')[0] : null;
                if (date) {
                    dailyVisits[date] = (dailyVisits[date] || 0) + 1;
                }
            });
            return dailyVisits;
        }
        catch (error) {
            console.error('Error fetching daily journey visits:', error);
            throw new Error('Failed to fetch daily journey visits');
        }
    }
    async _getLoginStats(userId, startDate, endDate) {
        const queryBuilder = this.loginHistoryRepository.createQueryBuilder('login');
        if (userId) {
            queryBuilder.where('login.userId = :userId', { userId });
        }
        if (startDate) {
            queryBuilder.andWhere('login.sessionStart >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('login.sessionStart <= :endDate', { endDate });
        }
        const logins = await queryBuilder.getMany();
        return {
            totalSessions: logins.length,
            totalDuration: logins.reduce((sum, login) => sum + (login.duration || 0), 0),
            averageDuration: logins.length > 0 ? logins.reduce((sum, login) => sum + (login.duration || 0), 0) / logins.length : 0,
            activeDays: new Set(logins.map(login => login.sessionStart ? new Date(login.sessionStart).toDateString() : null)).size,
        };
    }
    async _getJourneyStats(userId, startDate, endDate) {
        const queryBuilder = this.journeyPlanRepository.createQueryBuilder('journey');
        if (userId) {
            queryBuilder.where('journey.userId = :userId', { userId });
        }
        if (startDate) {
            queryBuilder.andWhere('journey.date >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('journey.date <= :endDate', { endDate });
        }
        const journeys = await queryBuilder.getMany();
        return {
            totalJourneys: journeys.length,
            completedJourneys: journeys.filter(j => j.status === 1).length,
            pendingJourneys: journeys.filter(j => j.status === 0).length,
            checkInRate: journeys.length > 0 ? (journeys.filter(j => j.checkInTime != null).length / journeys.length) * 100 : 0,
        };
    }
    async _getSalesStats(userId, startDate, endDate) {
        const queryBuilder = this.upliftSaleRepository.createQueryBuilder('sale');
        if (userId) {
            queryBuilder.where('sale.userId = :userId', { userId });
        }
        if (startDate) {
            queryBuilder.andWhere('sale.createdAt >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('sale.createdAt <= :endDate', { endDate });
        }
        const sales = await queryBuilder.getMany();
        return {
            totalSales: sales.length,
            totalAmount: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
            averageAmount: sales.length > 0 ? sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length : 0,
            completedSales: sales.filter(s => s.status === 1).length,
            pendingSales: sales.filter(s => s.status === 0).length,
        };
    }
    async _getReportStats(userId, startDate, endDate) {
        const productReports = await this.productReportRepository.createQueryBuilder('report')
            .where(userId ? 'report.userId = :userId' : '1=1', userId ? { userId } : {})
            .getMany();
        const feedbackReports = await this.feedbackReportRepository.createQueryBuilder('report')
            .where(userId ? 'report.userId = :userId' : '1=1', userId ? { userId } : {})
            .getMany();
        const visibilityReports = await this.visibilityReportRepository.createQueryBuilder('report')
            .where(userId ? 'report.userId = :userId' : '1=1', userId ? { userId } : {})
            .getMany();
        return {
            totalReports: productReports.length + feedbackReports.length + visibilityReports.length,
            productReports: productReports.length,
            feedbackReports: feedbackReports.length,
            visibilityReports: visibilityReports.length,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(login_history_entity_1.LoginHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(journey_plan_entity_1.JourneyPlan)),
    __param(2, (0, typeorm_1.InjectRepository)(uplift_sale_entity_1.UpliftSale)),
    __param(3, (0, typeorm_1.InjectRepository)(product_report_entity_1.ProductReport)),
    __param(4, (0, typeorm_1.InjectRepository)(feedback_report_entity_1.FeedbackReport)),
    __param(5, (0, typeorm_1.InjectRepository)(visibility_report_entity_1.VisibilityReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map