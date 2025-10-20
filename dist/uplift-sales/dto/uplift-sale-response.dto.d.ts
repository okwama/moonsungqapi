export declare class UpliftSaleClientDto {
    id: number;
    name: string;
    contact: string;
}
export declare class UpliftSaleProductDto {
    id: number;
    productName: string;
    imageUrl: string;
}
export declare class UpliftSaleItemDto {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    total: number;
    product: UpliftSaleProductDto;
}
export declare class UpliftSaleResponseDto {
    id: number;
    clientId: number;
    userId: number;
    totalAmount: number;
    status: number;
    comment: string;
    createdAt: Date;
    client: UpliftSaleClientDto;
    upliftSaleItems: UpliftSaleItemDto[];
    user: any;
    updatedAt: any;
}
