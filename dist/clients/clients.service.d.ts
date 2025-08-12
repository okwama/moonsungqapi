import { Repository } from 'typeorm';
import { Clients } from '../entities/clients.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { SearchClientsDto } from './dto/search-clients.dto';
export declare class ClientsService {
    private clientRepository;
    constructor(clientRepository: Repository<Clients>);
    create(createClientDto: CreateClientDto, userCountryId: number): Promise<Clients>;
    findAll(userCountryId: number): Promise<Clients[]>;
    findAllForAdmin(userCountryId: number): Promise<Clients[]>;
    findOne(id: number, userCountryId: number): Promise<Clients | null>;
    findOneBasic(id: number, userCountryId: number): Promise<Clients | null>;
    update(id: number, updateClientDto: Partial<CreateClientDto>, userCountryId: number): Promise<Clients | null>;
    search(searchDto: SearchClientsDto, userCountryId: number): Promise<Clients[]>;
    findByCountry(countryId: number, userCountryId: number): Promise<Clients[]>;
    findByRegion(regionId: number, userCountryId: number): Promise<Clients[]>;
    findByRoute(routeId: number, userCountryId: number): Promise<Clients[]>;
    findByLocation(latitude: number, longitude: number, radius: number, userCountryId: number): Promise<Clients[]>;
    getClientStats(userCountryId: number, regionId?: number): Promise<any>;
    findPendingClients(userCountryId: number): Promise<Clients[]>;
    approveClient(id: number, userCountryId: number): Promise<Clients | null>;
    rejectClient(id: number, userCountryId: number): Promise<boolean>;
}
