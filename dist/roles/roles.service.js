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
var RolesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../entities/role.entity");
let RolesService = RolesService_1 = class RolesService {
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
        this.logger = new common_1.Logger(RolesService_1.name);
    }
    async findAll() {
        this.logger.log('🔍 Fetching all roles');
        return this.roleRepository.find();
    }
    async findById(id) {
        this.logger.log(`🔍 Fetching role with ID: ${id}`);
        return this.roleRepository.findOne({ where: { id } });
    }
    async findByName(name) {
        this.logger.log(`🔍 Fetching role with name: ${name}`);
        return this.roleRepository.findOne({ where: { name } });
    }
    async create(name) {
        this.logger.log(`➕ Creating new role: ${name}`);
        const role = this.roleRepository.create({ name });
        return this.roleRepository.save(role);
    }
    async update(id, name) {
        this.logger.log(`✏️ Updating role ID ${id} to name: ${name}`);
        await this.roleRepository.update(id, { name });
        return this.findById(id);
    }
    async delete(id) {
        this.logger.log(`🗑️ Deleting role with ID: ${id}`);
        const result = await this.roleRepository.delete(id);
        return result.affected > 0;
    }
    async getRoleName(roleId) {
        const role = await this.findById(roleId);
        return role ? role.name : null;
    }
    async getRoleId(roleName) {
        const role = await this.findByName(roleName);
        return role ? role.id : null;
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = RolesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map