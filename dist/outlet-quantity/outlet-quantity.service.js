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
var OutletQuantityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutletQuantityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const outlet_quantity_entity_1 = require("../entities/outlet-quantity.entity");
let OutletQuantityService = OutletQuantityService_1 = class OutletQuantityService {
    constructor(outletQuantityRepository) {
        this.outletQuantityRepository = outletQuantityRepository;
        this.logger = new common_1.Logger(OutletQuantityService_1.name);
    }
    async findByOutletId(outletId) {
        this.logger.log(`🔍 Finding products for outlet ${outletId}`);
        return this.outletQuantityRepository.find({
            where: { clientId: outletId },
            relations: ['product'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByOutletAndProduct(outletId, productId) {
        return this.outletQuantityRepository.findOne({
            where: { clientId: outletId, productId },
            relations: ['product'],
        });
    }
    async updateQuantity(outletId, productId, quantity) {
        const existing = await this.findByOutletAndProduct(outletId, productId);
        if (existing) {
            existing.quantity = quantity;
            return this.outletQuantityRepository.save(existing);
        }
        else {
            const newQuantity = this.outletQuantityRepository.create({
                clientId: outletId,
                productId,
                quantity,
            });
            return this.outletQuantityRepository.save(newQuantity);
        }
    }
    async decrementQuantity(outletId, productId, amount) {
        const existing = await this.findByOutletAndProduct(outletId, productId);
        if (existing && existing.quantity >= amount) {
            existing.quantity -= amount;
            return this.outletQuantityRepository.save(existing);
        }
        throw new Error('Insufficient quantity at outlet');
    }
    async create(outletId, productId, quantity) {
        const newQuantity = this.outletQuantityRepository.create({
            clientId: outletId,
            productId,
            quantity,
        });
        return this.outletQuantityRepository.save(newQuantity);
    }
};
exports.OutletQuantityService = OutletQuantityService;
exports.OutletQuantityService = OutletQuantityService = OutletQuantityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(outlet_quantity_entity_1.OutletQuantity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OutletQuantityService);
//# sourceMappingURL=outlet-quantity.service.js.map