import { Repository } from 'typeorm';
import { ClientStock } from '../entities/client-stock.entity';
export declare class ClientStockService {
    private clientStockRepository;
    private readonly logger;
    constructor(clientStockRepository: Repository<ClientStock>);
    getClientStock(clientId: number): Promise<ClientStock[]>;
    updateStock(clientId: number, productId: number, quantity: number, salesrepId: number): Promise<ClientStock>;
    getStockByClientAndProduct(clientId: number, productId: number): Promise<ClientStock | null>;
    deleteStock(clientId: number, productId: number): Promise<void>;
}
