import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackReport } from '../entities/feedback-report.entity';
import { ProductReport } from '../entities/product-report.entity';
import { VisibilityReport } from '../entities/visibility-report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(FeedbackReport)
    private feedbackReportRepository: Repository<FeedbackReport>,
    @InjectRepository(ProductReport)
    private productReportRepository: Repository<ProductReport>,
    @InjectRepository(VisibilityReport)
    private visibilityReportRepository: Repository<VisibilityReport>,
  ) {}

  async submitReport(reportData: any): Promise<any> {
    try {
      console.log('📋 ===== REPORT SUBMISSION START =====');
      console.log('📋 Received report data:', JSON.stringify(reportData, null, 2));
      
      // Handle both 'type' and 'reportType' for compatibility
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
          // Extract reportId from details and exclude it to avoid duplicate key errors
          const { reportId: feedbackReportId, ...feedbackDetails } = details || {};
          
          // Also exclude reportId from mainData if it exists
          const { reportId: mainFeedbackReportId, ...mainDataWithoutFeedbackReportId } = mainData || {};
          
          // Combine main data with details and map userId/salesRepId properly
          const feedbackDataToSave = {
            ...mainDataWithoutFeedbackReportId,
            ...feedbackDetails,
            userId: userId || salesRepId // Use userId if provided, otherwise use salesRepId
          };

          console.log('📋 Creating feedback report with data:', JSON.stringify(feedbackDataToSave, null, 2));
          const feedbackReport = this.feedbackReportRepository.create(feedbackDataToSave);
          console.log('📋 Feedback report entity created:', JSON.stringify(feedbackReport, null, 2));
          const savedFeedbackReport = await this.feedbackReportRepository.save(feedbackReport);
          console.log('✅ Feedback report saved successfully!');
          console.log('✅ Feedback report ID:', (savedFeedbackReport as any).id);
          console.log('✅ Feedback report comment:', (savedFeedbackReport as any).comment);
          console.log('✅ Feedback report created at:', (savedFeedbackReport as any).createdAt);
          console.log('📋 ===== FEEDBACK REPORT CREATION COMPLETE =====');
          return savedFeedbackReport;

        case 'PRODUCT_AVAILABILITY':
          console.log('📋 ===== PRODUCT AVAILABILITY REPORT CREATION =====');
          
          // Check if details is an array (multiple products) or object (single product)
          if (Array.isArray(details)) {
            console.log('📋 Processing multiple products:', details.length);
            
            // OPTIMIZATION: Batch create all ProductReport records
            const productReportsToCreate = details.map((productDetail, i) => {
              console.log(`📋 Processing product ${i + 1}:`, JSON.stringify(productDetail, null, 2));
              
              // Extract reportId from product detail and exclude it
              const { reportId: productReportId, ...productDetailsWithoutReportId } = productDetail;
              
              // Also exclude reportId from mainData if it exists
              const { reportId: mainProductReportId, ...mainDataWithoutReportId } = mainData || {};
              
              // Combine main data with product details
              const productDataToSave = {
                ...mainDataWithoutReportId,
                ...productDetailsWithoutReportId,
                userId: userId || salesRepId // Use userId if provided, otherwise use salesRepId
              };

              console.log(`📋 Creating product report ${i + 1} with data:`, JSON.stringify(productDataToSave, null, 2));
              return this.productReportRepository.create(productDataToSave);
            });
            
            // Batch save all product reports at once
            const savedProductReports = await this.productReportRepository.save(productReportsToCreate as any);
            console.log(`✅ All ${details.length} product reports saved in batch!`);
            
            console.log('📋 ===== MULTIPLE PRODUCT REPORTS CREATION COMPLETE =====');
            console.log(`✅ Total products saved: ${savedProductReports.length}`);
            
            // Return the first saved report for backward compatibility
            return savedProductReports[0];
          } else {
            // Single product report (existing logic)
            console.log('📋 Processing single product');
            
            // Extract reportId from details and exclude it to avoid duplicate key errors
            const { reportId: singleProductReportId, ...singleProductDetails } = details || {};
            
            // Also exclude reportId from mainData if it exists
            const { reportId: mainProductReportId, ...mainDataWithoutReportId } = mainData || {};
            
            // Combine main data with details and map userId/salesRepId properly
            const singleProductDataToSave = {
              ...mainDataWithoutReportId,
              ...singleProductDetails,
              userId: userId || salesRepId // Use userId if provided, otherwise use salesRepId
            };

            console.log('📋 Creating single product report with data:', JSON.stringify(singleProductDataToSave, null, 2));
            const singleProductReport = this.productReportRepository.create(singleProductDataToSave);
            console.log('📋 Single product report entity created:', JSON.stringify(singleProductReport, null, 2));
            const savedSingleProductReport = await this.productReportRepository.save(singleProductReport);
            console.log('✅ Single product report saved successfully!');
            console.log('✅ Product report ID:', (savedSingleProductReport as any).id);
            console.log('✅ Product name:', (savedSingleProductReport as any).productName);
            console.log('✅ Product quantity:', (savedSingleProductReport as any).quantity);
            console.log('✅ Product comment:', (savedSingleProductReport as any).comment);
            console.log('✅ Product report created at:', (savedSingleProductReport as any).createdAt);
            console.log('📋 ===== SINGLE PRODUCT REPORT CREATION COMPLETE =====');
            return savedSingleProductReport;
          }

        case 'VISIBILITY_ACTIVITY':
          console.log('📋 ===== VISIBILITY ACTIVITY REPORT CREATION =====');
          // Extract reportId from details and exclude it to avoid duplicate key errors
          const { reportId: visibilityReportId, ...visibilityDetails } = details || {};
          
          // Also exclude reportId from mainData if it exists
          const { reportId: mainReportId, ...mainDataWithoutReportId } = mainData || {};
          
          // Combine main data with details and map userId/salesRepId properly
          const visibilityDataToSave = {
            ...mainDataWithoutReportId,
            ...visibilityDetails,
            userId: userId || salesRepId // Use userId if provided, otherwise use salesRepId
          };

          console.log('📋 Creating visibility activity report with data:', JSON.stringify(visibilityDataToSave, null, 2));
          const visibilityReport = this.visibilityReportRepository.create(visibilityDataToSave);
          console.log('📋 Visibility report entity created:', JSON.stringify(visibilityReport, null, 2));
          const savedVisibilityReport = await this.visibilityReportRepository.save(visibilityReport);
          console.log('✅ Visibility activity report saved successfully!');
          console.log('✅ Visibility report ID:', (savedVisibilityReport as any).id);
          console.log('✅ Visibility comment:', (savedVisibilityReport as any).comment);
          console.log('✅ Visibility image URL:', (savedVisibilityReport as any).imageUrl);
          console.log('✅ Visibility report created at:', (savedVisibilityReport as any).createdAt);
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
    } catch (error) {
      console.error('❌ ===== REPORT SUBMISSION ERROR =====');
      console.error('❌ Error submitting report:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Original report data:', JSON.stringify(reportData, null, 2));
      
      // Handle database timeout errors specifically
      if (error.message && error.message.includes('ETIMEDOUT')) {
        console.error('❌ Database connection timeout detected');
        throw new Error('Database connection timeout. Please try again.');
      }
      
      // Handle other database connection errors
      if (error.message && (error.message.includes('ECONNRESET') || error.message.includes('ENOTFOUND'))) {
        console.error('❌ Database connection error detected');
        throw new Error('Database connection error. Please try again.');
      }
      
      throw new Error(`Failed to submit report: ${error.message}`);
    }
  }

  async getReportsByJourneyPlan(journeyPlanId: number): Promise<any> {
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
    } catch (error) {
      throw new Error(`Failed to get reports: ${error.message}`);
    }
  }

  async findAll(): Promise<any> {
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
    } catch (error) {
      throw new Error(`Failed to get all reports: ${error.message}`);
    }
  }
}
