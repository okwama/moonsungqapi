import { DataSource } from 'typeorm';
export declare class PricingService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    getOutletEffectivePrice(params: {
        clientId: number;
        productId: number;
        asOf?: Date;
    }): Promise<any>;
}
