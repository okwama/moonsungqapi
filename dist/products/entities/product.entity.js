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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const uplift_sale_item_entity_1 = require("../../entities/uplift-sale-item.entity");
const store_inventory_entity_1 = require("../../entities/store-inventory.entity");
const category_entity_1 = require("../../entities/category.entity");
const sample_request_item_entity_1 = require("../../entities/sample-request-item.entity");
let Product = class Product {
    get categoryPriceOptions() {
        return this.categoryEntity?.categoryPriceOptions || [];
    }
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_code', length: 20, unique: true }),
    __metadata("design:type", String)
], Product.prototype, "productCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name', length: 100 }),
    __metadata("design:type", String)
], Product.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', type: 'int' }),
    __metadata("design:type", Number)
], Product.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_of_measure', length: 20, default: 'PCS' }),
    __metadata("design:type", String)
], Product.prototype, "unitOfMeasure", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cost_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.00,
        transformer: {
            to: (value) => value,
            from: (value) => parseFloat(value) || 0
        }
    }),
    __metadata("design:type", Number)
], Product.prototype, "costPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'selling_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.00,
        transformer: {
            to: (value) => value,
            from: (value) => parseFloat(value) || 0
        }
    }),
    __metadata("design:type", Number)
], Product.prototype, "sellingPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_type', type: 'enum', enum: ['vat_16', 'zero_rated', 'exempted'], default: 'vat_16' }),
    __metadata("design:type", String)
], Product.prototype, "taxType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reorder_level', type: 'int', default: 0, nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "reorderLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_stock', type: 'int', default: 0, nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "currentStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true, nullable: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', length: 200 }),
    __metadata("design:type", String)
], Product.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp', precision: 0 }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp', precision: 0 }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => uplift_sale_item_entity_1.UpliftSaleItem, upliftSaleItem => upliftSaleItem.product),
    __metadata("design:type", Array)
], Product.prototype, "upliftSaleItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => store_inventory_entity_1.StoreInventory, storeInventory => storeInventory.product),
    __metadata("design:type", Array)
], Product.prototype, "storeInventory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sample_request_item_entity_1.SampleRequestItem, sampleRequestItem => sampleRequestItem.product),
    __metadata("design:type", Array)
], Product.prototype, "sampleRequestItems", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, category => category.categoryPriceOptions),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", category_entity_1.Category)
], Product.prototype, "categoryEntity", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)('products')
], Product);
//# sourceMappingURL=product.entity.js.map