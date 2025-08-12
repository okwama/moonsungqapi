import { RolesService } from './roles.service';
import { Role } from '../entities/role.entity';
export declare class RolesController {
    private readonly rolesService;
    private readonly logger;
    constructor(rolesService: RolesService);
    getAllRoles(): Promise<Role[]>;
    getRoleById(id: string): Promise<Role | null>;
    getRoleByName(name: string): Promise<Role | null>;
    createRole(body: {
        name: string;
    }): Promise<Role>;
    updateRole(id: string, body: {
        name: string;
    }): Promise<Role | null>;
    deleteRole(id: string): Promise<{
        success: boolean;
    }>;
}
