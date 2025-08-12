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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const clients_entity_1 = require("../entities/clients.entity");
const client_assignment_service_1 = require("../client-assignment/client-assignment.service");
let ClientsService = class ClientsService {
    constructor(clientRepository, clientAssignmentService) {
        this.clientRepository = clientRepository;
        this.clientAssignmentService = clientAssignmentService;
    }
    async create(createClientDto, userCountryId) {
        const clientData = {
            ...createClientDto,
            countryId: userCountryId,
            status: 1,
        };
        const client = this.clientRepository.create(clientData);
        return this.clientRepository.save(client);
    }
    async findAll(userCountryId, userRole, userId) {
        console.log(`🔍 ClientsService.findAll - Looking for clients with countryId: ${userCountryId}, role: ${userRole}, userId: ${userId}`);
        const baseConditions = {
            status: 1,
            countryId: userCountryId,
        };
        if (userRole === 'SALES_REP') {
            console.log(`👤 User is SALES_REP - checking assigned clients for userId: ${userId}`);
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
            if (assignedClientIds.length === 0) {
                console.log(`❌ No assigned clients found for SALES_REP ${userId}`);
                return [];
            }
            baseConditions.id = (0, typeorm_2.In)(assignedClientIds);
            console.log(`✅ SALES_REP ${userId} has ${assignedClientIds.length} assigned clients`);
        }
        else if (userRole === 'RELIEVER') {
            console.log(`👤 User is RELIEVER - checking if they have assignments for userId: ${userId}`);
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            if (assignedOutlets.length > 0) {
                const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
                baseConditions.id = (0, typeorm_2.In)(assignedClientIds);
                console.log(`✅ RELIEVER ${userId} has assignments - showing ${assignedClientIds.length} assigned clients`);
            }
            else {
                console.log(`✅ RELIEVER ${userId} has no assignments - showing all clients in country`);
            }
        }
        else {
            console.log(`⚠️ Unknown role: ${userRole} - showing all clients`);
        }
        const clients = await this.clientRepository.find({
            where: baseConditions,
            select: [
                'id',
                'name',
                'contact',
                'region',
                'region_id',
                'status',
                'countryId'
            ],
            order: { name: 'ASC' },
        });
        console.log(`✅ Found ${clients.length} clients for user (role: ${userRole}, userId: ${userId})`);
        return clients;
    }
    async findAllForAdmin(userCountryId) {
        console.log(`🔍 ClientsService.findAllForAdmin - Looking for all clients with countryId: ${userCountryId}`);
        const clients = await this.clientRepository.find({
            where: {
                countryId: userCountryId,
            },
            select: [
                'id',
                'name',
                'contact',
                'region',
                'region_id',
                'status',
                'countryId'
            ],
            order: { name: 'ASC' },
        });
        console.log(`✅ Found ${clients.length} clients for country ${userCountryId} (all statuses)`);
        return clients;
    }
    async findOne(id, userCountryId, userRole, userId) {
        const baseConditions = {
            id,
            status: 1,
            countryId: userCountryId,
        };
        if (userRole === 'SALES_REP') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
            if (!assignedClientIds.includes(id)) {
                console.log(`❌ SALES_REP ${userId} not authorized to access client ${id}`);
                return null;
            }
        }
        else if (userRole === 'RELIEVER') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            if (assignedOutlets.length > 0) {
                const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
                if (!assignedClientIds.includes(id)) {
                    console.log(`❌ RELIEVER ${userId} not authorized to access client ${id} (has assignments)`);
                    return null;
                }
            }
        }
        return this.clientRepository.findOne({
            where: baseConditions,
        });
    }
    async findOneBasic(id, userCountryId, userRole, userId) {
        const baseConditions = {
            id,
            status: 1,
            countryId: userCountryId,
        };
        if (userRole === 'SALES_REP') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
            if (!assignedClientIds.includes(id)) {
                console.log(`❌ SALES_REP ${userId} not authorized to access client ${id}`);
                return null;
            }
        }
        else if (userRole === 'RELIEVER') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            if (assignedOutlets.length > 0) {
                const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
                if (!assignedClientIds.includes(id)) {
                    console.log(`❌ RELIEVER ${userId} not authorized to access client ${id} (has assignments)`);
                    return null;
                }
            }
        }
        return this.clientRepository.findOne({
            where: baseConditions,
            select: [
                'id',
                'name',
                'contact',
                'region',
                'region_id',
                'status',
                'countryId'
            ],
        });
    }
    async update(id, updateClientDto, userCountryId) {
        const existingClient = await this.findOne(id, userCountryId);
        if (!existingClient) {
            return null;
        }
        await this.clientRepository.update(id, updateClientDto);
        return this.findOne(id, userCountryId);
    }
    async search(searchDto, userCountryId, userRole, userId) {
        const { query, regionId, routeId, status } = searchDto;
        const whereConditions = {
            countryId: userCountryId,
        };
        if (regionId)
            whereConditions.region_id = regionId;
        if (routeId)
            whereConditions.route_id = routeId;
        if (status !== undefined)
            whereConditions.status = status;
        const queryBuilder = this.clientRepository.createQueryBuilder('client');
        Object.keys(whereConditions).forEach(key => {
            queryBuilder.andWhere(`client.${key} = :${key}`, { [key]: whereConditions[key] });
        });
        if (userRole === 'SALES_REP') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
            if (assignedClientIds.length === 0) {
                return [];
            }
            queryBuilder.andWhere('client.id IN (:...assignedIds)', { assignedIds: assignedClientIds });
        }
        else if (userRole === 'RELIEVER') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            if (assignedOutlets.length > 0) {
                const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
                queryBuilder.andWhere('client.id IN (:...assignedIds)', { assignedIds: assignedClientIds });
            }
        }
        if (query) {
            queryBuilder.andWhere('(client.name LIKE :query OR client.contact LIKE :query OR client.email LIKE :query OR client.address LIKE :query)', { query: `%${query}%` });
        }
        return queryBuilder
            .select([
            'client.id',
            'client.name',
            'client.contact',
            'client.region',
            'client.region_id',
            'client.status',
            'client.countryId'
        ])
            .orderBy('client.name', 'ASC')
            .getMany();
    }
    async findByCountry(countryId, userCountryId, userRole, userId) {
        if (countryId !== userCountryId) {
            return [];
        }
        const baseConditions = {
            countryId,
            status: 1
        };
        if (userRole === 'SALES_REP') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
            if (assignedClientIds.length === 0) {
                return [];
            }
            baseConditions.id = (0, typeorm_2.In)(assignedClientIds);
        }
        else if (userRole === 'RELIEVER') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            if (assignedOutlets.length > 0) {
                const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
                baseConditions.id = (0, typeorm_2.In)(assignedClientIds);
            }
        }
        return this.clientRepository.find({
            where: baseConditions,
            select: [
                'id',
                'name',
                'contact',
                'region',
                'region_id',
                'status',
                'countryId'
            ],
            order: { name: 'ASC' },
        });
    }
    async findByRegion(regionId, userCountryId, userRole, userId) {
        const baseConditions = {
            region_id: regionId,
            status: 1,
            countryId: userCountryId,
        };
        if (userRole === 'SALES_REP') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
            if (assignedClientIds.length === 0) {
                return [];
            }
            baseConditions.id = (0, typeorm_2.In)(assignedClientIds);
        }
        else if (userRole === 'RELIEVER') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            if (assignedOutlets.length > 0) {
                const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
                baseConditions.id = (0, typeorm_2.In)(assignedClientIds);
            }
        }
        return this.clientRepository.find({
            where: baseConditions,
            select: [
                'id',
                'name',
                'contact',
                'region',
                'region_id',
                'status',
                'countryId'
            ],
            order: { name: 'ASC' },
        });
    }
    async findByRoute(routeId, userCountryId, userRole, userId) {
        const baseConditions = {
            route_id: routeId,
            status: 1,
            countryId: userCountryId,
        };
        if (userRole === 'SALES_REP') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
            if (assignedClientIds.length === 0) {
                return [];
            }
            baseConditions.id = (0, typeorm_2.In)(assignedClientIds);
        }
        else if (userRole === 'RELIEVER') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            if (assignedOutlets.length > 0) {
                const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
                baseConditions.id = (0, typeorm_2.In)(assignedClientIds);
            }
        }
        return this.clientRepository.find({
            where: baseConditions,
            select: [
                'id',
                'name',
                'contact',
                'region',
                'region_id',
                'status',
                'countryId'
            ],
            order: { name: 'ASC' },
        });
    }
    async findByLocation(latitude, longitude, radius = 10, userCountryId, userRole, userId) {
        let assignedClientIds = [];
        if (userRole === 'SALES_REP') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            assignedClientIds = assignedOutlets.map(outlet => outlet.id);
            if (assignedClientIds.length === 0) {
                return [];
            }
        }
        else if (userRole === 'RELIEVER') {
            const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId, userCountryId);
            if (assignedOutlets.length > 0) {
                assignedClientIds = assignedOutlets.map(outlet => outlet.id);
            }
        }
        let query = `
      SELECT *, 
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
      FROM Clients 
      WHERE status = 1 AND countryId = ?
    `;
        const queryParams = [latitude, longitude, latitude, userCountryId];
        if (assignedClientIds.length > 0) {
            query += ` AND id IN (${assignedClientIds.map(() => '?').join(',')})`;
            queryParams.push(...assignedClientIds);
        }
        query += ` HAVING distance <= ? ORDER BY distance`;
        queryParams.push(radius);
        return this.clientRepository.query(query, queryParams);
    }
    async getClientStats(userCountryId, regionId) {
        const queryBuilder = this.clientRepository.createQueryBuilder('client');
        queryBuilder.where('client.countryId = :countryId', { countryId: userCountryId });
        if (regionId) {
            queryBuilder.andWhere('client.region_id = :regionId', { regionId });
        }
        const total = await queryBuilder.getCount();
        const active = await queryBuilder.where('client.status = 1').getCount();
        const inactive = await queryBuilder.where('client.status = 0').getCount();
        return {
            total,
            active,
            inactive,
            activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
        };
    }
    async findPendingClients(userCountryId) {
        return this.clientRepository.find({
            where: {
                status: 0,
                countryId: userCountryId,
            },
            select: [
                'id',
                'name',
                'contact',
                'region',
                'region_id',
                'status',
                'countryId',
                'email',
                'address',
                'created_at',
                'added_by'
            ],
            order: { created_at: 'DESC' },
        });
    }
    async approveClient(id, userCountryId) {
        const existingClient = await this.clientRepository.findOne({
            where: {
                id,
                status: 0,
                countryId: userCountryId,
            },
        });
        if (!existingClient) {
            return null;
        }
        await this.clientRepository.update(id, { status: 1 });
        return this.findOne(id, userCountryId);
    }
    async rejectClient(id, userCountryId) {
        const existingClient = await this.findOne(id, userCountryId);
        if (!existingClient) {
            return false;
        }
        await this.clientRepository.update(id, { status: 0 });
        return true;
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(clients_entity_1.Clients)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        client_assignment_service_1.ClientAssignmentService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map