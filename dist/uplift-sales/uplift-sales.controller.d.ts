import { UpliftSalesService } from './uplift-sales.service';
export declare class UpliftSalesController {
    private readonly upliftSalesService;
    constructor(upliftSalesService: UpliftSalesService);
    findAll(query: any, req: any): Promise<import("../entities").UpliftSale[]>;
    findOne(id: string): Promise<import("../entities").UpliftSale>;
    create(createUpliftSaleDto: any): Promise<unknown>;
    update(id: string, updateUpliftSaleDto: any): Promise<import("../entities").UpliftSale>;
    remove(id: string): Promise<{
        message: string;
    }>;
    voidSale(id: string, body: {
        reason: string;
    }): Promise<import("../entities").UpliftSale>;
    updateStatus(id: string, body: {
        status: number;
    }): Promise<import("../entities").UpliftSale>;
}
