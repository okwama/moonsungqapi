import { Repository } from 'typeorm';
import { Clients } from '../entities/clients.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { SearchClientsDto } from './dto/search-clients.dto';
import { ClientAssignmentService } from '../client-assignment/client-assignment.service';
export declare class ClientsService {
    private clientRepository;
    private clientAssignmentService;
    constructor(clientRepository: Repository<Clients>, clientAssignmentService: ClientAssignmentService);
    create(createClientDto: CreateClientDto, userCountryId: number): Promise<Clients>;
    findAll(userCountryId: number, userRole?: string, userId?: number): Promise<Clients[]>;
    findAllForAdmin(userCountryId: number): Promise<Clients[]>;
    findOne(id: number, userCountryId: number, userRole?: string, userId?: number): Promise<Clients | null>;
    findOneBasic(id: number, userCountryId: number, userRole?: string, userId?: number): Promise<Clients | null>;
    update(id: number, updateClientDto: Partial<CreateClientDto>, userCountryId: number): Promise<Clients | null>;
    search(searchDto: SearchClientsDto, userCountryId: number, userRole?: string, userId?: number): Promise<Clients[]>;
    findByCountry(countryId: number, userCountryId: number, userRole?: string, userId?: number): Promise<Clients[]>;
    findByRegion(regionId: number, userCountryId: number, userRole?: string, userId?: number): Promise<Clients[]>;
    findByRoute(routeId: number, userCountryId: number, userRole?: string, userId?: number): Promise<Clients[]>;
    findByLocation(latitude: number, longitude: number, radius: number, userCountryId: number, userRole?: string, userId?: number): Promise<Clients[]>;
    getClientStats(userCountryId: number, regionId?: number): Promise<any>;
    findPendingClients(userCountryId: number): Promise<Clients[]>;
    approveClient(id: number, userCountryId: number): Promise<Clients | null>;
    rejectClient(id: number, userCountryId: number): Promise<boolean>;
}
