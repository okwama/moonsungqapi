import { Clients } from '../../entities/clients.entity';
import { OrderItem } from './order-item.entity';
import { Users } from '../../users/entities/users.entity';
export declare class Order {
    id: number;
    soNumber: string;
    clientId: number;
    orderDate: Date;
    expectedDeliveryDate: Date;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    netPrice: number;
    notes: string;
    createdBy: number;
    salesrep: number;
    riderId: number;
    assignedAt: Date;
    status: string;
    myStatus: number;
    receivedIntoStock: boolean;
    receivedAt: Date;
    user: Users;
    client: Clients;
    orderItems: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
