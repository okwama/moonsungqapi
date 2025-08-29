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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async create(createOrderDto, req) {
        const salesrepId = req.user?.sub || req.user?.id;
        const order = await this.ordersService.create(createOrderDto, salesrepId);
        return {
            success: true,
            data: order
        };
    }
    async findAll(page = '1', limit = '10', req) {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const userId = req.user?.id;
        const userRole = req.user?.role;
        console.log(`🔍 GET /orders - User: ${userId}, Role: ${userRole}, Page: ${pageNum}, Limit: ${limitNum}`);
        console.log(`🔍 Complete user object from JWT:`, JSON.stringify(req.user, null, 2));
        const orders = await this.ordersService.findAll(userId, userRole);
        const total = orders.length;
        const totalPages = Math.ceil(total / limitNum);
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        const paginatedOrders = orders.slice(startIndex, endIndex);
        console.log(`📊 Orders: Found ${total} orders, returning ${paginatedOrders.length} for page ${pageNum}`);
        if (paginatedOrders.length > 0) {
            console.log(`🕒 Order timestamps (sorted by createdAt DESC):`);
            paginatedOrders.slice(0, 3).forEach((order, index) => {
                console.log(`  ${index + 1}. Order ${order.id}: createdAt=${order.createdAt}, updatedAt=${order.updatedAt}`);
            });
        }
        return {
            success: true,
            data: paginatedOrders,
            total: total,
            page: pageNum,
            limit: limitNum,
            totalPages: totalPages,
        };
    }
    async findOne(id, req) {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        console.log(`🔍 GET /orders/${id} - User: ${userId}, Role: ${userRole}`);
        const order = await this.ordersService.findOne(+id, userId, userRole);
        if (!order) {
            console.log(`❌ Order ${id} not found or access denied for user ${userId}`);
            return {
                success: false,
                error: 'Order not found or access denied'
            };
        }
        return {
            success: true,
            data: order
        };
    }
    async update(id, updateOrderDto) {
        const order = await this.ordersService.update(+id, updateOrderDto);
        return {
            success: true,
            data: order
        };
    }
    remove(id) {
        return this.ordersService.remove(+id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "remove", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map