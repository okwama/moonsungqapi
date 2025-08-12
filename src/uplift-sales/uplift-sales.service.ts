import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UpliftSale } from '../entities/uplift-sale.entity';
import { UpliftSaleItem } from '../entities/uplift-sale-item.entity';
import { ClientStock } from '../entities/client-stock.entity';
import { OutletQuantityTransactionsService } from '../outlet-quantity-transactions/outlet-quantity-transactions.service';

@Injectable()
export class UpliftSalesService {
  constructor(
    @InjectRepository(UpliftSale)
    private upliftSaleRepository: Repository<UpliftSale>,
    @InjectRepository(UpliftSaleItem)
    private upliftSaleItemRepository: Repository<UpliftSaleItem>,
    @InjectRepository(ClientStock)
    private clientStockRepository: Repository<ClientStock>,
    private dataSource: DataSource,
    private outletQuantityTransactionsService: OutletQuantityTransactionsService,
  ) {}

  async findAll(query: any) {
    try {
      const queryBuilder = this.upliftSaleRepository.createQueryBuilder('upliftSale')
        .leftJoinAndSelect('upliftSale.client', 'client')
        .leftJoinAndSelect('upliftSale.user', 'user')
        .leftJoinAndSelect('upliftSale.upliftSaleItems', 'items')
        .leftJoinAndSelect('items.product', 'product');

      if (query.userId) {
        queryBuilder.where('upliftSale.userId = :userId', { userId: query.userId });
      }

      if (query.status) {
        queryBuilder.andWhere('upliftSale.status = :status', { status: query.status });
      }

      if (query.startDate) {
        queryBuilder.andWhere('upliftSale.createdAt >= :startDate', { startDate: query.startDate });
      }

      if (query.endDate) {
        queryBuilder.andWhere('upliftSale.createdAt <= :endDate', { endDate: query.endDate });
      }

      return queryBuilder.orderBy('upliftSale.createdAt', 'DESC').getMany();
    } catch (error) {
      console.error('Error fetching uplift sales:', error);
      throw new Error('Failed to fetch uplift sales');
    }
  }

  async findOne(id: number) {
    try {
      return this.upliftSaleRepository.findOne({
        where: { id },
        relations: ['client', 'user', 'upliftSaleItems', 'upliftSaleItems.product']
      });
    } catch (error) {
      console.error('Error fetching uplift sale by ID:', error);
      throw new Error('Failed to fetch uplift sale');
    }
  }

