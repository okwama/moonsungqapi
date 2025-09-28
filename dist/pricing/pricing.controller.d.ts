import { PricingService } from './pricing.service';
export declare class PricingController {
    private readonly pricingService;
    constructor(pricingService: PricingService);
    getOutletEffective(clientId: string, productId: string, asOf?: string): Promise<any>;
}
