import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { SalesRep } from './sales-rep.entity';
import { AssetRequestItem } from './asset-request-item.entity';

@Entity('asset_requests')
@Index('AssetRequest_salesRepId_fkey', ['salesRepId'])
@Index('AssetRequest_approvedBy_fkey', ['approvedBy'])
@Index('AssetRequest_assignedBy_fkey', ['assignedBy'])
export class AssetRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  requestNumber: string;

  @Column()
  salesRepId: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  requestDate: Date;

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'approved', 'rejected', 'assigned', 'returned'], 
    default: 'pending' 
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  approvedBy: number;

  @Column({ type: 'datetime', nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  assignedBy: number;

  @Column({ type: 'datetime', nullable: true })
  assignedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  returnDate: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ 
    type: 'datetime', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updatedAt: Date;

  @ManyToOne(() => SalesRep, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salesRepId' })
  salesRep: SalesRep;

  @ManyToOne(() => SalesRep, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approvedBy' })
  approver: SalesRep;

  @ManyToOne(() => SalesRep, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedBy' })
  assigner: SalesRep;

  @OneToMany(() => AssetRequestItem, assetRequestItem => assetRequestItem.assetRequest)
  items: AssetRequestItem[];
}
