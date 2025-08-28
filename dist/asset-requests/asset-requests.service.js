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
exports.AssetRequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_request_entity_1 = require("../entities/asset-request.entity");
const asset_request_item_entity_1 = require("../entities/asset-request-item.entity");
let AssetRequestsService = class AssetRequestsService {
    constructor(assetRequestRepository, assetRequestItemRepository) {
        this.assetRequestRepository = assetRequestRepository;
        this.assetRequestItemRepository = assetRequestItemRepository;
    }
    async create(createDto) {
        const requestNumber = await this.generateRequestNumber();
        const assetRequest = this.assetRequestRepository.create({
            requestNumber,
            salesRepId: createDto.salesRepId,
            notes: createDto.notes,
            status: 'pending',
        });
        const savedRequest = await this.assetRequestRepository.save(assetRequest);
        const items = createDto.items.map(item => this.assetRequestItemRepository.create({
            assetRequestId: savedRequest.id,
            assetName: item.assetName,
            assetType: item.assetType,
            quantity: item.quantity,
            notes: item.notes,
        }));
        await this.assetRequestItemRepository.save(items);
        return this.findOne(savedRequest.id);
    }
    async findAll() {
        return this.assetRequestRepository.find({
            relations: ['salesRep', 'approver', 'assigner', 'items'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByUser(userId) {
        return this.assetRequestRepository.find({
            where: { salesRepId: userId },
            relations: ['salesRep', 'approver', 'assigner', 'items'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByStatus(status) {
        return this.assetRequestRepository.find({
            where: { status },
            relations: ['salesRep', 'approver', 'assigner', 'items'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const assetRequest = await this.assetRequestRepository.findOne({
            where: { id },
            relations: ['salesRep', 'approver', 'assigner', 'items'],
        });
        if (!assetRequest) {
            throw new common_1.NotFoundException(`Asset request with ID ${id} not found`);
        }
        return assetRequest;
    }
    async update(id, updateDto) {
        const assetRequest = await this.findOne(id);
        if (updateDto.status === 'approved' && assetRequest.status === 'pending') {
            assetRequest.status = 'approved';
            assetRequest.approvedBy = updateDto.approvedBy;
            assetRequest.approvedAt = new Date();
        }
        else if (updateDto.status === 'rejected' && assetRequest.status === 'pending') {
            assetRequest.status = 'rejected';
            assetRequest.approvedBy = updateDto.approvedBy;
            assetRequest.approvedAt = new Date();
        }
        else if (updateDto.status === 'assigned' && assetRequest.status === 'approved') {
            assetRequest.status = 'assigned';
            assetRequest.assignedBy = updateDto.assignedBy;
            assetRequest.assignedAt = new Date();
        }
        else if (updateDto.status === 'returned' && assetRequest.status === 'assigned') {
            assetRequest.status = 'returned';
            assetRequest.returnDate = new Date();
        }
        else if (updateDto.status) {
            assetRequest.status = updateDto.status;
        }
        if (updateDto.notes !== undefined) {
            assetRequest.notes = updateDto.notes;
        }
        return this.assetRequestRepository.save(assetRequest);
    }
    async assignAssets(id, assignDto) {
        const assetRequest = await this.findOne(id);
        if (assetRequest.status !== 'approved') {
            throw new common_1.BadRequestException('Can only assign assets to approved requests');
        }
        for (const assignment of assignDto.assignments) {
            const item = assetRequest.items.find(item => item.id === assignment.itemId);
            if (!item) {
                throw new common_1.NotFoundException(`Item with ID ${assignment.itemId} not found`);
            }
            if (assignment.assignedQuantity > item.quantity) {
                throw new common_1.BadRequestException(`Cannot assign more than requested quantity for item ${item.assetName}`);
            }
            await this.assetRequestItemRepository.update(assignment.itemId, {
                assignedQuantity: assignment.assignedQuantity,
            });
        }
        assetRequest.status = 'assigned';
        assetRequest.assignedAt = new Date();
        return this.assetRequestRepository.save(assetRequest);
    }
    async returnAssets(id, returnDto) {
        const assetRequest = await this.findOne(id);
        if (assetRequest.status !== 'assigned') {
            throw new common_1.BadRequestException('Can only return assets from assigned requests');
        }
        for (const returnItem of returnDto.returns) {
            const item = assetRequest.items.find(item => item.id === returnItem.itemId);
            if (!item) {
                throw new common_1.NotFoundException(`Item with ID ${returnItem.itemId} not found`);
            }
            if (returnItem.returnedQuantity > item.assignedQuantity) {
                throw new common_1.BadRequestException(`Cannot return more than assigned quantity for item ${item.assetName}`);
            }
            await this.assetRequestItemRepository.update(returnItem.itemId, {
                returnedQuantity: returnItem.returnedQuantity,
            });
        }
        assetRequest.status = 'returned';
        assetRequest.returnDate = new Date();
        return this.assetRequestRepository.save(assetRequest);
    }
    async remove(id) {
        const assetRequest = await this.findOne(id);
        if (assetRequest.status !== 'pending') {
            throw new common_1.BadRequestException('Can only delete pending requests');
        }
        await this.assetRequestRepository.remove(assetRequest);
    }
    async getAssetTypes() {
        return [
            'Display Stand',
            'Banner',
            'Poster',
            'Brochure',
            'Sample Kit',
            'Merchandising Material',
            'Equipment',
            'Other'
        ];
    }
    async generateRequestNumber() {
        const today = new Date();
        const dateStr = today.getFullYear().toString() +
            (today.getMonth() + 1).toString().padStart(2, '0') +
            today.getDate().toString().padStart(2, '0');
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const count = await this.assetRequestRepository
            .createQueryBuilder('assetRequest')
            .where('assetRequest.createdAt >= :startOfDay', { startOfDay })
            .andWhere('assetRequest.createdAt < :endOfDay', { endOfDay })
            .getCount();
        const sequence = (count + 1).toString().padStart(3, '0');
        return `AR-${dateStr}-${sequence}`;
    }
};
exports.AssetRequestsService = AssetRequestsService;
exports.AssetRequestsService = AssetRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_request_entity_1.AssetRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(asset_request_item_entity_1.AssetRequestItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AssetRequestsService);
//# sourceMappingURL=asset-requests.service.js.map