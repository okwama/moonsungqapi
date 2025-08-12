import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
export declare class RolesService {
    private roleRepository;
    private readonly logger;
    constructor(roleRepository: Repository<Role>);
    findAll(): Promise<Role[]>;
    findById(id: number): Promise<Role | null>;
    findByName(name: string): Promise<Role | null>;
    create(name: string): Promise<Role>;
    update(id: number, name: string): Promise<Role | null>;
    delete(id: number): Promise<boolean>;
    getRoleName(roleId: number): Promise<string | null>;
    getRoleId(roleName: string): Promise<number | null>;
}
