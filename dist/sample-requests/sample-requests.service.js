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
exports.SampleRequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sample_request_entity_1 = require("../entities/sample-request.entity");
const sample_request_item_entity_1 = require("../entities/sample-request-item.entity");
let SampleRequestsService = class SampleRequestsService {
    constructor(sampleRequestRepository, sampleRequestItemRepository, dataSource) {
        this.sampleRequestRepository = sampleRequestRepository;
        this.sampleRequestItemRepository = sampleRequestItemRepository;
        this.dataSource = dataSource;
    }
    async create(createDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const requestNumber = await this.generateRequestNumber();
            const sampleRequest = this.sampleRequestRepository.create({
                clientId: createDto.clientId,
                userId: createDto.userId,
                requestNumber,
                requestDate: new Date(),
                status: 'pending',
                notes: createDto.notes || '',
            });
            const savedRequest = await queryRunner.manager.save(sampleRequest);
            const items = createDto.items.map(item => this.sampleRequestItemRepository.create({
                sampleRequestId: savedRequest.id,
                productId: item.productId,
                quantity: item.quantity,
                notes: item.notes || '',
            }));
            await queryRunner.manager.save(sample_request_item_entity_1.SampleRequestItem, items);
            await queryRunner.commitTransaction();
            return this.findOne(savedRequest.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        return this.sampleRequestRepository.find({
            relations: ['client', 'user', 'sampleRequestItems', 'sampleRequestItems.product'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const sampleRequest = await this.sampleRequestRepository.findOne({
            where: { id },
            relations: ['client', 'user', 'sampleRequestItems', 'sampleRequestItems.product'],
        });
        if (!sampleRequest) {
            throw new common_1.NotFoundException(`Sample request with ID ${id} not found`);
        }
        return sampleRequest;
    }
    async update(id, updateDto) {
        const sampleRequest = await this.findOne(id);
        if (updateDto.status) {
            sampleRequest.status = updateDto.status;
            if (updateDto.status === 'approved' && updateDto.approvedBy) {
                sampleRequest.approvedBy = updateDto.approvedBy;
                sampleRequest.approvedAt = new Date();
            }
        }
        if (updateDto.notes !== undefined) {
            sampleRequest.notes = updateDto.notes;
        }
        await this.sampleRequestRepository.save(sampleRequest);
        return this.findOne(id);
    }
    async remove(id) {
        const sampleRequest = await this.findOne(id);
        await this.sampleRequestRepository.remove(sampleRequest);
    }
    async findByClient(clientId) {
        return this.sampleRequestRepository.find({
            where: { clientId },
            relations: ['client', 'user', 'sampleRequestItems', 'sampleRequestItems.product'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByUser(userId) {
        return this.sampleRequestRepository.find({
            where: { userId },
            relations: ['client', 'user', 'sampleRequestItems', 'sampleRequestItems.product'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByStatus(status) {
        return this.sampleRequestRepository.find({
            where: { status },
            relations: ['client', 'user', 'sampleRequestItems', 'sampleRequestItems.product'],
            order: { createdAt: 'DESC' },
        });
    }
    async generateRequestNumber() {
        const today = new Date();
        const dateStr = today.getFullYear().toString() +
            (today.getMonth() + 1).toString().padStart(2, '0') +
            today.getDate().toString().padStart(2, '0');
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const count = await this.sampleRequestRepository
            .createQueryBuilder('sr')
            .where('sr.createdAt >= :startOfDay', { startOfDay })
            .andWhere('sr.createdAt < :endOfDay', { endOfDay })
            .getCount();
        const sequence = (count + 1).toString().padStart(3, '0');
        return `SR-${dateStr}-${sequence}`;
    }
};
exports.SampleRequestsService = SampleRequestsService;
exports.SampleRequestsService = SampleRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sample_request_entity_1.SampleRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(sample_request_item_entity_1.SampleRequestItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], SampleRequestsService);
//# sourceMappingURL=sample-requests.service.js.map