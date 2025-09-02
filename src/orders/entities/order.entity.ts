import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Clients } from '../../entities/clients.entity';
import { OrderItem } from './order-item.entity';
import { Users } from '../../users/entities/users.entity';

@Entity('sales_orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'so_number', length: 20, unique: true })
  soNumber: string;

  @Column({ name: 'client_id', type: 'int' })
  clientId: number;

  @Column({ name: 'order_date', type: 'date' })
  orderDate: Date;

  @Column({ name: 'expected_delivery_date', type: 'date', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ name: 'subtotal', type: 'decimal', precision: 15, scale: 2, nullable: true })
  subtotal: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 2, nullable: true })
  taxAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalAmount: number;

  @Column({ name: 'net_price', type: 'decimal', precision: 11, scale: 2 })
  netPrice: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy: number;

  @Column({ name: 'salesrep', type: 'int', nullable: true })
  salesrep: number;

  @Column({ name: 'rider_id', type: 'int', nullable: true })
  riderId: number;

  @Column({ name: 'assigned_at', type: 'timestamp', nullable: true })
  assignedAt: Date;

  @Column({ type: 'enum', enum: ['draft', 'confirmed', 'shipped', 'delivered', 'cancelled', 'in_payment', 'paid'], default: 'draft' })
  status: string;

  @Column({ name: 'my_status', type: 'tinyint' })
  myStatus: number;

  @Column({ name: 'received_into_stock', type: 'tinyint', default: 0 })
  receivedIntoStock: boolean;

  @Column({ name: 'received_at', type: 'timestamp', nullable: true })
  receivedAt: Date;

  @ManyToOne(() => Users, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  user: Users;

  @ManyToOne(() => Clients)
  @JoinColumn({ name: 'client_id' })
  client: Clients;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
} 