import { ClientStockService } from './client-stock.service';
export declare class ClientStockController {
    private readonly clientStockService;
    private readonly logger;
    constructor(clientStockService: ClientStockService);
    getFeatureStatus(): Promise<{
        enabled: boolean;
        message: string;
    }>;
    getClientStock(clientId: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            clientId: number;
            productId: number;
            quantity: number;
            salesrepId: number;
            product: {
                id: number;
                name: string;
                description: string;
                price: number;
                imageUrl: string;
            };
        }[];
    }>;
    updateStock(body: {
        clientId: number;
        productId: number;
        quantity: number;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            clientId: number;
            productId: number;
            quantity: number;
            salesrepId: number;
        };
    }>;
    deleteStock(clientId: string, productId: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
