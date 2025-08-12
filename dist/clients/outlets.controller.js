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
var OutletsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutletsController = void 0;
const common_1 = require("@nestjs/common");
const clients_service_1 = require("./clients.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const outlet_quantity_service_1 = require("../outlet-quantity/outlet-quantity.service");
const client_assignment_service_1 = require("../client-assignment/client-assignment.service");
let OutletsController = OutletsController_1 = class OutletsController {
    constructor(clientsService, outletQuantityService, clientAssignmentService) {
        this.clientsService = clientsService;
        this.outletQuantityService = outletQuantityService;
        this.clientAssignmentService = clientAssignmentService;
        this.logger = new common_1.Logger(OutletsController_1.name);
    }
    async getOutlets(req) {
        const userRole = req.user.role;
        const salesRepId = req.user.id;
        const userCountryId = req.user.countryId;
        this.logger.log(`🔍 GET /outlets - User: ${salesRepId}, Role: ${userRole}, Country: ${userCountryId}`);
        try {
            let outlets;
            if (userRole === 'ADMIN' || userRole === 'RELIEVER') {
                outlets = await this.clientsService.findAllForAdmin(userCountryId);
            }
            else {
                outlets = await this.clientAssignmentService.getAssignedOutlets(salesRepId, userCountryId);
            }
            this.logger.log(`✅ Returning ${outlets.length} outlets`);
            return outlets;
        }
        catch (error) {
            this.logger.error(`❌ Error fetching outlets:`, error);
            throw error;
        }
    }
    async getOutlet(id, req) {
        const client = await this.clientsService.findOne(+id, req.user.countryId);
        if (!client) {
            return null;
        }
        if (client.latitude === null || client.longitude === null) {
            const fallbackCoordinates = this.getFallbackCoordinates(client.countryId || 1);
            console.log(`⚠️ Client ${client.id} has null coordinates, using fallback:`, fallbackCoordinates);
            client.latitude = fallbackCoordinates.latitude;
            client.longitude = fallbackCoordinates.longitude;
        }
        return {
            id: client.id,
            name: client.name,
            address: client.address,
            contact: client.contact,
            email: client.email,
            latitude: client.latitude,
            longitude: client.longitude,
            regionId: client.region_id,
            region: client.region,
            countryId: client.countryId,
            status: client.status,
            taxPin: client.tax_pin,
            location: client.location,
            clientType: client.client_type,
            outletAccount: client.outlet_account,
            balance: client.balance,
            createdAt: client.created_at,
        };
    }
    async createOutlet(body, req) {
        const createClientDto = {
            name: body.name,
            address: body.address,
            taxPin: body.tax_pin,
            email: body.email,
            contact: body.contact,
            latitude: body.latitude,
            longitude: body.longitude,
            location: body.location,
            clientType: body.client_type,
            regionId: body.region_id,
            region: body.region,
            routeId: body.route_id,
            routeName: body.route_name,
            routeIdUpdate: body.route_id_update,
            routeNameUpdate: body.route_name_update,
            balance: body.balance,
            outletAccount: body.outlet_account,
            countryId: body.country || req.user.countryId,
            addedBy: req.user.id,
        };
        const client = await this.clientsService.create(createClientDto, req.user.countryId);
        return {
            id: client.id,
            name: client.name,
            address: client.address,
            contact: client.contact,
            email: client.email,
            latitude: client.latitude,
            longitude: client.longitude,
            regionId: client.region_id,
            region: client.region,
            countryId: client.countryId,
            status: client.status,
            taxPin: client.tax_pin,
            location: client.location,
            clientType: client.client_type,
            outletAccount: client.outlet_account,
            balance: client.balance,
            createdAt: client.created_at,
        };
    }
    async updateOutlet(id, body, req) {
        const updateData = {
            name: body.name,
            address: body.address,
            taxPin: body.tax_pin,
            email: body.email,
            contact: body.contact,
            latitude: body.latitude,
            longitude: body.longitude,
            location: body.location,
            clientType: body.client_type,
            regionId: body.region_id,
            region: body.region,
            routeId: body.route_id,
            routeName: body.route_name,
            balance: body.balance,
            outletAccount: body.outlet_account,
        };
        const client = await this.clientsService.update(+id, updateData, req.user.countryId);
        return {
            id: client.id,
            name: client.name,
            address: client.address,
            contact: client.contact,
            email: client.email,
            latitude: client.latitude,
            longitude: client.longitude,
            regionId: client.region_id,
            region: client.region,
            countryId: client.countryId,
            status: client.status,
            taxPin: client.tax_pin,
            location: client.location,
            clientType: client.client_type,
            outletAccount: client.outlet_account,
            balance: client.balance,
            createdAt: client.created_at,
        };
    }
    async getOutletProducts(id, req) {
        this.logger.log(`🔍 GET /outlets/${id}/products - Fetching products for outlet ${id}`);
        try {
            const products = await this.outletQuantityService.findByOutletId(+id);
            this.logger.log(`✅ Found ${products.length} products for outlet ${id}`);
            const transformedProducts = products.map(item => ({
                id: item.id,
                clientId: item.clientId,
                productId: item.productId,
                quantity: item.quantity,
                createdAt: item.createdAt,
                product: item.product ? {
                    id: item.product.id,
                    name: item.product.productName,
                    description: item.product.description,
                    price: item.product.costPrice,
                    imageUrl: item.product.imageUrl,
                } : null,
            }));
            return transformedProducts;
        }
        catch (error) {
            this.logger.error(`❌ Error fetching outlet products:`, error);
            throw error;
        }
    }
    async assignOutlet(body, req) {
        this.logger.log(`📋 POST /outlets/assign - Assigning outlet ${body.outletId} to sales rep ${body.salesRepId}`);
        try {
            if (req.user.role !== 'ADMIN' && req.user.role !== 'RELIEVER') {
                throw new Error('Insufficient permissions to assign outlets');
            }
            const assignment = await this.clientAssignmentService.assignOutletToSalesRep(body.outletId, body.salesRepId);
            this.logger.log(`✅ Successfully assigned outlet ${body.outletId} to sales rep ${body.salesRepId}`);
            return {
                id: assignment.id,
                outletId: assignment.outletId,
                salesRepId: assignment.salesRepId,
                assignedAt: assignment.assignedAt,
                status: assignment.status,
                message: 'Outlet assigned successfully',
            };
        }
        catch (error) {
            this.logger.error(`❌ Error assigning outlet:`, error);
            throw error;
        }
    }
    async getOutletAssignment(id) {
        this.logger.log(`🔍 GET /outlets/${id}/assignment - Getting assignment for outlet ${id}`);
        try {
            const assignment = await this.clientAssignmentService.getOutletAssignment(+id);
            if (!assignment) {
                return { message: 'No active assignment found for this outlet' };
            }
            return {
                id: assignment.id,
                outletId: assignment.outletId,
                salesRepId: assignment.salesRepId,
                assignedAt: assignment.assignedAt,
                status: assignment.status,
                salesRep: assignment.salesRep ? {
                    id: assignment.salesRep.id,
                    name: assignment.salesRep.name,
                    email: assignment.salesRep.email,
                } : null,
            };
        }
        catch (error) {
            this.logger.error(`❌ Error getting outlet assignment:`, error);
            throw error;
        }
    }
    async getOutletAssignmentHistory(id) {
        this.logger.log(`🔍 GET /outlets/${id}/assignment-history - Getting assignment history for outlet ${id}`);
        try {
            const history = await this.clientAssignmentService.getAssignmentHistory(+id);
            return history.map(assignment => ({
                id: assignment.id,
                outletId: assignment.outletId,
                salesRepId: assignment.salesRepId,
                assignedAt: assignment.assignedAt,
                status: assignment.status,
                salesRep: assignment.salesRep ? {
                    id: assignment.salesRep.id,
                    name: assignment.salesRep.name,
                    email: assignment.salesRep.email,
                } : null,
            }));
        }
        catch (error) {
            this.logger.error(`❌ Error getting outlet assignment history:`, error);
            throw error;
        }
    }
    getFallbackCoordinates(countryId) {
        const countryCoordinates = {
            1: { latitude: -1.300897837533575, longitude: 36.777742335574864 },
            2: { latitude: -6.8235, longitude: 39.2695 },
            3: { latitude: 0.3476, longitude: 32.5825 },
            4: { latitude: -1.9441, longitude: 30.0619 },
            5: { latitude: -3.3731, longitude: 29.9189 },
        };
        return countryCoordinates[countryId] || countryCoordinates[1];
    }
};
exports.OutletsController = OutletsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OutletsController.prototype, "getOutlets", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OutletsController.prototype, "getOutlet", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OutletsController.prototype, "createOutlet", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OutletsController.prototype, "updateOutlet", null);
__decorate([
    (0, common_1.Get)(':id/products'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OutletsController.prototype, "getOutletProducts", null);
__decorate([
    (0, common_1.Post)('assign'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OutletsController.prototype, "assignOutlet", null);
__decorate([
    (0, common_1.Get)(':id/assignment'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OutletsController.prototype, "getOutletAssignment", null);
__decorate([
    (0, common_1.Get)(':id/assignment-history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OutletsController.prototype, "getOutletAssignmentHistory", null);
exports.OutletsController = OutletsController = OutletsController_1 = __decorate([
    (0, common_1.Controller)('outlets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [clients_service_1.ClientsService,
        outlet_quantity_service_1.OutletQuantityService,
        client_assignment_service_1.ClientAssignmentService])
], OutletsController);
//# sourceMappingURL=outlets.controller.js.map