import { Repository } from 'typeorm';
import { OutletQuantity } from '../entities/outlet-quantity.entity';
export declare class OutletQuantityService {
    private outletQuantityRepository;
    private readonly logger;
    constructor(outletQuantityRepository: Repository<OutletQuantity>);
    findByOutletId(outletId: number): Promise<OutletQuantity[]>;
    findByOutletAndProduct(outletId: number, productId: number): Promise<OutletQuantity>;
    updateQuantity(outletId: number, productId: number, quantity: number): Promise<OutletQuantity>;
    decrementQuantity(outletId: number, productId: number, amount: number): Promise<OutletQuantity>;
    create(outletId: number, productId: number, quantity: number): Promise<OutletQuantity>;
}
