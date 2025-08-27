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
exports.Token = void 0;
const typeorm_1 = require("typeorm");
const sales_rep_entity_1 = require("./sales-rep.entity");
let Token = class Token {
};
exports.Token = Token;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Token.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Token.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'salesRepId' }),
    __metadata("design:type", Number)
], Token.prototype, "salesRepId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tokenType', type: 'varchar', length: 10, default: 'access' }),
    __metadata("design:type", String)
], Token.prototype, "tokenType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expiresAt', type: 'datetime' }),
    __metadata("design:type", Date)
], Token.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Token.prototype, "blacklisted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lastUsedAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Token.prototype, "lastUsedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'datetime' }),
    __metadata("design:type", Date)
], Token.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_rep_entity_1.SalesRep, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'salesRepId' }),
    __metadata("design:type", sales_rep_entity_1.SalesRep)
], Token.prototype, "salesRep", void 0);
exports.Token = Token = __decorate([
    (0, typeorm_1.Entity)('Token')
], Token);
//# sourceMappingURL=token.entity.js.map