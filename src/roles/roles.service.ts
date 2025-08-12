import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    this.logger.log('🔍 Fetching all roles');
    return this.roleRepository.find();
  }

  async findById(id: number): Promise<Role | null> {
    this.logger.log(`🔍 Fetching role with ID: ${id}`);
    return this.roleRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Role | null> {
    this.logger.log(`🔍 Fetching role with name: ${name}`);
    return this.roleRepository.findOne({ where: { name } });
  }

  async create(name: string): Promise<Role> {
    this.logger.log(`➕ Creating new role: ${name}`);
    const role = this.roleRepository.create({ name });
    return this.roleRepository.save(role);
  }

  async update(id: number, name: string): Promise<Role | null> {
    this.logger.log(`✏️ Updating role ID ${id} to name: ${name}`);
    await this.roleRepository.update(id, { name });
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    this.logger.log(`🗑️ Deleting role with ID: ${id}`);
    const result = await this.roleRepository.delete(id);
    return result.affected > 0;
  }

  async getRoleName(roleId: number): Promise<string | null> {
    const role = await this.findById(roleId);
    return role ? role.name : null;
  }

  async getRoleId(roleName: string): Promise<number | null> {
    const role = await this.findByName(roleName);
    return role ? role.id : null;
  }
}