  async validateStock(clientId: number, items: any[]) {
    const errors: string[] = [];
    
    for (const item of items) {
      const stockRecord = await this.clientStockRepository.findOne({
        where: { clientId, productId: item.productId }
      });
      
      if (!stockRecord) {
        errors.push(`Product ${item.productId} not available in client stock`);
      } else if (stockRecord.quantity < item.quantity) {
        errors.push(`Insufficient stock for product ${item.productId}: available ${stockRecord.quantity}, requested ${item.quantity}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async deductStock(queryRunner: any, clientId: number, productId: number, quantity: number, salesrepId: number) {
    const stockRecord = await queryRunner.manager.findOne(ClientStock, {
      where: { clientId, productId }
    });
    
    if (!stockRecord) {
      throw new Error(`Stock record not found for client ${clientId}, product ${productId}`);
    }
    
    if (stockRecord.quantity < quantity) {
      throw new Error(`Insufficient stock: available ${stockRecord.quantity}, requested ${quantity}`);
    }
    
    const previousStock = stockRecord.quantity;
    stockRecord.quantity -= quantity;
    stockRecord.salesrepId = salesrepId;
    
    await queryRunner.manager.save(ClientStock, stockRecord);
    
    // Log the transaction
    await this.outletQuantityTransactionsService.logSaleTransaction(
      clientId,
      productId,
      quantity,
      previousStock,
      stockRecord.quantity,
      0, // Will be updated after sale is created
      salesrepId,
      'Sale made'
    );
  }

  async restoreStock(queryRunner: any, clientId: number, productId: number, quantity: number, salesrepId: number) {
    const stockRecord = await queryRunner.manager.findOne(ClientStock, {
      where: { clientId, productId }
    });
    
    if (!stockRecord) {
      throw new Error(`Stock record not found for client ${clientId}, product ${productId}`);
    }
    
    const previousStock = stockRecord.quantity;
    stockRecord.quantity += quantity;
    stockRecord.salesrepId = salesrepId;
    
    await queryRunner.manager.save(ClientStock, stockRecord);
    
    // Log the void transaction
    await this.outletQuantityTransactionsService.logVoidTransaction(
      clientId,
      productId,
      quantity,
      previousStock,
      stockRecord.quantity,
      0, // Will be updated after void is processed
      salesrepId,
      'Sale voided'
    );
  }

  async create(createUpliftSaleDto: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('🔄 Creating Uplift Sale with data:', JSON.stringify(createUpliftSaleDto, null, 2));
      
      // Extract items and calculate totals
      const { items, ...saleData } = createUpliftSaleDto;
      
      // Validate stock availability first
      if (items && items.length > 0) {
        const stockValidation = await this.validateStock(saleData.clientId, items);
        if (!stockValidation.isValid) {
          throw new Error(`Insufficient stock: ${stockValidation.errors.join(', ')}`);
        }
      }
      
      // Calculate total amount if not provided
      let totalAmount = saleData.totalAmount || 0;
      if (items && items.length > 0) {
        totalAmount = items.reduce((sum: number, item: any) => {
          const itemTotal = (item.unitPrice || 0) * (item.quantity || 0);
          return sum + itemTotal;
        }, 0);
      }
      
      console.log('📊 Calculated total amount:', totalAmount);
      
      // Create the uplift sale
      const upliftSale = this.upliftSaleRepository.create({
        ...saleData,
        totalAmount: totalAmount,
        status: 1, // Active sale
      });
      
      const savedSale = await queryRunner.manager.save(UpliftSale, upliftSale);
      const saleEntity = Array.isArray(savedSale) ? savedSale[0] : savedSale;
      console.log('✅ Uplift sale created with ID:', saleEntity.id);
      
      // Create uplift sale items and deduct stock
      if (items && items.length > 0) {
        console.log('📦 Starting to create ${items.length} uplift sale items and deduct stock...');
        
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          try {
            const itemTotal = (item.unitPrice || 0) * (item.quantity || 0);
            console.log(`📦 Processing item ${i + 1}/${items.length}:`, {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              calculatedTotal: itemTotal,
            });
            
            // Create uplift sale item
            const upliftSaleItem = this.upliftSaleItemRepository.create({
              upliftSaleId: saleEntity.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: itemTotal,
            });
            
            await queryRunner.manager.save(UpliftSaleItem, upliftSaleItem);
            console.log(`✅ Uplift sale item ${i + 1} saved`);
            
            // Deduct stock from client stock
            await this.deductStock(
              queryRunner,
              saleData.clientId,
              item.productId,
              item.quantity,
              saleData.userId
            );
            console.log(`📉 Stock deducted for product ${item.productId}`);
            
          } catch (itemError) {
            console.error(`❌ Error processing item ${i + 1}:`, itemError);
            throw new Error(`Failed to process item: ${itemError.message}`);
          }
        }
        
        console.log('✅ All uplift sale items created and stock deducted successfully');
      } else {
        console.log('⚠️ No items provided for uplift sale');
      }
      
      await queryRunner.commitTransaction();
      console.log('✅ Transaction committed successfully');
      
      // Return the complete uplift sale with items
      return this.findOne(saleEntity.id);
    } catch (error) {
      console.error('❌ Error creating uplift sale:', error);
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed to create uplift sale: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateUpliftSaleDto: any) {
    try {
      await this.upliftSaleRepository.update(id, updateUpliftSaleDto);
      return this.findOne(id);
    } catch (error) {
      console.error('Error updating uplift sale:', error);
      throw new Error('Failed to update uplift sale');
    }
  }

  async voidSale(id: number, reason: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log(`🔄 Voiding Uplift Sale ${id} with reason: ${reason}`);
      
      // Get the sale with items
      const sale = await this.findOne(id);
      if (!sale) {
        throw new Error('Uplift sale not found');
      }
      
      if (sale.status === 0) {
        throw new Error('Sale is already voided');
      }
      
      // Restore stock for each item
      if (sale.upliftSaleItems && sale.upliftSaleItems.length > 0) {
        console.log(`📦 Restoring stock for ${sale.upliftSaleItems.length} items...`);
        
        for (const item of sale.upliftSaleItems) {
          try {
            await this.restoreStock(
              queryRunner,
              sale.clientId,
              item.productId,
              item.quantity,
              sale.userId
            );
            console.log(`📈 Stock restored for product ${item.productId}`);
          } catch (error) {
            console.error(`❌ Error restoring stock for product ${item.productId}:`, error);
            throw error;
          }
        }
        
        console.log('✅ All stock restored successfully');
      }
      
      // Update sale status to voided
      await queryRunner.manager.update(UpliftSale, id, {
        status: 0,
        comment: reason,
        updatedAt: new Date()
      });
      
      await queryRunner.commitTransaction();
      console.log('✅ Sale voided successfully');
      
      return this.findOne(id);
    } catch (error) {
      console.error('❌ Error voiding uplift sale:', error);
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed to void uplift sale: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    try {
      await this.upliftSaleRepository.delete(id);
      return { message: 'Uplift sale deleted successfully' };
    } catch (error) {
      console.error('Error deleting uplift sale:', error);
      throw new Error('Failed to delete uplift sale');
    }
  }
} 