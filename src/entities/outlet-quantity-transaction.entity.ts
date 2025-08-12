import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Clients } from './clients.entity';
import { Product } from '../products/entities/product.entity';

@Entity('outlet_quantity_transactions')
@Index('outlet_quantity_transactions_clientId_idx', ['clientId'])
@Index('outlet_quantity_transactions_productId_idx', ['productId'])
@Index('outlet_quantity_transactions_transactionType_idx', ['transactionType'])
@Index('outlet_quantity_transactions_transactionDate_idx', ['transactionDate'])
@Index('outlet_quantity_transactions_referenceId_idx', ['referenceId'])
export class OutletQuantityTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'clientId', type: 'int' })
  clientId: number;

  @Column({ name: 'productId', type: 'int' })
  productId: number;

  @Column({
    name: 'transactionType',
    type: 'enum',
    enum: ['sale', 'return', 'stock_adjustment', 'void'],
  })
  transactionType: 'sale' | 'return' | 'stock_adjustment' | 'void';

  @Column({ name: 'quantity', type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ name: 'previousStock', type: 'decimal', precision: 10, scale: 2, default: 0 })
  previousStock: number;

  @Column({ name: 'newStock', type: 'decimal', precision: 10, scale: 2, default: 0 })
  newStock: number;

  @Column({ name: 'referenceId', type: 'int', nullable: true })
  referenceId: number;

  @Column({ name: 'referenceType', type: 'varchar', length: 50, nullable: true })
  referenceType: string;

  @Column({ name: 'transactionDate', type: 'datetime' })
  transactionDate: Date;

  @Column({ name: 'userId', type: 'int' })
  userId: number;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => Clients, client => client.id)
  @JoinColumn({ name: 'clientId' })
  client: Clients;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
