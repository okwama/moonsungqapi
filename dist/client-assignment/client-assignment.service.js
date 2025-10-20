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
var ClientAssignmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAssignmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_assignment_entity_1 = require("../entities/client-assignment.entity");
const clients_entity_1 = require("../entities/clients.entity");
const client_assignment_cache_service_1 = require("./client-assignment-cache.service");
let ClientAssignmentService = ClientAssignmentService_1 = class ClientAssignmentService {
    constructor(clientAssignmentRepository, clientsRepository, cacheService) {
        this.clientAssignmentRepository = clientAssignmentRepository;
        this.clientsRepository = clientsRepository;
        this.cacheService = cacheService;
        this.logger = new common_1.Logger(ClientAssignmentService_1.name);
    }
    async assignOutletToSalesRep(outletId, salesRepId) {
        this.logger.log(`📋 Assigning outlet ${outletId} to sales rep ${salesRepId}`);
        try {
            const outlet = await this.clientsRepository.findOne({ where: { id: outletId } });
            if (!outlet) {
                throw new Error('Outlet not found');
            }
            await this.clientAssignmentRepository.update({ outletId, status: 'active' }, { status: 'inactive' });
            const assignment = this.clientAssignmentRepository.create({
                outletId,
                salesRepId,
                status: 'active',
                assignedAt: new Date(),
            });
            const savedAssignment = await this.clientAssignmentRepository.save(assignment);
            this.logger.log(`✅ Successfully assigned outlet ${outletId} to sales rep ${salesRepId}`);
            this.cacheService.invalidate(`assignments:${salesRepId}:*`);
            return savedAssignment;
        }
        catch (error) {
            this.logger.error(`❌ Error assigning outlet:`, error);
            throw error;
        }
    }
    async getAssignedOutlets(salesRepId, userCountryId) {
        this.logger.log(`🔍 Getting assigned outlets for sales rep ${salesRepId}`);
        const cacheKey = `assignments:${salesRepId}:${userCountryId}`;
        return this.cacheService.getOrSet(cacheKey, async () => {
            try {
                const assignments = await this.clientAssignmentRepository.find({
                    where: { salesRepId, status: 'active' },
                    relations: ['outlet'],
                });
                this.logger.log(`📊 Found ${assignments.length} active assignments for sales rep ${salesRepId}`);
                const assignedOutlets = assignments
                    .map(assignment => assignment.outlet)
                    .filter(outlet => outlet.countryId === userCountryId)
                    .map(outlet => ({
                    id: outlet.id,
                    name: outlet.name,
                    balance: outlet.balance ?? 0,
                    address: outlet.address,
                    latitude: outlet.latitude,
                    longitude: outlet.longitude,
                    contact: outlet.contact,
                    email: outlet.email,
                    regionId: outlet.region_id,
                    region: outlet.region,
                    countryId: outlet.countryId,
                    status: outlet.status,
                    taxPin: outlet.tax_pin,
                    location: outlet.location,
                    clientType: outlet.client_type,
                    outletAccount: outlet.outlet_account,
                    createdAt: outlet.created_at,
                }));
                this.logger.log(`✅ Found ${assignedOutlets.length} assigned outlets for sales rep ${salesRepId} in country ${userCountryId} (cached for 5 min)`);
                return assignedOutlets;
            }
            catch (error) {
                this.logger.error(`❌ Error getting assigned outlets:`, error);
                throw error;
            }
        });
    }
    async getOutletAssignment(outletId) {
        return this.clientAssignmentRepository.findOne({
            where: { outletId, status: 'active' },
            relations: ['salesRep'],
        });
    }
    async deactivateAssignment(outletId) {
        await this.clientAssignmentRepository.update({ outletId, status: 'active' }, { status: 'inactive' });
        this.cacheService.clearAll();
    }
    async getAssignmentHistory(outletId) {
        return this.clientAssignmentRepository.find({
            where: { outletId },
            relations: ['salesRep'],
            order: { assignedAt: 'DESC' },
        });
    }
    async getSalesRepAssignments(salesRepId) {
        return this.clientAssignmentRepository.find({
            where: { salesRepId, status: 'active' },
            relations: ['outlet'],
        });
    }
};
exports.ClientAssignmentService = ClientAssignmentService;
exports.ClientAssignmentService = ClientAssignmentService = ClientAssignmentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_assignment_entity_1.ClientAssignment)),
    __param(1, (0, typeorm_1.InjectRepository)(clients_entity_1.Clients)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        client_assignment_cache_service_1.ClientAssignmentCacheService])
], ClientAssignmentService);
//# sourceMappingURL=client-assignment.service.js.map