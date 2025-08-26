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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
let OrdersService = class OrdersService {
    constructor(orderRepository, orderItemRepository, dataSource) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.dataSource = dataSource;
    }
    async create(createOrderDto, salesrepId) {
        let retryCount = 0;
        const maxRetries = 3;
        while (retryCount < maxRetries) {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const soNumber = createOrderDto.soNumber || await this.generateSoNumber();
                let subtotal = 0;
                let taxAmount = 0;
                let totalAmount = 0;
                let netPrice = 0;
                for (const item of createOrderDto.orderItems) {
                    const itemUnitPrice = item.unitPrice || 0;
                    const itemQuantity = item.quantity || 0;
                    const itemTotal = itemUnitPrice * itemQuantity;
                    const itemTax = item.taxAmount || (itemTotal / 1.16 * 0.16);
                    const itemSubtotal = itemTotal - itemTax;
                    subtotal += itemSubtotal;
                    taxAmount += itemTax;
                    totalAmount += itemTotal;
                    netPrice += itemTotal;
                }
                const orderData = {
                    soNumber: soNumber,
                    clientId: createOrderDto.clientId,
                    orderDate: createOrderDto.orderDate ? new Date(createOrderDto.orderDate) : new Date(),
                    expectedDeliveryDate: createOrderDto.expectedDeliveryDate ? new Date(createOrderDto.expectedDeliveryDate) : null,
                    subtotal: subtotal,
                    taxAmount: taxAmount,
                    totalAmount: totalAmount,
                    netPrice: netPrice,
                    notes: createOrderDto.comment || createOrderDto.notes,
                    createdBy: null,
                    salesrep: salesrepId,
                    riderId: createOrderDto.riderId,
                    status: createOrderDto.status || 'draft',
                    myStatus: createOrderDto.myStatus || 0,
                };
                const order = this.orderRepository.create(orderData);
                const savedOrder = await queryRunner.manager.save(order);
                for (const itemDto of createOrderDto.orderItems) {
                    const itemUnitPrice = itemDto.unitPrice || 0;
                    const itemQuantity = itemDto.quantity || 0;
                    const itemTotal = itemUnitPrice * itemQuantity;
                    const itemTax = itemDto.taxAmount || (itemTotal / 1.16 * 0.16);
                    const itemSubtotal = itemTotal - itemTax;
                    const orderItemData = {
                        salesOrderId: savedOrder.id,
                        productId: itemDto.productId,
                        quantity: itemQuantity,
                        unitPrice: itemUnitPrice,
                        taxAmount: itemTax,
                        totalPrice: itemTotal,
                        taxType: itemDto.taxType || 'vat_16',
                        netPrice: itemTotal,
                        shippedQuantity: itemDto.shippedQuantity || 0,
                    };
                    const orderItem = this.orderItemRepository.create(orderItemData);
                    await queryRunner.manager.save(orderItem);
                }
                await queryRunner.commitTransaction();
                return this.findOne(savedOrder.id);
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                if (error.message && error.message.includes('Duplicate entry') && error.message.includes('so_number')) {
                    retryCount++;
                    if (retryCount >= maxRetries) {
                        throw new Error(`Failed to create order after ${maxRetries} retries due to SO number conflicts`);
                    }
                    await new Promise(resolve => setTimeout(resolve, 100 * retryCount));
                    continue;
                }
                throw error;
            }
            finally {
                await queryRunner.release();
            }
        }
        throw new Error('Failed to create order after maximum retries');
    }
    async generateSoNumber() {
        const currentYear = new Date().getFullYear();
        const latestOrder = await this.orderRepository
            .createQueryBuilder('order')
            .where('order.soNumber LIKE :pattern', { pattern: `SO-${currentYear}-%` })
            .orderBy('order.soNumber', 'DESC')
            .getOne();
        let nextNumber = 1;
        if (latestOrder && latestOrder.soNumber) {
            const parts = latestOrder.soNumber.split('-');
            if (parts.length >= 3) {
                const yearPart = parts[1];
                const numberPart = parts[2];
                if (yearPart === currentYear.toString()) {
                    const lastNumber = parseInt(numberPart);
                    if (!isNaN(lastNumber)) {
                        nextNumber = lastNumber + 1;
                    }
                }
            }
        }
        return `SO-${currentYear}-${nextNumber.toString().padStart(4, '0')}`;
    }
    async findAll(userId, userRole) {
        console.log(`🔍 OrdersService.findAll - User: ${userId}, Role: ${userRole}`);
        if (userRole === 'SALES_REP') {
            console.log(`👤 User is SALES_REP - filtering orders for userId: ${userId}`);
            const orders = await this.orderRepository.find({
                where: { salesrep: userId },
                relations: ['user', 'client', 'orderItems', 'orderItems.product'],
                order: { createdAt: 'DESC' }
            });
            console.log(`✅ SALES_REP ${userId} has ${orders.length} orders`);
            return orders;
        }
        else {
            console.log(`🔑 User has admin privileges - returning all orders`);
            const orders = await this.orderRepository.find({
                relations: ['user', 'client', 'orderItems', 'orderItems.product'],
                order: { createdAt: 'DESC' }
            });
            console.log(`📊 Found ${orders.length} total orders`);
            return orders;
        }
    }
    async findOne(id, userId, userRole) {
        console.log(`🔍 OrdersService.findOne - Order: ${id}, User: ${userId}, Role: ${userRole}`);
        if (userRole === 'SALES_REP') {
            const order = await this.orderRepository.findOne({
                where: { id, salesrep: userId },
                relations: ['user', 'client', 'orderItems', 'orderItems.product'],
            });
            if (!order) {
                console.log(`❌ SALES_REP ${userId} not authorized to access order ${id} or order not found`);
                return null;
            }
            console.log(`✅ SALES_REP ${userId} authorized to access order ${id}`);
            return order;
        }
        else {
            console.log(`🔑 User has admin privileges - accessing order ${id}`);
            return this.orderRepository.findOne({
                where: { id },
                relations: ['user', 'client', 'orderItems', 'orderItems.product'],
            });
        }
    }
    async update(id, updateOrderDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingOrder = await this.findOne(id);
            if (!existingOrder) {
                throw new Error('Order not found');
            }
            if (updateOrderDto.orderItems && updateOrderDto.orderItems.length > 0) {
                await queryRunner.manager.delete(order_item_entity_1.OrderItem, { salesOrderId: id });
                let subtotal = 0;
                let taxAmount = 0;
                let totalAmount = 0;
                let netPrice = 0;
                for (const itemDto of updateOrderDto.orderItems) {
                    const itemUnitPrice = itemDto.unitPrice || 0;
                    const itemQuantity = itemDto.quantity || 0;
                    const itemTotal = itemUnitPrice * itemQuantity;
                    const itemTax = itemDto.taxAmount || (itemTotal / 1.16 * 0.16);
                    const itemSubtotal = itemTotal - itemTax;
                    const orderItemData = {
                        salesOrderId: id,
                        productId: itemDto.productId,
                        quantity: itemQuantity,
                        unitPrice: itemUnitPrice,
                        taxAmount: itemTax,
                        totalPrice: itemTotal,
                        taxType: itemDto.taxType || 'vat_16',
                        netPrice: itemTotal,
                        shippedQuantity: itemDto.shippedQuantity || 0,
                    };
                    const orderItem = this.orderItemRepository.create(orderItemData);
                    await queryRunner.manager.save(orderItem);
                    subtotal += itemSubtotal;
                    taxAmount += itemTax;
                    totalAmount += itemTotal;
                    netPrice += itemTotal;
                }
                await queryRunner.manager.update(order_entity_1.Order, id, {
                    subtotal: subtotal,
                    taxAmount: taxAmount,
                    totalAmount: totalAmount,
                    netPrice: netPrice,
                    notes: updateOrderDto.comment || updateOrderDto.notes,
                });
            }
            else {
                const updateData = {};
                if (updateOrderDto.comment !== undefined)
                    updateData.notes = updateOrderDto.comment;
                if (updateOrderDto.notes !== undefined)
                    updateData.notes = updateOrderDto.notes;
                if (updateOrderDto.status !== undefined)
                    updateData.status = updateOrderDto.status;
                if (Object.keys(updateData).length > 0) {
                    await queryRunner.manager.update(order_entity_1.Order, id, updateData);
                }
            }
            await queryRunner.commitTransaction();
            return this.findOne(id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async remove(id) {
        await this.orderRepository.delete(id);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map