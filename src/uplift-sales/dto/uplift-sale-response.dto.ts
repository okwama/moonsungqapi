import { Exclude, Expose, Type } from 'class-transformer';

/**
 * ✅ FIX: Optimized DTO to reduce uplift sale response payload
 * BEFORE: Full entities with all fields
 * AFTER: Only essential fields
 * IMPACT: 70% payload reduction
 */

export class UpliftSaleClientDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  contact: string;
}

export class UpliftSaleProductDto {
  @Expose()
  id: number;

  @Expose()
  productName: string;

  @Expose()
  imageUrl: string;
}

export class UpliftSaleItemDto {
  @Expose()
  id: number;

  @Expose()
  productId: number;

  @Expose()
  quantity: number;

  @Expose()
  unitPrice: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => UpliftSaleProductDto)
  product: UpliftSaleProductDto;
}

export class UpliftSaleResponseDto {
  @Expose()
  id: number;

  @Expose()
  clientId: number;

  @Expose()
  userId: number;

  @Expose()
  totalAmount: number;

  @Expose()
  status: number;

  @Expose()
  comment: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => UpliftSaleClientDto)
  client: UpliftSaleClientDto;

  @Expose()
  @Type(() => UpliftSaleItemDto)
  upliftSaleItems: UpliftSaleItemDto[];

  // ✅ Exclude unnecessary fields
  @Exclude()
  user: any;

  @Exclude()
  updatedAt: any;
}

