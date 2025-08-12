import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile,
  Request,
  ParseIntPipe,
  Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('outlets')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':clientId/payments')
  async getClientPayments(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Request() req
  ) {
    this.logger.log(`🔍 GET /outlets/${clientId}/payments - Fetching payments for client ${clientId}`);
    this.logger.log(`👤 User ID: ${req.user.id}`);
    
    try {
      const payments = await this.paymentsService.findByClientId(clientId);
      this.logger.log(`✅ Found ${payments.length} payments for client ${clientId}`);
      
      // Transform to match Flutter app expectations
      const transformedPayments = payments.map(payment => ({
        id: payment.id,
        clientId: payment.clientId,
        userId: payment.salesrepId,
        amount: payment.amount,
        imageUrl: payment.invoicefileUrl,
        method: payment.payment_method,
        status: payment.status,
        date: payment.date,
      }));
      
      this.logger.log(`📊 Returning ${transformedPayments.length} transformed payments`);
      return transformedPayments;
    } catch (error) {
      this.logger.error(`❌ Error fetching payments for client ${clientId}:`, error);
      throw error;
    }
  }

  @Post(':clientId/payments')
  @UseInterceptors(FileInterceptor('image'))
  async uploadClientPayment(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Body() createPaymentDto: any,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    this.logger.log(`📤 POST /outlets/${clientId}/payments - Uploading payment for client ${clientId}`);
    this.logger.log(`👤 User ID: ${req.user.id}`);
    this.logger.log(`📊 Request body: ${JSON.stringify(createPaymentDto)}`);
    this.logger.log(`📁 File uploaded: ${file ? 'Yes' : 'No'}`);
    if (file) {
      this.logger.log(`📁 File details: ${file.originalname}, ${file.size} bytes`);
    }
    
    try {
      const userId = req.user.id;
      
      const paymentData: CreatePaymentDto = {
        clientId,
        amount: parseFloat(createPaymentDto.amount),
        payment_method: createPaymentDto.method,
        salesrepId: userId,
        status: 'PENDING',
      };

      this.logger.log(`💾 Creating payment with data: ${JSON.stringify(paymentData)}`);
      const payment = await this.paymentsService.create(paymentData, file);
      
      this.logger.log(`✅ Payment created successfully with ID: ${payment.id}`);
      
      // Return transformed data to match Flutter expectations
      const transformedPayment = {
        id: payment.id,
        clientId: payment.clientId,
        userId: payment.salesrepId,
        amount: payment.amount,
        imageUrl: payment.invoicefileUrl,
        method: payment.payment_method,
        status: payment.status,
        date: payment.date,
      };
      
      this.logger.log(`📊 Returning transformed payment: ${JSON.stringify(transformedPayment)}`);
      return transformedPayment;
    } catch (error) {
      this.logger.error(`❌ Error uploading payment for client ${clientId}:`, error);
      throw error;
    }
  }

  @Get('payments/salesrep/:salesrepId')
  async getSalesRepPayments(
    @Param('salesrepId', ParseIntPipe) salesrepId: number
  ) {
    this.logger.log(`🔍 GET /outlets/payments/salesrep/${salesrepId} - Fetching payments for sales rep ${salesrepId}`);
    
    try {
      const payments = await this.paymentsService.findBySalesRepId(salesrepId);
      this.logger.log(`✅ Found ${payments.length} payments for sales rep ${salesrepId}`);
      
      const transformedPayments = payments.map(payment => ({
        id: payment.id,
        clientId: payment.clientId,
        userId: payment.salesrepId,
        amount: payment.amount,
        imageUrl: payment.invoicefileUrl,
        method: payment.payment_method,
        status: payment.status,
        date: payment.date,
      }));
      
      this.logger.log(`📊 Returning ${transformedPayments.length} transformed payments`);
      return transformedPayments;
    } catch (error) {
      this.logger.error(`❌ Error fetching payments for sales rep ${salesrepId}:`, error);
      throw error;
    }
  }


} 