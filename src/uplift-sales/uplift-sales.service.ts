import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
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

  async findAll(query: any, requestUser?: any) {
    try {
      console.log('🔍 Uplift Sales Query Parameters:', query);
      console.log('👤 Request User:', requestUser);
      
      // Get userId from query parameter or from JWT token
      let userId: number;
      
      if (query.userId) {
        // If userId is provided in query, use it
        userId = parseInt(query.userId);
        if (isNaN(userId)) {
          throw new Error('Invalid userId: must be a valid number');
        }
      } else if (requestUser && requestUser.id) {
        // If no userId in query, get it from JWT token
        userId = parseInt(requestUser.id);
        if (isNaN(userId)) {
          throw new Error('Invalid user ID in token');
        }
        console.log('👤 Using userId from JWT token:', userId);
      } else {
        console.log('❌ No userId in query and no user in request:', { query, requestUser });
        throw new Error('userId parameter is required or user must be authenticated');
      }

      const queryBuilder = this.upliftSaleRepository.createQueryBuilder('upliftSale')
        .leftJoinAndSelect('upliftSale.client', 'client')
        .leftJoinAndSelect('upliftSale.user', 'user')
        .leftJoinAndSelect('upliftSale.upliftSaleItems', 'items')
        .leftJoinAndSelect('items.product', 'product');

      console.log('👤 Filtering by userId:', userId, 'Type:', typeof userId);
      queryBuilder.where('upliftSale.userId = :userId', { userId });

      if (query.status) {
        queryBuilder.andWhere('upliftSale.status = :status', { status: query.status });
      }

      if (query.startDate) {
        queryBuilder.andWhere('upliftSale.createdAt >= :startDate', { startDate: query.startDate });
      }

      if (query.endDate) {
        queryBuilder.andWhere('upliftSale.createdAt <= :endDate', { endDate: query.endDate });
      }

      // Log the generated SQL query for debugging
      const sql = queryBuilder.getSql();
      console.log('🔍 Generated SQL Query:', sql);
      console.log('🔍 Query Parameters:', queryBuilder.getParameters());
      
      const result = await queryBuilder.orderBy('upliftSale.createdAt', 'DESC').getMany();
      console.log(`📊 Found ${result.length} uplift sales for userId: ${userId}`);
      
      // Log first few results to verify filtering
      if (result.length > 0) {
        console.log('📋 First 3 results userId values:', result.slice(0, 3).map(sale => sale.userId));
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching uplift sales:', error);
      throw new Error(`Failed to fetch uplift sales: ${error.message}`);
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
    // ✅ FIX: Batch load all stock records to avoid N+1 query
    // BEFORE: N queries (1 per item) - 50 items = 50 queries
    // AFTER: 1 query with IN clause (98% reduction!)
    const productIds = items.map(item => item.productId);
    
    // Single batch query for all stock records
    const stockRecords = await this.clientStockRepository.find({
      where: { 
        clientId, 
        productId: In(productIds) 
      }
    });
    
    // Create O(1) lookup map for efficient access
    const stockMap = new Map(
      stockRecords.map(record => [record.productId, record])
    );
    
    const errors: string[] = [];
    
    for (const item of items) {
      const stockRecord = stockMap.get(item.productId);
      
      if (!stockRecord) {
        errors.push(`Product ${item.productId} not available in client stock`);
      } else if (stockRecord.quantity < item.quantity) {
        errors.push(`Insufficient stock for product ${item.productId}: available ${stockRecord.quantity}, requested ${item.quantity}`);
      }
    }
    
    console.log(`✅ Stock validation completed: ${items.length} items checked with 1 query (batch optimized)`);
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async deductStock(queryRunner: any, clientId: number, productId: number, quantity: number, salesrepId: number) {
    console.log(`📉 Deducting stock: clientId=${clientId}, productId=${productId}, quantity=${quantity}`);
    
    try {
      // Add timeout to prevent hanging
      const stockRecord = await Promise.race([
        queryRunner.manager.findOne(ClientStock, {
          where: { clientId, productId },
          lock: { mode: 'pessimistic_write' } // Add row-level locking
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Stock lookup timeout')), 10000)
        )
      ]) as ClientStock;
      
      if (!stockRecord) {
        throw new Error(`Stock record not found for client ${clientId}, product ${productId}`);
      }
      
      if (stockRecord.quantity < quantity) {
        throw new Error(`Insufficient stock: available ${stockRecord.quantity}, requested ${quantity}`);
      }
      
      const previousStock = stockRecord.quantity;
      stockRecord.quantity -= quantity;
      stockRecord.salesrepId = salesrepId;
      
      // Save with timeout
      await Promise.race([
        queryRunner.manager.save(ClientStock, stockRecord),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Stock save timeout')), 10000)
        )
      ]);
      
      console.log(`✅ Stock deducted successfully: ${previousStock} -> ${stockRecord.quantity}`);
      
      // Log the transaction asynchronously to prevent blocking
      // Don't await this to prevent hanging - it will be logged after the main transaction
      this.logSaleTransactionAsync(
        clientId,
        productId,
        quantity,
        previousStock,
        stockRecord.quantity,
        0, // Will be updated after sale is created
        salesrepId,
        'Sale made'
      ).catch(error => {
        console.error('⚠️ Failed to log transaction (non-blocking):', error.message);
      });
      
    } catch (error) {
      console.error(`❌ Error deducting stock for client ${clientId}, product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Log sale transaction asynchronously to prevent blocking the main transaction
   */
  private async logSaleTransactionAsync(
    clientId: number,
    productId: number,
    quantity: number,
    previousBalance: number,
    newBalance: number,
    referenceId: number,
    userId: number,
    notes: string
  ) {
    try {
      console.log(`📝 Logging transaction async for client ${clientId}, product ${productId}`);
      
      // Use a separate query runner for logging to avoid transaction conflicts
      const logQueryRunner = this.dataSource.createQueryRunner();
      await logQueryRunner.connect();
      
      try {
        await logQueryRunner.startTransaction();
        
        // Log the transaction with timeout
        await Promise.race([
          this.outletQuantityTransactionsService.logSaleTransaction(
            clientId,
            productId,
            quantity,
            previousBalance,
            newBalance,
            referenceId,
            userId,
            notes
          ),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Transaction logging timeout')), 5000)
          )
        ]);
        
        await logQueryRunner.commitTransaction();
        console.log(`✅ Transaction logged successfully for client ${clientId}, product ${productId}`);
      } catch (error) {
        await logQueryRunner.rollbackTransaction();
        throw error;
      } finally {
        await logQueryRunner.release();
      }
    } catch (error) {
      console.error(`❌ Failed to log transaction for client ${clientId}, product ${productId}:`, error.message);
      // Don't throw - this is a non-blocking operation
    }
  }

  async restoreStock(queryRunner: any, clientId: number, productId: number, quantity: number, salesrepId: number) {
    console.log(`📈 Restoring stock: clientId=${clientId}, productId=${productId}, quantity=${quantity}`);
    
    try {
      // Add timeout to prevent hanging
      const stockRecord = await Promise.race([
        queryRunner.manager.findOne(ClientStock, {
          where: { clientId, productId },
          lock: { mode: 'pessimistic_write' } // Add row-level locking
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Stock lookup timeout')), 10000)
        )
      ]) as ClientStock;
      
      if (!stockRecord) {
        throw new Error(`Stock record not found for client ${clientId}, product ${productId}`);
      }
      
      const previousStock = stockRecord.quantity;
      stockRecord.quantity += quantity;
      stockRecord.salesrepId = salesrepId;
      
      // Save with timeout
      await Promise.race([
        queryRunner.manager.save(ClientStock, stockRecord),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Stock save timeout')), 10000)
        )
      ]);
      
      console.log(`✅ Stock restored successfully: ${previousStock} -> ${stockRecord.quantity}`);
      
      // Log the void transaction asynchronously to prevent blocking
      this.logVoidTransactionAsync(
        clientId,
        productId,
        quantity,
        previousStock,
        stockRecord.quantity,
        0, // Will be updated after void is processed
        salesrepId,
        'Sale voided'
      ).catch(error => {
        console.error('⚠️ Failed to log void transaction (non-blocking):', error.message);
      });
      
    } catch (error) {
      console.error(`❌ Error restoring stock for client ${clientId}, product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Log void transaction asynchronously to prevent blocking the main transaction
   */
  private async logVoidTransactionAsync(
    clientId: number,
    productId: number,
    quantity: number,
    previousBalance: number,
    newBalance: number,
    referenceId: number,
    userId: number,
    notes: string
  ) {
    try {
      console.log(`📝 Logging void transaction async for client ${clientId}, product ${productId}`);
      
      // Use a separate query runner for logging to avoid transaction conflicts
      const logQueryRunner = this.dataSource.createQueryRunner();
      await logQueryRunner.connect();
      
      try {
        await logQueryRunner.startTransaction();
        
        // Log the transaction with timeout
        await Promise.race([
          this.outletQuantityTransactionsService.logVoidTransaction(
            clientId,
            productId,
            quantity,
            previousBalance,
            newBalance,
            referenceId,
            userId,
            notes
          ),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Void transaction logging timeout')), 5000)
          )
        ]);
        
        await logQueryRunner.commitTransaction();
        console.log(`✅ Void transaction logged successfully for client ${clientId}, product ${productId}`);
      } catch (error) {
        await logQueryRunner.rollbackTransaction();
        throw error;
      } finally {
        await logQueryRunner.release();
      }
    } catch (error) {
      console.error(`❌ Failed to log void transaction for client ${clientId}, product ${productId}:`, error.message);
      // Don't throw - this is a non-blocking operation
    }
  }

  async create(createUpliftSaleDto: any) {
    console.log('🚀 Starting uplift sale creation with timeout protection...');
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Add overall timeout for the entire operation (2 minutes)
      const result = await Promise.race([
        this.performCreateOperation(queryRunner, createUpliftSaleDto),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Uplift sale creation timeout after 2 minutes')), 120000)
        )
      ]);
      
      return result;
    } catch (error) {
      console.error('❌ Error in uplift sale creation:', error);
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed to create uplift sale: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  private async performCreateOperation(queryRunner: any, createUpliftSaleDto: any) {
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
        console.log(`📦 Starting to create ${items.length} uplift sale items and deduct stock...`);
        
        // OPTIMIZATION: Batch create all items first
        const upliftSaleItems = items.map(item => {
          const itemTotal = (item.unitPrice || 0) * (item.quantity || 0);
          return this.upliftSaleItemRepository.create({
            upliftSaleId: saleEntity.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: itemTotal,
          });
        });
        
        // Batch save all items at once
        await queryRunner.manager.save(UpliftSaleItem, upliftSaleItems);
        console.log(`✅ All ${items.length} uplift sale items saved in batch`);
        
        // OPTIMIZATION: Batch deduct stock for all items with proper error handling
        console.log(`📉 Starting batch stock deduction for ${items.length} products...`);
        
        const stockDeductions = items.map(async (item, index) => {
          try {
            console.log(`📉 Processing item ${index + 1}/${items.length}: productId=${item.productId}, quantity=${item.quantity}`);
            await this.deductStock(
              queryRunner,
              saleData.clientId,
              item.productId,
              item.quantity,
              saleData.userId
            );
            console.log(`✅ Item ${index + 1} processed successfully`);
          } catch (error) {
            console.error(`❌ Failed to process item ${index + 1} (productId=${item.productId}):`, error.message);
            throw error; // Re-throw to stop the entire operation
          }
        });
        
        // Use Promise.allSettled to get detailed results but still fail fast on errors
        const results = await Promise.allSettled(stockDeductions);
        
        // Check if any operations failed
        const failures = results.filter(result => result.status === 'rejected');
        if (failures.length > 0) {
          const errorMessages = failures.map(failure => 
            failure.status === 'rejected' ? failure.reason.message : 'Unknown error'
          );
          throw new Error(`Stock deduction failed for ${failures.length} items: ${errorMessages.join(', ')}`);
        }
        
        console.log(`📉 Stock deducted successfully for all ${items.length} products`);
        
        console.log('✅ All uplift sale items created and stock deducted successfully');
      } else {
        console.log('⚠️ No items provided for uplift sale');
      }
      
      await queryRunner.commitTransaction();
      console.log('✅ Transaction committed successfully');
      
      // Return the complete uplift sale with items
      return this.findOne(saleEntity.id);
    } catch (error) {
      console.error('❌ Error in performCreateOperation:', error);
      await queryRunner.rollbackTransaction();
      throw error;
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