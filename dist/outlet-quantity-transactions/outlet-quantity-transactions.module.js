"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutletQuantityTransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const outlet_quantity_transaction_entity_1 = require("../entities/outlet-quantity-transaction.entity");
const outlet_quantity_transactions_service_1 = require("./outlet-quantity-transactions.service");
let OutletQuantityTransactionsModule = class OutletQuantityTransactionsModule {
};
exports.OutletQuantityTransactionsModule = OutletQuantityTransactionsModule;
exports.OutletQuantityTransactionsModule = OutletQuantityTransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([outlet_quantity_transaction_entity_1.OutletQuantityTransaction]),
        ],
        providers: [outlet_quantity_transactions_service_1.OutletQuantityTransactionsService],
        exports: [outlet_quantity_transactions_service_1.OutletQuantityTransactionsService],
    })
], OutletQuantityTransactionsModule);
//# sourceMappingURL=outlet-quantity-transactions.module.js.map