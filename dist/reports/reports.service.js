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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const feedback_report_entity_1 = require("../entities/feedback-report.entity");
const product_report_entity_1 = require("../entities/product-report.entity");
const visibility_report_entity_1 = require("../entities/visibility-report.entity");
let ReportsService = class ReportsService {
    constructor(feedbackReportRepository, productReportRepository, visibilityReportRepository) {
        this.feedbackReportRepository = feedbackReportRepository;
        this.productReportRepository = productReportRepository;
        this.visibilityReportRepository = visibilityReportRepository;
    }
    async submitReport(reportData) {
        try {
            console.log('📋 ===== REPORT SUBMISSION START =====');
            console.log('📋 Received report data:', JSON.stringify(reportData, null, 2));
            const reportType = reportData.type || reportData.reportType;
            const { type, reportType: _, details, salesRepId, userId, ...mainData } = reportData;
            console.log('📋 Processing report type:', reportType);
            console.log('📋 Journey Plan ID:', reportData.journeyPlanId);
            console.log('📋 Sales Rep ID:', salesRepId);
            console.log('📋 User ID:', userId);
            console.log('📋 Client ID:', reportData.clientId);
            console.log('📋 Report details:', JSON.stringify(details, null, 2));
            switch (reportType) {
                case 'FEEDBACK':
                    console.log('📋 ===== FEEDBACK REPORT CREATION =====');
                    const { reportId: feedbackReportId, ...feedbackDetails } = details || {};
                    const { reportId: mainFeedbackReportId, ...mainDataWithoutFeedbackReportId } = mainData || {};
                    const feedbackDataToSave = {
                        ...mainDataWithoutFeedbackReportId,
                        ...feedbackDetails,
                        userId: userId || salesRepId
                    };
                    console.log('📋 Creating feedback report with data:', JSON.stringify(feedbackDataToSave, null, 2));
                    const feedbackReport = this.feedbackReportRepository.create(feedbackDataToSave);
                    console.log('📋 Feedback report entity created:', JSON.stringify(feedbackReport, null, 2));
                    const savedFeedbackReport = await this.feedbackReportRepository.save(feedbackReport);
                    console.log('✅ Feedback report saved successfully!');
                    console.log('✅ Feedback report ID:', savedFeedbackReport.id);
                    console.log('✅ Feedback report comment:', savedFeedbackReport.comment);
                    console.log('✅ Feedback report created at:', savedFeedbackReport.createdAt);
                    console.log('📋 ===== FEEDBACK REPORT CREATION COMPLETE =====');
                    return savedFeedbackReport;
                case 'PRODUCT_AVAILABILITY':
                    console.log('📋 ===== PRODUCT AVAILABILITY REPORT CREATION =====');
                    if (Array.isArray(details)) {
                        console.log('📋 Processing multiple products:', details.length);
                        const savedProductReports = [];
                        for (let i = 0; i < details.length; i++) {
                            const productDetail = details[i];
                            console.log(`📋 Processing product ${i + 1}:`, JSON.stringify(productDetail, null, 2));
                            const { reportId: productReportId, ...productDetailsWithoutReportId } = productDetail;
                            const { reportId: mainProductReportId, ...mainDataWithoutReportId } = mainData || {};
                            const productDataToSave = {
                                ...mainDataWithoutReportId,
                                ...productDetailsWithoutReportId,
                                userId: userId || salesRepId
                            };
                            console.log(`📋 Creating product report ${i + 1} with data:`, JSON.stringify(productDataToSave, null, 2));
                            const productReport = this.productReportRepository.create(productDataToSave);
                            console.log(`📋 Product report ${i + 1} entity created:`, JSON.stringify(productReport, null, 2));
                            const savedProductReport = await this.productReportRepository.save(productReport);
                            console.log(`✅ Product report ${i + 1} saved successfully!`);
                            console.log(`✅ Product report ${i + 1} ID:`, savedProductReport.id);
                            console.log(`✅ Product name:`, savedProductReport.productName);
                            console.log(`✅ Product quantity:`, savedProductReport.quantity);
                            console.log(`✅ Product comment:`, savedProductReport.comment);
                            console.log(`✅ Product report ${i + 1} created at:`, savedProductReport.createdAt);
                            savedProductReports.push(savedProductReport);
                        }
                        console.log('📋 ===== MULTIPLE PRODUCT REPORTS CREATION COMPLETE =====');
                        console.log(`✅ Total products saved: ${savedProductReports.length}`);
                        return savedProductReports[0];
                    }
                    else {
                        console.log('📋 Processing single product');
                        const { reportId: singleProductReportId, ...singleProductDetails } = details || {};
                        const { reportId: mainProductReportId, ...mainDataWithoutReportId } = mainData || {};
                        const singleProductDataToSave = {
                            ...mainDataWithoutReportId,
                            ...singleProductDetails,
                            userId: userId || salesRepId
                        };
                        console.log('📋 Creating single product report with data:', JSON.stringify(singleProductDataToSave, null, 2));
                        const singleProductReport = this.productReportRepository.create(singleProductDataToSave);
                        console.log('📋 Single product report entity created:', JSON.stringify(singleProductReport, null, 2));
                        const savedSingleProductReport = await this.productReportRepository.save(singleProductReport);
                        console.log('✅ Single product report saved successfully!');
                        console.log('✅ Product report ID:', savedSingleProductReport.id);
                        console.log('✅ Product name:', savedSingleProductReport.productName);
                        console.log('✅ Product quantity:', savedSingleProductReport.quantity);
                        console.log('✅ Product comment:', savedSingleProductReport.comment);
                        console.log('✅ Product report created at:', savedSingleProductReport.createdAt);
                        console.log('📋 ===== SINGLE PRODUCT REPORT CREATION COMPLETE =====');
                        return savedSingleProductReport;
                    }
                case 'VISIBILITY_ACTIVITY':
                    console.log('📋 ===== VISIBILITY ACTIVITY REPORT CREATION =====');
                    const { reportId: visibilityReportId, ...visibilityDetails } = details || {};
                    const { reportId: mainReportId, ...mainDataWithoutReportId } = mainData || {};
                    const visibilityDataToSave = {
                        ...mainDataWithoutReportId,
                        ...visibilityDetails,
                        userId: userId || salesRepId
                    };
                    console.log('📋 Creating visibility activity report with data:', JSON.stringify(visibilityDataToSave, null, 2));
                    const visibilityReport = this.visibilityReportRepository.create(visibilityDataToSave);
                    console.log('📋 Visibility report entity created:', JSON.stringify(visibilityReport, null, 2));
                    const savedVisibilityReport = await this.visibilityReportRepository.save(visibilityReport);
                    console.log('✅ Visibility activity report saved successfully!');
                    console.log('✅ Visibility report ID:', savedVisibilityReport.id);
                    console.log('✅ Visibility comment:', savedVisibilityReport.comment);
                    console.log('✅ Visibility image URL:', savedVisibilityReport.imageUrl);
                    console.log('✅ Visibility report created at:', savedVisibilityReport.createdAt);
                    console.log('📋 ===== VISIBILITY ACTIVITY REPORT CREATION COMPLETE =====');
                    return savedVisibilityReport;
                default:
                    console.error('❌ ===== UNKNOWN REPORT TYPE =====');
                    console.error('❌ Unknown report type:', reportType);
                    console.error('❌ Available types: FEEDBACK, PRODUCT_AVAILABILITY, VISIBILITY_ACTIVITY');
                    console.error('❌ Received data:', JSON.stringify(reportData, null, 2));
                    throw new Error(`Unknown report type: ${reportType}`);
            }
            console.log('📋 ===== REPORT SUBMISSION COMPLETE =====');
        }
        catch (error) {
            console.error('❌ ===== REPORT SUBMISSION ERROR =====');
            console.error('❌ Error submitting report:', error);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error stack:', error.stack);
            console.error('❌ Original report data:', JSON.stringify(reportData, null, 2));
            if (error.message && error.message.includes('ETIMEDOUT')) {
                console.error('❌ Database connection timeout detected');
                throw new Error('Database connection timeout. Please try again.');
            }
            if (error.message && (error.message.includes('ECONNRESET') || error.message.includes('ENOTFOUND'))) {
                console.error('❌ Database connection error detected');
                throw new Error('Database connection error. Please try again.');
            }
            throw new Error(`Failed to submit report: ${error.message}`);
        }
    }
    async getReportsByJourneyPlan(journeyPlanId) {
        try {
            const [feedbackReports, productReports, visibilityReports] = await Promise.all([
                this.feedbackReportRepository.find({
                    relations: ['user', 'client'],
                    order: { createdAt: 'DESC' },
                }),
                this.productReportRepository.find({
                    relations: ['user', 'client'],
                    order: { createdAt: 'DESC' },
                }),
                this.visibilityReportRepository.find({
                    relations: ['user', 'client'],
                    order: { createdAt: 'DESC' },
                }),
            ]);
            return {
                feedbackReports,
                productReports,
                visibilityReports,
            };
        }
        catch (error) {
            throw new Error(`Failed to get reports: ${error.message}`);
        }
    }
    async findAll() {
        try {
            const [feedbackReports, productReports, visibilityReports] = await Promise.all([
                this.feedbackReportRepository.find({
                    relations: ['user', 'client'],
                    order: { createdAt: 'DESC' },
                }),
                this.productReportRepository.find({
                    relations: ['user', 'client'],
                    order: { createdAt: 'DESC' },
                }),
                this.visibilityReportRepository.find({
                    relations: ['user', 'client'],
                    order: { createdAt: 'DESC' },
                }),
            ]);
            return {
                feedbackReports,
                productReports,
                visibilityReports,
            };
        }
        catch (error) {
            throw new Error(`Failed to get all reports: ${error.message}`);
        }
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feedback_report_entity_1.FeedbackReport)),
    __param(1, (0, typeorm_1.InjectRepository)(product_report_entity_1.ProductReport)),
    __param(2, (0, typeorm_1.InjectRepository)(visibility_report_entity_1.VisibilityReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map