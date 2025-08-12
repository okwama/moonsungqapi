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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sales_client_payment_entity_1 = require("../entities/sales-client-payment.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(paymentsRepository, cloudinaryService) {
        this.paymentsRepository = paymentsRepository;
        this.cloudinaryService = cloudinaryService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async create(createPaymentDto, file) {
        this.logger.log(`💾 Creating payment with data: ${JSON.stringify(createPaymentDto)}`);
        this.logger.log(`📁 File provided: ${file ? 'Yes' : 'No'}`);
        try {
            const payment = this.paymentsRepository.create({
                ...createPaymentDto,
                date: new Date(),
                status: createPaymentDto.status || 'PENDING',
            });
            this.logger.log(`📝 Payment entity created: ${JSON.stringify(payment)}`);
            if (file) {
                this.logger.log(`📤 Uploading file to Cloudinary: ${file.originalname}`);
                try {
                    const cloudinaryResult = await this.cloudinaryService.uploadFile(file);
                    payment.invoicefileUrl = cloudinaryResult.secure_url;
                    this.logger.log(`✅ File uploaded successfully to Cloudinary: ${cloudinaryResult.secure_url}`);
                }
                catch (uploadError) {
                    this.logger.error(`❌ File upload failed: ${uploadError.message}`);
                    throw uploadError;
                }
            }
            const savedPayment = await this.paymentsRepository.save(payment);
            this.logger.log(`✅ Payment saved successfully with ID: ${savedPayment.id}`);
            return savedPayment;
        }
        catch (error) {
            this.logger.error(`❌ Error creating payment:`, error);
            throw error;
        }
    }
    async findByClientId(clientId) {
        this.logger.log(`🔍 Finding payments for client ID: ${clientId}`);
        try {
            const payments = await this.paymentsRepository.find({
                where: { clientId },
                order: { date: 'DESC' },
            });
            this.logger.log(`✅ Found ${payments.length} payments for client ${clientId}`);
            return payments;
        }
        catch (error) {
            this.logger.error(`❌ Error finding payments for client ${clientId}:`, error);
            throw error;
        }
    }
    async findOne(id) {
        this.logger.log(`🔍 Finding payment with ID: ${id}`);
        try {
            const payment = await this.paymentsRepository.findOne({ where: { id } });
            if (!payment) {
                this.logger.warn(`⚠️ Payment with ID ${id} not found`);
                throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
            }
            this.logger.log(`✅ Payment found: ${JSON.stringify(payment)}`);
            return payment;
        }
        catch (error) {
            this.logger.error(`❌ Error finding payment ${id}:`, error);
            throw error;
        }
    }
    async update(id, updatePaymentDto) {
        this.logger.log(`📝 Updating payment with ID: ${id}`);
        this.logger.log(`📊 Update data: ${JSON.stringify(updatePaymentDto)}`);
        try {
            const payment = await this.findOne(id);
            Object.assign(payment, updatePaymentDto);
            const updatedPayment = await this.paymentsRepository.save(payment);
            this.logger.log(`✅ Payment updated successfully: ${JSON.stringify(updatedPayment)}`);
            return updatedPayment;
        }
        catch (error) {
            this.logger.error(`❌ Error updating payment ${id}:`, error);
            throw error;
        }
    }
    async remove(id) {
        this.logger.log(`🗑️ Removing payment with ID: ${id}`);
        try {
            const payment = await this.findOne(id);
            await this.paymentsRepository.remove(payment);
            this.logger.log(`✅ Payment removed successfully`);
        }
        catch (error) {
            this.logger.error(`❌ Error removing payment ${id}:`, error);
            throw error;
        }
    }
    async findBySalesRepId(salesrepId) {
        this.logger.log(`🔍 Finding payments for sales rep ID: ${salesrepId}`);
        try {
            const payments = await this.paymentsRepository.find({
                where: { salesrepId },
                order: { date: 'DESC' },
            });
            this.logger.log(`✅ Found ${payments.length} payments for sales rep ${salesrepId}`);
            return payments;
        }
        catch (error) {
            this.logger.error(`❌ Error finding payments for sales rep ${salesrepId}:`, error);
            throw error;
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sales_client_payment_entity_1.SalesClientPayment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map