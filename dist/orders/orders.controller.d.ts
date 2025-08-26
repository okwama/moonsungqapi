import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, req: any): Promise<{
        success: boolean;
        data: import("./entities/order.entity").Order;
    }>;
    findAll(page: string, limit: string, req: any): Promise<{
        success: boolean;
        data: import("./entities/order.entity").Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, req: any): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: import("./entities/order.entity").Order;
        error?: undefined;
    }>;
    update(id: string, updateOrderDto: Partial<CreateOrderDto>): Promise<{
        success: boolean;
        data: import("./entities/order.entity").Order;
    }>;
    remove(id: string): Promise<void>;
}
