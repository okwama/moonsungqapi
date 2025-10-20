export declare class OrderClientDto {
    id: number;
    name: string;
    contact: string;
    region: string;
}
export declare class OrderProductDto {
    id: number;
    productName: string;
    productCode: string;
    imageUrl: string;
}
export declare class OrderItemDto {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    taxAmount: number;
    product: OrderProductDto;
}
export declare class OrderResponseDto {
    id: number;
    soNumber: string;
    clientId: number;
    orderDate: Date;
    expectedDeliveryDate: Date;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    status: string;
    notes: string;
    createdAt: Date;
    receivedIntoStock: boolean;
    receivedAt: Date;
    client: OrderClientDto;
    orderItems: OrderItemDto[];
    user: any;
    createdBy: any;
    updatedAt: any;
}
