import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('commission_configs')
export class CommissionConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tier_name', length: 100, nullable: false })
  tierName: string;

  @Column({ name: 'min_amount', type: 'decimal', precision: 15, scale: 2, nullable: false })
  minAmount: number;

  @Column({ name: 'max_amount', type: 'decimal', precision: 15, scale: 2, nullable: true })
  maxAmount: number;

  @Column({ name: 'commission_amount', type: 'decimal', precision: 10, scale: 2, nullable: false })
  commissionAmount: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

