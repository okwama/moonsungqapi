"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const products_controller_1 = require("./products.controller");
const products_service_1 = require("./products.service");
const products_cache_service_1 = require("./products-cache.service");
const product_entity_1 = require("./entities/product.entity");
const store_entity_1 = require("../entities/store.entity");
const store_inventory_entity_1 = require("../entities/store-inventory.entity");
const category_entity_1 = require("../entities/category.entity");
const category_price_option_entity_1 = require("../entities/category-price-option.entity");
const clients_entity_1 = require("../entities/clients.entity");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, store_entity_1.Store, store_inventory_entity_1.StoreInventory, category_entity_1.Category, category_price_option_entity_1.CategoryPriceOption, clients_entity_1.Clients])],
        controllers: [products_controller_1.ProductsController, products_controller_1.HealthController],
        providers: [products_service_1.ProductsService, products_cache_service_1.ProductsCacheService],
        exports: [products_service_1.ProductsService],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map