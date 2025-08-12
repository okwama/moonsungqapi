import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutletQuantityTransaction } from '../entities/outlet-quantity-transaction.entity';

export interface CreateTransactionDto {
  clientId: number;
  productId: number;
  transactionType: 'sale' | 'return' | 'stock_adjustment' | 'void';
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId?: number;
  referenceType?: string;
  userId: number;
  notes?: string;
}

@Injectable()
export class OutletQuantityTransactionsService {
  constructor(
    @InjectRepository(OutletQuantityTransaction)
    private outletQuantityTransactionRepository: Repository<OutletQuantityTransaction>,
  ) {}

  async logTransaction(createDto: CreateTransactionDto): Promise<OutletQuantityTransaction> {
    const transaction = this.outletQuantityTransactionRepository.create({
      ...createDto,
      transactionDate: new Date(),
    });

    return this.outletQuantityTransactionRepository.save(transaction);
  }

  async logSaleTransaction(
    clientId: number,
    productId: number,
    quantity: number,
    previousStock: number,
    newStock: number,
    referenceId: number,
    userId: number,
    notes?: string,
  ): Promise<OutletQuantityTransaction> {
    return this.logTransaction({
      clientId,
      productId,
      transactionType: 'sale',
      quantity: -Math.abs(quantity), // Negative for sales
      previousStock,
      newStock,
      referenceId,
      referenceType: 'uplift_sale',
      userId,
      notes: notes || 'Sale made',
    });
  }

  async logVoidTransaction(
    clientId: number,
    productId: number,
    quantity: number,
    previousStock: number,
    newStock: number,
    referenceId: number,
    userId: number,
    notes?: string,
  ): Promise<OutletQuantityTransaction> {
    return this.logTransaction({
      clientId,
      productId,
      transactionType: 'void',
      quantity: Math.abs(quantity), // Positive for voids (stock restored)
      previousStock,
      newStock,
      referenceId,
      referenceType: 'uplift_sale',
      userId,
      notes: notes || 'Sale voided',
    });
  }

  async logStockAdjustment(
    clientId: number,
    productId: number,
    quantity: number,
    previousStock: number,
    newStock: number,
    referenceId: number,
    userId: number,
    notes?: string,
  ): Promise<OutletQuantityTransaction> {
    return this.logTransaction({
      clientId,
      productId,
      transactionType: 'stock_adjustment',
      quantity, // Can be positive or negative
      previousStock,
      newStock,
      referenceId,
      referenceType: 'client_stock',
      userId,
      notes: notes || 'Stock adjustment',
    });
  }

  async findByClient(clientId: number): Promise<OutletQuantityTransaction[]> {
    return this.outletQuantityTransactionRepository.find({
      where: { clientId },
      relations: ['client', 'product'],
      order: { transactionDate: 'DESC' },
    });
  }

  async findByProduct(productId: number): Promise<OutletQuantityTransaction[]> {
    return this.outletQuantityTransactionRepository.find({
      where: { productId },
      relations: ['client', 'product'],
      order: { transactionDate: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<OutletQuantityTransaction[]> {
    return this.outletQuantityTransactionRepository.find({
      where: {
        transactionDate: {
          $gte: startDate,
          $lte: endDate,
        } as any,
      },
      relations: ['client', 'product'],
      order: { transactionDate: 'DESC' },
    });
  }

  async findByTransactionType(transactionType: string): Promise<OutletQuantityTransaction[]> {
    return this.outletQuantityTransactionRepository.find({
      where: { transactionType: transactionType as any },
      relations: ['client', 'product'],
      order: { transactionDate: 'DESC' },
    });
  }

  async getStockLevelOnDate(clientId: number, productId: number, date: Date): Promise<number> {
    const transactions = await this.outletQuantityTransactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.clientId = :clientId', { clientId })
      .andWhere('transaction.productId = :productId', { productId })
      .andWhere('transaction.transactionDate <= :date', { date })
      .orderBy('transaction.transactionDate', 'DESC')
      .addOrderBy('transaction.id', 'DESC')
      .getOne();

    return transactions ? transactions.newStock : 0;
  }
}
