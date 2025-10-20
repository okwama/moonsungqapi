import { Repository } from 'typeorm';
import { ClientAssignment } from '../entities/client-assignment.entity';
import { Clients } from '../entities/clients.entity';
import { ClientAssignmentCacheService } from './client-assignment-cache.service';
export declare class ClientAssignmentService {
    private clientAssignmentRepository;
    private clientsRepository;
    private cacheService;
    private readonly logger;
    constructor(clientAssignmentRepository: Repository<ClientAssignment>, clientsRepository: Repository<Clients>, cacheService: ClientAssignmentCacheService);
    assignOutletToSalesRep(outletId: number, salesRepId: number): Promise<ClientAssignment>;
    getAssignedOutlets(salesRepId: number, userCountryId: number): Promise<any[]>;
    getOutletAssignment(outletId: number): Promise<ClientAssignment | null>;
    deactivateAssignment(outletId: number): Promise<void>;
    getAssignmentHistory(outletId: number): Promise<ClientAssignment[]>;
    getSalesRepAssignments(salesRepId: number): Promise<ClientAssignment[]>;
}
