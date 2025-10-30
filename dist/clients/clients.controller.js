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
exports.ClientsController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const clients_service_1 = require("./clients.service");
const create_client_dto_1 = require("./dto/create-client.dto");
const search_clients_dto_1 = require("./dto/search-clients.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ClientsController = class ClientsController {
    constructor(clientsService) {
        this.clientsService = clientsService;
    }
    async create(createClientDto, req) {
        const userCountryId = req.user.countryId;
        return this.clientsService.create(createClientDto, userCountryId);
    }
    async findAll(req, page, limit) {
        const userCountryId = req.user.countryId;
        const userRole = req.user.role;
        const userId = req.user.id;
        const pageNum = page ? Math.max(1, parseInt(page)) : 1;
        const limitNum = limit ? Math.min(100, Math.max(1, parseInt(limit))) : 50;
        return this.clientsService.findAll(userCountryId, userRole, userId, pageNum, limitNum);
    }
    async findAllBasic(req) {
        const userCountryId = req.user.countryId;
        const userRole = req.user.role;
        const userId = req.user.id;
        return this.clientsService.findAll(userCountryId, userRole, userId);
    }
    async search(searchDto, req) {
        const userCountryId = req.user.countryId;
        const userRole = req.user.role;
        const userId = req.user.id;
        return this.clientsService.search(searchDto, userCountryId, userRole, userId);
    }
    async searchBasic(searchDto, req) {
        const userCountryId = req.user.countryId;
        const userRole = req.user.role;
        const userId = req.user.id;
        return this.clientsService.search(searchDto, userCountryId, userRole, userId);
    }
    async findOne(id, req) {
        const userCountryId = req.user.countryId;
        const userRole = req.user.role;
        const userId = req.user.id;
        return this.clientsService.findOne(+id, userCountryId, userRole, userId);
    }
    async findOneBasic(id, req) {
        const userCountryId = req.user.countryId;
        const userRole = req.user.role;
        const userId = req.user.id;
        return this.clientsService.findOneBasic(+id, userCountryId, userRole, userId);
    }
    async update(id, updateClientDto, req) {
        const userCountryId = req.user.countryId;
        return this.clientsService.update(+id, updateClientDto, userCountryId);
    }
    async findByCountry(countryId, req) {
        const userCountryId = req.user.countryId;
        const userRole = req.user.role;
        const userId = req.user.id;
        return this.clientsService.findByCountry(+countryId, userCountryId, userRole, userId);
    }
    async findByRegion(regionId, req) {
        const userCountryId = req.user.countryId;
        const userRole = req.user.role;
        const userId = req.user.id;
        return this.clientsService.findByRegion(+regionId, userCountryId, userRole, userId);
    }
    async findByRoute(routeId, req) {
        const userCountryId = req.user.countryId;
        const userRole = req.user.role;
        const userId = req.user.id;
        return this.clientsService.findByRoute(+routeId, userCountryId, userRole, userId);
    }
    async findByLocation(latitude, longitude, radius, req) {
        const userCountryId = req.user.countryId;
        const userRole = req.user.role;
        const userId = req.user.id;
        return this.clientsService.findByLocation(+latitude, +longitude, radius ? +radius : 10, userCountryId, userRole, userId);
    }
    async getClientStats(regionId, req) {
        const userCountryId = req.user.countryId;
        return this.clientsService.getClientStats(userCountryId, regionId ? +regionId : undefined);
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_client_dto_1.CreateClientDto, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, throttler_1.SkipThrottle)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('basic'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findAllBasic", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_clients_dto_1.SearchClientsDto, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('search/basic'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_clients_dto_1.SearchClientsDto, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "searchBasic", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/basic'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findOneBasic", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('country/:countryId'),
    __param(0, (0, common_1.Param)('countryId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findByCountry", null);
__decorate([
    (0, common_1.Get)('region/:regionId'),
    __param(0, (0, common_1.Param)('regionId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findByRegion", null);
__decorate([
    (0, common_1.Get)('route/:routeId'),
    __param(0, (0, common_1.Param)('routeId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findByRoute", null);
__decorate([
    (0, common_1.Get)('location/nearby'),
    __param(0, (0, common_1.Query)('latitude')),
    __param(1, (0, common_1.Query)('longitude')),
    __param(2, (0, common_1.Query)('radius')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findByLocation", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    __param(0, (0, common_1.Query)('regionId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "getClientStats", null);
exports.ClientsController = ClientsController = __decorate([
    (0, common_1.Controller)('clients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [clients_service_1.ClientsService])
], ClientsController);
//# sourceMappingURL=clients.controller.js.map