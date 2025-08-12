"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpliftSalesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const uplift_sales_controller_1 = require("./uplift-sales.controller");
const uplift_sales_service_1 = require("./uplift-sales.service");
const entities_1 = require("../entities");
const outlet_quantity_transactions_module_1 = require("../outlet-quantity-transactions/outlet-quantity-transactions.module");
let UpliftSalesModule = class UpliftSalesModule {
};
exports.UpliftSalesModule = UpliftSalesModule;
exports.UpliftSalesModule = UpliftSalesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.UpliftSale, entities_1.UpliftSaleItem, entities_1.ClientStock]),
            outlet_quantity_transactions_module_1.OutletQuantityTransactionsModule,
        ],
        controllers: [uplift_sales_controller_1.UpliftSalesController],
        providers: [uplift_sales_service_1.UpliftSalesService],
        exports: [uplift_sales_service_1.UpliftSalesService],
    })
], UpliftSalesModule);
//# sourceMappingURL=uplift-sales.module.js.map