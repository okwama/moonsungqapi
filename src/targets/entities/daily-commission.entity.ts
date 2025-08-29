import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SalesRep } from '../../entities/sales-rep.entity';

@Entity('daily_commissions')
export class DailyCommission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sales_rep_id', type: 'int', nullable: false })
  salesRepId: number;

  @Column({ name: 'commission_date', type: 'date', nullable: false })
  commissionDate: Date;

  @Column({ name: 'daily_sales_amount', type: 'decimal', precision: 15, scale: 2, nullable: false })
  dailySalesAmount: number;

  @Column({ name: 'commission_amount', type: 'decimal', precision: 10, scale: 2, nullable: false })
  commissionAmount: number;

  @Column({ name: 'commission_tier', length: 100, nullable: false })
  commissionTier: string;

  @Column({ name: 'sales_count', type: 'int', default: 0 })
  salesCount: number;

  @Column({ name: 'status', length: 20, default: 'pending' })
  status: string; // pending, approved, paid

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => SalesRep, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sales_rep_id' })
  salesRep: SalesRep;
}
