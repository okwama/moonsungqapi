import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesService } from './roles.service';
import { Role } from '../entities/role.entity';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  private readonly logger = new Logger(RolesController.name);

  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async getAllRoles(): Promise<Role[]> {
    this.logger.log('🔍 GET /roles - Fetching all roles');
    return this.rolesService.findAll();
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string): Promise<Role | null> {
    this.logger.log(`🔍 GET /roles/${id} - Fetching role by ID`);
    return this.rolesService.findById(+id);
  }

  @Get('name/:name')
  async getRoleByName(@Param('name') name: string): Promise<Role | null> {
    this.logger.log(`🔍 GET /roles/name/${name} - Fetching role by name`);
    return this.rolesService.findByName(name);
  }

  @Post()
  async createRole(@Body() body: { name: string }): Promise<Role> {
    this.logger.log(`➕ POST /roles - Creating new role: ${body.name}`);
    return this.rolesService.create(body.name);
  }

  @Put(':id')
  async updateRole(@Param('id') id: string, @Body() body: { name: string }): Promise<Role | null> {
    this.logger.log(`✏️ PUT /roles/${id} - Updating role to: ${body.name}`);
    return this.rolesService.update(+id, body.name);
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string): Promise<{ success: boolean }> {
    this.logger.log(`🗑️ DELETE /roles/${id} - Deleting role`);
    const success = await this.rolesService.delete(+id);
    return { success };
  }
}
