import { SampleRequest } from './sample-request.entity';
import { Product } from '../products/entities/product.entity';
export declare class SampleRequestItem {
    id: number;
    sampleRequestId: number;
    productId: number;
    quantity: number;
    notes: string;
    createdAt: Date;
    product: Product;
    sampleRequest: SampleRequest;
}
