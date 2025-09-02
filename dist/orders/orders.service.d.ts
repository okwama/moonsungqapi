import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private orderRepository;
    private orderItemRepository;
    private dataSource;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, dataSource: DataSource);
    create(createOrderDto: CreateOrderDto, salesrepId?: number): Promise<Order>;
    private generateSoNumber;
    findAll(userId?: number, userRole?: string): Promise<Order[]>;
    findOne(id: number, userId?: number, userRole?: string): Promise<Order | null>;
    update(id: number, updateOrderDto: Partial<CreateOrderDto>): Promise<Order | null>;
    remove(id: number): Promise<void>;
    markReceived(id: number, userId?: number): Promise<Order | null>;
}
