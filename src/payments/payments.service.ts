import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesClientPayment } from '../entities/sales-client-payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(SalesClientPayment)
    private paymentsRepository: Repository<SalesClientPayment>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, file?: Express.Multer.File): Promise<SalesClientPayment> {
    this.logger.log(`💾 Creating payment with data: ${JSON.stringify(createPaymentDto)}`);
    this.logger.log(`📁 File provided: ${file ? 'Yes' : 'No'}`);
    
    try {
      const payment = this.paymentsRepository.create({
        ...createPaymentDto,
        date: new Date(),
        status: createPaymentDto.status || 'PENDING',
      });

      this.logger.log(`📝 Payment entity created: ${JSON.stringify(payment)}`);

      // Upload file to Cloudinary if provided
      if (file) {
        this.logger.log(`📤 Uploading file to Cloudinary: ${file.originalname}`);
        
        try {
          const cloudinaryResult = await this.cloudinaryService.uploadFile(file);
          payment.invoicefileUrl = cloudinaryResult.secure_url;
          this.logger.log(`✅ File uploaded successfully to Cloudinary: ${cloudinaryResult.secure_url}`);
        } catch (uploadError) {
          this.logger.error(`❌ File upload failed: ${uploadError.message}`);
          throw uploadError;
        }
      }

      const savedPayment = await this.paymentsRepository.save(payment);
      this.logger.log(`✅ Payment saved successfully with ID: ${savedPayment.id}`);
      
      return savedPayment;
    } catch (error) {
      this.logger.error(`❌ Error creating payment:`, error);
      throw error;
    }
  }

  async findByClientId(clientId: number): Promise<SalesClientPayment[]> {
    this.logger.log(`🔍 Finding payments for client ID: ${clientId}`);
    
    try {
      const payments = await this.paymentsRepository.find({
        where: { clientId },
        order: { date: 'DESC' },
      });
      
      this.logger.log(`✅ Found ${payments.length} payments for client ${clientId}`);
      return payments;
    } catch (error) {
      this.logger.error(`❌ Error finding payments for client ${clientId}:`, error);
      throw error;
    }
  }

  async findOne(id: number): Promise<SalesClientPayment> {
    this.logger.log(`🔍 Finding payment with ID: ${id}`);
    
    try {
      const payment = await this.paymentsRepository.findOne({ where: { id } });
      if (!payment) {
        this.logger.warn(`⚠️ Payment with ID ${id} not found`);
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }
      
      this.logger.log(`✅ Payment found: ${JSON.stringify(payment)}`);
      return payment;
    } catch (error) {
      this.logger.error(`❌ Error finding payment ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, updatePaymentDto: Partial<CreatePaymentDto>): Promise<SalesClientPayment> {
    this.logger.log(`📝 Updating payment with ID: ${id}`);
    this.logger.log(`📊 Update data: ${JSON.stringify(updatePaymentDto)}`);
    
    try {
      const payment = await this.findOne(id);
      Object.assign(payment, updatePaymentDto);
      const updatedPayment = await this.paymentsRepository.save(payment);
      
      this.logger.log(`✅ Payment updated successfully: ${JSON.stringify(updatedPayment)}`);
      return updatedPayment;
    } catch (error) {
      this.logger.error(`❌ Error updating payment ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`🗑️ Removing payment with ID: ${id}`);
    
    try {
      const payment = await this.findOne(id);
      await this.paymentsRepository.remove(payment);
      this.logger.log(`✅ Payment removed successfully`);
    } catch (error) {
      this.logger.error(`❌ Error removing payment ${id}:`, error);
      throw error;
    }
  }

  async findBySalesRepId(salesrepId: number): Promise<SalesClientPayment[]> {
    this.logger.log(`🔍 Finding payments for sales rep ID: ${salesrepId}`);
    
    try {
      const payments = await this.paymentsRepository.find({
        where: { salesrepId },
        order: { date: 'DESC' },
      });
      
      this.logger.log(`✅ Found ${payments.length} payments for sales rep ${salesrepId}`);
      return payments;
    } catch (error) {
      this.logger.error(`❌ Error finding payments for sales rep ${salesrepId}:`, error);
      throw error;
    }
  }


} 