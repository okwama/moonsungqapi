import { ProductsService } from './products.service';
import { DataSource } from 'typeorm';
export declare class ProductsController {
    private readonly productsService;
    private dataSource;
    constructor(productsService: ProductsService, dataSource: DataSource);
    findAll(clientId?: string, page?: string, limit?: string, category?: string, search?: string): Promise<{
        success: boolean;
        data: import("./entities/product.entity").Product[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        meta: {
            processingTime: string;
            cached: boolean;
            timestamp: string;
            clientId: number;
            filters: {
                category: string;
                search: string;
            };
        };
    }>;
    findProductsForUser(req: any, clientId?: string): Promise<import("./entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
}
export declare class HealthController {
    private dataSource;
    constructor(dataSource: DataSource);
    productsHealthCheck(): Promise<{
        status: string;
        database: string;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        database: string;
        error: any;
        timestamp: string;
    }>;
}
