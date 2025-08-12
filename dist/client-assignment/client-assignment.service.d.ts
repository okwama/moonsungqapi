import { Repository } from 'typeorm';
import { ClientAssignment } from '../entities/client-assignment.entity';
import { Clients } from '../entities/clients.entity';
export declare class ClientAssignmentService {
    private clientAssignmentRepository;
    private clientsRepository;
    private readonly logger;
    constructor(clientAssignmentRepository: Repository<ClientAssignment>, clientsRepository: Repository<Clients>);
    assignOutletToSalesRep(outletId: number, salesRepId: number): Promise<ClientAssignment>;
    getAssignedOutlets(salesRepId: number, userCountryId: number): Promise<any[]>;
    getOutletAssignment(outletId: number): Promise<ClientAssignment | null>;
    deactivateAssignment(outletId: number): Promise<void>;
    getAssignmentHistory(outletId: number): Promise<ClientAssignment[]>;
    getSalesRepAssignments(salesRepId: number): Promise<ClientAssignment[]>;
}
