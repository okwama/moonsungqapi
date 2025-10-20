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
exports.UpliftSaleResponseDto = exports.UpliftSaleItemDto = exports.UpliftSaleProductDto = exports.UpliftSaleClientDto = void 0;
const class_transformer_1 = require("class-transformer");
class UpliftSaleClientDto {
}
exports.UpliftSaleClientDto = UpliftSaleClientDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpliftSaleClientDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpliftSaleClientDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpliftSaleClientDto.prototype, "contact", void 0);
class UpliftSaleProductDto {
}
exports.UpliftSaleProductDto = UpliftSaleProductDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpliftSaleProductDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpliftSaleProductDto.prototype, "productName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpliftSaleProductDto.prototype, "imageUrl", void 0);
class UpliftSaleItemDto {
}
exports.UpliftSaleItemDto = UpliftSaleItemDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpliftSaleItemDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpliftSaleItemDto.prototype, "productId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpliftSaleItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpliftSaleItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpliftSaleItemDto.prototype, "total", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => UpliftSaleProductDto),
    __metadata("design:type", UpliftSaleProductDto)
], UpliftSaleItemDto.prototype, "product", void 0);
class UpliftSaleResponseDto {
}
exports.UpliftSaleResponseDto = UpliftSaleResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpliftSaleResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpliftSaleResponseDto.prototype, "clientId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpliftSaleResponseDto.prototype, "userId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpliftSaleResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpliftSaleResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpliftSaleResponseDto.prototype, "comment", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], UpliftSaleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => UpliftSaleClientDto),
    __metadata("design:type", UpliftSaleClientDto)
], UpliftSaleResponseDto.prototype, "client", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => UpliftSaleItemDto),
    __metadata("design:type", Array)
], UpliftSaleResponseDto.prototype, "upliftSaleItems", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], UpliftSaleResponseDto.prototype, "user", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], UpliftSaleResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=uplift-sale-response.dto.js.map